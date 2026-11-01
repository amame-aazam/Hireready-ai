import React from 'react';
import { FinalSubmissionResult } from '../api/assessmentApi';
import { CheckCircle2, XCircle, Award, ArrowRight, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubmissionResultModalProps {
  result: FinalSubmissionResult;
}

export const SubmissionResultModal: React.FC<SubmissionResultModalProps> = ({ result }) => {
  const isPassed = result.passed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top Status Gradient Ribbon */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 ${
            isPassed ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        />

        {/* Icon & Title */}
        <div className="text-center space-y-3">
          <div
            className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              isPassed
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
            }`}
          >
            {isPassed ? <CheckCircle2 className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
          </div>

          <h2 className="text-2xl font-bold text-slate-100">
            {isPassed ? 'Assessment Passed!' : 'Assessment Completed'}
          </h2>
          <p className="text-sm text-slate-400">
            {isPassed
              ? 'Congratulations! You met the passing benchmark and unlocked Round 2 Technical Interviews.'
              : 'You did not reach the minimum passing threshold for this screening, but you can review your performance below.'}
          </p>
        </div>

        {/* Score Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Overall Score
            </span>
            <div
              className={`text-2xl font-black mt-1 ${
                isPassed ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {result.totalScore}%
            </div>
            <span className="text-[10px] text-slate-500">Benchmark: 70%</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              MCQ Score
            </span>
            <div className="text-2xl font-black text-sky-400 mt-1">{result.mcqScore}</div>
            <span className="text-[10px] text-slate-500">pts earned</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Coding Score
            </span>
            <div className="text-2xl font-black text-amber-400 mt-1">{result.codingScore}</div>
            <span className="text-[10px] text-slate-500">pts earned</span>
          </div>
        </div>

        {/* Idempotent Submission Tag */}
        {result.isIdempotentReplay && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retrieved existing recorded score</span>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2.5 pt-2">
          {isPassed ? (
            <Link
              to="/interview/dsa"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-500/20"
            >
              <Award className="w-4 h-4" />
              <span>Proceed to AI Technical Interview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : null}

          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-sm font-medium transition"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
