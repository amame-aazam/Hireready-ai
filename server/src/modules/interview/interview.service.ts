import crypto from 'crypto';
import mongoose from 'mongoose';
import { SessionStatus, InterviewType, InterviewStage, ApplicationStatus } from '@prisma/client';
import { prisma } from '../../config/postgres';
import { InterviewTranscriptModel } from '../../models/interviewTranscript.model';
import { AiEvaluationReportModel } from '../../models/aiEvaluationReport.model';
import { getAIProvider } from '../../providers/ai';
import { MockCodeExecutor, TestCaseItem } from '../../providers/judge0/mockExecutor';
import { DSAQuestion, getRandomDSAQuestions } from './dsaQuestionBank';
import { HRQuestion, HR_QUESTION_BANK } from './hrQuestionBank';
import { ScoringService } from '../scoring/scoring.service';

export function getRandomHRQuestions(): HRQuestion[] {
  const shuffled = [...HR_QUESTION_BANK].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

// Ephemeral fallback cache for local dev / offline verification if MongoDB Atlas is unreachable
const memoryTranscripts = new Map<string, any>();
const memoryReports = new Map<string, any>();

async function getTranscript(sessionId: string): Promise<any> {
  if (mongoose.connection.readyState === 1) {
    try {
      const doc = await InterviewTranscriptModel.findOne({ sessionId });
      if (doc) return doc;
    } catch {
      // Fallback to memory cache
    }
  }
  return memoryTranscripts.get(sessionId) || null;
}

async function saveTranscript(sessionId: string, transcriptData: { id: string; sessionId: string; turns: any[] }): Promise<any> {
  if (mongoose.connection.readyState === 1) {
    try {
      let doc = await InterviewTranscriptModel.findOne({ sessionId });
      if (!doc) {
        doc = await InterviewTranscriptModel.create(transcriptData);
      } else {
        doc.turns = transcriptData.turns;
        await doc.save();
      }
      return doc;
    } catch {
      // Fallback to memory cache
    }
  }
  memoryTranscripts.set(sessionId, transcriptData);
  return transcriptData;
}

async function getReport(reportId: string): Promise<any> {
  if (mongoose.connection.readyState === 1) {
    try {
      const doc = await AiEvaluationReportModel.findOne({ id: reportId });
      if (doc) return doc;
    } catch {
      // Fallback to memory cache
    }
  }
  return memoryReports.get(reportId) || null;
}

async function saveReport(reportData: any): Promise<any> {
  if (mongoose.connection.readyState === 1) {
    try {
      const doc = await AiEvaluationReportModel.create(reportData);
      return doc;
    } catch {
      // Fallback to memory cache
    }
  }
  memoryReports.set(reportData.id, reportData);
  return reportData;
}

export class InterviewService {
  /**
   * Start or resume an active interview session with a randomized 3-question sequence
   */
  public static async startOrResumeSession(
    userId: string,
    interviewType: 'DSA' | 'HR' = 'DSA',
    _domainSlug?: string,
    applicationId?: string
  ) {
    // 1. Check for existing active IN_PROGRESS session for this user
    let session = await prisma.interviewSession.findFirst({
      where: {
        userId,
        type: interviewType as InterviewType,
        status: SessionStatus.IN_PROGRESS,
      },
      include: {
        application: true,
      },
    });

    // If an active session already exists, restore questionQueue and current question state
    if (session) {
      const isHR = session.type === InterviewType.HR;
      let questions: any[] = (session.questionQueue as any) || [];
      if (!questions || questions.length === 0) {
        questions = isHR ? getRandomHRQuestions() : getRandomDSAQuestions();
        await prisma.interviewSession.update({
          where: { id: session.id },
          data: { questionQueue: questions as any },
        });
      }

      const currentQIdx = session.currentQuestionIndex || 0;
      const currentQ = questions[currentQIdx] || questions[0];

      let transcript = await getTranscript(session.id);
      if (!transcript) {
        transcript = await saveTranscript(session.id, {
          id: crypto.randomUUID(),
          sessionId: session.id,
          turns: [],
        });
      }

      if (isHR) {
        return {
          session: {
            id: session.id,
            userId: session.userId,
            type: session.type,
            status: session.status,
            currentQuestionIndex: currentQIdx,
            stage: session.stage,
            startedAt: session.startedAt,
          },
          transcript: transcript.turns,
          currentQuestion: {
            index: currentQIdx,
            total: questions.length,
            id: currentQ.id,
            title: currentQ.title,
            competency: currentQ.competency,
            prompt: currentQ.prompt,
            starTips: currentQ.starTips,
            probingFollowUps: currentQ.probingFollowUps,
          },
          questionsOverview: questions.map((q: any, idx: number) => ({
            index: idx,
            id: q.id,
            title: q.title,
            competency: q.competency,
          })),
          isEditorUnlocked: false,
          isResumed: true,
        };
      }

      return {
        session: {
          id: session.id,
          userId: session.userId,
          type: session.type,
          status: session.status,
          currentQuestionIndex: currentQIdx,
          stage: session.stage,
          startedAt: session.startedAt,
        },
        transcript: transcript.turns,
        currentQuestion: {
          index: currentQIdx,
          total: questions.length,
          id: currentQ.id,
          title: currentQ.title,
          difficulty: currentQ.difficulty,
          domain: currentQ.domain,
          prompt: currentQ.prompt,
          timeComplexityTarget: currentQ.timeComplexityTarget,
          spaceComplexityTarget: currentQ.spaceComplexityTarget,
          approachKeywords: currentQ.approachKeywords,
          starterCode: currentQ.starterCode,
          visibleTestCases: currentQ.visibleTestCases,
        },
        questionsOverview: questions.map((q: any, idx: number) => ({
          index: idx,
          id: q.id,
          title: q.title,
          difficulty: q.difficulty,
        })),
        currentCode: session.currentCode || currentQ.starterCode.javascript,
        isEditorUnlocked: session.stage === InterviewStage.CODING,
        isResumed: true,
      };
    }

    // 2. Check if student has an existing application
    const application = await prisma.application.findFirst({
      where: {
        userId,
        ...(applicationId ? { id: applicationId } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    const isHR = interviewType === 'HR';
    const questions = isHR ? getRandomHRQuestions() : getRandomDSAQuestions();
    const firstQ = questions[0];

    // 3. Create new InterviewSession in PostgreSQL
    session = await prisma.interviewSession.create({
      data: {
        userId,
        applicationId: applicationId || (application ? application.id : null),
        type: interviewType as InterviewType,
        status: SessionStatus.IN_PROGRESS,
        currentQuestionIndex: 0,
        stage: isHR ? InterviewStage.QUESTION : InterviewStage.APPROACH,
        questionQueue: questions as any,
        problemTitle: firstQ.title,
        problemPrompt: firstQ.prompt,
        currentCode: isHR ? null : (firstQ as DSAQuestion).starterCode.javascript,
        startedAt: new Date(),
      },
      include: {
        application: true,
      },
    });

    // 4. Generate Personalized Opening AI Turn
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true },
    });
    const candidateName = user?.firstName ? ` ${user.firstName}` : '';

    const transcriptId = crypto.randomUUID();
    let openingGreeting = '';
    if (isHR) {
      openingGreeting = `Hello${candidateName}! Welcome to your HR Behavioral Interview! I am Sophia, your interviewer today.

We will explore your past engineering experiences and situational judgment using the STAR method: Situation, Task, Action, and Result.

Let's begin with Question 1: ${(firstQ as HRQuestion).title} (${(firstQ as HRQuestion).competency}).

${firstQ.prompt}

Please take your time to describe the context, your specific responsibilities, the concrete actions you took, and the final quantifiable outcome or learnings.`;
    } else {
      openingGreeting = `Hello${candidateName}! Welcome to your technical interview with Sophia. Today we will work through 3 algorithmic challenges (1 warm-up and 2 core technical problems).

Let's begin with Question 1: ${(firstQ as DSAQuestion).title} (${(firstQ as DSAQuestion).difficulty}).

${firstQ.prompt}

Before writing code, please explain your proposed approach, what data structures you would consider, and your target time and space complexity.`;
    }

    const initialTurns = [
      {
        role: 'ai' as const,
        content: openingGreeting,
        timestamp: new Date(),
      },
    ];

    const transcript = await saveTranscript(session.id, {
      id: transcriptId,
      sessionId: session.id,
      turns: initialTurns,
    });

    // Link transcriptId in Postgres
    await prisma.interviewSession.update({
      where: { id: session.id },
      data: { transcriptId },
    });

    if (isHR) {
      return {
        session: {
          id: session.id,
          userId: session.userId,
          type: session.type,
          status: session.status,
          currentQuestionIndex: 0,
          stage: session.stage,
          startedAt: session.startedAt,
        },
        transcript: transcript.turns,
        openingTurn: {
          role: 'ai',
          content: openingGreeting,
        },
        currentQuestion: {
          index: 0,
          total: questions.length,
          id: firstQ.id,
          title: firstQ.title,
          competency: (firstQ as HRQuestion).competency,
          prompt: firstQ.prompt,
          starTips: (firstQ as HRQuestion).starTips,
          probingFollowUps: (firstQ as HRQuestion).probingFollowUps,
        },
        questionsOverview: questions.map((q: any, idx: number) => ({
          index: idx,
          id: q.id,
          title: q.title,
          competency: q.competency,
        })),
        isEditorUnlocked: false,
        isResumed: false,
      };
    }

    const dsaQ = firstQ as DSAQuestion;
    return {
      session: {
        id: session.id,
        userId: session.userId,
        type: session.type,
        status: session.status,
        currentQuestionIndex: 0,
        stage: session.stage,
        startedAt: session.startedAt,
      },
      transcript: transcript.turns,
      openingTurn: {
        role: 'ai',
        content: openingGreeting,
      },
      currentQuestion: {
        index: 0,
        total: questions.length,
        id: dsaQ.id,
        title: dsaQ.title,
        difficulty: dsaQ.difficulty,
        domain: dsaQ.domain,
        prompt: dsaQ.prompt,
        timeComplexityTarget: dsaQ.timeComplexityTarget,
        spaceComplexityTarget: dsaQ.spaceComplexityTarget,
        approachKeywords: dsaQ.approachKeywords,
        starterCode: dsaQ.starterCode,
        visibleTestCases: dsaQ.visibleTestCases,
      },
      questionsOverview: questions.map((q: any, idx: number) => ({
        index: idx,
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
      })),
      currentCode: dsaQ.starterCode.javascript,
      isEditorUnlocked: false,
      isResumed: false,
    };
  }

  /**
   * Process a conversational turn (Candidate speaks -> AI evaluates approach or guides code)
   */
  public static async processTurn(
    userId: string,
    sessionId: string,
    utterance: string,
    codeSnippet?: string
  ) {
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw { status: 404, message: 'Interview session not found or access denied' };
    }

    if (session.status !== SessionStatus.IN_PROGRESS) {
      throw { status: 400, message: `Cannot submit turn: interview is ${session.status}` };
    }

    const questions: DSAQuestion[] = (session.questionQueue as any) || [];
    const currentQIdx = session.currentQuestionIndex || 0;
    const currentQ: DSAQuestion = questions[currentQIdx] || questions[0];

    let transcript = await getTranscript(session.id);
    if (!transcript) {
      transcript = await saveTranscript(session.id, {
        id: crypto.randomUUID(),
        sessionId: session.id,
        turns: [],
      });
    }

    // 1. Record Candidate Turn
    transcript.turns.push({
      role: 'candidate',
      content: utterance,
      timestamp: new Date(),
      codeSnippet,
    });

    // If candidate included code and stage is CODING, persist in DB
    if (codeSnippet && session.stage === InterviewStage.CODING) {
      await prisma.interviewSession.update({
        where: { id: session.id },
        data: { currentCode: codeSnippet },
      });
    }

    const lowerUtterance = utterance.toLowerCase();

    // Handle HR Behavioral Interview Turns
    if (session.type === InterviewType.HR) {
      const aiProvider = getAIProvider();
      const currentHRQ: HRQuestion = (questions[currentQIdx] as any) || HR_QUESTION_BANK[0];

      const aiReply = await aiProvider.generateInterviewTurn({
        sessionId: session.id,
        interviewType: 'HR',
        dialogueHistory: transcript.turns,
        latestCandidateUtterance: utterance,
      });

      transcript.turns.push({
        role: 'ai',
        content: aiReply.replyText,
        timestamp: new Date(),
      });
      await saveTranscript(session.id, transcript);

      return {
        replyText: aiReply.replyText,
        stage: InterviewStage.QUESTION,
        isEditorUnlocked: false,
        isTerminalTurn: aiReply.isTerminalTurn,
        starProgress: aiReply.starProgress,
        isQuestionComplete: aiReply.isQuestionComplete,
        turnEvaluation: aiReply.turnEvaluation,
        suggestedFollowUp: aiReply.suggestedFollowUp,
        turnCount: transcript.turns.length,
      };
    }

    // 2. State Machine: APPROACH STAGE Evaluation (DSA)
    if (session.stage === InterviewStage.APPROACH) {
      // Check candidate utterance against current question's approach keywords
      const matchedKeywords = currentQ.approachKeywords.filter((kw) =>
        lowerUtterance.includes(kw.toLowerCase())
      );

      const isSubstantive = utterance.trim().length >= 20;
      const isNegative =
        lowerUtterance.includes('no idea') ||
        lowerUtterance.includes("don't know") ||
        lowerUtterance.includes('idk') ||
        lowerUtterance.includes('not sure');

      const isApproved = !isNegative && matchedKeywords.length >= 1;

      if (isApproved) {
        // UNLOCK Monaco Editor! Transition stage to CODING
        await prisma.interviewSession.update({
          where: { id: session.id },
          data: { stage: InterviewStage.CODING },
        });

        const replyText = `Excellent approach! That strategy achieves optimal ${currentQ.timeComplexityTarget} time complexity with ${currentQ.spaceComplexityTarget} auxiliary space.

I have unlocked your Monaco code editor on the right—please go ahead and write your implementation. When you're ready, click "Run Code" to test it against our test cases.`;

        transcript.turns.push({
          role: 'ai',
          content: replyText,
          timestamp: new Date(),
        });
        await saveTranscript(session.id, transcript);

        return {
          replyText,
          stage: InterviewStage.CODING,
          isEditorUnlocked: true,
          isTerminalTurn: false,
          turnEvaluation: { clarity: 9.0, technicalAccuracy: 9.5 },
          suggestedFollowUp: 'You can now code your solution in the editor on your right.',
          turnCount: transcript.turns.length,
        };
      } else {
        // Provide guidance/hint and KEEP editor locked in APPROACH stage
        const replyText = `A brute-force or preliminary strategy is a good starting point, but can we optimize the lookup or traversal to achieve ${currentQ.timeComplexityTarget} time? ${currentQ.approachExplanationHint}

How might you apply that data structure or technique here?`;

        transcript.turns.push({
          role: 'ai',
          content: replyText,
          timestamp: new Date(),
        });
        await saveTranscript(session.id, transcript);

        return {
          replyText,
          stage: InterviewStage.APPROACH,
          isEditorUnlocked: false,
          isTerminalTurn: false,
          turnEvaluation: { clarity: 7.5, technicalAccuracy: 7.0 },
          suggestedFollowUp: 'Think about the optimal data structure for O(1) lookup or two-pointer traversal.',
          turnCount: transcript.turns.length,
        };
      }
    }

    // 3. State Machine: CODING STAGE Assistance
    const aiProvider = getAIProvider();
    const dialogueHistory = transcript.turns.map((t: any) => ({
      role: t.role,
      content: t.content,
    }));

    const aiOutput = await aiProvider.generateInterviewTurn({
      sessionId: session.id,
      interviewType: session.type,
      dialogueHistory,
      latestCandidateUtterance: utterance,
      codeSnippet: codeSnippet || session.currentCode || undefined,
    });

    transcript.turns.push({
      role: 'ai',
      content: aiOutput.replyText,
      timestamp: new Date(),
    });
    await saveTranscript(session.id, transcript);

    return {
      replyText: aiOutput.replyText,
      stage: InterviewStage.CODING,
      isEditorUnlocked: true,
      isTerminalTurn: aiOutput.isTerminalTurn,
      turnEvaluation: aiOutput.turnEvaluation,
      suggestedFollowUp: aiOutput.suggestedFollowUp,
      turnCount: transcript.turns.length,
    };
  }

  /**
   * Run candidate code against visible test cases (Protected: Only in CODING stage)
   */
  public static async runCode(
    userId: string,
    sessionId: string,
    sourceCode: string,
    language: string = 'javascript'
  ) {
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw { status: 404, message: 'Interview session not found or access denied' };
    }

    // Strict guard: Code execution is forbidden in APPROACH stage
    if (session.stage === InterviewStage.APPROACH) {
      throw {
        status: 403,
        message: 'Editor is locked. Please discuss and validate your approach with Sophia first before running code.',
      };
    }

    const questions: DSAQuestion[] = (session.questionQueue as any) || [];
    const currentQIdx = session.currentQuestionIndex || 0;
    const currentQ: DSAQuestion = questions[currentQIdx] || questions[0];

    // Persist current code draft in Postgres
    await prisma.interviewSession.update({
      where: { id: session.id },
      data: { currentCode: sourceCode },
    });

    // Execute test cases safely using MockCodeExecutor
    const execution = await MockCodeExecutor.executeTestCases(
      sourceCode,
      language,
      currentQ.title,
      currentQ.visibleTestCases as TestCaseItem[],
      true
    );

    return execution;
  }

  /**
   * Advance to the next question in the sequence or conclude interview
   */
  public static async advanceQuestion(
    userId: string,
    sessionId: string,
    code: string,
    language: string = 'javascript'
  ) {
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw { status: 404, message: 'Interview session not found or access denied' };
    }

    const isHR = session.type === InterviewType.HR;
    const questions: any[] = (session.questionQueue as any) || [];
    const currentQIdx = session.currentQuestionIndex || 0;
    const currentQ = questions[currentQIdx] || questions[0];

    // Save candidate's solution for the current question
    const answers = (session.questionAnswers as any) || {};
    answers[currentQIdx] = {
      questionId: currentQ.id,
      questionTitle: currentQ.title,
      difficulty: isHR ? undefined : currentQ.difficulty,
      competency: isHR ? currentQ.competency : undefined,
      code: isHR ? '' : code,
      language: isHR ? '' : language,
      completedAt: new Date().toISOString(),
    };

    const isLastQuestion = currentQIdx >= questions.length - 1;

    // If last question completed, finalize interview and generate report
    if (isLastQuestion) {
      await prisma.interviewSession.update({
        where: { id: session.id },
        data: {
          questionAnswers: answers,
          currentCode: isHR ? null : code,
        },
      });

      return await this.finishInterview(userId, sessionId, isHR ? undefined : code);
    }

    // Transition to next question
    const nextQIdx = currentQIdx + 1;
    const nextQ = questions[nextQIdx];
    const nextStarter = isHR
      ? ''
      : (nextQ.starterCode as any)[language] || nextQ.starterCode.javascript;

    let transitionMessage = '';
    if (isHR) {
      transitionMessage = `That was a very structured and insightful example! Let's move to Question ${nextQIdx + 1} of 3: ${nextQ.title} (${nextQ.competency}).

${nextQ.prompt}

Please walk me through your experience using the STAR approach: Situation, Task, Action, and Result.`;
    } else {
      transitionMessage = `Outstanding job completing Question ${currentQIdx + 1}! Let's transition to Question ${nextQIdx + 1} of 3: ${nextQ.title} (${nextQ.difficulty}).

${nextQ.prompt}

Before diving into code, walk me through your high-level approach for this challenge. How do you plan to tackle it?`;
    }

    // Update session state in Postgres
    const updatedSession = await prisma.interviewSession.update({
      where: { id: session.id },
      data: {
        currentQuestionIndex: nextQIdx,
        stage: isHR ? InterviewStage.QUESTION : InterviewStage.APPROACH,
        problemTitle: nextQ.title,
        problemPrompt: nextQ.prompt,
        currentCode: isHR ? null : nextStarter,
        questionAnswers: answers,
      },
    });

    // Append AI transition turn to transcript
    let transcript = await getTranscript(session.id);
    if (!transcript) {
      transcript = { id: crypto.randomUUID(), sessionId: session.id, turns: [] };
    }
    transcript.turns.push({
      role: 'ai',
      content: transitionMessage,
      timestamp: new Date(),
    });
    await saveTranscript(session.id, transcript);

    if (isHR) {
      return {
        isFinished: false,
        currentQuestionIndex: nextQIdx,
        stage: updatedSession.stage,
        session: {
          id: updatedSession.id,
          currentQuestionIndex: nextQIdx,
          stage: updatedSession.stage,
        },
        currentQuestion: {
          index: nextQIdx,
          total: questions.length,
          id: nextQ.id,
          title: nextQ.title,
          competency: nextQ.competency,
          prompt: nextQ.prompt,
          starTips: nextQ.starTips,
          probingFollowUps: nextQ.probingFollowUps,
        },
        isEditorUnlocked: false,
        aiTransitionTurn: {
          role: 'ai',
          content: transitionMessage,
          timestamp: new Date().toISOString(),
        },
      };
    }

    return {
      isFinished: false,
      currentQuestionIndex: nextQIdx,
      stage: updatedSession.stage,
      session: {
        id: updatedSession.id,
        currentQuestionIndex: nextQIdx,
        stage: updatedSession.stage,
      },
      currentQuestion: {
        index: nextQIdx,
        total: questions.length,
        id: nextQ.id,
        title: nextQ.title,
        difficulty: nextQ.difficulty,
        domain: nextQ.domain,
        prompt: nextQ.prompt,
        timeComplexityTarget: nextQ.timeComplexityTarget,
        spaceComplexityTarget: nextQ.spaceComplexityTarget,
        approachKeywords: nextQ.approachKeywords,
        starterCode: nextQ.starterCode,
        visibleTestCases: nextQ.visibleTestCases,
      },
      starterCode: nextStarter,
      isEditorUnlocked: false,
      aiTransitionTurn: {
        role: 'ai',
        content: transitionMessage,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Finalize interview, generate AI evaluation report, and persist in MongoDB & Postgres (Idempotent)
   */
  public static async finishInterview(userId: string, sessionId: string, finalCode?: string) {
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw { status: 404, message: 'Interview session not found or access denied' };
    }

    // IDEMPOTENCY GUARD: If already completed, return existing evaluation report
    if (session.status === SessionStatus.COMPLETED && session.evaluationId) {
      const existingReport = await getReport(session.evaluationId);
      if (existingReport) {
        return {
          session,
          report: existingReport,
          isIdempotentReplay: true,
          isFinished: true,
        };
      }
    }

    // Persist final code if passed
    if (finalCode) {
      await prisma.interviewSession.update({
        where: { id: session.id },
        data: { currentCode: finalCode },
      });
    }

    // 1. Fetch complete transcript
    const transcript = await getTranscript(session.id);
    const turns = (transcript?.turns || []).map((t: any) => ({
      role: t.role,
      content: t.content,
    }));

    // Collect all code submissions across questions
    const answers = (session.questionAnswers as any) || {};
    const codeSubmissions = Object.values(answers).map((ans: any) => ans.code || '');
    if (finalCode && !codeSubmissions.includes(finalCode)) {
      codeSubmissions.push(finalCode);
    }

    // 2. Invoke AI Provider for multi-pillar interview evaluation
    const aiProvider = getAIProvider();
    const evaluation = await aiProvider.evaluateInterview({
      sessionId: session.id,
      interviewType: session.type,
      turns,
      codeSubmissions: codeSubmissions.length > 0 ? codeSubmissions : [session.currentCode || ''],
    });

    // 3. Persist AI Evaluation Report in MongoDB (or fallback cache)
    const reportId = crypto.randomUUID();
    const report = await saveReport({
      id: reportId,
      sessionId: session.id,
      overallScore: evaluation.overallScore,
      technicalScore: evaluation.technicalScore,
      communicationScore: evaluation.communicationScore,
      starBreakdown: evaluation.starBreakdown,
      keyObservations: evaluation.keyObservations,
      recommendation: evaluation.recommendation,
      detailedFeedback: evaluation.detailedFeedback,
      generatedAt: new Date(),
    });

    // 4. Update InterviewSession in PostgreSQL
    const updatedSession = await prisma.interviewSession.update({
      where: { id: session.id },
      data: {
        status: SessionStatus.COMPLETED,
        stage: InterviewStage.COMPLETED,
        completedAt: new Date(),
        overallScore: evaluation.overallScore,
        evaluationId: report.id,
        transcriptId: transcript?.id || session.transcriptId,
      },
    });

    // 5. Recalculate authoritative application composite score and final outcome
    if (updatedSession.applicationId) {
      try {
        await ScoringService.recalculateApplicationScore(updatedSession.applicationId);
      } catch (err) {
        console.warn('Could not recalculate application score on interview finish:', err);
      }
    }

    return {
      session: updatedSession,
      report,
      isFinished: true,
      isIdempotentReplay: false,
    };
  }

  /**
   * Get full details of an interview session
   */
  public static async getSessionDetails(userId: string, sessionId: string) {
    const session = await prisma.interviewSession.findUnique({
      where: { id: sessionId },
    });

    if (!session || session.userId !== userId) {
      throw { status: 404, message: 'Interview session not found or access denied' };
    }

    const isHR = session.type === InterviewType.HR;
    const questions: any[] = (session.questionQueue as any) || [];
    const currentQIdx = session.currentQuestionIndex || 0;
    const currentQ = questions[currentQIdx] || questions[0];

    const transcript = await getTranscript(session.id);
    const report = session.evaluationId ? await getReport(session.evaluationId) : null;

    if (isHR) {
      return {
        session: {
          id: session.id,
          userId: session.userId,
          type: session.type,
          status: session.status,
          currentQuestionIndex: currentQIdx,
          stage: session.stage,
          startedAt: session.startedAt,
        },
        transcript: transcript?.turns || [],
        report,
        currentQuestion: currentQ
          ? {
              index: currentQIdx,
              total: questions.length,
              id: currentQ.id,
              title: currentQ.title,
              competency: currentQ.competency,
              prompt: currentQ.prompt,
              starTips: currentQ.starTips,
              probingFollowUps: currentQ.probingFollowUps,
            }
          : null,
        questionsOverview: questions.map((q: any, idx: number) => ({
          index: idx,
          id: q.id,
          title: q.title,
          competency: q.competency,
        })),
        isEditorUnlocked: false,
      };
    }

    return {
      session: {
        id: session.id,
        userId: session.userId,
        type: session.type,
        status: session.status,
        currentQuestionIndex: currentQIdx,
        stage: session.stage,
        startedAt: session.startedAt,
      },
      transcript: transcript?.turns || [],
      report,
      currentQuestion: currentQ
        ? {
            index: currentQIdx,
            total: questions.length,
            id: currentQ.id,
            title: currentQ.title,
            difficulty: currentQ.difficulty,
            domain: currentQ.domain,
            prompt: currentQ.prompt,
            timeComplexityTarget: currentQ.timeComplexityTarget,
            spaceComplexityTarget: currentQ.spaceComplexityTarget,
            starterCode: currentQ.starterCode,
            visibleTestCases: currentQ.visibleTestCases,
          }
        : null,
      questionsOverview: questions.map((q: any, idx: number) => ({
        index: idx,
        id: q.id,
        title: q.title,
        difficulty: q.difficulty,
      })),
      isEditorUnlocked: session.stage === InterviewStage.CODING,
    };
  }
}
