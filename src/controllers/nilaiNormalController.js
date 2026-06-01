import { NilaiNormal, Sensor, Lahan } from '../models/index.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const createNilaiNormal = async (req, res) => {
  try {
    const { sensorId, nilai_min, nilai_max, nilai_peringatan_min, nilai_peringatan_max, nilai_kritis_min, nilai_kritis_max, deskripsi } = req.validatedData;

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

    // Check if nilai normal already exists for this sensor
    const existingNilaiNormal = await NilaiNormal.findOne({ where: { sensorId } });
    if (existingNilaiNormal) {
      return errorResponse(res, 409, 'Nilai normal sudah terdaftar untuk sensor ini');
    }

    const nilaiNormal = await NilaiNormal.create({
      sensorId,
      nilai_min,
      nilai_max,
      nilai_peringatan_min,
      nilai_peringatan_max,
      nilai_kritis_min,
      nilai_kritis_max,
      deskripsi,
    });

    successResponse(res, 201, 'Nilai normal sensor berhasil dibuat', nilaiNormal);
  } catch (error) {
    errorResponse(res, 500, 'Error membuat nilai normal', error.message);
  }
};

export const getNilaiNormal = async (req, res) => {
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

    const nilaiNormal = await NilaiNormal.findOne({ where: { sensorId } });

    if (!nilaiNormal) {
      return errorResponse(res, 404, 'Nilai normal tidak ditemukan');
    }

    successResponse(res, 200, 'Nilai normal sensor berhasil diambil', nilaiNormal);
  } catch (error) {
    errorResponse(res, 500, 'Error mengambil nilai normal', error.message);
  }
};

export const updateNilaiNormal = async (req, res) => {
  try {
    const { nilaiNormalId } = req.params;
    const { nilai_min, nilai_max, nilai_peringatan_min, nilai_peringatan_max, nilai_kritis_min, nilai_kritis_max, deskripsi } = req.body;

    const nilaiNormal = await NilaiNormal.findByPk(nilaiNormalId, {
      include: [{ association: 'sensor' }],
    });

    if (!nilaiNormal) {
      return errorResponse(res, 404, 'Nilai normal tidak ditemukan');
    }

    // Check authorization
    const lahan = await Lahan.findByPk(nilaiNormal.sensor.lahanId);
    if (req.user.role === 'petani' && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses');
    }

    if (nilai_min !== undefined) nilaiNormal.nilai_min = nilai_min;
    if (nilai_max !== undefined) nilaiNormal.nilai_max = nilai_max;
    if (nilai_peringatan_min !== undefined) nilaiNormal.nilai_peringatan_min = nilai_peringatan_min;
    if (nilai_peringatan_max !== undefined) nilaiNormal.nilai_peringatan_max = nilai_peringatan_max;
    if (nilai_kritis_min !== undefined) nilaiNormal.nilai_kritis_min = nilai_kritis_min;
    if (nilai_kritis_max !== undefined) nilaiNormal.nilai_kritis_max = nilai_kritis_max;
    if (deskripsi !== undefined) nilaiNormal.deskripsi = deskripsi;

    await nilaiNormal.save();

    successResponse(res, 200, 'Nilai normal sensor berhasil diupdate', nilaiNormal);
  } catch (error) {
    errorResponse(res, 500, 'Error mengupdate nilai normal', error.message);
  }
};
