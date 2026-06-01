import sequelize from "../config/config.js";
import {
  User,
  Lahan,
  Tanaman,
  Sensor,
  SensorData,
  NilaiNormal,
  Notifikasi,
  Rekomendasi,
  LaporanLahan,
} from "../models/index.js";

import { userSeeds } from "../seeders/userSeeder.js";
import { lahanSeeds } from "../seeders/lahanSeeder.js";
import { tanamanSeeds } from "../seeders/tanamanSeeder.js";
import { sensorSeeds } from "../seeders/sensorSeeder.js";
import { sensorDataSeeds } from "../seeders/sensorDataSeeder.js";
import { nilaiNormalSeeds } from "../seeders/nilaiNormalSeeder.js";
import { notifikasiSeeds } from "../seeders/notifikasiSeeder.js";
import { rekomendasiSeeds } from "../seeders/rekomendasiSeeder.js";
import { laporanSeeds } from "../seeders/laporanSeeder.js";

// helper generic
const seedIfEmpty = async (Model, data) => {
  const count = await Model.count();
  if (count === 0) {
    await Model.bulkCreate(data, { ignoreDuplicates: true });
  }
};

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();

    // Users
    await User.bulkCreate(userSeeds, { ignoreDuplicates: true });

    const users = await User.findAll({ attributes: ["id", "role"] });
    const userIds = users.map((u) => u.id);
    const petaniIds = users.filter((u) => u.role === "petani").map((u) => u.id);

    // Lahan
    await seedIfEmpty(Lahan, lahanSeeds(petaniIds));
    const lahanIds = (await Lahan.findAll({ attributes: ["id"] })).map(
      (l) => l.id,
    );

    // Tanaman
    await seedIfEmpty(Tanaman, tanamanSeeds(lahanIds));

    // Sensor
    await seedIfEmpty(Sensor, sensorSeeds(lahanIds));
    const sensorIds = (await Sensor.findAll({ attributes: ["id"] })).map(
      (s) => s.id,
    );

    // SensorData
    await seedIfEmpty(SensorData, sensorDataSeeds(sensorIds));
    const sensorDataIds = (
      await SensorData.findAll({ attributes: ["id"] })
    ).map((sd) => sd.id);

    // NilaiNormal
    await seedIfEmpty(NilaiNormal, nilaiNormalSeeds(sensorIds));

    // Notifikasi
    await seedIfEmpty(Notifikasi, notifikasiSeeds(userIds, sensorDataIds));
    const notifikasiIds = (
      await Notifikasi.findAll({ attributes: ["id"] })
    ).map((n) => n.id);

    // Rekomendasi
    await seedIfEmpty(Rekomendasi, rekomendasiSeeds(notifikasiIds, userIds));

    // Laporan
    await seedIfEmpty(LaporanLahan, laporanSeeds(lahanIds));

    console.log("Database seeding horeeeee");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
