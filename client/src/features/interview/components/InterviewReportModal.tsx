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
          classes: 'bg-[#152B1E] border-[#255436] text-emerald-300',
        };
      case 'HIRE':
        return {
          label: 'Hire',
          classes: 'bg-[#2D1A10] border-[#522E22] text-[#F0B87A]',
        };
      case 'NEUTRAL':
        return {
          label: 'Neutral / Borderline',
          classes: 'bg-[#2D1A10] border-[#522E22] text-[#F0B87A]',
        };
      default:
        return {
          label: 'Needs Improvement',
          classes: 'bg-[#2E100D] border-red-800 text-red-300',
        };
    }
  };

  const badge = getRecommendationBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0403]/80 backdrop-blur-md animate-fadeIn overflow-y-auto text-[#F5E8DD]">
      <div className="bg-[#1A0C09] border border-[#3E1D19] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        {/* Top Status Gradient Strip */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl ${
            isHire ? 'bg-gradient-to-r from-emerald-500 to-[#F0B87A]' : 'bg-gradient-to-r from-red-500 to-amber-500'
          }`}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3E1D19]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#2D1A10] text-[#F0B87A] border border-[#522E22]">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-serif font-medium tracking-tight text-[#F5E8DD]">Interview Evaluation Report</h2>
                <p className="text-xs text-[#A88879]">Authoritative technical score & behavioral breakdown</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-serif font-bold text-[#F0B87A]">{report.overallScore}</span>
              <span className="text-xs text-[#856658]"> / 100</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${badge.classes}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* 4 Score Pillars Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Technical Score', score: report.technicalScore, icon: Code },
            { label: 'Complexity', score: report.timeComplexityScore ?? report.technicalScore, icon: TrendingUp },
            { label: 'Code Quality', score: report.codeQuality ?? 85, icon: Award },
            { label: 'Communication', score: report.communicationScore, icon: MessageSquare },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#140705] border border-[#3E1D19] text-center space-y-1">
                <Icon className="w-4 h-4 mx-auto text-[#F0B87A]" />
                <div className="text-xs text-[#A88879]">{item.label}</div>
                <div className="text-lg font-serif font-bold text-[#F5E8DD]">{item.score}/100</div>
              </div>
            );
          })}
        </div>

        {/* Strengths & Actionable Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#152B1E]/60 border border-[#255436] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Demonstrated Strengths</span>
            </h4>
            <ul className="text-xs text-[#D4B8A8] space-y-1 list-disc list-inside">
              {(report.strengths || report.detailedFeedback?.strengths || []).slice(0, 3).map((s: string, idx: number) => (
                <li key={idx} className="leading-relaxed">{s}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#2D1A10]/60 border border-[#522E22] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F0B87A] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Primary Fixes Needed</span>
            </h4>
            <ul className="text-xs text-[#D4B8A8] space-y-1 list-disc list-inside">
              {(report.areasOfImprovement || report.detailedFeedback?.weaknesses || []).slice(0, 3).map((a: string, idx: number) => (
                <li key={idx} className="leading-relaxed">{a}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Summary Feedback */}
        <div className="p-4 rounded-2xl bg-[#140705] border border-[#3E1D19] space-y-1.5">
          <h4 className="text-xs font-bold text-[#F0B87A] uppercase tracking-wider">Interviewer Assessment</h4>
          <p className="text-xs text-[#A88879] leading-relaxed italic">
            "{report.summaryFeedback || report.detailedFeedback?.technicalAnalysis || 'Candidate demonstrated structured problem-solving approach.'}"
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#3E1D19]">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-medium text-[#A88879] bg-[#140705] border border-[#3E1D19] hover:bg-[#24110E] hover:text-[#F5E8DD] transition text-center"
          >
            Back to Dashboard
          </Link>

          <Link
            to="/interview/hr"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F0B87A] to-[#E2A664] hover:from-[#F5C68F] hover:to-[#EDB373] text-[#140808] text-xs font-bold shadow-[0_0_20px_rgba(240,184,122,0.3)] flex items-center justify-center gap-2 transition"
          >
            <span>Proceed to Step 4: AI HR Round</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default InterviewReportModal;