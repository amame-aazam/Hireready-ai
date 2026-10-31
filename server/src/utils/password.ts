import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

// Constant dummy hash used for timing-safe comparison when user is not found
const DUMMY_HASH = '$2a$12$K1r6K/4f6h6Fv1w3x7g6nOq8b1j4k5l6m7n8o9p0q1r2s3t4u5v6w';

/**
 * Hashes a plaintext password with bcrypt using 12 salt rounds.
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compares plaintext password against stored bcrypt hash using timing-safe comparison.
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Performs a dummy bcrypt comparison to eliminate timing discrepancies when a requested user email does not exist.
 */
export const dummyPasswordCompare = async (): Promise<boolean> => {
  return bcrypt.compare('dummyPasswordTimingSafeCheck', DUMMY_HASH);
};
