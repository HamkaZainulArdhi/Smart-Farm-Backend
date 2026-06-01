# API Documentation - Agricultural Monitoring Backend

## Overview
Backend aplikasi monitoring lahan pertanian dengan fitur sensor monitoring, notifikasi real-time, rekomendasi dari penyuluh, dan laporan PDF.

## Tech Stack
- **Framework**: Express.js
- **Database**: MySQL dengan Sequelize ORM
- **Authentication**: JWT
- **Monitoring**: Node-Cron (scheduled tasks)
- **Report**: PDFKit

## Setup & Installation

### Prerequisites
- Node.js 16+
- MySQL 5.7+
- npm atau pnpm

### Installation Steps

```bash
# Install dependencies
pnpm install

# Copy .env.example ke .env dan sesuaikan config database
cp .env.example .env

# Sync database
pnpm run db:sync

# Start server
pnpm run dev
```

## API Endpoints

### Authentication
```
POST   /api/auth/register          - Register user baru
POST   /api/auth/login             - Login user
GET    /api/auth/profile           - Get user profile (authenticated)
PUT    /api/auth/profile           - Update profile (authenticated)
POST   /api/auth/change-password   - Change password (authenticated)
POST   /api/auth/logout            - Logout (authenticated)
```

### Lahan (Land)
```
POST   /api/lahan                  - Create lahan baru (authenticated)
GET    /api/lahan                  - Get list lahan (authenticated)
GET    /api/lahan/:lahanId         - Get detail lahan (authenticated)
PUT    /api/lahan/:lahanId         - Update lahan (authenticated)
DELETE /api/lahan/:lahanId         - Delete lahan (authenticated)
GET    /api/lahan/:lahanId/statistics - Get lahan statistics (authenticated)
```

### Tanaman (Crop)
```
POST   /api/tanaman/:lahanId/tamans       - Create tanaman baru (authenticated)
GET    /api/tanaman/:lahanId/tamans       - Get list tanaman (authenticated)
GET    /api/tanaman/tanaman/:tanamanId    - Get detail tanaman (authenticated)
PUT    /api/tanaman/tanaman/:tanamanId    - Update tanaman (authenticated)
DELETE /api/tanaman/tanaman/:tanamanId    - Delete tanaman (authenticated)
```

### Sensor & Monitoring
```
POST   /api/sensor/:lahanId/sensors           - Create sensor baru (authenticated)
GET    /api/sensor/:lahanId/sensors           - Get list sensor (authenticated)
GET    /api/sensor/sensor/:sensorId           - Get detail sensor (authenticated)
PUT    /api/sensor/sensor/:sensorId           - Update sensor (authenticated)
DELETE /api/sensor/sensor/:sensorId           - Delete sensor (authenticated)
GET    /api/sensor/sensor/:sensorId/last-data - Get last sensor data (authenticated)

# Sensor Data (Input & History)
POST   /api/sensor/data/input                 - Input sensor data baru (authenticated)
GET    /api/sensor/data/:sensorId/history     - Get sensor data history (authenticated)
GET    /api/sensor/data/:sensorId/statistics  - Get sensor statistics (authenticated)

# Nilai Normal (Threshold)
POST   /api/sensor/nilai-normal/create        - Create nilai normal (authenticated)
GET    /api/sensor/nilai-normal/:sensorId     - Get nilai normal (authenticated)
PUT    /api/sensor/nilai-normal/:nilaiNormalId - Update nilai normal (authenticated)
```

### Notifikasi (Notifications)
```
GET    /api/notifikasi              - Get user notifications (authenticated)
GET    /api/notifikasi/:notifikasiId - Get notification detail (authenticated)
PUT    /api/notifikasi/:notifikasiId/read - Mark as read (authenticated)
PUT    /api/notifikasi/read-all     - Mark all as read (authenticated)
GET    /api/notifikasi/unread/count - Get unread count (authenticated)
DELETE /api/notifikasi/:notifikasiId - Delete notification (authenticated)
GET    /api/notifikasi/statistics   - Get notification statistics (authenticated)
```

### Rekomendasi (Recommendations)
```
POST   /api/rekomendasi             - Create rekomendasi (authenticated, penyuluh only)
GET    /api/rekomendasi             - Get recommendations (authenticated)
GET    /api/rekomendasi/:rekomendasiId - Get recommendation detail (authenticated)
PUT    /api/rekomendasi/:rekomendasiId/status - Update recommendation status (authenticated)
PUT    /api/rekomendasi/:rekomendasiId/approve - Approve/reject recommendation (authenticated)
DELETE /api/rekomendasi/:rekomendasiId - Delete recommendation (authenticated)
```

