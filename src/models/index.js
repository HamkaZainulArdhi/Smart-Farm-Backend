import User from './User.js';
import Lahan from './Lahan.js';
import Tanaman from './Tanaman.js';
import Sensor from './Sensor.js';
import SensorData from './SensorData.js';
import NilaiNormal from './NilaiNormal.js';
import Notifikasi from './Notifikasi.js';
import Rekomendasi from './Rekomendasi.js';
import LaporanLahan from './LaporanLahan.js';

// Define Associations
User.hasMany(Lahan, { foreignKey: 'userId', as: 'lahan' });
Lahan.belongsTo(User, { foreignKey: 'userId', as: 'pemilik' });

Lahan.hasMany(Tanaman, { foreignKey: 'lahanId', as: 'taman' });
Tanaman.belongsTo(Lahan, { foreignKey: 'lahanId', as: 'lahan' });

Lahan.hasMany(Sensor, { foreignKey: 'lahanId', as: 'sensor' });
Sensor.belongsTo(Lahan, { foreignKey: 'lahanId', as: 'lahan' });

Sensor.hasMany(SensorData, { foreignKey: 'sensorId', as: 'datas' });
SensorData.belongsTo(Sensor, { foreignKey: 'sensorId', as: 'sensor' });

Sensor.hasMany(NilaiNormal, { foreignKey: 'sensorId', as: 'nilai_normal' });
NilaiNormal.belongsTo(Sensor, { foreignKey: 'sensorId', as: 'sensor' });

User.hasMany(Notifikasi, { foreignKey: 'userId', as: 'notifikasi' });
Notifikasi.belongsTo(User, { foreignKey: 'userId', as: 'penerima' });

SensorData.hasMany(Notifikasi, { foreignKey: 'sensorDataId', as: 'notifikasi' });
Notifikasi.belongsTo(SensorData, { foreignKey: 'sensorDataId', as: 'sensor_data' });

Notifikasi.hasMany(Rekomendasi, { foreignKey: 'notifikasiId', as: 'rekomendasi' });
Rekomendasi.belongsTo(Notifikasi, { foreignKey: 'notifikasiId', as: 'notifikasi' });

User.hasMany(Rekomendasi, { foreignKey: 'penyuluhId', as: 'rekomendasi' });
Rekomendasi.belongsTo(User, { foreignKey: 'penyuluhId', as: 'penyuluh' });

Lahan.hasMany(LaporanLahan, { foreignKey: 'lahanId', as: 'laporan' });
LaporanLahan.belongsTo(Lahan, { foreignKey: 'lahanId', as: 'lahan' });

export {
  User,
  Lahan,
  Tanaman,
  Sensor,
  SensorData,
  NilaiNormal,
  Notifikasi,
  Rekomendasi,
  LaporanLahan,
};
