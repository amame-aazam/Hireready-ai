import React from 'react';
import { QuestionData } from '../api/assessmentApi';
import { HelpCircle, CheckCircle2 } from 'lucide-react';

interface McqQuestionViewProps {
  question: QuestionData;
  questionNumber: number;
  totalQuestions: number;
  selectedOption: number | undefined;
  onSelectOption: (optionIndex: number) => void;
  onClearOption: () => void;
}

export const McqQuestionView: React.FC<McqQuestionViewProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onClearOption,
}) => {
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="h-full flex flex-col justify-between p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6 overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-xs font-semibold">
              Multiple Choice
            </span>
            <span className="text-xs text-slate-400">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {question.points} Points
          </span>
        </div>

        {/* Question Title & Prompt */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-400 shrink-0" />
            {question.title}
          </h2>
          <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
            {question.prompt}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Select the best answer:
          </h4>
          <div className="space-y-2.5">
            {question.options?.map((optionText, idx) => {
              const isSelected = selectedOption === idx;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onSelectOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 group ${
                    isSelected
                      ? 'bg-indigo-600/15 border-indigo-500 text-slate-100 shadow-sm shadow-indigo-500/10'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/40 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-700'
                    }`}
                  >
                    {alphabet[idx] || idx + 1}
                  </div>
                  <div className="flex-1 text-sm pt-0.5 leading-snug">{optionText}</div>
                  <div className="pt-0.5">
                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-700 group-hover:border-slate-600 shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedOption !== undefined && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClearOption}
            className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 transition"
          >
            Clear selection
          </button>
        </div>
      )}
    </div>
  );
};
