<?php
include_once '../../config/headers.php';

include_once '../../config/Database.php';
include_once '../../controllers/LaporanController.php';

$database = new Database();
$db = $database->getConnection();
$controller = new LaporanController($db);

$method = $_SERVER['REQUEST_METHOD'];
$user_role = isset($_SERVER['HTTP_X_USER_ROLE']) ? $_SERVER['HTTP_X_USER_ROLE'] : null;
$id_pengurus = isset($_SERVER['HTTP_X_PENGURUS_ID']) ? $_SERVER['HTTP_X_PENGURUS_ID'] : null;
$data = json_decode(file_get_contents("php://input"));

if ($method === 'GET') {
    $response = $controller->getLaporanAdminList($user_role);
} elseif ($method === 'PUT') {
    $response = $controller->updateStatusAduanAdmin($id_pengurus, $user_role, $data);
} else {
    $response = ["status" => 405, "message" => "Metode tidak diizinkan."];
}

http_response_code($response['status']);
echo json_encode($response);
?>
