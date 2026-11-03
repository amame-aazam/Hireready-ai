import { Router } from 'express';
import { DashboardController } from './dashboard.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Authenticated Student Dashboard Endpoint
router.get('/me', authenticate, DashboardController.getStudentDashboard);
router.get('/', authenticate, DashboardController.getStudentDashboard);

export default router;
