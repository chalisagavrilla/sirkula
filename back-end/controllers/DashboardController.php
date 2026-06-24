<?php
include_once __DIR__ . '/../models/User.php';

class DashboardController {
    private $userModel;

    public function __construct($db) {
        $this->userModel = new User($db);
    }

    public function wargaDashboard($id_warga) {
        if (empty($id_warga)) {
            return ["status" => 400, "message" => "ID Warga tidak disertakan."];
        }
        $data = $this->userModel->getWargaDashboardStats($id_warga);
        return ["status" => 200, "data" => $data];
    }

    public function pengurusDashboard($user_role) {
        if ($user_role !== 'pengurus') {
            return ["status" => 403, "message" => "Akses ditolak. Anda bukan pengurus RT/RW."];
        }
        $data = $this->userModel->getPengurusDashboardStats();
        return ["status" => 200, "data" => $data];
    }
}
?>
