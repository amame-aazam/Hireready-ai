import { PrismaClient } from '@prisma/client';
import { env } from './env';

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClient | undefined;
}

export const prisma =
  global.prismaGlobal ||
  new PrismaClient({
    log: env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (env.NODE_ENV !== 'production') {
  global.prismaGlobal = prisma;
}

export const checkPostgresHealth = async (): Promise<{ status: 'up' | 'down'; latencyMs: number; error?: string }> => {
  const start = Date.now();
  try {
    await prisma.$queryRaw`SELECT 1`;
    return {
      status: 'up',
      latencyMs: Date.now() - start,
    };
  } catch (error: any) {
    return {
      status: 'down',
      latencyMs: Date.now() - start,
      error: error?.message || 'Failed to ping PostgreSQL database',
    };
  }
};
