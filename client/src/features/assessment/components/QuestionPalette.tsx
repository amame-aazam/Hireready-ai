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
    <div className="w-full bg-white border border-[#F2DDD2] rounded-3xl p-5 space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[#F2DDD2]">
        <div>
          <h3 className="text-sm font-semibold text-[#0A0706]">Question Palette</h3>
          <p className="text-xs text-[#6B544A]">
            {answeredCount} of {questions.length} answered
          </p>
        </div>
        <div className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#FFEBE1] text-[#A83E14] border border-[#FFD0BC]">
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
                  ? 'bg-[#FFEBE1] border-[#FF7A48] text-[#A83E14] shadow-sm'
                  : answered
                  ? 'bg-[#E6F4EA] border-[#B7E1CD] text-[#1F7A3A]'
                  : 'bg-[#FFFAF7] border-[#F2DDD2] text-[#8C7268] hover:bg-[#FBF1EA]'
              }`}
            >
              <div className="flex items-center gap-1">
                <span>{idx + 1}</span>
                {q.type === 'CODING' ? (
                  <Code className="w-3 h-3 text-[#FF7A48]" />
                ) : (
                  <HelpCircle className="w-3 h-3 text-sky-600" />
                )}
              </div>
              <span className="text-[9px] uppercase tracking-wider text-[#8C7268] mt-0.5">
                {answered ? 'Done' : 'Pending'}
              </span>
            </button>
          );
        })}
      </div>

      <div className="pt-2 border-t border-[#F2DDD2] flex items-center justify-between text-[11px] text-[#8C7268]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E6F4EA] border border-[#B7E1CD]" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFEBE1] border border-[#FF7A48]" />
          <span>Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFFAF7] border border-[#F2DDD2]" />
          <span>Pending</span>
        </div>
      </div>
    </div>
  );
};
export default QuestionPalette;
