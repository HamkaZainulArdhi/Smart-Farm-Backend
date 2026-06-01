import { randomUUID } from "crypto";

export const sensorSeeds = (lahanIds) => [
  {
    id: randomUUID(),
    lahanId: lahanIds[0], // Lahan Padi
    nama_sensor: "Sensor Suhu DHT22",
    tipe_sensor: "suhu",
    kode_sensor: "SENSOR-SUHU-001",
    lokasi_sensor: "Tengah Lahan Padi",
    status: "aktif",
    tipe_koneksi: "WiFi",
    deskripsi: "Sensor suhu dan kelembapan DHT22",
  },
  {
    id: randomUUID(),
    lahanId: lahanIds[0], // Lahan Padi
    nama_sensor: "Sensor Kelembapan Tanah",
    tipe_sensor: "kelembapan",
    kode_sensor: "SENSOR-KELEMBAPAN-001",
    lokasi_sensor: "Titik Barat Lahan",
    status: "aktif",
    tipe_koneksi: "LoRa",
    deskripsi: "Sensor kelembapan tanah kapasitif",
  },
  {
    id: randomUUID(),
    lahanId: lahanIds[1], // Lahan Sayuran
    nama_sensor: "Sensor pH Tanah",
    tipe_sensor: "ph",
    kode_sensor: "SENSOR-PH-001",
    lokasi_sensor: "Tengah Lahan Sayuran",
    status: "aktif",
    tipe_koneksi: "WiFi",
    deskripsi: "Sensor pH tanah analog",
  },
  {
    id: randomUUID(),
    lahanId: lahanIds[2], // Lahan Tomat
    nama_sensor: "Sensor Intensitas Cahaya",
    tipe_sensor: "intensitas_cahaya",
    kode_sensor: "SENSOR-CAHAYA-001",
    lokasi_sensor: "Atap Rumah Kaca",
    status: "aktif",
    tipe_koneksi: "WiFi",
    deskripsi: "Sensor LUX untuk intensitas cahaya matahari",
  },
];
