CREATE TABLE themes_library (
    id INT PRIMARY KEY AUTO_INCREMENT,
    category VARCHAR(100),
    secret_word VARCHAR(100),
    hint_1 VARCHAR(100),
    hint_2 VARCHAR(100)
);

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'superadmin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
