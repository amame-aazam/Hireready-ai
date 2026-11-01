import { AssessmentState } from '@prisma/client';
import { prisma } from '../src/config/postgres';
import { AssessmentService } from '../src/modules/assessment/assessment.service';
import { MockCodeExecutor } from '../src/providers/judge0/mockExecutor';

async function runVerification() {
  console.log('🚀 Starting Phase 5: Online Assessment (OA) Verification Suite...\n');

  // 1. Setup Test User
  console.log('1️⃣ Setting up test candidate...');
  const testEmail = `oa_candidate_${Date.now()}@hireready.test`;
  const candidate = await prisma.user.create({
    data: {
      email: testEmail,
      passwordHash: 'dummy_hash',
      firstName: 'Alice',
      lastName: 'Turing',
    },
  });
  console.log(`   ✅ Test candidate created: ${candidate.email} (${candidate.id})\n`);

  // 2. Fetch Assessment Overview
  console.log('2️⃣ Testing Assessment Overview Retrieval...');
  const overview = await AssessmentService.getAssessmentOverview('fullstack');
  console.log(`   ✅ Overview retrieved for domain "${overview.domainTitle}":`);
  console.log(`      - Title: ${overview.title}`);
  console.log(`      - Duration: ${overview.durationMinutes} mins`);
  console.log(`      - Passing Threshold: ${overview.passingScore}%`);
  console.log(`      - Total Questions: ${overview.totalQuestions}\n`);

  if (!overview.id) throw new Error('Assessment ID missing from overview');

  // 3. Start or Resume Attempt & Security Sanitization
  console.log('3️⃣ Testing Assessment Start & Security Sanitization...');
  const startResult = await AssessmentService.startOrResumeAttempt(candidate.id, overview.id);
  const attemptId = startResult.attempt.id;

  console.log(`   ✅ Attempt initialized: ${attemptId}`);
  console.log(`      - Initial State: ${startResult.attempt.status}`);
  console.log(`      - Remaining Seconds: ${startResult.attempt.remainingSeconds}s`);

  if (startResult.attempt.status !== AssessmentState.IN_PROGRESS) {
    throw new Error(`Expected status IN_PROGRESS, got ${startResult.attempt.status}`);
  }

  // Verify Security Red Line: stripped correct options and hidden test cases
  for (const q of startResult.assessment.questions) {
    if ((q as any).correctOption !== undefined) {
      throw new Error(`SECURITY BREACH: correctOption leaked to student on question ${q.id}`);
    }
    if ((q as any).solutionCode !== undefined) {
      throw new Error(`SECURITY BREACH: solutionCode leaked to student on question ${q.id}`);
    }
    if (q.visibleTestCases) {
      for (const tc of q.visibleTestCases) {
        if ((tc as any).isHidden) {
          throw new Error(`SECURITY BREACH: hidden test case leaked on question ${q.id}`);
        }
      }
    }
  }
  console.log('   ✅ Security check passed: All correctOption, solutionCode, and hidden test cases stripped from student payload.\n');

  // 4. Test Idempotent Resume
  console.log('4️⃣ Testing Idempotent Attempt Resume...');
  const resumeResult = await AssessmentService.startOrResumeAttempt(candidate.id, overview.id);
  if (resumeResult.attempt.id !== attemptId) {
    throw new Error('Resume did not return identical active attempt ID');
  }
  console.log('   ✅ Re-calling start on active attempt safely returned identical attempt without duplicate record.\n');

  // 5. Test Periodic Autosave
  console.log('5️⃣ Testing Periodic Answer Autosave...');
  const mcqQuestion = startResult.assessment.questions.find((q) => q.type === 'MCQ');
  const codeQuestion = startResult.assessment.questions.find((q) => q.type === 'CODING');

  if (!mcqQuestion || !codeQuestion) {
    throw new Error('Assessment questions missing MCQ or Coding types');
  }

  const sampleAnswers = {
    mcq: {
      [mcqQuestion.id]: 2, // Choice 2
    },
    code: {
      [codeQuestion.id]: {
        code: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
        language: 'javascript',
      },
    },
  };

  const autosaveResult = await AssessmentService.autosaveAttempt(candidate.id, attemptId, sampleAnswers);
  console.log(`   ✅ Autosave confirmed: savedAt = ${autosaveResult.savedAt}, remaining = ${autosaveResult.remainingSeconds}s`);

  // Verify persistence in DB
  const persistedAttempt = await prisma.assessmentAttempt.findUnique({ where: { id: attemptId } });
  const persistedAnswers = persistedAttempt?.answers as any;
  if (persistedAnswers?.mcq?.[mcqQuestion.id] !== 2) {
    throw new Error('Persisted MCQ answer did not match autosaved value');
  }
  console.log('   ✅ Autosaved answers verified directly in database.\n');

  // 6. Test Safe Code Execution (zero eval)
  console.log('6️⃣ Testing Safe Code Execution Engine (zero eval)...');
  const runCodeResult = await AssessmentService.runCode(
    candidate.id,
    attemptId,
    codeQuestion.id,
    sampleAnswers.code[codeQuestion.id].code,
    'javascript'
  );

  console.log(`   ✅ Code Runner Output (${runCodeResult.passedCount}/${runCodeResult.totalCount} visible cases passed):`);
  runCodeResult.results.forEach((r, i) => {
    console.log(`      - Case ${i + 1}: ${r.passed ? 'PASS' : 'FAIL'} (${r.executionTimeMs}ms, ${(r.memoryKb / 1024).toFixed(1)}MB)`);
  });

  if (!runCodeResult.allPassed) {
    throw new Error('Expected sample Two Sum solution to pass visible test cases');
  }

  // Test syntax error rejection without eval
  const brokenSyntaxResult = await MockCodeExecutor.executeTestCases(
    'function invalid({ return 1;',
    'javascript',
    'Two Sum',
    [{ id: '1', input: 'x', expectedOutput: 'y', isHidden: false }]
  );
  if (brokenSyntaxResult.allPassed || !brokenSyntaxResult.results[0].stderr?.includes('SyntaxError')) {
    throw new Error('Expected syntax error detection to catch unclosed brackets');
  }
  console.log('   ✅ Syntax analysis correctly trapped invalid syntax without crashing or using eval().\n');

  // 7. Test Final Submit & Grading
  console.log('7️⃣ Testing Final Assessment Submission & Scoring...');
  const submitResult = await AssessmentService.submitAttempt(candidate.id, attemptId);
  console.log(`   ✅ Assessment successfully graded and finalized:`);
  console.log(`      - Total Score: ${submitResult.totalScore}%`);
  console.log(`      - MCQ Score: ${submitResult.mcqScore}`);
  console.log(`      - Coding Score: ${submitResult.codingScore}`);
  console.log(`      - Passed: ${submitResult.passed ? 'YES' : 'NO'}`);
  console.log(`      - Submitted At: ${submitResult.submittedAt}`);

  if (submitResult.status !== AssessmentState.SUBMITTED) {
    throw new Error(`Expected final status SUBMITTED, got ${submitResult.status}`);
  }

  // 8. Test Idempotent Final Submission
  console.log('8️⃣ Testing Idempotent Final Submission Replay...');
  const secondSubmitResult = await AssessmentService.submitAttempt(candidate.id, attemptId);
  if (!secondSubmitResult.isIdempotentReplay) {
    throw new Error('Subsequent submit call should be flagged as idempotent replay');
  }
  if (secondSubmitResult.totalScore !== submitResult.totalScore) {
    throw new Error('Idempotent replay score mismatch');
  }
  console.log('   ✅ Idempotency verified: Duplicate submit returned existing score without recalculating.\n');

  // 9. Test Timer Expiration Enforcement
  console.log('9️⃣ Testing Server-Authoritative Timer Expiration Rejection...');
  const expiredAttempt = await prisma.assessmentAttempt.create({
    data: {
      assessmentId: overview.id,
      userId: candidate.id,
      status: AssessmentState.IN_PROGRESS,
      startedAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      expiresAt: new Date(Date.now() - 15 * 60 * 1000), // expired 15 minutes ago
    },
  });

  try {
    await AssessmentService.autosaveAttempt(candidate.id, expiredAttempt.id, sampleAnswers);
    throw new Error('Autosave on expired attempt should have been rejected');
  } catch (err: any) {
    if (err.status === 400 && err.message.includes('expired')) {
      console.log('   ✅ Server-authoritative timer strictly rejected expired attempt autosave.');
    } else {
      throw err;
    }
  }

  // Clean up test data
  console.log('\n🧹 Cleaning up test artifacts...');
  await prisma.assessmentAttempt.deleteMany({ where: { userId: candidate.id } });
  await prisma.user.delete({ where: { id: candidate.id } });
  console.log('   ✅ Test candidate and attempts cleaned up.');

  console.log('\n🎉 ALL PHASE 5 ONLINE ASSESSMENT CHECKS PASSED SUCCESSFULLY!');
}

runVerification()
  .catch((e) => {
    console.error('❌ Phase 5 Verification failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
