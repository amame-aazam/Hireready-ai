import crypto from 'crypto';
import mongoose from 'mongoose';
import { SessionStatus, InterviewType, ApplicationStatus } from '@prisma/client';
import { prisma } from '../../config/postgres';
import { InterviewTranscriptModel } from '../../models/interviewTranscript.model';
import { AiEvaluationReportModel } from '../../models/aiEvaluationReport.model';
import { getAIProvider } from '../../providers/ai';
import { MockCodeExecutor, TestCaseItem } from '../../providers/judge0/mockExecutor';

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

const DEFAULT_DSA_PROBLEM = {
  title: 'Two Sum & Optimal Lookup',
  prompt:
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. Please explain your approach, time/space complexity tradeoffs, and write an optimal solution in the code editor.',
  starterCode:
    'function twoSum(nums, target) {\n  // Write your solution here\n  // Return [index1, index2]\n}',
  testCases: [
    {
      id: 'tc-dsa-1',
      input: 'nums = [2, 7, 11, 15], target = 9',
      expectedOutput: '[0, 1]',
      isHidden: false,
      description: 'Standard basic target pair',
    },
    {
      id: 'tc-dsa-2',
      input: 'nums = [3, 2, 4], target = 6',
      expectedOutput: '[1, 2]',
      isHidden: false,
      description: 'Indices not at start',
    },
    {
      id: 'tc-dsa-3',
      input: 'nums = [3, 3], target = 6',
      expectedOutput: '[0, 1]',
      isHidden: false,
      description: 'Identical complement values',
    },
  ],
};

