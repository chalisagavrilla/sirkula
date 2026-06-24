<?php
include_once '../../config/headers.php';

include_once '../../config/Database.php';
include_once '../../controllers/KebunController.php';

$database = new Database();
$db = $database->getConnection();
$controller = new KebunController($db);

$method = $_SERVER['REQUEST_METHOD'];
$user_role = isset($_SERVER['HTTP_X_USER_ROLE']) ? $_SERVER['HTTP_X_USER_ROLE'] : null;
$data = json_decode(file_get_contents("php://input"));

if ($method === 'GET') {
    $response = $controller->getTanamanList();
} elseif ($method === 'POST') {
    $response = $controller->tambahTanamanAdmin($user_role, $data);
} elseif ($method === 'PUT') {
    $response = $controller->updateTanamanAdmin($user_role, $data);
} else {
    $response = ["status" => 405, "message" => "Metode tidak diizinkan."];
}

http_response_code($response['status']);
echo json_encode($response);
?>
