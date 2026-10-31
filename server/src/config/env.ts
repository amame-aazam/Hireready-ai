import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().default('http://localhost:5173'),

  // PostgreSQL (Neon) URLs
  POSTGRES_PRISMA_URL: z.string().min(1, 'POSTGRES_PRISMA_URL is required'),
  POSTGRES_URL_NON_POOLING: z.string().min(1, 'POSTGRES_URL_NON_POOLING is required'),

  // MongoDB Atlas URI
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  // JWT & Authentication
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 characters').default('super_secret_access_jwt_key_hireready_dev'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 characters').default('super_secret_refresh_jwt_key_hireready_dev'),
  COOKIE_DOMAIN: z.string().optional(),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((val) => val === 'true'),

  // AI Provider
  AI_PROVIDER: z.enum(['mock', 'deepseek']).default('mock'),
  DEEPSEEK_API_KEY: z.string().optional().default(''),
  DEEPSEEK_BASE_URL: z.string().url().default('https://api.deepseek.com'),

  // Judge0 Sandbox
  JUDGE0_MOCK: z
    .string()
    .default('true')
    .transform((val) => val === 'true'),
  JUDGE0_API_KEY: z.string().optional().default(''),
  JUDGE0_API_HOST: z.string().default('judge0-ce.p.rapidapi.com'),
});

const parseEnv = () => {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid or missing environment configuration:');
    parsed.error.issues.forEach((issue) => {
      console.error(`   - ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }

  // Strict check if AI_PROVIDER is deepseek
  if (parsed.data.AI_PROVIDER === 'deepseek' && !parsed.data.DEEPSEEK_API_KEY) {
    console.warn('⚠️ Warning: AI_PROVIDER is set to "deepseek" but DEEPSEEK_API_KEY is empty.');
  }

  return parsed.data;
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;
