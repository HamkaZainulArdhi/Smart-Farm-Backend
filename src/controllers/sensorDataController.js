import { SensorData, Sensor, NilaiNormal, Notifikasi, Lahan, User } from '../models/index.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.js';
import { Op } from 'sequelize';

const checkSensorValueStatus = (nilai, nilaiNormal) => {
  if (!nilaiNormal) return 'normal';

  if (nilaiNormal.nilai_kritis_min && nilai < nilaiNormal.nilai_kritis_min) return 'kritis';
  if (nilaiNormal.nilai_kritis_max && nilai > nilaiNormal.nilai_kritis_max) return 'kritis';
  if (nilaiNormal.nilai_peringatan_min && nilai < nilaiNormal.nilai_peringatan_min) return 'peringatan';
  if (nilaiNormal.nilai_peringatan_max && nilai > nilaiNormal.nilai_peringatan_max) return 'peringatan';

  return 'normal';
};

export const inputSensorData = async (req, res) => {
  try {
    const { sensorId, nilai, satuan, tanggal_pencatatan } = req.validatedData;

    // Verify sensor exists
    const sensor = await Sensor.findByPk(sensorId, {
      include: [{ model: Lahan, as: 'lahan' }],
    });

    if (!sensor) {
      return errorResponse(res, 404, 'Sensor tidak ditemukan');
    }

    // Check authorization
    const lahan = sensor.lahan;
    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses');
    }

    // Get nilai normal
    const nilaiNormal = await NilaiNormal.findOne({ where: { sensorId } });

    // Check status
    const status_kondisi = checkSensorValueStatus(nilai, nilaiNormal);

    // Create sensor data
    const sensorData = await SensorData.create({
      sensorId,
      nilai,
      satuan,
      status_kondisi,
      tanggal_pencatatan: tanggal_pencatatan || new Date(),
    });

    // Create notification if status is peringatan or kritis
    if (status_kondisi !== 'normal') {
      const user = await User.findByPk(lahan.userId);

      const tipeNotifikasi = status_kondisi === 'kritis' ? 'kritis' : 'peringatan';
      const judulNotifikasi = `${status_kondisi === 'kritis' ? 'PERINGATAN KRITIS' : 'PERINGATAN'}: ${sensor.nama_sensor}`;

      await Notifikasi.create({
        userId: user.id,
        sensorDataId: sensorData.id,
        judul: judulNotifikasi,
        pesan: `Nilai sensor ${sensor.nama_sensor} menunjukkan kondisi ${status_kondisi}: ${nilai} ${satuan}`,
        tipe: tipeNotifikasi,
      });
    }

    successResponse(res, 201, 'Data sensor berhasil diinput', sensorData);
  } catch (error) {
    errorResponse(res, 500, 'Error menginput data sensor', error.message);
  }
};

export const getSensorDataHistory = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;
    const { dari_tanggal, sampai_tanggal } = req.query;

    // Verify sensor exists
    const sensor = await Sensor.findByPk(sensorId);
    if (!sensor) {
      return errorResponse(res, 404, 'Sensor tidak ditemukan');
    }

    // Check authorization
    const lahan = await Lahan.findByPk(sensor.lahanId);
    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses');
    }

    // Build where clause
    let whereClause = { sensorId };
    if (dari_tanggal && sampai_tanggal) {
      whereClause.tanggal_pencatatan = {
        [Op.gte]: new Date(dari_tanggal),
        [Op.lte]: new Date(sampai_tanggal),
      };
    }

    const { count, rows } = await SensorData.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['tanggal_pencatatan', 'DESC']],
    });

    paginatedResponse(res, 200, 'Histori data sensor berhasil diambil', rows, {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    });
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil histori data sensor', error.message);
  }
};

export const getSensorStatistics = async (req, res) => {
  try {
    const { sensorId } = req.params;
    const { dari_tanggal, sampai_tanggal } = req.query;

    const sensor = await Sensor.findByPk(sensorId);
    if (!sensor) {
      return errorResponse(res, 404, 'Sensor tidak ditemukan');
    }

    // Check authorization
    const lahan = await Lahan.findByPk(sensor.lahanId);
    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses');
    }

    let whereClause = { sensorId };
    if (dari_tanggal && sampai_tanggal) {
      whereClause.tanggal_pencatatan = {
        [Op.gte]: new Date(dari_tanggal),
        [Op.lte]: new Date(sampai_tanggal),
      };
    }

    const data = await SensorData.findAll({
      where: whereClause,
      attributes: ['nilai'],
      raw: true,
    });

    if (data.length === 0) {
      return successResponse(res, 200, 'Tidak ada data', { count: 0 });
    }

    const nilai = data.map((d) => parseFloat(d.nilai));
    const rataRata = nilai.reduce((a, b) => a + b, 0) / nilai.length;
    const min = Math.min(...nilai);
    const max = Math.max(...nilai);
    const stdDev = Math.sqrt(nilai.reduce((sq, n) => sq + Math.pow(n - rataRata, 2), 0) / nilai.length);

    successResponse(res, 200, 'Statistik sensor berhasil diambil', {
      totalData: data.length,
      rataRata: rataRata.toFixed(2),
      minimum: min,
      maksimum: max,
      standarDeviasi: stdDev.toFixed(2),
    });
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil statistik sensor', error.message);
  }
};
