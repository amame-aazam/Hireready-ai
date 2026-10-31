import app from './app';
import { env } from './config/env';
import { connectMongo, disconnectMongo } from './config/mongo';
import { prisma } from './config/postgres';

const startServer = async () => {
  console.log(`🚀 Starting HireReady AI Backend in [${env.NODE_ENV}] mode...`);

  // Attempt database connections
  try {
    await connectMongo();
  } catch (err: any) {
    console.warn('⚠️ Warning: MongoDB Atlas did not connect immediately:', err.message);
    console.warn('   Ensure MONGODB_URI in .env is configured with your Atlas credentials.');
  }

  try {
    await prisma.$connect();
    console.log('✅ PostgreSQL (Neon) connected via Prisma');
  } catch (err: any) {
    console.warn('⚠️ Warning: PostgreSQL (Neon) did not connect immediately:', err.message);
    console.warn('   Ensure POSTGRES_PRISMA_URL in .env is configured with your Neon credentials.');
  }

  const server = app.listen(env.PORT, () => {
    console.log(`🌐 HireReady Server listening on http://localhost:${env.PORT}`);
    console.log(`🩺 Health check available at: http://localhost:${env.PORT}/health`);
    console.log(`📊 DB Health available at: http://localhost:${env.PORT}/api/health/db`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
    server.close(async () => {
      console.log('🔒 HTTP server closed');
      try {
        await prisma.$disconnect();
        console.log('🔌 PostgreSQL connection closed');
        await disconnectMongo();
      } catch (err) {
        console.error('Error during database disconnection:', err);
      }
      process.exit(0);
    });

    // Force shutdown after 10s timeout
    setTimeout(() => {
      console.error('⚠️ Forcefully terminating after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((error) => {
  console.error('❌ Fatal error during server startup:', error);
  process.exit(1);
});
