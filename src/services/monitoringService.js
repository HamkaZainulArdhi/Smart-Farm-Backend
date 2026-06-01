import cron from 'node-cron';
import { Sensor, SensorData, NilaiNormal, Notifikasi, Lahan, User } from '../models/index.js';
import { Op } from 'sequelize';

const checkSensorValueStatus = (nilai, nilaiNormal) => {
  if (!nilaiNormal) return 'normal';

  if (nilaiNormal.nilai_kritis_min && nilai < nilaiNormal.nilai_kritis_min) return 'kritis';
  if (nilaiNormal.nilai_kritis_max && nilai > nilaiNormal.nilai_kritis_max) return 'kritis';
  if (nilaiNormal.nilai_peringatan_min && nilai < nilaiNormal.nilai_peringatan_min) return 'peringatan';
  if (nilaiNormal.nilai_peringatan_max && nilai > nilaiNormal.nilai_peringatan_max) return 'peringatan';

  return 'normal';
};

export const startMonitoringService = () => {
  // Run setiap 5 menit untuk check sensor yang melebihi batas normal
  const cronJob = cron.schedule('*/5 * * * * *', async () => {
    try {
      console.log('[Monitoring Service] Checking sensor values...');

      const sensors = await Sensor.findAll({
        where: { status: 'aktif' },
        include: [
          {
            association: 'nilai_normal',
            attributes: ['id', 'nilai_min', 'nilai_max', 'nilai_peringatan_min', 'nilai_peringatan_max', 'nilai_kritis_min', 'nilai_kritis_max'],
          },
        ],
      });

      let notifikasiCount = 0;

      for (const sensor of sensors) {
        // Get latest sensor data
        const latestData = await SensorData.findOne({
          where: { sensorId: sensor.id },
          order: [['tanggal_pencatatan', 'DESC']],
          limit: 1,
        });

        if (!latestData) continue;

        const nilaiNormal = sensor.nilai_normal[0];
        const status = checkSensorValueStatus(latestData.nilai, nilaiNormal);

        // If status changed from normal to warning/critical, create notification
        if (status !== 'normal') {
          const lahan = await Lahan.findByPk(sensor.lahanId);
          const user = await User.findByPk(lahan.userId);

          // Check if notification for this sensor data already exists
          const existingNotif = await Notifikasi.findOne({
            where: { sensorDataId: latestData.id },
          });

          if (!existingNotif) {
            await Notifikasi.create({
              userId: user.id,
              sensorDataId: latestData.id,
              judul: `${status === 'kritis' ? 'PERINGATAN KRITIS' : 'PERINGATAN'}: ${sensor.nama_sensor}`,
              pesan: `Sensor ${sensor.nama_sensor} di lahan ${lahan.nama_lahan} menunjukkan kondisi ${status}: ${latestData.nilai} ${latestData.satuan}`,
              tipe: status === 'kritis' ? 'kritis' : 'peringatan',
            });

            notifikasiCount++;
            console.log(`[Monitoring Service] Notifikasi buat untuk ${sensor.nama_sensor}`);
          }
        }
      }

      console.log(`[Monitoring Service] Selesai. Total notifikasi: ${notifikasiCount}`);
    } catch (error) {
      console.error('[Monitoring Service] Error:', error);
    }
  });

  return cronJob;
};

// Daily report generation (setiap hari jam 8 pagi)
export const startDailyReportService = () => {
  const cronJob = cron.schedule('0 8 * * *', async () => {
    try {
      console.log('[Daily Report Service] Generating daily reports...');

      // This service dapat diintegrasikan dengan report generation di masa depan
      console.log('[Daily Report Service] Daily report generation scheduled');
    } catch (error) {
      console.error('[Daily Report Service] Error:', error);
    }
  });

  return cronJob;
};

export const startCronJobs = () => {
  console.log('Starting automated monitoring services...');
  startMonitoringService();
  startDailyReportService();
  console.log('Monitoring services started successfully');
};
