import { Request, Response, NextFunction } from 'express';
import { resumeService } from './resume.service';

export class ResumeController {
  async analyzeResume(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_FILE',
            message: 'Please attach a resume file in PDF (.pdf) or Word (.docx) format.',
          },
        });
      }

      const userId = req.user!.id;
      const { domainId, applicationId } = req.body;

      const analysis = await resumeService.processResume({
        userId,
        fileBuffer: req.file.buffer,
        mimetype: req.file.mimetype,
        originalname: req.file.originalname,
        domainId,
        applicationId,
      });

      return res.status(200).json({
        success: true,
        data: {
          analysis: {
            id: analysis.id,
            targetDomain: analysis.targetDomain,
            score: analysis.score,
            scoreBreakdown: analysis.scoreBreakdown,
            atsStrengths: analysis.atsStrengths,
            atsWeaknesses: analysis.atsWeaknesses,
            missingKeywords: analysis.missingKeywords,
            suggestedImprovements: analysis.suggestedImprovements,
            extractedSkills: analysis.extractedSkills,
            createdAt: analysis.createdAt,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getLatest(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const analysis = await resumeService.getLatestAnalysis(userId);

      if (!analysis) {
        return res.status(200).json({
          success: true,
          data: { analysis: null },
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          analysis: {
            id: analysis.id,
            targetDomain: analysis.targetDomain,
            score: analysis.score,
            scoreBreakdown: analysis.scoreBreakdown,
            atsStrengths: analysis.atsStrengths,
            atsWeaknesses: analysis.atsWeaknesses,
            missingKeywords: analysis.missingKeywords,
            suggestedImprovements: analysis.suggestedImprovements,
            extractedSkills: analysis.extractedSkills,
            createdAt: analysis.createdAt,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const analysis = await resumeService.getAnalysisById(userId, id);

      return res.status(200).json({
        success: true,
        data: { analysis },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const resumeController = new ResumeController();
