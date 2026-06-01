import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createLahanSchema, updateLahanSchema } from '../validation/schemas.js';
import * as lahanController from '../controllers/lahanController.js';

const router = express.Router();

// All lahan routes require authentication
router.use(authenticate);

router.post('/', validate(createLahanSchema), lahanController.createLahan);
router.get('/', lahanController.getLahans);
router.get('/:lahanId', lahanController.getLahanById);
router.put('/:lahanId', validate(updateLahanSchema), lahanController.updateLahan);
router.delete('/:lahanId', lahanController.deleteLahan);
router.get('/:lahanId/statistics', lahanController.getLahanStatistics);

export default router;
