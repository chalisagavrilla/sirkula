<?php
include_once '../../config/headers.php';

include_once '../../config/Database.php';
include_once '../../controllers/SampahController.php';

$database = new Database();
$db = $database->getConnection();
$controller = new SampahController($db);

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents("php://input"));

// Ambil parameter id_warga dari query URL (Contoh: /sampah.php?id_warga=5)
$id_warga = isset($_GET['id_warga']) ? $_GET['id_warga'] : null;

if ($method === 'GET') {
    // Jika ada parameter id_warga, ambil riwayat. Jika tidak, ambil daftar kategori saja.
    if ($id_warga) {
        $response = $controller->getWargaHistory($id_warga);
    } else {
        $response = $controller->getKategoriList();
    }
    http_response_code($response['status']);
    echo json_encode($response);
} elseif ($method === 'POST') {
    $response = $controller->ajukanSetoranWarga($id_warga, $data);
    http_response_code($response['status']);
    echo json_encode($response);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metode tidak diizinkan."]);
}
?>
