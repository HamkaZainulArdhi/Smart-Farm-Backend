import { User, Lahan, Sensor, SensorData, Notifikasi } from '../models/index.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { Op, fn, col } from 'sequelize';

export const getSystemStatistics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalPetani = await User.count({ where: { role: 'petani' } });
    const totalPenyuluh = await User.count({ where: { role: 'penyuluh' } });
    const totalLahan = await Lahan.count();
    const totalSensor = await Sensor.count();
    const totalSensorData = await SensorData.count();
    const totalNotifikasi = await Notifikasi.count();

    const sensorDataHariIni = await SensorData.count({
      where: {
        tanggal_pencatatan: {
          [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
          [Op.lte]: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
    });

    const notifikasiKritis = await Notifikasi.count({
      where: { tipe: 'kritis' },
    });

    const notifikasiPeringatan = await Notifikasi.count({
      where: { tipe: 'peringatan' },
    });

    successResponse(res, 200, 'Statistik sistem berhasil diambil', {
      user: {
        total: totalUsers,
        petani: totalPetani,
        penyuluh: totalPenyuluh,
      },
      lahan: totalLahan,
      sensor: totalSensor,
      sensorData: {
        total: totalSensorData,
        hariIni: sensorDataHariIni,
      },
      notifikasi: {
        total: totalNotifikasi,
        kritis: notifikasiKritis,
        peringatan: notifikasiPeringatan,
      },
    });
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil statistik sistem', error.message);
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { role, aktif } = req.query;

    let whereClause = {};
    if (role) whereClause.role = role;
    if (aktif !== undefined) whereClause.aktif = aktif === 'true';

    const { count, rows } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    paginatedResponse(res, 200, 'Daftar user berhasil diambil', rows, {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    });
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil daftar user', error.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [
        {
          association: 'lahans',
          attributes: ['id', 'nama_lahan', 'lokasi'],
        },
      ],
    });

    if (!user) {
      return errorResponse(res, 404, 'User tidak ditemukan');
    }

    successResponse(res, 200, 'Detail user berhasil diambil', user);
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil detail user', error.message);
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);

    if (!user) {
      return errorResponse(res, 404, 'User tidak ditemukan');
    }

    user.aktif = false;
    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    successResponse(res, 200, 'User berhasil dinonaktifkan', userResponse);
  } catch (error) {
    errorResponse(res, 500, 'Error menonaktifkan user', error.message);
  }
};

export const reactivateUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);

    if (!user) {
      return errorResponse(res, 404, 'User tidak ditemukan');
    }

    user.aktif = true;
    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    successResponse(res, 200, 'User berhasil diaktifkan kembali', userResponse);
  } catch (error) {
    errorResponse(res, 500, 'Error mengaktifkan user', error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin dari menghapus dirinya sendiri
    if (userId === req.user.userId) {
      return errorResponse(res, 400, 'Anda tidak bisa menghapus akun sendiri');
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return errorResponse(res, 404, 'User tidak ditemukan');
    }

    await user.destroy();

    successResponse(res, 200, 'User berhasil dihapus');
  } catch (error) {
    errorResponse(res, 500, 'Error menghapus user', error.message);
  }
};

export const getAllLahans = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const { count, rows } = await Lahan.findAndCountAll({
      include: [
        {
          association: 'pemilik',
          attributes: ['id', 'nama', 'email'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    paginatedResponse(res, 200, 'Daftar semua lahan berhasil diambil', rows, {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    });
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil daftar lahan', error.message);
  }
};

export const getAllSensors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { status, tipe_sensor } = req.query;

    let whereClause = {};
    if (status) whereClause.status = status;
    if (tipe_sensor) whereClause.tipe_sensor = tipe_sensor;

    const { count, rows } = await Sensor.findAndCountAll({
      where: whereClause,
      include: [
        {
          association: 'lahan',
          attributes: ['id', 'nama_lahan'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    paginatedResponse(res, 200, 'Daftar semua sensor berhasil diambil', rows, {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    });
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil daftar sensor', error.message);
  }
};

export const getSystemActivity = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get daily sensor data count
    const sensorDataActivity = await SensorData.findAll({
      where: {
        tanggal_pencatatan: {
          [Op.gte]: startDate,
        },
      },
      attributes: [
        [fn('DATE', col('tanggal_pencatatan')), 'date'],
        [fn('COUNT', '*'), 'count'],
      ],
      group: [fn('DATE', col('tanggal_pencatatan'))],
      raw: true,
      order: [[fn('DATE', col('tanggal_pencatatan')), 'ASC']],
    });

    // Get daily notification count
    const notifikasiActivity = await Notifikasi.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate,
        },
      },
      attributes: [
        [fn('DATE', col('createdAt')), 'date'],
        [fn('COUNT', '*'), 'count'],
      ],
      group: [fn('DATE', col('createdAt'))],
      raw: true,
      order: [[fn('DATE', col('createdAt')), 'ASC']],
    });

    successResponse(res, 200, 'Aktivitas sistem berhasil diambil', {
      period_days: days,
      sensorDataActivity,
      notifikasiActivity,
    });
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil aktivitas sistem', error.message);
  }
};
