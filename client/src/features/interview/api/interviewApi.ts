import { apiClient } from '../../../lib/axios';
import { TestCaseResult } from '../../assessment/api/assessmentApi';

export interface InterviewTurn {
  role: 'ai' | 'candidate';
  content: string;
  timestamp: string;
  codeSnippet?: string;
}

export type InterviewStage = 'APPROACH' | 'CODING' | 'SUBMITTED' | 'COMPLETED';

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

export interface ProblemData {
  index: number;
  total: number;
  id: string;
  title: string;
  difficulty: 'EASY' | 'MEDIUM';
  domain?: string;
  prompt: string;
  timeComplexityTarget?: string;
  spaceComplexityTarget?: string;
  starterCode:
    | {
        javascript: string;
        python: string;
        java: string;
        cpp: string;
      }
    | string;
  visibleTestCases: Array<{
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
  difficulty: 'EASY' | 'MEDIUM';
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
  stage?: InterviewStage;
  isEditorUnlocked?: boolean;
  isTerminalTurn: boolean;
  suggestedFollowUp?: string;
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
  session?: InterviewSessionData;
  currentQuestion?: ProblemData;
  starterCode?: string;
  isEditorUnlocked: boolean;
  aiTransitionTurn?: InterviewTurn;
  report?: EvaluationReportData;
}

export interface CodeExecutionResponse {
  passedCount: number;
  totalCount: number;
  scoreRatio: number;
  allPassed: boolean;
  results: TestCaseResult[];
}

export const interviewApi = {
  startOrResume: async (
    interviewType: 'DSA' | 'HR' = 'DSA',
    domainSlug?: string
  ): Promise<StartInterviewResponse> => {
    const response = await apiClient.post<{ success: boolean; data: StartInterviewResponse }>(
      '/api/interview/session/start',
      { interviewType, domainSlug }
    );
    return response.data.data;
  },

  sendTurn: async (
    sessionId: string,
    utterance: string,
    codeSnippet?: string
  ): Promise<TurnResponse> => {
    const response = await apiClient.post<{ success: boolean; data: TurnResponse }>(
      `/api/interview/session/${sessionId}/turn`,
      { utterance, codeSnippet }
    );
    return response.data.data;
  },

  runCode: async (
    sessionId: string,
    sourceCode: string,
    language: string = 'javascript'
  ): Promise<CodeExecutionResponse> => {
    const response = await apiClient.post<{ success: boolean; data: CodeExecutionResponse }>(
      `/api/interview/session/${sessionId}/run-code`,
      { sourceCode, language }
    );
    return response.data.data;
  },

  advanceQuestion: async (
    sessionId: string,
    code: string,
    language: string = 'javascript'
  ): Promise<AdvanceQuestionResponse> => {
    const response = await apiClient.post<{ success: boolean; data: AdvanceQuestionResponse }>(
      `/api/interview/session/${sessionId}/advance-question`,
      { code, language }
    );
    return response.data.data;
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
