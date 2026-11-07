import React from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Lock,
  FileText,
  Terminal,
  Code2,
  Users,
  Award,
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

  // Compute active step index (1 to 5)
  let activeStep = 1;
  if (outcomeDone) {
    activeStep = 5;
  } else if (dsaDone && !hrDone) {
    activeStep = 4;
  } else if (oaDone && !dsaDone) {
    activeStep = 3;
  } else if (resumeDone && !oaDone) {
    activeStep = 2;
  } else {
    activeStep = 1;
  }

  const steps = [
    {
      id: 'resume',
      num: '01',
      label: 'Resume / ATS',
      sublabel: 'Keyword & Gap Defense',
      icon: FileText,
      route: '/resume',
      isCompleted: resumeDone,
      isActive: activeStep === 1,
      score: rounds?.resume.score,
    },
    {
      id: 'oa',
      num: '02',
      label: 'Online Assessment',
      sublabel: 'Timed MCQs & Coding',
      icon: Terminal,
      route: '/oa',
      isCompleted: oaDone,
      isActive: activeStep === 2,
      score: rounds?.oa.score,
    },
    {
      id: 'dsa',
      num: '03',
      label: 'AI DSA Technical',
      sublabel: 'Approach-First Dialogue',
      icon: Code2,
      route: '/interview/dsa',
      isCompleted: dsaDone,
      isActive: activeStep === 3,
      score: rounds?.dsa.score,
    },
    {
      id: 'hr',
      num: '04',
      label: 'AI HR Behavioral',
      sublabel: 'STAR Method & Camera',
      icon: Users,
      route: '/interview/hr',
      isCompleted: hrDone,
      isActive: activeStep === 4,
      score: rounds?.hr.score,
    },
    {
      id: 'outcome',
      num: '05',
      label: 'Final Evaluation',
      sublabel: 'Placement Certificate',
      icon: Award,
      route: '/dashboard',
      isCompleted: outcomeDone,
      isActive: activeStep === 5,
      score: null,
    },
  ];

  return (
    <div
      aria-label="5-Step Student Journey Tracker"
      className={`p-5 sm:p-6 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] shadow-xl backdrop-blur-md ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-[#3E1D19]">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#F0B87A]">
            Candidate Roadmap
          </span>
          <h2 className="text-base font-serif font-medium text-[#F5E8DD]">
            5-Stage Placement Pipeline
          </h2>
        </div>
        <div className="text-xs text-[#A88879]">
          Step <span className="text-[#F0B87A] font-bold">{activeStep}</span> of 5 &bull;{' '}
          {outcomeDone ? 'Ready for Hiring Review' : 'In Progress'}
        </div>
      </div>

      {/* Stepper Pipeline */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-4 relative">
        {steps.map((step) => {
          const Icon = step.icon;

          return (
            <Link
              key={step.id}
              to={step.route}
              className={`p-3.5 rounded-2xl border transition flex flex-col justify-between space-y-2 relative group ${
                step.isActive
                  ? 'bg-[#2D1A10] border-[#F0B87A] text-[#F5E8DD] shadow-[0_0_20px_rgba(240,184,122,0.25)]'
                  : step.isCompleted
                  ? 'bg-[#13281B] border-[#1F6E3B] text-[#F5E8DD] hover:border-[#2EA055]'
                  : 'bg-[#140705] border-[#3E1D19] text-[#856658] hover:border-[#52251E] hover:text-[#A88879]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    step.isActive
                      ? 'bg-[#3A2216] border-[#F0B87A] text-[#F0B87A]'
                      : step.isCompleted
                      ? 'bg-[#1E3F2B] border-[#2EA055] text-[#4ADE80]'
                      : 'bg-[#1C0E0B] border-[#3E1D19] text-[#856658]'
                  }`}
                >
                  {step.num}
                </span>

                <div className="flex items-center gap-1">
                  {step.isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-[#4ADE80]" />
                  ) : step.isActive ? (
                    <span className="w-2 h-2 rounded-full bg-[#F0B87A] animate-pulse" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#5C4338]" />
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mt-1">
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      step.isActive
                        ? 'text-[#F0B87A]'
                        : step.isCompleted
                        ? 'text-[#4ADE80]'
                        : 'text-[#856658]'
                    }`}
                  />
                  <span className="text-xs font-semibold text-[#F5E8DD] truncate">
                    {step.label}
                  </span>
                </div>
                <p className="text-[10px] text-[#A88879] truncate mt-0.5">{step.sublabel}</p>
              </div>

              {step.score !== null && step.score !== undefined && (
                <div className="pt-1.5 border-t border-[#3E1D19] text-[10px] flex items-center justify-between">
                  <span className="text-[#856658]">Score</span>
                  <span className="font-bold text-[#F0B87A]">{step.score}/100</span>
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default JourneyTracker;
