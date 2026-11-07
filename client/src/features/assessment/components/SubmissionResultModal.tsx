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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0403]/80 backdrop-blur-md animate-fadeIn text-[#F5E8DD]">
      <div className="bg-[#1A0C09] border border-[#3E1D19] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top Status Gradient Ribbon */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isPassed ? 'bg-gradient-to-r from-emerald-500 to-[#F0B87A]' : 'bg-red-500'
          }`}
        />

        {/* Icon & Title */}
        <div className="text-center space-y-3">
          <div
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              isPassed
                ? 'bg-[#152B1E] text-emerald-300 border border-[#255436]'
                : 'bg-[#2E100D] text-red-300 border border-red-800'
            }`}
          >
            {isPassed ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          </div>

          <h2 className="text-2xl font-serif font-medium text-[#F5E8DD]">
            {isPassed ? 'Assessment Cleared!' : 'Assessment Completed'}
          </h2>
          <p className="text-xs text-[#A88879] max-w-md mx-auto leading-relaxed">
            {isPassed
              ? 'Congratulations! You met the passing benchmark and unlocked Step 3 AI Technical Interviews.'
              : 'You completed the assessment. Review your component scores below or continue your prep journey.'}
          </p>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#140705] border border-[#3E1D19] text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#856658] font-semibold">
              Overall Score
            </span>
            <div
              className={`text-2xl font-serif font-bold mt-1 ${
                isPassed ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {result.totalScore}%
            </div>
            <span className="text-[10px] text-[#856658]">Cutoff: 70%</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#140705] border border-[#3E1D19] text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#856658] font-semibold">
              MCQ Score
            </span>
            <div className="text-2xl font-serif font-bold text-[#F0B87A] mt-1">{result.mcqScore}</div>
            <span className="text-[10px] text-[#856658]">pts earned</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#140705] border border-[#3E1D19] text-center">
            <span className="text-[10px] uppercase tracking-wider text-[#856658] font-semibold">
              Coding Score
            </span>
            <div className="text-2xl font-serif font-bold text-[#F0B87A] mt-1">{result.codingScore}</div>
            <span className="text-[10px] text-[#856658]">pts earned</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/dashboard"
            className="w-full sm:flex-1 py-3 px-4 rounded-full border border-[#3E1D19] bg-[#140705] hover:bg-[#24110E] hover:border-[#52251D] text-center text-xs font-semibold text-[#F5E8DD] transition"
          >
            Candidate Dashboard
          </Link>
          <Link
            to="/interview/dsa"
            className="w-full sm:flex-1 py-3 px-4 rounded-full bg-gradient-to-r from-[#F0B87A] to-[#E2A664] hover:from-[#F5C68F] hover:to-[#EDB373] text-center text-xs font-bold text-[#140808] shadow-[0_0_20px_rgba(240,184,122,0.3)] transition flex items-center justify-center gap-1.5"
          >
            <span>Proceed to Step 3</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default SubmissionResultModal;