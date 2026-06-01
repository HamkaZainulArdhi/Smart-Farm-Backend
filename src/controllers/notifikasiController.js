import {
  Notifikasi,
  Rekomendasi,
  SensorData,
  Sensor,
} from "../models/index.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/response.js";
import { Op } from "sequelize";

export const getNotifikasi = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { status, tipe } = req.query;

    let whereClause = { userId: req.user.userId };

    if (status) whereClause.status = status;
    if (tipe) whereClause.tipe = tipe;

    const { count, rows } = await Notifikasi.findAndCountAll({
      where: whereClause,
      include: [
        {
          association: "sensor_data",
          include: [{ association: "sensor" }],
        },
        {
          association: "rekomendasi",
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    paginatedResponse(res, 200, "Daftar notifikasi berhasil diambil", rows, {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    });
  } catch (error) {
    errorResponse(res, 500, "Error mengambil notifikasi", error.message);
  }
};

export const getNotifikasiById = async (req, res) => {
  try {
    const { notifikasiId } = req.params;

    const notifikasi = await Notifikasi.findByPk(notifikasiId, {
      include: [
        {
          association: "sensor_data",
          include: [{ association: "sensor" }],
        },
        {
          association: "rekomendasi",
        },
      ],
    });

    if (!notifikasi) {
      return errorResponse(res, 404, "Notifikasi tidak ditemukan");
    }

    // Check authorization
    if (
      notifikasi.userId !== req.user.userId &&
      req.user.role !== "penyuluh" &&
      req.user.role !== "admin"
    ) {
      return errorResponse(res, 403, "Anda tidak memiliki akses");
    }

    successResponse(res, 200, "Detail notifikasi berhasil diambil", notifikasi);
  } catch (error) {
    errorResponse(res, 500, "Error mengambil detail notifikasi", error.message);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { notifikasiId } = req.params;

    const notifikasi = await Notifikasi.findByPk(notifikasiId);

    if (!notifikasi) {
      return errorResponse(res, 404, "Notifikasi tidak ditemukan");
    }

    // Check authorization
    if (notifikasi.userId !== req.user.userId) {
      return errorResponse(res, 403, "Anda tidak memiliki akses");
    }

    notifikasi.status = "sudah_dibaca";
    notifikasi.dibaca_pada = new Date();
    await notifikasi.save();

    successResponse(
      res,
      200,
      "Notifikasi ditandai sebagai sudah dibaca",
      notifikasi,
    );
  } catch (error) {
    errorResponse(res, 500, "Error menandai notifikasi", error.message);
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notifikasi.update(
      { status: "sudah_dibaca", dibaca_pada: new Date() },
      { where: { userId: req.user.userId, status: "belum_dibaca" } },
    );

    successResponse(res, 200, "Semua notifikasi ditandai sebagai sudah dibaca");
  } catch (error) {
    errorResponse(res, 500, "Error menandai notifikasi", error.message);
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notifikasi.count({
      where: { userId: req.user.userId, status: "belum_dibaca" },
    });

    successResponse(res, 200, "Jumlah notifikasi belum dibaca", {
      unreadCount: count,
    });
  } catch (error) {
    errorResponse(res, 500, "Error mengambil jumlah notifikasi", error.message);
  }
};

export const deleteNotifikasi = async (req, res) => {
  try {
    const { notifikasiId } = req.params;

    const notifikasi = await Notifikasi.findByPk(notifikasiId);

    if (!notifikasi) {
      return errorResponse(res, 404, "Notifikasi tidak ditemukan");
    }

    // Check authorization
    if (notifikasi.userId !== req.user.userId && req.user.role !== "admin") {
      return errorResponse(res, 403, "Anda tidak memiliki akses");
    }

    await notifikasi.destroy();

    successResponse(res, 200, "Notifikasi berhasil dihapus");
  } catch (error) {
    errorResponse(res, 500, "Error menghapus notifikasi", error.message);
  }
};

export const getNotifikasiStatistics = async (req, res) => {
  try {
    const totalNotifikasi = await Notifikasi.count({
      where: { userId: req.user.userId },
    });

    const belumDibaca = await Notifikasi.count({
      where: { userId: req.user.userId, status: "belum_dibaca" },
    });

    const kritis = await Notifikasi.count({
      where: { userId: req.user.userId, tipe: "kritis" },
    });

    const peringatan = await Notifikasi.count({
      where: { userId: req.user.userId, tipe: "peringatan" },
    });

    successResponse(res, 200, "Statistik notifikasi berhasil diambil", {
      total: totalNotifikasi,
      belumDibaca,
      kritis,
      peringatan,
    });
  } catch (error) {
    errorResponse(
      res,
      500,
      "Error mengambil statistik notifikasi",
      error.message,
    );
  }
};
