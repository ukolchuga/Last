# AI-Powered Notarity Booking (Hackathon Prototype)

This project is a wrapper around the Notarity API that uses Google Gemini to automatically detect the destination country from a PDF document and suggest relevant products.

## Setup

1.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Configure Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    GEMINI_API_KEY=your_google_gemini_api_key
    NOTARITY_API_BASE_URL=https://staging-api.notarity.com
    PORT=3000
    ```

3.  **Start the server:**
    ```bash
    python main.py
    ```

## Deployment

### Option A: Tunneling (Quickest for Hackathons)
If you want to show your local server to the world without a VPS:
1. Install [ngrok](https://ngrok.com/).
2. Run your server: `python main.py`
3. In a new terminal: `ngrok http 3005`
4. Copy the `https://...` URL and update your `index.html` fetch calls.

### Option B: Docker (Recommended for VPS)
1. Install Docker and Docker Compose on your server.
2. Clone this repo.
3. Create a `.env` file.
4. Run:
   ```bash
   docker-compose up -d --build
   ```
   *Note: Access via port 3005*

### Option C: Manual VPS Setup (Ubuntu)
1.  **Open Port 3000:** `sudo ufw allow 3000`
2.  **Install Python:** `sudo apt update && sudo apt install python3-pip`
3.  **Run with Screen/Nohup:**
    ```bash
    pip install -r requirements.txt
    nohup python3 main.py &
    ```
    Or use `gunicorn` for production:
### Option D: CI/CD with GitHub Actions (Automated)
I have added a workflow file in `.github/workflows/deploy.yml`. To enable it:

1.  **Prepare your VPS:**
    *   Place the project in a folder (e.g., `/var/www/notarity-booking`).
    *   Make sure `git` and `docker-compose` are installed.
    *   Add your `.env` file manually to that folder (CI/CD won't overwrite it for security).

2.  **Configure GitHub Secrets:**
    Go to your GitHub Repo -> **Settings** -> **Secrets and variables** -> **Actions** and add:
    *   `HOST`: Your VPS IP address.
    *   `USERNAME`: Your SSH username (e.g., `root` or `ubuntu`).
    *   `SSH_PRIVATE_KEY`: Your private SSH key (the content of `~/.ssh/id_rsa`).
    *   `PROJECT_PATH`: The full path to the project on the VPS (e.g., `/home/ubuntu/Notarity-booking`).

3.  **Push to `main`:**
    Now, every time you push code to the `main` branch, GitHub will automatically SSH into your VPS, pull the latest code, and rebuild the Docker container.

## Features

-   **AI Document Analysis:** Upload a PDF to the `/ai/analyze-document` endpoint. Gemini will analyze the text and predict the `destinationCountry`.
-   **Automated Product Selection:** The server automatically queries the Notarity API for products tagged for the predicted country (e.g., Austria or Spain).
-   **Notarity API Stubs:** Standard booking flow endpoints are stubbed for rapid prototyping:
    -   `GET /booking-form/slug`
    -   `GET /appointment-requests/timeslots`
    -   `POST /appointment-requests/price`
    -   `POST /appointment-requests`

## How it works

1.  User drops a PDF into the UI.
2.  Frontend sends the file to `server.js` (`/ai/analyze-document`).
3.  `server.js` sends the PDF data to Gemini with a prompt to extract the destination country.
4.  Gemini returns a JSON with the country code (e.g., "ES").
5.  `server.js` looks up the tags for that country and fetches products from `staging-api.notarity.com`.
6.  Frontend displays the predicted country and the list of available products with prices.
