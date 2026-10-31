import { apiClient } from '../../../lib/axios';

export interface ScoreBreakdown {
  keywordScore: number;
  impactScore: number;
  formattingScore: number;
  skillsScore: number;
}

export interface AtsAnalysis {
  id: string;
  targetDomain: string;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  atsStrengths: string[];
  atsWeaknesses: string[];
  missingKeywords: string[];
  suggestedImprovements: string[];
  extractedSkills: string[];
  createdAt: string;
}

export interface DomainItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string | null;
}

export const resumeApi = {
  async uploadAndAnalyze(file: File, domainId?: string, applicationId?: string): Promise<AtsAnalysis> {
    const formData = new FormData();
    formData.append('resume', file);
    if (domainId) formData.append('domainId', domainId);
    if (applicationId) formData.append('applicationId', applicationId);

    const response = await apiClient.post<{ success: boolean; data: { analysis: AtsAnalysis } }>(
      '/api/resume/analyze',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data.analysis;
  },

  async getLatestAnalysis(): Promise<AtsAnalysis | null> {
    const response = await apiClient.get<{ success: boolean; data: { analysis: AtsAnalysis | null } }>(
      '/api/resume/latest'
    );
    return response.data.data.analysis;
  },

  async getAnalysisById(id: string): Promise<AtsAnalysis> {
    const response = await apiClient.get<{ success: boolean; data: { analysis: AtsAnalysis } }>(
      `/api/resume/${id}`
    );
    return response.data.data.analysis;
  },

  async listDomains(): Promise<DomainItem[]> {
    const response = await apiClient.get<{ success: boolean; data: { domains: DomainItem[] } }>(
      '/api/domains'
    );
    return response.data.data.domains;
  },
};
