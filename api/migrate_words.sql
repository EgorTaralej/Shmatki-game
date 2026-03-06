-- Миграция за съществуващи бази: добавяне на secret_word, category в rooms и таблица game_words
-- Изпълни ако вече имаш rooms без тези колони: mysql -u root shmatki_db < api/migrate_words.sql
-- (Ако колоните вече съществуват, пропусни ALTER-ите.)

ALTER TABLE rooms ADD COLUMN secret_word VARCHAR(100);
ALTER TABLE rooms ADD COLUMN category VARCHAR(100);

CREATE TABLE IF NOT EXISTS game_words (
    id INT PRIMARY KEY AUTO_INCREMENT,
    word VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL
);

-- След това изпълни seed_words.sql за да попълниш думите
-- mysql -u root shmatki_db < api/seed_words.sql
