<?php
include_once '../../config/headers.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    http_response_code(200);
    echo json_encode([
        "status" => 200,
        "message" => "Logout berhasil. Sesi di sisi server telah dihentikan."
    ]);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Metode HTTP tidak diizinkan."]);
}
?>