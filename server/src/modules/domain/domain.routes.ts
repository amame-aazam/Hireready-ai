import { Router } from 'express';
import { Role } from '@prisma/client';
import { domainController } from './domain.controller';
import { authenticate, requireRole } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate';
import { createDomainSchema } from './domain.schemas';

const router = Router();

// Public: Browse active domains
router.get('/', domainController.listDomains);

// Protected: Admin-only domain creation
router.post(
  '/',
  authenticate,
  requireRole(Role.ADMIN),
  validateRequest({ body: createDomainSchema }),
  domainController.createDomain
);

export default router;
