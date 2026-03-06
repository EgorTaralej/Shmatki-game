<?php
require 'config.php';

$data = json_decode(file_get_contents("php://input"), true);
$code = $data['code'] ?? '';
$user_id = $data['user_id'] ?? 0;
$text = $data['text'] ?? '';

// Намираме стаята и името на играча
$stmt = $pdo->prepare("SELECT p.room_id, p.username FROM players p JOIN rooms r ON p.room_id = r.id WHERE r.room_code = ? AND p.id = ?");
$stmt->execute([$code, $user_id]);
$player = $stmt->fetch();

if ($player && !empty($text)) {
    $stmt = $pdo->prepare("INSERT INTO messages (room_id, username, text) VALUES (?, ?, ?)");
    $stmt->execute([$player['room_id'], $player['username'], $text]);
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}