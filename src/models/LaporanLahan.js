import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const LaporanLahan = sequelize.define(
  "LaporanLahan",
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
    tanggal_laporan: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    kondisi_umum: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rata_rata_suhu: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    rata_rata_kelembapan: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    rata_rata_ph: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    rata_rata_intensitas_cahaya: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    anomali_terdeteksi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    saran_perbaikan: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    periode_awal: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    periode_akhir: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "laporan_lahan",
    timestamps: true,
  },
);

export default LaporanLahan;
