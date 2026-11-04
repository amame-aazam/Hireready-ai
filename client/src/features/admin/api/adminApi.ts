import { apiClient } from '../../../lib/axios';

export interface PlatformStats {
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

export interface CandidateItem {
  applicationId: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  targetDomain: string;
  status: string;
  compositeScore: number | null;
  isComplete: boolean;
  scores: {
    resume: number | null;
    oa: number | null;
    dsa: number | null;
    hr: number | null;
  };
  finalOutcomeAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CandidatesResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  candidates: CandidateItem[];
}

export interface CandidateReports {
  candidate: {
    applicationId: string;
    userId: string;
    fullName: string;
    email: string;
    targetDomain: string;
    status: string;
    compositeScore: number | null;
  };
  reports: {
    resume: {
      score: number;
      breakdown: {
        keywordScore: number;
        impactScore: number;
        formattingScore: number;
        skillsScore: number;
      };
      atsStrengths: string[];
      atsWeaknesses: string[];
      missingKeywords: string[];
      suggestedImprovements: string[];
      extractedSkills: string[];
      generatedAt: string;
    } | null;
    oa: {
      attemptId: string;
      assessmentTitle: string;
      status: string;
      mcqScore: number;
      codingScore: number;
      totalScore: number;
      passed: boolean;
      submittedAt: string | null;
      breakdown: any;
    } | null;
    dsa: {
      sessionId: string;
      status: string;
      overallScore: number | null;
      stage: string;
      problemTitle: string;
      problemPrompt: string;
      submittedCode: string | null;
      questionQueue: any;
      questionAnswers: any;
      completedAt: string | null;
      evaluation: {
        technicalScore: number;
        communicationScore: number;
        keyObservations: string[];
        recommendation: string;
        detailedFeedback: {
          strengths: string[];
          weaknesses: string[];
          technicalAnalysis: string;
          communicationAnalysis: string;
        };
      } | null;
      transcriptTurnsCount: number;
    } | null;
    hr: {
      sessionId: string;
      status: string;
      overallScore: number | null;
      completedAt: string | null;
      starBreakdown: {
        situationScore: number;
        taskScore: number;
        actionScore: number;
        resultScore: number;
        situationFeedback?: string;
        taskFeedback?: string;
        actionFeedback?: string;
        resultFeedback?: string;
      } | null;
      evaluation: {
        communicationScore: number;
        technicalScore: number;
        keyObservations: string[];
        recommendation: string;
        detailedFeedback: {
          strengths: string[];
          weaknesses: string[];
          technicalAnalysis: string;
          communicationAnalysis: string;
        };
      } | null;
      transcriptTurns: Array<{
        role: 'ai' | 'candidate';
        content: string;
        timestamp: string;
      }>;
    } | null;
  };
}

export interface AuditLogItem {
  id: string;
  adminId: string;
  targetType: string;
  targetId: string;
  previousVal: string | null;
  newVal: string;
  reason: string;
  createdAt: string;
  admin: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface AssessmentItem {
  id: string;
  title: string;
  description: string;
  domain: string;
  domainId: string;
  durationMinutes: number;
  passingScore: number;
  isActive: boolean;
  totalQuestions: number;
  mcqCount: number;
  codingCount: number;
  totalAttempts: number;
  passedCount: number;
  passRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface UnmaskedLeaderboardEntry {
  rank: number;
  applicationId: string;
  userId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  targetDomain: string;
  compositeScore: number;
  percentile: number;
  status: string;
  scores: {
    resume: number | null;
    oa: number | null;
    dsa: number | null;
    hr: number | null;
  };
  finalOutcomeAt: string | null;
  createdAt: string;
}

export interface UnmaskedLeaderboardResponse {
  totalCandidates: number;
  page: number;
  limit: number;
  totalPages: number;
  rankings: UnmaskedLeaderboardEntry[];
}

export const adminApi = {
  getPlatformStats: async (): Promise<PlatformStats> => {
    const res = await apiClient.get<{ success: boolean; data: PlatformStats }>('/api/v1/admin/stats');
    return res.data.data;
  },

  getCandidates: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    domain?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<CandidatesResponse> => {
    const res = await apiClient.get<{ success: boolean; data: CandidatesResponse }>('/api/v1/admin/candidates', {
      params,
    });
    return res.data.data;
  },

  getCandidateReports: async (applicationId: string): Promise<CandidateReports> => {
    const res = await apiClient.get<{ success: boolean; data: CandidateReports }>(
      `/api/v1/admin/candidates/${applicationId}/reports`
    );
    return res.data.data;
  },

  overrideCandidateStatus: async (
    applicationId: string,
    status: string,
    reason: string
  ): Promise<{ application: any; auditLog: AuditLogItem }> => {
    const res = await apiClient.post<{ success: boolean; data: { application: any; auditLog: AuditLogItem } }>(
      `/api/v1/admin/candidates/${applicationId}/override-status`,
      { status, reason }
    );
    return res.data.data;
  },

  getCandidateAuditLogs: async (applicationId: string): Promise<AuditLogItem[]> => {
    const res = await apiClient.get<{ success: boolean; data: AuditLogItem[] }>(
      `/api/v1/admin/candidates/${applicationId}/audit-logs`
    );
    return res.data.data;
  },

  getAssessments: async (): Promise<AssessmentItem[]> => {
    const res = await apiClient.get<{ success: boolean; data: AssessmentItem[] }>('/api/v1/admin/assessments');
    return res.data.data;
  },

  createAssessment: async (data: {
    title: string;
    description: string;
    domainId?: string;
    durationMinutes?: number;
    passingScore?: number;
    isActive?: boolean;
  }): Promise<any> => {
    const res = await apiClient.post<{ success: boolean; data: any }>('/api/v1/admin/assessments', data);
    return res.data.data;
  },

  toggleAssessmentStatus: async (assessmentId: string, isActive: boolean): Promise<any> => {
    const res = await apiClient.patch<{ success: boolean; data: any }>(
      `/api/v1/admin/assessments/${assessmentId}/status`,
      { isActive }
    );
    return res.data.data;
  },

  getUnmaskedLeaderboard: async (domain?: string, page: number = 1, limit: number = 50): Promise<UnmaskedLeaderboardResponse> => {
    const params: Record<string, any> = { page, limit };
    if (domain && domain !== 'All') {
      params.domain = domain;
    }
    const res = await apiClient.get<{ success: boolean; data: UnmaskedLeaderboardResponse }>('/api/v1/admin/leaderboard', {
      params,
    });
    return res.data.data;
  },
};
