<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$code = $data['code'] ?? '';

// 1. Намираме стаята
$stmt = $pdo->prepare("SELECT id FROM rooms WHERE room_code = ?");
$stmt->execute([$code]);
$room = $stmt->fetch();

if (!$room) exit;

// 2. Списък с примерни думи (по-късно можеш да ги вземаш от таблица в БД)
$words = [
    ["word" => "САМОЛЕТ", "cat" => "ТРАНСПОРТ"],
    ["word" => "ПИЦА", "cat" => "ХРАНА"],
    ["word" => "КУЧЕ", "cat" => "ЖИВОТНИ"],
    ["word" => "БЪЛГАРИЯ", "cat" => "ДЪРЖАВИ"],
    ["word" => "ТЕЛЕФОН", "cat" => "ТЕХНОЛОГИИ"]
];
$selected = $words[array_rand($words)];

// 3. Обновяваме стаята с думата и сменяме статуса на REVEAL
$stmt = $pdo->prepare("UPDATE rooms SET status = 'reveal', secret_word = ?, category = ? WHERE id = ?");
$stmt->execute([$selected['word'], $selected['cat'], $room['id']]);

// 4. ИЗБИРАНЕ НА ШМАТКА: Всички стават innocent, после един случаен става imposter
$stmt = $pdo->prepare("UPDATE players SET role = 'innocent' WHERE room_id = ?");
$stmt->execute([$room['id']]);

$stmt = $pdo->prepare("SELECT id FROM players WHERE room_id = ? ORDER BY RAND() LIMIT 1");
$stmt->execute([$room['id']]);
$imposter = $stmt->fetch();

$stmt = $pdo->prepare("UPDATE players SET role = 'imposter' WHERE id = ?");
$stmt->execute([$imposter['id']]);

echo json_encode(["success" => true]);