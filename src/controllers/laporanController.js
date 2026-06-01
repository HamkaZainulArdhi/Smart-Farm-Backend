import { LaporanLahan, Lahan, SensorData, Sensor } from "../models/index.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/response.js";
import { Op } from "sequelize";
import PDFDocument from "pdfkit";
import { createWriteStream } from "fs";
import { mkdirSync } from "fs";
import path from "path";

export const createLaporan = async (req, res) => {
  try {
    const { lahanId, periode_awal, periode_akhir } = req.validatedData;

    // Verify lahan exists
    const lahan = await Lahan.findByPk(lahanId);
    if (!lahan) {
      return errorResponse(res, 404, "Lahan tidak ditemukan");
    }

    // Check authorization
    if (req.user.role === "petani" && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, "Anda tidak memiliki akses ke lahan ini");
    }

    const periodeAwal = new Date(periode_awal);
    const periodeAkhir = new Date(periode_akhir);
    periodeAkhir.setHours(23, 59, 59, 999);

    // Get sensor data for the period
    const sensorDatas = await SensorData.findAll({
      where: {
        tanggal_pencatatan: {
          [Op.gte]: periodeAwal,
          [Op.lte]: periodeAkhir,
        },
      },
      include: [
        {
          association: "sensor",
          where: { lahanId },
          attributes: ["id", "tipe_sensor"],
        },
      ],
    });

    if (sensorDatas.length === 0) {
      return errorResponse(res, 404, "Tidak ada data sensor untuk periode ini");
    }

    // Calculate statistics by sensor type
    const stats = {};
    const tipeList = ["suhu", "kelembapan", "ph", "intensitas_cahaya"];

    for (const tipe of tipeList) {
      const data = sensorDatas
        .filter((sd) => sd.sensor.tipe_sensor === tipe)
        .map((sd) => parseFloat(sd.nilai));
      if (data.length > 0) {
        stats[`rata_rata_${tipe}`] = (
          data.reduce((a, b) => a + b, 0) / data.length
        ).toFixed(2);
      }
    }

    // Get anomali (data dengan status kritis atau peringatan)
    const anomali = sensorDatas.filter((sd) => sd.status_kondisi !== "normal");

    // Create laporan
    const laporan = await LaporanLahan.create({
      lahanId,
      tanggal_laporan: new Date(),
      kondisi_umum: `Laporan monitoring lahan ${lahan.nama_lahan} dari ${periode_awal} hingga ${periode_akhir}`,
      rata_rata_suhu: stats.rata_rata_suhu || null,
      rata_rata_kelembapan: stats.rata_rata_kelembapan || null,
      rata_rata_ph: stats.rata_rata_ph || null,
      rata_rata_intensitas_cahaya: stats.rata_rata_intensitas_cahaya || null,
      anomali_terdeteksi:
        anomali.length > 0
          ? `Terdeteksi ${anomali.length} anomali`
          : "Tidak ada anomali",
      saran_perbaikan: generateRecommendations(stats, anomali),
      periode_awal: new Date(periode_awal),
      periode_akhir: new Date(periode_akhir),
    });

    successResponse(res, 201, "Laporan berhasil dibuat", laporan);
  } catch (error) {
    errorResponse(res, 500, "Error membuat laporan", error.message);
  }
};

export const getLaporans = async (req, res) => {
  try {
    const { lahanId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Verify lahan exists
    const lahan = await Lahan.findByPk(lahanId);
    if (!lahan) {
      return errorResponse(res, 404, "Lahan tidak ditemukan");
    }

    // Check authorization
    if (req.user.role === "petani" && lahan.userId !== req.user.userId) {
      return errorResponse(res, 403, "Anda tidak memiliki akses ke lahan ini");
    }

    const { count, rows } = await LaporanLahan.findAndCountAll({
      where: { lahanId },
      limit,
      offset,
      order: [["tanggal_laporan", "DESC"]],
    });

    paginatedResponse(res, 200, "Daftar laporan berhasil diambil", rows, {
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit),
    });
  } catch (error) {
    errorResponse(res, 500, "Error mengambil daftar laporan", error.message);
  }
};

export const getLaporanById = async (req, res) => {
  try {
    const { laporanId } = req.params;

    const laporan = await LaporanLahan.findByPk(laporanId, {
      include: [{ association: "lahan" }],
    });

    if (!laporan) {
      return errorResponse(res, 404, "Laporan tidak ditemukan");
    }

    // Check authorization
    if (
      req.user.role === "petani" &&
      laporan.lahan.userId !== req.user.userId
    ) {
      return errorResponse(res, 403, "Anda tidak memiliki akses");
    }

    successResponse(res, 200, "Detail laporan berhasil diambil", laporan);
  } catch (error) {
    errorResponse(res, 500, "Error mengambil detail laporan", error.message);
  }
};

