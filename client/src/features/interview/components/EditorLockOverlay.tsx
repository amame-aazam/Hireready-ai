import React from 'react';
import { Lock, Sparkles, ArrowLeft } from 'lucide-react';

interface EditorLockOverlayProps {
  questionTitle?: string;
  timeComplexityTarget?: string;
  interviewerName?: string;
}

export const EditorLockOverlay: React.FC<EditorLockOverlayProps> = ({
  questionTitle = 'Current Problem',
  timeComplexityTarget = 'O(N)',
  interviewerName = 'Your Interviewer',
}) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-[#FFFAF7]/95 backdrop-blur-xs border border-[#F2DDD2] text-center">
      <div className="max-w-md w-full space-y-4 flex flex-col items-center">
        {/* Lock Icon */}
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-[#FFEBE1] border border-[#FFD7C5] flex items-center justify-center text-[#FF7A48] relative z-10 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFEBE1] border border-[#FBD7C7] text-[#A83E14] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7A48]" />
            <span>Phase 1: Approach Validation</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-[#0A0706] tracking-tight">
            Editor Locked — Explain Your Approach First
          </h3>
          <p className="text-xs text-[#6B544A] leading-relaxed max-w-sm mx-auto">
            Discuss your strategy for <span className="text-[#0A0706] font-semibold">{questionTitle}</span> with {interviewerName} in the left dialogue panel. Aim for optimal <span className="text-[#FF7A48] font-mono font-bold">{timeComplexityTarget}</span> complexity.
          </p>
        </div>

        {/* Action Directive */}
        <div className="w-full p-3 rounded-xl bg-white border border-[#F2DDD2] shadow-xs flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-[#FFEBE1] border border-[#FFD7C5] flex items-center justify-center shrink-0 text-[#FF7A48]">
            <ArrowLeft className="w-4 h-4 animate-pulse" />
          </div>
          <div className="text-xs text-[#0A0706] leading-snug">
            <span className="font-semibold text-[#A83E14] block">Next Step:</span>
            Speak or type your solution strategy in the left panel. Once approved, {interviewerName} will unlock this Monaco code workspace.
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-white border border-[#F2DDD2] text-[#8C7268]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A48] animate-ping" />
          <span>Verbal thinking in progress...</span>
        </div>
      </div>
    </div>
  );
};
export default EditorLockOverlay;
