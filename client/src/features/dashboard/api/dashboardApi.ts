import { apiClient } from '../../../lib/axios';

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
    status: 'DRAFT' | 'RESUME_PARSED' | 'OA_PASSED' | 'DSA_PASSED' | 'HR_PASSED' | 'SELECTED' | 'WAITLISTED' | 'NOT_SELECTED';
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
    decidedAt: string | null;
  };
}

export const fetchStudentDashboard = async (): Promise<DashboardResponse> => {
  const response = await apiClient.get<{ success: boolean; data: DashboardResponse }>('/api/v1/dashboard/me');
  return response.data.data;
};
