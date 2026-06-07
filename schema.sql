CREATE TABLE IF NOT EXISTS countries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS country_services (
    country_id INTEGER,
    service_id INTEGER,
    FOREIGN KEY (country_id) REFERENCES countries (id),
    FOREIGN KEY (service_id) REFERENCES services (id),
    PRIMARY KEY (country_id, service_id)
);

DELETE FROM country_services;
DELETE FROM countries;
DELETE FROM services;
DELETE FROM sqlite_sequence WHERE name IN ('countries', 'services');
