import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  getClearCookieOptions,
} from '../../config/cookies';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);

      // Set HttpOnly Cookies
      res.cookie(
        ACCESS_TOKEN_COOKIE_NAME,
        result.tokens.accessToken,
        getAccessTokenCookieOptions()
      );
      res.cookie(
        REFRESH_TOKEN_COOKIE_NAME,
        result.tokens.refreshToken,
        getRefreshTokenCookieOptions()
      );

      return res.status(201).json({
        success: true,
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);

      // Set HttpOnly Cookies
      res.cookie(
        ACCESS_TOKEN_COOKIE_NAME,
        result.tokens.accessToken,
        getAccessTokenCookieOptions()
      );
      res.cookie(
        REFRESH_TOKEN_COOKIE_NAME,
        result.tokens.refreshToken,
        getRefreshTokenCookieOptions()
      );

      return res.status(200).json({
        success: true,
        data: {
          user: result.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const rawRefreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
      const newTokens = await authService.refresh(rawRefreshToken);

      res.cookie(
        ACCESS_TOKEN_COOKIE_NAME,
        newTokens.accessToken,
        getAccessTokenCookieOptions()
      );
      res.cookie(
        REFRESH_TOKEN_COOKIE_NAME,
        newTokens.refreshToken,
        getRefreshTokenCookieOptions()
      );

      return res.status(200).json({
        success: true,
        message: 'Tokens refreshed successfully',
      });
    } catch (error) {
      // Clear cookies if refresh failed
      res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, getClearCookieOptions('/'));
      res.clearCookie(
        REFRESH_TOKEN_COOKIE_NAME,
        getClearCookieOptions('/api/auth/refresh')
      );
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const rawRefreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME];
      await authService.logout(rawRefreshToken);

      // Clear both cookies
      res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, getClearCookieOptions('/'));
      res.clearCookie(
        REFRESH_TOKEN_COOKIE_NAME,
        getClearCookieOptions('/api/auth/refresh')
      );

      return res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.getMe(req.user!.id);
      return res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedUser = await authService.updateProfile(req.user!.id, req.body);
      return res.status(200).json({
        success: true,
        data: { user: updatedUser },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
