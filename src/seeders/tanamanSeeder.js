import { randomUUID } from "crypto";

export const tanamanSeeds = (lahanIds) => [
  {
    id: randomUUID(),
    lahanId: lahanIds[0], // Lahan Padi
    nama_tanaman: "Padi IR 64",
    jenis_tanaman: "Padi",
    tanggal_tanam: new Date("2024-05-01"),
    estimasi_panen: new Date("2024-08-15"),
    luas_tanaman: 5000.0,
    varietas: "IR 64",
    status: "berkembang",
    deskripsi: "Padi berkualitas tinggi dengan hasil panen optimal",
  },
  {
    id: randomUUID(),
    lahanId: lahanIds[1], // Lahan Sayuran
    nama_tanaman: "Cabai Merah",
    jenis_tanaman: "Cabai",
    tanggal_tanam: new Date("2024-04-15"),
    estimasi_panen: new Date("2024-07-30"),
    luas_tanaman: 2000.0,
    varietas: "Cabai Merah Keriting",
    status: "berkembang",
    deskripsi: "Cabai merah organik tanpa pestisida",
  },
  {
    id: randomUUID(),
    lahanId: lahanIds[2], // Lahan Tomat
    nama_tanaman: "Tomat Cherry",
    jenis_tanaman: "Tomat",
    tanggal_tanam: new Date("2024-03-20"),
    estimasi_panen: new Date("2024-06-30"),
    luas_tanaman: 3000.0,
    varietas: "Cherry Tomato F1",
    status: "siap_panen",
    deskripsi: "Tomat cherry premium untuk pasar ekspor",
  },
];
