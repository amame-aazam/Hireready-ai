import React from 'react';
import { ScoreBreakdown } from '../api/resumeApi';
import { Target, Zap, FileCheck, Layers } from 'lucide-react';

interface ATSScoreCardProps {
  score: number;
  breakdown: ScoreBreakdown;
  targetDomain: string;
  createdAt: string;
}

export const ATSScoreCard: React.FC<ATSScoreCardProps> = ({
  score,
  breakdown,
  targetDomain,
  createdAt,
}) => {
  const getScoreColor = (val: number) => {
    if (val >= 80) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (val >= 65) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  const getBadgeText = (val: number) => {
    if (val >= 80) return 'Strong Match';
    if (val >= 65) return 'Competitive Match';
    return 'Action Needed';
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
            Target Domain
          </span>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {targetDomain}
          </h2>
        </div>
        <div className="text-xs text-slate-400">
          Analyzed on {new Date(createdAt).toLocaleDateString()} at{' '}
          {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Main Score Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Overall Score Circle */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
          <div
            className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center ${getScoreColor(
              score
            )}`}
          >
            <span className="text-4xl font-extrabold tracking-tight text-white">{score}</span>
            <span className="text-[10px] text-slate-400 uppercase font-semibold">ATS Score</span>
          </div>
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getScoreColor(
              score
            )}`}
          >
            {getBadgeText(score)}
          </span>
        </div>

        {/* 4 Pillars Progress Bars */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            4-Pillar ATS Evaluation Breakdown
          </h3>

          {/* Pillar 1: Keywords */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <Target className="w-3.5 h-3.5 text-indigo-400" /> Keyword &amp; Domain Alignment
              </span>
              <span className="font-semibold text-white">{breakdown.keywordScore} / 30</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.keywordScore / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Pillar 2: Action Impact */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Action Verbs &amp; Measurable Impact
              </span>
              <span className="font-semibold text-white">{breakdown.impactScore} / 30</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.impactScore / 30) * 100}%` }}
              />
            </div>
          </div>

          {/* Pillar 3: Formatting */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400" /> ATS Readability &amp; Structure
              </span>
              <span className="font-semibold text-white">{breakdown.formattingScore} / 20</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.formattingScore / 20) * 100}%` }}
              />
            </div>
          </div>

          {/* Pillar 4: Skills Coverage */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1.5 font-medium">
                <Layers className="w-3.5 h-3.5 text-blue-400" /> Core Technical Skills Coverage
              </span>
              <span className="font-semibold text-white">{breakdown.skillsScore} / 20</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(breakdown.skillsScore / 20) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
