-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 23 Jun 2026 pada 07.29
-- Versi server: 8.0.30
-- Versi PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Basis data: `sirkula_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `iuran`
--

CREATE TABLE `iuran` (
  `id_iuran` int NOT NULL,
  `id_warga` int NOT NULL,
  `bulan_tahun` varchar(7) NOT NULL,
  `jumlah_tagihan` decimal(10,2) NOT NULL,
  `status_bayar` enum('belum_bayar','lunas') DEFAULT 'belum_bayar',
  `metode_pembayaran` enum('poin','transfer','ewallet') DEFAULT NULL,
  `tanggal_bayar` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori_sampah`
--

CREATE TABLE `kategori_sampah` (
  `id_kategori` int NOT NULL,
  `nama_kategori` varchar(50) NOT NULL,
  `harga_per_kg` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `kebun_komunitas`
--

CREATE TABLE `kebun_komunitas` (
  `id_tanaman` int NOT NULL,
  `nama_tanaman` varchar(100) NOT NULL,
  `kategori_tanaman` enum('Sayur','Buah','Toga') NOT NULL,
  `tanggal_tanam` date NOT NULL,
  `perkiraan_panen` date NOT NULL,
  `status_tanaman` enum('Pembibitan','Tumbuh','Siap Panen','Sudah Panen') DEFAULT 'Pembibitan',
  `jumlah_stok` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `laporan_fasilitas`
--

CREATE TABLE `laporan_fasilitas` (
  `id_laporan` int NOT NULL,
  `id_warga` int NOT NULL,
  `id_pengurus` int DEFAULT NULL,
  `judul_laporan` varchar(150) NOT NULL,
  `deskripsi` text NOT NULL,
  `foto_bukti` varchar(255) DEFAULT NULL,
  `status_laporan` enum('pending','proses','selesai') DEFAULT 'pending',
  `tanggal_lapor` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pengurus_profil`
--

CREATE TABLE `pengurus_profil` (
  `id_pengurus` int NOT NULL,
  `id_user` int NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `jabatan` varchar(50) NOT NULL,
  `no_hp` varchar(15) NOT NULL,
  `foto_profil` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `setoran_sampah`
--

CREATE TABLE `setoran_sampah` (
  `id_setoran` int NOT NULL,
  `id_warga` int NOT NULL,
  `id_pengurus` int DEFAULT NULL,
  `id_kategori` int NOT NULL,
  `berat_kg` decimal(5,2) NOT NULL,
  `total_pendapatan` decimal(12,2) NOT NULL,
  `status_verifikasi` enum('pending','diverifikasi','ditolak') DEFAULT 'pending',
  `tanggal_setor` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id_user` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('warga','pengurus') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `warga_profil`
--

CREATE TABLE `warga_profil` (
  `id_warga` int NOT NULL,
  `id_user` int NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `no_hp` varchar(15) NOT NULL,
  `alamat` text NOT NULL,
  `rt_rw` varchar(10) NOT NULL,
  `foto_profil` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indeks untuk tabel yang dibuang
--

--
-- Indeks untuk tabel `iuran`
--
ALTER TABLE `iuran`
  ADD PRIMARY KEY (`id_iuran`),
  ADD KEY `id_warga` (`id_warga`);

--
-- Indeks untuk tabel `kategori_sampah`
--
ALTER TABLE `kategori_sampah`
  ADD PRIMARY KEY (`id_kategori`);

--
-- Indeks untuk tabel `kebun_komunitas`
--
ALTER TABLE `kebun_komunitas`
  ADD PRIMARY KEY (`id_tanaman`);

--
-- Indeks untuk tabel `laporan_fasilitas`
--
ALTER TABLE `laporan_fasilitas`
  ADD PRIMARY KEY (`id_laporan`),
  ADD KEY `id_warga` (`id_warga`),
  ADD KEY `id_pengurus` (`id_pengurus`);

--
-- Indeks untuk tabel `pengurus_profil`
--
ALTER TABLE `pengurus_profil`
  ADD PRIMARY KEY (`id_pengurus`),
  ADD UNIQUE KEY `id_user` (`id_user`);

--
-- Indeks untuk tabel `setoran_sampah`
--
ALTER TABLE `setoran_sampah`
  ADD PRIMARY KEY (`id_setoran`),
  ADD KEY `id_warga` (`id_warga`),
  ADD KEY `id_pengurus` (`id_pengurus`),
  ADD KEY `id_kategori` (`id_kategori`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `warga_profil`
--
ALTER TABLE `warga_profil`
  ADD PRIMARY KEY (`id_warga`),
  ADD UNIQUE KEY `id_user` (`id_user`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `iuran`
--
ALTER TABLE `iuran`
  MODIFY `id_iuran` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `kategori_sampah`
--
ALTER TABLE `kategori_sampah`
  MODIFY `id_kategori` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `kebun_komunitas`
--
ALTER TABLE `kebun_komunitas`
  MODIFY `id_tanaman` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `laporan_fasilitas`
--
ALTER TABLE `laporan_fasilitas`
  MODIFY `id_laporan` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pengurus_profil`
--
ALTER TABLE `pengurus_profil`
  MODIFY `id_pengurus` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `setoran_sampah`
--
ALTER TABLE `setoran_sampah`
  MODIFY `id_setoran` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `warga_profil`
--
ALTER TABLE `warga_profil`
  MODIFY `id_warga` int NOT NULL AUTO_INCREMENT;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `iuran`
--
ALTER TABLE `iuran`
  ADD CONSTRAINT `iuran_ibfk_1` FOREIGN KEY (`id_warga`) REFERENCES `warga_profil` (`id_warga`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `laporan_fasilitas`
--
ALTER TABLE `laporan_fasilitas`
  ADD CONSTRAINT `laporan_fasilitas_ibfk_1` FOREIGN KEY (`id_warga`) REFERENCES `warga_profil` (`id_warga`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `laporan_fasilitas_ibfk_2` FOREIGN KEY (`id_pengurus`) REFERENCES `pengurus_profil` (`id_pengurus`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pengurus_profil`
--
ALTER TABLE `pengurus_profil`
  ADD CONSTRAINT `pengurus_profil_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `setoran_sampah`
--
ALTER TABLE `setoran_sampah`
  ADD CONSTRAINT `setoran_sampah_ibfk_1` FOREIGN KEY (`id_warga`) REFERENCES `warga_profil` (`id_warga`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `setoran_sampah_ibfk_2` FOREIGN KEY (`id_pengurus`) REFERENCES `pengurus_profil` (`id_pengurus`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `setoran_sampah_ibfk_3` FOREIGN KEY (`id_kategori`) REFERENCES `kategori_sampah` (`id_kategori`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `warga_profil`
--
ALTER TABLE `warga_profil`
  ADD CONSTRAINT `warga_profil_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
