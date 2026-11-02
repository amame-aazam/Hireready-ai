import React from 'react';
import { EvaluationReportData } from '../api/interviewApi';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Code,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface InterviewReportModalProps {
  report: EvaluationReportData;
}

export const InterviewReportModal: React.FC<InterviewReportModalProps> = ({ report }) => {
  const isHire = report.recommendation === 'STRONG_HIRE' || report.recommendation === 'HIRE';

  const getRecommendationBadge = () => {
    switch (report.recommendation) {
      case 'STRONG_HIRE':
        return {
          label: 'Strong Hire',
          classes: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300',
        };
      case 'HIRE':
        return {
          label: 'Hire',
          classes: 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300',
        };
      case 'NEUTRAL':
        return {
          label: 'Neutral / Borderline',
          classes: 'bg-amber-500/15 border-amber-500/40 text-amber-300',
        };
      default:
        return {
          label: 'No Hire',
          classes: 'bg-rose-500/15 border-rose-500/40 text-rose-300',
        };
    }
  };

  const badge = getRecommendationBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        {/* Top Status Gradient Strip */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 rounded-t-2xl ${
            isHire ? 'bg-gradient-to-r from-emerald-500 to-indigo-500' : 'bg-gradient-to-r from-rose-500 to-amber-500'
          }`}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <span className="text-xs uppercase font-mono tracking-wider text-slate-400">
                Evaluation Report
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-100 mt-1">
              AI Technical Interview Evaluation
            </h2>
          </div>

          <div className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider self-start sm:self-center ${badge.classes}`}>
            {badge.label}
          </div>
        </div>

        {/* Score Ring / Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
              Overall Rating
            </span>
            <div className="text-3xl font-black text-indigo-400 mt-1">
              {report.overallScore}
              <span className="text-xs font-normal text-slate-500">/100</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Weighted Comprehensive</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium flex items-center justify-center gap-1">
              <Code className="w-3.5 h-3.5 text-amber-400" /> Technical Score
            </span>
            <div className="text-3xl font-black text-amber-400 mt-1">
              {report.technicalScore}
              <span className="text-xs font-normal text-slate-500">/100</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Problem & Code Accuracy</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium flex items-center justify-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-sky-400" /> Communication
            </span>
            <div className="text-3xl font-black text-sky-400 mt-1">
              {report.communicationScore}
              <span className="text-xs font-normal text-slate-500">/100</span>
            </div>
            <span className="text-[10px] text-slate-500 block mt-0.5">Clarity & Articulation</span>
          </div>
        </div>

        {/* Key Observations */}
        {report.keyObservations && report.keyObservations.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Key Observations:
            </h4>
            <div className="space-y-1.5 text-xs text-slate-300">
              {report.keyObservations.map((obs, i) => (
                <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{obs}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-emerald-950/15 border border-emerald-500/20 space-y-2">
            <h4 className="font-semibold text-emerald-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Strengths
            </h4>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              {report.detailedFeedback?.strengths?.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-950/15 border border-rose-500/20 space-y-2">
            <h4 className="font-semibold text-rose-300 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Improvement Areas
            </h4>
            <ul className="space-y-1 text-slate-300 text-[11px]">
              {report.detailedFeedback?.weaknesses?.map((w, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Qualitative Feedback */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2 leading-relaxed">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Qualitative Summary
          </span>
          <p className="text-slate-300">{report.detailedFeedback?.technicalAnalysis}</p>
          <p className="text-slate-400 text-[11px] pt-1">{report.detailedFeedback?.communicationAnalysis}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            to="/interview/hr"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/20"
          >
            <span>Proceed to Round 3: HR Behavioral Round</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center justify-center py-3 px-6 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};
