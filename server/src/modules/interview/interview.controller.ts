import { Request, Response, NextFunction } from 'express';
import { InterviewService } from './interview.service';
import {
  startInterviewSchema,
  sessionParamSchema,
  interviewTurnSchema,
  runInterviewCodeSchema,
  finishInterviewSchema,
  advanceQuestionSchema,
} from './interview.schemas';

export class InterviewController {
  public static async start(req: Request, res: Response, next: NextFunction) {
    try {
      const { interviewType, domainSlug, applicationId } = startInterviewSchema.parse(req.body);
      const userId = (req as any).user.id;
      const result = await InterviewService.startOrResumeSession(userId, interviewType, domainSlug, applicationId);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  }

  public static async turn(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = sessionParamSchema.parse(req.params);
      const { utterance, codeSnippet } = interviewTurnSchema.parse(req.body);
      const userId = (req as any).user.id;
      const result = await InterviewService.processTurn(userId, sessionId, utterance, codeSnippet);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  }

  public static async runCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = sessionParamSchema.parse(req.params);
      const { sourceCode, language } = runInterviewCodeSchema.parse(req.body);
      const userId = (req as any).user.id;
      const result = await InterviewService.runCode(userId, sessionId, sourceCode, language);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  }

  public static async finish(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = sessionParamSchema.parse(req.params);
      const { finalCode } = finishInterviewSchema.parse(req.body);
      const userId = (req as any).user.id;
      const result = await InterviewService.finishInterview(userId, sessionId, finalCode);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  }

  public static async advanceQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = sessionParamSchema.parse(req.params);
      const { code, language } = advanceQuestionSchema.parse(req.body);
      const userId = (req as any).user.id;
      const result = await InterviewService.advanceQuestion(userId, sessionId, code, language);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  }

  public static async getSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionId } = sessionParamSchema.parse(req.params);
      const userId = (req as any).user.id;
      const result = await InterviewService.getSessionDetails(userId, sessionId);
      return res.status(200).json({ success: true, data: result });
    } catch (error) {
      return next(error);
    }
  }
}
