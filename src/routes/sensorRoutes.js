import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createSensorSchema, createSensorDataSchema, createNilaiNormalSchema } from '../validation/schemas.js';
import * as sensorController from '../controllers/sensorController.js';
import * as sensorDataController from '../controllers/sensorDataController.js';
import * as nilaiNormalController from '../controllers/nilaiNormalController.js';

const router = express.Router();

// All sensor routes require authentication
router.use(authenticate);

// Sensor endpoints
router.post('/:lahanId/sensors', validate(createSensorSchema), sensorController.createSensor);
router.get('/:lahanId/sensors', sensorController.getSensors);
router.get('/sensor/:sensorId', sensorController.getSensorById);
router.put('/sensor/:sensorId', sensorController.updateSensor);
router.delete('/sensor/:sensorId', sensorController.deleteSensor);
router.get('/sensor/:sensorId/last-data', sensorController.getLastSensorData);

// Sensor Data endpoints (monitoring/histori)
router.post('/data/input', validate(createSensorDataSchema), sensorDataController.inputSensorData);
router.get('/data/:sensorId/history', sensorDataController.getSensorDataHistory);
router.get('/data/:sensorId/statistics', sensorDataController.getSensorStatistics);

// Nilai Normal endpoints
router.post('/nilai-normal/create', validate(createNilaiNormalSchema), nilaiNormalController.createNilaiNormal);
router.get('/nilai-normal/:sensorId', nilaiNormalController.getNilaiNormal);
router.put('/nilai-normal/:nilaiNormalId', nilaiNormalController.updateNilaiNormal);

export default router;
