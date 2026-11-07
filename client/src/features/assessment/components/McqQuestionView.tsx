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
    <div className="h-full flex flex-col justify-between p-6 sm:p-7 bg-[#1A0C09]/80 border border-[#3E1D19] rounded-3xl space-y-6 shadow-sm overflow-y-auto backdrop-blur-md text-[#F5E8DD]">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#3E1D19]">
          <div className="flex items-center gap-2">
            <span className="px-3 py-0.5 rounded-full bg-[#2D1A10] text-[#F0B87A] border border-[#522E22] text-xs font-semibold">
              Multiple Choice
            </span>
            <span className="text-xs text-[#A88879]">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#140705] border border-[#3E1D19] text-[#F0B87A]">
            {question.points} Points
          </span>
        </div>

        {/* Question Title & Prompt */}
        <div className="space-y-2">
          <h2 className="text-lg font-serif font-medium text-[#F5E8DD] flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#F0B87A] shrink-0" />
            {question.title}
          </h2>
          <div className="p-5 rounded-2xl bg-[#140705] border border-[#3E1D19] text-sm text-[#F5E8DD] leading-relaxed font-sans whitespace-pre-wrap">
            {question.prompt}
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-[#856658] uppercase tracking-wider">
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
                  className={`w-full p-4 rounded-2xl border text-left transition flex items-center gap-3.5 text-xs sm:text-sm font-sans ${
                    isSelected
                      ? 'bg-[#2D1A10] border-[#F0B87A] text-[#F5E8DD] shadow-[0_0_15px_rgba(240,184,122,0.2)]'
                      : 'bg-[#140705] border-[#3E1D19] text-[#A88879] hover:bg-[#24110E] hover:border-[#52251D] hover:text-[#F5E8DD]'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-semibold text-xs shrink-0 transition ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#F0B87A] to-[#E2A664] text-[#140808]'
                        : 'bg-[#1A0C09] border border-[#3E1D19] text-[#856658]'
                    }`}
                  >
                    {alphabet[idx] || idx + 1}
                  </span>
                  <span className="flex-1 leading-relaxed">{optionText}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-[#F0B87A] shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedOption !== undefined && (
        <div className="pt-4 border-t border-[#3E1D19] flex justify-end">
          <button
            type="button"
            onClick={onClearOption}
            className="text-xs text-[#856658] hover:text-[#F0B87A] transition"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};