export const generatePDF = async (req, res) => {
  try {
    const { laporanId } = req.params;

    const laporan = await LaporanLahan.findByPk(laporanId, {
      include: [{ association: "lahan" }],
    });

    if (!laporan) {
      return errorResponse(res, 404, "Laporan tidak ditemukan");
    }

    // Check authorization
    if (
      req.user.role === "petani" &&
      laporan.lahan.userId !== req.user.userId
    ) {
      return errorResponse(res, 403, "Anda tidak memiliki akses");
    }

    // Create PDF
    const doc = new PDFDocument();
    const fileName = `laporan_${laporan.id}.pdf`;
    const filePath = path.join("public", "laporan", fileName);

    mkdirSync(path.dirname(filePath), { recursive: true });

    const stream = createWriteStream(filePath);
    doc.pipe(stream);

    // Title
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("LAPORAN MONITORING LAHAN PERTANIAN", { align: "center" });
    doc.moveDown();

    // Info Lahan
    doc.fontSize(12).font("Helvetica");
    doc.text(`Nama Lahan: ${laporan.lahan.nama_lahan}`);
    doc.text(`Lokasi: ${laporan.lahan.lokasi}`);
    doc.text(`Luas: ${laporan.lahan.luas_lahan} m²`);
    doc.moveDown();

    // Periode
    doc.fontSize(11).font("Helvetica-Bold").text("Periode Laporan:");
    doc
      .font("Helvetica")
      .text(
        `${new Date(laporan.periode_awal).toLocaleDateString("id-ID")} - ${new Date(laporan.periode_akhir).toLocaleDateString("id-ID")}`,
      );
    doc.moveDown();

    // Kondisi Umum
    doc.fontSize(11).font("Helvetica-Bold").text("Kondisi Umum:");
    doc.font("Helvetica").text(laporan.kondisi_umum, { width: 500 });
    doc.moveDown();

    // Statistik
    doc.fontSize(11).font("Helvetica-Bold").text("Statistik Sensor:");
    doc.font("Helvetica");
    if (laporan.rata_rata_suhu)
      doc.text(`Rata-rata Suhu: ${laporan.rata_rata_suhu}°C`);
    if (laporan.rata_rata_kelembapan)
      doc.text(`Rata-rata Kelembapan: ${laporan.rata_rata_kelembapan}%`);
    if (laporan.rata_rata_ph) doc.text(`Rata-rata pH: ${laporan.rata_rata_ph}`);
    if (laporan.rata_rata_intensitas_cahaya)
      doc.text(
        `Rata-rata Intensitas Cahaya: ${laporan.rata_rata_intensitas_cahaya} Lux`,
      );
    doc.moveDown();

    // Anomali
    doc.fontSize(11).font("Helvetica-Bold").text("Anomali Terdeteksi:");
    doc.font("Helvetica").text(laporan.anomali_terdeteksi);
    doc.moveDown();

    // Saran
    doc.fontSize(11).font("Helvetica-Bold").text("Saran Perbaikan:");
    doc.font("Helvetica").text(laporan.saran_perbaikan, { width: 500 });

    doc.end();

    stream.on("finish", () => {
      res.download(filePath, fileName);
    });
  } catch (error) {
    errorResponse(res, 500, "Error generate PDF", error.message);
  }
};

function generateRecommendations(stats, anomali) {
  const recommendations = [];

  if (stats.rata_rata_suhu && parseFloat(stats.rata_rata_suhu) > 35) {
    recommendations.push(
      "- Suhu terlalu tinggi, pertimbangkan penyiraman lebih sering atau peneduhan",
    );
  }
  if (
    stats.rata_rata_kelembapan &&
    parseFloat(stats.rata_rata_kelembapan) < 40
  ) {
    recommendations.push(
      "- Kelembapan rendah, tingkatkan frekuensi penyiraman",
    );
  }
  if (
    stats.rata_rata_ph &&
    (parseFloat(stats.rata_rata_ph) < 6 || parseFloat(stats.rata_rata_ph) > 8)
  ) {
    recommendations.push(
      "- pH tanah tidak optimal, pertimbangkan amendment tanah",
    );
  }
  if (anomali.length > 0) {
    recommendations.push(
      `- Terdapat ${anomali.length} anomali yang perlu ditindaklanjuti`,
    );
  }
  if (recommendations.length === 0) {
    recommendations.push(
      "- Kondisi lahan dalam keadaan optimal, lanjutkan monitoring rutin",
    );
  }

  return recommendations.join("\n");
}
