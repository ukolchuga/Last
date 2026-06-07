import sqlite3
import os

def populate_countries(cursor):
    file_path = 'count.txt'
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return []

    cursor.execute('DELETE FROM countries')
    cursor.execute('DELETE FROM sqlite_sequence WHERE name="countries"')
    print("Emptied 'countries' table.")

    with open(file_path, 'r', encoding='utf-8') as f:
        countries = [line.strip() for line in f if line.strip()]

    formatted_countries = [c.title() for c in countries]

    print(f"Found {len(formatted_countries)} countries in {file_path}. Inserting...")
    cursor.executemany('INSERT INTO countries (name) VALUES (?)', [(c,) for c in formatted_countries])
    
    cursor.execute('SELECT name, id FROM countries')
    return {name: id for name, id in cursor.fetchall()}

def parse_service_file(file_path):
    services = []
    if not os.path.exists(file_path):
        print(f"Warning: {file_path} not found.")
        return services

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read().strip()

    blocks = [block.strip() for block in content.split('\n\n') if block.strip()]
    
    for block in blocks:
        lines = [line.strip() for line in block.split('\n') if line.strip()]
        if len(lines) >= 2:
            name = lines[0]
            description = " ".join(lines[1:]) 
            services.append((name, description))
    
    return services

def populate_services(cursor):
    cursor.execute('DELETE FROM services')
    cursor.execute('DELETE FROM sqlite_sequence WHERE name="services"')
    print("Emptied 'services' table.")

    at_data = parse_service_file('service_at.txt')
    spain_data = parse_service_file('service_spain.txt')
    generic_data = parse_service_file('service.txt')

    all_services_data = at_data + spain_data + generic_data

    seen_names = set()
    unique_services = []
    
    for name, desc in all_services_data:
        lower_name = name.lower()
        if lower_name not in seen_names:
            seen_names.add(lower_name)
            unique_services.append((name, desc))
    
    print(f"Found {len(unique_services)} unique services. Inserting...")
    cursor.executemany('INSERT INTO services (type, description) VALUES (?, ?)', unique_services)
    
    cursor.execute('SELECT type, id FROM services')
    return {name.lower(): id for name, id in cursor.fetchall()}

def populate_country_services(cursor, country_to_id, service_to_id):
    cursor.execute('DELETE FROM country_services')
    print("Emptied 'country_services' table.")

    at_service_names = [s[0].lower() for s in parse_service_file('service_at.txt')]
    spain_service_names = [s[0].lower() for s in parse_service_file('service_spain.txt')]
    generic_service_names = [s[0].lower() for s in parse_service_file('service.txt')]

    at_service_ids = [service_to_id[name] for name in at_service_names if name in service_to_id]
    spain_service_ids = [service_to_id[name] for name in spain_service_names if name in service_to_id]
    generic_service_ids = [service_to_id[name] for name in generic_service_names if name in service_to_id]

    relationships = []

    austria_id = country_to_id.get('Austria')
    if austria_id:
        for s_id in at_service_ids:
            relationships.append((austria_id, s_id))
    
    spain_id = country_to_id.get('Spain')
    if spain_id:
        for s_id in spain_service_ids:
            relationships.append((spain_id, s_id))

    for country_name, c_id in country_to_id.items():
        if country_name not in ['Austria', 'Spain']:
            for s_id in generic_service_ids:
                relationships.append((c_id, s_id))

    print(f"Inserting {len(relationships)} relationships into country_services...")
    cursor.executemany('INSERT INTO country_services (country_id, service_id) VALUES (?, ?)', relationships)

def main():
    db_path = 'notarity.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute('CREATE TABLE IF NOT EXISTS countries (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)')
    cursor.execute('CREATE TABLE IF NOT EXISTS services (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, description TEXT)')
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS country_services (
        country_id INTEGER,
        service_id INTEGER,
        FOREIGN KEY (country_id) REFERENCES countries (id),
        FOREIGN KEY (service_id) REFERENCES services (id),
        PRIMARY KEY (country_id, service_id)
    )
    ''')

    country_to_id = populate_countries(cursor)
    service_to_id = populate_services(cursor)
    populate_country_services(cursor, country_to_id, service_to_id)

    conn.commit()
    conn.close()
    print(f"Database {db_path} updated successfully.")

if __name__ == '__main__':
    main()
