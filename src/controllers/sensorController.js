import { Sensor, SensorData, NilaiNormal, Lahan, Notifikasi } from '../models/index.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { Op } from 'sequelize';

export const createSensor = async (req, res) => {
  try {
    const { lahanId, nama_sensor, tipe_sensor, kode_sensor, lokasi_sensor, status, tipe_koneksi, deskripsi } = req.validatedData;

    // Verify lahan exists and user has access
    const lahan = await Lahan.findByPk(lahanId);
    if (!lahan) {
      return errorResponse(res, 404, 'Lahan tidak ditemukan');
    }

    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses ke lahan ini');
    }

    // Check for duplicate kode_sensor
    const existingSensor = await Sensor.findOne({ where: { kode_sensor } });
    if (existingSensor) {
      return errorResponse(res, 409, 'Kode sensor sudah terdaftar');
    }

    const sensor = await Sensor.create({
      lahanId,
      nama_sensor,
      tipe_sensor,
      kode_sensor,
      lokasi_sensor,
      status: status || 'aktif',
      tipe_koneksi,
      deskripsi,
    });

    successResponse(res, 201, 'Sensor berhasil dibuat', sensor);
  } catch (error) {
    errorResponse(res, 500, 'Error membuat sensor', error.message);
  }
};

export const getSensors = async (req, res) => {
  try {
    const { lahanId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const lahan = await Lahan.findByPk(lahanId);
    if (!lahan) {
      return errorResponse(res, 404, 'Lahan tidak ditemukan');
    }

    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses ke lahan ini');
    }

    const { count, rows } = await Sensor.findAndCountAll({
      where: { lahanId },
      include: [
        {
          association: 'nilai_normal',
          attributes: ['id', 'nilai_min', 'nilai_max', 'nilai_peringatan_min', 'nilai_peringatan_max'],
        },
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    paginatedResponse(res, 200, 'Daftar sensor berhasil diambil', rows, {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    });
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil daftar sensor', error.message);
  }
};

export const getSensorById = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const sensor = await Sensor.findByPk(sensorId, {
      include: [
        {
          association: 'nilai_normal',
          attributes: ['id', 'nilai_min', 'nilai_max', 'nilai_peringatan_min', 'nilai_peringatan_max', 'nilai_kritis_min', 'nilai_kritis_max'],
        },
      ],
    });

    if (!sensor) {
      return errorResponse(res, 404, 'Sensor tidak ditemukan');
    }

    // Check authorization
    const lahan = await Lahan.findByPk(sensor.lahanId);
    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses ke sensor ini');
    }

    successResponse(res, 200, 'Detail sensor berhasil diambil', sensor);
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil detail sensor', error.message);
  }
};

export const updateSensor = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const { nama_sensor, status, lokasi_sensor, deskripsi } = req.body;

    const sensor = await Sensor.findByPk(sensorId);

    if (!sensor) {
      return errorResponse(res, 404, 'Sensor tidak ditemukan');
    }

    // Check authorization
    const lahan = await Lahan.findByPk(sensor.lahanId);
    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses untuk mengupdate sensor ini');
    }

    if (nama_sensor) sensor.nama_sensor = nama_sensor;
    if (status) sensor.status = status;
    if (lokasi_sensor) sensor.lokasi_sensor = lokasi_sensor;
    if (deskripsi) sensor.deskripsi = deskripsi;

    await sensor.save();

    successResponse(res, 200, 'Sensor berhasil diupdate', sensor);
  } catch (error) {
    errorResponse(res, 500, 'Error mengupdate sensor', error.message);
  }
};

export const deleteSensor = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const sensor = await Sensor.findByPk(sensorId);

    if (!sensor) {
      return errorResponse(res, 404, 'Sensor tidak ditemukan');
    }

    // Check authorization
    const lahan = await Lahan.findByPk(sensor.lahanId);
    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses untuk menghapus sensor ini');
    }

    await sensor.destroy();

    successResponse(res, 200, 'Sensor berhasil dihapus');
  } catch (error) {
    errorResponse(res, 500, 'Error menghapus sensor', error.message);
  }
};

export const getLastSensorData = async (req, res) => {
  try {
    const { sensorId } = req.params;

    const sensor = await Sensor.findByPk(sensorId);
    if (!sensor) {
      return errorResponse(res, 404, 'Sensor tidak ditemukan');
    }

    // Check authorization
    const lahan = await Lahan.findByPk(sensor.lahanId);
    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses');
    }

    const lastData = await SensorData.findOne({
      where: { sensorId },
      order: [['tanggal_pencatatan', 'DESC']],
      limit: 1,
    });

    if (!lastData) {
      return errorResponse(res, 404, 'Data sensor tidak ditemukan');
    }

    successResponse(res, 200, 'Data sensor terbaru berhasil diambil', lastData);
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil data sensor', error.message);
  }
};
