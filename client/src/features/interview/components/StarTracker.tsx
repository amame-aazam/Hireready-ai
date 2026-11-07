import React from 'react';
import { StarProgress } from '../api/interviewApi';
import { Sparkles } from 'lucide-react';

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
    <div className="bg-[#140705] border border-[#3E1D19] rounded-2xl p-3 space-y-2.5 shadow-sm text-[#F5E8DD]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F5E8DD]">
          <Sparkles className="w-3.5 h-3.5 text-[#F0B87A]" />
          <span>Real-Time STAR Story Tracker</span>
        </div>
        <span
          className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
            detectedCount >= 3
              ? 'bg-[#152B1E] border-[#255436] text-emerald-300 font-bold'
              : 'bg-[#2D1A10] border-[#522E22] text-[#F0B87A]'
          }`}
        >
          {detectedCount} / 4 Pillars
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {pillars.map((pillar) => (
          <div
            key={pillar.key}
            className={`p-2.5 rounded-xl border flex items-center gap-2.5 transition-all ${
              pillar.isDetected
                ? 'bg-[#152B1E] border-[#255436] text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-[#1A0C09] border-[#3E1D19] text-[#856658]'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 ${
                pillar.isDetected
                  ? 'bg-emerald-500 text-[#140808]'
                  : 'bg-[#140705] border border-[#3E1D19] text-[#856658]'
              }`}
            >
              {pillar.letter}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold truncate leading-tight">
                {pillar.title}
              </div>
              <div className="text-[10px] text-[#856658] truncate">{pillar.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
