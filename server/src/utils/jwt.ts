import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { Role } from '@prisma/client';

export interface AccessTokenPayload {
  sub: string; // User ID (UUID)
  email: string;
  role: Role;
}

export interface RefreshTokenPayload {
  sub: string; // User ID (UUID)
  tokenId: string; // Refresh token record ID (UUID)
}

/**
 * Signs a short-lived Access Token (15 minutes).
 */
export const signAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
    issuer: 'hireready-auth',
  });
};

/**
 * Signs a longer-lived Refresh Token (7 days).
 */
export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
    issuer: 'hireready-auth',
  });
};

/**
 * Verifies and decodes an Access Token. Throws error if invalid or expired.
 */
export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET, {
    issuer: 'hireready-auth',
  }) as AccessTokenPayload;
};

/**
 * Verifies and decodes a Refresh Token. Throws error if invalid or expired.
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET, {
    issuer: 'hireready-auth',
  }) as RefreshTokenPayload;
};

/**
 * Generates SHA-256 hash of a token string for secure database storage.
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};
