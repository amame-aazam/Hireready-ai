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
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F2DDD2] space-y-4 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-serif font-medium text-[#0A0706]">
          <Sparkles className="w-4 h-4 text-[#1F7A3A]" />
          <span>Extracted Competencies Detected ({extractedSkills.length})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {extractedSkills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 rounded-full bg-[#E6F4EA] border border-[#B7E1CD] text-[#1F7A3A] text-xs font-semibold"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Missing High-Frequency Keywords */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F2DDD2] space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-serif font-medium text-[#0A0706]">
            <Tag className="w-4 h-4 text-[#FF7A48]" />
            <span>Recommended Keywords to Add ({missingKeywords.length})</span>
          </div>
          <span className="text-[11px] text-[#8C7268]">Click to copy</span>
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
                    ? 'bg-[#E6F4EA] border-[#B7E1CD] text-[#1F7A3A]'
                    : 'bg-[#FFEBE1] border-[#FFD0BC] text-[#A83E14] hover:bg-[#FFD0BC]'
                }`}
              >
                <span>{kw}</span>
                {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 opacity-60" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default MissingKeywords;
