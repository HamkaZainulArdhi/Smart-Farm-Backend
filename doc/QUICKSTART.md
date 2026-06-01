# Quick Start Guide

## 1. Setup Database

```bash
# Make sure MySQL is running, then update .env file
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=agricultural_monitoring
```

## 2. Sync Database

```bash
pnpm run db:sync
```

Ini akan:
- Create semua tables
- Setup relationships
- Create default admin user (admin@agritech.com / admin123)

## 3. Start Server

```bash
pnpm run dev
```

Server akan berjalan di `http://localhost:3000`

## 4. API Testing

### Login sebagai Admin
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@agritech.com",
    "password": "admin123"
  }'
```

Save token dari response untuk request berikutnya.

### Register Petani Baru
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nama": "Budi Farmer",
    "email": "budi@farm.com",
    "password": "password123",
    "nomor_telepon": "0812345678",
    "alamat": "Karawang, Jawa Barat",
    "role": "petani"
  }'
```

### Create Lahan
```bash
curl -X POST http://localhost:3000/api/lahan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nama_lahan": "Lahan Padi Utama",
    "lokasi": "Karawang, Jawa Barat",
    "luas_lahan": 2000.5,
    "jenis_tanah": "Lempung",
    "koordinat_latitude": -6.3033,
    "koordinat_longitude": 107.0235,
    "deskripsi": "Lahan utama untuk padi"
  }'
```

### Create Sensor
```bash
curl -X POST http://localhost:3000/api/sensor/{lahanId}/sensors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nama_sensor": "Sensor Suhu 1",
    "tipe_sensor": "suhu",
    "kode_sensor": "TEMP_001",
    "lokasi_sensor": "Baris A",
    "status": "aktif",
    "tipe_koneksi": "WiFi",
    "deskripsi": "Sensor suhu untuk monitoring"
  }'
```

### Set Nilai Normal (Threshold)
```bash
curl -X POST http://localhost:3000/api/sensor/nilai-normal/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "sensorId": "{sensorId}",
    "nilai_min": 20,
    "nilai_max": 30,
    "nilai_peringatan_min": 18,
    "nilai_peringatan_max": 32,
    "nilai_kritis_min": 15,
    "nilai_kritis_max": 35,
    "deskripsi": "Threshold normal suhu padi"
  }'
```

### Input Sensor Data
```bash
curl -X POST http://localhost:3000/api/sensor/data/input \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "sensorId": "{sensorId}",
    "nilai": 28.5,
    "satuan": "Celsius"
  }'
```

Jika nilai melebihi threshold, sistem akan otomatis create notifikasi.

### Get Notifikasi
```bash
curl http://localhost:3000/api/notifikasi \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Sensor Data History
```bash
curl "http://localhost:3000/api/sensor/data/{sensorId}/history?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Sensor Statistics
```bash
curl "http://localhost:3000/api/sensor/data/{sensorId}/statistics?dari_tanggal=2024-05-01&sampai_tanggal=2024-05-05" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Laporan
```bash
curl -X POST http://localhost:3000/api/laporan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "lahanId": "{lahanId}",
    "periode_awal": "2024-04-01",
    "periode_akhir": "2024-04-30"
  }'
