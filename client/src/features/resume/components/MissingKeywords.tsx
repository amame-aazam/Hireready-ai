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
      <div className="p-6 sm:p-7 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] space-y-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2 text-sm font-serif font-medium text-[#F5E8DD]">
          <Sparkles className="w-4 h-4 text-[#F0B87A]" />
          <span>Extracted Competencies Detected ({extractedSkills.length})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {extractedSkills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full bg-[#2D1A10] border border-[#522E22] text-[#F0B87A] text-xs font-semibold"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Missing High-Frequency Keywords */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#1A0C09]/80 border border-[#3E1D19] space-y-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-serif font-medium text-[#F5E8DD]">
            <Tag className="w-4 h-4 text-[#F0B87A]" />
            <span>Recommended Keywords to Add ({missingKeywords.length})</span>
          </div>
          <span className="text-[11px] text-[#856658]">Click to copy</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {missingKeywords.map((kw) => {
            const isCopied = copiedKey === kw;
            return (
              <button
                key={kw}
                onClick={() => handleCopy(kw)}
                type="button"
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition flex items-center gap-1.5 ${
                  isCopied
                    ? 'bg-[#1E3A24] border-green-700/60 text-green-300'
                    : 'bg-[#140705] border-[#3E1D19] text-[#D4B8A8] hover:border-[#F0B87A]/60 hover:text-[#F0B87A]'
                }`}
              >
                {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 text-[#856658]" />}
                <span>{kw}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
