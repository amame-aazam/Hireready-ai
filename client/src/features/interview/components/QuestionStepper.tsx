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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all shrink-0 ${
              isCurrent
                ? 'bg-[#FFF5F0] border-[#FF7A48] text-[#0A0706] shadow-xs ring-1 ring-[#FF7A48]'
                : isCompleted
                ? 'bg-[#E6F4EA] border-[#B7E4C7] text-[#1F7A3A]'
                : 'bg-white border-[#F2DDD2] text-[#8C7268] opacity-60'
            }`}
          >
            {/* Status Icon */}
            <div className="flex items-center justify-center">
              {isCompleted ? (
                <div className="w-3.5 h-3.5 rounded-full bg-[#1F7A3A] text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              ) : isCurrent ? (
                <div className="w-3.5 h-3.5 rounded-full bg-[#FF7A48] text-white flex items-center justify-center animate-pulse">
                  <Sparkles className="w-2 h-2" />
                </div>
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-[#FFFAF7] text-[#8C7268] flex items-center justify-center border border-[#F2DDD2]">
                  <Lock className="w-2 h-2" />
                </div>
              )}
            </div>

            {/* Label */}
            <span className="font-semibold text-xs">
              Q{idx + 1}: {q.title}
            </span>

            {/* Difficulty Badge */}
            {q.difficulty && (
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider ${
                  q.difficulty === 'EASY'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : q.difficulty === 'MEDIUM'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {q.difficulty}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default QuestionStepper;
