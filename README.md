🎭 Project: Шматки (Official Developer Guide v2.0)
"Шматки" е социална игра за дедукция и импровизация, оптимизирана за мобилни устройства. Всички играчи участват активно, включително този, който е избрал темата (Active Host).
🛠 Технологичен Стак
Слой	Технология
Frontend	React 18 (Vite), TypeScript, Tailwind CSS
UI/UX	Mobile-First, Framer Motion (Анимации)
State Management	Zustand (Глобално състояние)
Backend	Pure PHP 8.x (REST API)
Database	MySQL 8.0 (PDO за сигурност)
Communication	High-frequency Polling (1.5s интервал)
👥 Роли и Функции
Super Admin (Глобален): Управлява платформата, профилите и следи за злоупотреби. Има достъп до пълната статистика.
Водещ на рунда (Active Host): Един от играчите. Избира категория/дума, но играе наравно с другите (пише асоциация в чата).
Шматката (Imposter): Един случаен играч. Не знае думата, получава само категория/подсказки.
Останалите играчи (Innocents): Виждат тайната дума и се опитват да открият Шматката.
🏗️ Архитектура на Базата Данни (MySQL)
code
SQL
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'superadmin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT 1
);

CREATE TABLE themes_library (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category_id INT,
    secret_word VARCHAR(100),
    hint_1 VARCHAR(100),
    hint_2 VARCHAR(100),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_code VARCHAR(10) UNIQUE,
    status ENUM('lobby', 'selection', 'reveal', 'discussing', 'voting', 'results') DEFAULT 'lobby',
    host_player_id INT,
    current_word VARCHAR(100),
    timer_ends_at TIMESTAMP
);

CREATE TABLE players (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT,
    user_id INT,
    username VARCHAR(50),
    role ENUM('innocent', 'imposter') DEFAULT 'innocent',
    is_host BOOLEAN DEFAULT 0,
    is_superadmin BOOLEAN DEFAULT 0,
    score INT DEFAULT 0,
    chat_word VARCHAR(100),
    voted_for_id INT,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE game_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT UNIQUE,
    max_players INT DEFAULT 8,
    voting_duration INT DEFAULT 60,
    discussion_duration INT DEFAULT 60,
    difficulty_level ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE game_rounds (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT,
    round_number INT,
    imposter_player_id INT,
    secret_word VARCHAR(100),
    category_id INT,
    status ENUM('active', 'finished') DEFAULT 'active',
    winner_side ENUM('innocents', 'imposter', 'none') DEFAULT 'none',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (imposter_player_id) REFERENCES players(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES themes_library(id) ON DELETE SET NULL
);

CREATE TABLE round_submissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    round_id INT,
    player_id INT,
    submitted_word VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (round_id) REFERENCES game_rounds(id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE TABLE votes_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    round_id INT,
    voter_id INT,
    target_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (round_id) REFERENCES game_rounds(id) ON DELETE CASCADE,
    FOREIGN KEY (voter_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (target_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE TABLE user_stats (
    user_id INT PRIMARY KEY,
    total_wins INT DEFAULT 0,
    total_games INT DEFAULT 0,
    imposter_wins INT DEFAULT 0,
    caught_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
🧠 Геймплей Логика (Core Loop)
Selection: Водещият избира тема/дума.
Reveal: Плавна анимация на картата. Селяните виждат думата, Шматката вижда хинт.
Discussion (1-2 мин): Играчите пишат асоциации в чата. Думите се появяват като "стикери" над техните имена в мрежата.
Voting: Екран за гласуване (тип Among Us).
Final Guess: Шматката се опитва да открадне победата, ако е разкрита.
🎨 Визуални изисквания (UI/UX)
Mobile-First: Използване на dvh (Dynamic Viewport Height) за избягване на проблеми с браузърните ленти.
Брандинг: Шматки-градиент (Cyan към Magenta), заоблени ъгли (2.5rem), тъмен фон.
No 3D: Изчистен 2D интерфейс с Grid система за играчите.
Език: 100% Български.
🚦 Инструкции за разработка (Prompt Directions)
Polling Engine: Бекендът трябва да е лек, за да издържи запитвания на всеки 1.5 сек от 30 играчи.
Zustand Sync: Фронтендът трябва автоматично да сменя екраните при промяна на rooms.status в БД.
Security: Скриптовете get_state.php и reveal.php трябва да проверяват стриктно user_id, за да не изтече тайната дума към Шматката през JSON отговора.
🚀 Разпределение на екипа
Екип	Основна задача
Backend 1	Управление на стаи и лоби (rooms, players).
Backend 2	Логика на рундовете и гласуването (game_rounds, votes_history).
Frontend 1	Дизайн на екраните за Вход, Лоби и Настройки (Mobile Friendly).
Frontend 2	Екран за игра, чат и анимации при разкриване на роля.
QA	Тестване на конкурентни записи в БД при едновременно гласуване.
