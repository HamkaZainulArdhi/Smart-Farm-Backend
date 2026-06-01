import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createLaporanSchema } from '../validation/schemas.js';
import * as laporanController from '../controllers/laporanController.js';

const router = express.Router();

// All laporan routes require authentication
router.use(authenticate);

router.post('/', validate(createLaporanSchema), laporanController.createLaporan);
router.get('/:lahanId', laporanController.getLaporans);
router.get('/detail/:laporanId', laporanController.getLaporanById);
router.get('/pdf/:laporanId', laporanController.generatePDF);

export default router;
