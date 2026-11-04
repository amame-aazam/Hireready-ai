import React, { useState } from 'react';
import { useResume } from '../hooks/useResume';
import { ResumeDropzone } from '../components/ResumeDropzone';
import { ATSScoreCard } from '../components/ATSScoreCard';
import { MissingKeywords } from '../components/MissingKeywords';
import { ATSActionPlan } from '../components/ATSActionPlan';
import { FileText, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { BackButton } from '../../../components/common/BackButton';

export const ResumePage: React.FC = () => {
  const {
    latestAnalysis,
    isLatestLoading,
    domains,
    isDomainsLoading,
    uploadResume,
    isUploading,
    uploadError,
  } = useResume();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDomainId, setSelectedDomainId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'report'>('upload');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a resume file first.');
      return;
    }
    setErrorMessage(null);

    try {
      await uploadResume({
        file: selectedFile,
        domainId: selectedDomainId || undefined,
      });
      setActiveTab('report');
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.error?.message ||
          'Failed to analyze resume. Please check the document format and try again.'
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      <BackButton />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI ATS Resume Scanner
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Resume Optimization &amp; ATS Scoring
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Evaluate your resume against top technical domain rubrics with explainable 4-pillar analysis.
          </p>
        </div>

        {/* Tab Toggle */}
        {latestAnalysis && (
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upload New
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'report'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              View Latest Report
            </button>
          </div>
        )}
      </div>

      {/* Upload View */}
      {activeTab === 'upload' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Target Domain Selector */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Select Target Engineering Domain
            </label>
            <p className="text-xs text-slate-400">
              ATS keywords and technical criteria will be tailored directly to your chosen track.
            </p>
            <select
              value={selectedDomainId}
              onChange={(e) => setSelectedDomainId(e.target.value)}
              disabled={isDomainsLoading || isUploading}
              aria-label="Select Target Engineering Domain"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="">Default (Full Stack Web Development)</option>
              {domains.map((dom) => (
                <option key={dom.id} value={dom.id}>
                  {dom.title}
                </option>
              ))}
            </select>
          </div>

          {/* Dropzone */}
          <div className="space-y-4">
            <ResumeDropzone
              onFileSelected={(file) => setSelectedFile(file)}
              isUploading={isUploading}
            />

            {(errorMessage || uploadError) && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>
                  {errorMessage ||
                    (uploadError as any)?.response?.data?.error?.message ||
                    'An error occurred while uploading. Please try again.'}
                </span>
              </div>
            )}

            <button
              onClick={handleUploadAndAnalyze}
              disabled={!selectedFile || isUploading}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-semibold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing Resume with Mock AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Run AI ATS Analysis
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Report View */}
      {activeTab === 'report' && (
        <div className="space-y-8">
          {isLatestLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <p className="text-sm">Loading ATS evaluation report...</p>
            </div>
          ) : latestAnalysis ? (
            <>
              <ATSScoreCard
                score={latestAnalysis.score}
                breakdown={latestAnalysis.scoreBreakdown}
                targetDomain={latestAnalysis.targetDomain}
                createdAt={latestAnalysis.createdAt}
              />

              <MissingKeywords
                missingKeywords={latestAnalysis.missingKeywords}
                extractedSkills={latestAnalysis.extractedSkills}
              />

              <ATSActionPlan
                strengths={latestAnalysis.atsStrengths}
                weaknesses={latestAnalysis.atsWeaknesses}
                suggestions={latestAnalysis.suggestedImprovements}
              />
            </>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <FileText className="w-10 h-10 mx-auto text-slate-500" />
              <h3 className="text-base font-semibold text-white">No Previous Analysis Found</h3>
              <p className="text-xs text-slate-400">
                You haven&apos;t uploaded a resume yet. Upload one to receive your personalized score.
              </p>
              <button
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition"
              >
                Upload Resume
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
