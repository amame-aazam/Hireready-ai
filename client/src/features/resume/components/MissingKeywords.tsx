import React, { useState } from 'react';
import { Tag, Copy, Check, Sparkles } from 'lucide-react';

interface MissingKeywordsProps {
  missingKeywords: string[];
  extractedSkills: string[];
}

export const MissingKeywords: React.FC<MissingKeywordsProps> = ({
  missingKeywords,
  extractedSkills,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (keyword: string) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKey(keyword);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Extracted Skills Detected */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Extracted Competencies Detected ({extractedSkills.length})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {extractedSkills.map((skill) => (
            <span
              key={skill}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Missing High-Frequency Keywords */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Tag className="w-4 h-4 text-rose-400" />
            <span>Recommended Keywords to Add ({missingKeywords.length})</span>
          </div>
          <span className="text-[11px] text-slate-500">Click keyword to copy</span>
        </div>

        {missingKeywords.length === 0 ? (
          <p className="text-xs text-emerald-400 font-medium">
            Outstanding! All high-frequency domain keywords were found in your resume.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((kw) => {
              const isCopied = copiedKey === kw;
              return (
                <button
                  key={kw}
                  onClick={() => handleCopy(kw)}
                  className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 hover:border-rose-400 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition group"
                  title="Click to copy to clipboard"
                >
                  <span>{kw}</span>
                  {isCopied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100 transition" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
