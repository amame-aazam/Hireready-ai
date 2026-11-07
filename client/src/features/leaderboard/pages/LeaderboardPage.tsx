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
          <span className="p-1.5 rounded-xl bg-[#2D1A10] text-[#F0B87A] border border-[#522E22] inline-flex items-center justify-center shadow-[0_0_15px_rgba(240,184,122,0.3)]">
            <Trophy className="w-4 h-4 text-[#F0B87A]" />
          </span>
        );
      case 2:
        return (
          <span className="p-1.5 rounded-xl bg-[#1E1A18] text-[#D4B8A8] border border-[#3E1D19] inline-flex items-center justify-center">
            <Medal className="w-4 h-4 text-gray-300" />
          </span>
        );
      case 3:
        return (
          <span className="p-1.5 rounded-xl bg-[#2A1510] text-[#E2A664] border border-[#52251D] inline-flex items-center justify-center">
            <Medal className="w-4 h-4 text-[#E2A664]" />
          </span>
        );
      default:
        return <span className="text-[#856658] font-mono font-semibold text-xs">#{rank}</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SELECTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#152B1E] text-emerald-300 border border-[#255436]">
            Selected
          </span>
        );
      case 'WAITLISTED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#2D1A10] text-[#F0B87A] border border-[#522E22]">
            Waitlisted
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#140705] text-[#A88879] border border-[#3E1D19]">
            Evaluated
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-[#F5E8DD]">
      <BackButton />

      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#1A0C09]/80 border border-[#3E1D19] p-6 sm:p-8 rounded-3xl shadow-sm backdrop-blur-md">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#F0B87A] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#F0B87A]" /> Official Hiring Standings
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-normal text-[#F5E8DD] tracking-tight">
            Cohort Placement Leaderboard
          </h1>
          <p className="text-sm text-[#A88879] max-w-xl">
            Live rankings based on the server-calculated composite formula (Resume 15%, OA 25%, DSA 40%, HR 20%).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-full bg-[#140705] border border-[#3E1D19] text-xs text-[#A88879] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#F0B87A]" />
            <span>Zero PII Exposed &bull; Anonymized IDs</span>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 text-[#856658] hover:text-[#F5E8DD] rounded-full bg-[#140705] border border-[#3E1D19] hover:bg-[#24110E] transition"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-[#F0B87A]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Top 3 Podium Highlights */}
      {!isLoading && rankings.length > 0 && page === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rankings.slice(0, 3).map((candidate, idx) => {
            const podiumRank = idx + 1;
            const borderColors = [
              'border-[#F0B87A] bg-[#2D1A10]/70 shadow-[0_0_30px_rgba(240,184,122,0.15)]',
              'border-[#3E1D19] bg-[#1A0C09]/80',
              'border-[#52251D] bg-[#24110E]/70',
            ];

            return (
              <div
                key={candidate.candidateId}
                className={`p-6 rounded-3xl border ${borderColors[idx]} flex flex-col justify-between space-y-4 shadow-sm backdrop-blur-md`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-[#F0B87A]" />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#F0B87A]">
                      Rank #{podiumRank}
                    </span>
                  </div>
                  {getStatusBadge(candidate.status)}
                </div>

                <div>
                  <h3 className="text-lg font-serif font-medium text-[#F5E8DD]">{candidate.displayName}</h3>
                  <p className="text-xs text-[#A88879]">{candidate.targetDomain}</p>
                </div>

                <div className="pt-3 border-t border-[#3E1D19] flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-serif font-bold text-[#F5E8DD]">
                      {candidate.compositeScore}
                    </span>
                    <span className="text-xs text-[#856658]"> / 100</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#F0B87A]">
                      Top {Math.max(1, 100 - candidate.percentile)}%
                    </span>
                    <div className="text-[10px] text-[#856658] font-mono">{candidate.candidateId}</div>
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedDomain === domain
                  ? 'bg-gradient-to-r from-[#F0B87A] to-[#E2A664] text-[#140808] font-bold shadow-sm'
                  : 'bg-[#140705] text-[#A88879] hover:bg-[#24110E] hover:text-[#F5E8DD] border border-[#3E1D19]'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#856658] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#140705] border border-[#3E1D19] rounded-full text-xs text-[#F5E8DD] placeholder-[#856658] focus:outline-none focus:border-[#F0B87A] shadow-sm transition"
          />
        </div>
      </div>

      {/* 4. Ranked Candidates Table */}
      <div className="rounded-3xl border border-[#3E1D19] bg-[#1A0C09]/80 overflow-hidden shadow-sm backdrop-blur-md">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-7 h-7 text-[#F0B87A] animate-spin" />
            <p className="text-xs text-[#A88879]">Loading verified candidate rankings...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="text-sm text-[#F5E8DD] font-semibold">Error Loading Leaderboard</p>
            <p className="text-xs text-[#A88879]">{(error as any)?.message || 'Failed to fetch rankings'}</p>
          </div>
        ) : filteredRankings.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Award className="w-10 h-10 text-[#856658] mx-auto" />
            <h3 className="text-sm font-semibold text-[#F5E8DD]">No Candidates Ranked Yet</h3>
            <p className="text-xs text-[#A88879] max-w-sm mx-auto">
              Candidates who have not completed all mandatory rounds are marked as INCOMPLETE and excluded from the public leaderboard.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#140705] border-b border-[#3E1D19] text-[#856658] uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-4 px-5 w-16 text-center">Rank</th>
                  <th className="py-4 px-5">Candidate</th>
                  <th className="py-4 px-5">Domain</th>
                  <th className="py-4 px-5">Round Breakdown</th>
                  <th className="py-4 px-5 text-right">Composite</th>
                  <th className="py-4 px-5 text-center">Percentile</th>
                  <th className="py-4 px-5 text-center">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3E1D19] text-[#F5E8DD]">
                {filteredRankings.map((candidate) => (
                  <tr key={candidate.candidateId} className="hover:bg-[#24110E] transition">
                    <td className="py-4 px-5 text-center">{getRankBadge(candidate.rank)}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2D1A10] border border-[#522E22] text-[#F0B87A] font-bold text-xs flex items-center justify-center shrink-0">
                          {candidate.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-[#F5E8DD]">{candidate.displayName}</div>
                          <div className="text-[10px] text-[#856658] font-mono">{candidate.candidateId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-medium text-[#A88879]">{candidate.targetDomain}</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="px-2 py-0.5 rounded-full bg-[#140705] text-[#D4B8A8] border border-[#3E1D19]" title="Resume Score (15%)">
                          R: {candidate.breakdown.resume ?? '-'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#140705] text-[#D4B8A8] border border-[#3E1D19]" title="OA Score (25%)">
                          OA: {candidate.breakdown.oa ?? '-'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#2D1A10] text-[#F0B87A] border border-[#522E22] font-bold" title="DSA Score (40%)">
                          DSA: {candidate.breakdown.dsa ?? '-'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#140705] text-[#D4B8A8] border border-[#3E1D19]" title="HR Score (20%)">
                          HR: {candidate.breakdown.hr ?? '-'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className="text-sm font-serif font-bold text-[#F5E8DD]">{candidate.compositeScore}</span>
                      <span className="text-[10px] text-[#856658]"> / 100</span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#2D1A10] text-[#F0B87A] border border-[#522E22]">
                        Top {Math.max(1, 100 - candidate.percentile)}%
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">{getStatusBadge(candidate.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. Pagination Footer */}
        <div className="px-6 py-4 bg-[#140705] border-t border-[#3E1D19] flex items-center justify-between text-xs text-[#A88879]">
          <div>
            Showing {filteredRankings.length} of {leaderboard?.totalCandidates || 0} ranked candidates
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="p-1.5 rounded-full bg-[#1A0C09] border border-[#3E1D19] hover:bg-[#24110E] disabled:opacity-40 disabled:cursor-not-allowed text-[#F5E8DD] transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[#F5E8DD] font-medium">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page >= totalPages}
              className="p-1.5 rounded-full bg-[#1A0C09] border border-[#3E1D19] hover:bg-[#24110E] disabled:opacity-40 disabled:cursor-not-allowed text-[#F5E8DD] transition"
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