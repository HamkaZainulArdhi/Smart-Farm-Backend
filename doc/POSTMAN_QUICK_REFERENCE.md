# Smart Farm API - Quick Reference for Postman

**Base URL**: `http://localhost:3000`  
**Auth Header**: `Authorization: Bearer <TOKEN>`

---

## 🔐 AUTHENTICATION

### 1. Register

```
POST http://localhost:3000/api/auth/register
```

**Request:**

```json
{
  "nama": "Budi Santoso",
  "email": "budi@example.com",
  "password": "password123",
  "nomor_telepon": "08123456789",
  "alamat": "Jl. Raya Sawah No. 10, Subang",
  "role": "petani"
}
```

### 2. Login

```
POST http://localhost:3000/api/auth/login
```

**Request:**

```json
{
  "email": "budi@example.com",
  "password": "password123"
}
```

### 3. Get Profile

```
GET http://localhost:3000/api/auth/profile
```

### 4. Update Profile

```
PUT http://localhost:3000/api/auth/profile
```

**Request:**

```json
{
  "nama": "Budi Santoso Updated",
  "nomor_telepon": "08198765432",
  "alamat": "Jl. Raya Sawah No. 15, Subang"
}
```

### 5. Change Password

```
POST http://localhost:3000/api/auth/change-password
```

**Request:**

```json
{
  "password_lama": "password123",
  "password_baru": "newpassword456"
}
```

### 6. Logout

```
POST http://localhost:3000/api/auth/logout
```

---

## 🌾 LAHAN (Land Management)

### 1. Create Lahan

```
POST http://localhost:3000/api/lahan
```

**Request:**

```json
{
  "nama_lahan": "Lahan Padi Utama",
  "lokasi": "Desa Cihideung, Subang",
  "luas_lahan": 2.5,
  "jenis_tanah": "Tanah Liat Berpasir",
  "koordinat_latitude": -6.9175,
  "koordinat_longitude": 107.7618,
  "deskripsi": "Lahan padi produktif dengan irigasi teknis"
}
```

### 2. Get All Lahan

```
GET http://localhost:3000/api/lahan
```

**Query Params:** `?page=1&limit=10`

### 3. Get Lahan by ID

```
GET http://localhost:3000/api/lahan/b9b5aebd-45fc-4aec-b609-15e59738fc62
```

### 4. Update Lahan

```
PUT http://localhost:3000/api/lahan/b9b5aebd-45fc-4aec-b609-15e59738fc62
```

**Request:**

```json
{
  "nama_lahan": "Lahan Padi Utama Updated",
  "lokasi": "Desa Cihideung, Subang",
  "luas_lahan": 3.0,
  "jenis_tanah": "Tanah Liat Berpasir",
  "koordinat_latitude": -6.9175,
  "koordinat_longitude": 107.7618,
  "deskripsi": "Lahan padi produktif dengan irigasi teknis upgraded"
}
```

### 5. Delete Lahan

```
DELETE http://localhost:3000/api/lahan/b9b5aebd-45fc-4aec-b609-15e59738fc62
```

### 6. Get Lahan Statistics

```
GET http://localhost:3000/api/lahan/b9b5aebd-45fc-4aec-b609-15e59738fc62/statistics
```

---

## 🌱 TANAMAN (Crop Management)

### 1. Create Tanaman

```
POST http://localhost:3000/api/tanaman/b9b5aebd-45fc-4aec-b609-15e59738fc62/tamans
```

**Request:**

```json
{
  "nama_tanaman": "Padi IR-64",
  "jenis_tanaman": "Padi",
  "tanggal_tanam": "2026-03-15",
  "estimasi_panen": "2026-06-15",
  "luas_tanaman": 2.5,
  "varietas": "IR-64",
  "status": "berkembang",
  "deskripsi": "Tanaman padi musim tanam 2026"
}
```

### 2. Get All Tanaman

```
GET http://localhost:3000/api/tanaman/b9b5aebd-45fc-4aec-b609-15e59738fc62/tamans
```

**Query Params:** `?page=1&limit=10`

### 3. Get Tanaman by ID

```
GET http://localhost:3000/api/tanaman/tanaman/550e8400-e29b-41d4-a716-446655440001
```

### 4. Update Tanaman

```
PUT http://localhost:3000/api/tanaman/tanaman/550e8400-e29b-41d4-a716-446655440001
```

**Request:**

```json
{
  "nama_tanaman": "Padi IR-64 Updated",
  "jenis_tanaman": "Padi",
  "estimasi_panen": "2026-06-20",
  "luas_tanaman": 2.5,
  "varietas": "IR-64",
  "status": "siap_panen",
  "deskripsi": "Tanaman padi siap dipanen"
}
```

