<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$code = $data['code'] ?? '';

// 1. Намираме стаята
$stmt = $pdo->prepare("SELECT id FROM rooms WHERE room_code = ?");
$stmt->execute([$code]);
$room = $stmt->fetch();

if (!$room) exit;

// 2. Избираме случайна дума от game_words (селянин вижда думата, импостърът само категорията)
$stmt = $pdo->prepare("SELECT word, category FROM game_words ORDER BY RAND() LIMIT 1");
$stmt->execute();
$selected = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$selected) {
    echo json_encode(["error" => "No words in database. Run seed_words.sql"]);
    exit;
}

// 3. Обновяваме стаята с думата и категорията, сменяме статуса на REVEAL
$stmt = $pdo->prepare("UPDATE rooms SET status = 'reveal', secret_word = ?, category = ? WHERE id = ?");
$stmt->execute([$selected['word'], $selected['category'], $room['id']]);

// 4. ИЗБИРАНЕ НА ШМАТКА: Всички стават innocent, после един случаен става imposter
$stmt = $pdo->prepare("UPDATE players SET role = 'innocent' WHERE room_id = ?");
$stmt->execute([$room['id']]);

$stmt = $pdo->prepare("SELECT id FROM players WHERE room_id = ? ORDER BY RAND() LIMIT 1");
$stmt->execute([$room['id']]);
$imposter = $stmt->fetch();

$stmt = $pdo->prepare("UPDATE players SET role = 'imposter' WHERE id = ?");
$stmt->execute([$imposter['id']]);

echo json_encode(["success" => true]);