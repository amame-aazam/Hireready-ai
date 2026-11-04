import { Router } from 'express';
import { Role } from '@prisma/client';
import { authenticate, requireRole } from '../../middleware/auth';
import { AdminController } from './admin.controller';

const router = Router();

// Strictly enforce Admin RBAC on all admin routes
router.use(authenticate, requireRole(Role.ADMIN));

// Platform statistics overview
router.get('/stats', AdminController.getPlatformStats);

// Candidate management & search
router.get('/candidates', AdminController.getCandidates);

// Candidate multi-round dual-DB reports
router.get('/candidates/:applicationId/reports', AdminController.getCandidateReports);

// Candidate status override & audit logging
router.post('/candidates/:applicationId/override-status', AdminController.overrideCandidateStatus);
router.get('/candidates/:applicationId/audit-logs', AdminController.getCandidateAuditLogs);

// Assessment templates
router.get('/assessments', AdminController.getAssessments);
router.post('/assessments', AdminController.createAssessment);
router.patch('/assessments/:assessmentId/status', AdminController.toggleAssessmentStatus);

// Full unmasked cohort leaderboard
router.get('/leaderboard', AdminController.getUnmaskedLeaderboard);

export const adminRoutes = router;
