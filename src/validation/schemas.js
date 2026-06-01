import Joi from 'joi';

// Auth Schemas
export const registerSchema = Joi.object({
  nama: Joi.string().required().messages({
    'string.empty': 'Nama harus diisi',
    'any.required': 'Nama wajib diisi',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Format email tidak valid',
    'any.required': 'Email wajib diisi',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password minimal 6 karakter',
    'any.required': 'Password wajib diisi',
  }),
  nomor_telepon: Joi.string().optional(),
  alamat: Joi.string().optional(),
  role: Joi.string().valid('petani', 'penyuluh').default('petani'),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Lahan Schemas
export const createLahanSchema = Joi.object({
  nama_lahan: Joi.string().required(),
  lokasi: Joi.string().required(),
  luas_lahan: Joi.number().positive().required(),
  jenis_tanah: Joi.string().optional(),
  koordinat_latitude: Joi.number().optional(),
  koordinat_longitude: Joi.number().optional(),
  deskripsi: Joi.string().optional(),
});

export const updateLahanSchema = Joi.object({
  nama_lahan: Joi.string().optional(),
  lokasi: Joi.string().optional(),
  luas_lahan: Joi.number().positive().optional(),
  jenis_tanah: Joi.string().optional(),
  koordinat_latitude: Joi.number().optional(),
  koordinat_longitude: Joi.number().optional(),
  deskripsi: Joi.string().optional(),
});

// Tanaman Schemas
export const createTanamanSchema = Joi.object({
  lahanId: Joi.string().uuid().required(),
  nama_tanaman: Joi.string().required(),
  jenis_tanaman: Joi.string().required(),
  tanggal_tanam: Joi.date().required(),
  estimasi_panen: Joi.date().optional(),
  luas_tanaman: Joi.number().positive().optional(),
  varietas: Joi.string().optional(),
  status: Joi.string().valid('perencanaan', 'tanam', 'berkembang', 'siap_panen', 'selesai').default('tanam'),
  deskripsi: Joi.string().optional(),
});

// Sensor Schemas
export const createSensorSchema = Joi.object({
  lahanId: Joi.string().uuid().required(),
  nama_sensor: Joi.string().required(),
  tipe_sensor: Joi.string().valid('suhu', 'kelembapan', 'ph', 'intensitas_cahaya').required(),
  kode_sensor: Joi.string().required(),
  lokasi_sensor: Joi.string().optional(),
  status: Joi.string().valid('aktif', 'tidak_aktif', 'rusak').default('aktif'),
  tipe_koneksi: Joi.string().optional(),
  deskripsi: Joi.string().optional(),
});

// SensorData Schemas
export const createSensorDataSchema = Joi.object({
  sensorId: Joi.string().uuid().required(),
  nilai: Joi.number().required(),
  satuan: Joi.string().required(),
  tanggal_pencatatan: Joi.date().optional(),
});

// NilaiNormal Schemas
export const createNilaiNormalSchema = Joi.object({
  sensorId: Joi.string().uuid().required(),
  nilai_min: Joi.number().required(),
  nilai_max: Joi.number().required(),
  nilai_peringatan_min: Joi.number().optional(),
  nilai_peringatan_max: Joi.number().optional(),
  nilai_kritis_min: Joi.number().optional(),
  nilai_kritis_max: Joi.number().optional(),
  deskripsi: Joi.string().optional(),
});

// Rekomendasi Schemas
export const createRekomendasiSchema = Joi.object({
  notifikasiId: Joi.string().uuid().required(),
  judul_rekomendasi: Joi.string().required(),
  deskripsi_tindakan: Joi.string().required(),
  prioritas: Joi.string().valid('rendah', 'sedang', 'tinggi').default('sedang'),
});

export const updateRekomendasiStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'sedang_dikerjakan', 'selesai', 'ditolak').required(),
});

export const approveRekomendasiSchema = Joi.object({
  status_approval: Joi.string().valid('disetujui', 'ditolak').required(),
});

// Laporan Schemas
export const createLaporanSchema = Joi.object({
  lahanId: Joi.string().uuid().required(),
  periode_awal: Joi.date().required(),
  periode_akhir: Joi.date().required().greater(Joi.ref('periode_awal')),
});
