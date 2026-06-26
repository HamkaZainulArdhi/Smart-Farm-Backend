import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const PlantAnalysis = sequelize.define(
  "PlantAnalysis",
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
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    plant_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disease_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    confidence: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    severity: {
      type: DataTypes.ENUM("low", "medium", "high"),
      allowNull: true,
    },
    symptoms: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    causes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    treatment: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    prevention: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ai_response: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "plant_analysis",
    timestamps: true,
  },
);

export default PlantAnalysis;
