import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const Lahan = sequelize.define(
  "Lahan",
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
    nama_lahan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lokasi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    luas_lahan: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      comment: "Dalam meter persegi",
    },
    jenis_tanah: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    koordinat_latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    koordinat_longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "lahan",
    timestamps: true,
  },
);

export default Lahan;
