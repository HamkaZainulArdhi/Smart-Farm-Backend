# Agricultural Monitoring Backend

Backend REST API untuk aplikasi monitoring lahan pertanian dengan fitur sensor monitoring real-time, notifikasi otomatis, rekomendasi dari penyuluh, dan laporan PDF.

## Ringkasan Fitur Implementasi

### ✅ A. Role dan Autentikasi
- **Petani**: Mengelola lahan, tanaman, sensor, melihat monitoring, approve rekomendasi
- **Penyuluh**: View semua lahan petani, membuat rekomendasi, approve status
- **Admin**: Full system access, user management, statistics
- **JWT Authentication**: Token-based dengan secure password hashing (bcryptjs)

### ✅ B. Data Lahan
- Create, read, update, delete lahan
- Track lokasi dengan koordinat GPS
- Multiple lahan per petani
- Lahan statistics (total tanaman, total sensor)

### ✅ C. Data Tanaman
- Manage tanaman per lahan
- Track status tanaman (perencanaan, tanam, berkembang, siap_panen, selesai)
- Tanggal tanam dan estimasi panen
- Berbagai tipe dan varietas tanaman

### ✅ D. Data Sensor
- Tipe sensor: Suhu, Kelembapan, pH, Intensitas Cahaya
- Multiple sensor per lahan
- Track sensor status (aktif, tidak_aktif, rusak)
- Sensor metadata (lokasi, kode, tipe koneksi)

### ✅ E. Input Data Sensor
- Real-time sensor data input
- Automatic status detection (normal/peringatan/kritis)
- Data history dengan pagination
- Timestamp tracking untuk setiap pembacaan

### ✅ F. Histori Monitoring
- Complete sensor data history
- Filter by date range
- Pagination support
- Statistical analysis (rata-rata, min, max, std dev)

### ✅ G. Batas Nilai Normal
- Set threshold untuk setiap sensor
- Define nilai normal (min-max)
- Warning threshold (peringatan min-max)
- Critical threshold (kritis min-max)
- Per-sensor customization

### ✅ H. Notifikasi Kondisi Kritis
- Auto-generate notifikasi saat nilai sensor melebihi threshold
- Notification types: peringatan, kritis
- Read/unread status tracking
- Statistics dashboard
- Unread count query

### ✅ I. Rekomendasi Tindakan
- Penyuluh create rekomendasi berdasarkan notifikasi
- Priority levels: rendah, sedang, tinggi
- Status tracking: pending, sedang_dikerjakan, selesai, ditolak
- Approval workflow: menunggu, disetujui, ditolak
- Approval timestamp tracking

### ✅ J. Laporan Kondisi Lahan
- Generate laporan per periode
- Auto-calculate statistics:
  - Rata-rata suhu, kelembapan, pH, intensitas cahaya
  - Total anomali terdeteksi
  - Auto-generate saran perbaikan
- Complete reporting data dengan periode range

### ✅ K. PDF Report Export
- Generate PDF laporan dengan PDFKit
- Include lahan info, periode, statistik
- Detailed anomali dan saran perbaikan
- Download functionality

### ✅ L. Dashboard Monitoring
- System statistics (users, lahan, sensor, notifikasi)
- Activity tracking (7 hari terakhir)
- Sensor data trends
- Notification summary
- User overview

## Automated Features

### 🔄 Monitoring Service (Every 5 Minutes)
```
- Check semua sensor aktif
- Validate nilai terhadap threshold
- Auto-generate notifikasi untuk peringatan/kritis
- Log semua aktivitas monitoring
```

### 📊 Daily Report Service (8 AM Daily)
```
- Schedule laporan otomatis
- Aggregate sensor data
- Generate insights dan rekomendasi
```

## Teknologi Stack

```
- Express.js 4.x          - Web framework
- Sequelize 6.x          - ORM MySQL
- MySQL 5.7+             - Database
- JWT                    - Authentication
- Node-Cron              - Scheduled tasks
- PDFKit                 - PDF generation
- Joi                    - Validation
- bcryptjs               - Password hashing
- Helmet                 - Security headers
- CORS                   - Cross-origin requests
```

## Project Structure

