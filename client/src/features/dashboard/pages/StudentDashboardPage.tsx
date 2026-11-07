import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { fetchStudentDashboard, DashboardResponse } from '../api/dashboardApi';
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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal text-[#F5E8DD] tracking-tight leading-[1.12]">
            <span className="italic font-light">{candidateName},</span> your <br />
            interviewer is ready.
          </h1>

          {/* Soundwave + Glowing Orb */}
          <div className="flex items-center gap-4 py-2">
            {/* Glowing Golden Orb */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#F0B87A] to-[#E2A664] shadow-[0_0_30px_rgba(240,184,122,0.7)] flex items-center justify-center shrink-0">
              <span className="w-3.5 h-3.5 rounded-full bg-[#FFF5EB] opacity-80" />
            </div>

            {/* Dynamic Soundwave Bars */}
            <div className="flex items-center gap-1">
              {[14, 22, 34, 18, 42, 28, 50, 36, 20, 44, 30, 16, 38, 24, 46, 32, 18, 28, 14].map(
                (h, idx) => (
                  <span
                    key={idx}
                    style={{ height: `${h}px` }}
                    className="w-[3px] rounded-full bg-gradient-to-t from-[#D49B6A] to-[#F0C08B] opacity-90 transition-all duration-300"
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
          {/* Trusted Card */}
          <div className="p-4 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] flex items-center gap-3 shadow-lg relative overflow-hidden backdrop-blur-md">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#F0B87A] to-[#E2A664] flex items-center justify-center text-[#140808] shrink-0 font-bold shadow-md">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#A88879] block">
                TRUSTED BY
              </span>
              <span className="text-base font-bold text-[#F5E8DD]">10,000+ students</span>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40">
              <Shield className="w-12 h-12 text-[#F0B87A]/20" />
            </div>
          </div>

          {/* Rank: Soldier Card */}
          <div className="p-6 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] shadow-xl space-y-4 backdrop-blur-md relative overflow-hidden">
            <div className="flex items-start gap-4">
              {/* 3D Shield Crest Representation */}
              <div className="w-16 h-20 rounded-2xl bg-gradient-to-b from-[#2D1A14] via-[#1C0E0B] to-[#120705] border border-[#522E22] flex flex-col items-center justify-center shrink-0 shadow-inner relative group">
                <Shield className="w-9 h-9 text-[#F0B87A] fill-[#F0B87A]/20" />
                <span className="text-[9px] font-bold text-[#F0B87A] mt-1 uppercase tracking-wider">I</span>
              </div>

              <div className="space-y-1 flex-1">
                <span className="text-[10px] uppercase font-semibold text-[#A88879]">Your rank</span>
                <h3 className="text-xl font-serif font-bold text-[#F5E8DD] tracking-wide">
                  SOLDIER
                </h3>
                <p className="text-xs text-[#A88879] leading-relaxed">
                  Fresh recruit. You know the basics; now learn to think out loud.
                </p>
              </div>
            </div>

            {/* Points Progress Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#A88879]">
                  <strong className="text-[#F0B87A]">
                    {application.compositeScore !== null ? Math.max(0, 200 - application.compositeScore * 2) : 100}
                  </strong>{' '}
                  points to Knight
                </span>
                <span className="text-[#A88879] font-mono">
                  {application.compositeScore !== null ? application.compositeScore * 2 : 100} / 200
                </span>
              </div>

              <div className="h-2 rounded-full bg-[#24110E] border border-[#3E1D19] overflow-hidden flex">
                <div
                  style={{
                    width: `${application.compositeScore !== null ? Math.min(100, application.compositeScore) : 50}%`,
                  }}
                  className="h-full bg-gradient-to-r from-[#856658] via-[#BF9E8F] to-[#F0B87A] rounded-full transition-all"
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
            {[
              { rank: 1, name: 'Ananya S.', score: '1,480', tier: 'purple' },
              { rank: 2, name: 'Rohan I.', score: '1,215', tier: 'purple' },
              { rank: 3, name: 'Priya N.', score: '940', tier: 'orange' },
              { rank: 4, name: 'Suraj Gupta', score: '826', tier: 'bronze' },
              { rank: 5, name: 'Siddharth M.', score: '812', tier: 'bronze' },
            ].map((item) => (
              <div
                key={item.name}
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
                <span className="font-serif font-bold text-[#F5E8DD] text-sm">{item.score}</span>
              </div>
            ))}

            {/* YOU ARE HERE HIGHLIGHT ROW from Screenshot 2 */}
            <div className="mt-3 p-3.5 rounded-2xl bg-[#2D1A14] border border-[#522E22] flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-3">
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#F0B87A] bg-[#3E2219] px-2 py-0.5 rounded-full border border-[#54321C]">
                  YOU ARE HERE
                </span>
                <Shield className="w-4 h-4 text-[#F0B87A] fill-[#F0B87A]/30" />
                <span className="font-semibold text-[#F5E8DD] text-xs">You ({candidateName})</span>
              </div>
              <span className="font-serif font-bold text-[#F0B87A] text-base">
                {application.compositeScore !== null ? application.compositeScore : 100}
              </span>
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

      {/* 4. WHAT STUDENTS SAY (Exact replica of Screenshot 3) */}
      <div className="space-y-4 pt-4">
        <h2 className="text-2xl sm:text-3xl font-serif font-normal text-[#F5E8DD]">
          What students say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              quote:
                'Best for mock interviews, and the problem asked in it very tricky, and feeling like a real interview.',
              author: 'Japjot S.',
              sub: 'First interview',
            },
            {
              quote: 'Great interview, I got my real experience.',
              author: 'Naivedhya J.',
              sub: 'First interview',
            },
            {
              quote:
                'It was wonderful, although the assistant took the round according to the expertise.',
              author: 'Yaksh C.',
              sub: 'First interview',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] shadow-xl space-y-4 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* 5 Stars in Gold */}
                <div className="flex items-center gap-1 text-[#F0B87A] text-sm tracking-wider">
                  ★★★★★
                </div>
                <p className="text-xs text-[#F5E8DD] leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#3E1D19]">
                <div className="w-7 h-7 rounded-xl bg-[#2D1A14] border border-[#522E22] flex items-center justify-center text-[#F0B87A]">
                  <Shield className="w-3.5 h-3.5 fill-[#F0B87A]/20" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#F5E8DD]">{item.author}</div>
                  <div className="text-[10px] text-[#A88879]">{item.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. OFFICIAL PLACEMENT / DECISION CERTIFICATE BANNER */}
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
