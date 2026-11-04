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
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl flex flex-col items-center gap-3 text-slate-300">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-sm">Retrieving unified candidate evaluation dossier across databases...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-md w-full space-y-4 text-center">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <h3 className="text-lg font-bold text-white">Failed to Load Candidate Reports</h3>
          <p className="text-xs text-slate-400">
            {(error as any)?.message || 'Could not fetch candidate reports from PostgreSQL and MongoDB.'}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const { candidate, reports } = data;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{candidate.fullName}</h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                {candidate.targetDomain}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Email: <span className="text-slate-200">{candidate.email}</span> &bull; Status:{' '}
              <span className="font-semibold text-indigo-400">{candidate.status}</span> &bull; Composite Score:{' '}
              <span className="font-bold text-white">
                {candidate.compositeScore !== null ? `${candidate.compositeScore}/100` : 'Pending'}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 bg-slate-950/40">
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
                className={`pb-3 px-3 flex items-center gap-2 text-xs font-semibold border-b-2 transition ${
                  isSelected
                    ? 'border-indigo-500 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.score !== undefined && tab.score !== null && (
                  <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 text-[10px]">
                    {tab.score}/100
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: ATS Resume */}
          {activeTab === 'resume' && (
            <div className="space-y-5">
              {reports.resume ? (
                <>
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">ATS Relevance Score</h4>
                      <p className="text-xs text-slate-400">Extracted from MongoDB resume analysis</p>
                    </div>
                    <div className="text-2xl font-extrabold text-blue-400">{reports.resume.score}/100</div>
                  </div>

                  {/* Subscore Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                      <div className="text-xs text-slate-400">Keywords</div>
                      <div className="text-lg font-bold text-white">{reports.resume.breakdown.keywordScore}/30</div>
                    </div>
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                      <div className="text-xs text-slate-400">Impact</div>
                      <div className="text-lg font-bold text-white">{reports.resume.breakdown.impactScore}/30</div>
                    </div>
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                      <div className="text-xs text-slate-400">Formatting</div>
                      <div className="text-lg font-bold text-white">{reports.resume.breakdown.formattingScore}/20</div>
                    </div>
                    <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                      <div className="text-xs text-slate-400">Skills</div>
                      <div className="text-lg font-bold text-white">{reports.resume.breakdown.skillsScore}/20</div>
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl space-y-2">
                      <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">ATS Strengths</h5>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                        {reports.resume.atsStrengths.map((s, idx) => (
                          <li key={idx}>{s}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-xl space-y-2">
                      <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider">ATS Weaknesses</h5>
                      <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                        {reports.resume.atsWeaknesses.map((w, idx) => (
                          <li key={idx}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Extracted Skills */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Extracted Skills</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {reports.resume.extractedSkills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <FileText className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-sm">No Resume ATS evaluation found for this candidate.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Technical OA */}
          {activeTab === 'oa' && (
            <div className="space-y-5">
              {reports.oa ? (
                <>
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{reports.oa.assessmentTitle}</h4>
                      <p className="text-xs text-slate-400">
                        Status: <span className="text-emerald-400 font-semibold">{reports.oa.status}</span> &bull;
                        Result:{' '}
                        <span className={`font-semibold ${reports.oa.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {reports.oa.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </p>
                    </div>
                    <div className="text-2xl font-extrabold text-emerald-400">{reports.oa.totalScore}/100</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                      <div className="text-xs text-slate-400">MCQ Score</div>
                      <div className="text-xl font-bold text-white mt-1">{reports.oa.mcqScore ?? 0} pts</div>
                    </div>
                    <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                      <div className="text-xs text-slate-400">Coding Score</div>
                      <div className="text-xl font-bold text-white mt-1">{reports.oa.codingScore ?? 0} pts</div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <Terminal className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-sm">No OA attempt completed yet by this candidate.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI DSA Interview */}
          {activeTab === 'dsa' && (
            <div className="space-y-5">
              {reports.dsa ? (
                <>
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{reports.dsa.problemTitle || 'AI DSA Technical Round'}</h4>
                      <p className="text-xs text-slate-400">
                        Status: <span className="text-indigo-400 font-semibold">{reports.dsa.status}</span> &bull;
                        Stage: <span className="font-semibold text-slate-200">{reports.dsa.stage}</span>
                      </p>
                    </div>
                    <div className="text-2xl font-extrabold text-indigo-400">{reports.dsa.overallScore ?? 'N/A'}/100</div>
                  </div>

                  {/* AI Rubric Feedback */}
                  {reports.dsa.evaluation && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                          <span className="text-xs text-slate-400">Technical Rubric</span>
                          <div className="text-base font-bold text-white">{reports.dsa.evaluation.technicalScore}/100</div>
                        </div>
                        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
                          <span className="text-xs text-slate-400">Communication Rubric</span>
                          <div className="text-base font-bold text-white">{reports.dsa.evaluation.communicationScore}/100</div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
                        <span className="text-xs font-semibold uppercase text-indigo-400">Recommendation</span>
                        <div className="text-sm font-bold text-white">{reports.dsa.evaluation.recommendation}</div>
                        <p className="text-xs text-slate-300">
                          {reports.dsa.evaluation.detailedFeedback?.technicalAnalysis}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Submitted Code */}
                  {reports.dsa.submittedCode && (
                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase text-slate-400">Final Submitted Code</span>
                      <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto max-h-60">
                        {reports.dsa.submittedCode}
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <Code2 className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-sm">No DSA Technical Interview completed yet by this candidate.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AI HR Behavioral Interview */}
          {activeTab === 'hr' && (
            <div className="space-y-5">
              {reports.hr ? (
                <>
                  <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">AI HR Behavioral Interview</h4>
                      <p className="text-xs text-slate-400">
                        Interviewer: <span className="font-semibold text-amber-400">Sophia (AI HR Partner)</span> &bull;
                        Status: <span className="text-emerald-400 font-semibold">{reports.hr.status}</span>
                      </p>
                    </div>
                    <div className="text-2xl font-extrabold text-amber-400">{reports.hr.overallScore ?? 'N/A'}/100</div>
                  </div>

                  {/* STAR Breakdown */}
                  {reports.hr.starBreakdown && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        STAR Methodology Scoring
                      </h5>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                          <span className="text-xs text-slate-400">Situation</span>
                          <div className="text-lg font-bold text-white">{reports.hr.starBreakdown.situationScore}/25</div>
                        </div>
                        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                          <span className="text-xs text-slate-400">Task</span>
                          <div className="text-lg font-bold text-white">{reports.hr.starBreakdown.taskScore}/25</div>
                        </div>
                        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                          <span className="text-xs text-slate-400">Action</span>
                          <div className="text-lg font-bold text-white">{reports.hr.starBreakdown.actionScore}/25</div>
                        </div>
                        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-center">
                          <span className="text-xs text-slate-400">Result</span>
                          <div className="text-lg font-bold text-white">{reports.hr.starBreakdown.resultScore}/25</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Live Dialogue Transcript */}
                  {reports.hr.transcriptTurns && reports.hr.transcriptTurns.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Interview Dialogue Turns ({reports.hr.transcriptTurns.length})
                      </h5>
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {reports.hr.transcriptTurns.map((turn, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl text-xs space-y-1 ${
                              turn.role === 'ai'
                                ? 'bg-indigo-950/30 border border-indigo-500/20 text-indigo-200'
                                : 'bg-slate-800/60 border border-slate-700 text-slate-200'
                            }`}
                          >
                            <span className="font-semibold block uppercase text-[10px] text-slate-400">
                              {turn.role === 'ai' ? 'Sophia (AI Interviewer)' : candidate.fullName}
                            </span>
                            <p className="leading-relaxed">{turn.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-12 text-center text-slate-500 space-y-2">
                  <Users className="w-10 h-10 mx-auto opacity-40" />
                  <p className="text-sm">No HR Behavioral Interview completed yet by this candidate.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