export class InterviewService {
  /**
   * Start or resume an active interview session
   */
  public static async startOrResumeSession(
    userId: string,
    interviewType: 'DSA' | 'HR' = 'DSA',
    _domainSlug?: string
  ) {
    const aiProvider = getAIProvider();

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

    // If an active session already exists, fetch its transcript and return
    if (session) {
      let transcript = await getTranscript(session.id);
      if (!transcript) {
        transcript = await saveTranscript(session.id, {
          id: crypto.randomUUID(),
          sessionId: session.id,
          turns: [],
        });
      }

      return {
        session: {
          id: session.id,
          userId: session.userId,
          type: session.type,
          status: session.status,
          problemTitle: session.problemTitle,
          problemPrompt: session.problemPrompt,
          currentCode: session.currentCode || DEFAULT_DSA_PROBLEM.starterCode,
          startedAt: session.startedAt,
        },
        transcript: transcript.turns,
        problem: {
          title: session.problemTitle || DEFAULT_DSA_PROBLEM.title,
          prompt: session.problemPrompt || DEFAULT_DSA_PROBLEM.prompt,
          starterCode: session.currentCode || DEFAULT_DSA_PROBLEM.starterCode,
          visibleTestCases: DEFAULT_DSA_PROBLEM.testCases,
        },
        isResumed: true,
      };
    }

    // 2. Check if student has an existing application
    const application = await prisma.application.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    // 3. Create new InterviewSession in PostgreSQL
    session = await prisma.interviewSession.create({
      data: {
        userId,
        applicationId: application ? application.id : null,
        type: interviewType as InterviewType,
        status: SessionStatus.IN_PROGRESS,
        problemTitle: DEFAULT_DSA_PROBLEM.title,
        problemPrompt: DEFAULT_DSA_PROBLEM.prompt,
        currentCode: DEFAULT_DSA_PROBLEM.starterCode,
        startedAt: new Date(),
      },
      include: {
        application: true,
      },
    });

    // 4. Create InterviewTranscript in MongoDB (or fallback cache)
    const transcriptId = crypto.randomUUID();

    // 5. Generate Opening AI Turn (Greeting + Problem Setup)
    const openingAiTurn = await aiProvider.generateInterviewTurn({
      sessionId: session.id,
      interviewType,
      dialogueHistory: [],
    });

    const initialTurns = [
      {
        role: 'ai' as const,
        content: openingAiTurn.replyText,
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

    return {
      session: {
        id: session.id,
        userId: session.userId,
        type: session.type,
        status: session.status,
        problemTitle: session.problemTitle,
        problemPrompt: session.problemPrompt,
        currentCode: session.currentCode,
        startedAt: session.startedAt,
      },
      transcript: transcript.turns,
      openingTurn: {
        role: 'ai',
        content: openingAiTurn.replyText,
      },
      problem: {
        title: session.problemTitle || DEFAULT_DSA_PROBLEM.title,
        prompt: session.problemPrompt || DEFAULT_DSA_PROBLEM.prompt,
        starterCode: session.currentCode || DEFAULT_DSA_PROBLEM.starterCode,
        visibleTestCases: DEFAULT_DSA_PROBLEM.testCases,
      },
      isResumed: false,
    };
  }

  /**
   * Process a conversational turn (Candidate speaks -> AI evaluates & replies)
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

    // If candidate included code, sync with PostgreSQL
    if (codeSnippet) {
      await prisma.interviewSession.update({
        where: { id: session.id },
        data: { currentCode: codeSnippet },
      });
    }

    // 2. Query AI Provider with full dialogue context
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

    // 3. Record AI Reply Turn
    transcript.turns.push({
      role: 'ai',
      content: aiOutput.replyText,
      timestamp: new Date(),
    });
    await saveTranscript(session.id, transcript);

    return {
      replyText: aiOutput.replyText,
      isTerminalTurn: aiOutput.isTerminalTurn,
      turnEvaluation: aiOutput.turnEvaluation,
      suggestedFollowUp: aiOutput.suggestedFollowUp,
      turnCount: transcript.turns.length,
    };
  }

  /**
   * Run candidate code against visible test cases
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

    // Persist current code draft in Postgres
    await prisma.interviewSession.update({
      where: { id: session.id },
      data: { currentCode: sourceCode },
    });

    // Execute test cases safely using MockCodeExecutor
    const execution = await MockCodeExecutor.executeTestCases(
      sourceCode,
      language,
      session.problemTitle || 'Two Sum',
      DEFAULT_DSA_PROBLEM.testCases as TestCaseItem[],
      true
    );

    return execution;
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

    // 2. Invoke AI Provider for multi-pillar interview evaluation
    const aiProvider = getAIProvider();
    const evaluation = await aiProvider.evaluateInterview({
      sessionId: session.id,
      interviewType: session.type,
      turns,
      codeSubmissions: [finalCode || session.currentCode || ''],
    });

    // 3. Persist AI Evaluation Report in MongoDB (or fallback cache)
    const reportId = crypto.randomUUID();
    const report = await saveReport({
      id: reportId,
      sessionId: session.id,
      overallScore: evaluation.overallScore,
      technicalScore: evaluation.technicalScore,
      communicationScore: evaluation.communicationScore,
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
        completedAt: new Date(),
        overallScore: evaluation.overallScore,
        evaluationId: report.id,
        transcriptId: transcript?.id || session.transcriptId,
      },
    });

    // 5. Update Application status if linked
    if (updatedSession.applicationId) {
      await prisma.application.update({
        where: { id: updatedSession.applicationId },
        data: {
          status: ApplicationStatus.COMPLETED,
        },
      });
    }

    return {
      session: updatedSession,
      report,
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

    const transcript = await getTranscript(session.id);
    const report = session.evaluationId
      ? await getReport(session.evaluationId)
      : null;

    return {
      session,
      transcript: transcript?.turns || [],
      report,
      problem: {
        title: session.problemTitle || DEFAULT_DSA_PROBLEM.title,
        prompt: session.problemPrompt || DEFAULT_DSA_PROBLEM.prompt,
        starterCode: session.currentCode || DEFAULT_DSA_PROBLEM.starterCode,
        visibleTestCases: DEFAULT_DSA_PROBLEM.testCases,
      },
    };
  }
}
