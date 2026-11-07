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
      sublabel: 'Persona & Code Round',
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
      sublabel: 'STAR Method & Video',
      icon: Users,
      route: '/interview/hr',
      isCompleted: hrDone,
      isActive: activeStep === 4,
      score: rounds?.hr.score,
    },
    {
      id: 'outcome',
      num: '05',
      label: 'Result & Certificate',
      sublabel: 'Verified Credential',
      icon: Award,
      route: '/dashboard',
      isCompleted: outcomeDone,
      isActive: activeStep === 5,
      score: null,
    },
  ];

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-white border border-[#F2DDD2] shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#F2DDD2]">
        <div>
          <h3 className="text-xs font-semibold text-[#0A0706] uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF7A48] animate-pulse" />
            <span className="font-sans font-bold">5-Step Recruitment Journey</span>
          </h3>
          <p className="text-xs text-[#6B544A] mt-0.5">
            Complete each evaluation stage to earn your cohort standing and verified completion credential.
          </p>
        </div>
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEBE1] text-[#A83E14] border border-[#FBD7C7] text-xs font-medium font-mono">
            <span>Step {activeStep} of 5</span>
          </span>
        </div>
      </div>

      {/* 5-Step Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {steps.map((step) => {
          const Icon = step.icon;
          const isClickable = step.isCompleted || step.isActive;

          const card = (
            <div
              className={`p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between h-full space-y-2 relative ${
                step.isActive
                  ? 'bg-[#FFF5F0] border-[#FF7A48] shadow-sm ring-1 ring-[#FF7A48]'
                  : step.isCompleted
                  ? 'bg-white border-[#B7E4C7] hover:border-[#52B788]'
                  : 'bg-[#FFFAF7] border-[#F2DDD2] opacity-80'
              }`}
            >
              {/* Top Row: Icon & Status */}
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-lg border ${
                    step.isActive
                      ? 'bg-[#FF7A48] text-white border-[#F05A24]'
                      : step.isCompleted
                      ? 'bg-[#E6F4EA] text-[#1F7A3A] border-[#CEEAD6]'
                      : 'bg-white text-[#8C7268] border-[#F2DDD2]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {step.isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-[#1F7A3A] shrink-0" />
                ) : step.isActive ? (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#A83E14] bg-[#FFEBE1] px-2 py-0.5 rounded-full border border-[#FBD7C7]">
                    Current
                  </span>
                ) : (
                  <Lock className="w-3.5 h-3.5 text-[#8C7268] shrink-0" />
                )}
              </div>

              {/* Title & Sublabel */}
              <div>
                <div className="text-xs font-bold text-[#0A0706] line-clamp-1">{step.label}</div>
                <div className="text-[11px] text-[#6B544A] line-clamp-1">{step.sublabel}</div>
              </div>

              {/* Bottom Row */}
              <div className="pt-2 border-t border-[#F2DDD2] flex items-center justify-between text-[11px]">
                <span className="text-[#8C7268] font-mono">{step.num}</span>
                {step.score !== null && step.score !== undefined ? (
                  <span className="font-bold text-[#1F7A3A]">{step.score}/100</span>
                ) : step.isActive ? (
                  <span className="text-[#FF7A48] font-medium">In Progress</span>
                ) : step.isCompleted ? (
                  <span className="text-[#1F7A3A] font-medium">Completed</span>
                ) : (
                  <span className="text-[#8C7268]">Locked</span>
                )}
              </div>
            </div>
          );

          return isClickable ? (
            <Link key={step.id} to={step.route} className="block group transition-transform hover:-translate-y-0.5">
              {card}
            </Link>
          ) : (
            <div key={step.id} className="cursor-not-allowed">
              {card}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JourneyTracker;
