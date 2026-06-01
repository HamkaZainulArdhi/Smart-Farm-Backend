-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Waktu pembuatan: 17 Bulan Mei 2026 pada 12.52
-- Versi server: 8.4.3
-- Versi PHP: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_farm`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `lahan`
--

CREATE TABLE `lahan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nama_lahan` varchar(255) NOT NULL,
  `lokasi` varchar(255) NOT NULL,
  `luas_lahan` decimal(10,2) NOT NULL COMMENT 'Dalam meter persegi',
  `jenis_tanah` varchar(255) DEFAULT NULL,
  `koordinat_latitude` decimal(10,8) DEFAULT NULL,
  `koordinat_longitude` decimal(11,8) DEFAULT NULL,
  `deskripsi` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `lahan`
--

INSERT INTO `lahan` (`id`, `userId`, `nama_lahan`, `lokasi`, `luas_lahan`, `jenis_tanah`, `koordinat_latitude`, `koordinat_longitude`, `deskripsi`, `createdAt`, `updatedAt`) VALUES
('b9b5aebd-45fc-4aec-b609-15e59738fc62', 'a40f0a06-d458-4b60-95a1-fa166c924799', 'bapa karso', 'Karawang, Jawa Barat', 2000.50, 'Lempung', -6.30330000, 107.02350000, 'Lahan untuk budidaya padi', '2026-05-16 06:02:55', '2026-05-17 12:37:50'),
('ea32cdda-0d34-4c69-a0a8-1eef52e70f4c', 'a40f0a06-d458-4b60-95a1-fa166c924799', 'Lahan Padi Utama', 'Karawang, Jawa Barat', 2000.50, 'Lempung', -6.30330000, 107.02350000, 'Lahan untuk budidaya padi', '2026-05-16 05:42:10', '2026-05-16 05:42:10'),
('f38df0e1-8926-48b4-b124-160d5ac6a519', 'a40f0a06-d458-4b60-95a1-fa166c924799', 'Kebun Kopi Arabika', 'Desa Sukamaju, Kecamatan Puncak, Jawa Barat', 75000.00, 'Andosol', NULL, NULL, 'Lahan produktif untuk budidaya kopi Arabika, terletak di dataran tinggi dengan iklim sejuk.', '2026-05-13 05:23:04', '2026-05-13 05:23:04');

-- --------------------------------------------------------

--
-- Struktur dari tabel `laporan_lahan`
--

CREATE TABLE `laporan_lahan` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `lahanId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `tanggal_laporan` datetime NOT NULL,
  `kondisi_umum` text NOT NULL,
  `rata_rata_suhu` decimal(10,2) DEFAULT NULL,
  `rata_rata_kelembapan` decimal(10,2) DEFAULT NULL,
  `rata_rata_ph` decimal(10,2) DEFAULT NULL,
  `rata_rata_intensitas_cahaya` decimal(15,2) DEFAULT NULL,
  `anomali_terdeteksi` text,
  `saran_perbaikan` text,
  `periode_awal` datetime NOT NULL,
  `periode_akhir` datetime NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `nilai_normal`
--

CREATE TABLE `nilai_normal` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `sensorId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nilai_min` decimal(10,2) NOT NULL COMMENT 'Nilai minimum normal',
  `nilai_max` decimal(10,2) NOT NULL COMMENT 'Nilai maksimum normal',
  `nilai_peringatan_min` decimal(10,2) DEFAULT NULL COMMENT 'Nilai minimum peringatan (di bawah normal)',
  `nilai_peringatan_max` decimal(10,2) DEFAULT NULL COMMENT 'Nilai maksimum peringatan (di atas normal)',
  `nilai_kritis_min` decimal(10,2) DEFAULT NULL COMMENT 'Nilai minimum kritis',
  `nilai_kritis_max` decimal(10,2) DEFAULT NULL COMMENT 'Nilai maksimum kritis',
  `deskripsi` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `notifikasi`
--

