<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// ДИНАМИЧНА НАСТРОЙКА НА БАЗАТА
if ($_SERVER['HTTP_HOST'] === 'localhost' || $_SERVER['HTTP_HOST'] === '127.0.0.1') {
    $host = 'localhost';
    $db   = 'shmatki_db';
    $user = 'root';
    $pass = '';
} else {
    // ТУК СЕ СЛАГАТ ДАННИТЕ ОТ ХОСТИНГА
    $host = 'sqlXXX.hosting.bg'; 
    $db   = 'tvoq_db_name';
    $user = 'tvoq_db_user';
    $pass = 'tvoq_parola';
}

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["error" => "DB Connection failed"]));
}

function getPostData() {
    return json_decode(file_get_contents("php://input"), true);
}