### Laporan (Reports)
```
POST   /api/laporan                 - Create laporan baru (authenticated)
GET    /api/laporan/:lahanId        - Get list laporan (authenticated)
GET    /api/laporan/detail/:laporanId - Get laporan detail (authenticated)
GET    /api/laporan/pdf/:laporanId  - Generate & download PDF (authenticated)
```


## Request/Response Examples

### Register
```json
POST /api/auth/register
{
  "nama": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "nomor_telepon": "0812345678",
  "alamat": "Bogor, Indonesia",
  "role": "petani"
}

Response 201:
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "user": {
      "id": "uuid-here",
      "nama": "John Doe",
      "email": "john@example.com",
      "role": "petani"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "timestamp": "2024-05-05T10:00:00.000Z"
}
```

### Create Lahan
```json
POST /api/lahan
Headers: Authorization: Bearer <token>

{
  "nama_lahan": "Lahan Padi Utama",
  "lokasi": "Karawang, Jawa Barat",
  "luas_lahan": 2000.50,
  "jenis_tanah": "Lempung",
  "koordinat_latitude": -6.3033,
  "koordinat_longitude": 107.0235,
  "deskripsi": "Lahan untuk budidaya padi"
}

Response 201:
{
  "success": true,
  "message": "Lahan berhasil dibuat",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "nama_lahan": "Lahan Padi Utama",
    ...
  }
}
```

### Create Sensor
```json
POST /api/sensor/:lahanId/sensors
Headers: Authorization: Bearer <token>

{
  "nama_sensor": "Sensor Suhu 1",
  "tipe_sensor": "suhu",
  "kode_sensor": "TEMP_001",
  "lokasi_sensor": "Baris A, Kolom 1",
  "status": "aktif",
  "tipe_koneksi": "WiFi",
  "deskripsi": "Sensor untuk mengukur suhu udara"
}

Response 201:
{
  "success": true,
  "message": "Sensor berhasil dibuat",
  "data": { ... }
}
```

### Input Sensor Data
```json
POST /api/sensor/data/input
Headers: Authorization: Bearer <token>

{
  "sensorId": "uuid-sensor",
  "nilai": 28.5,
  "satuan": "Celsius",
  "tanggal_pencatatan": "2024-05-05T10:30:00Z"
}

Response 201:
{
  "success": true,
  "message": "Data sensor berhasil diinput",
  "data": {
    "id": "uuid",
    "sensorId": "uuid",
    "nilai": 28.5,
    "satuan": "Celsius",
    "status_kondisi": "normal",
    "tanggal_pencatatan": "2024-05-05T10:30:00.000Z"
  }
}
```

### Create Nilai Normal (Threshold)
```json
POST /api/sensor/nilai-normal/create
Headers: Authorization: Bearer <token>

{
  "sensorId": "uuid-sensor",
  "nilai_min": 20,
  "nilai_max": 30,
  "nilai_peringatan_min": 18,
  "nilai_peringatan_max": 32,
  "nilai_kritis_min": 15,
  "nilai_kritis_max": 35,
  "deskripsi": "Threshold normal untuk suhu padi"
}

Response 201:
{
  "success": true,
  "message": "Nilai normal sensor berhasil dibuat",
  "data": { ... }
}
```

### Create Rekomendasi (Penyuluh)
```json
POST /api/rekomendasi
Headers: Authorization: Bearer <token>

{
  "notifikasiId": "uuid-notifikasi",
  "judul_rekomendasi": "Tingkatkan Penyiraman",
  "deskripsi_tindakan": "Berdasarkan data sensor, kelembapan tanah rendah. Tingkatkan frekuensi penyiraman menjadi 2x sehari pada pagi dan sore hari.",
  "prioritas": "tinggi"
}

Response 201:
{
  "success": true,
  "message": "Rekomendasi berhasil dibuat",
  "data": { ... }
}
```

### Get Sensor Data History
```
GET /api/sensor/data/:sensorId/history?page=1&limit=50&dari_tanggal=2024-05-01&sampai_tanggal=2024-05-05
Headers: Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "message": "Histori data sensor berhasil diambil",
  "data": [ ... ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 50,
    "pages": 3
  }
}
```

