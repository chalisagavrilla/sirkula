<?php
class Laporan {
    private $conn;
    private $table_name = "laporan_fasilitas";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function createLaporan($id_warga, $judul, $deskripsi, $foto_bukti) {
        $query = "INSERT INTO " . $this->table_name . " (id_warga, judul_laporan, deskripsi, foto_bukti, status_laporan) 
                VALUES (:id_warga, :judul, :deskripsi, :foto_bukti, 'pending')";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_warga", $id_warga);
        $stmt->bindParam(":judul", $judul);
        $stmt->bindParam(":deskripsi", $deskripsi);
        $stmt->bindParam(":foto_bukti", $foto_bukti);
        return $stmt->execute();
    }

    public function readByWarga($id_warga) {
        $query = "SELECT id_laporan, judul_laporan, deskripsi, foto_bukti, status_laporan, tanggal_lapor 
                FROM " . $this->table_name . " WHERE id_warga = :id_warga ORDER BY tanggal_lapor DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_warga", $id_warga);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function readAllForAdmin() {
        $query = "SELECT l.id_laporan, w.nama_lengkap AS nama_warga, w.rt_rw, l.judul_laporan, l.deskripsi, l.foto_bukti, l.status_laporan, l.tanggal_lapor 
                FROM " . $this->table_name . " l
                JOIN warga_profil w ON l.id_warga = w.id_warga
                ORDER BY l.status_laporan ASC, l.tanggal_lapor DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateStatusLaporan($id_laporan, $id_pengurus, $status) {
        $query = "UPDATE " . $this->table_name . "
                SET status_laporan = :status, id_pengurus = :id_pengurus
                WHERE id_laporan = :id_laporan";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":id_pengurus", $id_pengurus);
        $stmt->bindParam(":id_laporan", $id_laporan);
        return $stmt->execute();
    }
}
?>