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
    <div className="h-full flex flex-col justify-between p-6 sm:p-7 bg-white border border-[#F2DDD2] rounded-3xl space-y-6 shadow-sm overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F2DDD2]">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100 text-xs font-semibold">
              Multiple Choice
            </span>
            <span className="text-xs text-[#6B544A]">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFFAF7] border border-[#F2DDD2] text-[#0A0706]">
            {question.points} Points
          </span>
        </div>

        {/* Question Title & Prompt */}
        <div className="space-y-2">
          <h2 className="text-lg font-serif font-medium text-[#0A0706] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-600 shrink-0" />
            {question.title}
          </h2>
          <div className="p-5 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] text-sm text-[#0A0706] leading-relaxed font-sans whitespace-pre-wrap">
            {question.prompt}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-[#8C7268] uppercase tracking-wider">
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
                  className={`w-full flex items-center gap-3.5 p-4 rounded-2xl border text-left transition ${
                    isSelected
                      ? 'bg-[#FFEBE1] border-[#FF7A48] text-[#0A0706] shadow-sm'
                      : 'bg-[#FFFAF7] border-[#F2DDD2] hover:bg-[#FBF1EA] text-[#0A0706]'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition ${
                      isSelected
                        ? 'bg-[#FF7A48] text-white shadow-sm'
                        : 'bg-white border border-[#F2DDD2] text-[#6B544A]'
                    }`}
                  >
                    {alphabet[idx]}
                  </span>
                  <span className="text-sm font-medium leading-relaxed flex-1">{optionText}</span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-[#FF7A48] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedOption !== undefined && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClearOption}
            className="text-xs text-[#8C7268] hover:text-[#A83E14] font-medium transition"
          >
            Clear Selected Option
          </button>
        </div>
      )}
    </div>
  );
};
export default McqQuestionView;
