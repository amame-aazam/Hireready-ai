import { ApplicationStatus } from '@prisma/client';
import { prisma } from '../../config/postgres';
import { ScoringService } from '../scoring/scoring.service';
import { LeaderboardService } from '../leaderboard/leaderboard.service';

export interface DashboardResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  application: {
    id: string;
    targetDomain: string;
    status: ApplicationStatus;
    compositeScore: number | null;
    isComplete: boolean;
    percentileRank: number | null;
    rank: number | null;
  };
  rounds: {
    resume: {
      status: 'PENDING' | 'COMPLETED';
      weight: number;
      score: number | null;
      cutoff: number;
      passed: boolean;
    };
    oa: {
      status: 'PENDING' | 'COMPLETED';
      weight: number;
      score: number | null;
      cutoff: number;
      passed: boolean;
    };
    dsa: {
      status: 'PENDING' | 'COMPLETED';
      weight: number;
      score: number | null;
      cutoff: number;
      passed: boolean;
    };
    hr: {
      status: 'PENDING' | 'COMPLETED';
      weight: number;
      score: number | null;
      cutoff: number;
      passed: boolean;
    };
  };
  nextAction: {
    type: 'RESUME' | 'OA' | 'DSA' | 'HR' | 'COMPLETED';
    stepNumber: number;
    title: string;
    description: string;
    route: string;
  };
  finalOutcome: {
    decision: 'SELECTED' | 'WAITLISTED' | 'NOT_SELECTED' | 'INCOMPLETE';
    title: string;
    summary: string;
    decidedAt: Date | null;
  };
}

