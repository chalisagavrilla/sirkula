<?php
include_once '../../config/headers.php';
include_once '../../config/Database.php';
include_once '../../controllers/DashboardController.php';

$database = new Database();
$db = $database->getConnection();
$controller = new DashboardController($db);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $id_warga = isset($_GET['id_warga']) ? $_GET['id_warga'] : null;
    $response = $controller->wargaDashboard($id_warga);
    
    http_response_code($response['status']);
    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metode HTTP tidak diizinkan."]);
}
?>