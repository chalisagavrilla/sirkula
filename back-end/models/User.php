<?php
class User {
    private $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findByEmail($email) {
        $query = "SELECT id_user, email, password, role FROM users WHERE email = :email LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getProfileWarga($id_user) {
        $query = "SELECT id_warga, nama_lengkap, no_hp, alamat, rt_rw, foto_profil 
                FROM warga_profil WHERE id_user = :id_user";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_user", $id_user);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getProfilePengurus($id_user) {
        $query = "SELECT id_pengurus, nama_lengkap, jabatan, no_hp, foto_profil 
                FROM pengurus_profil WHERE id_user = :id_user";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id_user", $id_user);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function registerWarga($email, $password, $nama_lengkap, $no_hp, $alamat, $rt_rw) {
        try {
            $this->conn->beginTransaction();

            $queryUser = "INSERT INTO users (email, password, role) VALUES (:email, :password, 'warga')";
            $stmtUser = $this->conn->prepare($queryUser);
            
            $hashed_password = password_hash($password, PASSWORD_BCRYPT);
            $stmtUser->bindParam(":email", $email);
            $stmtUser->bindParam(":password", $hashed_password);
            $stmtUser->execute();

            $id_user = $this->conn->lastInsertId();

            $queryProfil = "INSERT INTO warga_profil (id_user, nama_lengkap, no_hp, alamat, rt_rw) 
                            VALUES (:id_user, :nama_lengkap, :no_hp, :alamat, :rt_rw)";
            $stmtProfil = $this->conn->prepare($queryProfil);
            $stmtProfil->bindParam(":id_user", $id_user);
            $stmtProfil->bindParam(":nama_lengkap", $nama_lengkap);
            $stmtProfil->bindParam(":no_hp", $no_hp);
            $stmtProfil->bindParam(":alamat", $alamat);
            $stmtProfil->bindParam(":rt_rw", $rt_rw);
            $stmtProfil->execute();

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    public function registerPengurus($email, $password, $nama_lengkap, $jabatan, $no_hp) {
        try {
            $this->conn->beginTransaction();

            $queryUser = "INSERT INTO users (email, password, role) VALUES (:email, :password, 'pengurus')";
            $stmtUser = $this->conn->prepare($queryUser);

            $hashed_password = password_hash($password, PASSWORD_BCRYPT);
            $stmtUser->bindParam(":email", $email);
            $stmtUser->bindParam(":password", $hashed_password);
            $stmtUser->execute();

            $id_user = $this->conn->lastInsertId();

            $queryProfil = "INSERT INTO pengurus_profil (id_user, nama_lengkap, jabatan, no_hp)
                            VALUES (:id_user, :nama_lengkap, :jabatan, :no_hp)";
            $stmtProfil = $this->conn->prepare($queryProfil);
            $stmtProfil->bindParam(":id_user", $id_user);
            $stmtProfil->bindParam(":nama_lengkap", $nama_lengkap);
            $stmtProfil->bindParam(":jabatan", $jabatan);
            $stmtProfil->bindParam(":no_hp", $no_hp);
            $stmtProfil->execute();

            $this->conn->commit();
            return true;
        } catch (Exception $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    public function getWargaDashboardStats($id_warga) {
        $stats = [];

        $q1 = "SELECT SUM(total_pendapatan) as total_saldo FROM setoran_sampah WHERE id_warga = :id_warga AND status_verifikasi = 'diverifikasi'";
        $s1 = $this->conn->prepare($q1);
        $s1->bindParam(":id_warga", $id_warga);
        $s1->execute();
        $stats['saldo_sampah'] = $s1->fetch(PDO::FETCH_ASSOC)['total_saldo'] ?? 0;

        $q2 = "SELECT status_bayar, bulan_tahun, jumlah_tagihan FROM iuran WHERE id_warga = :id_warga ORDER BY bulan_tahun DESC LIMIT 1";
        $s2 = $this->conn->prepare($q2);
        $s2->bindParam(":id_warga", $id_warga);
        $s2->execute();
        $stats['iuran_terbaru'] = $s2->fetch(PDO::FETCH_ASSOC) ?: ["status_bayar" => "tidak_ada", "jumlah_tagihan" => 0, "bulan_tahun" => "-"];

        $q3 = "SELECT COUNT(*) as total_pending FROM laporan_fasilitas WHERE id_warga = :id_warga AND status_laporan = 'pending'";
        $s3 = $this->conn->prepare($q3);
        $s3->bindParam(":id_warga", $id_warga);
        $s3->execute();
        $stats['laporan_pending'] = $s3->fetch(PDO::FETCH_ASSOC)['total_pending'] ?? 0;

        return $stats;
    }

    public function getPengurusDashboardStats() {
        $stats = [];

        $q1 = "SELECT SUM(jumlah_tagihan) as total_kas FROM iuran WHERE status_bayar = 'lunas'";
        $s1 = $this->conn->prepare($q1);
        $s1->execute();
        $stats['total_kas_rt'] = $s1->fetch(PDO::FETCH_ASSOC)['total_kas'] ?? 0;

        $q2 = "SELECT SUM(berat_kg) as total_berat_sampah FROM setoran_sampah WHERE status_verifikasi = 'diverifikasi'";
        $s2 = $this->conn->prepare($q2);
        $s2->execute();
        $stats['total_berat_sampah'] = $s2->fetch(PDO::FETCH_ASSOC)['total_berat_sampah'] ?? 0;

        $q3 = "SELECT COUNT(*) as total_aduan_warga FROM laporan_fasilitas WHERE status_laporan = 'pending'";
        $s3 = $this->conn->prepare($q3);
        $s3->execute();
        $stats['aduan_warga_pending'] = $s3->fetch(PDO::FETCH_ASSOC)['total_aduan_warga'] ?? 0;

        return $stats;
    }
}
?>
