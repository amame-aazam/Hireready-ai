import React from 'react';
import { Lock, Sparkles, ArrowLeft } from 'lucide-react';

interface EditorLockOverlayProps {
  questionTitle?: string;
  timeComplexityTarget?: string;
}

export const EditorLockOverlay: React.FC<EditorLockOverlayProps> = ({
  questionTitle = 'Current Problem',
  timeComplexityTarget = 'O(N)',
}) => {
  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-center animate-fade-in">
      <div className="max-w-md w-full space-y-4 flex flex-col items-center">
        {/* Glowing Lock Icon */}
        <div className="relative">
          <div className="absolute -inset-3 rounded-full bg-indigo-500/20 blur-md animate-pulse" />
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border-2 border-indigo-500/50 flex items-center justify-center text-indigo-400 relative z-10 shadow-lg shadow-indigo-500/20">
            <Lock className="w-7 h-7" />
          </div>
        </div>

        {/* Heading & Subtitle */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Phase 1: Approach Validation</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
            Editor Locked — Explain Your Approach First
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
            Discuss your strategy for <span className="text-slate-200 font-semibold">{questionTitle}</span> with Sophia on the left panel. Aim for optimal <span className="text-indigo-400 font-mono font-bold">{timeComplexityTarget}</span> complexity.
          </p>
        </div>

        {/* Action Directive */}
        <div className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3 text-left">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center shrink-0 text-indigo-400">
            <ArrowLeft className="w-4 h-4 animate-pulse" />
          </div>
          <div className="text-[11px] text-slate-300 leading-snug">
            <span className="font-semibold text-indigo-300 block">Next Step:</span>
            Speak or type your solution strategy in the left panel. Once approved, Sophia will instantly unlock this Monaco editor.
          </div>
        </div>

        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-medium bg-slate-900 border border-slate-800 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>Awaiting candidate conceptual approach...</span>
        </div>
      </div>
    </div>
  );
};
