import React, { useState, useEffect } from 'react';
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

    // Live real-time clock updating every second
  const [liveClock, setLiveClock] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setLiveClock(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Formatted code lines with line numbers & Monaco-style syntax coloring
  const codeLines: Record<'cpp' | 'python' | 'java', { num: number; text: React.ReactNode }[]> = {
    cpp: [
      { num: 1, text: <span><span className="text-[#FF9E79] font-medium">class</span> <span className="text-[#FCD34D]">Solution</span> &#123;</span> },
      { num: 2, text: <span className="text-[#FF9E79] font-medium">public:</span> },
      { num: 3, text: <span className="pl-3"><span className="text-[#38BDF8]">vector</span>&lt;<span className="text-[#38BDF8]">int</span>&gt; <span className="text-[#FCD34D]">twoSum</span>(<span className="text-[#38BDF8]">vector</span>&lt;<span className="text-[#38BDF8]">int</span>&gt;&amp; nums, <span className="text-[#38BDF8]">int</span> target) &#123;</span> },
      { num: 4, text: <span className="pl-6"><span className="text-[#38BDF8]">unordered_map</span>&lt;<span className="text-[#38BDF8]">int</span>, <span className="text-[#38BDF8]">int</span>&gt; seen;</span> },
      { num: 5, text: <span className="pl-6"><span className="text-[#FF9E79] font-medium">for</span> (<span className="text-[#38BDF8]">int</span> i = <span className="text-[#A78BFA]">0</span>; i &lt; nums.size(); i++) &#123;</span> },
      { num: 6, text: <span className="pl-9"><span className="text-[#38BDF8]">int</span> need = target - nums[i];</span> },
      { num: 7, text: <span className="pl-9"><span className="text-[#FF9E79] font-medium">if</span> (seen.count(need)) <span className="text-[#FF9E79] font-medium">return</span> &#123;seen[need], i&#125;;</span> },
      { num: 8, text: <span className="pl-9">seen[nums[i]] = i; <span className="inline-block w-1.5 h-3.5 bg-[#FF9E79] animate-pulse align-middle ml-0.5" /></span> },
      { num: 9, text: <span className="pl-6">&#125;</span> },
      { num: 10, text: <span className="pl-6"><span className="text-[#FF9E79] font-medium">return</span> &#123;&#125;;</span> },
      { num: 11, text: <span className="pl-3">&#125;</span> },
      { num: 12, text: <span>&#125;;</span> },
    ],
    python: [
      { num: 1, text: <span><span className="text-[#FF9E79] font-medium">class</span> <span className="text-[#FCD34D]">Solution</span>:</span> },
      { num: 2, text: <span className="pl-3"><span className="text-[#FF9E79] font-medium">def</span> <span className="text-[#FCD34D]">twoSum</span>(self, nums: <span className="text-[#38BDF8]">List</span>[<span className="text-[#38BDF8]">int</span>], target: <span className="text-[#38BDF8]">int</span>):</span> },
      { num: 3, text: <span className="pl-6">seen = &#123;&#125;</span> },
      { num: 4, text: <span className="pl-6"><span className="text-[#FF9E79] font-medium">for</span> i, num <span className="text-[#FF9E79] font-medium">in</span> <span className="text-[#38BDF8]">enumerate</span>(nums):</span> },
      { num: 5, text: <span className="pl-9">need = target - num</span> },
      { num: 6, text: <span className="pl-9"><span className="text-[#FF9E79] font-medium">if</span> need <span className="text-[#FF9E79] font-medium">in</span> seen:</span> },
      { num: 7, text: <span className="pl-12"><span className="text-[#FF9E79] font-medium">return</span> [seen[need], i]</span> },
      { num: 8, text: <span className="pl-9">seen[num] = i <span className="inline-block w-1.5 h-3.5 bg-[#FF9E79] animate-pulse align-middle ml-0.5" /></span> },
      { num: 9, text: <span className="pl-6"><span className="text-[#FF9E79] font-medium">return</span> []</span> },
    ],
    java: [
      { num: 1, text: <span><span className="text-[#FF9E79] font-medium">class</span> <span className="text-[#FCD34D]">Solution</span> &#123;</span> },
      { num: 2, text: <span className="pl-3"><span className="text-[#FF9E79] font-medium">public</span> <span className="text-[#38BDF8]">int</span>[] <span className="text-[#FCD34D]">twoSum</span>(<span className="text-[#38BDF8]">int</span>[] nums, <span className="text-[#38BDF8]">int</span> target) &#123;</span> },
      { num: 3, text: <span className="pl-6"><span className="text-[#38BDF8]">Map</span>&lt;<span className="text-[#38BDF8]">Integer</span>, <span className="text-[#38BDF8]">Integer</span>&gt; seen = <span className="text-[#FF9E79] font-medium">new</span> <span className="text-[#38BDF8]">HashMap</span>&lt;&gt;();</span> },
      { num: 4, text: <span className="pl-6"><span className="text-[#FF9E79] font-medium">for</span> (<span className="text-[#38BDF8]">int</span> i = <span className="text-[#A78BFA]">0</span>; i &lt; nums.length; i++) &#123;</span> },
      { num: 5, text: <span className="pl-9"><span className="text-[#38BDF8]">int</span> need = target - nums[i];</span> },
      { num: 6, text: <span className="pl-9"><span className="text-[#FF9E79] font-medium">if</span> (seen.containsKey(need)) &#123;</span> },
      { num: 7, text: <span className="pl-12"><span className="text-[#FF9E79] font-medium">return new int</span>[] &#123; seen.get(need), i &#125;;</span> },
      { num: 8, text: <span className="pl-9">&#125;</span> },
      { num: 9, text: <span className="pl-9">seen.put(nums[i], i); <span className="inline-block w-1.5 h-3.5 bg-[#FF9E79] animate-pulse align-middle ml-0.5" /></span> },
      { num: 10, text: <span className="pl-6">&#125;</span> },
      { num: 11, text: <span className="pl-6"><span className="text-[#FF9E79] font-medium">return new int</span>[<span className="text-[#A78BFA]">0</span>];</span> },
      { num: 12, text: <span className="pl-3">&#125;</span> },
      { num: 13, text: <span>&#125;</span> },
    ],
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Heading, Subtitle & Google Button */}
          <div className="lg:col-span-6 space-y-6">
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

          {/* Right Column: Live Mockup Window */}
          <div className="lg:col-span-6 space-y-5 flex flex-col items-start lg:items-end">
            {/* Verified Engine Pill */}
            <div className="w-full max-w-lg p-3.5 sm:p-4 rounded-3xl bg-gradient-to-r from-[#24110E] to-[#1A0C09] border border-[#52251D] shadow-[0_0_35px_rgba(82,37,29,0.35)] flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#3B1914] border border-[var(--theme-accent,#FF9E79)]/50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[var(--theme-accent,#FF9E79)]" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-[var(--theme-accent,#FF9E79)] font-bold">
                  EVALUATION ENGINE
                </div>
                <div className="text-xl font-serif font-medium text-[#F5E8DD]">
                  Live Technical &amp; AI Coding
                </div>
              </div>
            </div>

            {/* Split Live Mockup Window (Exact match to Screenshot 1 & 2) */}
            <div className="w-full max-w-lg rounded-3xl bg-[#140705]/95 border border-[#3E1D19] p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative overflow-hidden space-y-3">
              {/* Top Window Bar */}
              <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-[#2C130F]">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                  <span className="text-red-400 font-mono font-bold tracking-wider text-xs">Live · {liveClock}</span>
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
                      You <span className="text-[#856658] font-normal">(Candidate)</span>
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
                <div className="col-span-1 sm:col-span-7 flex flex-col justify-between bg-[#080302] rounded-2xl border border-[#3E1D19] p-3 text-[11px] font-mono leading-tight overflow-hidden relative">
                  {/* Clean Editor Lines with Numbers & Syntax Colors */}
                  <div className="space-y-1 font-mono text-[10.5px] leading-relaxed select-none overflow-x-hidden">
                    {codeLines[selectedLanguage].map((line) => (
                      <div key={line.num} className="flex items-baseline gap-2">
                        <span className="w-4 text-right text-[10px] text-[#542B23] font-mono shrink-0 select-none">
                          {line.num}
                        </span>
                        <span className="text-[#E0D5CC] whitespace-nowrap overflow-x-hidden">
                          {line.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Eye Indicator Badge (Clean, non-truncated) */}
                  <div className="mt-2.5 px-2.5 py-1.5 rounded-full bg-[#1A0B09] border border-[var(--theme-accent-border,#5E2717)] text-[10px] text-[var(--theme-accent,#FF9E79)] flex items-center justify-center gap-1.5 shadow-sm select-none">
                    <Eye className="w-3.5 h-3.5 text-[var(--theme-accent,#FF9E79)] shrink-0" />
                    <span className="whitespace-nowrap font-sans font-medium">Interviewer sees code live</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pt-2">
          {[
            {
              step: 'Stage 01',
              title: 'AI Resume & ATS Checker',
              desc: 'ATS score audit, keyword matching and instant formatting fixes.',
              path: '/resume',
              icon: FileText,
              badge: 'Screening',
            },
            {
              step: 'Stage 02',
              title: 'Online Assessment (OA)',
              desc: 'Timed coding assessment with compiler and hidden test cases.',
              path: '/oa',
              icon: Terminal,
              badge: 'Timed OA',
            },
            {
              step: 'Stage 03',
              title: 'Technical DSA Interview',
              desc: 'Voice dialogue with AI personas on shared live code editor.',
              path: '/interview/dsa',
              icon: Code2,
              badge: 'Live Technical',
            },
            {
              step: 'Stage 04',
              title: 'AI Resume Defense Round',
              desc: 'Deep-dive cross-examination on your actual resume projects.',
              path: '/interview/resume-defense',
              icon: ShieldCheck,
              badge: 'Deep Dive',
            },
            {
              step: 'Stage 05',
              title: 'AI HR Behavioral Round',
              desc: 'STAR-method leadership, culture fit questions and spoken feedback.',
              path: '/interview/hr',
              icon: Users,
              badge: 'Culture & HR',
            },
            {
              step: 'Final Outcome',
              title: 'Leaderboard & Certificate',
              desc: 'Verified composite ranking and downloadable PDF credential.',
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
                className="p-5 rounded-2xl bg-[#1A0B09]/85 border border-[#3E1D19] hover:border-[var(--theme-accent-border,#5E2717)] hover:bg-[#220E0A] transition shadow-sm flex flex-col justify-between group space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-[var(--theme-accent-bg,#2D140C)] text-[var(--theme-accent,#FF9E79)] border border-[var(--theme-accent-border,#5E2717)]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-semibold text-[var(--theme-accent,#FF9E79)] bg-[var(--theme-accent-bg,#2D140C)] px-2.5 py-0.5 rounded-full border border-[var(--theme-accent-border,#5E2717)]">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-[10px] uppercase tracking-wider font-bold text-[#856658]">
                      {item.step}
                    </div>
                    <h3 className="text-base sm:text-lg font-serif font-medium text-[#F5E8DD] group-hover:text-[var(--theme-accent,#FF9E79)] flex items-center justify-between transition">
                      <span>{item.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--theme-accent,#FF9E79)] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                  </div>

                  <p className="text-xs text-[#A88879] leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-1 text-[11px] font-semibold text-[var(--theme-accent,#FF9E79)] flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  <span>Enter round</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
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
