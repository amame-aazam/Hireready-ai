export interface ResumeAnalysisInput {
  resumeText: string;
  targetDomain?: string;
}

export interface ResumeAnalysisOutput {
  score: number;
  scoreBreakdown: {
    keywordScore: number; // 0 - 30
    impactScore: number; // 0 - 30
    formattingScore: number; // 0 - 20
    skillsScore: number; // 0 - 20
  };
  atsStrengths: string[];
  atsWeaknesses: string[];
  missingKeywords: string[];
  suggestedImprovements: string[];
  extractedSkills: string[];
}

export interface InterviewTurnInput {
  sessionId: string;
  interviewType: 'DSA' | 'HR';
  dialogueHistory: Array<{ role: 'ai' | 'candidate'; content: string }>;
  latestCandidateUtterance?: string;
  codeSnippet?: string;
}

export interface InterviewTurnOutput {
  replyText: string;
  isTerminalTurn: boolean;
  suggestedFollowUp?: string;
  starProgress?: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  };
  turnEvaluation?: {
    clarity: number;
    technicalAccuracy: number;
  };
}

export interface InterviewEvaluationInput {
  sessionId: string;
  interviewType: 'DSA' | 'HR';
  turns: Array<{ role: 'ai' | 'candidate'; content: string }>;
  codeSubmissions?: string[];
}

export interface InterviewEvaluationOutput {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  starBreakdown?: {
    situationScore: number;
    taskScore: number;
    actionScore: number;
    resultScore: number;
    situationFeedback?: string;
    taskFeedback?: string;
    actionFeedback?: string;
    resultFeedback?: string;
  };
  keyObservations: string[];
  recommendation: 'STRONG_HIRE' | 'HIRE' | 'NEUTRAL' | 'NO_HIRE';
  detailedFeedback: {
    strengths: string[];
    weaknesses: string[];
    technicalAnalysis: string;
    communicationAnalysis: string;
  };
}

export interface AIProvider {
  name: string;
  analyzeResume(input: ResumeAnalysisInput): Promise<ResumeAnalysisOutput>;
  generateInterviewTurn(input: InterviewTurnInput): Promise<InterviewTurnOutput>;
  evaluateInterview(input: InterviewEvaluationInput): Promise<InterviewEvaluationOutput>;
}
