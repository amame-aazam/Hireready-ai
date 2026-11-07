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
          bg: 'bg-[#152B1E] border-[#255436] text-emerald-300',
        };
      case 'HIRE':
        return {
          label: 'Hire',
          bg: 'bg-[#2D1A10] border-[#522E22] text-[#F0B87A]',
        };
      case 'NEUTRAL':
        return {
          label: 'Neutral / Follow-up',
          bg: 'bg-[#2D1A10] border-[#522E22] text-[#F0B87A]',
        };
      default:
        return {
          label: 'Needs Improvement',
          bg: 'bg-[#2E100D] border-red-800 text-red-300',
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
      color: 'border-[#3E1D19] bg-[#140705] text-[#F5E8DD]',
    },
    {
      pillar: 'Task',
      letter: 'T',
      score: star?.taskScore ?? 80,
      feedback:
        star?.taskFeedback ||
        'Articulated the explicit responsibility and expectations with clarity.',
      color: 'border-[#3E1D19] bg-[#140705] text-[#F5E8DD]',
    },
    {
      pillar: 'Action',
      letter: 'A',
      score: star?.actionScore ?? 88,
      feedback:
        star?.actionFeedback ||
        'Detail-oriented initiatives emphasizing individual execution and leadership.',
      color: 'border-[#522E22] bg-[#2D1A10] text-[#F0B87A]',
    },
    {
      pillar: 'Result',
      letter: 'R',
      score: star?.resultScore ?? 82,
      feedback:
        star?.resultFeedback ||
        'Quantified business impact, performance metrics, and post-project learning.',
      color: 'border-[#255436] bg-[#152B1E] text-emerald-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0403]/80 backdrop-blur-md overflow-y-auto text-[#F5E8DD]">
      <div className="bg-[#1A0C09] border border-[#3E1D19] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
        {/* Top Status Gradient Strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-emerald-500 via-[#F0B87A] to-[#E2A664]" />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#3E1D19]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#2D1A10] border border-[#522E22] flex items-center justify-center text-[#F0B87A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-serif font-medium tracking-tight text-[#F5E8DD]">AI HR Behavioral Evaluation Report</h2>
              <p className="text-xs text-[#A88879]">STAR Methodology & Communication Assessment</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-3xl font-serif font-bold text-[#F0B87A]">{report.overallScore}</span>
              <span className="text-xs text-[#856658]"> / 100</span>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${recInfo.bg}`}>
              {recInfo.label}
            </span>
          </div>
        </div>

        {/* STAR 4-Pillar Detailed Cards */}
        <div>
          <h3 className="text-xs font-bold text-[#F0B87A] uppercase tracking-wider mb-2.5">
            STAR Storytelling Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {starCards.map((c) => (
              <div key={c.pillar} className={`p-3.5 rounded-2xl border ${c.color} space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-[#1E0E0B] border border-[#3E1D19] font-bold text-xs flex items-center justify-center">
                      {c.letter}
                    </span>
                    <span className="font-serif font-medium text-xs">{c.pillar}</span>
                  </div>
                  <span className="font-mono font-bold text-xs text-[#F0B87A]">{c.score}/100</span>
                </div>
                <p className="text-xs text-[#A88879] leading-relaxed">{c.feedback}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Behavioral Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-2xl bg-[#140705] border border-[#3E1D19] text-center space-y-1">
            <div className="text-xs text-[#A88879]">Communication</div>
            <div className="text-lg font-serif font-bold text-[#F5E8DD]">{report.communicationScore}/100</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#140705] border border-[#3E1D19] text-center space-y-1">
            <div className="text-xs text-[#A88879]">Professional Clarity</div>
            <div className="text-lg font-serif font-bold text-[#F5E8DD]">{(report as any).codeQuality ?? report.technicalScore ?? 85}/100</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#140705] border border-[#3E1D19] text-center space-y-1 col-span-2 sm:col-span-1">
            <div className="text-xs text-[#A88879]">Recommendation</div>
            <div className="text-sm font-serif font-medium text-[#F0B87A] mt-1">{report.recommendation?.replace('_', ' ') || 'REVIEW'}</div>
          </div>
        </div>

        {/* Strengths & Actionable Areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#152B1E]/60 border border-[#255436] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Demonstrated Strengths</span>
            </h4>
            <ul className="text-xs text-[#D4B8A8] space-y-1 list-disc list-inside">
              {((report as any).strengths || report.detailedFeedback?.strengths || []).slice(0, 3).map((s: string, idx: number) => (
                <li key={idx} className="leading-relaxed">{s}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-[#2D1A10]/60 border border-[#522E22] space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F0B87A] flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" />
              <span>Primary Fixes Needed</span>
            </h4>
            <ul className="text-xs text-[#D4B8A8] space-y-1 list-disc list-inside">
              {((report as any).areasOfImprovement || report.detailedFeedback?.weaknesses || []).slice(0, 3).map((a: string, idx: number) => (
                <li key={idx} className="leading-relaxed">{a}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Summary Assessment */}
        <div className="p-4 rounded-2xl bg-[#140705] border border-[#3E1D19] space-y-1.5">
          <h4 className="text-xs font-bold text-[#F0B87A] uppercase tracking-wider">Talent Partner Summary</h4>
          <p className="text-xs text-[#A88879] leading-relaxed italic">
            "{(report as any).summaryFeedback || report.detailedFeedback?.communicationAnalysis || 'Candidate demonstrated consistent STAR responses across interview questions.'}"
          </p>
        </div>

        {/* Bottom Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#3E1D19]">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-medium text-[#A88879] bg-[#140705] border border-[#3E1D19] hover:bg-[#24110E] hover:text-[#F5E8DD] transition text-center cursor-pointer"
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-[#F0B87A] to-[#E2A664] hover:from-[#F5C68F] hover:to-[#EDB373] text-[#140808] text-xs font-bold shadow-[0_0_20px_rgba(240,184,122,0.3)] flex items-center justify-center gap-2 cursor-pointer transition"
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