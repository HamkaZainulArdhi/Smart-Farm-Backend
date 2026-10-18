import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import sequelize from "./config/config.js";
import { startCronJobs } from "./services/monitoringService.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import lahanRoutes from "./routes/lahanRoutes.js";
import tanamanRoutes from "./routes/tanamanRoutes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import notifikasiRoutes from "./routes/notifikasiRoutes.js";
import rekomendasiRoutes from "./routes/rekomendasiRoutes.js";
import laporanRoutes from "./routes/laporanRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import plantAnalysisRoutes from "./routes/plantAnalysisRoutes.js";
import swaggerUi from "swagger-ui-express";
import { openapiSpec } from "./docs/openapi.js";

// Initialize environment
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const shouldSyncDatabase = process.env.DB_SYNC_ON_START === "true";
const shouldAlterDatabase = process.env.DB_SYNC_ALTER === "true";

// Middleware
// NOTE: contentSecurityPolicy dinonaktifkan agar Swagger UI (/docs) dapat memuat inline JS/CSS.
// Tidak mengubah perilaku auth/routing/controller.
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(express.static("public"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Swagger/OpenAPI — baseline API documentation (tanpa mengubah route existing)
app.get("/docs.json", (req, res) => {
  res.status(200).json(openapiSpec);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/lahan", lahanRoutes);
app.use("/api/tanaman", tanamanRoutes);
app.use("/api/sensor", sensorRoutes);
app.use("/api/notifikasi", notifikasiRoutes);
app.use("/api/rekomendasi", rekomendasiRoutes);
app.use("/api/laporan", laporanRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/plant-analysis", plantAnalysisRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
    timestamp: new Date().toISOString(),
  });
});

// Error Handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    timestamp: new Date().toISOString(),
  });
});

// Database sync and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();

    if (shouldSyncDatabase) {
      await sequelize.sync({ alter: shouldAlterDatabase });
    }

    startCronJobs();
    console.log(`Server is running on port ${PORT}`);
    app.listen(PORT);
  } catch (error) {
    console.error("Startup error:");
    console.error(error);
    process.exit(1);
  }
};

startServer();
