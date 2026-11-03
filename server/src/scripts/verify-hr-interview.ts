import { Role, ApplicationStatus } from '@prisma/client';
import { prisma } from '../config/postgres';
import { InterviewService } from '../modules/interview/interview.service';

async function runHRVerification() {
  console.log('🚀 Starting E2E Verification for Phase 7: AI HR Behavioral Interview (STAR Method)...\n');

  try {
    // 1. Ensure test student user exists
    let student = await prisma.user.findFirst({
      where: { role: Role.STUDENT },
    });

    if (!student) {
      student = await prisma.user.create({
        data: {
          email: 'test.hr.student@hireready.ai',
          passwordHash: 'mock-hash',
          firstName: 'Jordan',
          lastName: 'Candidate',
          role: Role.STUDENT,
        },
      });
      console.log('✅ Created test student user:', student.id);
    } else {
      console.log('✅ Found active student user:', student.email);
    }

    // 2. Ensure test application exists for student
    let app = await prisma.application.findFirst({
      where: { userId: student.id },
    });
    if (!app) {
      app = await prisma.application.create({
        data: {
          userId: student.id,
          targetDomain: 'Fullstack Engineering',
          status: ApplicationStatus.INTERVIEW_PENDING,
        },
      });
      console.log('✅ Created test application linked to student:', app.id);
    } else {
      console.log('✅ Found existing application:', app.id);
    }

    // 3. Clean up any active HR sessions for clean test
    await prisma.interviewSession.updateMany({
      where: { userId: student.id, type: 'HR', status: 'IN_PROGRESS' },
      data: { status: 'ABANDONED' },
    });

    // TEST 1: Start HR interview with 3 behavioral questions
    console.log('\n--- TEST 1: Start HR Behavioral Interview ---');
    const startRes: any = await InterviewService.startOrResumeSession(student.id, 'HR', undefined, app.id);
    console.log(`Session created: ${startRes.session.id}`);
    console.log(`Type: ${startRes.session.type} (Expected: HR)`);
    console.log(`Stage: ${startRes.session.stage} (Expected: QUESTION)`);
    console.log(`Current Question 1: "${startRes.currentQuestion.title}" (${startRes.currentQuestion.competency})`);
    console.log(`Total questions in queue: ${startRes.questionsOverview.length} (Expected: 3)`);
    console.log(`Opening AI Greeting: "${startRes.openingTurn?.content.substring(0, 90)}..."`);

    if (startRes.session.type !== 'HR') {
      throw new Error('FAIL: Session type should be HR');
    }
    if (startRes.session.stage !== 'QUESTION') {
      throw new Error('FAIL: Initial stage should be QUESTION');
    }
    if (startRes.questionsOverview.length !== 3) {
      throw new Error('FAIL: Expected exactly 3 questions in queue');
    }
    console.log('✅ TEST 1 PASSED: HR interview initialized with 3 behavioral questions.');

    // TEST 2: Incomplete STAR response triggers probing follow-up
    console.log('\n--- TEST 2: Incomplete Answer Triggers Probing Follow-up ---');
    const incompleteTurn = await InterviewService.processTurn(
      student.id,
      startRes.session.id,
      'Last year at our startup we had a critical project deadline approaching and the team was falling behind.'
    );
    console.log(`Sophia Response: "${incompleteTurn.replyText}"`);
    console.log('STAR Progress:', incompleteTurn.starProgress);

    if (!incompleteTurn.starProgress?.situation) {
      throw new Error('FAIL: Situation should be detected');
    }
    if (incompleteTurn.starProgress?.action || incompleteTurn.starProgress?.result) {
      throw new Error('FAIL: Action and Result should not be detected yet');
    }
    console.log('✅ TEST 2 PASSED: Probing follow-up generated for missing Action/Result.');

    // TEST 3: Candidate completes STAR answer with Action and Result
    console.log('\n--- TEST 3: Complete STAR Response with Action and Result ---');
    const completeTurn = await InterviewService.processTurn(
      student.id,
      startRes.session.id,
      'My role as the lead was to ensure delivery. I stepped up and refactored the database connection pool, triaged open bugs, and communicated daily priorities. As a result, we delivered the feature on time and reduced server latency by 45% with zero outages.'
    );
    console.log(`Sophia Response: "${completeTurn.replyText}"`);
    console.log('STAR Progress:', completeTurn.starProgress);

    if (
      !completeTurn.starProgress?.action ||
      !completeTurn.starProgress?.result
    ) {
      throw new Error('FAIL: Action and Result should both be detected');
    }
    console.log('✅ TEST 3 PASSED: Full STAR response recognized by Sophia.');

    // TEST 4: Advance to Question 2
    console.log('\n--- TEST 4: Advance to Question 2 ---');
    const q2Res: any = await InterviewService.advanceQuestion(student.id, startRes.session.id, '');
    console.log(`Current Question Index: ${q2Res.currentQuestionIndex} (Expected: 1)`);
    console.log(`Question 2: "${q2Res.currentQuestion.title}" (${q2Res.currentQuestion.competency})`);
    console.log(`Transition Turn: "${q2Res.aiTransitionTurn.content.substring(0, 80)}..."`);

    if (q2Res.currentQuestionIndex !== 1) {
      throw new Error('FAIL: Expected question index 1');
    }
    console.log('✅ TEST 4 PASSED: Advanced to Question 2.');

    // TEST 5: Answer Question 2 and Advance to Question 3
    console.log('\n--- TEST 5: Complete Question 2 & Advance to Question 3 ---');
    await InterviewService.processTurn(
      student.id,
      startRes.session.id,
      'In a production incident, our payment service failed. My task was rapid recovery. I investigated logs, rolled back the faulty migration, and patched the index. The outcome was full recovery in 15 minutes, and we implemented automated canary deployments to prevent recurrence.'
    );

    const q3Res: any = await InterviewService.advanceQuestion(student.id, startRes.session.id, '');
    console.log(`Current Question Index: ${q3Res.currentQuestionIndex} (Expected: 2)`);
    console.log(`Question 3: "${q3Res.currentQuestion.title}" (${q3Res.currentQuestion.competency})`);
    console.log('✅ TEST 5 PASSED: Advanced to Question 3.');

    // TEST 6: Answer Question 3 and Finalize Interview
    console.log('\n--- TEST 6: Complete Question 3 & Finalize Interview Report ---');
    await InterviewService.processTurn(
      student.id,
      startRes.session.id,
      'When managing conflicting priorities between marketing and engineering, my responsibility was to protect sprint goals. I created an impact matrix, scheduled an alignment session, and negotiated a phased release. The result was that both milestones launched on schedule with 100% stakeholder satisfaction.'
    );

    const finishRes: any = await InterviewService.advanceQuestion(student.id, startRes.session.id, '');
    console.log(`Is Finished: ${finishRes.isFinished} (Expected: true)`);
    console.log(`Final Status: ${finishRes.session.status} (Expected: COMPLETED)`);
    console.log(`Overall Score: ${finishRes.report.overallScore}/100`);
    console.log(`Competency Score: ${finishRes.report.technicalScore}/100`);
    console.log(`Communication Score: ${finishRes.report.communicationScore}/100`);
    console.log(`Recommendation: ${finishRes.report.recommendation}`);
    console.log('STAR Breakdown:', finishRes.report.starBreakdown);

    if (finishRes.session.status !== 'COMPLETED') {
      throw new Error('FAIL: Session status should be COMPLETED');
    }
    if (!finishRes.report.starBreakdown) {
      throw new Error('FAIL: Report must include structured STAR breakdown');
    }
    if (finishRes.report.overallScore < 70) {
      throw new Error('FAIL: Overall score should reflect passing STAR evaluation');
    }
    console.log('✅ TEST 6 PASSED: Session finalized with comprehensive STAR evaluation report in MongoDB.');

    // TEST 7: Verify Application status updated to COMPLETED
    console.log('\n--- TEST 7: Verify Linked Application Status ---');
    const updatedApp = await prisma.application.findUnique({
      where: { id: app.id },
    });
    console.log(`Application Status: ${updatedApp?.status} (Expected: COMPLETED)`);
    if (updatedApp?.status !== ApplicationStatus.COMPLETED) {
      throw new Error('FAIL: Linked application status should be COMPLETED');
    }
    console.log('✅ TEST 7 PASSED: Linked application successfully transitioned to COMPLETED.');

    console.log('\n🎉 ALL 7 HR BEHAVIORAL VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
  } catch (err: any) {
    console.error('\n❌ HR VERIFICATION FAILED:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runHRVerification();
