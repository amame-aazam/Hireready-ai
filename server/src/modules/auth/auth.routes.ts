import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth';
import { registerSchema, loginSchema, updateProfileSchema } from './auth.schemas';

const router = Router();

// Public auth endpoints
router.post(
  '/register',
  validateRequest({ body: registerSchema }),
  authController.register
);

router.post(
  '/login',
  validateRequest({ body: loginSchema }),
  authController.login
);

router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Protected session endpoints
router.get('/me', authenticate, authController.getMe);
router.patch(
  '/profile',
  authenticate,
  validateRequest({ body: updateProfileSchema }),
  authController.updateProfile
);

export default router;
