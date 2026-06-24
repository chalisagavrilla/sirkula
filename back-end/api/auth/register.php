<?php
include_once '../../config/headers.php';

include_once '../../config/Database.php';
include_once '../../controllers/AuthController.php';

$database = new Database();
$db = $database->getConnection();
$authController = new AuthController($db);

$data = json_decode(file_get_contents("php://input"));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $response = $authController->register($data);
    http_response_code($response['status']);
    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metode HTTP tidak diizinkan."]);
}
?>
