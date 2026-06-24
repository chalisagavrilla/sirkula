<?php
include_once '../../config/headers.php';

include_once '../../config/Database.php';
include_once '../../controllers/LaporanController.php';

$database = new Database();
$db = $database->getConnection();
$controller = new LaporanController($db);

$method = $_SERVER['REQUEST_METHOD'];
$id_warga = isset($_GET['id_warga']) ? $_GET['id_warga'] : null;

if ($method === 'GET') {
    $response = $controller->getLaporanWargaList($id_warga);
} elseif ($method === 'POST') {
    // Melemparkan data $_POST dan $_FILES murni ke controller
    $response = $controller->kirimAduanWarga($id_warga, $_POST, $_FILES);
} else {
    $response = ["status" => 405, "message" => "Metode tidak diizinkan."];
}

http_response_code($response['status']);
echo json_encode($response);
?>
