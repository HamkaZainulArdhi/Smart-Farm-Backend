import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const NilaiNormal = sequelize.define(
  "NilaiNormal",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sensorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "sensor",
        key: "id",
      },
    },
    nilai_min: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Nilai minimum normal",
    },
    nilai_max: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Nilai maksimum normal",
    },
    nilai_peringatan_min: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Nilai minimum peringatan (di bawah normal)",
    },
    nilai_peringatan_max: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Nilai maksimum peringatan (di atas normal)",
    },
    nilai_kritis_min: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Nilai minimum kritis",
    },
    nilai_kritis_max: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      comment: "Nilai maksimum kritis",
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "nilai_normal",
    timestamps: true,
  },
);

export default NilaiNormal;
