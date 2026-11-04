import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchLeaderboard, LeaderboardResponse } from '../api/leaderboardApi';
import {
  Trophy,
  Award,
  Medal,
  ShieldCheck,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { BackButton } from '../../../components/common/BackButton';

const DOMAINS = [
  'All',
  'Fullstack Engineering',
  'Frontend Engineering',
  'Backend Engineering',
  'Data Engineering',
  'DevOps & Cloud',
];

export const LeaderboardPage: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const limit = 20;

  const {
    data: leaderboard,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery<LeaderboardResponse>({
    queryKey: ['leaderboard', selectedDomain, page],
    queryFn: () => fetchLeaderboard(selectedDomain, page, limit),
    staleTime: 30000,
  });

  const rankings = leaderboard?.rankings || [];

  const filteredRankings = rankings.filter((item) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.displayName.toLowerCase().includes(term) ||
      item.candidateId.toLowerCase().includes(term) ||
      item.targetDomain.toLowerCase().includes(term)
    );
  });

  const totalPages = leaderboard ? Math.max(1, Math.ceil(leaderboard.totalCandidates / limit)) : 1;

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </span>
        );
      case 2:
        return (
          <span className="p-1.5 rounded-lg bg-slate-400/20 text-slate-200 border border-slate-400/40 inline-flex items-center justify-center">
            <Medal className="w-4 h-4" />
          </span>
        );
      case 3:
        return (
          <span className="p-1.5 rounded-lg bg-amber-700/20 text-amber-500 border border-amber-700/40 inline-flex items-center justify-center">
            <Medal className="w-4 h-4" />
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
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/50">
            Evaluated
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
      <BackButton />
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl backdrop-blur">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Official Hiring Standings
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Cohort Placement Leaderboard
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Live rankings based on the server-calculated composite formula (Resume 15%, OA 25%, DSA 40%, HR 20%).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-slate-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Zero PII Exposed &bull; Display Names Only</span>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-slate-900/60 border border-slate-700 hover:border-slate-600 transition"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Top 3 Podium Highlights (if at least 1 ranked candidate) */}
      {!isLoading && rankings.length > 0 && page === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rankings.slice(0, 3).map((candidate, idx) => {
            const podiumRank = idx + 1;
            const borderColors = [
              'border-amber-500/40 bg-amber-950/10',
              'border-slate-400/40 bg-slate-800/20',
              'border-amber-700/40 bg-amber-950/10',
            ];
            const medalColors = ['text-amber-400', 'text-slate-300', 'text-amber-600'];

            return (
              <div
                key={candidate.candidateId}
                className={`p-5 rounded-2xl border ${borderColors[idx]} flex flex-col justify-between space-y-3 relative overflow-hidden backdrop-blur`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className={`w-5 h-5 ${medalColors[idx]}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Rank #{podiumRank}
                    </span>
                  </div>
                  {getStatusBadge(candidate.status)}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white">{candidate.displayName}</h3>
                  <p className="text-xs text-slate-400">{candidate.targetDomain}</p>
                </div>

                <div className="pt-2 border-t border-slate-700/40 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-white">{candidate.compositeScore}</span>
                    <span className="text-xs text-slate-400"> / 100</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-indigo-400">
                      Top {Math.max(1, 100 - candidate.percentile)}%
                    </span>
                    <div className="text-[10px] text-slate-500 font-mono">{candidate.candidateId}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. Controls: Domain Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Domain Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => {
                setSelectedDomain(domain);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedDomain === domain
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/60 border border-slate-700/70 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* 4. Ranked Candidates Table */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-800/40 overflow-hidden backdrop-blur">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" />
            <p className="text-xs text-slate-400">Loading verified candidate rankings...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-sm text-slate-300 font-semibold">Error Loading Leaderboard</p>
            <p className="text-xs text-slate-500">{(error as any)?.message || 'Failed to fetch rankings'}</p>
          </div>
        ) : filteredRankings.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Award className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No Candidates Ranked Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Candidates who have not completed all 4 mandatory rounds are marked as INCOMPLETE and excluded from the public leaderboard.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/60 border-b border-slate-700 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 w-16 text-center">Rank</th>
                  <th className="py-3.5 px-4">Candidate</th>
                  <th className="py-3.5 px-4">Domain</th>
                  <th className="py-3.5 px-4">Round Breakdown</th>
                  <th className="py-3.5 px-4 text-right">Composite</th>
                  <th className="py-3.5 px-4 text-center">Percentile</th>
                  <th className="py-3.5 px-4 text-center">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-slate-300">
                {filteredRankings.map((candidate) => (
                  <tr key={candidate.candidateId} className="hover:bg-slate-800/60 transition">
                    <td className="py-4 px-4 text-center">{getRankBadge(candidate.rank)}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {candidate.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{candidate.displayName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{candidate.candidateId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-medium text-slate-300">{candidate.targetDomain}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2 text-[11px]">
                        <span className="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20" title="Resume Score (15%)">
                          R: {candidate.breakdown.resume ?? '-'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" title="OA Score (25%)">
                          OA: {candidate.breakdown.oa ?? '-'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold" title="DSA Score (40%)">
                          DSA: {candidate.breakdown.dsa ?? '-'}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20" title="HR Score (20%)">
                          HR: {candidate.breakdown.hr ?? '-'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm font-extrabold text-white">{candidate.compositeScore}</span>
                      <span className="text-[10px] text-slate-500"> / 100</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        Top {Math.max(1, 100 - candidate.percentile)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">{getStatusBadge(candidate.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination Footer */}
        <div className="px-6 py-4 bg-slate-900/60 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing {filteredRankings.length} of {leaderboard?.totalCandidates || 0} ranked candidates
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
export default LeaderboardPage;