CREATE TABLE `notifikasi` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `sensorDataId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `judul` varchar(255) NOT NULL,
  `pesan` text NOT NULL,
  `tipe` enum('peringatan','kritis') NOT NULL,
  `status` enum('belum_dibaca','sudah_dibaca') DEFAULT 'belum_dibaca',
  `dibaca_pada` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `rekomendasi`
--

CREATE TABLE `rekomendasi` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `notifikasiId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `penyuluhId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Penyuluh yang memberikan rekomendasi',
  `judul_rekomendasi` varchar(255) NOT NULL,
  `deskripsi_tindakan` text NOT NULL,
  `prioritas` enum('rendah','sedang','tinggi') DEFAULT 'sedang',
  `status` enum('pending','sedang_dikerjakan','selesai','ditolak') DEFAULT 'pending',
  `status_approval` enum('menunggu','disetujui','ditolak') DEFAULT 'menunggu',
  `tanggal_approval` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `sensor`
--

CREATE TABLE `sensor` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `lahanId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nama_sensor` varchar(255) NOT NULL,
  `tipe_sensor` enum('suhu','kelembapan','ph','intensitas_cahaya') NOT NULL,
  `kode_sensor` varchar(255) NOT NULL,
  `lokasi_sensor` varchar(255) DEFAULT NULL,
  `status` enum('aktif','tidak_aktif','rusak') DEFAULT 'aktif',
  `tipe_koneksi` varchar(255) DEFAULT NULL COMMENT 'WiFi, Bluetooth, LoRa, etc',
  `deskripsi` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `sensor_data`
--

CREATE TABLE `sensor_data` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `sensorId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nilai` decimal(10,2) NOT NULL,
  `satuan` varchar(255) NOT NULL COMMENT 'Celsius, %, pH, Lux, etc',
  `status_kondisi` enum('normal','peringatan','kritis') DEFAULT 'normal',
  `tanggal_pencatatan` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `tanaman`
--

CREATE TABLE `tanaman` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `lahanId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nama_tanaman` varchar(255) NOT NULL,
  `jenis_tanaman` varchar(255) NOT NULL,
  `tanggal_tanam` datetime NOT NULL,
  `estimasi_panen` datetime DEFAULT NULL,
  `luas_tanaman` decimal(10,2) DEFAULT NULL,
  `varietas` varchar(255) DEFAULT NULL,
  `status` enum('perencanaan','tanam','berkembang','siap_panen','selesai') DEFAULT 'tanam',
  `deskripsi` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nama` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nomor_telepon` varchar(255) DEFAULT NULL,
  `alamat` text,
  `role` enum('petani','penyuluh','admin') DEFAULT 'petani',
  `aktif` tinyint(1) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `nama`, `email`, `password`, `nomor_telepon`, `alamat`, `role`, `aktif`, `createdAt`, `updatedAt`) VALUES
('10ea90fe-05cc-4b4a-ab31-0fca62a7d3cf', 'Rina Setiawan', 'rina@penyuluh.com', '$2b$10$PklxY6zzv9Ij8Vd0/p6aduhXYUzcsuMCFIu.Hm.ibcnYm2Pz1fDqi', '0812345682', 'Surabaya, Jawa Timur', 'penyuluh', 1, '2026-05-05 16:24:26', '2026-05-05 16:24:26'),
('65319eda-334c-4840-a2f0-79ebc6af6830', 'Dr. Ahmad Wijaya', 'ahmad@penyuluh.com', '$2b$10$PklxY6zzv9Ij8Vd0/p6aduhXYUzcsuMCFIu.Hm.ibcnYm2Pz1fDqi', '0812345681', 'Yogyakarta, Indonesia', 'penyuluh', 1, '2026-05-05 16:24:26', '2026-05-05 16:24:26'),
('6c0805ef-f2d2-41d8-8335-be8af83efdd7', 'hamka zain', 'zain@petani.com', '$2a$10$b1upZZjji//I/id3uhrI/uhr7xYw31gqKW2cB6HVl9WFurUbcDOdW', '0812345678', 'jogja, Indonesia', 'petani', 1, '2026-05-09 17:14:09', '2026-05-09 17:14:09'),
('7cdef1ee-1ecf-47e9-86f1-f06d1aa4c7cb', 'hamka zain', 'hamka@petani.com', '$2a$10$jEKKYHSKKjZuhWNrGT.Zu.2KyPzlUrPG6RTaAbZdY70Hvwt.DNIai', '0812345678', 'jogja, Indonesia', 'petani', 1, '2026-05-05 17:54:55', '2026-05-05 17:54:55'),
('a40f0a06-d458-4b60-95a1-fa166c924799', 'Admin', 'admin@agritech.com', '$2a$10$KUaGsMpPj7qjBX3Q99xIW.fLI9J7eryM6QApsddoazsC3UjJpIoi.', '0812345678', 'Indonesia', 'admin', 1, '2026-05-05 15:34:27', '2026-05-05 15:34:27'),
('fe27326b-3d4c-4e77-988b-33d93ba27a5c', 'hamka zain', 'zainul@petani.com', '$2a$10$RVQSEExFrIUBXJJMBTms3OPRZJkL5KvEqVfe4hN1aEKVskJtX20qW', '0812345678', 'jogja, Indonesia', 'petani', 1, '2026-05-09 17:14:33', '2026-05-09 17:14:33');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `lahan`
--
ALTER TABLE `lahan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`);

--
-- Indeks untuk tabel `laporan_lahan`
--
ALTER TABLE `laporan_lahan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lahanId` (`lahanId`);

--
-- Indeks untuk tabel `nilai_normal`
--
ALTER TABLE `nilai_normal`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sensorId` (`sensorId`);

