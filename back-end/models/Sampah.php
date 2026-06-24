<?php
class Sampah {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getKategori() {
        $query = "SELECT id_kategori, nama_kategori, harga_per_kg FROM kategori_sampah ORDER BY nama_kategori ASC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getHargaKategori($id_kategori) {
        $query = "SELECT harga_per_kg FROM kategori_sampah WHERE id_kategori = :id_kategori LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_kategori", $id_kategori);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $row['harga_per_kg'] : 0;
    }

    public function readByWargaId($id_warga) {
        $query = "SELECT s.id_setoran, k.nama_kategori, s.berat_kg, s.total_pendapatan, s.status_verifikasi, s.tanggal_setor 
                FROM setoran_sampah s
                JOIN kategori_sampah k ON s.id_kategori = k.id_kategori
                WHERE s.id_warga = :id_warga
                ORDER BY s.tanggal_setor DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_warga", $id_warga);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createRequest($id_warga, $id_kategori, $berat_kg, $total_pendapatan) {
        $query = "INSERT INTO setoran_sampah (id_warga, id_kategori, berat_kg, total_pendapatan, status_verifikasi) 
                VALUES (:id_warga, :id_kategori, :berat_kg, :total_pendapatan, 'pending')";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_warga", $id_warga);
        $stmt->bindParam(":id_kategori", $id_kategori);
        $stmt->bindParam(":berat_kg", $berat_kg);
        $stmt->bindParam(":total_pendapatan", $total_pendapatan);
        
        return $stmt->execute();
    }

    public function readAllForAdmin() {
        $query = "SELECT s.id_setoran, w.nama_lengkap AS nama_warga, k.nama_kategori, s.berat_kg, s.total_pendapatan, s.status_verifikasi, s.tanggal_setor
                FROM setoran_sampah s
                JOIN warga_profil w ON s.id_warga = w.id_warga
                JOIN kategori_sampah k ON s.id_kategori = k.id_kategori
                ORDER BY s.status_verifikasi ASC, s.tanggal_setor DESC";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function updateStatus($id_setoran, $id_pengurus, $status) {
        $query = "UPDATE setoran_sampah
                SET status_verifikasi = :status, id_pengurus = :id_pengurus 
                WHERE id_setoran = :id_setoran";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":id_pengurus", $id_pengurus);
        $stmt->bindParam(":id_setoran", $id_setoran);
        
        return $stmt->execute();
    }
}
?>