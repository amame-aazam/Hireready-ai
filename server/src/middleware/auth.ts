import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { verifyAccessToken } from '../utils/jwt';
import { ACCESS_TOKEN_COOKIE_NAME } from '../config/cookies';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Check HttpOnly cookie first
  let token = req.cookies?.[ACCESS_TOKEN_COOKIE_NAME];

  // Optional fallback for Bearer token (useful for automated testing)
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED_MISSING_TOKEN',
        message: 'Authentication token is missing. Please sign in.',
      },
    });
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error: any) {
    const isExpired = error.name === 'TokenExpiredError';
    return res.status(401).json({
      success: false,
      error: {
        code: isExpired ? 'ACCESS_TOKEN_EXPIRED' : 'INVALID_ACCESS_TOKEN',
        message: isExpired
          ? 'Access token has expired. Silent refresh required.'
          : 'Invalid authentication credentials.',
      },
    });
  }
};

export const requireRole = (...roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'User authentication required.',
        },
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN_INSUFFICIENT_PERMISSIONS',
          message: `Access denied. Requires one of the following roles: ${roles.join(', ')}`,
        },
      });
    }

    next();
  };
};
