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
import assessmentRoutes from './modules/assessment/assessment.routes';
import interviewRoutes from './modules/interview/interview.routes';
import leaderboardRoutes from './modules/leaderboard/leaderboard.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import { adminRoutes } from './modules/admin/admin.routes';

const app: Application = express();

// Trust Render edge reverse proxy for SSL termination & HTTPS cookies
app.set('trust proxy', 1);

// Security HTTP headers
app.use(helmet());

// Dynamic CORS configuration for production split architecture
const allowedOrigins = [
  env.CLIENT_URL.replace(/\/$/, ''),
  'http://localhost:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server, health checks)
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/$/, '');
      if (
        allowedOrigins.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
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

// API Routes (Dual mounted on /api and /api/v1 for 100% client compatibility)
const apiPrefixes = ['/api', '/api/v1'];
for (const prefix of apiPrefixes) {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/domains`, domainRoutes);
  app.use(`${prefix}/resume`, resumeRoutes);
  app.use(`${prefix}/assessment`, assessmentRoutes);
  app.use(`${prefix}/interview`, interviewRoutes);
  app.use(`${prefix}/leaderboard`, leaderboardRoutes);
  app.use(`${prefix}/dashboard`, dashboardRoutes);
  app.use(`${prefix}/admin`, adminRoutes);
}

// Root API Welcome Endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'HireReady AI Backend API',
    version: '1.0.0',
    status: 'online',
    healthCheck: '/health',
    dbHealth: '/api/health/db',
    author: 'Amame Aazam',
  });
});

// Basic Health Check (fast ping for frontend cold-start detection)
const basicHealthHandler = (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
};
app.get('/health', basicHealthHandler);
app.get('/api/health', basicHealthHandler);
app.get('/api/v1/health', basicHealthHandler);

// Deep Database Health Check (probes Neon PostgreSQL & MongoDB Atlas in parallel)
const dbHealthHandler = async (_req: Request, res: Response) => {
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
};
app.get('/api/health/db', dbHealthHandler);
app.get('/api/v1/health/db', dbHealthHandler);

// Diagnostic check for AI provider and sandbox quota
const servicesHealthHandler = (_req: Request, res: Response) => {
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
};
app.get('/api/health/services', servicesHealthHandler);
app.get('/api/v1/health/services', servicesHealthHandler);

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
