import path from "path";
import fs from "fs";
import { Op } from "sequelize";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/response.js";
import { PlantAnalysis, User } from "../models/index.js";
import { analyzeImageWithGemini } from "../services/geminiPlantAnalysisService.js";

export const uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file)
      return errorResponse(res, 400, "File gambar tidak ditemukan");

    const imageUrl = `/uploads/plant-analysis/${req.file.filename}`;
    const absolutePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      "plant-analysis",
      req.file.filename,
    );

    // Call Gemini service
    const { raw, parsed } = await analyzeImageWithGemini(absolutePath);

    // Build record data
    const record = await PlantAnalysis.create({
      userId: req.user.userId,
      image_url: imageUrl,
      plant_name: parsed?.plant_name || parsed?.plant || null,
      disease_name: parsed?.disease_name || parsed?.disease || null,
      confidence: parsed?.confidence || parsed?.confidence_percent || null,
      severity: parsed?.severity || null,
      symptoms: parsed?.symptoms || null,
      causes: parsed?.causes || null,
      treatment: parsed?.treatment || null,
      prevention: parsed?.prevention || null,
      ai_response: raw || parsed || null,
    });

    return successResponse(res, 201, "Analisis berhasil", record);
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      500,
      "Gagal melakukan analisis gambar",
      error.message,
    );
  }
};

export const getAllAnalyses = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.search) {
      where[Op.or] = [
        { plant_name: { [Op.like]: `%${req.query.search}%` } },
        { disease_name: { [Op.like]: `%${req.query.search}%` } },
      ];
    }
    if (req.query.disease) where.disease_name = req.query.disease;
    if (req.query.severity) where.severity = req.query.severity;

    const { count, rows } = await PlantAnalysis.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const pagination = {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    };

    return paginatedResponse(res, 200, "Daftar analisis", rows, pagination);
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      500,
      "Gagal mengambil daftar analisis",
      error.message,
    );
  }
};

export const getAnalysisById = async (req, res) => {
  try {
    const { id } = req.params;
    const rec = await PlantAnalysis.findByPk(id);
    if (!rec) return errorResponse(res, 404, "Analisis tidak ditemukan");
    return successResponse(res, 200, "Detail analisis", rec);
  } catch (error) {
    console.error(error);
    return errorResponse(
      res,
      500,
      "Gagal mengambil detail analisis",
      error.message,
    );
  }
};

export const updateAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const rec = await PlantAnalysis.findByPk(id);
    if (!rec) return errorResponse(res, 404, "Analisis tidak ditemukan");

    const updatable = [
      "plant_name",
      "disease_name",
      "confidence",
      "severity",
      "symptoms",
      "causes",
      "treatment",
      "prevention",
    ];

    updatable.forEach((key) => {
      if (req.body[key] !== undefined) rec[key] = req.body[key];
    });

    await rec.save();
    return successResponse(res, 200, "Analisis diperbarui", rec);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Gagal memperbarui analisis", error.message);
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const { id } = req.params;
    const rec = await PlantAnalysis.findByPk(id);
    if (!rec) return errorResponse(res, 404, "Analisis tidak ditemukan");

    // remove file if exists
    try {
      const filepath = path.join(
        process.cwd(),
        "public",
        rec.image_url.replace(/^\//, ""),
      );
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
    } catch (e) {
      // ignore file delete errors
    }

    await rec.destroy();
    return successResponse(res, 200, "Analisis dihapus");
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Gagal menghapus analisis", error.message);
  }
};
