<?php
include_once '../../config/headers.php';

include_once '../../config/Database.php';
include_once '../../controllers/SampahController.php';

$database = new Database();
$db = $database->getConnection();
$controller = new SampahController($db);

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

$user_role = isset($_SERVER['HTTP_X_USER_ROLE']) ? $_SERVER['HTTP_X_USER_ROLE'] : null;
$id_pengurus = isset($_SERVER['HTTP_X_PENGURUS_ID']) ? $_SERVER['HTTP_X_PENGURUS_ID'] : null;

if ($method === 'GET') {
    $response = $controller->getAdminQueue($user_role);
    http_response_code($response['status']);
    echo json_encode($response);
} elseif ($method === 'PUT') {
    $response = $controller->verifikasiSetoranAdmin($id_pengurus, $user_role, $data);
    http_response_code($response['status']);
    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metode tidak diizinkan."]);
}
?>
