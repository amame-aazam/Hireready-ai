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
    if (val >= 80) return 'text-[#1F7A3A] border-[#B7E1CD] bg-[#E6F4EA]';
    if (val >= 65) return 'text-[#8C5E00] border-[#FAD77B] bg-[#FEF3D6]';
    return 'text-[#9B1C1C] border-[#F8B4B4] bg-[#FDE8E8]';
  };

  const getBadgeText = (val: number) => {
    if (val >= 80) return 'Strong Match';
    if (val >= 65) return 'Competitive Match';
    return 'Action Needed';
  };

  return (
    <div className="rounded-3xl border border-[#F2DDD2] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#F2DDD2]">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A83E14] bg-[#FFEBE1] px-2.5 py-0.5 rounded-full border border-[#FFD0BC]">
            Target Domain
          </span>
          <h2 className="text-2xl font-serif font-medium text-[#0A0706] mt-1.5">
            {targetDomain}
          </h2>
        </div>
        <div className="text-xs text-[#8C7268]">
          Analyzed on {new Date(createdAt).toLocaleDateString()} at{' '}
          {new Date(createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Main Score Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Overall Score Circle */}
        <div className="flex flex-col items-center justify-center p-6 rounded-3xl bg-[#FFFAF7] border border-[#F2DDD2] space-y-2">
          <div
            className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center ${getScoreColor(
              score
            )}`}
          >
            <span className="text-4xl font-serif font-bold text-[#0A0706]">{score}</span>
            <span className="text-[10px] text-[#8C7268] uppercase font-semibold">ATS Score</span>
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border mt-2 ${getScoreColor(
              score
            )}`}
          >
            {getBadgeText(score)}
          </span>
        </div>

        {/* 4 Pillars Breakdown Bars */}
        <div className="md:col-span-2 space-y-3.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8C7268]">
            4-Pillar Evaluation Breakdown
          </h3>

          <div className="space-y-3">
            {/* Skills Match */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#0A0706] flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#FF7A48]" /> Domain Skills Coverage
                </span>
                <span className="font-semibold text-[#0A0706]">{breakdown.skillsScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#FFFAF7] border border-[#F2DDD2] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#FF7A48]"
                  style={{ width: `${breakdown.skillsScore}%` }}
                />
              </div>
            </div>

            {/* Keyword Density */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#0A0706] flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-sky-600" /> ATS Keyword Match
                </span>
                <span className="font-semibold text-[#0A0706]">{breakdown.keywordScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#FFFAF7] border border-[#F2DDD2] overflow-hidden">
                <div
                  className="h-full rounded-full bg-sky-500"
                  style={{ width: `${breakdown.keywordScore}%` }}
                />
              </div>
            </div>

            {/* Formatting & Structure */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#0A0706] flex items-center gap-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Structure &amp; Parsability
                </span>
                <span className="font-semibold text-[#0A0706]">{breakdown.formattingScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#FFFAF7] border border-[#F2DDD2] overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500"
                  style={{ width: `${breakdown.formattingScore}%` }}
                />
              </div>
            </div>

            {/* Quantified Impact */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-[#0A0706] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" /> Action Verbs &amp; Quantified Impact
                </span>
                <span className="font-semibold text-[#0A0706]">{breakdown.impactScore}%</span>
              </div>
              <div className="h-2 rounded-full bg-[#FFFAF7] border border-[#F2DDD2] overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-500"
                  style={{ width: `${breakdown.impactScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ATSScoreCard;
