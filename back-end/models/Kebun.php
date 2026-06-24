<?php
class Kebun {
    private $conn;
    private $table_name = "kebun_komunitas";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function readAll() {
        $query = "SELECT id_tanaman, nama_tanaman, kategori_tanaman, tanggal_tanam, perkiraan_panen, status_tanaman, jumlah_stok 
                FROM " . $this->table_name . "
                ORDER BY tanggal_tanam DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function createTanaman($nama, $kategori, $tgl_tanam, $perkiraan_panen) {
        $query = "INSERT INTO " . $this->table_name . " (nama_tanaman, kategori_tanaman, tanggal_tanam, perkiraan_panen, status_tanaman) 
                VALUES (:nama, :kategori, :tgl_tanam, :perkiraan_panen, 'Pembibitan')";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":nama", $nama);
        $stmt->bindParam(":kategori", $kategori);
        $stmt->bindParam(":tgl_tanam", $tgl_tanam);
        $stmt->bindParam(":perkiraan_panen", $perkiraan_panen);
        return $stmt->execute();
    }

    public function updateProgress($id_tanaman, $status, $stok) {
        $query = "UPDATE " . $this->table_name . "
                SET status_tanaman = :status, jumlah_stok = :stok
                WHERE id_tanaman = :id_tanaman";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":status", $status);
        $stmt->bindParam(":stok", $stok);
        $stmt->bindParam(":id_tanaman", $id_tanaman);
        return $stmt->execute();
    }
}
?>