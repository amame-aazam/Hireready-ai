import { Router } from 'express';
import { AssessmentController } from './assessment.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Assessment overview for a domain (authenticated)
router.get('/overview/:domainId', authenticate, AssessmentController.getOverview);

// Start or resume an active attempt
router.post('/:id/start', authenticate, AssessmentController.startOrResume);

// Periodic debounced autosave of draft answers (MCQ + Code)
router.patch('/attempt/:attemptId/autosave', authenticate, AssessmentController.autosave);

// Run code against visible test cases (zero eval)
router.post('/attempt/:attemptId/run-code', authenticate, AssessmentController.runCode);

// Final idempotent attempt submission & scoring
router.post('/attempt/:attemptId/submit', authenticate, AssessmentController.submit);

export default router;
