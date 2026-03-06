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
    host_player_id INT,
    current_word VARCHAR(100),
    secret_word VARCHAR(100),
    category VARCHAR(100),
    timer_ends_at TIMESTAMP
);

-- Думи за рунда: дума + категория (за импостъра показваме само категорията "свързана с")
CREATE TABLE game_words (
    id INT PRIMARY KEY AUTO_INCREMENT,
    word VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL
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

CREATE TABLE game_events (
    id INT PRIMARY KEY AUTO_INCREMENT,
    room_id INT,
    event_type VARCHAR(50),
    payload JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
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
