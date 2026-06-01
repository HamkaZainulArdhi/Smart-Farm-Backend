import { randomUUID } from "crypto";

export const sensorDataSeeds = (sensorIds) => [
  {
    id: randomUUID(),
    sensorId: sensorIds[0], // Sensor Suhu
    nilai: 28.5,
    satuan: "Celsius",
    status_kondisi: "normal",
    tanggal_pencatatan: new Date(),
  },
  {
    id: randomUUID(),
    sensorId: sensorIds[0], // Sensor Suhu
    nilai: 29.2,
    satuan: "Celsius",
    status_kondisi: "peringatan",
    tanggal_pencatatan: new Date(Date.now() - 3600000),
  },
  {
    id: randomUUID(),
    sensorId: sensorIds[1], // Sensor Kelembapan
    nilai: 65.3,
    satuan: "%",
    status_kondisi: "normal",
    tanggal_pencatatan: new Date(),
  },
  {
    id: randomUUID(),
    sensorId: sensorIds[2], // Sensor pH
    nilai: 6.8,
    satuan: "pH",
    status_kondisi: "normal",
    tanggal_pencatatan: new Date(),
  },
  {
    id: randomUUID(),
    sensorId: sensorIds[3], // Sensor Cahaya
    nilai: 45000,
    satuan: "Lux",
    status_kondisi: "normal",
    tanggal_pencatatan: new Date(),
  },
  {
    id: randomUUID(),
    sensorId: sensorIds[3], // Sensor Cahaya
    nilai: 35000,
    satuan: "Lux",
    status_kondisi: "peringatan",
    tanggal_pencatatan: new Date(Date.now() - 1800000),
  },
];
