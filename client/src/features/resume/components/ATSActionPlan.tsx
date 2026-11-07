import React from 'react';
import { CheckCircle2, AlertTriangle, Lightbulb } from 'lucide-react';

interface ATSActionPlanProps {
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export const ATSActionPlan: React.FC<ATSActionPlanProps> = ({
  strengths,
  weaknesses,
  suggestions,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Strengths */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] space-y-4 shadow-sm backdrop-blur-md">
        <h3 className="text-base font-serif font-medium text-[#F5E8DD] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Strengths
        </h3>
        <ul className="space-y-3">
          {strengths.map((str, idx) => (
            <li key={idx} className="text-xs text-[#A88879] flex items-start gap-2.5 leading-relaxed">
              <span className="text-emerald-400 font-bold mt-0.5">&bull;</span>
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses / Gaps */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] space-y-4 shadow-sm backdrop-blur-md">
        <h3 className="text-base font-serif font-medium text-[#F5E8DD] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#F0B87A]" /> Identified ATS Gaps
        </h3>
        <ul className="space-y-3">
          {weaknesses.map((weak, idx) => (
            <li key={idx} className="text-xs text-[#A88879] flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#F0B87A] font-bold mt-0.5">&bull;</span>
              <span>{weak}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Plan Suggestions */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] space-y-4 shadow-sm backdrop-blur-md">
        <h3 className="text-base font-serif font-medium text-[#F5E8DD] flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#F0B87A]" /> Actionable Next Steps
        </h3>
        <ul className="space-y-3">
          {suggestions.map((sug, idx) => (
            <li key={idx} className="text-xs text-[#A88879] flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#F0B87A] font-bold mt-0.5">&bull;</span>
              <span>{sug}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