### 5. Delete Tanaman

```
DELETE http://localhost:3000/api/tanaman/tanaman/550e8400-e29b-41d4-a716-446655440001
```

---

## 📡 SENSOR

### 1. Create Sensor

```
POST http://localhost:3000/api/sensor/b9b5aebd-45fc-4aec-b609-15e59738fc62/sensors
```

**Request:**

```json
{
  "nama_sensor": "Sensor Suhu DHT22",
  "tipe_sensor": "suhu",
  "kode_sensor": "SNS-001",
  "lokasi_sensor": "Tengah Lahan Padi",
  "status": "aktif",
  "tipe_koneksi": "WiFi",
  "deskripsi": "Sensor suhu dan kelembapan DHT22 di area padi"
}
```

### 2. Get All Sensors

```
GET http://localhost:3000/api/sensor/b9b5aebd-45fc-4aec-b609-15e59738fc62/sensors
```

**Query Params:** `?page=1&limit=10`

### 3. Get Sensor by ID

```
GET http://localhost:3000/api/sensor/sensor/070a0b11-e625-4460-b619-307f5e642109
```

### 4. Update Sensor

```
PUT http://localhost:3000/api/sensor/sensor/070a0b11-e625-4460-b619-307f5e642109
```

**Request:**  

```json
{
  "nama_sensor": "Sensor Suhu DHT22 Updated",
  "status": "aktif",
  "lokasi_sensor": "Tengah Lahan Padi Terupdate",
  "deskripsi": "Sensor suhu dan kelembapan DHT22 di area padi updated"
}
```

### 5. Delete Sensor

```
DELETE http://localhost:3000/api/sensor/sensor/070a0b11-e625-4460-b619-307f5e642109
```

### 6. Get Last Sensor Data

```
GET http://localhost:3000/api/sensor/sensor/655fbc79-a0b4-4a75-9ed1-e9d8c00758db/last-data
```

---

## 📊 SENSOR DATA

### 1. Input Sensor Data

```
POST http://localhost:3000/api/sensor/data/input
```

**Request:**

```json
{
  "sensorId": "070a0b11-e625-4460-b619-307f5e642109",
  "nilai": 28.5,
  "satuan": "Celsius",
  "tanggal_pencatatan": "2026-05-17T14:30:00Z"
}
```

### 2. Get Sensor Data History

```
GET http://localhost:3000/api/sensor/data/070a0b11-e625-4460-b619-307f5e642109/history
```

**Query Params:** `?page=1&limit=50&dari_tanggal=2026-05-01&sampai_tanggal=2026-05-17`

### 3. Get Sensor Statistics

```
GET http://localhost:3000/api/sensor/data/070a0b11-e625-4460-b619-307f5e642109/statistics
```

**Query Params:** `?dari_tanggal=2026-05-01&sampai_tanggal=2026-05-17`

---

## 📈 NILAI NORMAL (Thresholds)

### 1. Create Nilai Normal

```
POST http://localhost:3000/api/sensor/nilai-normal/create
```

**Request:**

```json
{
  "sensorId": "070a0b11-e625-4460-b619-307f5e642109",
  "nilai_min": 20,
  "nilai_max": 32,
  "nilai_peringatan_min": 18,
  "nilai_peringatan_max": 35,
  "nilai_kritis_min": 15,
  "nilai_kritis_max": 38,
  "deskripsi": "Nilai normal suhu untuk tanaman padi"
}
```

### 2. Get Nilai Normal by Sensor

```
GET http://localhost:3000/api/sensor/nilai-normal/070a0b11-e625-4460-b619-307f5e642109
```

### 3. Update Nilai Normal

```
PUT http://localhost:3000/api/sensor/nilai-normal/c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f
```

**Request:**

```json
{
  "nilai_min": 20,
  "nilai_max": 32,
  "nilai_peringatan_min": 18,
  "nilai_peringatan_max": 35,
  "nilai_kritis_min": 15,
  "nilai_kritis_max": 38,
  "deskripsi": "Nilai normal suhu untuk tanaman padi updated"
}
```

---

## 🔔 NOTIFIKASI (Notifications)

### 1. Get All Notifications

```
GET http://localhost:3000/api/notifikasi
```

**Query Params:** `?page=1&limit=10&status=belum_dibaca`

### 2. Get Notification by ID

```
GET http://localhost:3000/api/notifikasi/d5e6f7g8-h9i0-1j2k-3l4m-5n6o7p8q9r0s
```

### 3. Mark as Read

```
PUT http://localhost:3000/api/notifikasi/d5e6f7g8-h9i0-1j2k-3l4m-5n6o7p8q9r0s/read
```

