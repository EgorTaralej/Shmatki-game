<?php
require 'config.php';

$code = $_GET['code'] ?? '';
$user_id = $_GET['user_id'] ?? 0;

// 1. Вземаме информация за стаята
$stmt = $pdo->prepare("SELECT * FROM rooms WHERE room_code = ?");
$stmt->execute([$code]);
$room = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$room) {
    echo json_encode(["error" => "Room not found"]);
    exit;
}

// 2. Вземаме всички играчи в тази стая
$stmt = $pdo->prepare("SELECT id, username, is_host FROM players WHERE room_id = ?");
$stmt->execute([$room['id']]);
$players = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 3. Вземаме чат съобщенията
$stmt = $pdo->prepare("SELECT username, text FROM messages WHERE room_id = ? ORDER BY id ASC");
$stmt->execute([$room['id']]);
$messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

// 4. Вземаме ролята на конкретния потребител, който пита
$stmt = $pdo->prepare("SELECT role FROM players WHERE id = ?");
$stmt->execute([$user_id]);
$me = $stmt->fetch(PDO::FETCH_ASSOC);

// Сигурност: Ако си импостер, НЕ получаваш думата, а само категорията
$word = ($me && $me['role'] === 'imposter') ? null : $room['secret_word'];

echo json_encode([
    "status" => $room['status'],
    "players" => $players,
    "messages" => $messages,
    "me" => [
        "role" => $me['role'] ?? 'innocent',
        "word" => $word,
        "hint" => $room['category']
    ]
]);