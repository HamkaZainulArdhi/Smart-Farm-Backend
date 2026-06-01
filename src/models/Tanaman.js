import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const Tanaman = sequelize.define(
  "Tanaman",
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
    nama_tanaman: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jenis_tanaman: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tanggal_tanam: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estimasi_panen: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    luas_tanaman: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    varietas: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        "perencanaan",
        "tanam",
        "berkembang",
        "siap_panen",
        "selesai",
      ),
      defaultValue: "tanam",
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "tanaman",
    timestamps: true,
  },
);

export default Tanaman;
