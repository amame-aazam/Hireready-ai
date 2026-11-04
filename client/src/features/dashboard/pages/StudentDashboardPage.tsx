import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchStudentDashboard, DashboardResponse } from '../api/dashboardApi';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Award,
  FileText,
  Terminal,
  Code2,
  Users,
  Trophy,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Percent,
  Download,
} from 'lucide-react';
import { JourneyTracker } from '../../../components/common/JourneyTracker';
import { generatePlacementCertificate } from '../../../lib/certificateGenerator';

export const StudentDashboardPage: React.FC = () => {
  const {
    data: dashboard,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<DashboardResponse>({
    queryKey: ['studentDashboard'],
    queryFn: fetchStudentDashboard,
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-slate-400 text-sm">Aggregating multi-round performance metrics...</p>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-4">
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full w-fit mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Failed to Load Dashboard</h2>
        <p className="text-sm text-slate-400">
          {(error as any)?.response?.data?.message || (error as any)?.message || 'An unexpected error occurred while fetching your candidate dashboard.'}
        </p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  const { user, application, rounds, nextAction, finalOutcome } = dashboard;

  const getStatusBadge = () => {
    switch (application.status) {
      case 'SELECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <Trophy className="w-3.5 h-3.5" /> Offer Extended
          </span>
        );
      case 'WAITLISTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Clock className="w-3.5 h-3.5" /> Waitlisted
          </span>
        );
      case 'NOT_SELECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <AlertCircle className="w-3.5 h-3.5" /> Completed — Pool Reviewed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5" /> In Progress
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
      {/* 1. Profile & Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl backdrop-blur">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user.firstName}!
            </h1>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-slate-400">
            Track your recruitment pipeline, multi-round weighted scores, and real-time placement standing.
          </p>
          <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
            <span className="font-medium text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700">
              Domain: <span className="text-indigo-400">{application.targetDomain}</span>
            </span>
            <span className="bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-700">
              Application ID: <span className="font-mono text-slate-300">{application.id.substring(0, 8)}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-900/60 border border-slate-700 hover:border-slate-600 transition"
            title="Refresh Performance Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-crimson-600 hover:bg-crimson-500 text-white rounded-xl text-xs font-semibold transition shadow-crimson-sm hover:shadow-crimson-glow"
          >
            <Award className="w-4 h-4" /> View Leaderboard
          </Link>
        </div>
      </div>

      {/* 2. Step-by-Step Journey Tracker */}
      <JourneyTracker rounds={rounds} isComplete={application.isComplete} />

      {/* 3. Next Action Prompt (Dynamic CTA Banner) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-crimson-950/40 via-slate-900/80 to-slate-900 border border-crimson-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-crimson-600/20 text-crimson-400 border border-crimson-500/30 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-crimson-400 flex items-center gap-1.5">
              <span>Next Milestone</span>
              <span>&bull;</span>
              <span>Step {nextAction.stepNumber} of 4</span>
            </div>
            <h3 className="text-base font-bold text-white">{nextAction.title}</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">{nextAction.description}</p>
          </div>
        </div>

        <Link
          to={nextAction.route}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-crimson-600 hover:bg-crimson-500 text-white text-xs font-bold rounded-xl transition shadow-crimson-sm hover:shadow-crimson-glow group shrink-0"
        >
          <span>Continue Assessment</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>

      {/* 3. Composite Score & Percentile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composite Score Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Server-Authoritative Composite Score
              </h2>
              <p className="text-xs text-slate-400">
                Formula: Resume (15%) + OA (25%) + DSA (40%) + HR (20%)
              </p>
            </div>
            <div className="text-right">
              {application.compositeScore !== null ? (
                <div>
                  <span className="text-3xl font-extrabold text-white">
                    {application.compositeScore}
                  </span>
                  <span className="text-slate-400 text-sm"> / 100</span>
                </div>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-slate-900 text-slate-400 text-xs font-medium border border-slate-700">
                  Awaiting All Rounds
                </span>
              )}
            </div>
          </div>

          {/* Mathematical Formula Visualization Bar */}
          <div className="space-y-2">
            <div className="text-xs text-slate-300 font-medium flex justify-between">
              <span>Weighted Contribution Breakdown</span>
              <span className="text-slate-400">100% Total Bar</span>
            </div>
            <div className="h-4 rounded-full bg-slate-900 border border-slate-700/70 overflow-hidden flex">
              <div
                style={{ width: '15%' }}
                className={`h-full border-r border-slate-900 ${
                  rounds.resume.passed ? 'bg-blue-500' : 'bg-blue-900/50'
                }`}
                title={`Resume (15%): Score ${rounds.resume.score ?? 'N/A'}`}
              />
              <div
                style={{ width: '25%' }}
                className={`h-full border-r border-slate-900 ${
                  rounds.oa.passed ? 'bg-emerald-500' : 'bg-emerald-900/50'
                }`}
                title={`OA (25%): Score ${rounds.oa.score ?? 'N/A'}`}
              />
              <div
                style={{ width: '40%' }}
                className={`h-full border-r border-slate-900 ${
                  rounds.dsa.passed ? 'bg-indigo-500' : 'bg-indigo-900/50'
                }`}
                title={`DSA (40%): Score ${rounds.dsa.score ?? 'N/A'}`}
              />
              <div
                style={{ width: '20%' }}
                className={`h-full ${
                  rounds.hr.passed ? 'bg-amber-500' : 'bg-amber-900/50'
                }`}
                title={`HR (20%): Score ${rounds.hr.score ?? 'N/A'}`}
              />
            </div>
            <div className="grid grid-cols-4 text-[11px] text-slate-400 text-center pt-1">
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Resume (15%)
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> OA (25%)
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> DSA (40%)
              </div>
              <div className="flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> HR (20%)
              </div>
            </div>
          </div>

          {/* Mathematical Expression */}
          <div className="p-3 bg-slate-900/70 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-slate-400">Score = </span>
              <span className="text-blue-400">({rounds.resume.score ?? 0} &times; 0.15)</span>
              <span className="text-slate-500"> + </span>
              <span className="text-emerald-400">({rounds.oa.score ?? 0} &times; 0.25)</span>
              <span className="text-slate-500"> + </span>
              <span className="text-indigo-400">({rounds.dsa.score ?? 0} &times; 0.40)</span>
              <span className="text-slate-500"> + </span>
              <span className="text-amber-400">({rounds.hr.score ?? 0} &times; 0.20)</span>
            </div>
            <div className="font-semibold text-white">
              = {application.compositeScore !== null ? `${application.compositeScore}/100` : 'Pending'}
            </div>
          </div>
        </div>

        {/* Rank & Standing Card */}
        <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" /> Leaderboard Standing
            </h3>
            <p className="text-xs text-slate-400">
              Anonymous cohort ranking based strictly on completed 4-round candidates.
            </p>
          </div>

          <div className="space-y-3 py-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Public Rank</span>
              <span className="text-lg font-bold text-white">
                {application.rank !== null ? `#${application.rank}` : 'Unranked'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Percentile Tier</span>
              <span className="text-lg font-bold text-indigo-400 flex items-center gap-1">
                {application.percentileRank !== null ? (
                  <>
                    <Percent className="w-3.5 h-3.5" />
                    Top {Math.max(1, 100 - application.percentileRank)}%
                  </>
                ) : (
                  'Pending'
                )}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Privacy Safeguard</span>
              <span className="text-xs text-emerald-400 font-medium">PII-Masked (Alex C.)</span>
            </div>
          </div>

          <Link
            to="/leaderboard"
            className="w-full text-center py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 hover:text-white border border-slate-700 transition flex items-center justify-center gap-1.5"
          >
            <span>Open Public Leaderboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. 4-Round Pipeline Detailed Breakdown Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-indigo-400" /> 4-Round Assessment Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Round 1: Resume */}
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-blue-500/40 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Weight: {rounds.resume.weight}%
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Round 1: AI Resume Review</h3>
                <p className="text-xs text-slate-400 mt-1">ATS parsing & skills alignment scoring.</p>
              </div>
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">Cutoff: {rounds.resume.cutoff}/100</span>
                <span className="font-bold text-white">
                  {rounds.resume.score !== null ? `${rounds.resume.score}/100` : 'Not Started'}
                </span>
              </div>
            </div>

            <Link
              to="/resume"
              className="w-full text-center py-2 px-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs text-blue-400 font-medium border border-slate-700 hover:border-blue-500/50 transition flex items-center justify-center gap-1"
            >
              <span>{rounds.resume.status === 'COMPLETED' ? 'Review Resume' : 'Start Resume Audit'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Round 2: Online Assessment */}
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-emerald-500/40 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Weight: {rounds.oa.weight}%
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Round 2: Technical OA</h3>
                <p className="text-xs text-slate-400 mt-1">Domain MCQs and code implementation.</p>
              </div>
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">Cutoff: {rounds.oa.cutoff}/100</span>
                <span className="font-bold text-white">
                  {rounds.oa.score !== null ? `${rounds.oa.score}/100` : 'Not Started'}
                </span>
              </div>
            </div>

            <Link
              to="/oa"
              className="w-full text-center py-2 px-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs text-emerald-400 font-medium border border-slate-700 hover:border-emerald-500/50 transition flex items-center justify-center gap-1"
            >
              <span>{rounds.oa.status === 'COMPLETED' ? 'View OA Results' : 'Take OA Challenge'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Round 3: AI DSA Interview */}
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-indigo-500/40 transition flex flex-col justify-between space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-2 py-0.5 bg-indigo-500 text-[10px] font-bold text-white rounded-bl-lg">
              Primary 40%
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Weight: {rounds.dsa.weight}%
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Round 3: AI DSA Interview</h3>
                <p className="text-xs text-slate-400 mt-1">Split-screen voice & Monaco workspace.</p>
              </div>
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">Cutoff: {rounds.dsa.cutoff}/100</span>
                <span className="font-bold text-white">
                  {rounds.dsa.score !== null ? `${rounds.dsa.score}/100` : 'Not Started'}
                </span>
              </div>
            </div>

            <Link
              to="/interview/dsa"
              className="w-full text-center py-2 px-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs text-indigo-400 font-medium border border-slate-700 hover:border-indigo-500/50 transition flex items-center justify-center gap-1"
            >
              <span>{rounds.dsa.status === 'COMPLETED' ? 'Review DSA Session' : 'Start DSA Interview'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Round 4: AI HR Behavioral Interview */}
          <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-amber-500/40 transition flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Weight: {rounds.hr.weight}%
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Round 4: AI HR Behavioral</h3>
                <p className="text-xs text-slate-400 mt-1">STAR methodology with voice & webcam.</p>
              </div>
              <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">Cutoff: {rounds.hr.cutoff}/100</span>
                <span className="font-bold text-white">
                  {rounds.hr.score !== null ? `${rounds.hr.score}/100` : 'Not Started'}
                </span>
              </div>
            </div>

            <Link
              to="/interview/hr"
              className="w-full text-center py-2 px-3 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-xs text-amber-400 font-medium border border-slate-700 hover:border-amber-500/50 transition flex items-center justify-center gap-1"
            >
              <span>{rounds.hr.status === 'COMPLETED' ? 'Review HR Session' : 'Start HR Interview'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Official Placement / Decision Letter Banner */}
      <div
        className={`p-6 rounded-2xl border ${
          finalOutcome.decision === 'SELECTED'
            ? 'bg-emerald-950/30 border-emerald-500/40'
            : finalOutcome.decision === 'WAITLISTED'
            ? 'bg-amber-950/30 border-amber-500/40'
            : finalOutcome.decision === 'NOT_SELECTED'
            ? 'bg-rose-950/30 border-rose-500/40'
            : 'bg-slate-900/60 border-slate-800'
        } space-y-3`}
      >
        <div className="flex items-center gap-3">
          {finalOutcome.decision === 'SELECTED' && (
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Trophy className="w-5 h-5" />
            </div>
          )}
          {finalOutcome.decision === 'WAITLISTED' && (
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Clock className="w-5 h-5" />
            </div>
          )}
          {finalOutcome.decision === 'NOT_SELECTED' && (
            <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
          {finalOutcome.decision === 'INCOMPLETE' && (
            <div className="p-2 rounded-lg bg-slate-800 text-slate-400 border border-slate-700">
              <HelpCircle className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-white">{finalOutcome.title}</h3>
            {finalOutcome.decidedAt && (
              <span className="text-[11px] text-slate-400">
                Official Decision Recorded: {new Date(finalOutcome.decidedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
          {finalOutcome.summary}
        </p>

        {finalOutcome.decision === 'SELECTED' && (
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <span className="text-xs text-emerald-300 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              Placement Bar Cleared &bull; Target Domain: {application.targetDomain}
            </span>
            <button
              onClick={() =>
                generatePlacementCertificate({
                  candidateName: `${user.firstName} ${user.lastName}`,
                  targetDomain: application.targetDomain,
                  compositeScore: application.compositeScore || 0,
                  percentile: application.percentileRank,
                  applicationId: application.id,
                  issueDate: finalOutcome.decidedAt || undefined,
                  roundScores: {
                    resume: rounds.resume.score,
                    oa: rounds.oa.score,
                    dsa: rounds.dsa.score,
                    hr: rounds.hr.score,
                  },
                })
              }
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-crimson-600 to-rose-600 hover:from-crimson-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold transition shadow-crimson-sm hover:shadow-crimson-glow"
            >
              <Download className="w-4 h-4" /> Download Official PDF Certificate
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default StudentDashboardPage;
