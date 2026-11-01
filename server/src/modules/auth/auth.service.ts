import crypto from 'crypto';
import { prisma } from '../../config/postgres';
import { hashPassword, comparePassword, dummyPasswordCompare } from '../../utils/password';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../../utils/jwt';
import { RegisterInput, LoginInput, UpdateProfileInput } from './auth.schemas';
import { AuthResult, UserResponse, AuthTokens } from './auth.types';
import { REFRESH_TOKEN_EXPIRY_MS } from '../../config/cookies';

export class AuthService {
  private formatUser(user: any): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      profile: user.studentProfile
        ? {
            id: user.studentProfile.id,
            headline: user.studentProfile.headline,
            githubUrl: user.studentProfile.githubUrl,
            linkedinUrl: user.studentProfile.linkedinUrl,
            preferredTech: user.studentProfile.preferredTech,
            yearsExperience: user.studentProfile.yearsExperience,
            domain: user.studentProfile.domain
              ? {
                  id: user.studentProfile.domain.id,
                  slug: user.studentProfile.domain.slug,
                  title: user.studentProfile.domain.title,
                  icon: user.studentProfile.domain.icon,
                }
              : null,
          }
        : null,
    };
  }

  private async generateTokenPair(userId: string, email: string, role: any): Promise<AuthTokens> {
    const tokenId = crypto.randomUUID();
    const accessToken = signAccessToken({ sub: userId, email, role });
    const refreshToken = signRefreshToken({ sub: userId, tokenId });

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
    const tokenHash = hashToken(refreshToken);

    await prisma.refreshToken.create({
      data: {
        id: tokenId,
        userId,
        tokenHash,
        expiresAt,
      },
    });

    return { accessToken, refreshToken };
  }

  async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      const error: any = new Error('An account with this email address already exists');
      error.statusCode = 409;
      error.code = 'EMAIL_ALREADY_EXISTS';
      throw error;
    }

    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        firstName: input.firstName,
        lastName: input.lastName,
        studentProfile: {
          create: {
            domainId: input.domainId || null,
          },
        },
      },
      include: {
        studentProfile: {
          include: { domain: true },
        },
      },
    });

    const tokens = await this.generateTokenPair(user.id, user.email, user.role);

    return {
      user: this.formatUser(user),
      tokens,
    };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await prisma.user.findUnique({
      where: { email: input.email },
      include: {
        studentProfile: {
          include: { domain: true },
        },
      },
    });

    if (!user) {
      // Execute timing-safe dummy compare to mitigate user enumeration
      await dummyPasswordCompare();
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const isMatch = await comparePassword(input.password, user.passwordHash);
    if (!isMatch) {
      const error: any = new Error('Invalid email or password');
      error.statusCode = 401;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const tokens = await this.generateTokenPair(user.id, user.email, user.role);

    return {
      user: this.formatUser(user),
      tokens,
    };
  }

  async refresh(rawRefreshToken?: string): Promise<AuthTokens | null> {
    if (!rawRefreshToken) {
      return null;
    }

    let decoded: any;
    try {
      decoded = verifyRefreshToken(rawRefreshToken);
    } catch (err: any) {
      const error: any = new Error('Invalid or expired refresh token');
      error.statusCode = 401;
      error.code = 'INVALID_REFRESH_TOKEN';
      throw error;
    }

    const tokenHash = hashToken(rawRefreshToken);
    const storedToken = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    // Reuse Detection / Token Theft Protection
    if (!storedToken || storedToken.revoked) {
      console.warn(`🚨 Security Alert: Token reuse detected for user ${decoded.sub}. Revoking all sessions.`);
      await prisma.refreshToken.updateMany({
        where: { userId: decoded.sub },
        data: { revoked: true },
      });

      const error: any = new Error('Token reuse detected. All sessions revoked for security.');
      error.statusCode = 403;
      error.code = 'REVOKED_TOKEN_REUSE';
      throw error;
    }

    // Check expiration
    if (storedToken.expiresAt < new Date()) {
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      });

      const error: any = new Error('Refresh token expired. Please sign in again.');
      error.statusCode = 401;
      error.code = 'REFRESH_TOKEN_EXPIRED';
      throw error;
    }

    // Rotate token: revoke old token and create new pair
    const nextTokenId = crypto.randomUUID();
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: {
        revoked: true,
        replacedByToken: nextTokenId,
      },
    });

    const accessToken = signAccessToken({
      sub: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    const newRefreshToken = signRefreshToken({
      sub: storedToken.user.id,
      tokenId: nextTokenId,
    });

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);
    const newTokenHash = hashToken(newRefreshToken);

    await prisma.refreshToken.create({
      data: {
        id: nextTokenId,
        userId: storedToken.userId,
        tokenHash: newTokenHash,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(rawRefreshToken?: string): Promise<void> {
    if (!rawRefreshToken) return;

    try {
      const tokenHash = hashToken(rawRefreshToken);
      await prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { revoked: true },
      });
    } catch {
      // Graceful fail on invalid hash
    }
  }

  async getMe(userId: string): Promise<UserResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: {
          include: { domain: true },
        },
      },
    });

    if (!user) {
      const error: any = new Error('User account not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    return this.formatUser(user);
  }

  async updateProfile(userId: string, input: UpdateProfileInput): Promise<UserResponse> {
    await prisma.studentProfile.upsert({
      where: { userId },
      update: {
        headline: input.headline,
        domainId: input.domainId,
        githubUrl: input.githubUrl,
        linkedinUrl: input.linkedinUrl,
        preferredTech: input.preferredTech,
        yearsExperience: input.yearsExperience,
      },
      create: {
        userId,
        headline: input.headline,
        domainId: input.domainId,
        githubUrl: input.githubUrl,
        linkedinUrl: input.linkedinUrl,
        preferredTech: input.preferredTech || [],
        yearsExperience: input.yearsExperience || 0,
      },
    });

    return this.getMe(userId);
  }
}

export const authService = new AuthService();
