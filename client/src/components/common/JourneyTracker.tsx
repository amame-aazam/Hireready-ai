import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Lock,
  User,
  FileText,
  Terminal,
  Code2,
  Users,
  Trophy,
} from 'lucide-react';

export interface JourneyRoundsData {
  resume: { status: 'PENDING' | 'COMPLETED'; score: number | null };
  oa: { status: 'PENDING' | 'COMPLETED'; score: number | null };
  dsa: { status: 'PENDING' | 'COMPLETED'; score: number | null };
  hr: { status: 'PENDING' | 'COMPLETED'; score: number | null };
}

interface JourneyTrackerProps {
  rounds?: JourneyRoundsData;
  isComplete?: boolean;
  className?: string;
}

export const JourneyTracker: React.FC<JourneyTrackerProps> = ({
  rounds,
  isComplete = false,
  className = '',
}) => {
  // Determine completion and active status
  const resumeDone = rounds?.resume.status === 'COMPLETED';
  const oaDone = rounds?.oa.status === 'COMPLETED';
  const dsaDone = rounds?.dsa.status === 'COMPLETED';
  const hrDone = rounds?.hr.status === 'COMPLETED';
  const outcomeDone = isComplete;

  // Compute active step index (0 to 5)
  let activeIndex = 1; // default Resume
  if (outcomeDone) {
    activeIndex = 5;
  } else if (dsaDone && !hrDone) {
    activeIndex = 4;
  } else if (oaDone && !dsaDone) {
    activeIndex = 3;
  } else if (resumeDone && !oaDone) {
    activeIndex = 2;
  } else if (!resumeDone) {
    activeIndex = 1;
  }

  const steps = [
    {
      id: 'profile',
      label: 'Profile',
      sublabel: 'Domain Config',
      icon: User,
      route: '/dashboard',
      isCompleted: true, // Profile always initialized for signed in user
      isActive: false,
      score: null,
    },
    {
      id: 'resume',
      label: 'Resume ATS',
      sublabel: 'Relevance & Skills',
      icon: FileText,
      route: '/resume',
      isCompleted: resumeDone,
      isActive: activeIndex === 1,
      score: rounds?.resume.score,
    },
    {
      id: 'oa',
      label: 'Online OA',
      sublabel: 'Technical MCQs & Code',
      icon: Terminal,
      route: '/oa',
      isCompleted: oaDone,
      isActive: activeIndex === 2,
      score: rounds?.oa.score,
    },
    {
      id: 'dsa',
      label: 'AI DSA Technical',
      sublabel: '3 Algorithms + Speech',
      icon: Code2,
      route: '/interview/dsa',
      isCompleted: dsaDone,
      isActive: activeIndex === 3,
      score: rounds?.dsa.score,
    },
    {
      id: 'hr',
      label: 'AI HR Behavioral',
      sublabel: 'STAR Method & Sophia',
      icon: Users,
      route: '/interview/hr',
      isCompleted: hrDone,
      isActive: activeIndex === 4,
      score: rounds?.hr.score,
    },
    {
      id: 'outcome',
      label: 'Placement Decision',
      sublabel: 'Rank & Certificate',
      icon: Trophy,
      route: '/dashboard',
      isCompleted: outcomeDone,
      isActive: activeIndex === 5,
      score: null,
    },
  ];

  return (
    <div className={`p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md shadow-lg ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-crimson-500 animate-pulse" />
            <span>Recruitment Journey Milestones</span>
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Clear all 4 mandatory evaluation rounds to unlock your final cohort standing & verification certificate.
          </p>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            Step {Math.min(6, activeIndex + 1)} of 6
          </span>
        </div>
      </div>

      {/* Stepper Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isClickable = step.isCompleted || step.isActive;

          const content = (
            <div
              className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between h-full space-y-2 relative overflow-hidden ${
                step.isActive
                  ? 'bg-crimson-950/20 border-crimson-500 shadow-crimson-glow text-white ring-1 ring-crimson-500'
                  : step.isCompleted
                  ? 'bg-slate-900/80 border-emerald-500/30 hover:border-emerald-500/60 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60'
              }`}
            >
              {/* Top Row: Icon & Status Marker */}
              <div className="flex items-center justify-between">
                <div
                  className={`p-1.5 rounded-lg border ${
                    step.isActive
                      ? 'bg-crimson-600 text-white border-crimson-400'
                      : step.isCompleted
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-slate-800 text-slate-500 border-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {step.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : step.isActive ? (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-crimson-400 bg-crimson-500/10 px-1.5 py-0.5 rounded border border-crimson-500/20">
                    Active
                  </span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
              </div>

              {/* Title & Sublabel */}
              <div>
                <div className="text-xs font-bold leading-tight line-clamp-1">{step.label}</div>
                <div className="text-[10px] text-slate-400 line-clamp-1">{step.sublabel}</div>
              </div>

              {/* Score pill if completed */}
              <div className="pt-1 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-mono">0{idx + 1}</span>
                {step.score !== null && step.score !== undefined ? (
                  <span className="font-bold text-emerald-400">{step.score}/100</span>
                ) : step.isActive ? (
                  <span className="text-crimson-400 font-medium">In Progress</span>
                ) : step.isCompleted ? (
                  <span className="text-emerald-400 font-medium">Cleared</span>
                ) : (
                  <span className="text-slate-600">Pending</span>
                )}
              </div>
            </div>
          );

          return isClickable ? (
            <Link key={step.id} to={step.route} className="block group">
              {content}
            </Link>
          ) : (
            <div key={step.id} className="cursor-not-allowed">
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default JourneyTracker;
