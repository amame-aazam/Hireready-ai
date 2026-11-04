import { Request, Response, NextFunction } from 'express';
import { AdminService } from './admin.service';
import { ApplicationStatus } from '@prisma/client';

export class AdminController {
  public static async getPlatformStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getPlatformStats();
      return res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCandidates(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const search = req.query.search as string | undefined;
      const domain = req.query.domain as string | undefined;
      const status = req.query.status as ApplicationStatus | undefined;
      const sortBy = req.query.sortBy as 'createdAt' | 'compositeScore' | 'name' | undefined;
      const sortOrder = req.query.sortOrder as 'asc' | 'desc' | undefined;

      const candidates = await AdminService.getCandidates({
        page,
        limit,
        search,
        domain,
        status,
        sortBy,
        sortOrder,
      });

      return res.status(200).json({
        success: true,
        data: candidates,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCandidateReports(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationId } = req.params;
      const reports = await AdminService.getCandidateReports(applicationId);
      return res.status(200).json({
        success: true,
        data: reports,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async overrideCandidateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationId } = req.params;
      const { status, reason } = req.body;
      const adminId = req.user!.id;

      if (!status) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_STATUS', message: 'A new application status is required.' },
        });
      }

      if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: { code: 'AUDIT_REASON_REQUIRED', message: 'A justification/reason is required for status override.' },
        });
      }

      const result = await AdminService.overrideCandidateStatus(
        adminId,
        applicationId,
        status as ApplicationStatus,
        reason
      );

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getCandidateAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { applicationId } = req.params;
      const auditLogs = await AdminService.getCandidateAuditLogs(applicationId);
      return res.status(200).json({
        success: true,
        data: auditLogs,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getAssessments(req: Request, res: Response, next: NextFunction) {
    try {
      const assessments = await AdminService.getAssessments();
      return res.status(200).json({
        success: true,
        data: assessments,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async createAssessment(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, domainId, domainSlug, durationMinutes, passingScore, isActive, questions } =
        req.body;

      if (!title || !description) {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'Title and description are required for assessment template.' },
        });
      }

      const assessment = await AdminService.createAssessment({
        title,
        description,
        domainId,
        domainSlug,
        durationMinutes,
        passingScore,
        isActive,
        questions,
      });

      return res.status(201).json({
        success: true,
        data: assessment,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async toggleAssessmentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { assessmentId } = req.params;
      const { isActive } = req.body;

      if (typeof isActive !== 'boolean') {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_INPUT', message: 'isActive boolean is required.' },
        });
      }

      const updated = await AdminService.toggleAssessmentStatus(assessmentId, isActive);
      return res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getUnmaskedLeaderboard(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const domain = req.query.domain as string | undefined;

      const leaderboard = await AdminService.getUnmaskedLeaderboard(domain, page, limit);
      return res.status(200).json({
        success: true,
        data: leaderboard,
      });
    } catch (error) {
      next(error);
    }
  }
}
