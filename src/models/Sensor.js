import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const Sensor = sequelize.define(
  "Sensor",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    lahanId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "lahan",
        key: "id",
      },
    },
    nama_sensor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tipe_sensor: {
      type: DataTypes.ENUM("suhu", "kelembapan", "ph", "intensitas_cahaya"),
      allowNull: false,
    },
    kode_sensor: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    lokasi_sensor: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("aktif", "tidak_aktif", "rusak"),
      defaultValue: "aktif",
    },
    tipe_koneksi: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "WiFi, Bluetooth, LoRa, etc",
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "sensor",
    timestamps: true,
  },
);

export default Sensor;
