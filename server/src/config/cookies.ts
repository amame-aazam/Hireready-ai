import { CookieOptions } from 'express';
import { env } from './env';

const isProduction = env.NODE_ENV === 'production';

export const ACCESS_TOKEN_COOKIE_NAME = 'hr_access_token';
export const REFRESH_TOKEN_COOKIE_NAME = 'hr_refresh_token';

// 15 minutes for access token
export const ACCESS_TOKEN_EXPIRY_MS = 15 * 60 * 1000;
// 7 days for refresh token
export const REFRESH_TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export const getAccessTokenCookieOptions = (): CookieOptions => {
  return {
    httpOnly: true,
    secure: isProduction ? true : Boolean(env.COOKIE_SECURE),
    sameSite: isProduction ? 'none' : 'lax',
    domain: env.COOKIE_DOMAIN || undefined,
    maxAge: ACCESS_TOKEN_EXPIRY_MS,
    path: '/',
  };
};

export const getRefreshTokenCookieOptions = (): CookieOptions => {
  return {
    httpOnly: true,
    secure: isProduction ? true : Boolean(env.COOKIE_SECURE),
    sameSite: isProduction ? 'none' : 'lax',
    domain: env.COOKIE_DOMAIN || undefined,
    maxAge: REFRESH_TOKEN_EXPIRY_MS,
    path: '/',
  };
};

export const getClearCookieOptions = (path: string = '/'): CookieOptions => {
  return {
    httpOnly: true,
    secure: isProduction ? true : Boolean(env.COOKIE_SECURE),
    sameSite: isProduction ? 'none' : 'lax',
    domain: env.COOKIE_DOMAIN || undefined,
    path,
  };
};
