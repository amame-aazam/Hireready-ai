import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export interface AppErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response<AppErrorResponse>,
  _next: NextFunction
) => {
  console.error('Unhandled Application Error:', err);

  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload or parameters',
        details: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
      },
    });
  }

  // Handle Custom / Standard Errors
  const statusCode = typeof err.statusCode === 'number' ? err.statusCode : 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const errorMessage = err.message || 'An unexpected error occurred';

  return res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: errorMessage,
    },
  });
};
