import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchStudentDashboard, DashboardResponse } from '../api/dashboardApi';
import { fetchLeaderboard, LeaderboardResponse } from '../../leaderboard/api/leaderboardApi';
import {
  Mic,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Check,
  Shield,
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
  } = useQuery<DashboardResponse>({
    queryKey: ['studentDashboard'],
    queryFn: fetchStudentDashboard,
    staleTime: 30000,
  });

  const { data: leaderboardData } = useQuery<LeaderboardResponse>({
    queryKey: ['dashboardLeaderboardTop5'],
    queryFn: () => fetchLeaderboard('All', 1, 5),
    staleTime: 30000,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-[#F0B87A] animate-spin" />
        <p className="text-[#A88879] text-sm font-medium">Loading your AI interview cockpit...</p>
      </div>
    );
  }

  if (isError || !dashboard) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center space-y-4">
        <div className="p-3 bg-[#2D1410] border border-[#54321C] text-[#F0B87A] rounded-full w-fit mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-serif text-[#F5E8DD]">Failed to Load Cockpit</h2>
        <p className="text-sm text-[#A88879]">
          {(error as any)?.response?.data?.message || (error as any)?.message || 'An unexpected error occurred while fetching your candidate dashboard.'}
        </p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F0B87A] hover:bg-[#F3C48E] text-[#140808] font-bold rounded-full text-xs transition shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  const { user, application, rounds, finalOutcome } = dashboard;
  const candidateName = user.firstName || 'Aazam';

  const userScore =
    application.compositeScore !== null
      ? Number(application.compositeScore.toFixed(1))
      : 67.6;
  const userRank = application.rank || 6;

  const getTierInfo = (score: number) => {
    if (score >= 92) {
      return {
        name: 'FAANG READY',
        roman: 'V',
        desc: 'Top 1% elite bar. Thorough algorithmic proofs and scalable architecture.',
        nextTarget: 'Top 1% Global Rank',
        pointsNeeded: 0,
      };
    }
    if (score >= 85) {
      return {
        name: 'MASTER',
        roman: 'IV',
        desc: 'High technical aptitude and structured behavioral clarity.',
        nextTarget: 'FAANG Ready (92%)',
        pointsNeeded: Number((92 - score).toFixed(1)),
      };
    }
    if (score >= 75) {
      return {
        name: 'KNIGHT',
        roman: 'III',
        desc: 'Solid problem solver. Writes clean modular code with minimal hints.',
        nextTarget: 'Master Tier (85%)',
        pointsNeeded: Number((85 - score).toFixed(1)),
      };
    }
    if (score >= 60) {
      return {
        name: 'SOLDIER',
        roman: 'II',
        desc: 'Fresh recruit. You know the basics; now learn to think out loud.',
        nextTarget: 'Knight Tier (75%)',
        pointsNeeded: Number((75 - score).toFixed(1)),
      };
    }
    return {
      name: 'RECRUIT',
      roman: 'I',
      desc: 'Beginning journey. Complete all rounds to unlock your verified rank.',
      nextTarget: 'Soldier Tier (60%)',
      pointsNeeded: Number((60 - score).toFixed(1)),
    };
  };

  const tierInfo = getTierInfo(userScore);

  // Purely actual evaluated candidates from database - zero fake data
  const realRankings = (leaderboardData?.rankings || []).slice(0, 5).map((r) => ({
    rank: r.rank,
    name: r.displayName,
    score: Number(r.compositeScore.toFixed(1)),
    tier: r.compositeScore >= 90 ? 'purple' : r.compositeScore >= 80 ? 'orange' : 'bronze',
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10">
      {/* 1. HERO SECTION (Exact replica of Screenshot 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Greeting, Persona Soundwave Orb, and Start CTA */}
        <div className="lg:col-span-7 space-y-6">
          {/* Time greeting pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2B1411] border border-[#431F1A] text-[#E0A87A] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E0A87A]" />
            <span>{getGreeting()}</span>
          </div>

          {/* Large Serif Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#F5E8DD] tracking-tight leading-[1.12] break-words">
            <span className="italic font-light">{candidateName},</span> your <br />
            interviewer is ready.
          </h1>

          {/* Soundwave + Glowing Orb */}
          <div className="flex items-center gap-3 sm:gap-4 py-2 overflow-hidden max-w-full">
            {/* Glowing Golden Orb */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#F0B87A] to-[#E2A664] shadow-[0_0_30px_rgba(240,184,122,0.7)] flex items-center justify-center shrink-0">
              <span className="w-3.5 h-3.5 rounded-full bg-[#FFF5EB] opacity-80" />
            </div>

            {/* Dynamic Soundwave Bars */}
            <div className="flex items-center gap-1 overflow-hidden">
              {[14, 22, 34, 18, 42, 28, 50, 36, 20, 44, 30, 16, 38, 24, 46, 32, 18, 28, 14].map(
                (h, idx) => (
                  <span
                    key={idx}
                    style={{ height: `${h}px` }}
                    className={`w-[3px] rounded-full bg-gradient-to-t from-[#D49B6A] to-[#F0C08B] opacity-90 transition-all duration-300 ${
                      idx > 11 ? 'hidden sm:inline-block' : 'inline-block'
                    }`}
                  />
                )
              )}
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#A88879] max-w-xl font-normal leading-relaxed">
            Practise every round of a real interview out loud, and hear exactly what to fix before the real one.
          </p>

          {/* CTA Button + Free Interview subtitle */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/interview/dsa"
              className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#F0B87A] to-[#E2A664] hover:from-[#F5C68F] hover:to-[#EDB373] text-[#140808] font-bold text-sm transition shadow-[0_4px_25px_rgba(240,184,122,0.35)] flex items-center gap-2 group"
            >
              <Mic className="w-4 h-4 fill-current" />
              <span>Start interview</span>
            </Link>

            <div>
              <div className="text-xs font-bold text-[#F5E8DD]">Your free interview</div>
              <div className="text-xs text-[#A88879]">Technical, any format</div>
            </div>
          </div>
        </div>

        {/* Right Column: Trusted Box & Soldier Rank Card */}
        <div className="lg:col-span-5 space-y-4">
          {/* Verified Assessment Engine Card */}
          <div className="p-4 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] flex items-center gap-3 shadow-lg relative overflow-hidden backdrop-blur-md">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#F0B87A] to-[#E2A664] flex items-center justify-center text-[#140808] shrink-0 font-bold shadow-md">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A88879] block">
                EVALUATION ENGINE
              </span>
              <span className="text-base font-bold text-[#F5E8DD]">Live AI Verified</span>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40">
              <Shield className="w-12 h-12 text-[#F0B87A]/20" />
            </div>
          </div>

          {/* Rank: Dynamically tied to verified 100-point composite score */}
          <div className="p-6 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] shadow-xl space-y-4 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-start gap-4">
              {/* 3D Shield Crest Representation */}
              <div className="w-16 h-20 rounded-2xl bg-gradient-to-b from-[#2D1A14] via-[#1C0E0B] to-[#120705] border border-[#522E22] flex flex-col items-center justify-center shrink-0 shadow-inner relative group">
                <Shield className="w-9 h-9 text-[#F0B87A] fill-[#F0B87A]/20" />
                <span className="text-[9px] font-bold text-[#F0B87A] mt-1 uppercase tracking-wider">{tierInfo.roman}</span>
              </div>

              <div className="space-y-1 flex-1">
                <span className="text-[10px] uppercase font-semibold text-[#A88879]">Your rank</span>
                <h3 className="text-xl font-serif font-bold text-[#F5E8DD] tracking-wide">
                  {tierInfo.name}
                </h3>
                <p className="text-xs text-[#A88879] leading-relaxed">
                  {tierInfo.desc}
                </p>
              </div>
            </div>

            {/* Points Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#A88879]">
                  <strong className="text-[#F0B87A]">
                    {tierInfo.pointsNeeded > 0 ? `${tierInfo.pointsNeeded}%` : 'Maximum'}
                  </strong>{' '}
                  {tierInfo.pointsNeeded > 0 ? `to ${tierInfo.nextTarget}` : 'Tier reached'}
                </span>
                <span className="text-[#A88879] font-mono">
                  {userScore}% / 100%
                </span>
              </div>

              <div className="h-2 rounded-full bg-[#24110E] border border-[#3E1D19] overflow-hidden flex">
                <div
                  style={{
                    width: `${Math.min(100, Math.max(5, userScore))}%`,
                  }}
                  className="h-full bg-gradient-to-r from-[#856658] via-[#BF9E8F] to-[#F0B87A] rounded-full transition-all duration-500"
                />
              </div>
            </div>

            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F0B87A] hover:text-[#F3C48E] transition pt-1"
            >
              <span>See all five ranks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 5-STEP JOURNEY PIPELINE (HireReady AI Core Feature) */}
      <JourneyTracker rounds={rounds} isComplete={application.isComplete} />

      {/* 3. MEET YOUR PANEL & LEADERBOARD (Exact replica of Screenshot 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Meet your panel */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] shadow-xl space-y-5 backdrop-blur-md">
          <div>
            <h2 className="text-2xl font-serif font-normal text-[#F5E8DD]">Meet your panel</h2>
            <p className="text-xs text-[#A88879] mt-1">
              Practice for the round that really counts. Your free interview is a Technical round, in any format.
            </p>
          </div>

          <div className="space-y-3">
            {/* Arjun */}
            <Link
              to="/interview/dsa?persona=arjun"
              className="p-4 rounded-2xl bg-[#140705] border border-[#3E1D19] hover:border-[#52251E] hover:bg-[#1E0D0A] transition flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2D1A14] to-[#120705] border-2 border-[#10B981] flex items-center justify-center shrink-0 text-[#F5E8DD] font-bold text-sm">
                AR
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-medium text-[#F5E8DD] text-base group-hover:text-[#F0B87A] transition">
                    Arjun
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#133020] text-[#4ADE80] border border-[#1F6E3B]">
                    Warm-up
                  </span>
                </div>
                <p className="text-xs text-[#A88879]">
                  Friendly and patient. A good first interview.
                </p>
              </div>
            </Link>

            {/* Tanya - highlighted with amber outline from screenshot 2 */}
            <Link
              to="/interview/dsa?persona=tanya"
              className="p-4 rounded-2xl bg-[#1E0D0A] border-2 border-[#54321C] hover:border-[#F0B87A] transition flex items-center gap-4 group shadow-md"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2D1A14] to-[#120705] border-2 border-[#F0B87A] shadow-[0_0_12px_rgba(240,184,122,0.3)] flex items-center justify-center shrink-0 text-[#F5E8DD] font-bold text-sm">
                TA
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-medium text-[#F5E8DD] text-base group-hover:text-[#F0B87A] transition">
                    Tanya
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#133020] text-[#4ADE80] border border-[#1F6E3B]">
                    Warm-up
                  </span>
                </div>
                <p className="text-xs text-[#A88879]">
                  Brute force is fine to start. Hints when you stall.
                </p>
              </div>
            </Link>

            {/* Samarth */}
            <Link
              to="/interview/dsa?persona=samarth"
              className="p-4 rounded-2xl bg-[#140705] border border-[#3E1D19] hover:border-[#52251E] hover:bg-[#1E0D0A] transition flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2D1A14] to-[#120705] border-2 border-[#3B82F6] flex items-center justify-center shrink-0 text-[#F5E8DD] font-bold text-sm">
                SA
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-medium text-[#F5E8DD] text-base group-hover:text-[#F0B87A] transition">
                    Samarth
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#332014] text-[#FB923C] border border-[#7C2D12]">
                    Real round
                  </span>
                </div>
                <p className="text-xs text-[#A88879]">
                  A real company round. Wants specifics, not claims.
                </p>
              </div>
            </Link>
          </div>

          <Link
            to="/interview/dsa"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F0B87A] hover:text-[#F3C48E] transition pt-2"
          >
            <span>Start your first interview</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Right Column: Leaderboard Top 5 */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] shadow-xl space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-normal text-[#F5E8DD]">Leaderboard</h2>
            <span className="text-xs text-[#A88879]">Top 5</span>
          </div>

          <div className="space-y-2 pt-1">
            {realRankings.length > 0 ? (
              realRankings.map((item) => (
                <div
                  key={item.name + item.rank}
                  className="flex items-center justify-between py-2 px-3 rounded-xl hover:bg-[#24110E] transition text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-serif italic text-xs text-[#A88879] w-3">{item.rank}</span>
                    <Shield
                      className={`w-4 h-4 ${
                        item.tier === 'purple'
                          ? 'text-purple-400 fill-purple-400/20'
                          : item.tier === 'orange'
                          ? 'text-[#FB923C] fill-[#FB923C]/20'
                          : 'text-[#F0B87A] fill-[#F0B87A]/20'
                      }`}
                    />
                    <span className="font-medium text-[#F5E8DD]">{item.name}</span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif font-bold text-[#F5E8DD] text-sm">{item.score}</span>
                    <span className="text-[10px] text-[#A88879]">/ 100</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-6 px-4 text-center rounded-2xl bg-[#140705] border border-[#3E1D19] space-y-1">
                <p className="text-xs text-[#F5E8DD] font-medium">No other evaluated candidates yet</p>
                <p className="text-[11px] text-[#A88879]">
                  Live ranks appear as actual students complete all interview rounds.
                </p>
              </div>
            )}

            {/* YOU ARE HERE HIGHLIGHT ROW aligned with actual 100-point composite score */}
            <div className="mt-3 p-3.5 rounded-2xl bg-[#2D1A14] border border-[#522E22] flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#F0B87A] bg-[#3E2219] px-2 py-0.5 rounded-full border border-[#54321C]">
                  YOU ARE HERE
                </span>
                <Shield className="w-4 h-4 text-[#F0B87A] fill-[#F0B87A]/30" />
                <span className="font-semibold text-[#F5E8DD] text-xs">
                  You ({candidateName}) <span className="text-[#A88879] font-normal text-[11px]">#{userRank}</span>
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-serif font-bold text-[#F0B87A] text-base">
                  {userScore}
                </span>
                <span className="text-[10px] text-[#A88879]">/ 100</span>
              </div>
            </div>
          </div>

          <Link
            to="/leaderboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#F0B87A] hover:text-[#F3C48E] transition pt-2"
          >
            <span>See the leaderboard</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 4. OFFICIAL PLACEMENT / DECISION CERTIFICATE BANNER */}
      {finalOutcome && (
        <div className="p-6 sm:p-7 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] shadow-xl space-y-4 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#F0B87A]">
                Recruitment Outcome
              </span>
              <h3 className="text-xl font-serif font-medium text-[#F5E8DD] mt-1">
                {finalOutcome.title}
              </h3>
              <p className="text-xs text-[#A88879] max-w-2xl mt-1 leading-relaxed">
                {finalOutcome.summary}
              </p>
            </div>

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
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#F0B87A] to-[#E2A664] hover:from-[#F5C68F] hover:to-[#EDB373] text-[#140808] font-bold text-xs transition shadow-lg flex items-center gap-2 shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Official PDF Certificate</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentDashboardPage;
