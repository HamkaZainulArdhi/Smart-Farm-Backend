/**
 * OpenAPI 3.0.3 specification — Agricultural Monitoring Backend.
 *
 * Spec statis terpusat (baseline dokumentasi). Disusun 1:1 dari static analysis:
 * - src/server.js (mount points)
 * - src/routes/*.js (9 router, 60 API routes + GET /health)
 * - src/validation/schemas.js (12 Joi schema -> components.schemas manual)
 * - src/middleware/auth.js (JWT Bearer) + src/controllers/* (query param aktual via req.query)
 *
 * Tidak ada logika bisnis di file ini. Jangan import selain di src/server.js.
 */

const bearerAuth = {
  bearerAuth: {
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT",
    description:
      "JWT dari POST /api/auth/login atau POST /api/auth/register. Kirim sebagai header: Authorization: Bearer <token>",
  },
};

const schemas = {
  Error: {
    type: "object",
    properties: {
      success: { type: "boolean", example: false },
      message: { type: "string", example: "Token tidak ditemukan atau format salah" },
      errors: { type: "string", nullable: true, example: null },
      timestamp: { type: "string", format: "date-time" },
    },
  },
  Success: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Berhasil" },
      data: { type: "object", nullable: true, description: "Payload bervariasi per endpoint" },
      timestamp: { type: "string", format: "date-time" },
    },
  },
  Paginated: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      message: { type: "string", example: "Berhasil" },
      data: { type: "array", items: { type: "object" } },
      pagination: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          total: { type: "integer", example: 42 },
          totalPages: { type: "integer", example: 5 },
        },
      },
      timestamp: { type: "string", format: "date-time" },
    },
  },
  User: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      nama: { type: "string" },
      email: { type: "string", format: "email" },
      nomor_telepon: { type: "string", nullable: true },
      alamat: { type: "string", nullable: true },
      role: { type: "string", enum: ["petani", "penyuluh", "admin"] },
      aktif: { type: "boolean" },
    },
  },
  AuthPayload: {
    type: "object",
    properties: {
      user: { $ref: "#/components/schemas/User" },
      token: { type: "string", description: "JWT, expiry default 7 hari" },
    },
  },
  RegisterRequest: {
    type: "object",
    required: ["nama", "email", "password"],
    properties: {
      nama: { type: "string" },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 },
      nomor_telepon: { type: "string" },
      alamat: { type: "string" },
      role: { type: "string", enum: ["petani", "penyuluh"], default: "petani" },
    },
  },
  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
  },
  UpdateProfileRequest: {
    type: "object",
    description: "Tanpa validasi Joi server-side. Hanya field ini yang diproses controller.",
    properties: {
      nama: { type: "string" },
      nomor_telepon: { type: "string" },
      alamat: { type: "string" },
    },
  },
  ChangePasswordRequest: {
    type: "object",
    required: ["password_lama", "password_baru"],
    properties: {
      password_lama: { type: "string" },
      password_baru: { type: "string" },
    },
  },
  CreateLahanRequest: {
    type: "object",
    required: ["nama_lahan", "lokasi", "luas_lahan"],
    properties: {
      nama_lahan: { type: "string" },
      lokasi: { type: "string" },
      luas_lahan: { type: "number", exclusiveMinimum: 0 },
      jenis_tanah: { type: "string" },
      koordinat_latitude: { type: "number" },
      koordinat_longitude: { type: "number" },
      deskripsi: { type: "string" },
    },
  },
  UpdateLahanRequest: {
    type: "object",
    properties: {
      nama_lahan: { type: "string" },
      lokasi: { type: "string" },
      luas_lahan: { type: "number", exclusiveMinimum: 0 },
      jenis_tanah: { type: "string" },
      koordinat_latitude: { type: "number" },
      koordinat_longitude: { type: "number" },
      deskripsi: { type: "string" },
    },
  },
  CreateTanamanRequest: {
    type: "object",
    required: ["lahanId", "nama_tanaman", "jenis_tanaman", "tanggal_tanam"],
    properties: {
      lahanId: { type: "string", format: "uuid", description: "Duplikat :lahanId di URL (wajib di body per Joi)" },
      nama_tanaman: { type: "string" },
      jenis_tanaman: { type: "string" },
      tanggal_tanam: { type: "string", format: "date" },
      estimasi_panen: { type: "string", format: "date" },
      luas_tanaman: { type: "number", exclusiveMinimum: 0 },
      varietas: { type: "string" },
      status: {
        type: "string",
        enum: ["perencanaan", "tanam", "berkembang", "siap_panen", "selesai"],
        default: "tanam",
      },
      deskripsi: { type: "string" },
    },
  },
  UpdateTanamanRequest: {
    type: "object",
    description: "Tanpa validasi Joi. Field yang diproses: nama_tanaman, jenis_tanaman, estimasi_panen, luas_tanaman, varietas, status, deskripsi.",
    properties: {
      nama_tanaman: { type: "string" },
      jenis_tanaman: { type: "string" },
      estimasi_panen: { type: "string", format: "date" },
      luas_tanaman: { type: "number" },
      varietas: { type: "string" },
      status: { type: "string", enum: ["perencanaan", "tanam", "berkembang", "siap_panen", "selesai"] },
      deskripsi: { type: "string" },
    },
  },
  CreateSensorRequest: {
    type: "object",
    required: ["lahanId", "nama_sensor", "tipe_sensor", "kode_sensor"],
    properties: {
      lahanId: { type: "string", format: "uuid" },
      nama_sensor: { type: "string" },
      tipe_sensor: { type: "string", enum: ["suhu", "kelembapan", "ph", "intensitas_cahaya"] },
      kode_sensor: { type: "string" },
      lokasi_sensor: { type: "string" },
      status: { type: "string", enum: ["aktif", "tidak_aktif", "rusak"], default: "aktif" },
      tipe_koneksi: { type: "string" },
      deskripsi: { type: "string" },
    },
  },
  UpdateSensorRequest: {
    type: "object",
    description: "Tanpa validasi Joi. Field yang diproses: nama_sensor, status, lokasi_sensor, deskripsi.",
    properties: {
      nama_sensor: { type: "string" },
      status: { type: "string" },
      lokasi_sensor: { type: "string" },
      deskripsi: { type: "string" },
    },
  },
  CreateSensorDataRequest: {
    type: "object",
    required: ["sensorId", "nilai", "satuan"],
    properties: {
      sensorId: { type: "string", format: "uuid" },
      nilai: { type: "number" },
      satuan: { type: "string" },
      tanggal_pencatatan: { type: "string", format: "date-time" },
    },
  },
  CreateNilaiNormalRequest: {
    type: "object",
    required: ["sensorId", "nilai_min", "nilai_max"],
    properties: {
      sensorId: { type: "string", format: "uuid" },
      nilai_min: { type: "number" },
      nilai_max: { type: "number" },
      nilai_peringatan_min: { type: "number" },
      nilai_peringatan_max: { type: "number" },
      nilai_kritis_min: { type: "number" },
      nilai_kritis_max: { type: "number" },
      deskripsi: { type: "string" },
    },
  },
  UpdateNilaiNormalRequest: {
    type: "object",
    description: "Tanpa validasi Joi. Field: nilai_min, nilai_max, nilai_peringatan_*, nilai_kritis_*, deskripsi.",
    properties: {
      nilai_min: { type: "number" },
      nilai_max: { type: "number" },
      nilai_peringatan_min: { type: "number" },
      nilai_peringatan_max: { type: "number" },
      nilai_kritis_min: { type: "number" },
      nilai_kritis_max: { type: "number" },
      deskripsi: { type: "string" },
    },
  },
  CreateRekomendasiRequest: {
    type: "object",
    required: ["notifikasiId", "judul_rekomendasi", "deskripsi_tindakan"],
    properties: {
      notifikasiId: { type: "string", format: "uuid" },
      judul_rekomendasi: { type: "string" },
      deskripsi_tindakan: { type: "string" },
      prioritas: { type: "string", enum: ["rendah", "sedang", "tinggi"], default: "sedang" },
    },
  },
  UpdateRekomendasiStatusRequest: {
    type: "object",
    required: ["status"],
    properties: {
      status: { type: "string", enum: ["pending", "sedang_dikerjakan", "selesai", "ditolak"] },
    },
  },
  ApproveRekomendasiRequest: {
    type: "object",
    required: ["status_approval"],
    properties: {
      status_approval: { type: "string", enum: ["disetujui", "ditolak"] },
    },
  },
  CreateLaporanRequest: {
    type: "object",
    required: ["lahanId", "periode_awal", "periode_akhir"],
    properties: {
      lahanId: { type: "string", format: "uuid" },
      periode_awal: { type: "string", format: "date" },
      periode_akhir: { type: "string", format: "date", description: "Harus > periode_awal" },
    },
  },
  UpdateAnalysisRequest: {
    type: "object",
    description: "Tanpa validasi/upload. Controller menyalin field body yang dikenal secara generik.",
    properties: {
      plant_name: { type: "string" },
      disease_name: { type: "string" },
      severity: { type: "string" },
      confidence: { type: "number" },
      notes: { type: "string" },
    },
  },
};

