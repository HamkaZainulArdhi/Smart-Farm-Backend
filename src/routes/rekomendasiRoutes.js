import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createRekomendasiSchema, updateRekomendasiStatusSchema, approveRekomendasiSchema } from '../validation/schemas.js';
import * as rekomendasiController from '../controllers/rekomendasiController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

router.post('/', validate(createRekomendasiSchema), rekomendasiController.createRekomendasi);
router.get('/', rekomendasiController.getRekomendasis);
router.get('/:rekomendasiId', rekomendasiController.getRekomendasiById);
router.put('/:rekomendasiId/status', validate(updateRekomendasiStatusSchema), rekomendasiController.updateRekomendasiStatus);
router.put('/:rekomendasiId/approve', validate(approveRekomendasiSchema), rekomendasiController.approveRekomendasi);
router.delete('/:rekomendasiId', rekomendasiController.deleteRekomendasi);

export default router;
