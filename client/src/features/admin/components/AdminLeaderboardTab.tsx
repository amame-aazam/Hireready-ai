import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi, UnmaskedLeaderboardResponse } from '../api/adminApi';
import {
  Trophy,
  Medal,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  Award,
} from 'lucide-react';

const DOMAINS = ['All', 'Fullstack Engineering', 'Frontend Engineering', 'Backend Engineering', 'Data Engineering'];

export const AdminLeaderboardTab: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const limit = 25;

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery<UnmaskedLeaderboardResponse>({
    queryKey: ['adminUnmaskedLeaderboard', selectedDomain, page],
    queryFn: () => adminApi.getUnmaskedLeaderboard(selectedDomain, page, limit),
    staleTime: 30000,
  });

  const rankings = data?.rankings || [];
  const totalPages = data?.totalPages || 1;

  const filteredRankings = rankings.filter((r) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.fullName.toLowerCase().includes(term) ||
      r.email.toLowerCase().includes(term) ||
      r.applicationId.toLowerCase().includes(term) ||
      r.targetDomain.toLowerCase().includes(term)
    );
  });

  const handleExportCSV = () => {
    if (!rankings.length) return;
    const headers = [
      'Rank',
      'Full Name',
      'Email',
      'Domain',
      'Composite Score',
      'Percentile',
      'Resume (15%)',
      'OA (25%)',
      'DSA (40%)',
      'HR (20%)',
      'Status',
      'Application ID',
    ];

    const rows = filteredRankings.map((r) => [
      r.rank,
      `"${r.fullName}"`,
      `"${r.email}"`,
      `"${r.targetDomain}"`,
      r.compositeScore,
      `${r.percentile}%`,
      r.scores.resume ?? '',
      r.scores.oa ?? '',
      r.scores.dsa ?? '',
      r.scores.hr ?? '',
      r.status,
      r.applicationId,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hireready_cohort_leaderboard_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="p-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center justify-center">
            <Trophy className="w-3.5 h-3.5" />
          </span>
        );
      case 2:
        return (
          <span className="p-1 rounded-lg bg-slate-400/20 text-slate-200 border border-slate-400/40 inline-flex items-center justify-center">
            <Medal className="w-3.5 h-3.5" />
          </span>
        );
      case 3:
        return (
          <span className="p-1 rounded-lg bg-amber-700/20 text-amber-500 border border-amber-700/40 inline-flex items-center justify-center">
            <Medal className="w-3.5 h-3.5" />
          </span>
        );
      default:
        return <span className="text-slate-400 font-mono font-semibold text-xs">#{rank}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SELECTED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Selected
          </span>
        );
      case 'WAITLISTED':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
            Waitlisted
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/50">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header & Actions */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700/70 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Domain filter & CSV export */}
        <div className="flex items-center gap-3">
          <select
            value={selectedDomain}
            onChange={(e) => {
              setSelectedDomain(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-800/60 border border-slate-700/70 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Domains' : d}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportCSV}
            disabled={filteredRankings.length === 0}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 disabled:opacity-40 text-xs text-white border border-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 transition"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Unmasked Leaderboard Table */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 overflow-hidden backdrop-blur">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" />
            <p className="text-xs text-slate-400">Loading unmasked cohort standings...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-sm text-slate-300 font-semibold">Error Loading Leaderboard</p>
            <p className="text-xs text-slate-500">{(error as any)?.message || 'Failed to fetch unmasked leaderboard'}</p>
          </div>
        ) : filteredRankings.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Award className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No Candidates Ranked</h3>
            <p className="text-xs text-slate-500">Only candidates with completed 4-round evaluations are ranked.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 w-14 text-center">Rank</th>
                  <th className="py-3.5 px-4">Candidate Identity (Unmasked)</th>
                  <th className="py-3.5 px-4">Domain</th>
                  <th className="py-3.5 px-4">Breakdown (15/25/40/20)</th>
                  <th className="py-3.5 px-4 text-right">Composite Score</th>
                  <th className="py-3.5 px-4 text-center">Percentile</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-slate-300">
                {filteredRankings.map((r) => (
                  <tr key={r.applicationId} className="hover:bg-slate-800/60 transition">
                    <td className="py-4 px-4 text-center">{getRankBadge(r.rank)}</td>
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-semibold text-white">{r.fullName}</div>
                        <div className="text-[11px] text-indigo-400 font-mono">{r.email}</div>
                        <div className="text-[10px] text-slate-500 font-mono">App: {r.applicationId.substring(0, 8)}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-slate-300">{r.targetDomain}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          R: {r.scores.resume ?? '-'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          OA: {r.scores.oa ?? '-'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
                          DSA: {r.scores.dsa ?? '-'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          HR: {r.scores.hr ?? '-'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-extrabold text-white">{r.compositeScore}</span>
                      <span className="text-[10px] text-slate-500"> / 100</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        Top {Math.max(1, 100 - r.percentile)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">{getStatusBadge(r.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. Pagination Footer */}
        <div className="px-6 py-4 bg-slate-900/60 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {filteredRankings.length} of {data?.totalCandidates || 0} ranked candidates
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
    </div>
  );
};
