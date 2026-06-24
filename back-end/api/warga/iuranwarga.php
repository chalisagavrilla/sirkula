<?php
include_once '../../config/headers.php';

include_once '../../config/Database.php';
include_once '../../controllers/IuranController.php';

$database = new Database();
$db = $database->getConnection();
$controller = new IuranController($db);

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));
$id_warga = isset($_GET['id_warga']) ? $_GET['id_warga'] : null;

if ($method === 'GET') {
    $response = $controller->getTagihanWarga($id_warga);
    http_response_code($response['status']);
    echo json_encode($response);
} elseif ($method === 'POST') {
    $response = $controller->bayarIuran($data);
    http_response_code($response['status']);
    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metode HTTP tidak diizinkan."]);
}
?>
