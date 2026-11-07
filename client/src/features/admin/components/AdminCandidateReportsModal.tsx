import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi, CandidateReports } from '../api/adminApi';
import {
  X,
  FileText,
  Terminal,
  Code2,
  Users,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';

interface AdminCandidateReportsModalProps {
  applicationId: string;
  onClose: () => void;
}

export const AdminCandidateReportsModal: React.FC<AdminCandidateReportsModalProps> = ({
  applicationId,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'oa' | 'dsa' | 'hr'>('resume');

  const { data, isLoading, isError, error } = useQuery<CandidateReports>({
    queryKey: ['candidateReports', applicationId],
    queryFn: () => adminApi.getCandidateReports(applicationId),
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0706]/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white border border-[#F2DDD2] p-8 rounded-3xl flex flex-col items-center gap-3 text-[#6B544A] shadow-xl">
          <RefreshCw className="w-8 h-8 text-[#FF7A48] animate-spin" />
          <p className="text-sm font-medium">Retrieving unified candidate evaluation dossier across databases...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0706]/40 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white border border-[#F2DDD2] p-8 rounded-3xl max-w-md w-full space-y-4 text-center shadow-xl">
          <AlertCircle className="w-10 h-10 text-[#FF7A48] mx-auto" />
          <h3 className="text-lg font-serif font-medium text-[#0A0706]">Failed to Load Candidate Reports</h3>
          <p className="text-xs text-[#6B544A]">
            {(error as any)?.message || 'Could not fetch candidate reports from PostgreSQL and MongoDB.'}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0A0706] hover:bg-[#221C19] text-white rounded-full text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const { candidate, reports } = data;

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0706]/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-[#F2DDD2] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[#F2DDD2] flex items-center justify-between bg-[#FFFAF7]">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-serif font-medium text-[#0A0706]">{candidate.fullName}</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FFEBE1] text-[#A83E14] border border-[#FFD0BC]">
                {candidate.targetDomain}
              </span>
            </div>
            <p className="text-xs text-[#6B544A] mt-1">
              Email: <span className="text-[#0A0706] font-medium">{candidate.email}</span> &bull; Status:{' '}
              <span className="font-semibold text-[#FF7A48]">{candidate.status}</span> &bull; Composite Score:{' '}
              <span className="font-bold text-[#0A0706]">
                {candidate.compositeScore !== null ? `${candidate.compositeScore}/100` : 'Pending'}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8C7268] hover:text-[#0A0706] rounded-full hover:bg-[#F2DDD2]/40 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#F2DDD2] bg-[#FFFAF7]/60 overflow-x-auto">
          {[
            { id: 'resume', label: '1. ATS Resume', icon: FileText, score: reports.resume?.score },
            { id: 'oa', label: '2. Technical OA', icon: Terminal, score: reports.oa?.totalScore },
            { id: 'dsa', label: '3. AI DSA Round', icon: Code2, score: reports.dsa?.overallScore },
            { id: 'hr', label: '4. AI HR Behavioral', icon: Users, score: reports.hr?.overallScore },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-3.5 flex items-center gap-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                  isSelected
                    ? 'border-[#0A0706] text-[#0A0706]'
                    : 'border-transparent text-[#8C7268] hover:text-[#0A0706]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.score !== undefined && tab.score !== null && (
                  <span className="px-2 py-0.5 rounded-full bg-[#FFEBE1] text-[#A83E14] text-[10px] font-bold">
                    {tab.score}/100
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Report Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
          {/* Resume Tab */}
          {activeTab === 'resume' && (
            reports.resume ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#0A0706]">Resume Score</h4>
                    <span className="text-xs text-[#6B544A]">Parsed with explainable 4-pillar weights</span>
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#FF7A48]">
                    {reports.resume.score}/100
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2]">
                    <span className="text-[#8C7268] block">Skills Match</span>
                    <span className="font-bold text-[#0A0706] text-sm">
                      {reports.resume.breakdown?.skillsScore}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2]">
                    <span className="text-[#8C7268] block">Keywords</span>
                    <span className="font-bold text-[#0A0706] text-sm">
                      {reports.resume.breakdown?.keywordScore}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2]">
                    <span className="text-[#8C7268] block">Formatting</span>
                    <span className="font-bold text-[#0A0706] text-sm">
                      {reports.resume.breakdown?.formattingScore}%
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2]">
                    <span className="text-[#8C7268] block">Impact</span>
                    <span className="font-bold text-[#0A0706] text-sm">
                      {reports.resume.breakdown?.impactScore}%
                    </span>
                  </div>
                </div>

                {reports.resume.atsStrengths && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-semibold text-[#0A0706] uppercase tracking-wider">
                      Identified Strengths
                    </h5>
                    <ul className="space-y-1 text-xs text-[#6B544A]">
                      {reports.resume.atsStrengths.map((str: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A3A] mt-0.5 shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-10 text-center text-[#8C7268] text-xs">
                Candidate has not submitted an ATS Resume audit yet.
              </div>
            )
          )}

          {/* OA Tab */}
          {activeTab === 'oa' && (
            reports.oa ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#0A0706]">Technical OA Score</h4>
                    <span className="text-xs text-[#6B544A]">MCQ and coding problem combined result</span>
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#1F7A3A]">
                    {reports.oa.totalScore}%
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2]">
                    <span className="text-[#8C7268] block">MCQ Points</span>
                    <span className="font-bold text-[#0A0706] text-lg">{reports.oa.mcqScore} pts</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2]">
                    <span className="text-[#8C7268] block">Coding Sandbox Points</span>
                    <span className="font-bold text-[#0A0706] text-lg">{reports.oa.codingScore} pts</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-[#8C7268] text-xs">
                Candidate has not taken or completed the Technical OA round.
              </div>
            )
          )}

          {/* DSA Tab */}
          {activeTab === 'dsa' && (
            reports.dsa ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#0A0706]">AI DSA Interview Score</h4>
                    <span className="text-xs text-[#6B544A]">Approach-First voice assessment &amp; code</span>
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#A83E14]">
                    {reports.dsa.overallScore}/100
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] text-xs text-[#6B544A] leading-relaxed">
                  <strong className="text-[#0A0706] block mb-1">Qualitative Feedback:</strong>
                  {(reports.dsa as any)?.feedback || reports.dsa.evaluation?.detailedFeedback?.technicalAnalysis || 'Candidate completed all prompt checkpoints.'}
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-[#8C7268] text-xs">
                Candidate has not attended the Technical DSA interview.
              </div>
            )
          )}

          {/* HR Tab */}
          {activeTab === 'hr' && (
            reports.hr ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#0A0706]">AI HR Behavioral Score</h4>
                    <span className="text-xs text-[#6B544A]">STAR methodology with voice &amp; video telemetry</span>
                  </div>
                  <div className="text-2xl font-serif font-bold text-amber-700">
                    {reports.hr.overallScore}/100
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] text-xs text-[#6B544A] leading-relaxed">
                  <strong className="text-[#0A0706] block mb-1">STAR Behavioral Notes:</strong>
                  {(reports.hr as any)?.feedback || reports.hr.evaluation?.recommendation || 'Candidate demonstrated structured responses across core leadership competencies.'}
                </div>
              </div>
            ) : (
              <div className="p-10 text-center text-[#8C7268] text-xs">
                Candidate has not completed the Behavioral HR interview.
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F2DDD2] bg-[#FFFAF7] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#0A0706] hover:bg-[#221C19] text-white rounded-full text-xs font-semibold transition"
          >
            Dismiss Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
export default AdminCandidateReportsModal;
