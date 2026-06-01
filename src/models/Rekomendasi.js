import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const Rekomendasi = sequelize.define(
  "Rekomendasi",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    notifikasiId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "notifikasi",
        key: "id",
      },
    },
    penyuluhId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
      comment: "Penyuluh yang memberikan rekomendasi",
    },
    judul_rekomendasi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi_tindakan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    prioritas: {
      type: DataTypes.ENUM("rendah", "sedang", "tinggi"),
      defaultValue: "sedang",
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "sedang_dikerjakan",
        "selesai",
        "ditolak",
      ),
      defaultValue: "pending",
    },
    status_approval: {
      type: DataTypes.ENUM("menunggu", "disetujui", "ditolak"),
      defaultValue: "menunggu",
    },
    tanggal_approval: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: "rekomendasi",
    timestamps: true,
  },
);

export default Rekomendasi;
