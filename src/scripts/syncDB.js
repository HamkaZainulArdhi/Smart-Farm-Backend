import sequelize from "../config/config.js";
import { User } from "../models/index.js";

const shouldAlterDatabase = process.env.DB_SYNC_ALTER === "true";

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync({
      alter: shouldAlterDatabase,
    });

    
    await User.findOrCreate({
      where: { email: "admin@agritech.com" },
      defaults: {
        nama: "Admin",
        password: "admin123",
        nomor_telepon: "0812345678",
        alamat: "Indonesia",
        role: "admin",
      },
    });

    console.log("Database synchronized horeeee");
    process.exit(0);
  } catch (error) {
    console.error("Sync error:", error.message);
    process.exit(1);
  }
};

syncDatabase();
