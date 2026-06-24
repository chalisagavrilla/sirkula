<?php
include_once __DIR__ . '/../models/User.php';

class AuthController {
    private $userModel;

    public function __construct($db) {
        $this->userModel = new User($db);
    }

    public function login($email, $password) {
        if (empty($email) || empty($password)) {
            return ["status" => 400, "message" => "Email dan kata sandi tidak boleh kosong."];
        }

        $user = $this->userModel->findByEmail($email);
        if (!$user) {
            return ["status" => 404, "message" => "Akun tidak ditemukan."];
        }

        if (!password_verify($password, $user['password'])) {
            return ["status" => 401, "message" => "Kata sandi salah."];
        }

        $profile = [];
        if ($user['role'] === 'warga') {
            $profile = $this->userModel->getProfileWarga($user['id_user']);
        } else if ($user['role'] === 'pengurus') {
            $profile = $this->userModel->getProfilePengurus($user['id_user']);
        }

        return [
            "status" => 200,
            "message" => "Login berhasil.",
            "user" => [
                "id_user" => $user['id_user'],
                "email" => $user['email'],
                "role" => $user['role'],
                "profile" => $profile
            ]
        ];
    }

    public function register($data) {
        if (empty($data->email) || empty($data->password) || empty($data->nama_lengkap) || empty($data->no_hp)) {
            return ["status" => 400, "message" => "Data pendaftaran tidak lengkap."];
        }

        if ($this->userModel->findByEmail($data->email)) {
            return ["status" => 400, "message" => "Email sudah digunakan."];
        }

        $role = isset($data->role) && $data->role === 'pengurus' ? 'pengurus' : 'warga';

        if ($role === 'pengurus') {
            $jabatan = !empty($data->jabatan) ? $data->jabatan : 'Pengurus RT/RW';
            $success = $this->userModel->registerPengurus(
                $data->email, $data->password, $data->nama_lengkap,
                $jabatan, $data->no_hp
            );
        } else {
            if (empty($data->alamat) || empty($data->rt_rw)) {
                return ["status" => 400, "message" => "Alamat dan RT/RW wajib diisi untuk akun warga."];
            }

            $success = $this->userModel->registerWarga(
                $data->email, $data->password, $data->nama_lengkap,
                $data->no_hp, $data->alamat, $data->rt_rw
            );
        }

        if ($success) {
            return ["status" => 201, "message" => "Pendaftaran berhasil. Silakan login."];
        }
        return ["status" => 500, "message" => "Gagal membuat akun, terjadi kesalahan server."];
    }
}
?>
