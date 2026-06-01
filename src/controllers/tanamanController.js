import { Tanaman, Lahan } from '../models/index.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';

export const createTanaman = async (req, res) => {
  try {
    const { lahanId, nama_tanaman, jenis_tanaman, tanggal_tanam, estimasi_panen, luas_tanaman, varietas, status, deskripsi } = req.validatedData;

    // Verify lahan exists
    const lahan = await Lahan.findByPk(lahanId);
    if (!lahan) {
      return errorResponse(res, 404, 'Lahan tidak ditemukan');
    }

    // Check authorization
    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses ke lahan ini');
    }

    const tanaman = await Tanaman.create({
      lahanId,
      nama_tanaman,
      jenis_tanaman,
      tanggal_tanam,
      estimasi_panen,
      luas_tanaman,
      varietas,
      status: status || 'tanam',
      deskripsi,
    });

    successResponse(res, 201, 'Tanaman berhasil ditambahkan', tanaman);
  } catch (error) {
    errorResponse(res, 500, 'Error menambahkan tanaman', error.message);
  }
};

export const getTamans = async (req, res) => {
  try {
    const { lahanId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Verify lahan exists
    const lahan = await Lahan.findByPk(lahanId);
    if (!lahan) {
      return errorResponse(res, 404, 'Lahan tidak ditemukan');
    }

    // Check authorization
    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses ke lahan ini');
    }

    const { count, rows } = await Tanaman.findAndCountAll({
      where: { lahanId },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    paginatedResponse(res, 200, 'Daftar tanaman berhasil diambil', rows, {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    });
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil daftar tanaman', error.message);
  }
};

export const getTanamanById = async (req, res) => {
  try {
    const { tanamanId } = req.params;

    const tanaman = await Tanaman.findByPk(tanamanId);

    if (!tanaman) {
      return errorResponse(res, 404, 'Tanaman tidak ditemukan');
    }

    // Check authorization
    const lahan = await Lahan.findByPk(tanaman.lahanId);
    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses');
    }

    successResponse(res, 200, 'Detail tanaman berhasil diambil', tanaman);
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil detail tanaman', error.message);
  }
};

export const updateTanaman = async (req, res) => {
  try {
    const { tanamanId } = req.params;
    const { nama_tanaman, jenis_tanaman, estimasi_panen, luas_tanaman, varietas, status, deskripsi } = req.body;

    const tanaman = await Tanaman.findByPk(tanamanId);

    if (!tanaman) {
      return errorResponse(res, 404, 'Tanaman tidak ditemukan');
    }

    // Check authorization
    const lahan = await Lahan.findByPk(tanaman.lahanId);
    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses untuk mengupdate tanaman ini');
    }

    if (nama_tanaman) tanaman.nama_tanaman = nama_tanaman;
    if (jenis_tanaman) tanaman.jenis_tanaman = jenis_tanaman;
    if (estimasi_panen) tanaman.estimasi_panen = estimasi_panen;
    if (luas_tanaman) tanaman.luas_tanaman = luas_tanaman;
    if (varietas) tanaman.varietas = varietas;
    if (status) tanaman.status = status;
    if (deskripsi) tanaman.deskripsi = deskripsi;

    await tanaman.save();

    successResponse(res, 200, 'Tanaman berhasil diupdate', tanaman);
  } catch (error) {
    errorResponse(res, 500, 'Error mengupdate tanaman', error.message);
  }
};

export const deleteTanaman = async (req, res) => {
  try {
    const { tanamanId } = req.params;

    const tanaman = await Tanaman.findByPk(tanamanId);

    if (!tanaman) {
      return errorResponse(res, 404, 'Tanaman tidak ditemukan');
    }

    // Check authorization
    const lahan = await Lahan.findByPk(tanaman.lahanId);
    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses untuk menghapus tanaman ini');
    }

    await tanaman.destroy();

    successResponse(res, 200, 'Tanaman berhasil dihapus');
  } catch (error) {
    errorResponse(res, 500, 'Error menghapus tanaman', error.message);
  }
};
