import { randomUUID } from "crypto";

export const notifikasiSeeds = (userIds, sensorDataIds) => [
  {
    id: randomUUID(),
    userId: userIds[0], // Budi
    sensorDataId: sensorDataIds[1], // Sensor data yang peringatan
    judul: "Peringatan Suhu Tinggi",
    pesan: "Suhu lahan meningkat menjadi 29.2°C, sesuaikan irigasi",
    tipe: "peringatan",
    status: "belum_dibaca",
    dibaca_pada: null,
  },
  {
    id: randomUUID(),
    userId: userIds[1], // Siti
    sensorDataId: sensorDataIds[5], // Sensor cahaya yang peringatan
    judul: "Intensitas Cahaya Rendah",
    pesan:
      "Intensitas cahaya turun menjadi 35000 Lux, kurang ideal untuk tomat",
    tipe: "peringatan",
    status: "sudah_dibaca",
    dibaca_pada: new Date(),
  },
  {
    id: randomUUID(),
    userId: userIds[0], // Budi
    sensorDataId: sensorDataIds[0], // Sensor data normal
    judul: "Padi Berkembang dengan Baik",
    pesan: "Kondisi lahan padi optimal, semua parameter dalam rentang normal",
    tipe: "peringatan",
    status: "sudah_dibaca",
    dibaca_pada: new Date(),
  },
];
