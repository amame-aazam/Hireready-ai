import { apiClient } from '../../../lib/axios';

export interface VisibleTestCase {
  id: string;
  input: string;
  expectedOutput: string;
  description?: string;
}

export interface QuestionData {
  id: string;
  type: 'MCQ' | 'CODING';
  title: string;
  prompt: string;
  points: number;
  orderIndex: number;
  options?: string[];
  starterCode?: Record<string, string>;
  visibleTestCases?: VisibleTestCase[];
}

export interface AssessmentOverview {
  id: string;
  domainId: string;
  domainSlug: string;
  domainTitle: string;
  title: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  totalQuestions: number;
}

export interface AttemptAnswers {
  mcq: Record<string, number>;
  code: Record<string, { code: string; language: string }>;
}

export interface AttemptData {
  id: string;
  assessmentId: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'EXPIRED';
  startedAt: string;
  expiresAt: string;
  remainingSeconds: number;
  answers: AttemptAnswers;
}

export interface StartAssessmentResponse {
  attempt: AttemptData;
  assessment: {
    id: string;
    title: string;
    description: string;
    durationMinutes: number;
    passingScore: number;
    questions: QuestionData[];
  };
}

export interface TestCaseResult {
  testCaseId: string;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  executionTimeMs: number;
  memoryKb: number;
  stdout?: string;
  stderr?: string;
  error?: string;
}

export interface RunCodeResponse {
  passedCount: number;
  totalCount: number;
  scoreRatio: number;
  allPassed: boolean;
  results: TestCaseResult[];
}

export interface FinalSubmissionResult {
  id: string;
  status: string;
  totalScore: number;
  mcqScore: number;
  codingScore: number;
  passed: boolean;
  submittedAt: string;
  breakdown: any;
  isIdempotentReplay: boolean;
}

export const assessmentApi = {
  getOverview: async (domainId: string): Promise<AssessmentOverview> => {
    const response = await apiClient.get<{ success: boolean; data: AssessmentOverview }>(
      `/api/assessment/overview/${domainId}`
    );
    return response.data.data;
  },

  startOrResume: async (assessmentId: string): Promise<StartAssessmentResponse> => {
    const response = await apiClient.post<{ success: boolean; data: StartAssessmentResponse }>(
      `/api/assessment/${assessmentId}/start`
    );
    return response.data.data;
  },

  autosave: async (
    attemptId: string,
    answers: AttemptAnswers
  ): Promise<{ success: boolean; savedAt: string; remainingSeconds: number }> => {
    const response = await apiClient.patch<{
      success: boolean;
      data: { success: boolean; savedAt: string; remainingSeconds: number };
    }>(`/api/assessment/attempt/${attemptId}/autosave`, { answers });
    return response.data.data;
  },

  runCode: async (
    attemptId: string,
    questionId: string,
    sourceCode: string,
    language: string
  ): Promise<RunCodeResponse> => {
    const response = await apiClient.post<{ success: boolean; data: RunCodeResponse }>(
      `/api/assessment/attempt/${attemptId}/run-code`,
      { questionId, sourceCode, language }
    );
    return response.data.data;
  },

  submit: async (attemptId: string): Promise<FinalSubmissionResult> => {
    const response = await apiClient.post<{ success: boolean; data: FinalSubmissionResult }>(
      `/api/assessment/attempt/${attemptId}/submit`
    );
    return response.data.data;
  },
};
