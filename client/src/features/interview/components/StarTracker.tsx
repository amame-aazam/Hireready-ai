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
    <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-2 sm:p-2.5 space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Real-Time STAR Story Tracker</span>
        </div>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
            detectedCount >= 3
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
              : 'bg-slate-800 border-slate-700 text-slate-400'
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
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10'
                : 'bg-slate-900/60 border-slate-800 text-slate-500'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-black font-mono shrink-0 ${
                pillar.isDetected
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {pillar.letter}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p
                  className={`text-[10px] font-bold leading-none truncate ${
                    pillar.isDetected ? 'text-slate-100' : 'text-slate-400'
                  }`}
                >
                  {pillar.title}
                </p>
                {pillar.isDetected ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                ) : (
                  <CircleDashed className="w-3 h-3 text-slate-600 shrink-0" />
                )}
              </div>
              <p className="text-[9px] text-slate-500 truncate mt-0.5">
                {pillar.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
