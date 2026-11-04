import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { assessmentApi, AssessmentOverview } from '../api/assessmentApi';
import { apiClient } from '../../../lib/axios';
import {
  Clock,
  Code,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Sparkles,
  Layers,
  Layout,
  Server,
} from 'lucide-react';
import { BackButton } from '../../../components/common/BackButton';

interface DomainItem {
  id: string;
  slug: string;
  title: string;
  description: string;
}

export const OALandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [domains, setDomains] = useState<DomainItem[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('fullstack');
  const [overview, setOverview] = useState<AssessmentOverview | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available domains
  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const res = await apiClient.get<{ success: boolean; data: DomainItem[] }>('/api/domains');
        if (res.data.success && res.data.data.length > 0) {
          setDomains(res.data.data);
          const defaultDomain = res.data.data.find((d: DomainItem) => d.slug === 'fullstack') || res.data.data[0];
          setSelectedDomain(defaultDomain.slug);
        }
      } catch (err) {
        console.error('Failed to load domains:', err);
      }
    };
    fetchDomains();
  }, []);

  // Fetch overview when selected domain changes
  useEffect(() => {
    if (!selectedDomain) return;

    const fetchOverview = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await assessmentApi.getOverview(selectedDomain);
        setOverview(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'No assessment available for this domain.');
        setOverview(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverview();
  }, [selectedDomain]);

  const handleStartAssessment = async () => {
    if (!overview) return;

    try {
      setIsStarting(true);
      setError(null);
      const res = await assessmentApi.startOrResume(overview.id);
      navigate(`/oa/${res.attempt.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to start assessment. Please try again.');
      setIsStarting(false);
    }
  };

  const getDomainIcon = (slug: string) => {
    switch (slug) {
      case 'frontend':
        return <Layout className="w-5 h-5 text-sky-400" />;
      case 'backend':
        return <Server className="w-5 h-5 text-emerald-400" />;
      default:
        return <Layers className="w-5 h-5 text-indigo-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fadeIn">
      <BackButton />
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" /> Round 1 Technical Screening
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
          Online Assessment (OA)
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Complete algorithmic coding challenges and multiple-choice concept evaluations in a timed, server-authoritative sandbox.
        </p>
      </div>

      {/* Domain Selection Tabs */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Select Your Target Domain:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {domains.map((dom) => {
            const isSelected = selectedDomain === dom.slug || selectedDomain === dom.id;
            return (
              <button
                key={dom.id}
                type="button"
                onClick={() => setSelectedDomain(dom.slug)}
                className={`p-4 rounded-xl border text-left transition flex items-start gap-3 ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-slate-100 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 shrink-0">
                  {getDomainIcon(dom.slug)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-200">{dom.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{dom.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview & Instructions Card */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          <p className="text-xs text-slate-400">Loading assessment details...</p>
        </div>
      ) : overview ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">
                {overview.domainTitle}
              </span>
              <h3 className="text-xl font-bold text-slate-100 mt-1">{overview.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{overview.description}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase text-slate-400 block font-medium">Duration</span>
                <span className="text-sm font-bold text-amber-400 flex items-center gap-1 justify-center mt-0.5">
                  <Clock className="w-3.5 h-3.5" /> {overview.durationMinutes}m
                </span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] uppercase text-slate-400 block font-medium">Passing</span>
                <span className="text-sm font-bold text-emerald-400 flex items-center gap-1 justify-center mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {overview.passingScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Exam Rules & Instructions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Examination Environment & Directives:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Server-Authoritative Clock
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  The {overview.durationMinutes}-minute countdown starts immediately upon launch. It is calculated by the server and auto-submits when time expires.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Continuous Background Autosave
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Your code drafts and MCQ selections are synced every 10 seconds. You can refresh or recover your session without losing answers.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-sky-400" /> Monaco Coding Sandbox
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Test your algorithmic solutions against sample visible test cases. Final scoring evaluates both visible and hidden test cases.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" /> Idempotent Final Submission
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Submissions are idempotent. If network drops during submit, retrying safely returns your verified score without duplicate attempts.
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleStartAssessment}
              disabled={isStarting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {isStarting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Initializing Assessment Session...</span>
                </>
              ) : (
                <>
                  <span>Launch Assessment ({overview.durationMinutes} Minutes)</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-sm">
          No assessment available for this domain.
        </div>
      )}
    </div>
  );
};