export class DashboardService {
  public static async getStudentDashboard(userId: string): Promise<DashboardResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw { status: 404, message: 'User not found' };
    }

    // 1. Find or create an application for the student
    let application = await prisma.application.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (!application) {
      application = await prisma.application.create({
        data: {
          userId,
          targetDomain: 'Fullstack Engineering',
          status: ApplicationStatus.DRAFT,
        },
      });
    }

    // 2. Recalculate authoritative scores using ScoringService
    const scores = await ScoringService.recalculateApplicationScore(application.id);

    // 3. Compute public leaderboard rank and percentile if completed
    let candidateRank: number | null = null;
    let candidatePercentile: number | null = null;

    if (scores.isComplete && scores.compositeScore !== null) {
      const higherCount = await prisma.application.count({
        where: {
          compositeScore: { gt: scores.compositeScore },
        },
      });
      const totalCandidates = await prisma.application.count({
        where: { compositeScore: { not: null } },
      });

      candidateRank = higherCount + 1;
      const rankNum = candidateRank ?? 1;
      candidatePercentile =
        totalCandidates > 0
          ? Number((((totalCandidates - rankNum + 1) / totalCandidates) * 100).toFixed(1))
          : 100.0;
    }

    // 4. Construct Round Breakdown
    const rounds = {
      resume: {
        status: (scores.resumeScore !== null ? 'COMPLETED' : 'PENDING') as 'PENDING' | 'COMPLETED',
        weight: Math.round(ScoringService.WEIGHTS.RESUME * 100),
        score: scores.resumeScore,
        cutoff: ScoringService.CUTOFFS.RESUME,
        passed: scores.resumeScore !== null ? scores.resumeScore >= ScoringService.CUTOFFS.RESUME : false,
      },
      oa: {
        status: (scores.oaScore !== null ? 'COMPLETED' : 'PENDING') as 'PENDING' | 'COMPLETED',
        weight: Math.round(ScoringService.WEIGHTS.OA * 100),
        score: scores.oaScore,
        cutoff: ScoringService.CUTOFFS.OA,
        passed: scores.oaScore !== null ? scores.oaScore >= ScoringService.CUTOFFS.OA : false,
      },
      dsa: {
        status: (scores.dsaScore !== null ? 'COMPLETED' : 'PENDING') as 'PENDING' | 'COMPLETED',
        weight: Math.round(ScoringService.WEIGHTS.DSA * 100),
        score: scores.dsaScore,
        cutoff: ScoringService.CUTOFFS.DSA,
        passed: scores.dsaScore !== null ? scores.dsaScore >= ScoringService.CUTOFFS.DSA : false,
      },
      hr: {
        status: (scores.hrScore !== null ? 'COMPLETED' : 'PENDING') as 'PENDING' | 'COMPLETED',
        weight: Math.round(ScoringService.WEIGHTS.HR * 100),
        score: scores.hrScore,
        cutoff: ScoringService.CUTOFFS.HR,
        passed: scores.hrScore !== null ? scores.hrScore >= ScoringService.CUTOFFS.HR : false,
      },
    };

    // 5. Determine Next Action for Candidate
    let nextAction: DashboardResponse['nextAction'];
    if (scores.resumeScore === null) {
      nextAction = {
        type: 'RESUME',
        stepNumber: 1,
        title: 'Upload Resume for ATS Screening',
        description: 'Upload your resume to calculate your keyword alignment and initiate your candidacy.',
        route: '/resume',
      };
    } else if (scores.oaScore === null) {
      nextAction = {
        type: 'OA',
        stepNumber: 2,
        title: 'Complete Online Assessment (OA)',
        description: 'Take the timed 45-minute technical assessment comprising MCQs and Monaco coding challenges.',
        route: '/oa',
      };
    } else if (scores.dsaScore === null) {
      nextAction = {
        type: 'DSA',
        stepNumber: 3,
        title: 'Start AI DSA Technical Round',
        description: 'Engage with Sophia in a voice-based algorithmic interview with approach validation.',
        route: '/interview/dsa',
      };
    } else if (scores.hrScore === null) {
      nextAction = {
        type: 'HR',
        stepNumber: 4,
        title: 'Final Round: AI HR Behavioral Interview',
        description: 'Demonstrate leadership, culture alignment, and problem-solving using the STAR method.',
        route: '/interview/hr',
      };
    } else {
      nextAction = {
        type: 'COMPLETED',
        stepNumber: 4,
        title: 'All Mandatory Assessments Cleared',
        description: 'You have completed all 4 rounds. Check your position on the global leaderboard.',
        route: '/leaderboard',
      };
    }

    // 6. Final Outcome Decision
    let finalOutcome: DashboardResponse['finalOutcome'];
    if (scores.status === ApplicationStatus.SELECTED) {
      finalOutcome = {
        decision: 'SELECTED',
        title: 'Offer Extended — Selected',
        summary: `Outstanding achievement! You achieved a composite score of ${scores.compositeScore}/100, clearing all technical, algorithmic, and STAR behavioral bars.`,
        decidedAt: scores.finalOutcomeAt,
      };
    } else if (scores.status === ApplicationStatus.WAITLISTED) {
      finalOutcome = {
        decision: 'WAITLISTED',
        title: 'Priority Waitlist',
        summary: `You met all individual round cutoffs with a composite score of ${scores.compositeScore}/100. Your candidacy is placed on our priority waitlist.`,
        decidedAt: scores.finalOutcomeAt,
      };
    } else if (scores.status === ApplicationStatus.NOT_SELECTED) {
      finalOutcome = {
        decision: 'NOT_SELECTED',
        title: 'Application Unsuccessful',
        summary: `Thank you for completing the assessments. Your composite score of ${scores.compositeScore}/100 fell below our cutoff threshold of 70.0. Review your feedback to prepare for future openings.`,
        decidedAt: scores.finalOutcomeAt,
      };
    } else {
      finalOutcome = {
        decision: 'INCOMPLETE',
        title: 'Assessment In Progress',
        summary: 'Complete all 4 mandatory assessments to calculate your composite score and receive your hiring outcome.',
        decidedAt: null,
      };
    }

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      application: {
        id: application.id,
        targetDomain: application.targetDomain,
        status: scores.status,
        compositeScore: scores.compositeScore,
        isComplete: scores.isComplete,
        percentileRank: candidatePercentile,
        rank: candidateRank,
      },
      rounds,
      nextAction,
      finalOutcome,
    };
  }
}
