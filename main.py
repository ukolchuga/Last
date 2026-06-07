import os
import json
import base64
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
import google.generativeai as genai
import sqlite3
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "notarity.db")

@app.get("/")
async def read_index():
    return FileResponse(os.path.join(BASE_DIR, 'index.html'))

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-3.1-flash-lite")

COUNTRY_MAPPING = {
    "usa": "United States of America",
    "united states": "United States of America",
    "uk": "United Kingdom",
    "uae": "United Arab Emirates",
    "russia": "Russian Federation",
    "vatican": "Holy See (Vatican City State)",
    "south korea": "South Korea",
    "north korea": "North Korea",
    "china": "People's Republic of China",
    "vietnam": "Vietnam",
    "iran": "Islamic Republic of Iran",
    "moldova": "Moldova, Republic of",
    "taiwan": "Taiwan, Province of China",
    "macedonia": "The Republic of North Macedonia",
    "czechia": "Czech Republic",
    "holland": "Netherlands",
}

def get_normalized_country(name: str):
    if not name:
        return None
    name_lower = name.lower().strip()
    return COUNTRY_MAPPING.get(name_lower, name.title())

def get_services_from_db(country_name: str):
    try:
        normalized_name = get_normalized_country(country_name)
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        query = """
        SELECT s.type, s.description
        FROM services s
        JOIN country_services cs ON s.id = cs.service_id
        JOIN countries c ON cs.country_id = c.id
        WHERE LOWER(c.name) = LOWER(?)
        """
        cursor.execute(query, (normalized_name,))
        rows = cursor.fetchall()
        conn.close()

        return [{"title": row[0], "description": row[1], "baseFee": 0} for row in rows]
    except Exception as e:
        print(f"Database error: {e}")
        return []

@app.get("/api/countries")
async def get_countries():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT name FROM countries ORDER BY name ASC")
        rows = cursor.fetchall()
        conn.close()
        return [row[0] for row in rows]
    except Exception as e:
        print(f"Database error: {e}")
        return []

@app.get("/api/services")
async def get_services(country: str):
    return get_services_from_db(country)

@app.get("/booking-form/slug")
async def get_booking_form():
    return {
        "id": "stub-booking-form-id",
        "_company": "stub-company-id",
        "pages": []
    }

@app.get("/appointment-requests/timeslots")
async def get_timeslots():
    return [
        {
            "id": "slot-1",
            "startTime": "2026-06-08T09:00:00.000Z",
            "endTime": "2026-06-08T09:10:00.000Z",
            "available": 1
        }
    ]

@app.post("/appointment-requests/price")
async def calculate_price():
    return [
        {"name": "Stub Product", "pricePerUnit": 1000, "net": 1000, "identifier": 1}
    ]

import httpx

ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

@app.post("/ai/process-voice")
async def process_voice(file: UploadFile = File(...)):
    if not ELEVENLABS_API_KEY:
        raise HTTPException(status_code=500, detail="ElevenLabs API Key not configured.")

    try:
        audio_content = await file.read()
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.elevenlabs.io/v1/speech-to-text",
                headers={"xi-api-key": ELEVENLABS_API_KEY},
                files={"file": (file.filename, audio_content, file.content_type)},
                data={"model_id": "scribe_v1"}
            )
            
            if response.status_code != 200:
                print(f"ElevenLabs Error: {response.text}")
                raise HTTPException(status_code=response.status_code, detail="STT processing failed.")
            
            transcription = response.json().get("text", "")
            print(f"Transcribed voice: {transcription}")

        extraction_prompt = (
            "You are a data extraction expert. Extract billing and contact information from the provided transcribed text. "
            "Return ONLY a JSON object with these keys: "
            "firstName, lastName, email, phone, address, city, zip, country, companyName, vatNumber. "
            "If a field is not found, use an empty string. "
            f"\n\nText: {transcription}"
        )

        gemini_response = model.generate_content(extraction_prompt)
        extracted_data = json.loads(gemini_response.text.replace("```json", "").replace("```", "").strip())

        return {
            "transcription": transcription,
            "data": extracted_data
        }

    except Exception as e:
        print(f"Error processing voice: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/analyze-document")