### 4. Mark All as Read

```
PUT http://localhost:3000/api/notifikasi/read-all
```

### 5. Get Unread Count

```
GET http://localhost:3000/api/notifikasi/unread/count
```

### 6. Delete Notification

```
DELETE http://localhost:3000/api/notifikasi/d5e6f7g8-h9i0-1j2k-3l4m-5n6o7p8q9r0s
```

### 7. Get Notification Statistics

```
GET http://localhost:3000/api/notifikasi/statistics
```

---

## 💡 REKOMENDASI (Recommendations)

### 1. Create Rekomendasi

```
POST http://localhost:3000/api/rekomendasi
```

**Request:**

```json
{
  "notifikasiId": "d5e6f7g8-h9i0-1j2k-3l4m-5n6o7p8q9r0s",
  "judul_rekomendasi": "Kurangi Penyiraman",
  "deskripsi_tindakan": "Suhu sudah mencapai 32 derajat, sebaiknya kurangi penyiraman untuk menghindari evapotranspirasi berlebihan",
  "prioritas": "tinggi"
}
```

### 2. Get All Recommendations

```
GET http://localhost:3000/api/rekomendasi
```

**Query Params:** `?page=1&limit=10&status=pending&prioritas=tinggi`

### 3. Get Recommendation by ID

```
GET http://localhost:3000/api/rekomendasi/e6f7g8h9-i0j1-2k3l-4m5n-6o7p8q9r0s1t
```

### 4. Update Recommendation Status

```
PUT http://localhost:3000/api/rekomendasi/e6f7g8h9-i0j1-2k3l-4m5n-6o7p8q9r0s1t/status
```

**Request:**

```json
{
  "status": "sedang_dikerjakan"
}
```

### 5. Approve/Reject Recommendation

```
PUT http://localhost:3000/api/rekomendasi/e6f7g8h9-i0j1-2k3l-4m5n-6o7p8q9r0s1t/pprovea
```

**Request:**

```json
{
  "status_approval": "disetujui"
}
```

### 6. Delete Recommendation

```
DELETE http://localhost:3000/api/rekomendasi/e6f7g8h9-i0j1-2k3l-4m5n-6o7p8q9r0s1t
```

---

## 📄 LAPORAN (Reports)

### 1. Create Laporan

```
POST http://localhost:3000/api/laporan
```

**Request:**

```json
{
  "lahanId": "b9b5aebd-45fc-4aec-b609-15e59738fc62",
  "periode_awal": "2026-05-01",
  "periode_akhir": "2026-05-17"
}
```

### 2. Get All Laporan by Lahan

```
GET http://localhost:3000/api/laporan/b9b5aebd-45fc-4aec-b609-15e59738fc62
```

**Query Params:** `?page=1&limit=10`

### 3. Get Laporan Detail

```
GET http://localhost:3000/api/laporan/detail/f7g8h9i0-j1k2-3l4m-5n6o-7p8q9r0s1t2u
```

### 4. Generate PDF Laporan

```
GET http://localhost:3000/api/laporan/pdf/f7g8h9i0-j1k2-3l4m-5n6o-7p8q9r0s1t2u
```

---

## 📌 REAL DATABASE IDs

**Users:**

- `7cdef1ee-1ecf-47e9-86f1-f06d1aa4c7cb` (Petani)
- `65319eda-334c-4840-a2f0-79ebc6af6830` (Penyuluh)
- `a40f0a06-d458-4b60-95a1-fa166c924799` (Admin)

**Lahans:**

- `b9b5aebd-45fc-4aec-b609-15e59738fc62` (Lahan Bapa Karso)
- `ea32cdda-0d34-4c69-a0a8-1eef52e70f4c` (Lahan Padi Utama)
- `f38df0e1-8926-48b4-b124-160d5ac6a519` (Kebun Kopi Arabika)

---

## ⚙️ POSTMAN SETUP

**Environment Variables:**

```
base_url = http://localhost:3000
token = <your_jwt_token>
lahanId = b9b5aebd-45fc-4aec-b609-15e59738fc62
sensorId = 070a0b11-e625-4460-b619-307f5e642109
```

**Pre-request Script (for login/register):**

```javascript
// Auto-save token from response
if (pm.response.code === 200 || pm.response.code === 201) {
  const jsonData = pm.response.json();
  if (jsonData.data && jsonData.data.token) {
    pm.environment.set("token", jsonData.data.token);
  }
}
```

---

## ✅ HTTP Status Codes

- `200` - Success (GET, PUT)
- `201` - Created (POST)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (no access)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Server Error
