<?php
include_once __DIR__ . '/../models/Iuran.php';

class IuranController {
    private $iuranModel;

    public function __construct($db) {
        $this->iuranModel = new Iuran($db);
    }

    public function getTagihanWarga($id_warga) {
        if (empty($id_warga)) {
            return ["status" => 400, "message" => "ID Warga diperlukan."];
        }
        $data = $this->iuranModel->readByWargaId($id_warga);
        return ["status" => 200, "data" => $data];
    }

    public function bayarIuran($data) {
        if (empty($data->id_iuran) || empty($data->metode_pembayaran)) {
            return ["status" => 400, "message" => "Data pembayaran tidak lengkap."];
        }

        if (!in_array($data->metode_pembayaran, ['poin', 'transfer', 'ewallet'])) {
            return ["status" => 400, "message" => "Metode pembayaran tidak valid."];
        }

        if ($data->metode_pembayaran === 'poin') {
            $tagihan = $this->iuranModel->findById($data->id_iuran);
            if (!$tagihan) {
                return ["status" => 404, "message" => "Tagihan tidak ditemukan."];
            }
            if ($tagihan['status_bayar'] === 'lunas') {
                return ["status" => 400, "message" => "Tagihan sudah lunas."];
            }

            $saldoPoin = $this->iuranModel->getSaldoPoinWarga($tagihan['id_warga']);
            $poinDibutuhkan = (int) ceil(((float) $tagihan['jumlah_tagihan']) / 40);

            if ($saldoPoin < $poinDibutuhkan) {
                return [
                    "status" => 400,
                    "message" => "Poin belum cukup. Butuh " . $poinDibutuhkan . " poin, saldo tersedia " . $saldoPoin . " poin."
                ];
            }
        }

        $success = $this->iuranModel->updatePembayaranWarga($data->id_iuran, $data->metode_pembayaran);
        if ($success) {
            return ["status" => 200, "message" => "Pembayaran iuran berhasil diproses."];
        }
        return ["status" => 500, "message" => "Gagal memproses pembayaran. Tagihan mungkin sudah lunas."];
    }

    public function RekapIuranAdmin($user_role) {
        if ($user_role !== 'pengurus') {
            return ["status" => 403, "message" => "Akses ditolak. Fitur khusus Pengurus."];
        }
        $data = $this->iuranModel->readAllWithWarga();
        return ["status" => 200, "data" => $data];
    }

    public function buatTagihanMassal($user_role, $data) {
        if ($user_role !== 'pengurus') {
            return ["status" => 403, "message" => "Akses ditolak. Fitur khusus Pengurus."];
        }
        if (empty($data->bulan_tahun) || empty($data->jumlah_tagihan)) {
            return ["status" => 400, "message" => "Bulan/Tahun dan jumlah tagihan wajib diisi."];
        }

        $success = $this->iuranModel->generateTagihanBulanan($data->bulan_tahun, $data->jumlah_tagihan);
        if ($success) {
            return ["status" => 201, "message" => "Tagihan bulan " . $data->bulan_tahun . " berhasil dibuat untuk semua warga."];
        }
        return ["status" => 500, "message" => "Gagal membuat tagihan bulanan secara massal."];
    }
}
?>