async def analyze_document(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        content = await file.read()
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT DISTINCT type, description FROM services")
        all_services = [{"title": row[0], "description": row[1]} for row in cursor.fetchall()]
        conn.close()

        services_desc_str = "\n".join([f"- {s['title']}: {s['description']}" for s in all_services])

        prompt = (
            "Analyze this document and determine the destination country for notarization. "
            "The 'destination country' is the country where the notarized document will be physically used or submitted (e.g., for a bank, embassy, or local authority).\n\n"
            "Also, suggest the most relevant notarization services from the list below.\n\n"
            "SERVICE LIST:\n" + services_desc_str + "\n\n"
            "Return ONLY a JSON object with:\n"
            "- 'destinationCountry': full name of the country\n"
            "- 'explanation': A brief, friendly explanation for the user. Mention why you picked this country based on document clues (names, addresses, languages, laws) and why these services fit best.\n"
            "- 'recommendedServices': array of service titles (strings) from the list above that best match the document. If no specific service fits better than others, return an empty array.\n\n"
            "If unsure about the country, suggest the most likely one and explain your uncertainty."
        )

        response = model.generate_content([
            prompt,
            {
                "mime_type": "application/pdf",
                "data": content
            }
        ])

        text = response.text.replace("```json", "").replace("```", "").strip()
        ai_result = json.loads(text)
        country = ai_result.get("destinationCountry")
        explanation = ai_result.get("explanation", "")
        recommended_titles = ai_result.get("recommendedServices", [])

        print(f"AI predicted country: {country}")
        print(f"AI recommended services: {recommended_titles}")

        all_country_services = get_services_from_db(country)

        products = []
        if recommended_titles:
            service_map = {s["title"]: s for s in all_country_services}
            for title in recommended_titles:
                if title in service_map:
                    products.append(service_map[title])
        
        if not products:
            products = all_country_services

        return {
            "destinationCountry": country,
            "explanation": explanation,
            "products": products
        }

    except Exception as e:
        print(f"Error analyzing document: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/ai/chat")
async def chat(data: dict):
    message = data.get("message")
    history = data.get("history", [])
    if not message:
        raise HTTPException(status_code=400, detail="Message is required.")

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("SELECT type, description FROM services")
        all_services = [{"title": row[0], "description": row[1]} for row in cursor.fetchall()]
        
        cursor.execute("""
            SELECT c.name, s.type 
            FROM countries c 
            JOIN country_services cs ON c.id = cs.country_id 
            JOIN services s ON cs.service_id = s.id
        """)
        mappings = cursor.fetchall()
        availability_map = {}
        for c_name, s_type in mappings:
            if c_name not in availability_map:
                availability_map[c_name] = []
            availability_map[c_name].append(s_type)
        conn.close()

        services_desc_str = "\n".join([f"- {s['title']}: {s['description']}" for s in all_services])
        availability_str = "\n".join([f"{c}: {', '.join(services)}" for c, services in availability_map.items()])

        prompt = (
            "You are a helpful AI notary assistant for Notarity. "
            "Your goal is to help the user find the right notarization service.\n\n"
            "STRICT RULES:\n"
            "1. You MUST determine the 'destinationCountry'. The 'destination country' is the country where the notarized document will be physically used or submitted (e.g., for a bank, embassy, or local authority).\n"
            "2. If you don't know the country, ask for it politely. DO NOT provide 'recommendedServices' or 'destinationCountry' if unknown.\n"
            "3. Once you know the country, set 'destinationCountry' to its full name.\n"
            "4. DIPLOMA SPECIAL CASE: For diplomas, the best service is 'Certified copy'.\n"
            "5. REGIONAL AVAILABILITY:\n"
            "   - Below is a list of which services are available in which countries.\n"
            "   - If the user needs a service (like 'Certified copy' for a diploma) but it's NOT available in their country, you MUST say: "
            "'For your [document], a [Service] would be the best fit, but unfortunately, this service is currently not available in [Country].'\n"
            "6. RECOMMENDATION LOGIC & EXPLANATION:\n"
            "   - Return ONLY services that are actually available in the identified country.\n"
            "   - If the best service is unavailable, return an empty array for 'recommendedServices'.\n"
            "   - In the 'reply' field, ALWAYS explain your decision-making. Briefly explain what 'destination country' means, why you identified the specific country, and why you recommended certain services based on the user's situation.\n"
            "7. Return ONLY a JSON object: {'reply': '...', 'destinationCountry': '...', 'recommendedServices': [...]}.\n\n"
            "SERVICE DESCRIPTIONS:\n" + services_desc_str + "\n\n"
            "AVAILABILITY BY COUNTRY:\n" + availability_str
        )

        chat_context = []
        for h in history:
            chat_context.append(h["content"])
        chat_context.append(message)

        response = model.generate_content([prompt] + chat_context)

        text = response.text.replace("```json", "").replace("```", "").strip()
        ai_result = json.loads(text)

        reply = ai_result.get("reply")
        country = ai_result.get("destinationCountry")
        recommended_titles = ai_result.get("recommendedServices", [])

        products = []
        if country and recommended_titles:
            country_services = get_services_from_db(country)

            service_map = {s["title"]: s for s in country_services}

            for title in recommended_titles:
                if title in service_map:
                    products.append(service_map[title])
                else:
                    pass

        return {
            "reply": reply,
            "destinationCountry": country,
            "products": products
        }
    except Exception as e:
        print(f"Error in chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/products/tags")
async def get_products_by_tags(tags: List[str] = None):
    return [] 

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 3000)))
