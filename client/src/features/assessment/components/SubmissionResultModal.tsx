import React from 'react';
import { FinalSubmissionResult } from '../api/assessmentApi';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubmissionResultModalProps {
  result: FinalSubmissionResult;
}

export const SubmissionResultModal: React.FC<SubmissionResultModalProps> = ({ result }) => {
  const isPassed = result.passed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0706]/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-[#F2DDD2] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top Status Gradient Ribbon */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isPassed ? 'bg-[#1F7A3A]' : 'bg-rose-500'
          }`}
        />

        {/* Icon & Title */}
        <div className="text-center space-y-3">
          <div
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              isPassed
                ? 'bg-[#E6F4EA] text-[#1F7A3A] border border-[#B7E1CD]'
                : 'bg-[#FDE8E8] text-[#9B1C1C] border border-[#F8B4B4]'
            }`}
          >
            {isPassed ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          </div>

          <h2 className="text-2xl font-serif font-medium text-[#0A0706]">
            {isPassed ? 'Assessment Cleared!' : 'Assessment Completed'}
          </h2>
          <p className="text-xs text-[#6B544A] max-w-md mx-auto leading-relaxed">
            {isPassed
              ? 'Congratulations! You met the passing benchmark and unlocked Step 3 AI Technical Interviews.'
              : 'You completed the assessment. Review your component scores below or continue your prep journey.'}
          </p>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#8C7268] font-semibold">
              Overall Score
            </span>
            <div
              className={`text-2xl font-serif font-bold mt-1 ${
                isPassed ? 'text-[#1F7A3A]' : 'text-[#9B1C1C]'
              }`}
            >
              {result.totalScore}%
            </div>
            <span className="text-[10px] text-[#8C7268]">Cutoff: 70%</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#8C7268] font-semibold">
              MCQ Score
            </span>
            <div className="text-2xl font-serif font-bold text-sky-700 mt-1">{result.mcqScore}</div>
            <span className="text-[10px] text-[#8C7268]">pts earned</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#8C7268] font-semibold">
              Coding Score
            </span>
            <div className="text-2xl font-serif font-bold text-[#A83E14] mt-1">{result.codingScore}</div>
            <span className="text-[10px] text-[#8C7268]">pts earned</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/dashboard"
            className="w-full sm:flex-1 py-3 px-4 rounded-full border border-[#F2DDD2] bg-[#FFFAF7] hover:bg-[#FBF1EA] text-center text-xs font-semibold text-[#0A0706] transition"
          >
            Candidate Dashboard
          </Link>
          <Link
            to="/interview/dsa"
            className="w-full sm:flex-1 py-3 px-4 rounded-full bg-[#0A0706] hover:bg-[#221C19] text-center text-xs font-semibold text-white shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <span>Proceed to Step 3</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#FF7A48]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SubmissionResultModal;
