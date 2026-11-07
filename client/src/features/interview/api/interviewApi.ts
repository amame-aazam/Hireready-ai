import { apiClient } from '../../../lib/axios';
import { TestCaseResult } from '../../assessment/api/assessmentApi';

export interface InterviewTurn {
  role: 'ai' | 'candidate';
  content: string;
  timestamp: string;
  codeSnippet?: string;
  codeSnapshot?: { code: string; language?: string } | string;
}

export type InterviewStage = 'APPROACH' | 'CODING' | 'QUESTION' | 'FOLLOW_UP' | 'SUBMITTED' | 'COMPLETED';

export interface StarProgress {
  situation: boolean;
  task: boolean;
  action: boolean;
  result: boolean;
}

export interface StarBreakdown {
  situationScore: number;
  taskScore: number;
  actionScore: number;
  resultScore: number;
  situationFeedback?: string;
  taskFeedback?: string;
  actionFeedback?: string;
  resultFeedback?: string;
}

export interface InterviewSessionData {
  id: string;
  userId: string;
  type: 'DSA' | 'HR';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';
  currentQuestionIndex: number;
  stage: InterviewStage;
  problemTitle?: string;
  problemPrompt?: string;
  currentCode?: string;
  startedAt?: string;
  completedAt?: string;
  overallScore?: number;
}

export interface HRQuestionData {
  index: number;
  total: number;
  id: string;
  title: string;
  competency: string;
  prompt: string;
  starTips?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  probingFollowUps?: {
    missingAction: string;
    missingResult: string;
    missingTask: string;
    missingSituation: string;
  };
}

export interface ProblemData {
  index: number;
  total: number;
  id: string;
  title: string;
  difficulty?: 'EASY' | 'MEDIUM';
  competency?: string;
  domain?: string;
  prompt: string;
  timeComplexityTarget?: string;
  spaceComplexityTarget?: string;
  starTips?: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  starterCode?:
    | {
        javascript: string;
        python: string;
        java: string;
        cpp: string;
      }
    | string;
  visibleTestCases?: Array<{
    id: string;
    input: string;
    expectedOutput: string;
    description?: string;
  }>;
}

export interface QuestionOverviewItem {
  index: number;
  id: string;
  title: string;
  difficulty?: 'EASY' | 'MEDIUM';
  competency?: string;
}

export interface StartInterviewResponse {
  session: InterviewSessionData;
  transcript: InterviewTurn[];
  openingTurn?: {
    role: 'ai';
    content: string;
  };
  currentQuestion: ProblemData;
  questionsOverview?: QuestionOverviewItem[];
  currentCode?: string;
  isEditorUnlocked: boolean;
  isResumed: boolean;
}

export interface TurnResponse {
  replyText: string;
  aiReply?: string;
  stage?: InterviewStage;
  isEditorUnlocked?: boolean;
  isTerminalTurn: boolean;
  suggestedFollowUp?: string;
  starProgress?: StarProgress;
  isQuestionComplete?: boolean;
  turnEvaluation?: {
    clarity: number;
    technicalAccuracy: number;
  };
  turnCount: number;
}

export interface EvaluationReportData {
  id: string;
  sessionId: string;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  codeQuality?: number;
  codeCorrectness?: number;
  timeComplexityScore?: number;
  summaryFeedback?: string;
  strengths?: string[];
  areasOfImprovement?: string[];
  starBreakdown?: StarBreakdown;
  keyObservations: string[];
  recommendation: 'STRONG_HIRE' | 'HIRE' | 'NEUTRAL' | 'NO_HIRE';
  detailedFeedback: {
    strengths: string[];
    weaknesses: string[];
    technicalAnalysis: string;
    communicationAnalysis: string;
  };
  generatedAt: string;
}

export interface FinishInterviewResponse {
  session: InterviewSessionData;
  report: EvaluationReportData;
  isIdempotentReplay: boolean;
}

