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
          classes: 'bg-[#E6F4EA] border-[#B7E4C7] text-[#1F7A3A]',
        };
      case 'HIRE':
        return {
          label: 'Hire',
          classes: 'bg-[#ECFEFF] border-[#A5F3FC] text-[#0E7490]',
        };
      case 'NEUTRAL':
        return {
          label: 'Neutral / Borderline',
          classes: 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]',
        };
      default:
        return {
          label: 'Needs Improvement',
          classes: 'bg-[#FEE2E2] border-[#FECDD3] text-[#B91C1C]',
        };
    }
  };

  const badge = getRecommendationBadge();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0706]/40 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white border border-[#F2DDD2] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-xl relative my-8 text-[#0A0706]">
        {/* Top Status Gradient Strip */}
        <div
          className={`absolute top-0 left-0 right-0 h-2 rounded-t-3xl ${
            isHire ? 'bg-gradient-to-r from-emerald-500 to-[#FF7A48]' : 'bg-gradient-to-r from-rose-500 to-amber-500'
          }`}
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2DDD2]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#FFEBE1] text-[#FF7A48] border border-[#FFD7C5]">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Interview Evaluation Report</h2>
                <p className="text-xs text-[#6B544A]">Authoritative technical score & behavioral breakdown</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-2xl font-black font-mono text-[#0A0706]">{report.overallScore}</span>
              <span className="text-xs text-[#8C7268]"> / 100</span>
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
              <div key={idx} className="p-3 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] text-center space-y-1">
                <Icon className="w-4 h-4 mx-auto text-[#FF7A48]" />
                <div className="text-xs text-[#6B544A]">{item.label}</div>
                <div className="text-lg font-bold font-mono text-[#0A0706]">{item.score}/100</div>
              </div>
            );
          })}
        </div>

        {/* Strengths & Actionable Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#E6F4EA]/40 border border-[#CEEAD6] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F7A3A] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Demonstrated Strengths</span>
            </h4>
            <ul className="text-xs text-[#0A0706] space-y-1 list-disc list-inside">
              {(report.strengths || report.detailedFeedback?.strengths || []).slice(0, 3).map((s: string, idx: number) => (
                <li key={idx} className="leading-relaxed">{s}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF5F0] border border-[#F2DDD2] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A83E14] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Primary Fixes Needed</span>
            </h4>
            <ul className="text-xs text-[#0A0706] space-y-1 list-disc list-inside">
              {(report.areasOfImprovement || report.detailedFeedback?.weaknesses || []).slice(0, 3).map((a: string, idx: number) => (
                <li key={idx} className="leading-relaxed">{a}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Summary Feedback */}
        <div className="p-4 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] space-y-1.5">
          <h4 className="text-xs font-bold text-[#0A0706] uppercase tracking-wider">Interviewer Assessment</h4>
          <p className="text-xs text-[#6B544A] leading-relaxed italic">
            "{report.summaryFeedback || report.detailedFeedback?.technicalAnalysis || 'Candidate demonstrated structured problem-solving approach.'}"
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F2DDD2]">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-medium text-[#6B544A] bg-white border border-[#F2DDD2] hover:bg-[#FFF5F0] hover:text-[#0A0706] transition text-center"
          >
            Back to Dashboard
          </Link>

          <Link
            to="/interview/hr"
            className="w-full sm:w-auto btn-primary px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-2"
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
