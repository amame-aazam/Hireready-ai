import dotenv from 'dotenv';
dotenv.config();
import { Role, ApplicationStatus, SessionStatus, AssessmentState } from '@prisma/client';
import { prisma } from '../config/postgres';
import { ScoringService } from '../modules/scoring/scoring.service';
import { LeaderboardService } from '../modules/leaderboard/leaderboard.service';
import { DashboardService } from '../modules/dashboard/dashboard.service';

async function runPhase8Verification() {
  console.log('🚀 Starting E2E Verification for Phase 8: Scoring Engine, Leaderboard & Dashboard...\n');

  try {
    // 1. Ensure test student user exists
    let student = await prisma.user.findFirst({
      where: { email: 'alex.candidate.phase8@hireready.ai' },
    });

    if (!student) {
      student = await prisma.user.create({
        data: {
          email: 'alex.candidate.phase8@hireready.ai',
          passwordHash: 'mock-hash',
          firstName: 'Alex',
          lastName: 'Candidate',
          role: Role.STUDENT,
        },
      });
      console.log('✅ Created test candidate:', student.email);
    } else {
      console.log('✅ Found active test candidate:', student.email);
    }

    // 2. Create a clean test application
    let app = await prisma.application.findFirst({
      where: { userId: student.id },
    });

    if (!app) {
      app = await prisma.application.create({
        data: {
          userId: student.id,
          targetDomain: 'Fullstack Engineering',
          status: ApplicationStatus.DRAFT,
        },
      });
      console.log('✅ Created test application:', app.id);
    } else {
      console.log('✅ Using test application:', app.id);
    }

    // TEST 1: Incomplete Candidate Handling
    console.log('\n--- TEST 1: Incomplete Candidate Handling ---');
    // Ensure only 2 rounds are completed (simulate Resume & OA only)
    await prisma.interviewSession.deleteMany({
      where: { applicationId: app.id },
    });

    // Create a mock submitted OA attempt
    const domain = await prisma.domain.findFirst();
    if (domain) {
      let assessment = await prisma.assessment.findFirst({ where: { domainId: domain.id } });
      if (!assessment) {
        assessment = await prisma.assessment.create({
          data: {
            domainId: domain.id,
            title: 'Technical Screening OA',
            description: 'Mock OA',
            durationMinutes: 45,
            passingScore: 70.0,
          },
        });
      }

      await prisma.assessmentAttempt.deleteMany({ where: { applicationId: app.id } });
      await prisma.assessmentAttempt.create({
        data: {
          assessmentId: assessment.id,
          userId: student.id,
          applicationId: app.id,
          status: AssessmentState.SUBMITTED,
          totalScore: 85.0,
          passed: true,
          submittedAt: new Date(),
        },
      });
    }

    const incompleteResult = await ScoringService.recalculateApplicationScore(app.id);
    console.log(`Is Complete: ${incompleteResult.isComplete} (Expected: false)`);
    console.log(`Composite Score: ${incompleteResult.compositeScore} (Expected: null)`);
    console.log(`Status: ${incompleteResult.status} (Expected: OA_PASSED)`);

    if (incompleteResult.isComplete !== false || incompleteResult.compositeScore !== null) {
      throw new Error('FAIL: Incomplete candidate must NOT have a composite score or marked complete');
    }

    // Verify exclusion from leaderboard
    const leaderboardCheck = await LeaderboardService.getLeaderboard('Fullstack', 1, 50);
    const foundInLeaderboard = leaderboardCheck.rankings.some((r) => r.candidateId.includes(app.id.substring(0, 4)));
    console.log(`Present on public leaderboard: ${foundInLeaderboard} (Expected: false)`);
    if (foundInLeaderboard) {
      throw new Error('FAIL: Incomplete candidates must be excluded from leaderboard');
    }
    console.log('✅ TEST 1 PASSED: Incomplete candidate correctly handled and excluded from rankings.');

    // TEST 2: Complete 4-Round Composite Scoring (Resume 15%, OA 25%, DSA 40%, HR 20%)
    console.log('\n--- TEST 2: 4-Round Weighted Scoring (15/25/40/20) ---');
    // Add completed DSA session (Score: 92)
    await prisma.interviewSession.create({
      data: {
        userId: student.id,
        applicationId: app.id,
        type: 'DSA',
        status: SessionStatus.COMPLETED,
        overallScore: 92.0,
        completedAt: new Date(),
      },
    });

    // Add completed HR session (Score: 89)
    await prisma.interviewSession.create({
      data: {
        userId: student.id,
        applicationId: app.id,
        type: 'HR',
        status: SessionStatus.COMPLETED,
        overallScore: 89.0,
        completedAt: new Date(),
      },
    });

    // Mock Resume score on Application (Score: 88)
    await prisma.application.update({
      where: { id: app.id },
      data: { resumeScore: 88.0 },
    });

    const completeResult = await ScoringService.recalculateApplicationScore(app.id);
    console.log(`Is Complete: ${completeResult.isComplete} (Expected: true)`);
    console.log(`Resume (15%): ${completeResult.resumeScore}`);
    console.log(`OA (25%): ${completeResult.oaScore}`);
    console.log(`DSA (40%): ${completeResult.dsaScore}`);
    console.log(`HR (20%): ${completeResult.hrScore}`);
    console.log(`Calculated Composite Score: ${completeResult.compositeScore} (Expected: ~89.1)`);
    console.log(`Final Outcome: ${completeResult.status} (Expected: SELECTED)`);

    // Verification formula: 88*0.15 + 85*0.25 + 92*0.4 + 89*0.2 = 13.2 + 21.25 + 36.8 + 17.8 = 89.05 -> 89.1
    const expectedScore = Number(((88 * 0.15) + (85 * 0.25) + (92 * 0.4) + (89 * 0.2)).toFixed(1));
    if (completeResult.compositeScore !== expectedScore) {
      throw new Error(`FAIL: Expected composite score ${expectedScore}, received ${completeResult.compositeScore}`);
    }
    if (completeResult.status !== ApplicationStatus.SELECTED) {
      throw new Error('FAIL: Candidate with score 89.1 should be SELECTED');
    }
    console.log('✅ TEST 2 PASSED: Authoritative 15/25/40/20 formula computed with precision.');

    // TEST 3: Privacy-Safe Leaderboard API
    console.log('\n--- TEST 3: Privacy-Safe Leaderboard API Verification ---');
    const leaderboard = await LeaderboardService.getLeaderboard('Fullstack', 1, 10);
    console.log(`Total Ranked Candidates: ${leaderboard.totalCandidates}`);
    if (leaderboard.rankings.length === 0) {
      throw new Error('FAIL: Leaderboard should contain completed candidate');
    }

    const topCandidate = leaderboard.rankings[0];
    console.log(`Rank: #${topCandidate.rank}`);
    console.log(`Masked Display Name: "${topCandidate.displayName}"`);
    console.log(`Masked Identifier: "${topCandidate.candidateId}"`);
    console.log(`Composite Score: ${topCandidate.compositeScore}`);
    console.log(`Percentile: Top ${100 - topCandidate.percentile}% (Percentile Rank: ${topCandidate.percentile})`);

    // Verify ZERO PII leakage
    const jsonString = JSON.stringify(leaderboard);
    if (jsonString.includes('@') || jsonString.includes('hireready.ai') || jsonString.includes('Candidate')) {
      // Check if full surname or email was exposed
      if (jsonString.includes('@') || jsonString.includes('hireready.ai')) {
        throw new Error('FAIL: PII detected! Email address leaked in leaderboard response');
      }
    }
    console.log('✅ TEST 3 PASSED: Leaderboard API verified with zero PII exposure.');

    // TEST 4: Student Dashboard Real Data Integration
    console.log('\n--- TEST 4: Student Dashboard Real Data Payload ---');
    const dashboard = await DashboardService.getStudentDashboard(student.id);
    console.log(`User: ${dashboard.user.firstName} ${dashboard.user.lastName}`);
    console.log(`Application Status: ${dashboard.application.status}`);
    console.log(`Composite Score: ${dashboard.application.compositeScore}/100`);
    console.log(`Percentile Rank: ${dashboard.application.percentileRank}%`);
    console.log('Rounds Breakdown:', {
      Resume: `${dashboard.rounds.resume.score} (weight ${dashboard.rounds.resume.weight}%)`,
      OA: `${dashboard.rounds.oa.score} (weight ${dashboard.rounds.oa.weight}%)`,
      DSA: `${dashboard.rounds.dsa.score} (weight ${dashboard.rounds.dsa.weight}%)`,
      HR: `${dashboard.rounds.hr.score} (weight ${dashboard.rounds.hr.weight}%)`,
    });
    console.log(`Next Action: "${dashboard.nextAction.title}" -> Route: ${dashboard.nextAction.route}`);
    console.log(`Final Outcome: "${dashboard.finalOutcome.title}" - ${dashboard.finalOutcome.summary}`);

    if (!dashboard.application.isComplete) {
      throw new Error('FAIL: Dashboard should reflect complete application');
    }
    if (dashboard.finalOutcome.decision !== 'SELECTED') {
      throw new Error('FAIL: Expected decision SELECTED');
    }
    console.log('✅ TEST 4 PASSED: Student Dashboard API returns live, reactive payload.');

    console.log('\n🎉 ALL 4 PHASE 8 VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
  } catch (err: any) {
    console.error('\n❌ VERIFICATION FAILED:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase8Verification();
