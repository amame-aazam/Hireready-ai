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
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <BackButton />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFEBE1] border border-[#FFD0BC] text-[#A83E14] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF7A48]" /> Step 1 Resume Audit
          </div>
          <h1 className="text-3xl font-serif font-normal text-[#0A0706] tracking-tight">
            Resume Optimization &amp; ATS Scoring
          </h1>
          <p className="text-sm text-[#6B544A] mt-1">
            Evaluate your resume against top technical domain rubrics with explainable 4-pillar analysis.
          </p>
        </div>

        {/* Tab Toggle */}
        {latestAnalysis && (
          <div className="flex items-center bg-[#FFFAF7] p-1 rounded-full border border-[#F2DDD2] self-start md:self-auto shadow-sm">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                activeTab === 'upload'
                  ? 'bg-[#0A0706] text-white shadow-sm'
                  : 'text-[#6B544A] hover:text-[#0A0706]'
              }`}
            >
              Upload New
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                activeTab === 'report'
                  ? 'bg-[#0A0706] text-white shadow-sm'
                  : 'text-[#6B544A] hover:text-[#0A0706]'
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
          <div className="p-6 rounded-3xl bg-white border border-[#F2DDD2] space-y-3 shadow-sm">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#0A0706]">
              Select Target Engineering Domain
            </label>
            <p className="text-xs text-[#6B544A]">
              ATS keywords and technical criteria will be tailored directly to your chosen track.
            </p>
            <select
              value={selectedDomainId}
              onChange={(e) => setSelectedDomainId(e.target.value)}
              disabled={isDomainsLoading || isUploading}
              aria-label="Select Target Engineering Domain"
              className="w-full px-4 py-2.5 bg-[#FFFAF7] border border-[#F2DDD2] rounded-xl text-sm text-[#0A0706] focus:outline-none focus:border-[#FF7A48] transition"
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
              <div className="p-3.5 rounded-2xl bg-[#FFF4EC] border border-[#F2DDD2] text-xs text-[#A83E14] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#FF7A48]" />
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
              className="w-full py-3.5 rounded-full bg-[#0A0706] hover:bg-[#221C19] disabled:opacity-40 text-white font-medium text-sm transition flex items-center justify-center gap-2 shadow-sm"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#FF7A48]" />
                  <span>Analyzing Resume with AI Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#FF7A48]" />
                  <span>Run AI ATS Analysis</span>
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
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-[#6B544A]">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF7A48]" />
              <p className="text-sm font-medium">Loading ATS evaluation report...</p>
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
            <div className="p-12 text-center rounded-3xl bg-white border border-[#F2DDD2] space-y-4 shadow-sm">
              <FileText className="w-10 h-10 mx-auto text-[#8C7268]" />
              <h3 className="text-lg font-serif font-medium text-[#0A0706]">No Previous Analysis Found</h3>
              <p className="text-xs text-[#6B544A] max-w-sm mx-auto">
                You haven&apos;t uploaded a resume yet. Upload one to receive your personalized score.
              </p>
              <button
                onClick={() => setActiveTab('upload')}
                className="px-5 py-2.5 rounded-full bg-[#0A0706] hover:bg-[#221C19] text-white text-xs font-semibold transition"
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
export default ResumePage;
