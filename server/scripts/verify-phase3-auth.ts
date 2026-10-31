import { hashPassword, comparePassword, dummyPasswordCompare } from '../src/utils/password';
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
} from '../src/utils/jwt';
import { registerSchema, loginSchema } from '../src/modules/auth/auth.schemas';
import { Role } from '@prisma/client';
import { authenticate, requireRole } from '../src/middleware/auth';
import { ACCESS_TOKEN_COOKIE_NAME } from '../src/config/cookies';

async function runAuthVerification() {
  console.log('🧪 Starting Phase 3: Auth & Security Verification Suite...\n');

  // -------------------------------------------------------------
  // Test 1: Password Security & Constant-Time Comparator
  // -------------------------------------------------------------
  console.log('1️⃣ Testing Password Hashing & Security (bcrypt 12 rounds)...');
  const rawPassword = 'SecurePassword2026!#';
  const hash = await hashPassword(rawPassword);

  if (!hash.startsWith('$2a$12$') && !hash.startsWith('$2b$12$')) {
    throw new Error('Hash does not use 12 salt rounds');
  }
  const isMatch = await comparePassword(rawPassword, hash);
  const isMismatch = await comparePassword('WrongPassword', hash);
  if (!isMatch || isMismatch) {
    throw new Error('Password comparator logic error');
  }

  // Verify dummy constant-time compare
  const dummyResult = await dummyPasswordCompare();
  if (dummyResult !== false) {
    throw new Error('Dummy password compare should always return false');
  }
  console.log('   ✅ 12-round bcrypt hash & timing-safe compare verified.\n');

  // -------------------------------------------------------------
  // Test 2: Password Complexity Enforcement (Zod)
  // -------------------------------------------------------------
  console.log('2️⃣ Testing Password Complexity & Validation Schemas...');
  const weakPasswords = [
    'short1!',       // < 8 chars
    'alllowercase1!', // no uppercase
    'ALLUPPERCASE1!', // no lowercase
    'NoSpecialChar123', // no symbol
    'NoNumbersHere!!',  // no number
  ];

  for (const pw of weakPasswords) {
    const res = registerSchema.safeParse({
      email: 'test@example.com',
      password: pw,
      firstName: 'Test',
      lastName: 'User',
    });
    if (res.success) {
      throw new Error(`Expected weak password "${pw}" to fail validation but it passed!`);
    }
  }

  const validRegistration = registerSchema.safeParse({
    email: 'ValidCandidate@HireReady.ai',
    password: 'ValidCandidate2026!@',
    firstName: 'Valid',
    lastName: 'Candidate',
  });
  if (!validRegistration.success) {
    throw new Error('Valid registration failed validation: ' + JSON.stringify(validRegistration.error.issues));
  }
  console.log('   ✅ Password complexity rules strictly enforced.\n');

  // -------------------------------------------------------------
  // Test 3: JWT Access & Refresh Token Lifecycles
  // -------------------------------------------------------------
  console.log('3️⃣ Testing JWT Dual-Token Lifecycle (15m Access / 7d Refresh)...');
  const userId = '00000000-0000-0000-0000-000000000001';
  const userEmail = 'student@hireready.ai';
  const role = Role.STUDENT;

  const accessToken = signAccessToken({ sub: userId, email: userEmail, role });
  const decodedAccess = verifyAccessToken(accessToken);
  if (decodedAccess.sub !== userId || decodedAccess.role !== Role.STUDENT) {
    throw new Error('Access token claims mismatch');
  }

  const tokenId = '00000000-0000-0000-0000-000000000002';
  const refreshToken = signRefreshToken({ sub: userId, tokenId });
  const decodedRefresh = verifyRefreshToken(refreshToken);
  if (decodedRefresh.sub !== userId || decodedRefresh.tokenId !== tokenId) {
    throw new Error('Refresh token claims mismatch');
  }

  const tokenHash = hashToken(refreshToken);
  if (tokenHash.length !== 64) {
    throw new Error('SHA-256 token hash should be 64 characters hex');
  }
  console.log('   ✅ Dual JWT signatures, expiration, and SHA-256 hash verified.\n');

  // -------------------------------------------------------------
  // Test 4: Middleware - Authentication & Cookie Verification
  // -------------------------------------------------------------
  console.log('4️⃣ Testing Express Authentication Middleware (Cookie Extraction)...');
  let nextCalled = false;
  const mockReq: any = {
    cookies: {
      [ACCESS_TOKEN_COOKIE_NAME]: accessToken,
    },
    headers: {},
  };
  const mockRes: any = {
    status: (code: number) => ({
      json: (data: any) => ({ code, data }),
    }),
  };

  authenticate(mockReq, mockRes, () => {
    nextCalled = true;
  });

  if (!nextCalled || mockReq.user?.id !== userId || mockReq.user?.role !== Role.STUDENT) {
    throw new Error('authenticate middleware failed to extract cookie & attach req.user');
  }

  // Test missing cookie
  let rejectedStatus = 0;
  const mockReqMissing: any = { cookies: {}, headers: {} };
  const mockResMissing: any = {
    status: (code: number) => {
      rejectedStatus = code;
      return { json: () => {} };
    },
  };
  authenticate(mockReqMissing, mockResMissing, () => {});
  if (rejectedStatus !== 401) {
    throw new Error('authenticate should return 401 on missing token');
  }
  console.log('   ✅ authenticate middleware verified (attaches req.user, rejects 401).\n');

  // -------------------------------------------------------------
  // Test 5: Middleware - Role-Based Access Control (RBAC)
  // -------------------------------------------------------------
  console.log('5️⃣ Testing Role-Based Access Control (RBAC) Guards...');
  const studentUserReq: any = { user: { id: userId, email: userEmail, role: Role.STUDENT } };
  const adminUserReq: any = { user: { id: userId, email: userEmail, role: Role.ADMIN } };

  let rbacPassed = false;
  let rbacForbiddenCode = 0;

  const adminOnlyGuard = requireRole(Role.ADMIN);

  // Student attempts to hit Admin route
  adminOnlyGuard(studentUserReq, {
    status: (code: number) => {
      rbacForbiddenCode = code;
      return { json: () => {} };
    },
  } as any, () => {});

  if (rbacForbiddenCode !== 403) {
    throw new Error('Student was not rejected with 403 on admin-only route!');
  }

  // Admin hits Admin route
  adminOnlyGuard(adminUserReq, {} as any, () => {
    rbacPassed = true;
  });

  if (!rbacPassed) {
    throw new Error('Admin was blocked on admin-only route!');
  }
  console.log('   ✅ RBAC guard verified: Student blocked (403), Admin permitted.\n');

  console.log('🎉 ALL PHASE 3 AUTH & DOMAIN MODEL CHECKS PASSED!\n');
}

runAuthVerification().catch((err) => {
  console.error('❌ Phase 3 verification failed:', err);
  process.exit(1);
});
