import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const Notifikasi = sequelize.define(
  "Notifikasi",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    sensorDataId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "sensor_data",
        key: "id",
      },
    },
    judul: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pesan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipe: {
      type: DataTypes.ENUM("peringatan", "kritis"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("belum_dibaca", "sudah_dibaca"),
      defaultValue: "belum_dibaca",
    },
    dibaca_pada: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "notifikasi",
    timestamps: true,
  },
);

export default Notifikasi;
