import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createTanamanSchema } from '../validation/schemas.js';
import * as tanamanController from '../controllers/tanamanController.js';

const router = express.Router();

// All tanaman routes require authentication
router.use(authenticate);

router.post('/:lahanId/tamans', validate(createTanamanSchema), tanamanController.createTanaman);
router.get('/:lahanId/tamans', tanamanController.getTamans);
router.get('/tanaman/:tanamanId', tanamanController.getTanamanById);
router.put('/tanaman/:tanamanId', tanamanController.updateTanaman);
router.delete('/tanaman/:tanamanId', tanamanController.deleteTanaman);

export default router;
