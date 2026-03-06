<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? 'Играч';

// Генерираме код
$code = substr(str_shuffle("ABCDEFGHJKLMNPQRSTUVWXYZ23456789"), 0, 6);

// 1. Създаваме стаята
$stmt = $pdo->prepare("INSERT INTO rooms (room_code, status) VALUES (?, 'lobby')");
$stmt->execute([$code]);
$room_id = $pdo->lastInsertId();

// 2. Добавяме хоста
$stmt = $pdo->prepare("INSERT INTO players (room_id, username, is_host) VALUES (?, ?, 1)");
$stmt->execute([$room_id, $username]);
$player_id = $pdo->lastInsertId();

echo json_encode([
    "room_code" => $code,
    "my_id" => (int)$player_id,
    "success" => true
]);