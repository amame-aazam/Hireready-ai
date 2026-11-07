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
  const getBadgeText = (val: number) => {
    if (val >= 80) return 'Strong Match';
    if (val >= 65) return 'Competitive Match';
    return 'Action Needed';
  };

  return (
    <div className="rounded-3xl border border-[#3E1D19] bg-[#1A0C09]/80 p-6 sm:p-8 space-y-6 shadow-sm backdrop-blur-md">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#3E1D19]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F0B87A] bg-[#2D1A10] px-3 py-1 rounded-full border border-[#522E22]">
            Target Domain
          </span>
          <h2 className="text-2xl font-serif font-medium text-[#F5E8DD] mt-2">
            {targetDomain}
          </h2>
        </div>
        <div className="text-xs text-[#856658]">
          Analyzed on {new Date(createdAt).toLocaleDateString()} at{' '}
          {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Main Score Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Overall Score Circle */}
        <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#140705] border border-[#3E1D19] space-y-2">
          <div className="w-28 h-28 rounded-full border-4 border-[#F0B87A] bg-[#24110E] flex flex-col items-center justify-center shadow-[0_0_30px_rgba(240,184,122,0.25)]">
            <span className="text-4xl font-serif font-bold text-[#F5E8DD]">{score}</span>
            <span className="text-[10px] text-[#A88879] uppercase font-semibold">ATS Score</span>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full border border-[#522E22] bg-[#2D1A10] text-[#F0B87A] mt-2">
            {getBadgeText(score)}
          </span>
        </div>

        {/* 4 Pillars Breakdown Bars */}
        <div className="md:col-span-2 space-y-3.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#856658]">
            4-Pillar Evaluation Breakdown
          </h3>

          <div className="space-y-3">
            {/* Skills Match */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#F5E8DD] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#F0B87A]" /> Domain Skills Coverage
                </span>
                <span className="font-semibold text-[#F0B87A]">{breakdown.skillsScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#140705] border border-[#3E1D19] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#E2A664] to-[#F0B87A]"
                  style={{ width: `${breakdown.skillsScore}%` }}
                />
              </div>
            </div>

            {/* Impact & Metrics */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#F5E8DD] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-[#F0B87A]" /> Quantifiable Impact
                </span>
                <span className="font-semibold text-[#F0B87A]">{breakdown.impactScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#140705] border border-[#3E1D19] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#E2A664] to-[#F0B87A]"
                  style={{ width: `${breakdown.impactScore}%` }}
                />
              </div>
            </div>

            {/* Brevity & Formatting */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#F5E8DD] flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-[#F0B87A]" /> Formatting & Layout
                </span>
                <span className="font-semibold text-[#F0B87A]">{breakdown.formattingScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#140705] border border-[#3E1D19] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#E2A664] to-[#F0B87A]"
                  style={{ width: `${breakdown.formattingScore}%` }}
                />
              </div>
            </div>

            {/* Keyword Density */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#F5E8DD] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#F0B87A]" /> Keyword Density
                </span>
                <span className="font-semibold text-[#F0B87A]">{breakdown.keywordScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#140705] border border-[#3E1D19] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#E2A664] to-[#F0B87A]"
                  style={{ width: `${breakdown.keywordScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
