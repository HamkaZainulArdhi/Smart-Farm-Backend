import { randomUUID } from "crypto";

export const nilaiNormalSeeds = (sensorIds) => [
  {
    id: randomUUID(),
    sensorId: sensorIds[0], // Sensor Suhu
    nilai_min: 20,
    nilai_max: 30,
    nilai_peringatan_min: 15,
    nilai_peringatan_max: 35,
    nilai_kritis_min: 10,
    nilai_kritis_max: 40,
    deskripsi: "Rentang suhu ideal untuk padi",
  },
  {
    id: randomUUID(),
    sensorId: sensorIds[1], // Sensor Kelembapan
    nilai_min: 50,
    nilai_max: 80,
    nilai_peringatan_min: 40,
    nilai_peringatan_max: 90,
    nilai_kritis_min: 30,
    nilai_kritis_max: 100,
    deskripsi: "Rentang kelembapan ideal untuk lahan padi",
  },
  {
    id: randomUUID(),
    sensorId: sensorIds[2], // Sensor pH
    nilai_min: 6.0,
    nilai_max: 7.5,
    nilai_peringatan_min: 5.5,
    nilai_peringatan_max: 8.0,
    nilai_kritis_min: 5.0,
    nilai_kritis_max: 8.5,
    deskripsi: "Rentang pH ideal untuk sayuran",
  },
  {
    id: randomUUID(),
    sensorId: sensorIds[3], // Sensor Cahaya
    nilai_min: 30000,
    nilai_max: 50000,
    nilai_peringatan_min: 20000,
    nilai_peringatan_max: 60000,
    nilai_kritis_min: 10000,
    nilai_kritis_max: 70000,
    deskripsi: "Rentang intensitas cahaya ideal untuk tomat",
  },
];
