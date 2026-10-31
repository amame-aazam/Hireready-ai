import mongoose from 'mongoose';
import { env } from './env';

export const connectMongo = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log('✅ MongoDB Atlas connected successfully');
    return conn;
  } catch (error: any) {
    console.error(`❌ MongoDB connection error: ${error?.message || error}`);
    throw error;
  }
};

mongoose.connection.on('error', (err) => {
  console.error('⚠️ MongoDB runtime error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected');
});

export const checkMongoHealth = async (): Promise<{ status: 'up' | 'down'; latencyMs: number; error?: string }> => {
  const start = Date.now();
  try {
    if (mongoose.connection.readyState !== 1) {
      return {
        status: 'down',
        latencyMs: Date.now() - start,
        error: `MongoDB not connected (readyState: ${mongoose.connection.readyState})`,
      };
    }

    if (!mongoose.connection.db) {
      throw new Error('Database handle is undefined');
    }

    await mongoose.connection.db.admin().ping();
    return {
      status: 'up',
      latencyMs: Date.now() - start,
    };
  } catch (error: any) {
    return {
      status: 'down',
      latencyMs: Date.now() - start,
      error: error?.message || 'Failed to ping MongoDB',
    };
  }
};

export const disconnectMongo = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('🔌 MongoDB connection closed');
  }
};
