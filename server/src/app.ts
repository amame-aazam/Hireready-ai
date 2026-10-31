import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { checkPostgresHealth } from './config/postgres';
import { checkMongoHealth } from './config/mongo';
import { getAIProvider } from './providers/ai';
import { judge0QuotaTracker } from './providers/judge0';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import domainRoutes from './modules/domain/domain.routes';
import resumeRoutes from './modules/resume/resume.routes';

const app: Application = express();

// Security HTTP headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [env.CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);

// Payload size limit
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Cookie parsing
app.use(cookieParser());

// Logging
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/domains', domainRoutes);
app.use('/api/resume', resumeRoutes);

// Basic Health Check (fast ping for frontend cold-start detection)
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// Deep Database Health Check (probes Neon PostgreSQL & MongoDB Atlas in parallel)
app.get('/api/health/db', async (_req: Request, res: Response) => {
  const [pgHealth, mongoHealth] = await Promise.all([
    checkPostgresHealth(),
    checkMongoHealth(),
  ]);

  const allHealthy = pgHealth.status === 'up' && mongoHealth.status === 'up';

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    databases: {
      postgres: pgHealth,
      mongodb: mongoHealth,
    },
  });
});

// Diagnostic check for AI provider and sandbox quota
app.get('/api/health/services', (_req: Request, res: Response) => {
  const aiProvider = getAIProvider();

  res.status(200).json({
    aiProvider: {
      name: aiProvider.name,
      mode: env.AI_PROVIDER,
    },
    judge0Sandbox: {
      isMock: env.JUDGE0_MOCK,
      remainingDailyQuota: judge0QuotaTracker.getRemainingDailyQuota(),
    },
  });
});

// 404 Route Handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: 'The requested resource does not exist',
    },
  });
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
