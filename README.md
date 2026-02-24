🎭 Project: Fake It Clone (Official Development Guide)Една социална игра за дедукция и импровизация. Целта е един играч (Самозванецът) да се впише в групата, без да знае тайната дума, докато останалите се опитват да го разкрият чрез действия и въпроси.🛠 Технологичен СтакСлойТехнологияFrontendReact 18+ (Vite), TypeScript, Tailwind CSSState ManagementZustand (за глобално състояние на играта)BackendPure PHP 8.x (без фреймърци)DatabaseMySQL 8.0 (PDO за сигурност)CommunicationREST API + Long Polling (или Pusher за реално време)👥 Организация на екипа (8 души)Frontend Team (3): Компоненти, Routing, Zustand състояние, API интеграция.Backend Team (2): API ендпоинти, MySQL архитектура, логика на рундовете.UI/UX Designer (1): Figma прототипи, мобилен дизайн, активи (икони, лога).QA Engineer (1): Тестване на логиката, edge cases, сигурност.Project Manager/Content (1): Trello мениджмънт, база данни с въпроси, документация.🏗️ Архитектура на базата данни (MySQL)SQL-- Основни таблици за стартиране
CREATE TABLE rooms (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_code VARCHAR(10) UNIQUE, -- 4-цифрен код за вход
    status ENUM('lobby', 'playing', 'voting', 'results') DEFAULT 'lobby',
    current_category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE players (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT,
    username VARCHAR(50),
    is_fake BOOLEAN DEFAULT 0,
    is_leader BOOLEAN DEFAULT 0,
    score INT DEFAULT 0,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- За изхвърляне на неактивни
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE questions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(50),
    task_text VARCHAR(255)
);
🧠 Пътна карта (Trello Колони & Задачи)1. Проектиране и Дизайн (Design & UX)[ ] User Flow: Диаграма на преходите (Home -> Lobby -> Game -> Voting -> Score).[ ] Figma Prototype: Мобилен интерфейс (Mobile-First дизайн).[ ] Content Pack: Списък с 100+ задачи, разделени по категории.2. Подготовка и Setup (Infrastructure)[ ] [FE] Setup на Vite + TypeScript + Tailwind.[ ] [BE] Настройка на PDO връзка с MySQL и CORS хедъри.[ ] [Git] Дефиниране на клонове: main, develop и feature/*.3. Логика на играта (Core Game Logic)[ ] Room Lifecycle: Автоматична смяна на статуса на стаята (lobby -> playing -> voting).[ ] Role Distributor: PHP функция за случаен избор на Самозванец при старт.[ ] Sync System: Механизъм за синхронизация на всички играчи (Long Polling или WebSockets).[ ] Voting Engine: Логика за обработка на гласове и определяне на победител за рунда.4. Фронтенд разработка (React)[ ] Lobby Page: Показване на списък с играчи и бутон "Start Game" за лидера.[ ] Game Page: Динамичен екран - показва думата на играчите и "ИМПРОВИЗИРАЙ" на самозванеца.[ ] Voting UI: Списък с играчи, които могат да бъдат посочени с един клик.[ ] Zustand Store: Глобално състояние: roomCode, playerID, currentRole, gameState.5. Бекенд и API (Pure PHP)[ ] create_room.php: Генерира код и вкарва запис в rooms.[ ] join_room.php: Проверява кода и добавя играч в players.[ ] get_game_state.php: Основен ендпоинт, който връща всичко за текущата секунда в стаята.[ ] submit_vote.php: Записва гласа на потребителя.6. Тестване и Полиране (QA & Final)[ ] Edge Case: Какво става, ако лидерът напусне стаята?[ ] Stress Test: Тест с 8 паралелни сесии през различни устройства.[ ] Polish: Анимации при разкриване на самозванеца.🚦 Правила за разработкаAPI First: Първо се дефинира JSON структурата на отговора, после се пише код.TS Everywhere: Всички данни в React трябва да имат дефинирани interface.No Raw SQL: В PHP се използват само prepared statements.Clean Code: Коментари на български/английски (по избор), но консистентно.🚀 Как се стартира?Backend:Настройте MySQL базата данни чрез предоставения SQL.Стартирайте локален сървър: php -S localhost:8000.Frontend:Изпълнете npm install.Стартирайте проекта: npm run dev.