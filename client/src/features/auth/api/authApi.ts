import { apiClient } from '../../../lib/axios';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'ADMIN';
  createdAt: string;
  profile?: {
    id: string;
    headline: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    preferredTech: string[];
    yearsExperience: number;
    domain: {
      id: string;
      slug: string;
      title: string;
      icon: string | null;
    } | null;
  } | null;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  domainId?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  headline?: string;
  domainId?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  preferredTech?: string[];
  yearsExperience?: number;
}

export const authApi = {
  async register(payload: RegisterPayload): Promise<User> {
    const response = await apiClient.post<{ success: boolean; data: { user: User } }>(
      '/api/auth/register',
      payload
    );
    return response.data.data.user;
  },

  async login(payload: LoginPayload): Promise<User> {
    const response = await apiClient.post<{ success: boolean; data: { user: User } }>(
      '/api/auth/login',
      payload
    );
    return response.data.data.user;
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<{ success: boolean; data: { user: User } }>(
      '/api/auth/me'
    );
    return response.data.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const response = await apiClient.patch<{ success: boolean; data: { user: User } }>(
      '/api/auth/profile',
      payload
    );
    return response.data.data.user;
  },
};
