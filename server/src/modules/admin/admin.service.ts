import { ApplicationStatus, Role, SessionStatus, InterviewType, AssessmentState, QuestionType } from '@prisma/client';
import { prisma } from '../../config/postgres';
import { ResumeAnalysisModel } from '../../models/resumeAnalysis.model';
import { AiEvaluationReportModel } from '../../models/aiEvaluationReport.model';
import { InterviewTranscriptModel } from '../../models/interviewTranscript.model';

export interface PlatformStatsResponse {
  overview: {
    totalStudents: number;
    totalApplications: number;
    activeApplications: number;
    oaCompletionRate: number;
    avgDsaScore: number | null;
    avgHrScore: number | null;
    avgResumeScore: number | null;
  };
  outcomes: {
    selected: number;
    waitlisted: number;
    notSelected: number;
    inProgress: number;
  };
  domainBreakdown: Array<{
    domain: string;
    applicationsCount: number;
    completedCount: number;
  }>;
}

export interface CandidateListQuery {
  page?: number;
  limit?: number;
  search?: string;
  domain?: string;
  status?: ApplicationStatus;
  sortBy?: 'createdAt' | 'compositeScore' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export class AdminService {
  /**
   * Aggregates platform-wide recruitment, assessment, and scoring metrics.
   */
  public static async getPlatformStats(): Promise<PlatformStatsResponse> {
    const [
      totalStudents,
      totalApplications,
      activeApplications,
      totalAttempts,
      completedAttempts,
      dsaAvg,
      hrAvg,
      resumeAvg,
      statusCounts,
      domains,
    ] = await Promise.all([
      prisma.user.count({ where: { role: Role.STUDENT } }),
      prisma.application.count(),
      prisma.application.count({
        where: {
          status: {
            notIn: [ApplicationStatus.DRAFT, ApplicationStatus.REJECTED],
          },
        },
      }),
      prisma.assessmentAttempt.count(),
      prisma.assessmentAttempt.count({ where: { status: AssessmentState.SUBMITTED } }),
      prisma.interviewSession.aggregate({
        where: { type: InterviewType.DSA, status: SessionStatus.COMPLETED },
        _avg: { overallScore: true },
      }),
      prisma.interviewSession.aggregate({
        where: { type: InterviewType.HR, status: SessionStatus.COMPLETED },
        _avg: { overallScore: true },
      }),
      prisma.application.aggregate({
        where: { resumeScore: { not: null } },
        _avg: { resumeScore: true },
      }),
      prisma.application.groupBy({
        by: ['status'],
        _count: { status: true },
      }),
      prisma.application.groupBy({
        by: ['targetDomain'],
        _count: { targetDomain: true },
      }),
    ]);

    // Outcome counts mapping
    const outcomeMap: Record<string, number> = {
      SELECTED: 0,
      WAITLISTED: 0,
      NOT_SELECTED: 0,
      IN_PROGRESS: 0,
    };

    for (const item of statusCounts) {
      if (item.status === ApplicationStatus.SELECTED) {
        outcomeMap.SELECTED += item._count.status;
      } else if (item.status === ApplicationStatus.WAITLISTED) {
        outcomeMap.WAITLISTED += item._count.status;
      } else if (item.status === ApplicationStatus.NOT_SELECTED) {
        outcomeMap.NOT_SELECTED += item._count.status;
      } else {
        outcomeMap.IN_PROGRESS += item._count.status;
      }
    }

    // OA Completion Rate (%)
    const oaCompletionRate =
      totalAttempts > 0 ? Number(((completedAttempts / totalAttempts) * 100).toFixed(1)) : 0;

    // Completed applications by domain
    const completedByDomain = await prisma.application.groupBy({
      by: ['targetDomain'],
      where: { compositeScore: { not: null } },
      _count: { targetDomain: true },
    });

    const completedDomainMap = new Map<string, number>();
    for (const c of completedByDomain) {
      completedDomainMap.set(c.targetDomain, c._count.targetDomain);
    }

    const domainBreakdown = domains.map((d: any) => ({
      domain: d.targetDomain,
      applicationsCount: d._count.targetDomain,
      completedCount: completedDomainMap.get(d.targetDomain) || 0,
    }));

    return {
      overview: {
        totalStudents,
        totalApplications,
        activeApplications,
        oaCompletionRate,
        avgDsaScore: dsaAvg._avg.overallScore ? Number(dsaAvg._avg.overallScore.toFixed(1)) : null,
        avgHrScore: hrAvg._avg.overallScore ? Number(hrAvg._avg.overallScore.toFixed(1)) : null,
        avgResumeScore: resumeAvg._avg.resumeScore ? Number(resumeAvg._avg.resumeScore.toFixed(1)) : null,
      },
      outcomes: {
        selected: outcomeMap.SELECTED,
        waitlisted: outcomeMap.WAITLISTED,
        notSelected: outcomeMap.NOT_SELECTED,
        inProgress: outcomeMap.IN_PROGRESS,
      },
      domainBreakdown,
    };
  }

  /**
   * Retrieves paginated candidates with application statuses, multi-round scores, and search filters.
   */
  public static async getCandidates(query: CandidateListQuery) {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.domain && query.domain !== 'All') {
      where.targetDomain = { contains: query.domain, mode: 'insensitive' };
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.search && query.search.trim()) {
      const term = query.search.trim();
      where.OR = [
        { id: { contains: term, mode: 'insensitive' } },
        { user: { firstName: { contains: term, mode: 'insensitive' } } },
        { user: { lastName: { contains: term, mode: 'insensitive' } } },
        { user: { email: { contains: term, mode: 'insensitive' } } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (query.sortBy === 'compositeScore') {
      orderBy = { compositeScore: query.sortOrder || 'desc' };
    } else if (query.sortBy === 'name') {
      orderBy = { user: { lastName: query.sortOrder || 'asc' } };
    } else if (query.sortBy === 'createdAt') {
      orderBy = { createdAt: query.sortOrder || 'desc' };
    }

    const [total, applications] = await Promise.all([
      prisma.application.count({ where }),
      prisma.application.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      }),
    ]);

    const candidates = applications.map((app: any) => ({
      applicationId: app.id,
      userId: app.userId,
      firstName: app.user.firstName,
      lastName: app.user.lastName,
      fullName: `${app.user.firstName} ${app.user.lastName}`,
      email: app.user.email,
      targetDomain: app.targetDomain,
      status: app.status,
      compositeScore: app.compositeScore,
      isComplete: app.compositeScore !== null,
      scores: {
        resume: app.resumeScore,
        oa: app.oaScore,
        dsa: app.dsaScore,
        hr: app.hrScore,
      },
      finalOutcomeAt: app.finalOutcomeAt,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    }));

    return {
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      candidates,
    };
  }

  /**
   * Fetches unified multi-round reports across PostgreSQL and MongoDB for a candidate.
   */
  public static async getCandidateReports(applicationId: string) {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!application) {
      throw { status: 404, message: 'Application not found' };
    }

    // 1. Fetch Resume Analysis from MongoDB
    let resumeReport: any = null;
    try {
      const resumeAnalysis =
        (await ResumeAnalysisModel.findOne({ applicationId }).lean()) ||
        (await ResumeAnalysisModel.findOne({ userId: application.userId }).sort({ createdAt: -1 }).lean());

      if (resumeAnalysis) {
        resumeReport = {
          score: resumeAnalysis.score,
          breakdown: resumeAnalysis.scoreBreakdown,
          atsStrengths: resumeAnalysis.atsStrengths || [],
          atsWeaknesses: resumeAnalysis.atsWeaknesses || [],
          missingKeywords: resumeAnalysis.missingKeywords || [],
          suggestedImprovements: resumeAnalysis.suggestedImprovements || [],
          extractedSkills: resumeAnalysis.extractedSkills || [],
          generatedAt: resumeAnalysis.createdAt,
        };
      }
    } catch (err) {
      console.warn('Could not fetch resume analysis from MongoDB:', err);
    }

    // 2. Fetch DSA Interview Report & Session from PostgreSQL & MongoDB
    let dsaReport: any = null;
    try {
      const dsaSession = await prisma.interviewSession.findFirst({
        where: { applicationId, type: InterviewType.DSA },
        orderBy: { createdAt: 'desc' },
      });

      if (dsaSession) {
        let aiEvaluation: any = null;
        let transcript: any = null;

        try {
          aiEvaluation = await AiEvaluationReportModel.findOne({ sessionId: dsaSession.id }).lean();
        } catch (_) {}

        try {
          transcript = await InterviewTranscriptModel.findOne({ sessionId: dsaSession.id }).lean();
        } catch (_) {}

        dsaReport = {
          sessionId: dsaSession.id,
          status: dsaSession.status,
          overallScore: dsaSession.overallScore,
          stage: dsaSession.stage,
          problemTitle: dsaSession.problemTitle,
          problemPrompt: dsaSession.problemPrompt,
          submittedCode: dsaSession.currentCode,
          questionQueue: dsaSession.questionQueue,
          questionAnswers: dsaSession.questionAnswers,
          completedAt: dsaSession.completedAt,
          evaluation: aiEvaluation
            ? {
                technicalScore: aiEvaluation.technicalScore,
                communicationScore: aiEvaluation.communicationScore,
                keyObservations: aiEvaluation.keyObservations || [],
                recommendation: aiEvaluation.recommendation,
                detailedFeedback: aiEvaluation.detailedFeedback,
              }
            : null,
          transcriptTurnsCount: transcript?.turns?.length || 0,
        };
      }
    } catch (err) {
      console.warn('Could not fetch DSA report:', err);
    }

    // 3. Fetch HR Behavioral Report & Session from PostgreSQL & MongoDB
    let hrReport: any = null;
    try {
      const hrSession = await prisma.interviewSession.findFirst({
        where: { applicationId, type: InterviewType.HR },
        orderBy: { createdAt: 'desc' },
      });

      if (hrSession) {
        let aiEvaluation: any = null;
        let transcript: any = null;

        try {
          aiEvaluation = await AiEvaluationReportModel.findOne({ sessionId: hrSession.id }).lean();
        } catch (_) {}

        try {
          transcript = await InterviewTranscriptModel.findOne({ sessionId: hrSession.id }).lean();
        } catch (_) {}

        hrReport = {
          sessionId: hrSession.id,
          status: hrSession.status,
          overallScore: hrSession.overallScore,
          completedAt: hrSession.completedAt,
          starBreakdown: aiEvaluation?.starBreakdown || null,
          evaluation: aiEvaluation
            ? {
                communicationScore: aiEvaluation.communicationScore,
                technicalScore: aiEvaluation.technicalScore,
                keyObservations: aiEvaluation.keyObservations || [],
                recommendation: aiEvaluation.recommendation,
                detailedFeedback: aiEvaluation.detailedFeedback,
              }
            : null,
          transcriptTurns: transcript?.turns || [],
        };
      }
    } catch (err) {
      console.warn('Could not fetch HR report:', err);
    }

    // 4. Fetch Technical OA Attempt
    let oaReport: any = null;
    try {
      const oaAttempt = await prisma.assessmentAttempt.findFirst({
        where: { applicationId },
        include: { assessment: { select: { title: true, durationMinutes: true, passingScore: true } } },
        orderBy: { createdAt: 'desc' },
      });

      if (oaAttempt) {
        oaReport = {
          attemptId: oaAttempt.id,
          assessmentTitle: oaAttempt.assessment.title,
          status: oaAttempt.status,
          mcqScore: oaAttempt.mcqScore,
          codingScore: oaAttempt.codingScore,
          totalScore: oaAttempt.totalScore,
          passed: oaAttempt.passed,
          submittedAt: oaAttempt.submittedAt,
          breakdown: oaAttempt.breakdown,
        };
      }
    } catch (err) {
      console.warn('Could not fetch OA attempt:', err);
    }

    return {
      candidate: {
        applicationId: application.id,
        userId: application.user.id,
        fullName: `${application.user.firstName} ${application.user.lastName}`,
        email: application.user.email,
        targetDomain: application.targetDomain,
        status: application.status,
        compositeScore: application.compositeScore,
      },
      reports: {
        resume: resumeReport,
        oa: oaReport,
        dsa: dsaReport,
        hr: hrReport,
      },
    };
  }

