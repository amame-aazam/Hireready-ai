import { AssessmentState, ApplicationStatus, QuestionType } from '@prisma/client';
import { prisma } from '../../config/postgres';
import { MockCodeExecutor, TestCaseItem } from '../../providers/judge0/mockExecutor';

const GRACE_PERIOD_MS = 30000; // 30 seconds network latency grace period

export class AssessmentService {
  /**
   * Fetch assessment overview for a given domain slug or ID
   */
  public static async getAssessmentOverview(domainIdentifier: string) {
    const domain = await prisma.domain.findFirst({
      where: {
        OR: [{ id: domainIdentifier }, { slug: domainIdentifier }],
        isActive: true,
      },
    });

    if (!domain) {
      throw { status: 404, message: 'Domain not found or inactive' };
    }

    const assessment = await prisma.assessment.findFirst({
      where: {
        domainId: domain.id,
        isActive: true,
      },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    if (!assessment) {
      throw { status: 404, message: 'No active assessment found for this domain' };
    }

    return {
      id: assessment.id,
      domainId: domain.id,
      domainSlug: domain.slug,
      domainTitle: domain.title,
      title: assessment.title,
      description: assessment.description,
      durationMinutes: assessment.durationMinutes,
      passingScore: assessment.passingScore,
      totalQuestions: assessment._count.questions,
    };
  }

  /**
   * Start a new attempt or resume an active IN_PROGRESS attempt
   */
  public static async startOrResumeAttempt(userId: string, identifier: string) {
    let assessment = await prisma.assessment.findUnique({
      where: { id: identifier, isActive: true },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    let attempt: any = null;

    if (!assessment) {
      // Check if identifier is an attempt ID
      const existingAttempt = await prisma.assessmentAttempt.findUnique({
        where: { id: identifier },
        include: {
          assessment: {
            include: {
              questions: {
                orderBy: { orderIndex: 'asc' },
              },
            },
          },
        },
      });

      if (!existingAttempt) {
        throw { status: 404, message: 'Assessment or attempt not found' };
      }

      if (existingAttempt.userId !== userId) {
        throw { status: 403, message: 'Access denied to this attempt' };
      }

      assessment = existingAttempt.assessment;
      attempt = existingAttempt;
    } else {
      // Check for an active IN_PROGRESS attempt
      attempt = await prisma.assessmentAttempt.findFirst({
        where: {
          userId,
          assessmentId: assessment.id,
          status: AssessmentState.IN_PROGRESS,
        },
      });
    }

    const now = new Date();

    if (attempt && attempt.expiresAt) {
      // Check if attempt has already expired
      if (now.getTime() > attempt.expiresAt.getTime() + GRACE_PERIOD_MS && attempt.status === AssessmentState.IN_PROGRESS) {
        attempt = await prisma.assessmentAttempt.update({
          where: { id: attempt.id },
          data: { status: AssessmentState.EXPIRED },
        });
      }
    }

    // If no valid attempt exists, create a new one
    if (!attempt || (attempt.status !== AssessmentState.IN_PROGRESS && attempt.status !== AssessmentState.SUBMITTED && attempt.status !== AssessmentState.EXPIRED)) {
      // Check if student has an existing application for this domain
      const application = await prisma.application.findFirst({
        where: {
          userId,
          domainId: assessment.domainId,
        },
        orderBy: { createdAt: 'desc' },
      });

      const startedAt = new Date();
      const expiresAt = new Date(startedAt.getTime() + assessment.durationMinutes * 60 * 1000);

      attempt = await prisma.assessmentAttempt.create({
        data: {
          assessmentId: assessment.id,
          userId,
          applicationId: application ? application.id : null,
          status: AssessmentState.IN_PROGRESS,
          startedAt,
          expiresAt,
          answers: { mcq: {}, code: {} },
        },
      });
    }

    const remainingSeconds = attempt.expiresAt
      ? Math.max(0, Math.floor((attempt.expiresAt.getTime() - Date.now()) / 1000))
      : 0;

    // Sanitize questions to protect exam integrity (strip correct answers & hidden tests)
    const sanitizedQuestions = assessment.questions.map((q) => {
      const rawTestCases = (q.testCases as unknown as TestCaseItem[]) || [];
      const visibleTestCases = rawTestCases
        .filter((tc) => !tc.isHidden)
        .map(({ id, input, expectedOutput, description }) => ({
          id,
          input,
          expectedOutput,
          description,
        }));

      return {
        id: q.id,
        type: q.type,
        title: q.title,
        prompt: q.prompt,
        points: q.points,
        orderIndex: q.orderIndex,
        options: q.options,
        starterCode: q.starterCode,
        visibleTestCases,
      };
    });

    return {
      attempt: {
        id: attempt.id,
        assessmentId: attempt.assessmentId,
        status: attempt.status,
        startedAt: attempt.startedAt,
        expiresAt: attempt.expiresAt,
        remainingSeconds,
        answers: attempt.answers || { mcq: {}, code: {} },
      },
      assessment: {
        id: assessment.id,
        title: assessment.title,
        description: assessment.description,
        durationMinutes: assessment.durationMinutes,
        passingScore: assessment.passingScore,
        questions: sanitizedQuestions,
      },
    };
  }

  /**
   * Autosave candidate answers with strict server-authoritative timer validation
   */
  public static async autosaveAttempt(
    userId: string,
    attemptId: string,
    answers: { mcq: Record<string, number>; code: Record<string, { code: string; language: string }> }
  ) {
    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt || attempt.userId !== userId) {
      throw { status: 404, message: 'Attempt not found or access denied' };
    }

    if (attempt.status !== AssessmentState.IN_PROGRESS) {
      throw { status: 400, message: `Cannot autosave: attempt status is ${attempt.status}` };
    }

    // Server-authoritative timer check
    const now = Date.now();
    if (attempt.expiresAt && now > attempt.expiresAt.getTime() + GRACE_PERIOD_MS) {
      await prisma.assessmentAttempt.update({
        where: { id: attempt.id },
        data: { status: AssessmentState.EXPIRED },
      });
      throw { status: 400, message: 'Assessment time has expired. Answers can no longer be saved.' };
    }

    const updated = await prisma.assessmentAttempt.update({
      where: { id: attempt.id },
      data: {
        answers,
        updatedAt: new Date(),
      },
    });

    const remainingSeconds = attempt.expiresAt
      ? Math.max(0, Math.floor((attempt.expiresAt.getTime() - Date.now()) / 1000))
      : 0;

    return {
      success: true,
      savedAt: updated.updatedAt,
      remainingSeconds,
    };
  }

  /**
   * Run candidate code against visible test cases only (zero eval, mock sandbox)
   */
  public static async runCode(
    userId: string,
    attemptId: string,
    questionId: string,
    sourceCode: string,
    language: string
  ) {
    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!attempt || attempt.userId !== userId) {
      throw { status: 404, message: 'Attempt not found or access denied' };
    }

    if (attempt.status !== AssessmentState.IN_PROGRESS) {
      throw { status: 400, message: `Cannot run code: attempt status is ${attempt.status}` };
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question || question.assessmentId !== attempt.assessmentId) {
      throw { status: 404, message: 'Question not found' };
    }

    if (question.type !== QuestionType.CODING) {
      throw { status: 400, message: 'Question is not a coding question' };
    }

    const allTestCases = (question.testCases as unknown as TestCaseItem[]) || [];
    const execution = await MockCodeExecutor.executeTestCases(
      sourceCode,
      language,
      question.title,
      allTestCases,
      true // visibleOnly = true
    );

    return execution;
  }

  /**
   * Final submission with strict idempotency and scoring pipeline
   */
  public static async submitAttempt(userId: string, attemptId: string) {
    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
      include: {
        assessment: {
          include: {
            questions: true,
          },
        },
      },
    });

    if (!attempt || attempt.userId !== userId) {
      throw { status: 404, message: 'Attempt not found or access denied' };
    }

    // IDEMPOTENT GUARD: If already submitted, return the finalized score immediately
    if (attempt.status === AssessmentState.SUBMITTED) {
      return {
        id: attempt.id,
        status: attempt.status,
        totalScore: attempt.totalScore,
        mcqScore: attempt.mcqScore,
        codingScore: attempt.codingScore,
        passed: attempt.passed,
        submittedAt: attempt.submittedAt,
        breakdown: attempt.breakdown,
        isIdempotentReplay: true,
      };
    }

    const savedAnswers = (attempt.answers as any) || { mcq: {}, code: {} };
    const mcqAnswers = savedAnswers.mcq || {};
    const codeAnswers = savedAnswers.code || {};

    let totalMcqPointsPossible = 0;
    let earnedMcqPoints = 0;
    let totalCodingPointsPossible = 0;
    let earnedCodingPoints = 0;

    const mcqResults: any[] = [];
    const codingResults: any[] = [];

    // 1. Grade MCQs
    for (const q of attempt.assessment.questions) {
      if (q.type === QuestionType.MCQ) {
        totalMcqPointsPossible += q.points;
        const candidateChoice = mcqAnswers[q.id];
        const isCorrect = candidateChoice !== undefined && candidateChoice === q.correctOption;

        if (isCorrect) {
          earnedMcqPoints += q.points;
        }

        mcqResults.push({
          questionId: q.id,
          title: q.title,
          points: q.points,
          earnedPoints: isCorrect ? q.points : 0,
          candidateChoice,
          correctOption: q.correctOption,
          isCorrect,
        });
      }
    }

    // 2. Grade Coding Questions (both visible + hidden test cases)
    for (const q of attempt.assessment.questions) {
      if (q.type === QuestionType.CODING) {
        totalCodingPointsPossible += q.points;
        const candidateCodeData = codeAnswers[q.id] || { code: '', language: 'javascript' };
        const allTestCases = (q.testCases as unknown as TestCaseItem[]) || [];

        const execution = await MockCodeExecutor.executeTestCases(
          candidateCodeData.code,
          candidateCodeData.language,
          q.title,
          allTestCases,
          false // Run all test cases including hidden
        );

        const earnedPoints = Math.round(q.points * execution.scoreRatio);
        earnedCodingPoints += earnedPoints;

        codingResults.push({
          questionId: q.id,
          title: q.title,
          points: q.points,
          earnedPoints,
          passRatio: execution.scoreRatio,
          passedCount: execution.passedCount,
          totalCount: execution.totalCount,
          results: execution.results,
        });
      }
    }

    const maxPoints = totalMcqPointsPossible + totalCodingPointsPossible;
    const earnedTotal = earnedMcqPoints + earnedCodingPoints;
    const totalScorePercentage = maxPoints > 0 ? Math.round((earnedTotal / maxPoints) * 100) : 0;
    const passed = totalScorePercentage >= attempt.assessment.passingScore;

    const breakdown = {
      maxPoints,
      earnedTotal,
      totalScorePercentage,
      totalMcqPointsPossible,
      earnedMcqPoints,
      totalCodingPointsPossible,
      earnedCodingPoints,
      mcqResults,
      codingResults,
    };

    const finalizedAttempt = await prisma.assessmentAttempt.update({
      where: { id: attempt.id },
      data: {
        status: AssessmentState.SUBMITTED,
        submittedAt: new Date(),
        mcqScore: earnedMcqPoints,
        codingScore: earnedCodingPoints,
        totalScore: totalScorePercentage,
        passed,
        breakdown,
      },
    });

    // Update Application status if application is linked
    if (finalizedAttempt.applicationId) {
      await prisma.application.update({
        where: { id: finalizedAttempt.applicationId },
        data: {
          status: passed ? ApplicationStatus.OA_PASSED : ApplicationStatus.OA_FAILED,
        },
      });
    }

    return {
      id: finalizedAttempt.id,
      status: finalizedAttempt.status,
      totalScore: finalizedAttempt.totalScore,
      mcqScore: finalizedAttempt.mcqScore,
      codingScore: finalizedAttempt.codingScore,
      passed: finalizedAttempt.passed,
      submittedAt: finalizedAttempt.submittedAt,
      breakdown: finalizedAttempt.breakdown,
      isIdempotentReplay: false,
    };
  }
}