```
src/
├── config/
│   └── database.js                      # Sequelize config
│
├── models/                              # 9 Sequelize models
│   ├── User.js                         # Petani, Penyuluh, Admin
│   ├── Lahan.js                        # Land data
│   ├── Tanaman.js                      # Crop data
│   ├── Sensor.js                       # Sensor configuration
│   ├── SensorData.js                   # Sensor readings
│   ├── NilaiNormal.js                  # Threshold config
│   ├── Notifikasi.js                   # Alerts
│   ├── Rekomendasi.js                  # Recommendations
│   ├── LaporanLahan.js                 # Reports
│   └── index.js                        # Model associations
│
├── controllers/                         # 10 Controllers
│   ├── authController.js               # 6 endpoints
│   ├── lahanController.js              # 6 endpoints
│   ├── tanamanController.js            # 5 endpoints
│   ├── sensorController.js             # 6 endpoints
│   ├── sensorDataController.js         # 3 endpoints
│   ├── nilaiNormalController.js        # 3 endpoints
│   ├── notifikasiController.js         # 7 endpoints
│   ├── rekomendasiController.js        # 6 endpoints
│   ├── laporanController.js            # 4 endpoints
│   └── adminController.js              # 6 endpoints
│
├── routes/                              # 9 Route files
│   ├── authRoutes.js
│   ├── lahanRoutes.js
│   ├── tanamanRoutes.js
│   ├── sensorRoutes.js
│   ├── notifikasiRoutes.js
│   ├── rekomendasiRoutes.js
│   ├── laporanRoutes.js
│   └── adminRoutes.js
│
├── middleware/
│   ├── auth.js                         # JWT auth & authorization
│   └── validate.js                     # Request validation
│
├── validation/
│   └── schemas.js                      # Joi validation schemas
│
├── services/
│   └── monitoringService.js            # Cron jobs (5min, daily)
│
├── utils/
│   ├── jwt.js                          # Token generation/verify
│   └── response.js                     # Standardized responses
│
├── scripts/
│   └── syncDB.js                       # Database sync & seeding
│
└── server.js                           # Main Express app
```

## API Endpoints Summary

```
Total: 52+ Endpoints

Authentication (6):
  POST /api/auth/register
  POST /api/auth/login
  GET /api/auth/profile
  PUT /api/auth/profile
  POST /api/auth/change-password
  POST /api/auth/logout

Lahan Management (6):
  POST /api/lahan
  GET /api/lahan
  GET /api/lahan/:lahanId
  PUT /api/lahan/:lahanId
  DELETE /api/lahan/:lahanId
  GET /api/lahan/:lahanId/statistics

Tanaman Management (5):
  POST /api/tanaman/:lahanId/tamans
  GET /api/tanaman/:lahanId/tamans
  GET /api/tanaman/tanaman/:tanamanId
  PUT /api/tanaman/tanaman/:tanamanId
  DELETE /api/tanaman/tanaman/:tanamanId

Sensor Setup (6):
  POST /api/sensor/:lahanId/sensors
  GET /api/sensor/:lahanId/sensors
  GET /api/sensor/sensor/:sensorId
  PUT /api/sensor/sensor/:sensorId
  DELETE /api/sensor/sensor/:sensorId
  GET /api/sensor/sensor/:sensorId/last-data

Sensor Monitoring (3):
  POST /api/sensor/data/input
  GET /api/sensor/data/:sensorId/history
  GET /api/sensor/data/:sensorId/statistics

Threshold Configuration (3):
  POST /api/sensor/nilai-normal/create
  GET /api/sensor/nilai-normal/:sensorId
  PUT /api/sensor/nilai-normal/:nilaiNormalId

Notifications (7):
  GET /api/notifikasi
  GET /api/notifikasi/:notifikasiId
  PUT /api/notifikasi/:notifikasiId/read
  PUT /api/notifikasi/read-all
  GET /api/notifikasi/unread/count
  DELETE /api/notifikasi/:notifikasiId
  GET /api/notifikasi/statistics

Recommendations (6):
  POST /api/rekomendasi
  GET /api/rekomendasi
  GET /api/rekomendasi/:rekomendasiId
  PUT /api/rekomendasi/:rekomendasiId/status
  PUT /api/rekomendasi/:rekomendasiId/approve
  DELETE /api/rekomendasi/:rekomendasiId

Reports (4):
  POST /api/laporan
  GET /api/laporan/:lahanId
  GET /api/laporan/detail/:laporanId
  GET /api/laporan/pdf/:laporanId

Admin Dashboard (6):
  GET /api/admin/statistics
  GET /api/admin/activity
  GET /api/admin/users
  GET /api/admin/users/:userId
  PUT /api/admin/users/:userId/deactivate
  PUT /api/admin/users/:userId/reactivate
  DELETE /api/admin/users/:userId
  GET /api/admin/lahans
  GET /api/admin/sensors
```

