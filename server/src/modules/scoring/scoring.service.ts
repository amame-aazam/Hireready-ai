import mongoose from 'mongoose';
import { ApplicationStatus, SessionStatus, AssessmentState } from '@prisma/client';
import { prisma } from '../../config/postgres';
import { ResumeAnalysisModel } from '../../models/resumeAnalysis.model';

export interface ScoreRecalculationResult {
  applicationId: string;
  isComplete: boolean;
  status: ApplicationStatus;
  resumeScore: number | null;
  oaScore: number | null;
  dsaScore: number | null;
  hrScore: number | null;
  compositeScore: number | null;
  cutoffsPassed: boolean;
  finalOutcomeAt: Date | null;
}

export class ScoringService {
  public static readonly WEIGHTS = {
    RESUME: 0.15,
    OA: 0.25,
    DSA: 0.40,
    HR: 0.20,
  };

  public static readonly CUTOFFS = {
    RESUME: 60.0,
    OA: 70.0,
    DSA: 70.0,
    HR: 70.0,
  };

  public static readonly THRESHOLDS = {
    SELECTED_MIN: 82.0,
    WAITLISTED_MIN: 70.0,
  };

  /**
   * Recalculates candidate's authoritative scores across all 4 assessments:
   * Resume (15%), OA (25%), DSA (40%), HR (20%)
   *
   * If any round is incomplete, compositeScore remains null and application is NOT scored as 0.
   */
  public static async recalculateApplicationScore(
    applicationId: string
  ): Promise<ScoreRecalculationResult> {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        assessmentAttempts: {
          where: {
            status: { in: [AssessmentState.SUBMITTED, AssessmentState.EXPIRED] },
          },
          orderBy: { totalScore: 'desc' },
        },
        interviewSessions: {
          where: {
            status: SessionStatus.COMPLETED,
          },
        },
      },
    });

    if (!application) {
      throw { status: 404, message: 'Application not found' };
    }

    // 1. Fetch Resume Score from MongoDB
    let resumeScore: number | null = null;
    if (application.resumeAnalysisId) {
      if (mongoose.connection.readyState === 1) {
        try {
          const doc = await ResumeAnalysisModel.findOne({ id: application.resumeAnalysisId });
          if (doc && typeof doc.score === 'number') {
            resumeScore = doc.score;
          }
        } catch {
          // Fallback or leave null
        }
      }
    }

    // If resumeAnalysisId wasn't linked or doc wasn't found by ID, search by userId
    if (resumeScore === null && mongoose.connection.readyState === 1) {
      try {
        const latestDoc = await ResumeAnalysisModel.findOne({ userId: application.userId }).sort({
          createdAt: -1,
        });
        if (latestDoc && typeof latestDoc.score === 'number') {
          resumeScore = latestDoc.score;
        }
      } catch {
        // Fallback or leave null
      }
    }

    // Fallback to existing application.resumeScore in PostgreSQL if present
    if (resumeScore === null && application.resumeScore !== null) {
      resumeScore = application.resumeScore;
    }

    // 2. Fetch Online Assessment Score from PostgreSQL (best submitted attempt)
    let oaScore: number | null = null;
    if (application.assessmentAttempts && application.assessmentAttempts.length > 0) {
      const bestAttempt = application.assessmentAttempts[0];
      if (bestAttempt.totalScore !== null && bestAttempt.totalScore !== undefined) {
        oaScore = bestAttempt.totalScore;
      }
    } else {
      // Check if user has an attempt linked to userId
      const userAttempt = await prisma.assessmentAttempt.findFirst({
        where: {
          userId: application.userId,
          status: { in: [AssessmentState.SUBMITTED, AssessmentState.EXPIRED] },
        },
        orderBy: { totalScore: 'desc' },
      });
      if (userAttempt && userAttempt.totalScore !== null && userAttempt.totalScore !== undefined) {
        oaScore = userAttempt.totalScore;
      }
    }

    // 3. Fetch AI DSA Technical Score from PostgreSQL
    let dsaScore: number | null = null;
    const dsaSession = application.interviewSessions.find((s) => s.type === 'DSA' && s.overallScore !== null);
    if (dsaSession && dsaSession.overallScore !== null) {
      dsaScore = dsaSession.overallScore;
    } else {
      const userDsa = await prisma.interviewSession.findFirst({
        where: {
          userId: application.userId,
          type: 'DSA',
          status: SessionStatus.COMPLETED,
          overallScore: { not: null },
        },
        orderBy: { overallScore: 'desc' },
      });
      if (userDsa && userDsa.overallScore !== null) {
        dsaScore = userDsa.overallScore;
      }
    }

    // 4. Fetch AI HR Behavioral Score from PostgreSQL
    let hrScore: number | null = null;
    const hrSession = application.interviewSessions.find((s) => s.type === 'HR' && s.overallScore !== null);
    if (hrSession && hrSession.overallScore !== null) {
      hrScore = hrSession.overallScore;
    } else {
      const userHr = await prisma.interviewSession.findFirst({
        where: {
          userId: application.userId,
          type: 'HR',
          status: SessionStatus.COMPLETED,
          overallScore: { not: null },
        },
        orderBy: { overallScore: 'desc' },
      });
      if (userHr && userHr.overallScore !== null) {
        hrScore = userHr.overallScore;
      }
    }

    // 5. Check completeness
    const isComplete =
      resumeScore !== null &&
      oaScore !== null &&
      dsaScore !== null &&
      hrScore !== null;

    let compositeScore: number | null = null;
    let newStatus = application.status;
    let finalOutcomeAt: Date | null = application.finalOutcomeAt;
    let cutoffsPassed = false;

    if (isComplete) {
      // Authoritative composite formula
      compositeScore = Number(
        (
          resumeScore! * this.WEIGHTS.RESUME +
          oaScore! * this.WEIGHTS.OA +
          dsaScore! * this.WEIGHTS.DSA +
          hrScore! * this.WEIGHTS.HR
        ).toFixed(1)
      );

      // Verify all cutoffs
      cutoffsPassed =
        resumeScore! >= this.CUTOFFS.RESUME &&
        oaScore! >= this.CUTOFFS.OA &&
        dsaScore! >= this.CUTOFFS.DSA &&
        hrScore! >= this.CUTOFFS.HR;

      // Determine final outcome
      if (cutoffsPassed && compositeScore >= this.THRESHOLDS.SELECTED_MIN) {
        newStatus = ApplicationStatus.SELECTED;
      } else if (cutoffsPassed && compositeScore >= this.THRESHOLDS.WAITLISTED_MIN) {
        newStatus = ApplicationStatus.WAITLISTED;
      } else {
        newStatus = ApplicationStatus.NOT_SELECTED;
      }

      finalOutcomeAt = finalOutcomeAt || new Date();
    } else {
      // Incomplete status logic: maintain intermediate application status
      if (oaScore !== null && oaScore >= this.CUTOFFS.OA) {
        if (dsaScore !== null || hrScore !== null) {
          newStatus = ApplicationStatus.INTERVIEW_PENDING;
        } else {
          newStatus = ApplicationStatus.OA_PASSED;
        }
      } else if (oaScore !== null && oaScore < this.CUTOFFS.OA) {
        newStatus = ApplicationStatus.OA_FAILED;
      } else if (resumeScore !== null) {
        newStatus = ApplicationStatus.OA_PENDING;
      } else {
        newStatus = ApplicationStatus.DRAFT;
      }
    }

    // 6. Update PostgreSQL Application record
    await prisma.application.update({
      where: { id: application.id },
      data: {
        resumeScore,
        oaScore,
        dsaScore,
        hrScore,
        compositeScore,
        status: newStatus,
        finalOutcomeAt,
      },
    });

    return {
      applicationId: application.id,
      isComplete,
      status: newStatus,
      resumeScore,
      oaScore,
      dsaScore,
      hrScore,
      compositeScore,
      cutoffsPassed,
      finalOutcomeAt,
    };
  }
}
