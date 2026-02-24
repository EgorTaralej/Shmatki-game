🎭 Project: Шматки (Official Developer Guide)
"Шматки" е социална игра за дедукция и импровизация (базирана на Fake It), реализирана в модерна 3D уеб среда. Целта е "Шматката" (Импостърът) да се вгради в групата без да знае тайната дума, докато останалите се опитват да го разкрият чрез една-единствена асоциация.

🛠 Технологичен Стак
Слой	Технология
Frontend	React 18 (Vite), TypeScript, Tailwind CSS
3D Engine	React Three Fiber (Three.js) + @react-three/drei
State Management	Zustand (за логиката на играта и UI състоянието)
Backend	Pure PHP 8.x (без фреймворци)
Database	MySQL 8.0 (PDO за сигурност)
Animations	Framer Motion (UI) + GSAP (3D)
Communication	REST API + High-frequency Polling

👥 Роли в Системата
Super Admin (Глобален): Управлява целия сайт, профилите и статута на стаите. Има достъп до "Админ Панел".
Водещ (Game Host): Един от играчите в стаята. Той избира категория и дума (ръчно или от базата). Ролята е ротационна.
Шматката (Imposter): Не знае думата. Получава 2 подсказки (hints) за темата.
Играчи (Innocents): Получават тайната дума и се опитват да разкрият Шматката.

🏗️ Архитектура на Базата Данни (MySQL)
code
SQL
-- Тайна библиотека с категории и думи
CREATE TABLE themes_library (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(100),
    secret_word VARCHAR(100),
    hint_1 VARCHAR(100),
    hint_2 VARCHAR(100)
);

-- Стаи (поддържащи до 30 души)
CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_code VARCHAR(10) UNIQUE,
    status ENUM('lobby', 'selection', 'reveal', 'discussing', 'voting', 'results') DEFAULT 'lobby',
    host_id INT,
    current_word VARCHAR(100),
    current_hints JSON,
    timer_ends_at TIMESTAMP
);

-- Играчи и техните роли
CREATE TABLE players (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT,
    username VARCHAR(50),
    role ENUM('innocent', 'imposter', 'spectator') DEFAULT 'innocent',
    is_superadmin BOOLEAN DEFAULT 0,
    score INT DEFAULT 0,
    last_word_submitted VARCHAR(100), -- Думата за чата
    voted_for_id INT,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

🧠 Пътна карта (Roadmap)
1. 3D Визуализация (The Round Table)

Dynamic Scene: Създаване на 3D кръгла маса, чийто мащаб се променя според броя играчи (3 до 30).

Avatars: Low-poly фигурки, разположени равномерно около масата.

Roblox Bubbles: Реализиране на 3D Chat Bubbles над главите на играчите чрез Html компонента на drei.
2. Геймплей Логика (Core Loops)

Phase: Selection: Водещият избира тема (ръчно писане или бутон "Случайна от БД").

Phase: Discussing: 1 минута време. Всеки играч праща точно ЕДНА дума. Тя се появява едновременно в чата (вдясно) и над главата му (3D).

Phase: Voting: Екран тип "Among Us" за посочване на Шматката.
3. Бекенд API (PHP)

create_room.php / join_room.php: Управление на достъпа.

get_game_state.php: Синхронизиращ ендпоинт (връща фаза, таймер, играчи и чат думите).

submit_action.php: Универсален вход за пращане на дума, глас или избор на тема.

🎨 Визуални изисквания и UI
Split Screen: Вляво – 3D масата с играчите; Вдясно – модерна чат система с Glassmorphism.
Език: Целият интерфейс е на БЪЛГАРСКИ.
Брандинг: Името "Шматки" трябва да е с весел, "bubbly" шрифт.
Интерактивност: При гласуване, 3D аватарът на играча трябва да трепне (animation shake).

🚦 Правила за разработка (Prompt Directions for Cursor)
API First: Дефинирай JSON структурите преди логиката.
Zustand Over Prop-Drilling: Цялото състояние на играта (gameState) се държи в един Store.
No Root usage: В логиката за "Discussing" да се добави проверка (клиентска) дали думата не съдържа корена на тайната дума.
Super Admin Power: Само потребители с is_superadmin = 1 имат достъп до admin_dashboard.php за управление на профили.
Clean 3D: Използвай Suspense за зареждане на 3D моделите и оптимизирай рендъра за 30 аватара.

🚀 Стартиране на средата
Backend: php -S localhost:8000 в папка /api.
Frontend: npm run dev в коренната папка.
DB: Импорт на shmatki_db.sql.
