import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const SensorData = sequelize.define(
  "SensorData",
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
    nilai: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    satuan: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Celsius, %, pH, Lux, etc",
    },
    status_kondisi: {
      type: DataTypes.ENUM("normal", "peringatan", "kritis"),
      defaultValue: "normal",
    },
    tanggal_pencatatan: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "sensor_data",
    timestamps: false,
  },
);

export default SensorData;
