import { Request, Response, NextFunction } from 'express';
import { AssessmentService } from './assessment.service';
import {
  autosaveAssessmentSchema,
  runCodeSchema,
  assessmentDomainParamSchema,
  startAssessmentParamSchema,
  attemptParamSchema,
} from './assessment.schemas';

export class AssessmentController {
  public static async getOverview(req: Request, res: Response, Next: NextFunction) {
    try {
      const { domainId } = assessmentDomainParamSchema.parse(req.params);
      const overview = await AssessmentService.getAssessmentOverview(domainId);
      return res.status(200).json({ success: true, data: overview });
    } catch (error) {
      return Next(error);
    }
  }

  public static async startOrResume(req: Request, res: Response, Next: NextFunction) {
    try {
      const { id } = startAssessmentParamSchema.parse(req.params);
      const userId = (req as any).user.id;
      const result = await AssessmentService.startOrResumeAttempt(userId, id);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return Next(error);
    }
  }

  public static async autosave(req: Request, res: Response, Next: NextFunction) {
    try {
      const { attemptId } = attemptParamSchema.parse(req.params);
      const { answers } = autosaveAssessmentSchema.parse(req.body);
      const userId = (req as any).user.id;
      const result = await AssessmentService.autosaveAttempt(userId, attemptId, answers as any);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return Next(error);
    }
  }

  public static async runCode(req: Request, res: Response, Next: NextFunction) {
    try {
      const { attemptId } = attemptParamSchema.parse(req.params);
      const { questionId, sourceCode, language } = runCodeSchema.parse(req.body);
      const userId = (req as any).user.id;
      const result = await AssessmentService.runCode(userId, attemptId, questionId, sourceCode, language);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return Next(error);
    }
  }

  public static async submit(req: Request, res: Response, Next: NextFunction) {
    try {
      const { attemptId } = attemptParamSchema.parse(req.params);
      const userId = (req as any).user.id;
      const result = await AssessmentService.submitAttempt(userId, attemptId);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return Next(error);
    }
  }
}
