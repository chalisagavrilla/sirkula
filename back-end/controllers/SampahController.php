<?php
include_once __DIR__ . '/../models/Sampah.php';

class SampahController {
    private $sampahModel;

    public function __construct($db) {
        $this->sampahModel = new Sampah($db);
    }

    public function getKategoriList() {
        $data = $this->sampahModel->getKategori();
        return ["status" => 200, "data" => $data];
    }

    public function getWargaHistory($id_warga) {
        if (empty($id_warga)) {
            return ["status" => 400, "message" => "ID Warga tidak valid."];
        }
        $data = $this->sampahModel->readByWargaId($id_warga);
        return ["status" => 200, "data" => $data];
    }

    public function ajukanSetoranWarga($id_warga, $data) {
        if (empty($data->id_kategori) || empty($data->berat_kg)) {
            return ["status" => 400, "message" => "Kategori dan berat sampah harus diisi."];
        }

        $harga_per_kg = $this->sampahModel->getHargaKategori($data->id_kategori);
        $total_pendapatan = $harga_per_kg * $data->berat_kg;

        $success = $this->sampahModel->createRequest($id_warga, $data->id_kategori, $data->berat_kg, $total_pendapatan);
        if ($success) {
            return ["status" => 201, "message" => "Pengajuan setoran sampah berhasil dikirim."];
        }
        return ["status" => 500, "message" => "Gagal mengirim pengajuan."];
    }

    public function getAdminQueue($user_role) {
        if ($user_role !== 'pengurus') {
            return ["status" => 403, "message" => "Akses ditolak. Fitur khusus Pengurus."];
        }
        $data = $this->sampahModel->readAllForAdmin();
        return ["status" => 200, "data" => $data];
    }

    public function verifikasiSetoranAdmin($id_pengurus, $user_role, $data) {
        if ($user_role !== 'pengurus') {
            return ["status" => 403, "message" => "Akses ditolak. Fitur khusus Pengurus."];
        }
        if (empty($data->id_setoran) || empty($data->status_verifikasi)) {
            return ["status" => 400, "message" => "ID Setoran dan status verifikasi diperlukan."];
        }
        
        if (!in_array($data->status_verifikasi, ['diverifikasi', 'ditolak'])) {
            return ["status" => 400, "message" => "Status verifikasi tidak valid."];
        }

        $success = $this->sampahModel->updateStatus($data->id_setoran, $id_pengurus, $data->status_verifikasi);
        if ($success) {
            return ["status" => 200, "message" => "Status setoran berhasil diperbarui menjadi " . $data->status_verifikasi];
        }
        return ["status" => 500, "message" => "Gagal memperbarui verifikasi."];
    }
}
?>
