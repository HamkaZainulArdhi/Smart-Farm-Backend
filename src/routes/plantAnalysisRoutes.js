import express from "express";
import {
  uploadAndAnalyze,
  getAllAnalyses,
  getAnalysisById,
  updateAnalysis,
  deleteAnalysis,
} from "../controllers/plantAnalysisController.js";
import { authenticate, authorize } from "../middleware/auth.js";
import { uploadSingleImage } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Create/upload and analyze (authenticated)
router.post("/", authenticate, (req, res, next) => {
  uploadSingleImage(req, res, function (err) {
    if (err)
      return res.status(400).json({ success: false, message: err.message });
    return uploadAndAnalyze(req, res, next);
  });
});


router.get("/", authenticate, getAllAnalyses);
router.get("/:id", authenticate, getAnalysisById);
router.put("/:id", authenticate, updateAnalysis);
router.delete("/:id", authenticate, deleteAnalysis);

export default router;
