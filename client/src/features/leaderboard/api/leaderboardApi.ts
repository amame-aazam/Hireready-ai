import { apiClient } from '../../../lib/axios';

export interface LeaderboardEntry {
  rank: number;
  candidateId: string;
  displayName: string;
  targetDomain: string;
  compositeScore: number;
  percentile: number;
  status: string;
  breakdown: {
    resume: number | null;
    oa: number | null;
    dsa: number | null;
    hr: number | null;
  };
  finalOutcomeAt: string | null;
}

export interface LeaderboardResponse {
  totalCandidates: number;
  page: number;
  limit: number;
  rankings: LeaderboardEntry[];
}

export const fetchLeaderboard = async (
  domain?: string,
  page: number = 1,
  limit: number = 20
): Promise<LeaderboardResponse> => {
  const params: Record<string, any> = { page, limit };
  if (domain && domain !== 'All') {
    params.domain = domain;
  }
  const response = await apiClient.get<{ success: boolean; data: LeaderboardResponse }>('/api/v1/leaderboard', {
    params,
  });
  return response.data.data;
};