export interface AdvanceQuestionResponse {
  isFinished: boolean;
  sessionComplete?: boolean;
  currentQuestionIndex?: number;
  stage?: InterviewStage;
  session?: InterviewSessionData;
  currentQuestion?: ProblemData;
  starterCode?: string;
  currentCode?: string;
  isEditorUnlocked: boolean;
  aiTransitionTurn?: InterviewTurn;
  nextQuestionOpening?: {
    role: 'ai';
    content: string;
  };
  report?: EvaluationReportData;
}

export interface CodeExecutionResponse {
  passedCount: number;
  totalCount: number;
  scoreRatio: number;
  allPassed: boolean;
  results: TestCaseResult[];
  testResults?: TestCaseResult[];
  passed?: boolean;
  totalTestCases?: number;
  passedTestCases?: number;
}

export const interviewApi = {
  startOrResume: async (
    interviewType: 'DSA' | 'HR' = 'DSA',
    domainSlug?: string,
    applicationId?: string
  ): Promise<StartInterviewResponse> => {
    const response = await apiClient.post<{ success: boolean; data: StartInterviewResponse }>(
      '/api/interview/session/start',
      { interviewType, domainSlug, applicationId }
    );
    return response.data.data;
  },

  sendTurn: async (
    sessionId: string,
    utteranceOrPayload: string | { utterance: string; currentCode?: string; currentLanguage?: string },
    codeSnippet?: string
  ): Promise<TurnResponse> => {
    const payload =
      typeof utteranceOrPayload === 'string'
        ? { utterance: utteranceOrPayload, codeSnippet }
        : {
            utterance: utteranceOrPayload.utterance,
            codeSnippet: utteranceOrPayload.currentCode || codeSnippet,
          };

    const response = await apiClient.post<{ success: boolean; data: TurnResponse }>(
      `/api/interview/session/${sessionId}/turn`,
      payload
    );
    const data = response.data.data;
    if (data && !data.aiReply) {
      data.aiReply = data.replyText;
    }
    return data;
  },

  runCode: async (
    sessionId: string,
    sourceCodeOrPayload: string | { code: string; language: string },
    language: string = 'javascript'
  ): Promise<CodeExecutionResponse> => {
    const payload =
      typeof sourceCodeOrPayload === 'string'
        ? { sourceCode: sourceCodeOrPayload, language }
        : { sourceCode: sourceCodeOrPayload.code, language: sourceCodeOrPayload.language };

    const response = await apiClient.post<{ success: boolean; data: CodeExecutionResponse }>(
      `/api/interview/session/${sessionId}/run-code`,
      payload
    );
    const data = response.data.data;
    if (data) {
      data.testResults = data.results;
      data.passed = data.allPassed;
      data.totalTestCases = data.totalCount;
      data.passedTestCases = data.passedCount;
    }
    return data;
  },

  advanceQuestion: async (
    sessionId: string,
    codeOrPayload: string | { code?: string; language?: string } = '',
    language: string = 'javascript'
  ): Promise<AdvanceQuestionResponse> => {
    const payload =
      typeof codeOrPayload === 'string'
        ? { code: codeOrPayload, language }
        : { code: codeOrPayload.code || '', language: codeOrPayload.language || language };

    const response = await apiClient.post<{ success: boolean; data: AdvanceQuestionResponse }>(
      `/api/interview/session/${sessionId}/advance-question`,
      payload
    );
    const data = response.data.data;
    if (data && data.isFinished) {
      data.sessionComplete = true;
    }
    return data;
  },

  finishInterview: async (
    sessionId: string,
    finalCode?: string
  ): Promise<FinishInterviewResponse> => {
    const response = await apiClient.post<{ success: boolean; data: FinishInterviewResponse }>(
      `/api/interview/session/${sessionId}/finish`,
      { finalCode }
    );
    return response.data.data;
  },

  getSession: async (sessionId: string): Promise<StartInterviewResponse & { report?: EvaluationReportData }> => {
    const response = await apiClient.get<{ success: boolean; data: any }>(
      `/api/interview/session/${sessionId}`
    );
    return response.data.data;
  },
};
