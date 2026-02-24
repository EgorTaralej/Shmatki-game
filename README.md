🎭 Project: Шматки (Official Developer Guide v2.0)
"Шматки" е социална игра за дедукция и импровизация в 3D уеб среда. Всички играчи участват активно, включително този, който е избрал темата.

🛠 Технологичен Стак
Слой	Технология
Frontend	React 18 (Vite), TypeScript, Tailwind CSS
3D Engine	React Three Fiber (Three.js) + @react-three/drei
State Management	Zustand (за логиката на играта)
Backend	Pure PHP 8.x (без фреймворци)
Database	MySQL 8.0 (PDO за сигурност)
Communication	REST API + High-frequency Polling

👥 Роли и Функции
Super Admin (Глобален): Управлява платформата, профилите и следи за злоупотреби. Не участва в геймплея на стаите, освен ако не влезе като играч.
Водещ на рунда (Active Host): Един от играчите в стаята.
Преди рунда: Избира категория и дума (ръчно или от базата).
По време на рунда: Играе наравно с останалите. Получава думата (която сам е избрал) и трябва да напише своята асоциация в чата като всеки друг.
Шматката (Imposter): Един случаен играч (различен от Водещия). Не знае думата, получава 1-2 подсказки.
Останалите играчи (Innocents): Получават тайната дума и се опитват да открият Шматката.

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
    host_player_id INT, -- ID на играча, който е текущ водещ
    current_word VARCHAR(100),
    timer_ends_at TIMESTAMP
);

CREATE TABLE players (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT,
    user_id INT, -- Link to users table
    username VARCHAR(50), -- Can still keep this for display or fallback, or fetch from users JOIN
    role ENUM('innocent', 'imposter') DEFAULT 'innocent',
    is_host BOOLEAN DEFAULT 0, -- Дали е избрал думата за този рунд
    is_superadmin BOOLEAN DEFAULT 0,
    score INT DEFAULT 0,
    chat_word VARCHAR(100), -- Едната дума, която играчът пише за рунда
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
    imposter_id INT,
    secret_word VARCHAR(100),
    status ENUM('active', 'completed') DEFAULT 'active',
    winner_side ENUM('innocents', 'imposter', 'none') DEFAULT 'none',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (imposter_id) REFERENCES players(id) ON DELETE SET NULL
);

CREATE TABLE votes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    round_id INT,
    voter_id INT,
    voted_for_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (round_id) REFERENCES game_rounds(id) ON DELETE CASCADE,
    FOREIGN KEY (voter_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (voted_for_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE TABLE user_stats (
    user_id INT PRIMARY KEY,
    total_wins INT DEFAULT 0,
    total_games INT DEFAULT 0,
    imposter_wins INT DEFAULT 0,
    caught_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(255)
);

CREATE TABLE user_achievements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    achievement_id INT,
    earned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE
);



========================================================================================
🧠 Геймплей Логика (Core Loop)
Selection: Водещият (Host) избира дума.
Reveal: Всички (включително Водещият) виждат думата. Шматката вижда само подсказките.
Discussion (1 мин): ВСИЧКИ играчи (вкл. Водещият и Шматката) пишат точно по една дума в чата.
Voting: Всички гласуват за това кой според тях е Шматката.
Final Guess: Ако Шматката е разкрит, той се опитва да познае думата.

🎨 Визуални изисквания (UI/UX)
3D Маса (Center): Динамична маса за до 30 играчи.
3D Chat Bubbles: Всяка написана дума се появява като балонче над аватара на играча (Roblox style).
Split Screen: Чатът вдясно е за обща комуникация и за финализиране на думите.
Български език: Всички съобщения ("Водещият избира дума...", "Шматката се крие!", "Гласувай!") са на Български.

🚦 Инструкции за разработка (Prompt Directions)
Active Host Logic: Увери се, че host_player_id е част от масива с активни играчи и клиентът му показва същия интерфейс за писане на дума, както на останалите.
Word Validation: Да не се позволява на Водещия или играчите да изпращат дума, която е идентична с "Тайната дума".
Zustand Store: Да управлява състоянията isHost, isImposter и currentPhase.
Polling: Фронтендът трябва да проверява за промяна в room_status на всеки 1.5 секунди.

🚀 Стартиране
Генерирай api/config.php и api/game.php.
Генерирай React компонентите: Table3D.tsx, ChatOverlay.tsx, GameProvider.tsx.
Стартирай с името на играта: "Шматки".
