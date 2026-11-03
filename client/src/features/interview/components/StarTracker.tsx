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
      desc: 'Context & Challenge',
      isDetected: !!progress?.situation,
    },
    {
      key: 'task' as const,
      letter: 'T',
      title: 'Task',
      desc: 'Role & Assignment',
      isDetected: !!progress?.task,
    },
    {
      key: 'action' as const,
      letter: 'A',
      title: 'Action',
      desc: 'Personal Initiatives',
      isDetected: !!progress?.action,
    },
    {
      key: 'result' as const,
      letter: 'R',
      title: 'Result',
      desc: 'Impact & Learnings',
      isDetected: !!progress?.result,
    },
  ];

  const detectedCount = pillars.filter((p) => p.isDetected).length;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-Time STAR Story Tracker</span>
        </div>
        <span
          className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
            detectedCount === 4
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold'
              : 'bg-slate-800 border-slate-700 text-slate-400'
          }`}
        >
          {detectedCount} / 4 Pillars Detected
        </span>
      </div>

      {/* 4-Pillar Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {pillars.map((pillar) => (
          <div
            key={pillar.key}
            className={`p-2 rounded-lg border transition-all flex flex-col justify-between ${
              pillar.isDetected
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10'
                : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-black font-mono ${
                  pillar.isDetected
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {pillar.letter}
              </span>
              {pillar.isDetected ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-in zoom-in-50 duration-200" />
              ) : (
                <CircleDashed className="w-3.5 h-3.5 text-slate-600" />
              )}
            </div>

            <div>
              <p
                className={`text-[11px] font-bold ${
                  pillar.isDetected ? 'text-slate-100' : 'text-slate-400'
                }`}
              >
                {pillar.title}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight truncate">
                {pillar.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
