import React from 'react';
import { QuestionData, AttemptAnswers } from '../api/assessmentApi';
import { Code, HelpCircle } from 'lucide-react';

interface QuestionPaletteProps {
  questions: QuestionData[];
  currentIndex: number;
  answers: AttemptAnswers;
  onSelectQuestion: (index: number) => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  questions,
  currentIndex,
  answers,
  onSelectQuestion,
}) => {
  const isAnswered = (q: QuestionData) => {
    if (q.type === 'MCQ') {
      return answers.mcq[q.id] !== undefined;
    }
    if (q.type === 'CODING') {
      const code = answers.code[q.id]?.code;
      return code && code.trim().length > 30;
    }
    return false;
  };

  const answeredCount = questions.filter(isAnswered).length;

  return (
    <div className="w-full bg-[#1A0C09]/80 border border-[#3E1D19] rounded-3xl p-5 space-y-4 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between pb-3 border-b border-[#3E1D19]">
        <div>
          <h3 className="text-sm font-semibold text-[#F5E8DD]">Question Palette</h3>
          <p className="text-xs text-[#A88879]">
            {answeredCount} of {questions.length} answered
          </p>
        </div>
        <div className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#2D1A10] text-[#F0B87A] border border-[#522E22]">
          {Math.round((answeredCount / questions.length) * 100)}%
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2">
        {questions.map((q, idx) => {
          const answered = isAnswered(q);
          const isCurrent = currentIndex === idx;

          return (
            <button
              key={q.id}
              onClick={() => onSelectQuestion(idx)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border text-xs font-semibold transition-all ${
                isCurrent
                  ? 'bg-[#2D1A10] border-[#F0B87A] text-[#F0B87A] shadow-[0_0_15px_rgba(240,184,122,0.25)]'
                  : answered
                  ? 'bg-[#152B1E] border-[#255436] text-emerald-300'
                  : 'bg-[#140705] border-[#3E1D19] text-[#856658] hover:bg-[#24110E] hover:text-[#F5E8DD]'
              }`}
            >
              <div className="flex items-center gap-1">
                {q.type === 'CODING' ? (
                  <Code className="w-3 h-3" />
                ) : (
                  <HelpCircle className="w-3 h-3" />
                )}
                <span>Q{idx + 1}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-[#3E1D19] flex items-center justify-between text-[11px] text-[#856658]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#2D1A10] border border-[#F0B87A]"></span>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#152B1E] border border-[#255436]"></span>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#140705] border border-[#3E1D19]"></span>
          <span>Unanswered</span>
        </div>
      </div>
    </div>
  );
};
