<?php
class Iuran {
    private $conn;
    private $table_name = "iuran";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function readByWargaId($id_warga) {
        $query = "SELECT id_iuran, bulan_tahun, jumlah_tagihan, status_bayar, metode_pembayaran, tanggal_bayar 
                FROM " . $this->table_name . "
                WHERE id_warga = :id_warga
                ORDER BY bulan_tahun DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_warga", $id_warga);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updatePembayaranWarga($id_iuran, $metode_pembayaran) {
        $query = "UPDATE " . $this->table_name . "
                SET status_bayar = 'lunas',
                    metode_pembayaran = :metode_pembayaran,
                    tanggal_bayar = NOW()
                WHERE id_iuran = :id_iuran AND status_bayar = 'belum_bayar'";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":metode_pembayaran", $metode_pembayaran);
        $stmt->bindParam(":id_iuran", $id_iuran);
        
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function findById($id_iuran) {
        $query = "SELECT id_iuran, id_warga, bulan_tahun, jumlah_tagihan, status_bayar, metode_pembayaran
                FROM " . $this->table_name . "
                WHERE id_iuran = :id_iuran
                LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_iuran", $id_iuran);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getSaldoPoinWarga($id_warga) {
        $query = "SELECT COALESCE(SUM(total_pendapatan), 0) AS saldo_sampah
                FROM setoran_sampah
                WHERE id_warga = :id_warga AND status_verifikasi = 'diverifikasi'";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_warga", $id_warga);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int) round(((float) ($row['saldo_sampah'] ?? 0)) / 50);
    }

    public function readAllWithWarga() {
        $query = "SELECT i.id_iuran, w.nama_lengkap, w.rt_rw, i.bulan_tahun, i.jumlah_tagihan, i.status_bayar, i.metode_pembayaran, i.tanggal_bayar 
                FROM " . $this->table_name . " i
                JOIN warga_profil w ON i.id_warga = w.id_warga
                ORDER BY i.bulan_tahun DESC, w.nama_lengkap ASC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function generateTagihanBulanan($bulan_tahun, $jumlah_tagihan) {
        $queryWarga = "SELECT id_warga FROM warga_profil";
        $stmtWarga = $this->conn->prepare($queryWarga);
        $stmtWarga->execute();
        $daftarWarga = $stmtWarga->fetchAll(PDO::FETCH_ASSOC);

        if (empty($daftarWarga)) {
            return false;
        }

        $queryInsert = "INSERT INTO " . $this->table_name . " (id_warga, bulan_tahun, jumlah_tagihan, status_bayar) 
                        VALUES (:id_warga, :bulan_tahun, :jumlah_tagihan, 'belum_bayar')";
        $stmtInsert = $this->conn->prepare($queryInsert);

        try {
            $this->conn->beginTransaction();
            foreach ($daftarWarga as $warga) {
                $stmtInsert->bindValue(":id_warga", $warga['id_warga']);
                $stmtInsert->bindValue(":bulan_tahun", $bulan_tahun);
                $stmtInsert->bindValue(":jumlah_tagihan", $jumlah_tagihan);
                $stmtInsert->execute();
            }
            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }
}
?>