--
-- Indeks untuk tabel `notifikasi`
--
ALTER TABLE `notifikasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `sensorDataId` (`sensorDataId`);

--
-- Indeks untuk tabel `rekomendasi`
--
ALTER TABLE `rekomendasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifikasiId` (`notifikasiId`),
  ADD KEY `penyuluhId` (`penyuluhId`);

--
-- Indeks untuk tabel `sensor`
--
ALTER TABLE `sensor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_sensor` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_2` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_3` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_4` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_5` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_6` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_7` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_8` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_9` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_10` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_11` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_12` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_13` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_14` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_15` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_16` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_17` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_18` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_19` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_20` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_21` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_22` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_23` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_24` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_25` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_26` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_27` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_28` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_29` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_30` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_31` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_32` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_33` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_34` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_35` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_36` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_37` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_38` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_39` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_40` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_41` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_42` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_43` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_44` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_45` (`kode_sensor`),
  ADD UNIQUE KEY `kode_sensor_46` (`kode_sensor`),
  ADD KEY `lahanId` (`lahanId`);

--
-- Indeks untuk tabel `sensor_data`
--
ALTER TABLE `sensor_data`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sensorId` (`sensorId`);

--
-- Indeks untuk tabel `tanaman`
--
ALTER TABLE `tanaman`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lahanId` (`lahanId`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `email_21` (`email`),
  ADD UNIQUE KEY `email_22` (`email`),
  ADD UNIQUE KEY `email_23` (`email`),
  ADD UNIQUE KEY `email_24` (`email`),
  ADD UNIQUE KEY `email_25` (`email`),
  ADD UNIQUE KEY `email_26` (`email`),
  ADD UNIQUE KEY `email_27` (`email`),
  ADD UNIQUE KEY `email_28` (`email`),
  ADD UNIQUE KEY `email_29` (`email`),
  ADD UNIQUE KEY `email_30` (`email`),
  ADD UNIQUE KEY `email_31` (`email`),
  ADD UNIQUE KEY `email_32` (`email`),
  ADD UNIQUE KEY `email_33` (`email`),
  ADD UNIQUE KEY `email_34` (`email`),
  ADD UNIQUE KEY `email_35` (`email`),
  ADD UNIQUE KEY `email_36` (`email`),
  ADD UNIQUE KEY `email_37` (`email`),
  ADD UNIQUE KEY `email_38` (`email`),
  ADD UNIQUE KEY `email_39` (`email`),
  ADD UNIQUE KEY `email_40` (`email`),
  ADD UNIQUE KEY `email_41` (`email`),
  ADD UNIQUE KEY `email_42` (`email`),
  ADD UNIQUE KEY `email_43` (`email`),
  ADD UNIQUE KEY `email_44` (`email`),
  ADD UNIQUE KEY `email_45` (`email`),
  ADD UNIQUE KEY `email_46` (`email`),
  ADD UNIQUE KEY `email_47` (`email`),
  ADD UNIQUE KEY `email_48` (`email`),
  ADD UNIQUE KEY `email_49` (`email`),
  ADD UNIQUE KEY `email_50` (`email`),
  ADD UNIQUE KEY `email_51` (`email`),
  ADD UNIQUE KEY `email_52` (`email`),
  ADD UNIQUE KEY `email_53` (`email`),
  ADD UNIQUE KEY `email_54` (`email`),
  ADD UNIQUE KEY `email_55` (`email`),
  ADD UNIQUE KEY `email_56` (`email`),
  ADD UNIQUE KEY `email_57` (`email`),
  ADD UNIQUE KEY `email_58` (`email`),
  ADD UNIQUE KEY `email_59` (`email`),
  ADD UNIQUE KEY `email_60` (`email`),
  ADD UNIQUE KEY `email_61` (`email`),
  ADD UNIQUE KEY `email_62` (`email`),
  ADD UNIQUE KEY `email_63` (`email`);

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `lahan`
--
ALTER TABLE `lahan`
  ADD CONSTRAINT `lahan_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `laporan_lahan`
--
ALTER TABLE `laporan_lahan`
  ADD CONSTRAINT `laporan_lahan_ibfk_1` FOREIGN KEY (`lahanId`) REFERENCES `lahan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `nilai_normal`
--
ALTER TABLE `nilai_normal`
  ADD CONSTRAINT `nilai_normal_ibfk_1` FOREIGN KEY (`sensorId`) REFERENCES `sensor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `notifikasi`
--
ALTER TABLE `notifikasi`
  ADD CONSTRAINT `notifikasi_ibfk_91` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifikasi_ibfk_92` FOREIGN KEY (`sensorDataId`) REFERENCES `sensor_data` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `rekomendasi`
--
ALTER TABLE `rekomendasi`
  ADD CONSTRAINT `rekomendasi_ibfk_91` FOREIGN KEY (`notifikasiId`) REFERENCES `notifikasi` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `rekomendasi_ibfk_92` FOREIGN KEY (`penyuluhId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `sensor`
--
ALTER TABLE `sensor`
  ADD CONSTRAINT `sensor_ibfk_1` FOREIGN KEY (`lahanId`) REFERENCES `lahan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `sensor_data`
--
ALTER TABLE `sensor_data`
  ADD CONSTRAINT `sensor_data_ibfk_1` FOREIGN KEY (`sensorId`) REFERENCES `sensor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `tanaman`
--
ALTER TABLE `tanaman`
  ADD CONSTRAINT `tanaman_ibfk_1` FOREIGN KEY (`lahanId`) REFERENCES `lahan` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
