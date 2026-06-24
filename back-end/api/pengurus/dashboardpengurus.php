<?php
include_once '../../config/headers.php';
include_once '../../config/Database.php';
include_once '../../controllers/DashboardController.php';

$database = new Database();
$db = $database->getConnection();
$controller = new DashboardController($db);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_role = isset($_SERVER['HTTP_X_USER_ROLE']) ? $_SERVER['HTTP_X_USER_ROLE'] : null;
    $response = $controller->pengurusDashboard($user_role);
    
    http_response_code($response['status']);
    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metode HTTP tidak diizinkan."]);
}
?>