import sqlite3

def setup_database():
    conn = sqlite3.connect('notarity.db')
    cursor = conn.cursor()

    # Create Countries table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS countries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
    ''')

    # Create Services table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS services (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        description TEXT
    )
    ''')

    # Create Junction Table (M:N Relationship)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS country_services (
        country_id INTEGER,
        service_id INTEGER,
        FOREIGN KEY (country_id) REFERENCES countries (id),
        FOREIGN KEY (service_id) REFERENCES services (id),
        PRIMARY KEY (country_id, service_id)
    )
    ''')

    # Clear any existing data if the tables already existed
    cursor.execute('DELETE FROM country_services')
    cursor.execute('DELETE FROM countries')
    cursor.execute('DELETE FROM services')
    cursor.execute('DELETE FROM sqlite_sequence WHERE name IN ("countries", "services")')

    conn.commit()
    conn.close()
    print("Database 'notarity.db' initialized. All data has been removed/cleared.")

if __name__ == '__main__':
    setup_database()
