import { Lahan, Tanaman, Sensor } from "../models/index.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/response.js";
import { Op } from "sequelize";

export const createLahan = async (req, res) => {
  try {
    const {
      nama_lahan,
      lokasi,
      luas_lahan,
      jenis_tanah,
      koordinat_latitude,
      koordinat_longitude,
      deskripsi,
    } = req.validatedData;

    const lahan = await Lahan.create({
      userId: req.user.userId,
      nama_lahan,
      lokasi,
      luas_lahan,
      jenis_tanah,
      koordinat_latitude,
      koordinat_longitude,
      deskripsi,
    });

    successResponse(res, 201, "Lahan berhasil dibuat", lahan);
  } catch (error) {
    errorResponse(res, 500, "Error membuat lahan", error.message);
  }
};

export const getLahans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let whereClause = {};
    if (req.user.role === "petani") {
      whereClause.userId = req.user.userId;
    }

    const { count, rows } = await Lahan.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [
        { association: "taman", attributes: ["id", "nama_tanaman", "status"] },
        {
          association: "sensor",
          attributes: ["id", "nama_sensor", "tipe_sensor"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    paginatedResponse(res, 200, "Daftar lahan berhasil diambil", rows, {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    });
  } catch (error) {
    errorResponse(res, 500, "Error mengambil daftar lahan", error.message);
  }
};

export const getLahanById = async (req, res) => {
  try {
    const { lahanId } = req.params;

    const lahan = await Lahan.findByPk(lahanId, {
      include: [
        {
          association: "taman",
          attributes: [
            "id",
            "nama_tanaman",
            "jenis_tanaman",
            "status",
            "tanggal_tanam",
          ],
        },
        {
          association: "sensor",
          attributes: ["id", "nama_sensor", "tipe_sensor", "status"],
        },
      ],
    });

    if (!lahan) {
      return errorResponse(res, 404, "Lahan tidak ditemukan");
    }

    // Check authorization for petani
    if (req.user.role === "petani" && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, "Anda tidak memiliki akses ke lahan ini");
    }

    successResponse(res, 200, "Detail lahan berhasil diambil", lahan);
  } catch (error) {
    errorResponse(res, 500, "Error mengambil detail lahan", error.message);
  }
};

export const updateLahan = async (req, res) => {
  try {
    const { lahanId } = req.params;
    const {
      nama_lahan,
      lokasi,
      luas_lahan,
      jenis_tanah,
      koordinat_latitude,
      koordinat_longitude,
      deskripsi,
    } = req.validatedData;

    const lahan = await Lahan.findByPk(lahanId);

    if (!lahan) {
      return errorResponse(res, 404, "Lahan tidak ditemukan");
    }

    // Check authorization
    if (req.user.role === "petani" && lahan.userId !== req.user.userId) {
      return errorResponse(
        res,
        403,
        "Anda tidak memiliki akses untuk mengupdate lahan ini",
      );
    }

    if (nama_lahan) lahan.nama_lahan = nama_lahan;
    if (lokasi) lahan.lokasi = lokasi;
    if (luas_lahan) lahan.luas_lahan = luas_lahan;
    if (jenis_tanah) lahan.jenis_tanah = jenis_tanah;
    if (koordinat_latitude) lahan.koordinat_latitude = koordinat_latitude;
    if (koordinat_longitude) lahan.koordinat_longitude = koordinat_longitude;
    if (deskripsi) lahan.deskripsi = deskripsi;

    await lahan.save();

    successResponse(res, 200, "Lahan berhasil diupdate", lahan);
  } catch (error) {
    errorResponse(res, 500, "Error mengupdate lahan", error.message);
  }
};

export const deleteLahan = async (req, res) => {
  try {
    const { lahanId } = req.params;

    const lahan = await Lahan.findByPk(lahanId);

    if (!lahan) {
      return errorResponse(res, 404, "Lahan tidak ditemukan");
    }

    // Check authorization
    if (req.user.role === "petani" && lahan.userId !== req.user.userId) {
      return errorResponse(
        res,
        403,
        "Anda tidak memiliki akses untuk menghapus lahan ini",
      );
    }

    await lahan.destroy();

    successResponse(res, 200, "Lahan berhasil dihapus");
  } catch (error) {
    errorResponse(res, 500, "Error menghapus lahan", error.message);
  }
};

export const getLahanStatistics = async (req, res) => {
  try {
    const { lahanId } = req.params;

    const lahan = await Lahan.findByPk(lahanId);

    if (!lahan) {
      return errorResponse(res, 404, "Lahan tidak ditemukan");
    }

    const tanaman = await Tanaman.count({ where: { lahanId } });
    const sensor = await Sensor.count({ where: { lahanId } });

    successResponse(res, 200, "Statistik lahan berhasil diambil", {
      lahanId,
      totalTanaman: tanaman,
      totalSensor: sensor,
      luasLahan: lahan.luas_lahan,
      lokasi: lahan.lokasi,
    });
  } catch (error) {
    errorResponse(res, 500, "Error mengambil statistik lahan", error.message);
  }
};