  /**
   * Manually overrides an application status and creates an authoritative audit log.
   */
  public static async overrideCandidateStatus(
    adminId: string,
    applicationId: string,
    newStatus: ApplicationStatus,
    reason: string
  ) {
    if (!reason || reason.trim().length === 0) {
      throw { status: 400, message: 'An audit reason/rationale is required to override candidate status.' };
    }

    const application = await prisma.application.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      throw { status: 404, message: 'Application not found' };
    }

    const previousStatus = application.status;

    // Execute status update and audit log creation atomically
    const [updatedApp, auditLog] = await prisma.$transaction([
      prisma.application.update({
        where: { id: applicationId },
        data: {
          status: newStatus,
          finalOutcomeAt: ['SELECTED', 'WAITLISTED', 'NOT_SELECTED'].includes(newStatus)
            ? new Date()
            : application.finalOutcomeAt,
        },
      }),
      prisma.auditLog.create({
        data: {
          adminId,
          targetType: 'APPLICATION_STATUS_OVERRIDE',
          targetId: applicationId,
          previousVal: previousStatus,
          newVal: newStatus,
          reason: reason.trim(),
        },
        include: {
          admin: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      application: updatedApp,
      auditLog,
    };
  }

  /**
   * Retrieves the chronological audit history for a candidate's application.
   */
  public static async getCandidateAuditLogs(applicationId: string) {
    return prisma.auditLog.findMany({
      where: {
        targetType: 'APPLICATION_STATUS_OVERRIDE',
        targetId: applicationId,
      },
      include: {
        admin: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Lists all assessment templates with question counts, pass rates, and attempt statistics.
   */
  public static async getAssessments() {
    const assessments = await prisma.assessment.findMany({
      include: {
        domain: { select: { id: true, title: true, slug: true } },
        questions: { select: { id: true, type: true, points: true } },
        _count: {
          select: { attempts: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Compute pass rates for each assessment
    const result = await Promise.all(
      assessments.map(async (a: any) => {
        const passedCount = await prisma.assessmentAttempt.count({
          where: { assessmentId: a.id, passed: true },
        });

        const totalAttempts = a._count.attempts;
        const passRate = totalAttempts > 0 ? Number(((passedCount / totalAttempts) * 100).toFixed(1)) : 0;

        return {
          id: a.id,
          title: a.title,
          description: a.description,
          domain: a.domain.title,
          domainId: a.domainId,
          durationMinutes: a.durationMinutes,
          passingScore: a.passingScore,
          isActive: a.isActive,
          totalQuestions: a.questions.length,
          mcqCount: a.questions.filter((q: any) => q.type === QuestionType.MCQ).length,
          codingCount: a.questions.filter((q: any) => q.type === QuestionType.CODING).length,
          totalAttempts,
          passedCount,
          passRate,
          createdAt: a.createdAt,
          updatedAt: a.updatedAt,
        };
      })
    );

    return result;
  }

  /**
   * Creates a new OA assessment template.
   */
  public static async createAssessment(data: {
    title: string;
    description: string;
    domainId?: string;
    domainSlug?: string;
    durationMinutes?: number;
    passingScore?: number;
    isActive?: boolean;
    questions?: Array<{
      type: QuestionType;
      title: string;
      prompt: string;
      points?: number;
      options?: string[];
      correctOption?: number;
      starterCode?: any;
      testCases?: any;
    }>;
  }) {
    let domainId = data.domainId;

    if (!domainId && data.domainSlug) {
      const domain = await prisma.domain.findUnique({ where: { slug: data.domainSlug } });
      if (domain) domainId = domain.id;
    }

    if (!domainId) {
      // Fallback to first available domain
      const firstDomain = await prisma.domain.findFirst();
      if (!firstDomain) {
        throw { status: 400, message: 'No domain found. Please specify a valid domainId.' };
      }
      domainId = firstDomain.id;
    }

    const assessment = await prisma.assessment.create({
      data: {
        title: data.title,
        description: data.description,
        domainId,
        durationMinutes: data.durationMinutes || 45,
        passingScore: data.passingScore || 70.0,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      include: {
        domain: true,
      },
    });

    // Create questions if provided
    if (data.questions && data.questions.length > 0) {
      await Promise.all(
        data.questions.map((q: any, idx: number) =>
          prisma.question.create({
            data: {
              assessmentId: assessment.id,
              type: q.type,
              title: q.title,
              prompt: q.prompt,
              points: q.points || 10,
              orderIndex: idx,
              options: q.options || [],
              correctOption: q.correctOption,
              starterCode: q.starterCode,
              testCases: q.testCases,
            },
          })
        )
      );
    }

    return assessment;
  }

  /**
   * Toggles active state of an assessment template.
   */
  public static async toggleAssessmentStatus(assessmentId: string, isActive: boolean) {
    return prisma.assessment.update({
      where: { id: assessmentId },
      data: { isActive },
    });
  }

  /**
   * Returns the unmasked cohort leaderboard for administrators with real names, emails, and full scores.
   */
  public static async getUnmaskedLeaderboard(domain?: string, page: number = 1, limit: number = 50) {
    const validLimit = Math.min(100, Math.max(1, limit));
    const validPage = Math.max(1, page);
    const skip = (validPage - 1) * validLimit;

    const where: any = {
      compositeScore: { not: null },
    };

    if (domain && domain !== 'All') {
      where.targetDomain = { contains: domain, mode: 'insensitive' };
    }

    const [totalCandidates, applications] = await Promise.all([
      prisma.application.count({ where }),
      prisma.application.findMany({
        where,
        skip,
        take: validLimit,
        orderBy: { compositeScore: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    const rankings = applications.map((app: any, index: number) => {
      const rank = skip + index + 1;
      const percentile =
        totalCandidates > 1
          ? Math.round(((totalCandidates - rank) / (totalCandidates - 1)) * 100)
          : 100;

      return {
        rank,
        applicationId: app.id,
        userId: app.user.id,
        fullName: `${app.user.firstName} ${app.user.lastName}`,
        firstName: app.user.firstName,
        lastName: app.user.lastName,
        email: app.user.email,
        targetDomain: app.targetDomain,
        compositeScore: app.compositeScore!,
        percentile,
        status: app.status,
        scores: {
          resume: app.resumeScore,
          oa: app.oaScore,
          dsa: app.dsaScore,
          hr: app.hrScore,
        },
        finalOutcomeAt: app.finalOutcomeAt,
        createdAt: app.createdAt,
      };
    });

    return {
      totalCandidates,
      page: validPage,
      limit: validLimit,
      totalPages: Math.max(1, Math.ceil(totalCandidates / validLimit)),
      rankings,
    };
  }
}
