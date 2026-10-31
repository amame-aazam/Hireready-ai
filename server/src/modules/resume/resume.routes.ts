import { Router } from 'express';
import { resumeController } from './resume.controller';
import { authenticate } from '../../middleware/auth';
import { resumeUpload } from '../../middleware/upload';

const router = Router();

// Protected resume upload & ATS analysis endpoint
router.post(
  '/analyze',
  authenticate,
  resumeUpload.single('resume'),
  resumeController.analyzeResume
);

// Protected retrieval of user's latest analysis
router.get('/latest', authenticate, resumeController.getLatest);

// Protected retrieval of a specific report by UUID
router.get('/:id', authenticate, resumeController.getById);

export default router;
