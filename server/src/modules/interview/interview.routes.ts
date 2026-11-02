import { Router } from 'express';
import { InterviewController } from './interview.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

// Start or resume an active interview session
router.post('/session/start', authenticate, InterviewController.start);

// Send candidate voice/text utterance & receive AI response
router.post('/session/:sessionId/turn', authenticate, InterviewController.turn);

// Run candidate code against test cases in the sandbox
router.post('/session/:sessionId/run-code', authenticate, InterviewController.runCode);

// Finalize interview, generate AI evaluation report (idempotent)
router.post('/session/:sessionId/finish', authenticate, InterviewController.finish);

// Get current session details, transcript, and report
router.get('/session/:sessionId', authenticate, InterviewController.getSession);

export default router;