// Reusable parameter & response fragments (OpenAPI 3.0 $ref ke components)
const parameters = {
  Page: {
    name: "page",
    in: "query",
    schema: { type: "integer", minimum: 1, default: 1 },
    description: "Halaman (default di controller: 1)",
  },
  Limit: {
    name: "limit",
    in: "query",
    schema: { type: "integer", minimum: 1 },
    description: "Jumlah per halaman (default bervariasi 10/20/50, plant-analysis max 100)",
  },
};

const error = (description) => ({
  description,
  content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } },
});

const success = (description) => ({
  description,
  content: { "application/json": { schema: { $ref: "#/components/schemas/Success" } } },
});

const paginated = (description) => ({
  description,
  content: { "application/json": { schema: { $ref: "#/components/schemas/Paginated" } } },
});

const unauthorized = () => error("401 — Token hilang/tidak valid/user nonaktif");
const forbidden = () => error("403 — Role tidak diizinkan (khusus /api/admin)");

const uuidParam = (name, description) => ({
  name,
  in: "path",
  required: true,
  schema: { type: "string" },
  description,
});

export const openapiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Agricultural Monitoring Backend",
    version: "1.0.0",
    description:
      "Baseline API documentation (static spec). 60 API routes + GET /health. Auth: JWT Bearer; role admin khusus /api/admin. " +
      "Spec ini digenerate dari static analysis route + Joi schema, bukan dari runtime introspection.",
  },
  servers: [{ url: "http://localhost:3000", description: "Local (PORT env, default 3000)" }],
  tags: [
    { name: "Health", description: "Health check" },
    { name: "Auth", description: "Registrasi, login, profil" },
    { name: "Lahan", description: "Manajemen lahan" },
    { name: "Tanaman", description: "Manajemen tanaman per lahan" },
    { name: "Sensor", description: "Sensor, data histori, nilai normal" },
    { name: "Notifikasi", description: "Notifikasi monitoring" },
    { name: "Rekomendasi", description: "Rekomendasi tindak lanjut" },
    { name: "Laporan", description: "Laporan periode + PDF" },
    { name: "Admin", description: "Khusus role admin" },
    { name: "Plant Analysis", description: "Analisis gambar tanaman (multer upload)" },
  ],
  security: [{ bearerAuth: [] }],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        security: [],
        responses: {
          200: {
            description: "OK",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "OK" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ---------- AUTH ----------
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registrasi user baru",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } },
        },
        responses: {
          201: {
            description: "Registrasi berhasil",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthPayload" } } },
          },
          400: error("400 — Validasi Joi gagal"),
          409: error("409 — Email sudah terdaftar"),
          500: error("500 — Error server"),
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login, dapatkan JWT",
        security: [],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } },
        },
        responses: {
          200: {
            description: "Login berhasil",
            content: { "application/json": { schema: { $ref: "#/components/schemas/AuthPayload" } } },
          },
          400: error("400 — Validasi Joi gagal"),
          401: error("401 — Email/password salah atau user nonaktif"),
          500: error("500 — Error server"),
        },
      },
    },
    "/api/auth/profile": {
      get: {
        tags: ["Auth"],
        summary: "Ambil profil user login",
        responses: { 200: success("Profil user"), 401: unauthorized(), 404: error("404 — User tidak ditemukan") },
      },
      put: {
        tags: ["Auth"],
        summary: "Update profil (nama, nomor_telepon, alamat)",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateProfileRequest" } } },
        },
        responses: { 200: success("Profil diupdate"), 401: unauthorized(), 404: error("404 — User tidak ditemukan") },
      },
    },
    "/api/auth/change-password": {
      post: {
        tags: ["Auth"],
        summary: "Ubah password",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ChangePasswordRequest" } } },
        },
        responses: {
          200: success("Password diubah"),
          400: error("400 — Field wajib kosong"),
          401: unauthorized(),
          404: error("404 — User tidak ditemukan"),
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout (stateless, tanpa invalidasi token)",
        responses: { 200: success("Logout berhasil"), 401: unauthorized() },
      },
    },

    // ---------- LAHAN ----------
    "/api/lahan/": {
      post: {
        tags: ["Lahan"],
        summary: "Buat lahan baru",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateLahanRequest" } } },
        },
        responses: { 201: success("Lahan dibuat"), 400: error("400 — Validasi gagal"), 401: unauthorized() },
      },
      get: {
        tags: ["Lahan"],
        summary: "Daftar lahan (paginated)",
        parameters: [{ $ref: "#/components/parameters/Page" }, { $ref: "#/components/parameters/Limit" }],
        responses: { 200: paginated("Daftar lahan"), 401: unauthorized() },
      },
    },
    "/api/lahan/{lahanId}": {
      get: {
        tags: ["Lahan"],
        summary: "Detail lahan",
        parameters: [uuidParam("lahanId", "ID lahan")],
        responses: { 200: success("Detail lahan"), 401: unauthorized(), 404: error("404 — Lahan tidak ditemukan") },
      },
      put: {
        tags: ["Lahan"],
        summary: "Update lahan (semua field opsional)",
        parameters: [uuidParam("lahanId", "ID lahan")],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateLahanRequest" } } },
        },
        responses: { 200: success("Lahan diupdate"), 400: error("400 — Validasi gagal"), 401: unauthorized(), 404: error("404 — Lahan tidak ditemukan") },
      },
      delete: {
        tags: ["Lahan"],
        summary: "Hapus lahan",
        parameters: [uuidParam("lahanId", "ID lahan")],
        responses: { 200: success("Lahan dihapus"), 401: unauthorized(), 404: error("404 — Lahan tidak ditemukan") },
      },
    },
    "/api/lahan/{lahanId}/statistics": {
      get: {
        tags: ["Lahan"],
        summary: "Statistik lahan",
        parameters: [uuidParam("lahanId", "ID lahan")],
        responses: { 200: success("Statistik lahan"), 401: unauthorized(), 404: error("404 — Lahan tidak ditemukan") },
      },
    },

    // ---------- TANAMAN (pertahankan typo literal "tamans") ----------
    "/api/tanaman/{lahanId}/tamans": {
      post: {
        tags: ["Tanaman"],
        summary: "Tambah tanaman ke lahan",
        parameters: [uuidParam("lahanId", "ID lahan (path)")],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateTanamanRequest" } } },
        },
        responses: { 201: success("Tanaman dibuat"), 400: error("400 — Validasi gagal"), 401: unauthorized() },
      },
      get: {
        tags: ["Tanaman"],
        summary: "Daftar tanaman per lahan (paginated)",
        parameters: [
          uuidParam("lahanId", "ID lahan (path)"),
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/Limit" },
        ],
        responses: { 200: paginated("Daftar tanaman"), 401: unauthorized() },
      },
    },
    "/api/tanaman/tanaman/{tanamanId}": {
      get: {
        tags: ["Tanaman"],
        summary: "Detail tanaman",
        parameters: [uuidParam("tanamanId", "ID tanaman")],
        responses: { 200: success("Detail tanaman"), 401: unauthorized(), 404: error("404 — Tanaman tidak ditemukan") },
      },
      put: {
        tags: ["Tanaman"],
        summary: "Update tanaman (tanpa validasi Joi)",
        parameters: [uuidParam("tanamanId", "ID tanaman")],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateTanamanRequest" } } },
        },
        responses: { 200: success("Tanaman diupdate"), 401: unauthorized(), 404: error("404 — Tanaman tidak ditemukan") },
      },
      delete: {
        tags: ["Tanaman"],
        summary: "Hapus tanaman",
        parameters: [uuidParam("tanamanId", "ID tanaman")],
        responses: { 200: success("Tanaman dihapus"), 401: unauthorized(), 404: error("404 — Tanaman tidak ditemukan") },
      },
    },

    // ---------- SENSOR ----------
    "/api/sensor/{lahanId}/sensors": {
      post: {
        tags: ["Sensor"],
        summary: "Daftarkan sensor ke lahan",
        parameters: [uuidParam("lahanId", "ID lahan (path)")],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateSensorRequest" } } },
        },
        responses: { 201: success("Sensor dibuat"), 400: error("400 — Validasi gagal"), 401: unauthorized() },
      },
      get: {
        tags: ["Sensor"],
        summary: "Daftar sensor per lahan (paginated)",
        parameters: [
          uuidParam("lahanId", "ID lahan (path)"),
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/Limit" },
        ],
        responses: { 200: paginated("Daftar sensor"), 401: unauthorized() },
      },
    },
    "/api/sensor/sensor/{sensorId}": {
      get: {
        tags: ["Sensor"],
        summary: "Detail sensor",
        parameters: [uuidParam("sensorId", "ID sensor")],
        responses: { 200: success("Detail sensor"), 401: unauthorized(), 404: error("404 — Sensor tidak ditemukan") },
      },
      put: {
        tags: ["Sensor"],
        summary: "Update sensor (tanpa validasi Joi)",
        parameters: [uuidParam("sensorId", "ID sensor")],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateSensorRequest" } } },
        },
        responses: { 200: success("Sensor diupdate"), 401: unauthorized(), 404: error("404 — Sensor tidak ditemukan") },
      },
      delete: {
        tags: ["Sensor"],
        summary: "Hapus sensor",
        parameters: [uuidParam("sensorId", "ID sensor")],
        responses: { 200: success("Sensor dihapus"), 401: unauthorized(), 404: error("404 — Sensor tidak ditemukan") },
      },
    },
    "/api/sensor/sensor/{sensorId}/last-data": {
      get: {
        tags: ["Sensor"],
        summary: "Data terakhir sensor",
        parameters: [uuidParam("sensorId", "ID sensor")],
        responses: { 200: success("Data terakhir"), 401: unauthorized(), 404: error("404 — Data/sensor tidak ditemukan") },
      },
    },
    "/api/sensor/data/input": {
      post: {
        tags: ["Sensor"],
        summary: "Input data pembacaan sensor",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateSensorDataRequest" } } },
        },
        responses: { 201: success("Data tersimpan"), 400: error("400 — Validasi gagal"), 401: unauthorized() },
      },
    },
    "/api/sensor/data/{sensorId}/history": {
      get: {
        tags: ["Sensor"],
        summary: "Histori data sensor (paginated + filter tanggal)",
        parameters: [
          uuidParam("sensorId", "ID sensor"),
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/Limit" },
          { name: "dari_tanggal", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "sampai_tanggal", in: "query", schema: { type: "string", format: "date-time" } },
        ],
        responses: { 200: paginated("Histori data"), 401: unauthorized() },
      },
    },
    "/api/sensor/data/{sensorId}/statistics": {
      get: {
        tags: ["Sensor"],
        summary: "Statistik data sensor (filter tanggal)",
        parameters: [
          uuidParam("sensorId", "ID sensor"),
          { name: "dari_tanggal", in: "query", schema: { type: "string", format: "date-time" } },
          { name: "sampai_tanggal", in: "query", schema: { type: "string", format: "date-time" } },
        ],
        responses: { 200: success("Statistik sensor"), 401: unauthorized() },
      },
    },
    "/api/sensor/nilai-normal/create": {
      post: {
        tags: ["Sensor"],
        summary: "Buat ambang nilai normal sensor",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateNilaiNormalRequest" } } },
        },
        responses: { 201: success("Nilai normal dibuat"), 400: error("400 — Validasi gagal"), 401: unauthorized() },
      },
    },
    "/api/sensor/nilai-normal/{sensorId}": {
      get: {
        tags: ["Sensor"],
        summary: "Ambil nilai normal per sensor",
        parameters: [uuidParam("sensorId", "ID sensor")],
        responses: { 200: success("Nilai normal"), 401: unauthorized(), 404: error("404 — Tidak ditemukan") },
      },
    },
    "/api/sensor/nilai-normal/{nilaiNormalId}": {
      put: {
        tags: ["Sensor"],
        summary: "Update nilai normal (tanpa validasi Joi)",
        parameters: [uuidParam("nilaiNormalId", "ID nilai normal")],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateNilaiNormalRequest" } } },
        },
        responses: { 200: success("Nilai normal diupdate"), 401: unauthorized(), 404: error("404 — Tidak ditemukan") },
      },
    },

    // ---------- NOTIFIKASI ----------
    "/api/notifikasi/statistics": {
      get: {
        tags: ["Notifikasi"],
        summary: "Statistik notifikasi",
        responses: { 200: success("Statistik notifikasi"), 401: unauthorized() },
      },
    },
    "/api/notifikasi/unread/count": {
      get: {
        tags: ["Notifikasi"],
        summary: "Jumlah notifikasi belum dibaca",
        responses: { 200: success("Unread count"), 401: unauthorized() },
      },
    },
    "/api/notifikasi/read-all": {
      put: {
        tags: ["Notifikasi"],
        summary: "Tandai semua notifikasi dibaca",
        responses: { 200: success("Semua ditandai dibaca"), 401: unauthorized() },
      },
    },
    "/api/notifikasi/": {
      get: {
        tags: ["Notifikasi"],
        summary: "Daftar notifikasi (paginated + filter)",
        parameters: [
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/Limit" },
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "tipe", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: paginated("Daftar notifikasi"), 401: unauthorized() },
      },
    },
    "/api/notifikasi/{notifikasiId}": {
      get: {
        tags: ["Notifikasi"],
        summary: "Detail notifikasi",
        parameters: [uuidParam("notifikasiId", "ID notifikasi")],
        responses: { 200: success("Detail notifikasi"), 401: unauthorized(), 404: error("404 — Notifikasi tidak ditemukan") },
      },
      delete: {
        tags: ["Notifikasi"],
        summary: "Hapus notifikasi",
        parameters: [uuidParam("notifikasiId", "ID notifikasi")],
        responses: { 200: success("Notifikasi dihapus"), 401: unauthorized(), 404: error("404 — Notifikasi tidak ditemukan") },
      },
    },
    "/api/notifikasi/{notifikasiId}/read": {
      put: {
        tags: ["Notifikasi"],
        summary: "Tandai satu notifikasi dibaca",
        parameters: [uuidParam("notifikasiId", "ID notifikasi")],
        responses: { 200: success("Ditandai dibaca"), 401: unauthorized(), 404: error("404 — Notifikasi tidak ditemukan") },
      },
    },

    // ---------- REKOMENDASI ----------
    "/api/rekomendasi/": {
      post: {
        tags: ["Rekomendasi"],
        summary: "Buat rekomendasi dari notifikasi",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateRekomendasiRequest" } } },
        },
        responses: { 201: success("Rekomendasi dibuat"), 400: error("400 — Validasi gagal"), 401: unauthorized() },
      },
      get: {
        tags: ["Rekomendasi"],
        summary: "Daftar rekomendasi (paginated + filter)",
        parameters: [
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/Limit" },
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "prioritas", in: "query", schema: { type: "string", enum: ["rendah", "sedang", "tinggi"] } },
          { name: "tipe_filter", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: paginated("Daftar rekomendasi"), 401: unauthorized() },
      },
    },
    "/api/rekomendasi/{rekomendasiId}": {
      get: {
        tags: ["Rekomendasi"],
        summary: "Detail rekomendasi",
        parameters: [uuidParam("rekomendasiId", "ID rekomendasi")],
        responses: { 200: success("Detail rekomendasi"), 401: unauthorized(), 404: error("404 — Rekomendasi tidak ditemukan") },
      },
      delete: {
        tags: ["Rekomendasi"],
        summary: "Hapus rekomendasi",
        parameters: [uuidParam("rekomendasiId", "ID rekomendasi")],
        responses: { 200: success("Rekomendasi dihapus"), 401: unauthorized(), 404: error("404 — Rekomendasi tidak ditemukan") },
      },
    },
    "/api/rekomendasi/{rekomendasiId}/status": {
      put: {
        tags: ["Rekomendasi"],
        summary: "Update status pengerjaan rekomendasi",
        parameters: [uuidParam("rekomendasiId", "ID rekomendasi")],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateRekomendasiStatusRequest" } } },
        },
        responses: { 200: success("Status diupdate"), 400: error("400 — Validasi gagal"), 401: unauthorized(), 404: error("404 — Rekomendasi tidak ditemukan") },
      },
    },
    "/api/rekomendasi/{rekomendasiId}/approve": {
      put: {
        tags: ["Rekomendasi"],
        summary: "Approval rekomendasi (disetujui/ditolak)",
        parameters: [uuidParam("rekomendasiId", "ID rekomendasi")],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ApproveRekomendasiRequest" } } },
        },
        responses: { 200: success("Approval tersimpan"), 400: error("400 — Validasi gagal"), 401: unauthorized(), 404: error("404 — Rekomendasi tidak ditemukan") },
      },
    },

    // ---------- LAPORAN ----------
    "/api/laporan/": {
      post: {
        tags: ["Laporan"],
        summary: "Buat laporan periode lahan",
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CreateLaporanRequest" } } },
        },
        responses: { 201: success("Laporan dibuat"), 400: error("400 — Validasi gagal"), 401: unauthorized() },
      },
    },
    "/api/laporan/{lahanId}": {
      get: {
        tags: ["Laporan"],
        summary: "Daftar laporan per lahan (paginated)",
        parameters: [
          uuidParam("lahanId", "ID lahan"),
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/Limit" },
        ],
        responses: { 200: paginated("Daftar laporan"), 401: unauthorized() },
      },
    },
    "/api/laporan/detail/{laporanId}": {
      get: {
        tags: ["Laporan"],
        summary: "Detail laporan",
        parameters: [uuidParam("laporanId", "ID laporan")],
        responses: { 200: success("Detail laporan"), 401: unauthorized(), 404: error("404 — Laporan tidak ditemukan") },
      },
    },
    "/api/laporan/pdf/{laporanId}": {
      get: {
        tags: ["Laporan"],
        summary: "Generate PDF laporan (binary)",
        parameters: [uuidParam("laporanId", "ID laporan")],
        responses: {
          200: {
            description: "File PDF",
            content: { "application/pdf": { schema: { type: "string", format: "binary" } } },
          },
          401: unauthorized(),
          404: error("404 — Laporan tidak ditemukan"),
        },
      },
    },

    // ---------- ADMIN (role admin) ----------
    "/api/admin/statistics": {
      get: {
        tags: ["Admin"],
        summary: "Statistik sistem (admin)",
        description: "Memerlukan role admin — 403 untuk non-admin.",
        responses: { 200: success("Statistik sistem"), 401: unauthorized(), 403: forbidden() },
      },
    },
    "/api/admin/activity": {
      get: {
        tags: ["Admin"],
        summary: "Aktivitas sistem (admin)",
        parameters: [{ name: "days", in: "query", schema: { type: "integer", default: 7 }, description: "Rentang hari (default 7)" }],
        responses: { 200: success("Aktivitas sistem"), 401: unauthorized(), 403: forbidden() },
      },
    },
    "/api/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "Daftar semua user (admin, paginated + filter)",
        parameters: [
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/Limit" },
          { name: "role", in: "query", schema: { type: "string" } },
          { name: "aktif", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: paginated("Daftar user"), 401: unauthorized(), 403: forbidden() },
      },
    },
    "/api/admin/users/{userId}": {
      get: {
        tags: ["Admin"],
        summary: "Detail user (admin)",
        parameters: [uuidParam("userId", "ID user")],
        responses: { 200: success("Detail user"), 401: unauthorized(), 403: forbidden(), 404: error("404 — User tidak ditemukan") },
      },
      delete: {
        tags: ["Admin"],
        summary: "Hapus user (admin)",
        parameters: [uuidParam("userId", "ID user")],
        responses: { 200: success("User dihapus"), 401: unauthorized(), 403: forbidden(), 404: error("404 — User tidak ditemukan") },
      },
    },
    "/api/admin/users/{userId}/deactivate": {
      put: {
        tags: ["Admin"],
        summary: "Nonaktifkan user (admin)",
        parameters: [uuidParam("userId", "ID user")],
        responses: { 200: success("User dinonaktifkan"), 401: unauthorized(), 403: forbidden(), 404: error("404 — User tidak ditemukan") },
      },
    },
    "/api/admin/users/{userId}/reactivate": {
      put: {
        tags: ["Admin"],
        summary: "Aktifkan kembali user (admin)",
        parameters: [uuidParam("userId", "ID user")],
        responses: { 200: success("User diaktifkan"), 401: unauthorized(), 403: forbidden(), 404: error("404 — User tidak ditemukan") },
      },
    },
    "/api/admin/lahans": {
      get: {
        tags: ["Admin"],
        summary: "Daftar semua lahan (admin, paginated)",
        parameters: [{ $ref: "#/components/parameters/Page" }, { $ref: "#/components/parameters/Limit" }],
        responses: { 200: paginated("Daftar lahan"), 401: unauthorized(), 403: forbidden() },
      },
    },
    "/api/admin/sensors": {
      get: {
        tags: ["Admin"],
        summary: "Daftar semua sensor (admin, paginated + filter)",
        parameters: [
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/Limit" },
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "tipe_sensor", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: paginated("Daftar sensor"), 401: unauthorized(), 403: forbidden() },
      },
    },

    // ---------- PLANT ANALYSIS ----------
    "/api/plant-analysis/": {
      post: {
        tags: ["Plant Analysis"],
        summary: "Upload gambar & analisis tanaman",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["image"],
                properties: {
                  image: {
                    type: "string",
                    format: "binary",
                    description: "jpg/jpeg/png/webp, max 5MB (field: image)",
                  },
                },
              },
            },
          },
        },
        responses: {
          201: success("Analisis dibuat"),
          400: error("400 — File invalid / multer menolak"),
          401: unauthorized(),
        },
      },
      get: {
        tags: ["Plant Analysis"],
        summary: "Daftar analisis (paginated + filter)",
        parameters: [
          { $ref: "#/components/parameters/Page" },
          { $ref: "#/components/parameters/Limit" },
          { name: "search", in: "query", schema: { type: "string" }, description: "Cari plant_name/disease_name (LIKE)" },
          { name: "disease", in: "query", schema: { type: "string" } },
          { name: "severity", in: "query", schema: { type: "string" } },
        ],
        responses: { 200: paginated("Daftar analisis"), 401: unauthorized() },
      },
    },
    "/api/plant-analysis/{id}": {
      get: {
        tags: ["Plant Analysis"],
        summary: "Detail analisis",
        parameters: [uuidParam("id", "ID analisis")],
        responses: { 200: success("Detail analisis"), 401: unauthorized(), 404: error("404 — Analisis tidak ditemukan") },
      },
      put: {
        tags: ["Plant Analysis"],
        summary: "Update analisis (tanpa validasi/upload)",
        parameters: [uuidParam("id", "ID analisis")],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateAnalysisRequest" } } },
        },
        responses: { 200: success("Analisis diupdate"), 401: unauthorized(), 404: error("404 — Analisis tidak ditemukan") },
      },
      delete: {
        tags: ["Plant Analysis"],
        summary: "Hapus analisis",
        parameters: [uuidParam("id", "ID analisis")],
        responses: { 200: success("Analisis dihapus"), 401: unauthorized(), 404: error("404 — Analisis tidak ditemukan") },
      },
    },
  },
  components: {
    securitySchemes: bearerAuth,
    schemas,
    parameters,
  },
};
