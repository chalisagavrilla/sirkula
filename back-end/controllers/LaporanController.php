<?php
include_once __DIR__ . '/../models/Laporan.php';

class LaporanController {
    private $laporanModel;

    public function __construct($db) {
        $this->laporanModel = new Laporan($db);
    }

    public function kirimAduanWarga($id_warga, $post_data, $files_data) {
        if (empty($post_data['judul_laporan']) || empty($post_data['deskripsi'])) {
            return ["status" => 400, "message" => "Judul laporan dan deskripsi wajib diisi."];
        }

        $nama_file_db = null;

        if (isset($files_data['foto_bukti']) && $files_data['foto_bukti']['error'] === UPLOAD_ERR_OK) {
            $file_tmp = $files_data['foto_bukti']['tmp_name'];
            $file_name = $files_data['foto_bukti']['name'];
            
            $file_ext = strtolower(pathinfo($file_name, PATHINFO_EXTENSION));
            $file_ext = preg_replace('/[^a-z0-9]/', '', $file_ext);
            if (empty($file_ext)) {
                $file_ext = 'file';
            }

            $nama_file_baru = "bukti_" . time() . "_" . uniqid() . "." . $file_ext;
            $folder_upload = __DIR__ . "/../uploads/buktilaporan/";
            $target_direktori = $folder_upload . $nama_file_baru;

            if (!is_dir($folder_upload)) {
                mkdir($folder_upload, 0777, true);
            }

            if (move_uploaded_file($file_tmp, $target_direktori)) {
                $nama_file_db = $nama_file_baru; // Nama file inilah yang tercatat di SQL
            } else {
                return ["status" => 500, "message" => "Gagal memindahkan file bukti ke folder server."];
            }
        }

        $success = $this->laporanModel->createLaporan($id_warga, $post_data['judul_laporan'], $post_data['deskripsi'], $nama_file_db);
        if ($success) {
            return ["status" => 201, "message" => "Laporan kerusakan berhasil dikirim."];
        }
        return ["status" => 500, "message" => "Gagal menyimpan laporan ke database."];
    }

    public function getLaporanWargaList($id_warga) {
        $data = $this->laporanModel->readByWarga($id_warga);
        return ["status" => 200, "data" => $data];
    }

    public function getLaporanAdminList($user_role) {
        if ($user_role !== 'pengurus') {
            return ["status" => 403, "message" => "Akses ditolak."];
        }
        $data = $this->laporanModel->readAllForAdmin();
        return ["status" => 200, "data" => $data];
    }

    public function updateStatusAduanAdmin($id_pengurus, $user_role, $data) {
        if ($user_role !== 'pengurus') {
            return ["status" => 403, "message" => "Akses ditolak."];
        }
        if (!in_array($data->status_laporan, ['proses', 'selesai'])) {
            return ["status" => 400, "message" => "Status penanganan tidak valid."];
        }

        $success = $this->laporanModel->updateStatusLaporan($data->id_laporan, $id_pengurus, $data->status_laporan);
        if ($success) {
            return ["status" => 200, "message" => "Status penanganan laporan diperbarui menjadi: " . $data->status_laporan];
        }
        return ["status" => 500, "message" => "Gagal memperbarui data laporan."];
    }
}
?>
