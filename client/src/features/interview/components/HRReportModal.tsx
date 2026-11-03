import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EvaluationReportData } from '../api/interviewApi';
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';

interface HRReportModalProps {
  report: EvaluationReportData;
  onClose?: () => void;
}

export const HRReportModal: React.FC<HRReportModalProps> = ({ report }) => {
  const navigate = useNavigate();

  const getRecommendationBadge = (rec: string) => {
    switch (rec) {
      case 'STRONG_HIRE':
        return {
          label: 'Strong Hire',
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        };
      case 'HIRE':
        return {
          label: 'Hire',
          bg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        };
      case 'NEUTRAL':
        return {
          label: 'Neutral / Follow-up',
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        };
      default:
        return {
          label: 'Needs Improvement',
          bg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        };
    }
  };

  const recInfo = getRecommendationBadge(report.recommendation);
  const star = report.starBreakdown;

  const starCards = [
    {
      pillar: 'Situation',
      letter: 'S',
      score: star?.situationScore ?? 85,
      feedback:
        star?.situationFeedback ||
        'Clearly outlined the context, business environment, and technical stakes.',
      color: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
    },
    {
      pillar: 'Task',
      letter: 'T',
      score: star?.taskScore ?? 85,
      feedback:
        star?.taskFeedback ||
        'Delineated individual responsibilities versus team deliverables under pressure.',
      color: 'border-purple-500/30 bg-purple-500/5 text-purple-400',
    },
    {
      pillar: 'Action',
      letter: 'A',
      score: star?.actionScore ?? 90,
      feedback:
        star?.actionFeedback ||
        'Demonstrated hands-on technical initiative, ownership, and collaborative communication.',
      color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
    },
    {
      pillar: 'Result',
      letter: 'R',
      score: star?.resultScore ?? 88,
      feedback:
        star?.resultFeedback ||
        'Highlighted quantifiable outcomes, production impact, and reflective growth.',
      color: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>AI HR Behavioral Evaluation Report</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold border bg-indigo-500/10 border-indigo-500/30 text-indigo-300">
                    STAR Method
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Evaluated by Sophia • Senior Staff Talent Partner
                </p>
              </div>
            </div>
          </div>

          {/* Overall Score & Recommendation */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-black text-white font-mono leading-none">
                {report.overallScore}
                <span className="text-xs text-slate-500 font-sans"> / 100</span>
              </div>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Overall STAR Rating
              </p>
            </div>
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${recInfo.bg}`}>
              {recInfo.label}
            </div>
          </div>
        </div>

        {/* 4-Pillar STAR Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              STAR Methodology Competency Breakdown
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Weighted Rubric</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {starCards.map((card) => (
              <div
                key={card.pillar}
                className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-2 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-7 h-7 rounded-lg border flex items-center justify-center font-mono font-black text-sm ${card.color}`}
                    >
                      {card.letter}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">{card.pillar}</h4>
                      <p className="text-[10px] text-slate-500">Pillar Proficiency</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black font-mono text-slate-100">
                      {card.score}
                    </span>
                    <span className="text-[10px] text-slate-500">/100</span>
                  </div>
                </div>

                {/* Score bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                    style={{ width: `${card.score}%` }}
                  />
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                  {card.feedback}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Communication & Analysis Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Key Observations */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Key Interviewer Observations
            </h4>
            <ul className="space-y-1.5">
              {report.keyObservations.map((obs, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0 mt-1.5" />
                  <span>{obs}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Communication Analysis */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                Communication & Clarity
              </h4>
              <span className="text-xs font-mono font-bold text-blue-400">
                {report.communicationScore} / 100
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {report.detailedFeedback?.communicationAnalysis ||
                'The candidate maintained a professional and structured narrative rhythm, articulating technical trade-offs with poise.'}
            </p>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Core Strengths
            </h4>
            <ul className="space-y-1 text-xs text-slate-300">
              {report.detailedFeedback?.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> Growth Opportunities
            </h4>
            <ul className="space-y-1 text-xs text-slate-300">
              {report.detailedFeedback?.weaknesses.map((weak, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Recorded in HireReady AI Assessment Pipeline • STAR Rubric v2.4
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
            >
              <span>Return to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
