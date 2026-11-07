import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Terminal,
  Mic,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Code2,
  ShieldCheck,
  ChevronRight,
  Play,
} from 'lucide-react';
import { INTERVIEWER_PERSONAS, Persona } from '../features/interview/types/persona';
import { PersonaAvatar } from '../features/interview/components/PersonaAvatar';

export const LandingPage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'cpp' | 'python' | 'java'>('cpp');

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

  return (
    <div className="space-y-24 pb-24 text-[#F5E8DD]">
      {/* 1. Hero Section (Matching Screenshot 4) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Heading and Tag */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A0C09] border border-[#3E1D19] text-[#F0B87A] text-xs font-medium tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F0B87A] animate-pulse"></span>
              <span>Spoken interviews · Live DSA coding · Honest feedback</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-[#F5E8DD] tracking-tight leading-[1.12]">
              Face your <br />
              interview{' '}
              <span className="inline-flex items-center justify-center align-middle mx-1.5">
                <span className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#E2A664] via-[#F0B87A] to-[#FFF1DE] shadow-[0_0_35px_rgba(240,184,122,0.8)] inline-block"></span>
              </span>{' '}
              <br />
              <span className="italic font-normal text-[#F0B87A]">before it’s real.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#A88879] max-w-xl font-sans leading-relaxed">
              Spoken mock interviews with AI interviewers. Solve DSA problems on a shared editor,
              defend every line of your resume, take on behavioral questions, and read exactly what to fix.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                to="/dashboard"
                className="px-7 py-3.5 rounded-full bg-gradient-to-r from-[#F0B87A] to-[#E2A664] hover:from-[#F5C68F] hover:to-[#EDB373] text-[#140808] font-bold text-sm transition shadow-[0_0_25px_rgba(240,184,122,0.3)] hover:shadow-[0_0_35px_rgba(240,184,122,0.5)] flex items-center gap-2.5"
              >
                <Mic className="w-4 h-4 text-[#140808]" />
                <span>Start your first interview</span>
              </Link>
              <Link
                to="/auth/register"
                className="px-6 py-3.5 rounded-full bg-[#1A0C09]/90 hover:bg-[#24110E] text-[#F5E8DD] font-medium text-sm transition border border-[#3E1D19] flex items-center gap-2"
              >
                <span>Create free account</span>
                <ChevronRight className="w-4 h-4 text-[#F0B87A]" />
              </Link>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#856658]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F0B87A]" /> No credit card required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F0B87A]" /> Voice-first speech recognition
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#F0B87A]" /> Verifiable certificate
              </span>
            </div>
          </div>

          {/* Right Column: Social Proof Pill */}
          <div className="lg:col-span-5 flex flex-col justify-center items-start lg:items-end">
            <div className="w-full max-w-md p-5 rounded-3xl bg-gradient-to-r from-[#24110E] to-[#1A0C09] border border-[#52251D] shadow-[0_0_40px_rgba(82,37,29,0.4)] flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#3B1914] border border-[#F0B87A]/50 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-[#F0B87A]" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#F0B87A] font-bold">
                  TRUSTED BY
                </div>
                <div className="text-xl sm:text-2xl font-serif font-medium text-[#F5E8DD]">
                  10,000+ students
                </div>
                <div className="text-xs text-[#856658] mt-0.5">
                  Prepping for Google, Amazon, Microsoft & top startups
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Mockup Window (Split Preview from Screenshot 4) */}
        <div className="mt-12 rounded-3xl bg-[#140807] border border-[#3E1D19] p-4 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Interviewer Persona Video Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-[#1E0E0B] border border-[#3E1D19] aspect-[4/3] flex flex-col justify-between p-4 group">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-full bg-red-950/80 text-red-300 border border-red-800/60 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span>Live · 07:50</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#2A130E] text-[#F0B87A] text-[11px] border border-[#52251D]">
                    FAANG Bar-Raiser
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center my-auto">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
                    alt="Riddhi AI Interviewer"
                    className="w-28 h-28 rounded-2xl object-cover border-2 border-[#F0B87A]/60 shadow-[0_0_25px_rgba(240,184,122,0.25)]"
                  />
                  <div className="mt-3 text-center">
                    <div className="text-sm font-serif font-medium text-[#F5E8DD]">Riddhi</div>
                    <div className="text-[11px] text-[#A88879]">AI Interviewer · System & DSA</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1">
                  {[4, 12, 8, 16, 20, 10, 6, 14, 18, 8, 4].map((h, i) => (
                    <span
                      key={i}
                      style={{ height: `${h}px` }}
                      className="w-1 bg-[#F0B87A] rounded-full opacity-80"
                    ></span>
                  ))}
                </div>
              </div>

              {/* Persona speech bubble */}
              <div className="p-3.5 rounded-2xl bg-[#1A0C09] border border-[#3E1D19] text-xs text-[#D4B8A8] space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#F0B87A] tracking-wider">
                  Riddhi says:
                </div>
                <p className="italic">
                  &ldquo;Your hash map approach gives O(n) time. But what if memory is constrained to O(1) auxiliary space? Could we sort first?&rdquo;
                </p>
              </div>
            </div>

            {/* Monaco / Code Preview */}
            <div className="lg:col-span-8 flex flex-col rounded-2xl bg-[#0F0504] border border-[#3E1D19] overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 bg-[#180A08] border-b border-[#3E1D19]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56]/80"></span>
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E]/80"></span>
                  <span className="w-3 h-3 rounded-full bg-[#27C93F]/80"></span>
                  <span className="ml-3 text-xs font-mono text-[#A88879]">Coding round — Problem: Two Sum</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  {(['cpp', 'python', 'java'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition ${
                        selectedLanguage === lang
                          ? 'bg-[#331713] text-[#F0B87A] border border-[#52251D]'
                          : 'text-[#856658] hover:text-[#F5E8DD]'
                      }`}
                    >
                      {lang === 'cpp' ? 'C++' : lang === 'python' ? 'Python' : 'Java'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 font-mono text-xs sm:text-sm text-[#F5E8DD] overflow-x-auto leading-relaxed bg-[#0D0403] flex-1">
                <pre>
                  <code>{codeSnippets[selectedLanguage]}</code>
                </pre>
              </div>

              <div className="flex items-center justify-between px-4 py-3 bg-[#180A08] border-t border-[#3E1D19] text-xs">
                <span className="text-[#856658]">Live scratchpad synced with AI persona</span>
                <span className="text-[#F0B87A] font-medium flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-[#F0B87A]" /> 2/2 Test Cases Passed
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. How a Round Works Section (Matching Screenshot 5) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-10">
        <div className="space-y-3">
          <div className="text-xs uppercase tracking-widest font-bold text-[#F0B87A]">
            How a round works
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F5E8DD] tracking-tight">
            One round, three parts, all out loud.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Part 01 */}
          <div className="p-8 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] hover:border-[#52251D] hover:bg-[#24110E] transition-all space-y-4">
            <div className="text-4xl font-serif italic text-[#F0B87A]">01</div>
            <h3 className="text-xl font-serif font-medium text-[#F5E8DD]">Introduction</h3>
            <p className="text-sm text-[#A88879] leading-relaxed">
              A few minutes on you. It has read your resume, so it asks about the projects you
              actually built, the tools you used, and why you made specific technical decisions.
            </p>
          </div>

          {/* Part 02 */}
          <div className="p-8 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] hover:border-[#52251D] hover:bg-[#24110E] transition-all space-y-4">
            <div className="text-4xl font-serif italic text-[#F0B87A]">02</div>
            <h3 className="text-xl font-serif font-medium text-[#F5E8DD]">Live coding</h3>
            <p className="text-sm text-[#A88879] leading-relaxed">
              A DSA problem on a shared editor, in C++, Java, Python or JavaScript. It gives hints
              when you stall, never the answer, and challenges your time complexity.
            </p>
          </div>

          {/* Part 03 */}
          <div className="p-8 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] hover:border-[#52251D] hover:bg-[#24110E] transition-all space-y-4">
            <div className="text-4xl font-serif italic text-[#F0B87A]">03</div>
            <h3 className="text-xl font-serif font-medium text-[#F5E8DD]">Feedback</h3>
            <p className="text-sm text-[#A88879] leading-relaxed">
              Spoken the moment you finish, built on what happened in the call, ending with the one
              thing to fix first, along with a comprehensive scorecard breakdown.
            </p>
          </div>
        </div>
      </section>

      {/* 3. The 5-Step Complete Placement Roadmap */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-3">
          <div className="text-xs uppercase tracking-widest font-bold text-[#F0B87A]">
            The Placement Pipeline
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#F5E8DD]">
            Everything needed to get hired, under one roof.
          </h2>
          <p className="text-sm text-[#A88879] max-w-xl mx-auto">
            A cohesive 5-stage student recruitment preparation roadmap from ATS screening to final offer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: 'Step 1',
              title: 'AI Resume & ATS Checker',
              desc: 'Instant keyword analysis, formatting audit, and actionable score tailored for top engineering jobs.',
              path: '/resume',
              icon: FileText,
              badge: '15% Weight',
            },
            {
              step: 'Step 2',
              title: 'Online Assessment (OA)',
              desc: 'Domain MCQs paired with browser-based Monaco editor coding problems against hidden test cases.',
              path: '/oa',
              icon: Terminal,
              badge: '25% Weight',
            },
            {
              step: 'Step 3',
              title: 'Technical DSA Interview',
              desc: 'Spoken dialogue with calibrated AI interviewers, live code scratchpad, and approach verification.',
              path: '/interview/dsa',
              icon: Code2,
              badge: '40% Weight',
            },
            {
              step: 'Step 4',
              title: 'AI HR Behavioral Round',
              desc: 'STAR-method situational and leadership evaluation with Kavya, speech recognition, and webcam support.',
              path: '/interview/hr',
              icon: Users,
              badge: '20% Weight',
            },
            {
              step: 'Step 5',
              title: 'Leaderboard & Certificate',
              desc: 'Authoritative composite scoring, anonymous cohort percentile rankings, and verified PDF certificates.',
              path: '/leaderboard',
              icon: Award,
              badge: 'Outcome',
            },
            {
              step: 'Bonus',
              title: 'Resume Defense Round',
              desc: 'Hard-hitting cross-examination on your actual resume projects, architecture decisions, and metrics.',
              path: '/interview/resume-defense',
              icon: ShieldCheck,
              badge: 'Deep Dive',
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                to={item.path}
                className="p-6 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] hover:border-[#52251D] hover:bg-[#24110E] transition shadow-sm flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-[#2D1A10] text-[#F0B87A] border border-[#522E22]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#F0B87A] bg-[#2D1A10] px-3 py-1 rounded-full border border-[#522E22]">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-[#856658]">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-serif font-medium text-[#F5E8DD] group-hover:text-[#F0B87A] flex items-center justify-between transition">
                      <span>{item.title}</span>
                      <ArrowRight className="w-4 h-4 text-[#F0B87A] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                  </div>

                  <p className="text-xs text-[#A88879] leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-2 text-xs font-semibold text-[#F0B87A] flex items-center gap-1">
                  <span>Enter round</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Persona Showcase Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs uppercase tracking-widest font-bold text-[#F0B87A]">
            Calibrated Personalities
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#F5E8DD]">
            Interviewers who push, guide, and challenge.
          </h2>
          <p className="text-sm text-[#A88879] max-w-xl mx-auto">
            From patient warm-up mentors to relentless FAANG bar-raisers. Pick who you want across the table.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {INTERVIEWER_PERSONAS.map((persona: Persona) => (
            <div
              key={persona.id}
              className="p-6 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] hover:border-[#52251D] hover:bg-[#24110E] transition shadow-sm flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <PersonaAvatar persona={persona} size="lg" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#2D1A10] text-[#F0B87A] border border-[#522E22]">
                    {persona.difficultyTier}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-medium text-[#F5E8DD] group-hover:text-[#F0B87A] transition">
                    {persona.name}
                  </h3>
                  <div className="text-xs font-semibold text-[#856658]">{persona.role}</div>
                </div>

                <p className="text-xs text-[#A88879] leading-relaxed italic">
                  &ldquo;{persona.quote}&rdquo;
                </p>

                <div className="p-3 bg-[#140705] rounded-2xl border border-[#3E1D19] text-xs text-[#A88879] space-y-1">
                  <div>
                    <strong className="text-[#F5E8DD]">Approach:</strong> {persona.approachStrictness}
                  </div>
                  <div>
                    <strong className="text-[#F5E8DD]">Hints:</strong> {persona.hintFrequency}
                  </div>
                </div>
              </div>

              <Link
                to={`/interview/dsa?persona=${persona.id}`}
                className="w-full text-center py-2.5 px-4 rounded-full bg-[#2D1A10] hover:bg-gradient-to-r hover:from-[#F0B87A] hover:to-[#E2A664] text-[#F0B87A] hover:text-[#140808] text-xs font-semibold border border-[#522E22] transition flex items-center justify-center gap-1.5"
              >
                <span>Interview with {persona.name}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#24110E] to-[#1A0C09] border border-[#52251D] text-center space-y-6 shadow-[0_0_50px_rgba(82,37,29,0.3)]">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#3B1914] text-[#F0B87A] text-xs font-semibold border border-[#F0B87A]/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready for placement season?</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#F5E8DD]">
            Pass your dream interview with calm confidence.
          </h2>
          <p className="text-sm text-[#A88879] max-w-lg mx-auto leading-relaxed">
            Practice as many times as you need. Real-time spoken dialogue, instant diagnosis, and zero pressure.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/auth/register"
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#F0B87A] to-[#E2A664] hover:from-[#F5C68F] hover:to-[#EDB373] text-[#140808] font-bold text-sm transition shadow-[0_0_25px_rgba(240,184,122,0.4)]"
            >
              Get Started for Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
export default LandingPage;