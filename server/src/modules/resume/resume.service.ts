import crypto from 'crypto';
import { prisma } from '../../config/postgres';
import { ResumeAnalysisModel, IResumeAnalysis } from '../../models/resumeAnalysis.model';
import { resumeParser } from './resume.parser';
import { sanitizeResumeText } from '../../utils/sanitizer';
import { getAIProvider } from '../../providers/ai';
import { atsEvaluationSchema } from './resume.schemas';

export interface ProcessResumeOptions {
  userId: string;
  fileBuffer: Buffer;
  mimetype: string;
  originalname: string;
  domainId?: string;
  applicationId?: string;
}

export class ResumeService {
  /**
   * Generates a deterministic SHA-256 hash for deduplication/idempotency.
   */
  private generateContentHash(userId: string, targetDomain: string, sanitizedText: string): string {
    return crypto
      .createHash('sha256')
      .update(`${userId}:${targetDomain}:${sanitizedText}`)
      .digest('hex');
  }

  /**
   * Complete pipeline: In-memory extraction -> Sanitization -> AI Evaluation -> Dual-DB persistence.
   */
  async processResume(options: ProcessResumeOptions): Promise<IResumeAnalysis> {
    const { userId, fileBuffer, mimetype, originalname, domainId, applicationId } = options;

    // 1. Resolve Target Domain
    let targetDomainTitle = 'Full Stack Web Development';
    if (domainId) {
      const domain = await prisma.domain.findUnique({ where: { id: domainId } });
      if (domain) {
        targetDomainTitle = domain.title;
      }
    } else {
      // Check user profile default domain
      const profile = await prisma.studentProfile.findUnique({
        where: { userId },
        include: { domain: true },
      });
      if (profile?.domain) {
        targetDomainTitle = profile.domain.title;
      }
    }

    // 2. Extract Text from Memory Buffer (PDF or DOCX)
    const { rawText } = await resumeParser.extractText(fileBuffer, mimetype, originalname);

    // 3. Defense-in-depth sanitization of untrusted input
    const { sanitized } = sanitizeResumeText(rawText, { maxLength: 12000 });

    // 4. Idempotency Check: Verify if identical resume was already analyzed for this user
    const contentHash = this.generateContentHash(userId, targetDomainTitle, sanitized);
    const cachedAnalysis = await ResumeAnalysisModel.findOne({ contentHash });

    if (cachedAnalysis) {
      console.log(`⚡ Idempotency cache hit: Returning existing ATS analysis [${cachedAnalysis.id}]`);

      // Link to application if needed
      if (applicationId) {
        await prisma.application.updateMany({
          where: { id: applicationId, userId },
          data: { resumeAnalysisId: cachedAnalysis.id },
        });
      }

      return cachedAnalysis;
    }

    // 5. Invoke AI Provider
    const aiProvider = getAIProvider();
    const rawAiOutput = await aiProvider.analyzeResume({
      resumeText: sanitized,
      targetDomain: targetDomainTitle,
    });

    // 6. Validate AI output with Zod
    const validatedAnalysis = atsEvaluationSchema.parse(rawAiOutput);

    // 7. Persist to MongoDB Atlas (Single source of truth for unstructured reports)
    const analysisId = crypto.randomUUID();
    const analysisRecord = await ResumeAnalysisModel.create({
      id: analysisId,
      userId,
      applicationId: applicationId || undefined,
      domainId: domainId || undefined,
      targetDomain: targetDomainTitle,
      contentHash,
      score: validatedAnalysis.score,
      scoreBreakdown: validatedAnalysis.scoreBreakdown,
      atsStrengths: validatedAnalysis.atsStrengths,
      atsWeaknesses: validatedAnalysis.atsWeaknesses,
      missingKeywords: validatedAnalysis.missingKeywords,
      suggestedImprovements: validatedAnalysis.suggestedImprovements,
      extractedSkills: validatedAnalysis.extractedSkills,
      rawTextSnapshot: sanitized,
    });

    // 8. Cross-DB Relational Linkage (PostgreSQL)
    if (applicationId) {
      await prisma.application.updateMany({
        where: { id: applicationId, userId },
        data: { resumeAnalysisId: analysisId },
      });
    }

    // Also update student profile preferredTech if currently empty
    const currentProfile = await prisma.studentProfile.findUnique({ where: { userId } });
    if (currentProfile && currentProfile.preferredTech.length === 0 && validatedAnalysis.extractedSkills.length > 0) {
      await prisma.studentProfile.update({
        where: { userId },
        data: { preferredTech: validatedAnalysis.extractedSkills.slice(0, 10) },
      });
    }

    return analysisRecord;
  }

  /**
   * Retrieves the latest resume analysis for a user.
   */
  async getLatestAnalysis(userId: string): Promise<IResumeAnalysis | null> {
    return ResumeAnalysisModel.findOne({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Retrieves a specific resume analysis by UUID.
   */
  async getAnalysisById(userId: string, analysisId: string): Promise<IResumeAnalysis | null> {
    const analysis = await ResumeAnalysisModel.findOne({ id: analysisId });
    if (!analysis) {
      const err: any = new Error('Resume analysis report not found');
      err.statusCode = 404;
      err.code = 'ANALYSIS_NOT_FOUND';
      throw err;
    }

    // Enforce ownership
    if (analysis.userId !== userId) {
      const err: any = new Error('Access denied to this resume report');
      err.statusCode = 403;
      err.code = 'FORBIDDEN_REPORT_ACCESS';
      throw err;
    }

    return analysis;
  }
}

export const resumeService = new ResumeService();
