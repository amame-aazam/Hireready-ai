import { Request, Response, NextFunction } from 'express';
import { domainService } from './domain.service';

export class DomainController {
  async listDomains(_req: Request, res: Response, next: NextFunction) {
    try {
      const domains = await domainService.listActiveDomains();
      return res.status(200).json({
        success: true,
        data: { domains },
      });
    } catch (error) {
      next(error);
    }
  }

  async createDomain(req: Request, res: Response, next: NextFunction) {
    try {
      const domain = await domainService.createDomain(req.body);
      return res.status(201).json({
        success: true,
        data: { domain },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const domainController = new DomainController();
