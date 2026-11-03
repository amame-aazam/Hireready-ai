import React from 'react';
import { Check, Lock, Sparkles } from 'lucide-react';
import { QuestionOverviewItem } from '../api/interviewApi';

interface QuestionStepperProps {
  currentIndex: number;
  questions?: QuestionOverviewItem[];
}

export const QuestionStepper: React.FC<QuestionStepperProps> = ({
  currentIndex,
  questions = [
    { index: 0, id: 'q1', title: 'Two Sum', difficulty: 'EASY' },
    { index: 1, id: 'q2', title: 'Group Anagrams', difficulty: 'MEDIUM' },
    { index: 2, id: 'q3', title: 'Coin Change', difficulty: 'MEDIUM' },
  ],
}) => {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
      {questions.map((q, idx) => {
        const isCurrent = idx === currentIndex;
        const isCompleted = idx < currentIndex;

        return (
          <div
            key={q.id || idx}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-all shrink-0 ${
              isCurrent
                ? 'bg-indigo-600/15 border-indigo-500/50 text-indigo-200 shadow-sm shadow-indigo-500/20 ring-1 ring-indigo-500/30'
                : isCompleted
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-500 opacity-60'
            }`}
          >
            {/* Status Icon */}
            <div className="flex items-center justify-center">
              {isCompleted ? (
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5" />
                </div>
              ) : isCurrent ? (
                <div className="w-3.5 h-3.5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center animate-pulse">
                  <Sparkles className="w-2.5 h-2.5" />
                </div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center">
                  <Lock className="w-2.5 h-2.5" />
                </div>
              )}
            </div>

            {/* Label */}
            <span className="font-semibold text-[11px]">
              Q{idx + 1}: {q.title}
            </span>

            {/* Difficulty or Competency Badge */}
            {q.difficulty ? (
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                  q.difficulty === 'EASY'
                    ? 'bg-emerald-500/15 text-emerald-400'
                    : 'bg-amber-500/15 text-amber-400'
                }`}
              >
                {q.difficulty}
              </span>
            ) : q.competency ? (
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300">
                {q.competency}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
