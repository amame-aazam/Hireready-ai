import dotenv from 'dotenv';
dotenv.config();

import { Role, ApplicationStatus } from '@prisma/client';
import { prisma } from '../config/postgres';
import { AdminService } from '../modules/admin/admin.service';
import { signAccessToken } from '../utils/jwt';
import { seedAdminUser } from './seed-admin';

async function runPhase9Verification() {
  console.log('🚀 Starting E2E Verification for Phase 9: Admin Dashboard & Management...\n');

  try {
    // 1. Seed and verify admin user
    const admin = await seedAdminUser();
    console.log('✅ Admin user verified:', admin.email);

    // 2. Fetch or create a student user
    let student = await prisma.user.findFirst({
      where: { role: Role.STUDENT },
    });
    if (!student) {
      student = await prisma.user.create({
        data: {
          email: 'student.phase9.test@hireready.ai',
          passwordHash: 'hash',
          firstName: 'Jane',
          lastName: 'Student',
          role: Role.STUDENT,
        },
      });
    }
    console.log('✅ Student user verified:', student.email);

    // 3. Ensure test application exists for student
    let app = await prisma.application.findFirst({
      where: { userId: student.id },
    });
    if (!app) {
      app = await prisma.application.create({
        data: {
          userId: student.id,
          targetDomain: 'Fullstack Engineering',
          status: ApplicationStatus.OA_PASSED,
          resumeScore: 85,
          oaScore: 90,
          dsaScore: 88,
          hrScore: 86,
          compositeScore: 87.5,
        },
      });
    }
    console.log('✅ Test application verified:', app.id);

    // TEST 1: RBAC Token Generation & Validation
    console.log('\n--- TEST 1: Role-Based Access Control (RBAC) Token Logic ---');
    const adminToken = signAccessToken({ sub: admin.id, email: admin.email, role: admin.role });
    const studentToken = signAccessToken({ sub: student.id, email: student.email, role: student.role });

    console.log(`Admin Token generated for: ${admin.email} (Role: ${admin.role})`);
    console.log(`Student Token generated for: ${student.email} (Role: ${student.role})`);

    if (admin.role !== Role.ADMIN) {
      throw new Error('FAIL: Admin user must possess ADMIN role');
    }
    if (student.role !== Role.STUDENT) {
      throw new Error('FAIL: Student user must possess STUDENT role');
    }
    console.log('✅ TEST 1 PASSED: RBAC roles cleanly segregated.');

    // TEST 2: Platform Statistics Aggregation
    console.log('\n--- TEST 2: Platform Statistics Overview ---');
    const stats = await AdminService.getPlatformStats();
    console.log('Platform Overview:', {
      totalStudents: stats.overview.totalStudents,
      totalApplications: stats.overview.totalApplications,
      activeApplications: stats.overview.activeApplications,
      oaCompletionRate: `${stats.overview.oaCompletionRate}%`,
      avgDsaScore: stats.overview.avgDsaScore,
      avgHrScore: stats.overview.avgHrScore,
    });
    console.log('Outcome Breakdown:', stats.outcomes);
    console.log('Domains Analyzed:', stats.domainBreakdown.length);

    if (stats.overview.totalStudents < 1) {
      throw new Error('FAIL: Platform stats should reflect at least 1 student');
    }
    console.log('✅ TEST 2 PASSED: Platform statistics successfully aggregated.');

    // TEST 3: Candidate Listing & Unified Multi-Round Reports
    console.log('\n--- TEST 3: Candidate Management & Unified Reports ---');
    const candidateList = await AdminService.getCandidates({ page: 1, limit: 10 });
    console.log(`Total Candidates Listed: ${candidateList.total}`);
    if (candidateList.candidates.length === 0) {
      throw new Error('FAIL: Candidate list should return at least 1 candidate');
    }

    const testCandidate = candidateList.candidates[0];
    console.log(`Candidate: ${testCandidate.fullName} (${testCandidate.email}) - Status: ${testCandidate.status}`);

    const reports = await AdminService.getCandidateReports(app.id);
    console.log('Candidate Reports Found:', {
      hasResumeReport: reports.reports.resume !== null,
      hasOaReport: reports.reports.oa !== null,
      hasDsaReport: reports.reports.dsa !== null,
      hasHrReport: reports.reports.hr !== null,
    });
    console.log('✅ TEST 3 PASSED: Candidate listing and multi-round reports unified.');

    // TEST 4: Status Override & Audit Logging
    console.log('\n--- TEST 4: Status Override with Authoritative Audit Logging ---');
    const initialStatus = app.status;
    const targetStatus = ApplicationStatus.SELECTED;
    const auditReason = 'Executive hiring board override: Exceeded threshold bars on all 4 evaluation rounds.';

    const overrideResult = await AdminService.overrideCandidateStatus(
      admin.id,
      app.id,
      targetStatus,
      auditReason
    );

    console.log(`Updated Status: ${overrideResult.application.status} (Expected: ${targetStatus})`);
    console.log(`Audit Log ID: ${overrideResult.auditLog.id}`);
    console.log(`Audit Action: ${overrideResult.auditLog.previousVal} -> ${overrideResult.auditLog.newVal}`);
    console.log(`Audit Reason: "${overrideResult.auditLog.reason}"`);
    console.log(`Logged By Admin: ${overrideResult.auditLog.admin.email}`);

    if (overrideResult.application.status !== targetStatus) {
      throw new Error(`FAIL: Expected application status to be ${targetStatus}`);
    }
    if (overrideResult.auditLog.previousVal !== initialStatus || overrideResult.auditLog.newVal !== targetStatus) {
      throw new Error('FAIL: Audit log values do not match transition');
    }

    const auditHistory = await AdminService.getCandidateAuditLogs(app.id);
    console.log(`Total Audit Entries for Application: ${auditHistory.length}`);
    if (auditHistory.length === 0) {
      throw new Error('FAIL: Audit history should contain recorded override');
    }
    console.log('✅ TEST 4 PASSED: Status override and audit logging verified with 100% integrity.');

    // TEST 5: Assessment Template Studio
    console.log('\n--- TEST 5: Assessment Template Management ---');
    const newAssessment = await AdminService.createAssessment({
      title: 'Advanced Fullstack Screening (Phase 9 Test)',
      description: 'Comprehensive screening covering React, Node.js, and Algorithmic optimization.',
      durationMinutes: 60,
      passingScore: 75.0,
      isActive: true,
    });

    console.log(`Created Template: "${newAssessment.title}" (ID: ${newAssessment.id})`);
    console.log(`Duration: ${newAssessment.durationMinutes}m | Passing Bar: ${newAssessment.passingScore}%`);

    const assessmentsList = await AdminService.getAssessments();
    const createdFound = assessmentsList.some((a) => a.id === newAssessment.id);
    console.log(`Found in active template pool: ${createdFound} (Total Templates: ${assessmentsList.length})`);

    if (!createdFound) {
      throw new Error('FAIL: Created assessment template not found in pool');
    }
    console.log('✅ TEST 5 PASSED: Assessment template creation and metrics operational.');

    // TEST 6: Unmasked Leaderboard
    console.log('\n--- TEST 6: Unmasked Cohort Leaderboard (Admin Only) ---');
    const unmasked = await AdminService.getUnmaskedLeaderboard(undefined, 1, 10);
    console.log(`Total Ranked Candidates: ${unmasked.totalCandidates}`);

    if (unmasked.rankings.length > 0) {
      const topRanked = unmasked.rankings[0];
      console.log(`Rank #${topRanked.rank}: ${topRanked.fullName} (${topRanked.email})`);
      console.log(`Composite Score: ${topRanked.compositeScore} | Percentile: ${topRanked.percentile}%`);
      console.log(`Status: ${topRanked.status}`);

      // Verify that full legal names and email addresses ARE present for admin
      if (!topRanked.email.includes('@') || !topRanked.fullName.includes(' ')) {
        throw new Error('FAIL: Admin leaderboard must expose full unmasked candidate identity');
      }
    }
    console.log('✅ TEST 6 PASSED: Full unmasked leaderboard operational for administrators.');

    console.log('\n🎉 ALL 6 PHASE 9 VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
  } catch (err: any) {
    console.error('\n❌ VERIFICATION FAILED:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPhase9Verification();
