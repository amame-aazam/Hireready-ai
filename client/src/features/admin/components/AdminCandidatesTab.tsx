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
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#E6F4EA] text-[#1F7A3A] border border-[#B7E1CD]">
            Selected
          </span>
        );
      case 'WAITLISTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FEF3D6] text-[#8C5E00] border border-[#FAD77B]">
            Waitlisted
          </span>
        );
      case 'NOT_SELECTED':
      case 'REJECTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FDE8E8] text-[#9B1C1C] border border-[#F8B4B4]">
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFFAF7] text-[#6B544A] border border-[#F2DDD2]">
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
          <Search className="w-4 h-4 text-[#8C7268] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name, email, or ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#F2DDD2] rounded-full text-xs text-[#0A0706] placeholder-[#8C7268] focus:outline-none focus:border-[#FF7A48] shadow-sm transition"
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
            className="px-3.5 py-2 bg-white border border-[#F2DDD2] rounded-full text-xs text-[#0A0706] focus:outline-none focus:border-[#FF7A48] shadow-sm"
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
            className="px-3.5 py-2 bg-white border border-[#F2DDD2] rounded-full text-xs text-[#0A0706] focus:outline-none focus:border-[#FF7A48] shadow-sm"
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
            className="p-2 text-[#8C7268] hover:text-[#0A0706] rounded-full bg-white border border-[#F2DDD2] hover:bg-[#FBF1EA] transition shadow-sm"
            title="Refresh Candidate Pipeline"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Candidate Table */}
      <div className="rounded-3xl border border-[#F2DDD2] bg-white overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-7 h-7 text-[#FF7A48] animate-spin" />
            <p className="text-xs text-[#6B544A]">Loading candidate pipelines...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-[#FF7A48] mx-auto" />
            <p className="text-sm text-[#0A0706] font-semibold">Error Loading Candidates</p>
            <p className="text-xs text-[#6B544A]">{(error as any)?.message || 'Failed to fetch candidate list'}</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FileText className="w-10 h-10 text-[#8C7268] mx-auto" />
            <h3 className="text-sm font-semibold text-[#0A0706]">No Candidates Found</h3>
            <p className="text-xs text-[#6B544A]">Try adjusting your search query or domain filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFAF7] border-b border-[#F2DDD2] text-[#8C7268] uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-4 px-5">Candidate</th>
                  <th className="py-4 px-5">Target Domain</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5">Multi-Round Scores</th>
                  <th className="py-4 px-5 text-right">Composite</th>
                  <th className="py-4 px-5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2DDD2] text-[#0A0706]">
                {candidates.map((c) => (
                  <tr key={c.applicationId} className="hover:bg-[#FFFAF7] transition">
                    <td className="py-4 px-5">
                      <div>
                        <div className="font-semibold text-[#0A0706]">{c.fullName}</div>
                        <div className="text-[11px] text-[#6B544A]">{c.email}</div>
                        <div className="text-[10px] text-[#8C7268] font-mono mt-0.5">
                          ID: {c.applicationId.substring(0, 8)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-medium text-[#6B544A]">{c.targetDomain}</span>
                    </td>
                    <td className="py-4 px-5">{getStatusBadge(c.status)}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100" title="Resume Score (15%)">
                          R: {c.scores.resume ?? '-'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100" title="OA Score (25%)">
                          OA: {c.scores.oa ?? '-'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FFEBE1] text-[#A83E14] border border-[#FFD0BC] font-bold" title="DSA Score (40%)">
                          DSA: {c.scores.dsa ?? '-'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100" title="HR Score (20%)">
                          HR: {c.scores.hr ?? '-'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      {c.compositeScore !== null ? (
                        <div>
                          <span className="text-sm font-serif font-bold text-[#0A0706]">{c.compositeScore}</span>
                          <span className="text-[10px] text-[#8C7268]"> / 100</span>
                        </div>
                      ) : (
                        <span className="text-[#8C7268] text-[11px] italic">Incomplete</span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewingReportsId(c.applicationId)}
                          className="px-3 py-1.5 rounded-full bg-[#FFFAF7] hover:bg-[#FBF1EA] text-[#0A0706] border border-[#F2DDD2] transition flex items-center gap-1.5 text-xs font-semibold"
                          title="View Unified Reports"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#FF7A48]" />
                          <span>Reports</span>
                        </button>
                        <button
                          onClick={() => setOverridingCandidate(c)}
                          className="px-3 py-1.5 rounded-full bg-[#FFFAF7] hover:bg-[#FBF1EA] text-[#0A0706] border border-[#F2DDD2] transition flex items-center gap-1.5 text-xs font-semibold"
                          title="Override Application Status"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-600" />
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
        <div className="px-6 py-4 bg-[#FFFAF7] border-t border-[#F2DDD2] flex items-center justify-between text-xs text-[#6B544A]">
          <div>
            Showing {candidates.length} of {data?.total || 0} candidates
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-full bg-white border border-[#F2DDD2] hover:bg-[#FBF1EA] disabled:opacity-40 disabled:cursor-not-allowed text-[#0A0706] transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[#0A0706] font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-full bg-white border border-[#F2DDD2] hover:bg-[#FBF1EA] disabled:opacity-40 disabled:cursor-not-allowed text-[#0A0706] transition"
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
export default AdminCandidatesTab;
