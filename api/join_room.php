<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? 'Играч';
$code = $data['code'] ?? '';

// 1. Проверяваме дали стаята съществува
$stmt = $pdo->prepare("SELECT id FROM rooms WHERE room_code = ?");
$stmt->execute([$code]);
$room = $stmt->fetch();

if (!$room) {
    echo json_encode(["success" => false, "error" => "Стаята не е намерена!"]);
    exit;
}

// 2. Добавяме играча в стаята
$stmt = $pdo->prepare("INSERT INTO players (room_id, username, is_host) VALUES (?, ?, 0)");
$stmt->execute([$room['id'], $username]);
$player_id = $pdo->lastInsertId();

echo json_encode([
    "success" => true,
    "my_id" => (int)$player_id
]);