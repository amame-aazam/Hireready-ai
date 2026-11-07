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
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F2DDD2] space-y-4 shadow-sm">
        <h3 className="text-base font-serif font-medium text-[#0A0706] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#1F7A3A]" /> Key Strengths
        </h3>
        <ul className="space-y-3">
          {strengths.map((str, idx) => (
            <li key={idx} className="text-xs text-[#6B544A] flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#1F7A3A] font-bold mt-0.5">&bull;</span>
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses / Gaps */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F2DDD2] space-y-4 shadow-sm">
        <h3 className="text-base font-serif font-medium text-[#0A0706] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-[#8C5E00]" /> Identified ATS Gaps
        </h3>
        <ul className="space-y-3">
          {weaknesses.map((weak, idx) => (
            <li key={idx} className="text-xs text-[#6B544A] flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#8C5E00] font-bold mt-0.5">&bull;</span>
              <span>{weak}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Plan Suggestions */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F2DDD2] space-y-4 shadow-sm">
        <h3 className="text-base font-serif font-medium text-[#0A0706] flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-[#FF7A48]" /> Actionable Next Steps
        </h3>
        <ul className="space-y-3">
          {suggestions.map((sug, idx) => (
            <li key={idx} className="text-xs text-[#6B544A] flex items-start gap-2.5 leading-relaxed">
              <span className="text-[#FF7A48] font-bold mt-0.5">&bull;</span>
              <span>{sug}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default ATSActionPlan;
