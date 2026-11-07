import React from 'react';
import { StarProgress } from '../api/interviewApi';
import { CheckCircle2, CircleDashed, Sparkles } from 'lucide-react';

interface StarTrackerProps {
  progress?: StarProgress;
}

export const StarTracker: React.FC<StarTrackerProps> = ({ progress }) => {
  const pillars = [
    {
      key: 'situation' as const,
      letter: 'S',
      title: 'Situation',
      desc: 'Context & Stakes',
      isDetected: !!progress?.situation,
    },
    {
      key: 'task' as const,
      letter: 'T',
      title: 'Task',
      desc: 'Role & Goal',
      isDetected: !!progress?.task,
    },
    {
      key: 'action' as const,
      letter: 'A',
      title: 'Action',
      desc: 'Your Initiatives',
      isDetected: !!progress?.action,
    },
    {
      key: 'result' as const,
      letter: 'R',
      title: 'Result',
      desc: 'Measurable Impact',
      isDetected: !!progress?.result,
    },
  ];

  const detectedCount = pillars.filter((p) => p.isDetected).length;

  return (
    <div className="bg-white border border-[#F2DDD2] rounded-xl p-2.5 space-y-2 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#0A0706]">
          <Sparkles className="w-3.5 h-3.5 text-[#FF7A48]" />
          <span>Real-Time STAR Story Tracker</span>
        </div>
        <span
          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
            detectedCount >= 3
              ? 'bg-[#E6F4EA] border-[#CEEAD6] text-[#1F7A3A] font-bold'
              : 'bg-[#FFEBE1] border-[#FBD7C7] text-[#A83E14]'
          }`}
        >
          {detectedCount} / 4 Pillars
        </span>
      </div>

      {/* 4-Pillar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {pillars.map((pillar) => (
          <div
            key={pillar.key}
            className={`px-2 py-1.5 rounded-lg border transition-all flex items-center gap-2 ${
              pillar.isDetected
                ? 'bg-[#E6F4EA] border-[#B7E4C7] text-[#1F7A3A] shadow-xs'
                : 'bg-[#FFFAF7] border-[#F2DDD2] text-[#8C7268]'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                pillar.isDetected
                  ? 'bg-[#1F7A3A] text-white'
                  : 'bg-white border border-[#F2DDD2] text-[#8C7268]'
              }`}
            >
              {pillar.letter}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-bold leading-tight truncate">{pillar.title}</div>
              <div className="text-[9px] text-[#6B544A] leading-tight truncate">{pillar.desc}</div>
            </div>

            {pillar.isDetected ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A3A] shrink-0" />
            ) : (
              <CircleDashed className="w-3.5 h-3.5 text-[#8C7268] shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default StarTracker;
