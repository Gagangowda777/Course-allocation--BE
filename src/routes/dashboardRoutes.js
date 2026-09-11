import express from 'express';
import { getAdminDashboard, getFacultyDashboard, getStudentDashboard } from '../controllers/dashboardController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/admin', protect, authorize('admin'), getAdminDashboard);
router.get('/student', protect, authorize('student'), getStudentDashboard);
router.get('/faculty', protect, authorize('faculty'), getFacultyDashboard);

export default router;
