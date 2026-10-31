import { Role } from '@prisma/client';

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
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

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: UserResponse;
  tokens: AuthTokens;
}
