import React from 'react';
import { QuestionData, AttemptAnswers } from '../api/assessmentApi';
import { CheckCircle, Circle, Code, HelpCircle } from 'lucide-react';

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
    <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Question Palette</h3>
          <p className="text-xs text-slate-400">
            {answeredCount} of {questions.length} answered
          </p>
        </div>
        <div className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
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
              className={`relative flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-medium transition-all ${
                isCurrent
                  ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 ring-2 ring-indigo-500/30'
                  : answered
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1">
                {q.type === 'CODING' ? (
                  <Code className="w-3 h-3 text-amber-400" />
                ) : (
                  <HelpCircle className="w-3 h-3 text-sky-400" />
                )}
                <span>Q{idx + 1}</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5">{q.points}pts</span>
              <div className="absolute top-1 right-1">
                {answered ? (
                  <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                ) : (
                  <Circle className="w-2.5 h-2.5 text-slate-600" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
