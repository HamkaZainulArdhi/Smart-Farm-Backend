import { randomUUID } from "crypto";

export const laporanSeeds = (lahanIds) => [
  {
    id: randomUUID(),
    lahanId: lahanIds[0], // Lahan Padi
    tanggal_laporan: new Date(),
    kondisi_umum: "Lahan padi berkembang dengan baik, tidak ada penyakit",
    rata_rata_suhu: 28.3,
    rata_rata_kelembapan: 68.5,
    rata_rata_ph: 6.8,
    rata_rata_intensitas_cahaya: 45000,
    anomali_terdeteksi: "Tidak ada anomali",
    saran_perbaikan: "Lanjutkan program irigasi dan pemupukan secara berkala",
    periode_awal: new Date("2024-05-01"),
    periode_akhir: new Date(),
  },
  {
    id: randomUUID(),
    lahanId: lahanIds[1], // Lahan Sayuran
    tanggal_laporan: new Date(Date.now() - 86400000), // 1 hari lalu
    kondisi_umum: "Cabai mulai berbuah, kesehatan tanaman baik",
    rata_rata_suhu: 27.8,
    rata_rata_kelembapan: 65.2,
    rata_rata_ph: 6.7,
    rata_rata_intensitas_cahaya: 42000,
    anomali_terdeteksi: "Terdeteksi serangan hama kecil di area timur",
    saran_perbaikan:
      "Lakukan penyemprotan pestisida organik pada area yang terserang",
    periode_awal: new Date("2024-04-15"),
    periode_akhir: new Date(Date.now() - 86400000),
  },
  {
    id: randomUUID(),
    lahanId: lahanIds[2], // Lahan Tomat
    tanggal_laporan: new Date(Date.now() - 172800000), // 2 hari lalu
    kondisi_umum: "Tomat sudah siap panen, hasil panen diperkirakan 2000 kg",
    rata_rata_suhu: 26.5,
    rata_rata_kelembapan: 62.3,
    rata_rata_ph: 6.5,
    rata_rata_intensitas_cahaya: 48000,
    anomali_terdeteksi: "Tidak ada",
    saran_perbaikan: "Siapkan panen dan persiapkan untuk tanam berikutnya",
    periode_awal: new Date("2024-03-20"),
    periode_akhir: new Date(Date.now() - 172800000),
  },
];
