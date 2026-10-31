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
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Key Strengths
        </h3>
        <ul className="space-y-3">
          {strengths.map((str, idx) => (
            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
              <span className="text-emerald-400 font-bold">&bull;</span>
              <span>{str}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses / Gaps */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" /> Identified ATS Gaps
        </h3>
        <ul className="space-y-3">
          {weaknesses.map((weak, idx) => (
            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
              <span className="text-amber-400 font-bold">&bull;</span>
              <span>{weak}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Plan Suggestions */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-indigo-400" /> Actionable Next Steps
        </h3>
        <ul className="space-y-3">
          {suggestions.map((sug, idx) => (
            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
              <span className="text-indigo-400 font-bold">&bull;</span>
              <span>{sug}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
