import { randomUUID } from "crypto";

export const lahanSeeds = (petaniIds) => [
  {
    id: randomUUID(),
    userId: petaniIds[0], // Budi
    nama_lahan: "Lahan Padi Utama",
    lokasi: "Desa Cibogo, Bogor",
    luas_lahan: 5000.0,
    jenis_tanah: "Tanah liat",
    koordinat_latitude: -6.592521,
    koordinat_longitude: 106.794346,
    deskripsi: "Lahan padi berkualitas tinggi dengan irigasi otomatis",
  },
  {
    id: randomUUID(),
    userId: petaniIds[0], // Budi
    nama_lahan: "Lahan Sayuran",
    lokasi: "Desa Cibogo, Bogor",
    luas_lahan: 2000.0,
    jenis_tanah: "Tanah pasir",
    koordinat_latitude: -6.593521,
    koordinat_longitude: 106.795346,
    deskripsi: "Lahan sayuran organik",
  },
  {
    id: randomUUID(),
    userId: petaniIds[1], // Siti
    nama_lahan: "Lahan Tomat Bandung",
    lokasi: "Desa Cibiru, Bandung",
    luas_lahan: 3000.0,
    jenis_tanah: "Tanah andosol",
    koordinat_latitude: -6.94718,
    koordinat_longitude: 107.616745,
    deskripsi: "Lahan tomat premium dengan polybag sistem",
  },
];
