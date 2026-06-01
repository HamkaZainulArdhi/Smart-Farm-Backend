import express from "express";
import { authenticate } from "../middleware/auth.js";
import * as notifikasiController from "../controllers/notifikasiController.js";

const router = express.Router();

// All notification routes require authentication
router.use(authenticate);

router.get("/statistics", notifikasiController.getNotifikasiStatistics);
router.get("/unread/count", notifikasiController.getUnreadCount);
router.put("/read-all", notifikasiController.markAllAsRead);
router.get("/", notifikasiController.getNotifikasi);
router.get("/:notifikasiId", notifikasiController.getNotifikasiById);
router.put("/:notifikasiId/read", notifikasiController.markAsRead);
router.delete("/:notifikasiId", notifikasiController.deleteNotifikasi);

export default router;
