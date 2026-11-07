import React from 'react';
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
} from 'lucide-react';
import { INTERVIEWER_PERSONAS, Persona } from '../features/interview/types/persona';
import { PersonaAvatar } from '../features/interview/components/PersonaAvatar';
import { CodeEditor } from '../components/ui/CodeEditor';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 sm:pt-24 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFEBE1] border border-[#FFD0BC] text-[#A83E14] text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#FF7A48]" />
          <span>Next-Gen AI Interview & Placement Training</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-[#0A0706] tracking-tight leading-[1.15]">
          Face your interview <br />
          <span className="italic font-normal text-[#FF7A48]">before it’s real.</span>
        </h1>

        <p className="text-base sm:text-xl text-[#6B544A] max-w-2xl mx-auto font-sans leading-relaxed">
          Practice realistic spoken technical rounds, live coding, ATS resume audits, and STAR behavioral interviews with calibrated AI interviewers.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/auth/register"
            className="px-7 py-3.5 rounded-full bg-[#0A0706] hover:bg-[#221C19] text-white font-medium text-sm transition shadow-sm hover:shadow flex items-center gap-2"
          >
            <span>Start Practicing Free</span>
            <ArrowRight className="w-4 h-4 text-[#FF7A48]" />
          </Link>
          <Link
            to="/interview/dsa"
            className="px-6 py-3.5 rounded-full bg-white hover:bg-[#FBF1EA] text-[#0A0706] font-medium text-sm transition border border-[#F2DDD2] shadow-sm flex items-center gap-2"
          >
            <Mic className="w-4 h-4 text-[#FF7A48]" />
            <span>Meet the AI Personas</span>
          </Link>
        </div>

        <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-[#8C7268]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#1F7A3A]" /> Zero Setup Required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#1F7A3A]" /> Spoken Voice-First Dialogue
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#1F7A3A]" /> Free & Browser-Native
          </span>
        </div>
      </section>

      {/* 2. Persona Showcase Section */}
      <section className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs uppercase tracking-widest font-bold text-[#FF7A48]">
            Calibrated Personalities
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#0A0706]">
            Interviewers who push, guide, and challenge.
          </h2>
          <p className="text-sm text-[#6B544A] max-w-xl mx-auto">
            From patient warm-up mentors to relentless FAANG bar-raisers. Pick who you want across the table.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INTERVIEWER_PERSONAS.map((persona: Persona) => (
            <div
              key={persona.id}
              className="p-6 rounded-3xl bg-white border border-[#F2DDD2] hover:border-[#FF7A48]/60 transition shadow-sm hover:shadow-md flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="relative">
                    <PersonaAvatar persona={persona} size="lg" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FFEBE1] text-[#A83E14] border border-[#FFD0BC]">
                    {persona.difficultyTier}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-medium text-[#0A0706] group-hover:text-[#FF7A48] transition">
                    {persona.name}
                  </h3>
                  <div className="text-xs font-semibold text-[#8C7268]">{persona.role}</div>
                </div>

                <p className="text-xs text-[#6B544A] leading-relaxed italic">
                  &ldquo;{persona.quote}&rdquo;
                </p>

                <div className="p-3 bg-[#FFFAF7] rounded-2xl border border-[#F2DDD2] text-xs text-[#6B544A] space-y-1">
                  <div>
                    <strong className="text-[#0A0706]">Approach:</strong> {persona.approachStrictness}
                  </div>
                  <div>
                    <strong className="text-[#0A0706]">Hints:</strong> {persona.hintFrequency}
                  </div>
                </div>
              </div>

              <Link
                to={`/interview/dsa?persona=${persona.id}`}
                className="w-full text-center py-2.5 px-4 rounded-full bg-[#FFFAF7] hover:bg-[#0A0706] text-[#0A0706] hover:text-white text-xs font-semibold border border-[#F2DDD2] transition flex items-center justify-center gap-1.5"
              >
                <span>Interview with {persona.name}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The 5-Step Complete Journey */}
      <section className="max-w-6xl mx-auto px-6 space-y-8">
        <div className="text-center space-y-2">
          <div className="text-xs uppercase tracking-widest font-bold text-[#FF7A48]">
            The Placement Pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#0A0706]">
            Everything needed to get hired, under one roof.
          </h2>
          <p className="text-sm text-[#6B544A] max-w-xl mx-auto">
            A cohesive 5-stage student recruitment preparation roadmap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                className="p-6 rounded-3xl bg-white border border-[#F2DDD2] hover:border-[#FF7A48]/60 transition shadow-sm hover:shadow-md flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-2xl bg-[#FFEBE1] text-[#FF7A48] border border-[#FFD0BC]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#A83E14] bg-[#FFEBE1] px-2.5 py-0.5 rounded-full border border-[#FFD0BC]">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-[#8C7268]">
                      {item.step}
                    </div>
                    <h3 className="text-lg font-serif font-medium text-[#0A0706] group-hover:text-[#FF7A48] flex items-center justify-between transition">
                      <span>{item.title}</span>
                      <ArrowRight className="w-4 h-4 text-[#FF7A48] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                  </div>

                  <p className="text-xs text-[#6B544A] leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-2 text-xs font-semibold text-[#FF7A48] flex items-center gap-1">
                  <span>Enter round</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Monaco Editor Live Demo Sandbox */}
      <section className="max-w-4xl mx-auto px-6 space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-serif text-[#0A0706]">
            Built with production-grade coding tooling.
          </h2>
          <p className="text-xs text-[#6B544A]">
            Integrated Monaco Editor with syntax highlighting, live execution, and multi-language support.
          </p>
        </div>

        <div className="rounded-3xl border border-[#F2DDD2] bg-white p-4 shadow-sm overflow-hidden">
          <div className="h-56">
            <CodeEditor
              language="typescript"
              value={`// HireReady AI - Placement Composite Score Calculator
function calculateFinalScore(scores: {
  resume: number; // 15%
  oa: number;     // 25%
  dsa: number;    // 40%
  hr: number;     // 20%
}): { compositeScore: number; status: 'SELECTED' | 'WAITLISTED' | 'NOT_SELECTED' } {
  const composite = Math.round(
    scores.resume * 0.15 +
    scores.oa * 0.25 +
    scores.dsa * 0.40 +
    scores.hr * 0.20
  );
  return {
    compositeScore: composite,
    status: composite >= 75 ? 'SELECTED' : composite >= 60 ? 'WAITLISTED' : 'NOT_SELECTED',
  };
}

console.log(calculateFinalScore({ resume: 85, oa: 90, dsa: 88, hr: 82 }));`}
            />
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#FFF4EC] to-white border border-[#F2DDD2] text-center space-y-6 shadow-sm">
          <h2 className="text-3xl sm:text-4xl font-serif font-normal text-[#0A0706]">
            Ready to pass your dream company interview?
          </h2>
          <p className="text-sm text-[#6B544A] max-w-lg mx-auto leading-relaxed">
            Practice as many times as you need. No credit card required, instant verbal feedback, and zero pressure.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/auth/register"
              className="px-8 py-3.5 rounded-full bg-[#0A0706] hover:bg-[#221C19] text-white font-medium text-sm transition shadow-sm hover:shadow"
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
