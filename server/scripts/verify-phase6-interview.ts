import { SessionStatus } from '@prisma/client';
import { prisma } from '../src/config/postgres';
import { InterviewService } from '../src/modules/interview/interview.service';

async function runInterviewVerification() {
  console.log('🚀 Starting Phase 6: AI DSA Technical Interview Verification Suite...\n');

  // 1. Setup Test Candidate
  console.log('1️⃣ Setting up test candidate...');
  const testEmail = `interview_candidate_${Date.now()}@hireready.test`;
  const candidate = await prisma.user.create({
    data: {
      email: testEmail,
      passwordHash: 'dummy_hash',
      firstName: 'Alan',
      lastName: 'Lovelace',
    },
  });
  console.log(`   ✅ Candidate created: ${candidate.email} (${candidate.id})\n`);

  // 2. Start DSA Interview Session
  console.log('2️⃣ Testing Interview Session Start & AI Opening Turn...');
  const startResult = await InterviewService.startOrResumeSession(candidate.id, 'DSA');
  const sessionId = startResult.session.id;

  console.log(`   ✅ Session initialized: ${sessionId}`);
  console.log(`      - Type: ${startResult.session.type}`);
  console.log(`      - Status: ${startResult.session.status}`);
  console.log(`      - Problem: ${startResult.problem.title}`);
  console.log(`      - Opening Turn from AI: "${startResult.openingTurn?.content.slice(0, 80)}..."\n`);

  if (startResult.session.status !== SessionStatus.IN_PROGRESS) {
    throw new Error(`Expected status IN_PROGRESS, got ${startResult.session.status}`);
  }
  if (!startResult.openingTurn || startResult.openingTurn.role !== 'ai') {
    throw new Error('Expected opening turn from AI');
  }

  // 3. Test Turn-by-Turn Conversational Dialogue (Turn 1)
  console.log('3️⃣ Testing Conversational Turn 1 (Candidate Approach)...');
  const utterance1 =
    'I plan to use a hash map to achieve O(n) linear time complexity by storing numbers and their indices as we iterate.';
  const turn1Result = await InterviewService.processTurn(candidate.id, sessionId, utterance1);

  console.log(`   ✅ AI Follow-up Received: "${turn1Result.replyText.slice(0, 90)}..."`);
  console.log(`      - Turn count: ${turn1Result.turnCount}`);
  console.log(`      - Clarity rating: ${turn1Result.turnEvaluation?.clarity}/10`);
  console.log(`      - Technical accuracy: ${turn1Result.turnEvaluation?.technicalAccuracy}/10\n`);

  if (turn1Result.turnCount < 2) {
    throw new Error('Transcript turn count did not increment');
  }

  // 4. Test Turn 2 with Code Draft
  console.log('4️⃣ Testing Turn 2 with Embedded Code Snippet...');
  const sampleCode = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`;

  const utterance2 =
    'I have implemented the solution using Map for O(1) complement lookups. Space complexity is O(n).';
  const turn2Result = await InterviewService.processTurn(candidate.id, sessionId, utterance2, sampleCode);

  console.log(`   ✅ AI Reply: "${turn2Result.replyText.slice(0, 90)}..."`);
  console.log(`      - Turn count: ${turn2Result.turnCount}\n`);

  // Verify code persisted in PostgreSQL
  const dbSession = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
  if (!dbSession?.currentCode?.includes('twoSum')) {
    throw new Error('Code snippet was not persisted in PostgreSQL interview_sessions');
  }
  console.log('   ✅ Candidate code verified in PostgreSQL session state.\n');

  // 5. Test Code Sandbox Execution
  console.log('5️⃣ Testing Monaco Code Execution in Interview Sandbox...');
  const runCodeResult = await InterviewService.runCode(candidate.id, sessionId, sampleCode, 'javascript');
  console.log(
    `   ✅ Code Execution Result: ${runCodeResult.passedCount}/${runCodeResult.totalCount} test cases passed`
  );
  runCodeResult.results.forEach((r, idx) => {
    console.log(`      - Case ${idx + 1}: ${r.passed ? 'PASS' : 'FAIL'} (${r.executionTimeMs}ms)`);
  });

  if (!runCodeResult.allPassed) {
    throw new Error('Expected sample Two Sum solution to pass all test cases');
  }
  console.log('   ✅ All test cases passed in safe sandbox.\n');

  // 6. Test Finalize Interview & Generate AI Evaluation Report
  console.log('6️⃣ Testing Interview Finalization & Multi-Pillar Evaluation Report...');
  const finishResult = await InterviewService.finishInterview(candidate.id, sessionId, sampleCode);

  console.log(`   ✅ Evaluation Report Generated:`);
  console.log(`      - Overall Score: ${finishResult.report.overallScore}/100`);
  console.log(`      - Technical Score: ${finishResult.report.technicalScore}/100`);
  console.log(`      - Communication Score: ${finishResult.report.communicationScore}/100`);
  console.log(`      - Recommendation: ${finishResult.report.recommendation}`);
  console.log(`      - Strengths Count: ${finishResult.report.detailedFeedback?.strengths?.length || 0}`);
  console.log(`      - Weaknesses Count: ${finishResult.report.detailedFeedback?.weaknesses?.length || 0}\n`);

  if (finishResult.session.status !== SessionStatus.COMPLETED) {
    throw new Error(`Expected session status COMPLETED, got ${finishResult.session.status}`);
  }
  if (!finishResult.session.evaluationId) {
    throw new Error('evaluationId missing from completed session in PostgreSQL');
  }

  // 7. Test Idempotent Finalization Replay
  console.log('7️⃣ Testing Idempotent Finish Replay...');
  const replayResult = await InterviewService.finishInterview(candidate.id, sessionId, sampleCode);
  if (!replayResult.isIdempotentReplay) {
    throw new Error('Subsequent finishInterview call should be marked as idempotent replay');
  }
  if (replayResult.report.overallScore !== finishResult.report.overallScore) {
    throw new Error('Idempotent replay score mismatch');
  }
  console.log('   ✅ Idempotency confirmed: Duplicate finish returned existing evaluation report.\n');

  // 8. Test Full Session Details Retrieval
  console.log('8️⃣ Testing Complete Session Details Retrieval...');
  const fullDetails = await InterviewService.getSessionDetails(candidate.id, sessionId);
  console.log(`   ✅ Retrieved Session Details:`);
  console.log(`      - Total Turns in Transcript: ${fullDetails.transcript.length}`);
  console.log(`      - Evaluation Linked: ${!!fullDetails.report}`);
  console.log(`      - Problem Title: ${fullDetails.problem.title}\n`);

  if (fullDetails.transcript.length < 3) {
    throw new Error('Expected at least 3 turns in final transcript');
  }

  // 9. Clean up test artifacts
  console.log('🧹 Cleaning up test candidate & session...');
  await prisma.interviewSession.deleteMany({ where: { userId: candidate.id } });
  await prisma.user.delete({ where: { id: candidate.id } });
  console.log('   ✅ Test candidate and interview session cleaned up.');

  console.log('\n🎉 ALL PHASE 6 AI DSA TECHNICAL INTERVIEW CHECKS PASSED SUCCESSFULLY!');
}

runInterviewVerification()
  .catch((err) => {
    console.error('❌ Phase 6 Verification failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
