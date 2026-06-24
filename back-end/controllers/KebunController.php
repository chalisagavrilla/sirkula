<?php
include_once __DIR__ . '/../models/Kebun.php';

class KebunController {
    private $kebunModel;

    public function __construct($db) {
        $this->kebunModel = new Kebun($db);
    }

    public function getTanamanList() {
        $data = $this->kebunModel->readAll();
        return ["status" => 200, "data" => $data];
    }

    public function tambahTanamanAdmin($user_role, $data) {
        if ($user_role !== 'pengurus') {
            return ["status" => 403, "message" => "Akses ditolak. Fitur khusus Pengurus."];
        }
        if (empty($data->nama_tanaman) || empty($data->kategori_tanaman)) {
            return ["status" => 400, "message" => "Nama dan kategori tanaman (Sayur/Buah/Toga) wajib diisi."];
        }

        $success = $this->kebunModel->createTanaman($data->nama_tanaman, $data->kategori_tanaman, $data->tanggal_tanam, $data->perkiraan_panen);
        if ($success) {
            return ["status" => 201, "message" => "Tanaman baru berhasil dicatat di sistem."];
        }
        return ["status" => 500, "message" => "Gagal menambahkan data tanaman."];
    }

    public function updateTanamanAdmin($user_role, $data) {
        if ($user_role !== 'pengurus') {
            return ["status" => 403, "message" => "Akses ditolak."];
        }

        $success = $this->kebunModel->updateProgress($data->id_tanaman, $data->status_tanaman, $data->jumlah_stok);
        if ($success) {
            return ["status" => 200, "message" => "Status kebun berhasil diperbarui."];
        }
        return ["status" => 500, "message" => "Gagal memperbarui perkembangan kebun."];
    }
}
?>
