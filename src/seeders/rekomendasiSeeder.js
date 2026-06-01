import { randomUUID } from "crypto";

export const rekomendasiSeeds = (notifikasiIds, userIds) => [
  {
    id: randomUUID(),
    notifikasiId: notifikasiIds[0], // Notifikasi suhu tinggi
    penyuluhId: userIds[3], // Dr. Ahmad
    judul_rekomendasi: "Tingkatkan Irigasi",
    deskripsi_tindakan:
      "Tambah volume air irigasi 20% untuk menurunkan suhu lahan. Lakukan penyiraman pada pagi dan sore hari",
    prioritas: "tinggi",
    status: "sedang_dikerjakan",
    status_approval: "disetujui",
    tanggal_approval: new Date(),
  },
  {
    id: randomUUID(),
    notifikasiId: notifikasiIds[1], // Notifikasi cahaya rendah
    penyuluhId: userIds[4], // Rina
    judul_rekomendasi: "Pasang Lampu Tambahan",
    deskripsi_tindakan:
      "Intensitas cahaya kurang, pasang lampu grow light 100W untuk 8 jam sehari",
    prioritas: "sedang",
    status: "pending",
    status_approval: "menunggu",
    tanggal_approval: null,
  },
  {
    id: randomUUID(),
    notifikasiId: notifikasiIds[2], // Notifikasi padi baik
    penyuluhId: userIds[3], // Dr. Ahmad
    judul_rekomendasi: "Pertahankan Kondisi Saat Ini",
    deskripsi_tindakan:
      "Kondisi lahan optimal, lanjutkan program pemeliharaan yang sama",
    prioritas: "rendah",
    status: "selesai",
    status_approval: "disetujui",
    tanggal_approval: new Date(),
  },
];