### Create Laporan
```json
POST /api/laporan
Headers: Authorization: Bearer <token>

{
  "lahanId": "uuid-lahan",
  "periode_awal": "2024-04-01",
  "periode_akhir": "2024-04-30"
}

Response 201:
{
  "success": true,
  "message": "Laporan berhasil dibuat",
  "data": {
    "id": "uuid",
    "lahanId": "uuid",
    "tanggal_laporan": "2024-05-05T10:30:00Z",
    "kondisi_umum": "...",
    "rata_rata_suhu": "27.5",
    "rata_rata_kelembapan": "65.2",
    "rata_rata_ph": "6.8",
    "rata_rata_intensitas_cahaya": "5000.0",
    "anomali_terdeteksi": "Terdeteksi 5 anomali",
    "saran_perbaikan": "...",
    "periode_awal": "2024-04-01",
    "periode_akhir": "2024-04-30"
  }
}
```

## User Roles & Permissions

### Petani (Farmer)
- CRUD Lahan pribadi
- CRUD Tanaman di lahan pribadi
- CRUD Sensor di lahan pribadi
- Input dan view sensor data
- Approve/reject rekomendasi dari penyuluh
- View notifikasi dan rekomendasi
- Generate laporan untuk lahan pribadi

### Penyuluh (Agricultural Advisor)
- View semua lahan petani
- Membuat rekomendasi berdasarkan notifikasi
- Approve/reject status rekomendasi
- View notifikasi dan monitoring data

### Admin
- CRUD semua user
- CRUD semua lahan, tanaman, sensor
- View semua notifikasi dan rekomendasi
- System-wide monitoring dan reporting

## Automated Services

### Monitoring Service (Every 5 Minutes)
- Check semua sensor aktif
- Compare nilai dengan threshold normal
- Auto-generate notifikasi jika ada peringatan/kritis
- Log semua aktivitas

### Daily Report Service (Daily at 8 AM)
- Generate daily summary untuk setiap lahan
- Aggregate sensor statistics
- Identify trends dan anomali

## Error Handling

Semua error response mengikuti format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ ... ],
  "timestamp": "2024-05-05T10:00:00.000Z"
}
```

Status codes:
- 200: OK
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error

## Database Schema

### Key Tables
- **users**: User accounts dengan role (petani, penyuluh, admin)
- **lahans**: Land information
- **tamans**: Crop information
- **sensors**: Sensor configuration
- **sensor_datas**: Sensor readings history
- **nilai_normals**: Threshold configuration untuk setiap sensor
- **notifikasis**: Alert notifications
- **rekomendasis**: Recommendations dari penyuluh
- **laporan_lahans**: Generated reports

## Future Enhancements

1. Real-time WebSocket untuk live sensor data
2. Mobile app untuk farmer
3. Weather integration untuk rekomendasi otomatis
4. IoT device integration
5. Advanced analytics dan machine learning predictions
6. Email/SMS notifications
7. Multi-language support



(200)
GET      /api/auth/profile (200)
GET      /api/lahan/ (500)
GET      /api/lahan/10bba30b-ab42-4b93-9c13-3f099212d8e2 (500)
GET      /api/lahan/10bba30b-ab42-4b93-9c13-3f099212d8e2/statistics (200)
GET      /api/tanaman/10bba30b-ab42-4b93-9c13-3f099212d8e2/tamans (200)
✔ Provide value for :tanamanId 
GET      /api/tanaman/tanaman/ (404)
GET      /api/sensor/10bba30b-ab42-4b93-9c13-3f099212d8e2/sensors (200)
GET      /api/sensor/sensor/070a0b11-e625-4460-b619-307f5e642109 (200)
GET      /api/sensor/sensor/070a0b11-e625-4460-b619-307f5e642109/last-data (200)
GET      /api/sensor/data/070a0b11-e625-4460-b619-307f5e642109/history (200)
GET      /api/sensor/data/070a0b11-e625-4460-b619-307f5e642109/statistics (200)
GET      /api/sensor/nilai-normal/070a0b11-e625-4460-b619-307f5e642109 (200)
GET      /api/notifikasi/ (500)
✔ Provide value for :notifikasiId 
GET      /api/notifikasi/ (500)
GET      /api/notifikasi/unread/count (200)
GET      /api/notifikasi/statistics (500)
GET      /api/rekomendasi/ (200)
GET      /api/rekomendasi/3928d55b-484b-45c4-93d7-ba73a3990749 (200)
GET      /api/laporan/10bba30b-ab42-4b93-9c13-3f099212d8e2 (200)
✔ Provide value for :laporanId 
GET      /api/laporan/detail/ (404)
GET      /api/laporan/pdf/ (404)
GET      /api/admin/statistics (200)
GET      /api/admin/activity (200)
GET      /api/admin/users (200)
GET      /api/admin/users/7cdef1ee-1ecf-47e9-86f1-f06d1aa4c7cb (500)
GET      /api/admin/lahans (200)
GET      /api/admin/sensors (200)