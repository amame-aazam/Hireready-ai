import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Terminal,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code2,
  ShieldCheck,
  ChevronRight,
  Eye,
  Star,
  Shield,
} from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';

// Google G Multi-Color SVG Icon matching reference screenshot
const GoogleGIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5 shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const LandingPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python' | 'java'>('cpp');

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth/login');
    }
  };

  const codeSnippets = {
    cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int need = target - nums[i];
            if (seen.count(need)) return {seen[need], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
    python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, num in enumerate(nums):
            need = target - num
            if need in seen:
                return [seen[need], i]
            seen[num] = i
        return []`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int need = target - nums[i];
            if (seen.containsKey(need)) {
                return new int[] { seen.get(need), i };
            }
            seen.put(nums[i], i);
        }
        return new int[0];
    }
}`,
  };

  // Interviewer Panel List matching Screenshot 2
  const panelList = [
    {
      name: 'Vivan',
      tier: 'Bar-raiser',
      tierClass: 'bg-[#3B1510] text-[var(--theme-accent,#FF9E79)] border-[#5E271D]',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      description: 'Top-company bar. Optimal approach before any code.',
    },
    {
      name: 'Shreya',
      tier: 'Bar-raiser',
      tierClass: 'bg-[#3B1510] text-[var(--theme-accent,#FF9E79)] border-[#5E271D]',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      description: 'High-frequency FAANG questions. Clear communication matters.',
    },
    {
      name: 'Tanya',
      tier: 'Warm-up',
      tierClass: 'bg-[#182C1B] text-[#86EFAC] border-[#294B2E]',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      description: 'Brute force is fine to start. Hints when you stall.',
    },
    {
      name: 'Arjun',
      tier: 'Warm-up',
      tierClass: 'bg-[#182C1B] text-[#86EFAC] border-[#294B2E]',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      description: 'Friendly and patient. A good first interview.',
    },
  ];

  // Student Testimonials matching Screenshot 2
  const studentReviews = [
    {
      name: 'Japjot S.',
      badge: 'First interview',
      quote:
        'Best for mock interviews, and the problem asked in it very tricky, and feeling like a real interview.',
      stars: 5,
    },
    {
      name: 'Naivedhya J.',
      badge: 'First interview',
      quote: 'Great interview, I got my real experience.',
      stars: 5,
    },
    {
      name: 'Yaksh C.',
      badge: 'First interview',
      quote:
        'It was wonderful, although the assistant took the round according to the expertise.',
      stars: 5,
    },
  ];

  return (
    <div className="space-y-28 pb-28 text-[#F5E8DD]">
      {/* =========================================================================
          1. HERO SECTION (Matching Screenshot 1 & 2)
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Heading, Subtitle & Google Button */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A0C09] border border-[#3E1D19] text-[var(--theme-accent,#FF9E79)] text-xs font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent,#FF9E79)] animate-pulse"></span>
              <span>Spoken interviews · Live DSA coding · Honest feedback</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-serif font-normal text-[#F5E8DD] tracking-tight leading-[1.12] break-words">
              Face your <br />
              interview{' '}
              <span className="inline-flex items-center justify-center align-middle mx-1.5">
                <span className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#E87A50] via-[var(--theme-accent,#FF9E79)] to-[#FFF5EA] shadow-[0_0_35px_var(--theme-accent-shadow,rgba(255,158,121,0.8))] inline-block animate-orb-pulse"></span>
              </span>{' '}
              <br />
              <span className="italic font-normal text-[var(--theme-accent,#FF9E79)]">
                before it’s real.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#A88879] max-w-xl font-sans leading-relaxed">
              Spoken mock interviews with AI interviewers. Solve DSA problems on a shared editor,
              defend every line of your resume, take on behavioral questions, and read exactly what
              to fix.
            </p>

            {/* White Google Button & Free disclaimer matching Screenshot 2 */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={handleCtaClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 rounded-full bg-white text-zinc-900 font-semibold text-base shadow-[0_4px_24px_rgba(255,255,255,0.2)] hover:bg-zinc-100 hover:shadow-[0_6px_30px_rgba(255,255,255,0.3)] transition transform hover:-translate-y-0.5"
              >
                <GoogleGIcon />
                <span>Continue with Google</span>
              </button>

              <div className="text-xs sm:text-sm text-[#856658]">
                Your first interview is free. No card needed.
              </div>
            </div>
          </div>

          {/* Right Column: Social Proof Pill & Live Mockup Window */}
          <div className="lg:col-span-5 space-y-6 flex flex-col items-start lg:items-end">
            {/* Trusted by 10,000+ Students Pill */}
            <div className="w-full max-w-md p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#24110E] to-[#1A0C09] border border-[#52251D] shadow-[0_0_35px_rgba(82,37,29,0.35)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#3B1914] border border-[var(--theme-accent,#FF9E79)]/50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-[var(--theme-accent,#FF9E79)]" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[var(--theme-accent,#FF9E79)] font-bold">
                  TRUSTED BY
                </div>
                <div className="text-2xl font-serif font-medium text-[#F5E8DD]">
                  10,000+ students
                </div>
              </div>
            </div>

            {/* Split Live Mockup Window (Exact match to Screenshot 1 & 2) */}
            <div className="w-full max-w-md rounded-3xl bg-[#140705]/95 border border-[#3E1D19] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden space-y-3">
              {/* Top Window Bar */}
              <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-[#2C130F]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-red-300 font-semibold">Live · 09:49</span>
                </div>
                <div className="text-xs text-[#D4B8A8] font-sans font-medium">Coding round</div>
                <div className="flex items-center gap-1">
                  {(['cpp', 'python', 'java'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-1.5 py-0.5 rounded text-[10px] transition ${
                        selectedLanguage === lang
                          ? 'bg-[#331713] text-[var(--theme-accent,#FF9E79)] border border-[#5E271D] font-bold'
                          : 'text-[#856658] hover:text-[#F5E8DD]'
                      }`}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'python' ? 'Py' : 'Java'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Split Content: Video Tiles + Code Editor */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
                {/* Left: Interviewer & Candidate Video Cards */}
                <div className="col-span-1 sm:col-span-5 flex sm:flex-col gap-2.5">
                  {/* Interviewer Riddhi */}
                  <div className="relative rounded-2xl overflow-hidden bg-[#1E0E0B] border border-[#3E1D19] aspect-[4/3] flex-1 sm:flex-none flex flex-col justify-between p-2.5 min-h-[140px]">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
                      alt="Riddhi AI Interviewer"
                      className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    <div className="relative z-10 flex justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    </div>
                    <div className="relative z-10 bg-black/60 backdrop-blur-sm rounded-lg p-1 text-[10px]">
                      <div className="font-semibold text-white leading-tight">Riddhi</div>
                      <div className="text-[9px] text-[#FF9E79]">AI interviewer</div>
                    </div>
                    {/* Audio Waveform */}
                    <div className="relative z-10 flex items-center justify-center gap-0.5 pt-1">
                      {[3, 8, 12, 16, 10, 5, 9, 14, 8, 3].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}px` }}
                          className="w-0.5 bg-[var(--theme-accent,#FF9E79)] rounded-full animate-pulse"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Candidate Arpita S. (you) matching Screenshot 2 */}
                  <div className="rounded-2xl bg-[#1E0E0B]/90 border border-[#3E1D19] p-2.5 flex-1 sm:flex-none flex flex-col items-center justify-center text-center space-y-1.5 min-h-[140px]">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E293B] to-[#334155] border border-[#64748B]/50 flex items-center justify-center shadow-inner">
                      <Shield className="w-5 h-5 text-[var(--theme-accent,#FF9E79)]" />
                    </div>
                    <div className="text-[11px] font-semibold text-[#F5E8DD]">
                      Arpita S. <span className="text-[#856658] font-normal">(you)</span>
                    </div>
                    {/* Candidate Waveform */}
                    <div className="flex items-center justify-center gap-0.5">
                      {[3, 6, 10, 14, 8, 4, 9, 12, 6, 3].map((h, i) => (
                        <span
                          key={i}
                          style={{ height: `${h}px` }}
                          className="w-0.5 bg-[#86EFAC] rounded-full opacity-80"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Code Editor & Live Eye Indicator */}
                <div className="col-span-1 sm:col-span-7 flex flex-col justify-between bg-[#0C0403] rounded-2xl border border-[#3E1D19] p-3 text-[11px] font-mono leading-tight overflow-hidden relative">
                  <div className="space-y-0.5 text-[#D4B8A8] overflow-y-auto max-h-[180px] select-none scrollbar-thin">
                    <pre className="text-[10px] sm:text-[11px] leading-snug font-mono text-[#D4B8A8]">
                      <code>{codeSnippets[selectedLanguage]}</code>
                    </pre>
                  </div>

                  {/* Floating Eye Overlay Badge (Exact match to Screenshot 2) */}
                  <div className="mt-3 px-2.5 py-1.5 rounded-full bg-[#24100C]/90 border border-[var(--theme-accent-border,#5E2717)] text-[10px] text-[var(--theme-accent,#FF9E79)] flex items-center gap-1.5 shadow-md">
                    <Eye className="w-3.5 h-3.5 text-[var(--theme-accent,#FF9E79)] shrink-0" />
                    <span className="truncate">Your interviewer sees your code as you type</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. TWO-COLUMN SECTION: "Your AI Powered Panel is ready" & "Our Students Trust Us"
             (Exact match to Screenshot 2)
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10" id="panel">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Meet the Panel */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-3xl sm:text-4xl font-serif text-[#F5E8DD] font-normal leading-tight">
              Your AI Powered Panel <br />
              is ready. Are You?
            </h2>

            <div className="space-y-3">
              {panelList.map((panel) => (
                <div
                  key={panel.name}
                  onClick={() => navigate('/interview/dsa')}
                  className="p-4 rounded-2xl bg-[#1A0B09]/90 border border-[#3E1D19] hover:border-[#5E271D] hover:bg-[#24100C] transition flex items-center gap-4 cursor-pointer group"
                >
                  <img
                    src={panel.avatar}
                    alt={panel.name}
                    className="w-12 h-12 rounded-full object-cover border border-[#5E271D] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base text-[#F5E8DD] group-hover:text-[var(--theme-accent,#FF9E79)] transition">
                        {panel.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold border ${panel.tierClass}`}
                      >
                        {panel.tier}
                      </span>
                    </div>
                    <p className="text-xs text-[#A88879] mt-0.5 truncate">{panel.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Our Students Trust Us */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#F5E8DD] font-normal leading-tight">
                Our Students Trust Us
              </h2>
              <p className="text-sm text-[#A88879] mt-1">From students preparing for placements</p>
            </div>

            <div className="space-y-3">
              {studentReviews.map((review) => (
                <div
                  key={review.name}
                  className="p-5 rounded-2xl bg-[#1A0B09]/90 border border-[#3E1D19] space-y-3 shadow-sm"
                >
                  {/* Gold Stars */}
                  <div className="flex items-center gap-1 text-[#FFB800]">
                    {[...Array(review.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#FFB800]" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-[#D4B8A8] italic leading-relaxed">
                    &ldquo;{review.quote}&rdquo;
                  </p>

                  {/* Reviewer Details */}
                  <div className="flex items-center gap-2.5 pt-1">
                    <div className="w-8 h-8 rounded-full bg-[#2A130E] border border-[#5E271D] flex items-center justify-center">
                      <Shield className="w-4 h-4 text-[var(--theme-accent,#FF9E79)]" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#F5E8DD] leading-none">
                        {review.name}
                      </div>
                      <div className="text-[11px] text-[#856658] mt-0.5">{review.badge}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. HIREREADY 5-STEP PLACEMENT PIPELINE (Project Features & Content)
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8" id="pipeline">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--theme-accent-bg,#2D140C)] border border-[var(--theme-accent-border,#5E2717)] text-xs text-[var(--theme-accent,#FF9E79)] font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Complete 5-Stage Journey</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F5E8DD]">
            Everything needed to get hired, under one roof.
          </h2>
          <p className="text-sm sm:text-base text-[#A88879] max-w-xl mx-auto leading-relaxed">
            From your first resume ATS scan to live OA coding, spoken AI interviews, and placement
            certificates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {[
            {
              step: 'Stage 01',
              title: 'AI Resume & ATS Checker',
              desc: 'Instant keyword matching, formatting audits, and actionable scoring tailored for top engineering placements.',
              path: '/resume',
              icon: FileText,
              badge: 'Screening Round',
            },
            {
              step: 'Stage 02',
              title: 'Online Assessment (OA)',
              desc: 'Full-fledged coding test sandbox with Monaco editor, multi-language compiler, and hidden test cases.',
              path: '/oa',
              icon: Terminal,
              badge: 'Timed OA',
            },
            {
              step: 'Stage 03',
              title: 'Technical DSA Interview',
              desc: 'Spoken dialogue with calibrated FAANG personas, real-time shared code editor, and algorithmic grilling.',
              path: '/interview/dsa',
              icon: Code2,
              badge: 'Live Technical',
            },
            {
              step: 'Stage 04',
              title: 'AI Resume Defense Round',
              desc: 'Hard-hitting cross-examination on your actual resume projects, technical architecture choices, and metrics.',
              path: '/interview/resume-defense',
              icon: ShieldCheck,
              badge: 'Deep Dive',
            },
            {
              step: 'Stage 05',
              title: 'AI HR Behavioral Round',
              desc: 'STAR-method leadership, culture fit, and conflict-handling interview with Kavya and spoken feedback.',
              path: '/interview/hr',
              icon: Users,
              badge: 'Culture & HR',
            },
            {
              step: 'Final Outcome',
              title: 'Leaderboard & Certificate',
              desc: 'Percentile rankings across all rounds, diagnosis scorecards, and verifiable PDF Placement Readiness Certificate.',
              path: '/leaderboard',
              icon: Award,
              badge: 'Verification',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.path}
                className="p-6 rounded-3xl bg-[#1A0B09]/85 border border-[#3E1D19] hover:border-[var(--theme-accent-border,#5E2717)] hover:bg-[#24100C] transition shadow-sm flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-[var(--theme-accent-bg,#2D140C)] text-[var(--theme-accent,#FF9E79)] border border-[var(--theme-accent-border,#5E2717)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-semibold text-[var(--theme-accent,#FF9E79)] bg-[var(--theme-accent-bg,#2D140C)] px-3 py-1 rounded-full border border-[var(--theme-accent-border,#5E2717)]">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs uppercase tracking-wider font-bold text-[#856658]">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-serif font-medium text-[#F5E8DD] group-hover:text-[var(--theme-accent,#FF9E79)] flex items-center justify-between transition">
                      <span>{item.title}</span>
                      <ArrowRight className="w-4 h-4 text-[var(--theme-accent,#FF9E79)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                  </div>

                  <p className="text-sm text-[#A88879] leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-2 text-xs font-semibold text-[var(--theme-accent,#FF9E79)] flex items-center gap-1">
                  <span>Enter round</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          4. "ONE ROUND, THREE PARTS, ALL OUT LOUD" (Screenshot 5 / Reference)
          ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10" id="how-it-works">
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-widest font-bold text-[var(--theme-accent,#FF9E79)]">
            How a round works
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F5E8DD] tracking-tight">
            One round, three parts, all out loud.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-[#1A0B09]/85 border border-[#3E1D19] hover:border-[#5E271D] hover:bg-[#24100C] transition-all space-y-4">
            <div className="text-4xl font-serif italic text-[var(--theme-accent,#FF9E79)]">01</div>
            <h3 className="text-xl font-serif font-medium text-[#F5E8DD]">Introduction</h3>
            <p className="text-sm text-[#A88879] leading-relaxed">
              A few minutes on you. It has read your resume, so it asks about the projects you
              actually built, the tools you used, and why you made specific technical decisions.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#1A0B09]/85 border border-[#3E1D19] hover:border-[#5E271D] hover:bg-[#24100C] transition-all space-y-4">
            <div className="text-4xl font-serif italic text-[var(--theme-accent,#FF9E79)]">02</div>
            <h3 className="text-xl font-serif font-medium text-[#F5E8DD]">Live coding</h3>
            <p className="text-sm text-[#A88879] leading-relaxed">
              A DSA problem on a shared editor, in C++, Java, Python or JavaScript. It gives hints
              when you stall, never the answer, and challenges your time complexity.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-[#1A0B09]/85 border border-[#3E1D19] hover:border-[#5E271D] hover:bg-[#24100C] transition-all space-y-4">
            <div className="text-4xl font-serif italic text-[var(--theme-accent,#FF9E79)]">03</div>
            <h3 className="text-xl font-serif font-medium text-[#F5E8DD]">Feedback</h3>
            <p className="text-sm text-[#A88879] leading-relaxed">
              Spoken the moment you finish, built on what happened in the call, ending with the one
              thing to fix first, along with a comprehensive scorecard breakdown.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. BOTTOM PRE-FOOTER CTA SECTION (Exact match to Screenshot 3)
          ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center pt-8 pb-4">
        <div className="space-y-6">
          {/* Big Centered Glowing Peach Orb */}
          <div className="flex justify-center">
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#E87A50] via-[var(--theme-accent,#FF9E79)] to-[#FFF5EA] shadow-[0_0_80px_var(--theme-accent-shadow,rgba(255,158,121,0.85))] animate-orb-pulse"></div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-[#F5E8DD] font-normal tracking-tight break-words">
            Your first interview is on us.
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-[#A88879] max-w-md mx-auto px-4">
            Sign in, set up in a minute, and start talking.
          </p>

          {/* White Google Button */}
          <div className="pt-2 px-4">
            <button
              type="button"
              onClick={handleCtaClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 sm:px-9 py-3.5 sm:py-4 rounded-full bg-white text-zinc-900 font-semibold text-base shadow-[0_4px_24px_rgba(255,255,255,0.2)] hover:bg-zinc-100 hover:shadow-[0_6px_30px_rgba(255,255,255,0.3)] transition transform hover:-translate-y-0.5"
            >
              <GoogleGIcon />
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Disclaimers matching Screenshot 3 */}
          <div className="space-y-1 text-xs text-[#856658] pt-2">
            <div>One free interview per student, while this month&apos;s free slots last.</div>
            <div>
              We use your name and email address only, to keep your practice sessions together.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
