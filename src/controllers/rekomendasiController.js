import { Rekomendasi, Notifikasi, User, SensorData, Sensor } from '../models/index.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { Op } from 'sequelize';

export const createRekomendasi = async (req, res) => {
  try {
    const { notifikasiId, judul_rekomendasi, deskripsi_tindakan, prioritas } = req.validatedData;

    // Check if user is penyuluh
    if (req.user.role !== 'penyuluh' && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Hanya penyuluh yang dapat membuat rekomendasi');
    }

    // Verify notifikasi exists
    const notifikasi = await Notifikasi.findByPk(notifikasiId);
    if (!notifikasi) {
      return errorResponse(res, 404, 'Notifikasi tidak ditemukan');
    }

    const rekomendasi = await Rekomendasi.create({
      notifikasiId,
      penyuluhId: req.user.userId,
      judul_rekomendasi,
      deskripsi_tindakan,
      prioritas: prioritas || 'sedang',
    });

    successResponse(res, 201, 'Rekomendasi berhasil dibuat', rekomendasi);
  } catch (error) {
    errorResponse(res, 500, 'Error membuat rekomendasi', error.message);
  }
};

export const getRekomendasis = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { status, prioritas, tipe_filter } = req.query;

    let whereClause = {};

    if (status) whereClause.status = status;
    if (prioritas) whereClause.prioritas = prioritas;

    // Filter by user role
    if (req.user.role === 'petani') {
      // Petani hanya melihat rekomendasi untuk lahannya
      const lahanIds = await getLahanIdsForUser(req.user.userId);
      // Ini akan difilter di join
    }

    const { count, rows } = await Rekomendasi.findAndCountAll({
      where: whereClause,
      include: [
        {
          association: 'notifikasi',
          include: [
            {
              association: 'sensor_data',
              include: [{ association: 'sensor' }],
            },
          ],
        },
        {
          association: 'penyuluh',
          attributes: ['id', 'nama', 'email'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    paginatedResponse(res, 200, 'Daftar rekomendasi berhasil diambil', rows, {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    });
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil rekomendasi', error.message);
  }
};

export const getRekomendasiById = async (req, res) => {
  try {
    const { rekomendasiId } = req.params;

    const rekomendasi = await Rekomendasi.findByPk(rekomendasiId, {
      include: [
        {
          association: 'notifikasi',
          include: [
            {
              association: 'sensor_data',
              include: [{ association: 'sensor' }],
            },
          ],
        },
        {
          association: 'penyuluh',
          attributes: ['id', 'nama', 'email'],
        },
      ],
    });

    if (!rekomendasi) {
      return errorResponse(res, 404, 'Rekomendasi tidak ditemukan');
    }

    successResponse(res, 200, 'Detail rekomendasi berhasil diambil', rekomendasi);
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil detail rekomendasi', error.message);
  }
};

export const updateRekomendasiStatus = async (req, res) => {
  try {
    const { rekomendasiId } = req.params;
    const { status } = req.validatedData;

    const rekomendasi = await Rekomendasi.findByPk(rekomendasiId);

    if (!rekomendasi) {
      return errorResponse(res, 404, 'Rekomendasi tidak ditemukan');
    }

    // Check authorization - petani can update status
    if (req.user.role === 'petani') {
      const notifikasi = await Notifikasi.findByPk(rekomendasi.notifikasiId);
      if (notifikasi.userId !== req.user.userId) {
        return errorResponse(res, 403, 'Anda tidak memiliki akses');
      }
    }

    rekomendasi.status = status;
    await rekomendasi.save();

    successResponse(res, 200, 'Status rekomendasi berhasil diupdate', rekomendasi);
  } catch (error) {
    errorResponse(res, 500, 'Error mengupdate status rekomendasi', error.message);
  }
};

export const approveRekomendasi = async (req, res) => {
  try {
    const { rekomendasiId } = req.params;
    const { status_approval } = req.validatedData;

    // Check if user is petani or admin
    if (req.user.role === 'petani') {
      const rekomendasi = await Rekomendasi.findByPk(rekomendasiId);
      const notifikasi = await Notifikasi.findByPk(rekomendasi.notifikasiId);
      if (notifikasi.userId !== req.user.userId) {
        return errorResponse(res, 403, 'Anda tidak memiliki akses');
      }
    }

    const rekomendasi = await Rekomendasi.findByPk(rekomendasiId);

    if (!rekomendasi) {
      return errorResponse(res, 404, 'Rekomendasi tidak ditemukan');
    }

    rekomendasi.status_approval = status_approval;
    rekomendasi.tanggal_approval = new Date();
    await rekomendasi.save();

    successResponse(res, 200, 'Rekomendasi berhasil di-approve', rekomendasi);
  } catch (error) {
    errorResponse(res, 500, 'Error approve rekomendasi', error.message);
  }
};

export const deleteRekomendasi = async (req, res) => {
  try {
    const { rekomendasiId } = req.params;

    const rekomendasi = await Rekomendasi.findByPk(rekomendasiId);

    if (!rekomendasi) {
      return errorResponse(res, 404, 'Rekomendasi tidak ditemukan');
    }

    // Check authorization
    if (req.user.role === 'penyuluh' && rekomendasi.penyuluhId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses');
    }

    await rekomendasi.destroy();

    successResponse(res, 200, 'Rekomendasi berhasil dihapus');
  } catch (error) {
    errorResponse(res, 500, 'Error menghapus rekomendasi', error.message);
  }
};

async function getLahanIdsForUser(userId) {
  // Helper function to get all lahan IDs for a user
  const user = await User.findByPk(userId);
  if (!user || user.role !== 'petani') return [];

  const lahans = await user.getLahans({ attributes: ['id'], raw: true });
  return lahans.map((l) => l.id);
}
