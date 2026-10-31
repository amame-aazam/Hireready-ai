import { env } from '../src/config/env';
import { getAIProvider, MockAIProvider } from '../src/providers/ai';
import { judge0QuotaTracker, judge0Client } from '../src/providers/judge0';
import { sanitizeResumeText, isValidUUID } from '../src/utils/sanitizer';

async function runVerification() {
  console.log('🧪 Starting Phase 2 Setup Verification...\n');

  // 1. Environment validation
  console.log('1️⃣ Checking Environment Configuration...');
  console.log(`   - Environment: ${env.NODE_ENV}`);
  console.log(`   - Active AI Provider: ${env.AI_PROVIDER}`);
  console.log(`   - Client Origin URL: ${env.CLIENT_URL}`);
  console.log(`   - Judge0 Mock Mode: ${env.JUDGE0_MOCK}`);
  console.log('   ✅ Environment parsed and validated successfully.\n');

  // 2. AI Provider verification (Mock)
  console.log('2️⃣ Verifying Mock AI Provider Interface Implementation...');
  const ai = getAIProvider();
  console.log(`   - Instantiated: ${ai.name}`);

  const resumeResult = await ai.analyzeResume({
    resumeText: 'Experienced Software Engineer with proficiency in React, TypeScript, Node.js, and SQL.',
    targetDomain: 'Full Stack Engineering',
  });
  if (typeof resumeResult.score !== 'number' || !Array.isArray(resumeResult.atsStrengths)) {
    throw new Error('Resume analysis output shape mismatch');
  }
  console.log(`   ✅ analyzeResume() returned score: ${resumeResult.score}`);

  const dsaTurnResult = await ai.generateInterviewTurn({
    sessionId: '00000000-0000-0000-0000-000000000001',
    interviewType: 'DSA',
    dialogueHistory: [],
  });
  if (!dsaTurnResult.replyText || typeof dsaTurnResult.isTerminalTurn !== 'boolean') {
    throw new Error('Interview turn output shape mismatch');
  }
  console.log(`   ✅ generateInterviewTurn() returned AI prompt: "${dsaTurnResult.replyText.substring(0, 50)}..."`);

  const evalResult = await ai.evaluateInterview({
    sessionId: '00000000-0000-0000-0000-000000000001',
    interviewType: 'DSA',
    turns: [
      { role: 'ai', content: 'What is the time complexity of two-sum using a hash map?' },
      { role: 'candidate', content: 'It is O(n) linear time with O(n) space.' },
    ],
  });
  if (!evalResult.recommendation || typeof evalResult.overallScore !== 'number') {
    throw new Error('Evaluation report shape mismatch');
  }
  console.log(`   ✅ evaluateInterview() returned recommendation: ${evalResult.recommendation} (Score: ${evalResult.overallScore})\n`);

  // 3. Security Sanitizer verification
  console.log('3️⃣ Verifying Untrusted Input Sanitization...');
  const dirtyInput = 'Normal text\x00with null\x08bytes   and    extra   spaces.\n\n\n\nMultiple lines.';
  const { sanitized } = sanitizeResumeText(dirtyInput);
  if (sanitized.includes('\x00') || sanitized.includes('\x08')) {
    throw new Error('Sanitizer failed to strip null/control bytes');
  }
  console.log('   ✅ Control and null bytes stripped cleanly.');

  const sampleUUID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  if (!isValidUUID(sampleUUID) || isValidUUID('invalid-uuid-123')) {
    throw new Error('UUID validator failed');
  }
  console.log('   ✅ UUID validation verified.\n');

  // 4. Judge0 Quota and Sandbox stub verification
  console.log('4️⃣ Verifying Judge0 Sandbox Quota & Client Stub...');
  const initialQuota = judge0QuotaTracker.getRemainingDailyQuota();
  console.log(`   - Available daily sandbox executions: ${initialQuota}`);

  const execResult = await judge0Client.executeCode({
    sourceCode: 'console.log("Hello HireReady");',
    languageId: 63,
  });
  if (execResult.status !== 'ACCEPTED') {
    throw new Error(`Expected ACCEPTED but got ${execResult.status}`);
  }
  console.log(`   ✅ Code execution stub returned status: ${execResult.status} (Mock sandbox)\n`);

  console.log('🎉 ALL PHASE 2 VERIFICATION CHECKS PASSED!\n');
}

runVerification().catch((err) => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
