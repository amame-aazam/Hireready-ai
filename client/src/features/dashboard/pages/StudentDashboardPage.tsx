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
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-[#FF7A48] animate-spin" />
        <p className="text-[#6B544A] text-sm font-medium">Aggregating multi-round performance metrics...</p>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center space-y-4">
        <div className="p-3 bg-[#FFF4EC] border border-[#F2DDD2] text-[#FF7A48] rounded-full w-fit mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif text-[#0A0706]">Failed to Load Dashboard</h2>
        <p className="text-sm text-[#6B544A]">
          {(error as any)?.response?.data?.message || (error as any)?.message || 'An unexpected error occurred while fetching your candidate dashboard.'}
        </p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A0706] hover:bg-[#221C19] text-white rounded-full text-xs font-medium transition"
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F4EA] text-[#1F7A3A] border border-[#B7E1CD]">
            <Trophy className="w-3.5 h-3.5" /> Offer Extended
          </span>
        );
      case 'WAITLISTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3D6] text-[#8C5E00] border border-[#FAD77B]">
            <Clock className="w-3.5 h-3.5" /> Waitlisted
          </span>
        );
      case 'NOT_SELECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FDE8E8] text-[#9B1C1C] border border-[#F8B4B4]">
            <AlertCircle className="w-3.5 h-3.5" /> Completed — Pool Reviewed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFEBE1] text-[#A83E14] border border-[#FFD0BC]">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7A48]" /> In Progress
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* 1. Profile & Status Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-[#F2DDD2] p-6 sm:p-8 rounded-3xl shadow-sm">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#0A0706] tracking-tight">
              Welcome back, {user.firstName}
            </h1>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-[#6B544A]">
            Track your recruitment pipeline, multi-round weighted scores, and real-time placement standing.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-[#8C7268]">
            <span className="font-medium text-[#0A0706] bg-[#FFFAF7] px-3 py-1 rounded-full border border-[#F2DDD2]">
              Domain: <span className="text-[#FF7A48] font-semibold">{application.targetDomain}</span>
            </span>
            <span className="bg-[#FFFAF7] px-3 py-1 rounded-full border border-[#F2DDD2]">
              Application ID: <span className="font-mono text-[#0A0706]">{application.id.substring(0, 8)}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 text-[#8C7268] hover:text-[#0A0706] rounded-full bg-[#FFFAF7] border border-[#F2DDD2] hover:bg-[#FBF1EA] transition"
            title="Refresh Performance Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0A0706] hover:bg-[#221C19] text-white rounded-full text-xs font-semibold transition shadow-sm"
          >
            <Award className="w-4 h-4 text-[#FF7A48]" />
            <span>Leaderboard</span>
          </Link>
        </div>
      </div>

      {/* 2. Step-by-Step Journey Tracker */}
      <JourneyTracker rounds={rounds} isComplete={application.isComplete} />

      {/* 3. Next Action Prompt (Dynamic CTA Banner) */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#FFF4EC] via-[#FFFAF7] to-white border border-[#F2DDD2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-[#FFEBE1] text-[#FF7A48] border border-[#FFD0BC] shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#A83E14] flex items-center gap-1.5">
              <span>Next Milestone</span>
              <span>&bull;</span>
              <span>Step {nextAction.stepNumber} of 5</span>
            </div>
            <h3 className="text-lg font-serif font-medium text-[#0A0706]">{nextAction.title}</h3>
            <p className="text-xs text-[#6B544A] max-w-xl leading-relaxed">{nextAction.description}</p>
          </div>
        </div>

        <Link
          to={nextAction.route}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#FF7A48] hover:bg-[#FF6428] text-white text-xs font-semibold rounded-full transition shadow-sm hover:shadow group shrink-0"
        >
          <span>Continue Assessment</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
        </Link>
      </div>

      {/* 4. Composite Score & Percentile Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composite Score Card */}
        <div className="lg:col-span-2 p-6 sm:p-7 rounded-3xl bg-white border border-[#F2DDD2] space-y-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-serif font-medium text-[#0A0706] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#FF7A48]" /> Server-Authoritative Composite Score
              </h2>
              <p className="text-xs text-[#6B544A]">
                Formula: Resume (15%) + OA (25%) + DSA (40%) + HR (20%)
              </p>
            </div>
            <div className="text-right">
              {application.compositeScore !== null ? (
                <div>
                  <span className="text-3xl font-serif font-bold text-[#0A0706]">
                    {application.compositeScore}
                  </span>
                  <span className="text-[#8C7268] text-sm"> / 100</span>
                </div>
              ) : (
                <span className="px-3 py-1 rounded-full bg-[#FFFAF7] text-[#8C7268] text-xs font-medium border border-[#F2DDD2]">
                  Awaiting All Rounds
                </span>
              )}
            </div>
          </div>

          {/* Mathematical Formula Visualization Bar */}
          <div className="space-y-2">
            <div className="text-xs text-[#6B544A] font-medium flex justify-between">
              <span>Weighted Contribution Breakdown</span>
              <span className="text-[#8C7268]">100% Total Bar</span>
            </div>
            <div className="h-3.5 rounded-full bg-[#FFFAF7] border border-[#F2DDD2] overflow-hidden flex">
              <div
                style={{ width: '15%' }}
                className={`h-full border-r border-[#F2DDD2] ${
                  rounds.resume.passed ? 'bg-sky-500' : 'bg-sky-200'
                }`}
                title={`Resume (15%): Score ${rounds.resume.score ?? 'N/A'}`}
              />
              <div
                style={{ width: '25%' }}
                className={`h-full border-r border-[#F2DDD2] ${
                  rounds.oa.passed ? 'bg-emerald-500' : 'bg-emerald-200'
                }`}
                title={`OA (25%): Score ${rounds.oa.score ?? 'N/A'}`}
              />
              <div
                style={{ width: '40%' }}
                className={`h-full border-r border-[#F2DDD2] ${
                  rounds.dsa.passed ? 'bg-[#FF7A48]' : 'bg-[#FFD0BC]'
                }`}
                title={`DSA (40%): Score ${rounds.dsa.score ?? 'N/A'}`}
              />
              <div
                style={{ width: '20%' }}
                className={`h-full ${
                  rounds.hr.passed ? 'bg-amber-500' : 'bg-amber-200'
                }`}
                title={`HR (20%): Score ${rounds.hr.score ?? 'N/A'}`}
              />
            </div>
            <div className="grid grid-cols-4 text-[11px] text-[#8C7268] text-center pt-1 font-medium">
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" /> Resume (15%)
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> OA (25%)
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#FF7A48]" /> DSA (40%)
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> HR (20%)
              </div>
            </div>
          </div>

          {/* Mathematical Expression */}
          <div className="p-3 bg-[#FFFAF7] border border-[#F2DDD2] rounded-2xl font-mono text-xs text-[#0A0706] flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[#8C7268]">Score = </span>
              <span className="text-sky-700 font-semibold">({rounds.resume.score ?? 0} &times; 0.15)</span>
              <span className="text-[#8C7268]"> + </span>
              <span className="text-emerald-700 font-semibold">({rounds.oa.score ?? 0} &times; 0.25)</span>
              <span className="text-[#8C7268]"> + </span>
              <span className="text-[#A83E14] font-semibold">({rounds.dsa.score ?? 0} &times; 0.40)</span>
              <span className="text-[#8C7268]"> + </span>
              <span className="text-amber-700 font-semibold">({rounds.hr.score ?? 0} &times; 0.20)</span>
            </div>
            <div className="font-semibold text-[#0A0706]">
              = {application.compositeScore !== null ? `${application.compositeScore}/100` : 'Pending'}
            </div>
          </div>
        </div>

        {/* Rank & Standing Card */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F2DDD2] flex flex-col justify-between space-y-4 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-base font-serif font-medium text-[#0A0706] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FF7A48]" /> Leaderboard Standing
            </h3>
            <p className="text-xs text-[#6B544A]">
              Anonymous cohort ranking based strictly on completed candidates.
            </p>
          </div>

          <div className="space-y-3 py-2 divide-y divide-[#F2DDD2]/70">
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#6B544A]">Public Rank</span>
              <span className="text-lg font-serif font-bold text-[#0A0706]">
                {application.rank !== null ? `#${application.rank}` : 'Unranked'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3">
              <span className="text-xs text-[#6B544A]">Percentile Tier</span>
              <span className="text-base font-semibold text-[#A83E14] flex items-center gap-1">
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
            <div className="flex items-center justify-between pt-3">
              <span className="text-xs text-[#6B544A]">Privacy Safeguard</span>
              <span className="text-xs text-[#1F7A3A] font-medium bg-[#E6F4EA] px-2 py-0.5 rounded-full border border-[#B7E1CD]">
                PII-Masked
              </span>
            </div>
          </div>

          <Link
            to="/leaderboard"
            className="w-full text-center py-2.5 px-3 rounded-full bg-[#FFFAF7] hover:bg-[#FBF1EA] text-xs text-[#0A0706] font-medium border border-[#F2DDD2] transition flex items-center justify-center gap-1.5"
          >
            <span>Open Public Leaderboard</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#8C7268]" />
          </Link>
        </div>
      </div>

      {/* 5. Multi-Round Pipeline Detailed Breakdown Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-serif font-medium text-[#0A0706] flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-[#FF7A48]" /> Complete Assessment Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Round 1: Resume */}
          <div className="p-5 rounded-3xl bg-white border border-[#F2DDD2] hover:border-[#FF7A48]/50 transition flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                  Weight: {rounds.resume.weight}%
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-[#0A0706] text-sm">Round 1: AI Resume Review</h3>
                <p className="text-xs text-[#6B544A] mt-1">ATS parsing & skills alignment scoring.</p>
              </div>
              <div className="pt-2 border-t border-[#F2DDD2] flex items-center justify-between text-xs">
                <span className="text-[#8C7268]">Cutoff: {rounds.resume.cutoff}/100</span>
                <span className="font-bold text-[#0A0706]">
                  {rounds.resume.score !== null ? `${rounds.resume.score}/100` : 'Not Started'}
                </span>
              </div>
            </div>

            <Link
              to="/resume"
              className="w-full text-center py-2 px-3 rounded-full bg-[#FFFAF7] hover:bg-[#FBF1EA] text-xs text-sky-700 font-medium border border-[#F2DDD2] transition flex items-center justify-center gap-1"
            >
              <span>{rounds.resume.status === 'COMPLETED' ? 'Review Resume' : 'Start Resume Audit'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Round 2: Online Assessment */}
          <div className="p-5 rounded-3xl bg-white border border-[#F2DDD2] hover:border-[#FF7A48]/50 transition flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Terminal className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Weight: {rounds.oa.weight}%
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-[#0A0706] text-sm">Round 2: Technical OA</h3>
                <p className="text-xs text-[#6B544A] mt-1">Domain MCQs and code implementation.</p>
              </div>
              <div className="pt-2 border-t border-[#F2DDD2] flex items-center justify-between text-xs">
                <span className="text-[#8C7268]">Cutoff: {rounds.oa.cutoff}/100</span>
                <span className="font-bold text-[#0A0706]">
                  {rounds.oa.score !== null ? `${rounds.oa.score}/100` : 'Not Started'}
                </span>
              </div>
            </div>

            <Link
              to="/oa"
              className="w-full text-center py-2 px-3 rounded-full bg-[#FFFAF7] hover:bg-[#FBF1EA] text-xs text-emerald-700 font-medium border border-[#F2DDD2] transition flex items-center justify-center gap-1"
            >
              <span>{rounds.oa.status === 'COMPLETED' ? 'View OA Results' : 'Take OA Challenge'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Round 3: AI DSA Interview */}
          <div className="p-5 rounded-3xl bg-white border border-[#F2DDD2] hover:border-[#FF7A48]/50 transition flex flex-col justify-between space-y-4 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 px-2.5 py-0.5 bg-[#FF7A48] text-[10px] font-bold text-white rounded-bl-xl">
              Primary 40%
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-[#FFEBE1] text-[#FF7A48] border border-[#FFD0BC]">
                  <Code2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#FFEBE1] text-[#A83E14] border border-[#FFD0BC]">
                  Weight: {rounds.dsa.weight}%
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-[#0A0706] text-sm">Round 3: AI DSA Interview</h3>
                <p className="text-xs text-[#6B544A] mt-1">Multi-persona voice & Monaco workspace.</p>
              </div>
              <div className="pt-2 border-t border-[#F2DDD2] flex items-center justify-between text-xs">
                <span className="text-[#8C7268]">Cutoff: {rounds.dsa.cutoff}/100</span>
                <span className="font-bold text-[#0A0706]">
                  {rounds.dsa.score !== null ? `${rounds.dsa.score}/100` : 'Not Started'}
                </span>
              </div>
            </div>

            <Link
              to="/interview/dsa"
              className="w-full text-center py-2 px-3 rounded-full bg-[#FFFAF7] hover:bg-[#FBF1EA] text-xs text-[#A83E14] font-medium border border-[#F2DDD2] transition flex items-center justify-center gap-1"
            >
              <span>{rounds.dsa.status === 'COMPLETED' ? 'Review DSA Session' : 'Start DSA Interview'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Round 4: AI HR Behavioral Interview */}
          <div className="p-5 rounded-3xl bg-white border border-[#F2DDD2] hover:border-[#FF7A48]/50 transition flex flex-col justify-between space-y-4 shadow-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                  Weight: {rounds.hr.weight}%
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-[#0A0706] text-sm">Round 4: AI HR Behavioral</h3>
                <p className="text-xs text-[#6B544A] mt-1">STAR methodology with voice & webcam.</p>
              </div>
              <div className="pt-2 border-t border-[#F2DDD2] flex items-center justify-between text-xs">
                <span className="text-[#8C7268]">Cutoff: {rounds.hr.cutoff}/100</span>
                <span className="font-bold text-[#0A0706]">
                  {rounds.hr.score !== null ? `${rounds.hr.score}/100` : 'Not Started'}
                </span>
              </div>
            </div>

            <Link
              to="/interview/hr"
              className="w-full text-center py-2 px-3 rounded-full bg-[#FFFAF7] hover:bg-[#FBF1EA] text-xs text-amber-700 font-medium border border-[#F2DDD2] transition flex items-center justify-center gap-1"
            >
              <span>{rounds.hr.status === 'COMPLETED' ? 'Review HR Session' : 'Start HR Interview'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 6. Official Placement / Decision Letter Banner */}
      <div
        className={`p-6 sm:p-7 rounded-3xl border ${
          finalOutcome.decision === 'SELECTED'
            ? 'bg-[#E6F4EA]/40 border-[#B7E1CD]'
            : finalOutcome.decision === 'WAITLISTED'
            ? 'bg-[#FEF3D6]/40 border-[#FAD77B]'
            : finalOutcome.decision === 'NOT_SELECTED'
            ? 'bg-[#FDE8E8]/40 border-[#F8B4B4]'
            : 'bg-white border-[#F2DDD2]'
        } space-y-4 shadow-sm`}
      >
        <div className="flex items-center gap-3">
          {finalOutcome.decision === 'SELECTED' && (
            <div className="p-2.5 rounded-2xl bg-[#E6F4EA] text-[#1F7A3A] border border-[#B7E1CD]">
              <Trophy className="w-5 h-5" />
            </div>
          )}
          {finalOutcome.decision === 'WAITLISTED' && (
            <div className="p-2.5 rounded-2xl bg-[#FEF3D6] text-[#8C5E00] border border-[#FAD77B]">
              <Clock className="w-5 h-5" />
            </div>
          )}
          {finalOutcome.decision === 'NOT_SELECTED' && (
            <div className="p-2.5 rounded-2xl bg-[#FDE8E8] text-[#9B1C1C] border border-[#F8B4B4]">
              <AlertCircle className="w-5 h-5" />
            </div>
          )}
          {finalOutcome.decision === 'INCOMPLETE' && (
            <div className="p-2.5 rounded-2xl bg-[#FFFAF7] text-[#8C7268] border border-[#F2DDD2]">
              <HelpCircle className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-base font-serif font-medium text-[#0A0706]">{finalOutcome.title}</h3>
            {finalOutcome.decidedAt && (
              <span className="text-[11px] text-[#8C7268]">
                Official Decision Recorded: {new Date(finalOutcome.decidedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-[#6B544A] leading-relaxed max-w-4xl">
          {finalOutcome.summary}
        </p>

        {finalOutcome.decision === 'SELECTED' && (
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <span className="text-xs text-[#1F7A3A] font-semibold bg-[#E6F4EA] px-3.5 py-1.5 rounded-full border border-[#B7E1CD]">
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
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF7A48] hover:bg-[#FF6428] text-white rounded-full text-xs font-semibold transition shadow-sm"
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
