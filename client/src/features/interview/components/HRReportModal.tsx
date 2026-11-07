import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EvaluationReportData } from '../api/interviewApi';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
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
          bg: 'bg-[#E6F4EA] border-[#B7E4C7] text-[#1F7A3A]',
        };
      case 'HIRE':
        return {
          label: 'Hire',
          bg: 'bg-[#ECFEFF] border-[#A5F3FC] text-[#0E7490]',
        };
      case 'NEUTRAL':
        return {
          label: 'Neutral / Follow-up',
          bg: 'bg-[#FEF3C7] border-[#FDE68A] text-[#B45309]',
        };
      default:
        return {
          label: 'Needs Improvement',
          bg: 'bg-[#FEE2E2] border-[#FECDD3] text-[#B91C1C]',
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
      color: 'border-[#BFDBFE] bg-[#EFF6FF] text-[#1E3FA6]',
    },
    {
      pillar: 'Task',
      letter: 'T',
      score: star?.taskScore ?? 80,
      feedback:
        star?.taskFeedback ||
        'Articulated the explicit responsibility and expectations with clarity.',
      color: 'border-[#DDD6FE] bg-[#F5F3FF] text-[#5B21B6]',
    },
    {
      pillar: 'Action',
      letter: 'A',
      score: star?.actionScore ?? 88,
      feedback:
        star?.actionFeedback ||
        'Detail-oriented initiatives emphasizing individual execution and leadership.',
      color: 'border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]',
    },
    {
      pillar: 'Result',
      letter: 'R',
      score: star?.resultScore ?? 82,
      feedback:
        star?.resultFeedback ||
        'Quantified business impact, performance metrics, and post-project learning.',
      color: 'border-[#B7E4C7] bg-[#E6F4EA] text-[#1F7A3A]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0706]/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-[#F2DDD2] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-xl relative my-8 text-[#0A0706]">
        {/* Top Status Gradient Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 rounded-t-3xl bg-gradient-to-r from-emerald-500 via-[#FF7A48] to-[#FF976B]" />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F2DDD2]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFEBE1] border border-[#FFD7C5] flex items-center justify-center text-[#FF7A48]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">AI HR Behavioral Evaluation Report</h2>
              <p className="text-xs text-[#6B544A]">STAR Methodology & Communication Assessment</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-3xl font-black font-mono text-[#0A0706]">{report.overallScore}</span>
              <span className="text-xs text-[#8C7268]"> / 100</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${recInfo.bg}`}>
              {recInfo.label}
            </span>
          </div>
        </div>

        {/* STAR 4-Pillar Detailed Cards */}
        <div>
          <h3 className="text-xs font-bold text-[#0A0706] uppercase tracking-wider mb-2.5">
            STAR Storytelling Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {starCards.map((c) => (
              <div key={c.pillar} className={`p-3.5 rounded-2xl border ${c.color} space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white border border-current font-bold text-xs flex items-center justify-center">
                      {c.letter}
                    </span>
                    <span className="font-bold text-xs">{c.pillar}</span>
                  </div>
                  <span className="font-mono font-bold text-xs">{c.score}/100</span>
                </div>
                <p className="text-xs text-[#0A0706] leading-relaxed opacity-90">{c.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] text-center space-y-1">
            <div className="text-xs text-[#6B544A]">Communication</div>
            <div className="text-lg font-bold font-mono text-[#0A0706]">{report.communicationScore}/100</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] text-center space-y-1">
            <div className="text-xs text-[#6B544A]">Professional Clarity</div>
            <div className="text-lg font-bold font-mono text-[#0A0706]">{(report as any).codeQuality ?? report.technicalScore ?? 85}/100</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] text-center space-y-1 col-span-2 sm:col-span-1">
            <div className="text-xs text-[#6B544A]">Recommendation</div>
            <div className="text-sm font-bold text-[#FF7A48] mt-1">{report.recommendation?.replace('_', ' ') || 'REVIEW'}</div>
          </div>
        </div>

        {/* Strengths & Actionable Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#E6F4EA]/40 border border-[#CEEAD6] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1F7A3A] flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Demonstrated Strengths</span>
            </h4>
            <ul className="text-xs text-[#0A0706] space-y-1 list-disc list-inside">
              {((report as any).strengths || report.detailedFeedback?.strengths || []).slice(0, 3).map((s: string, idx: number) => (
                <li key={idx} className="leading-relaxed">{s}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF5F0] border border-[#F2DDD2] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#A83E14] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>Primary Fixes Needed</span>
            </h4>
            <ul className="text-xs text-[#0A0706] space-y-1 list-disc list-inside">
              {((report as any).areasOfImprovement || report.detailedFeedback?.weaknesses || []).slice(0, 3).map((a: string, idx: number) => (
                <li key={idx} className="leading-relaxed">{a}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Summary Assessment */}
        <div className="p-4 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] space-y-1.5">
          <h4 className="text-xs font-bold text-[#0A0706] uppercase tracking-wider">Talent Partner Summary</h4>
          <p className="text-xs text-[#6B544A] leading-relaxed italic">
            "{(report as any).summaryFeedback || report.detailedFeedback?.communicationAnalysis || 'Candidate demonstrated consistent STAR responses across interview questions.'}"
          </p>
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#F2DDD2]">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-medium text-[#6B544A] bg-white border border-[#F2DDD2] hover:bg-[#FFF5F0] hover:text-[#0A0706] transition text-center cursor-pointer"
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto btn-primary px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Proceed to Step 5: Final Result & Certificate</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default HRReportModal;
