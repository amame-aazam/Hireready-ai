import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi, CandidateItem, CandidatesResponse } from '../api/adminApi';
import { AdminCandidateReportsModal } from './AdminCandidateReportsModal';
import { AdminStatusOverrideModal } from './AdminStatusOverrideModal';
import {
  Search,
  Eye,
  Edit3,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const AdminCandidatesTab: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Modal states
  const [viewingReportsId, setViewingReportsId] = useState<string | null>(null);
  const [overridingCandidate, setOverridingCandidate] = useState<CandidateItem | null>(null);

  const limit = 15;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<CandidatesResponse>({
    queryKey: ['adminCandidates', page, searchTerm, selectedDomain, selectedStatus],
    queryFn: () =>
      adminApi.getCandidates({
        page,
        limit,
        search: searchTerm,
        domain: selectedDomain,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
      }),
    staleTime: 30000,
  });

  const candidates = data?.candidates || [];
  const totalPages = data?.totalPages || 1;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SELECTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Selected
          </span>
        );
      case 'WAITLISTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Waitlisted
          </span>
        );
      case 'NOT_SELECTED':
      case 'REJECTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/50">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Filter Bar & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, email, or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700/70 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={selectedDomain}
            onChange={(e) => {
              setSelectedDomain(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-800/60 border border-slate-700/70 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Domains</option>
            <option value="Fullstack">Fullstack</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Data">Data</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-800/60 border border-slate-700/70 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="SELECTED">Selected</option>
            <option value="WAITLISTED">Waitlisted</option>
            <option value="NOT_SELECTED">Not Selected</option>
            <option value="OA_PASSED">OA Passed</option>
            <option value="COMPLETED">Completed</option>
            <option value="DRAFT">Draft</option>
          </select>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 transition"
            title="Refresh Candidate Pipeline"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Candidate Table */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 overflow-hidden backdrop-blur">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" />
            <p className="text-xs text-slate-400">Loading candidate pipelines...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-sm text-slate-300 font-semibold">Error Loading Candidates</p>
            <p className="text-xs text-slate-500">{(error as any)?.message || 'Failed to fetch candidate list'}</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No Candidates Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search query or domain filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Target Domain</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Multi-Round Scores</th>
                  <th className="py-3.5 px-4 text-right">Composite</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-slate-300">
                {candidates.map((c) => (
                  <tr key={c.applicationId} className="hover:bg-slate-800/60 transition">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold text-white">{c.fullName}</div>
                        <div className="text-[11px] text-slate-400">{c.email}</div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          ID: {c.applicationId.substring(0, 8)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-slate-200">{c.targetDomain}</span>
                    </td>
                    <td className="py-4 px-4">{getStatusBadge(c.status)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20" title="Resume Score (15%)">
                          R: {c.scores.resume ?? '-'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="OA Score (25%)">
                          OA: {c.scores.oa ?? '-'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold" title="DSA Score (40%)">
                          DSA: {c.scores.dsa ?? '-'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20" title="HR Score (20%)">
                          HR: {c.scores.hr ?? '-'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {c.compositeScore !== null ? (
                        <div>
                          <span className="text-sm font-extrabold text-white">{c.compositeScore}</span>
                          <span className="text-[10px] text-slate-500"> / 100</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] italic">Incomplete</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewingReportsId(c.applicationId)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition flex items-center gap-1.5 text-xs"
                          title="View Unified Reports"
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Reports</span>
                        </button>
                        <button
                          onClick={() => setOverridingCandidate(c)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition flex items-center gap-1.5 text-xs"
                          title="Override Application Status"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Override</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Pagination Footer */}
        <div className="px-6 py-4 bg-slate-900/60 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {candidates.length} of {data?.total || 0} candidates
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-300 font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Reports Modal */}
      {viewingReportsId && (
        <AdminCandidateReportsModal
          applicationId={viewingReportsId}
          onClose={() => setViewingReportsId(null)}
        />
      )}

      {/* Status Override Modal */}
      {overridingCandidate && (
        <AdminStatusOverrideModal
          candidate={overridingCandidate}
          onClose={() => setOverridingCandidate(null)}
        />
      )}
    </div>
  );
};