```

### Generate PDF Laporan
```bash
curl http://localhost:3000/api/laporan/pdf/{laporanId} \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -o laporan.pdf
```

## 5. Project Structure

```
src/
├── config/
│   └── database.js              # Sequelize configuration
├── models/
│   ├── User.js
│   ├── Lahan.js
│   ├── Tanaman.js
│   ├── Sensor.js
│   ├── SensorData.js
│   ├── NilaiNormal.js
│   ├── Notifikasi.js
│   ├── Rekomendasi.js
│   ├── LaporanLahan.js
│   └── index.js                 # Model associations
├── controllers/
│   ├── authController.js
│   ├── lahanController.js
│   ├── tanamanController.js
│   ├── sensorController.js
│   ├── sensorDataController.js
│   ├── nilaiNormalController.js
│   ├── notifikasiController.js
│   ├── rekomendasiController.js
│   └── laporanController.js
├── routes/
│   ├── authRoutes.js
│   ├── lahanRoutes.js
│   ├── tanamanRoutes.js
│   ├── sensorRoutes.js
│   ├── notifikasiRoutes.js
│   ├── rekomendasiRoutes.js
│   └── laporanRoutes.js
├── middleware/
│   ├── auth.js                  # JWT authentication
│   └── validate.js              # Request validation
├── validation/
│   └── schemas.js               # Joi validation schemas
├── services/
│   └── monitoringService.js     # Cron jobs untuk monitoring
├── utils/
│   ├── jwt.js                   # JWT utility functions
│   └── response.js              # Response formatting
├── scripts/
│   └── syncDB.js                # Database sync script
└── server.js                    # Main Express app
```

## 6. Key Features Implemented

✅ **Authentication & Authorization**
- JWT token-based auth
- Role-based access control (Petani, Penyuluh, Admin)
- Password hashing dengan bcryptjs

✅ **Land & Crop Management**
- Create, read, update, delete lahan
- Manage tanaman per lahan
- Track crop status

✅ **Sensor Management**
- Setup sensor dengan berbagai tipe (suhu, kelembapan, pH, cahaya)
- Define nilai normal (threshold) per sensor
- Monitor sensor status (aktif/tidak aktif/rusak)

✅ **Sensor Data & Monitoring**
- Input data sensor real-time
- Automatic status detection (normal/peringatan/kritis)
- Historical data storage dengan pagination
- Statistics calculation (rata-rata, min, max, std dev)

✅ **Notification System**
- Auto-generate notifikasi saat sensor melebihi threshold
- Notification status tracking (belum dibaca/sudah dibaca)
- Notification statistics

✅ **Recommendation System**
- Penyuluh membuat rekomendasi berdasarkan notifikasi
- Approval workflow (pending → disetujui/ditolak)
- Priority levels (rendah, sedang, tinggi)

✅ **Reporting**
- Generate laporan kondisi lahan per periode
- Auto-calculate statistik sensor
- PDF export dengan PDFKit
- Include saran perbaikan otomatis

✅ **Automated Services**
- Cron job setiap 5 menit untuk check sensor values
- Auto-generate notifikasi untuk nilai kritis
- Daily report scheduling

## 7. Testing Workflow

1. **Register user baru** (petani)
2. **Create lahan** dengan detail lokasi
3. **Add tanaman** yang akan ditanam
4. **Create sensor** untuk monitoring
5. **Set nilai normal** (threshold) untuk setiap sensor
6. **Input sensor data** secara berkala
   - Jika melebihi threshold → otomatis buat notifikasi
7. **View notifikasi** dan monitor kondisi
8. **Penyuluh buat rekomendasi** dari notifikasi
9. **Petani approve/reject** rekomendasi
10. **Generate laporan** setiap bulannya
11. **Export PDF laporan** untuk arsip

## 8. Environment Variables

Lihat `.env.example` untuk semua konfigurasi yang tersedia:
- Database credentials
- JWT secret dan expiry
- Server port
- Cron schedule
- Email configuration (optional)

## 9. Troubleshooting

**Error: Cannot find module 'express'**
```bash
pnpm install
```

**Error: Connection refused ke database**
```bash
# Make sure MySQL is running
# Update .env dengan database credentials yang benar
```

**Error: SQLITE_CANTOPEN**
```bash
# Jika menggunakan SQLite, pastikan direktori writable
```

**Notifikasi tidak auto-generate**
```bash
# Check apakah monitoring service berjalan di server log
# Pastikan nilai sensor melebihi threshold yang sudah diset
```

## 10. Next Steps

- Deploy ke production server
- Setup SSL/HTTPS
- Configure database backup
- Setup email notifications
- Integrate dengan IoT devices
- Build mobile/web frontend
- Setup monitoring tools (PM2, Sentry)