## Quick Start

### 1. Install & Setup
```bash
pnpm install
cp .env.example .env
# Configure database credentials in .env
```

### 2. Sync Database
```bash
pnpm run db:sync
```

### 3. Start Server
```bash
pnpm run dev
```

### 4. Test API
```bash
curl http://localhost:3000/health
```

Lihat `QUICKSTART.md` untuk contoh API calls lengkap.
Lihat `API_DOCUMENTATION.md` untuk dokumentasi detail semua endpoints.

## Key Implementation Details

### Authentication
- JWT token dengan `HS256` algorithm
- Password hashing dengan bcryptjs (10 salt rounds)
- Token expiry: 7 hari (configurable)
- Middleware `authenticate` untuk protected routes
- Middleware `authorize` untuk role-based access

### Database Design
- 9 Sequelize models dengan proper relationships
- UUID primary keys
- Soft delete ready dengan `timestamps`
- Foreign key constraints
- Index optimization

### Data Validation
- Joi schemas untuk semua inputs
- Custom validation middleware
- Automatic request body sanitization
- Detailed error messages

### Error Handling
- Centralized error response format
- HTTP status codes yang sesuai
- Detailed error logging
- Graceful error recovery

### Security Features
- Helmet untuk security headers
- CORS configuration
- Parameter validation
- SQL injection prevention (via Sequelize)
- XSS protection
- Rate limiting ready (future enhancement)

### Performance
- Database connection pooling
- Pagination untuk list endpoints
- Efficient queries dengan proper includes/joins
- Caching ready infrastructure
- Scheduled background tasks

## Future Enhancements

1. **Real-time WebSocket**: Live sensor data streaming
2. **Mobile App**: React Native frontend
3. **IoT Integration**: Direct device APIs
4. **Advanced Analytics**: ML predictions
5. **Email/SMS Alerts**: Multi-channel notifications
6. **Weather Data**: Integration dengan weather API
7. **Image Upload**: Photo documentation
8. **Multi-language**: i18n support
9. **Rate Limiting**: API throttling
10. **API Versioning**: v1, v2 support

## Testing

Recommended testing tools:
- **Postman**: REST API testing
- **Jest**: Unit & integration tests
- **Artillery**: Load testing
- **Supertest**: HTTP assertion

## Deployment

### Environment Checklist
- [ ] Change JWT_SECRET
- [ ] Configure production database
- [ ] Setup SSL/HTTPS
- [ ] Configure CORS origins
- [ ] Setup PM2/Docker
- [ ] Configure logging
- [ ] Setup backup strategy
- [ ] Configure monitoring

### Recommended Hosting
- **VPS**: AWS EC2, DigitalOcean, Linode
- **Container**: Docker + Kubernetes
- **Platform**: Heroku, Railway, Render
- **Serverless**: AWS Lambda (API Gateway)

## Documentation Files

- `API_DOCUMENTATION.md` - Complete API reference
- `QUICKSTART.md` - Setup & testing guide
- `.env.example` - Environment variables template

## Support & Maintenance

For issues or enhancements:
1. Check documentation first
2. Review error logs
3. Check database integrity
4. Verify API request format
5. Test with fresh database sync

## License

Proprietary - Agricultural Monitoring System

## Author

Generated by v0 - Vercel AI Code Generation

---

**Last Updated**: May 5, 2026
**Version**: 1.0.0
**Status**: Production Ready
