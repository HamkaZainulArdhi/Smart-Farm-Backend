import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate, authorize(['admin']));

// System Statistics
router.get('/statistics', adminController.getSystemStatistics);
router.get('/activity', adminController.getSystemActivity);

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserById);
router.put('/users/:userId/deactivate', adminController.deactivateUser);
router.put('/users/:userId/reactivate', adminController.reactivateUser);
router.delete('/users/:userId', adminController.deleteUser);

// Lahan & Sensor Management
router.get('/lahans', adminController.getAllLahans);
router.get('/sensors', adminController.getAllSensors);

export default router;
