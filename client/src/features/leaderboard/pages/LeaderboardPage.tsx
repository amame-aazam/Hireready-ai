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
          <span className="p-1.5 rounded-xl bg-[#FEF3D6] text-[#8C5E00] border border-[#FAD77B] inline-flex items-center justify-center shadow-sm">
            <Trophy className="w-4 h-4" />
          </span>
        );
      case 2:
        return (
          <span className="p-1.5 rounded-xl bg-[#F0F2F5] text-[#4A5568] border border-[#CBD5E1] inline-flex items-center justify-center shadow-sm">
            <Medal className="w-4 h-4" />
          </span>
        );
      case 3:
        return (
          <span className="p-1.5 rounded-xl bg-[#FFEBE1] text-[#A83E14] border border-[#FFD0BC] inline-flex items-center justify-center shadow-sm">
            <Medal className="w-4 h-4" />
          </span>
        );
      default:
        return <span className="text-[#8C7268] font-mono font-semibold text-xs">#{rank}</span>;
    }
  };

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
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFFAF7] text-[#6B544A] border border-[#F2DDD2]">
            Evaluated
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <BackButton />

      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-[#F2DDD2] p-6 sm:p-8 rounded-3xl shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#A83E14] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#FF7A48]" /> Official Hiring Standings
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-normal text-[#0A0706] tracking-tight">
            Cohort Placement Leaderboard
          </h1>
          <p className="text-sm text-[#6B544A] max-w-xl">
            Live rankings based on the server-calculated composite formula (Resume 15%, OA 25%, DSA 40%, HR 20%).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-full bg-[#FFFAF7] border border-[#F2DDD2] text-xs text-[#6B544A] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1F7A3A]" />
            <span>Zero PII Exposed &bull; Anonymized IDs</span>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 text-[#8C7268] hover:text-[#0A0706] rounded-full bg-[#FFFAF7] border border-[#F2DDD2] hover:bg-[#FBF1EA] transition"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Top 3 Podium Highlights */}
      {!isLoading && rankings.length > 0 && page === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rankings.slice(0, 3).map((candidate, idx) => {
            const podiumRank = idx + 1;
            const borderColors = [
              'border-[#FAD77B] bg-gradient-to-br from-[#FEF3D6]/40 to-white',
              'border-[#CBD5E1] bg-gradient-to-br from-[#F0F2F5]/40 to-white',
              'border-[#FFD0BC] bg-gradient-to-br from-[#FFEBE1]/40 to-white',
            ];
            const medalColors = ['text-[#8C5E00]', 'text-[#4A5568]', 'text-[#A83E14]'];

            return (
              <div
                key={candidate.candidateId}
                className={`p-6 rounded-3xl border ${borderColors[idx]} flex flex-col justify-between space-y-4 shadow-sm`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className={`w-5 h-5 ${medalColors[idx]}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-[#0A0706]">
                      Rank #{podiumRank}
                    </span>
                  </div>
                  {getStatusBadge(candidate.status)}
                </div>

                <div>
                  <h3 className="text-lg font-serif font-medium text-[#0A0706]">{candidate.displayName}</h3>
                  <p className="text-xs text-[#6B544A]">{candidate.targetDomain}</p>
                </div>

                <div className="pt-3 border-t border-[#F2DDD2] flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-serif font-bold text-[#0A0706]">
                      {candidate.compositeScore}
                    </span>
                    <span className="text-xs text-[#8C7268]"> / 100</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-[#A83E14]">
                      Top {Math.max(1, 100 - candidate.percentile)}%
                    </span>
                    <div className="text-[10px] text-[#8C7268] font-mono">{candidate.candidateId}</div>
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
                  ? 'bg-[#0A0706] text-white shadow-sm'
                  : 'bg-white text-[#6B544A] hover:bg-[#FBF1EA] hover:text-[#0A0706] border border-[#F2DDD2]'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#8C7268] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidate name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-[#F2DDD2] rounded-full text-xs text-[#0A0706] placeholder-[#8C7268] focus:outline-none focus:border-[#FF7A48] shadow-sm transition"
          />
        </div>
      </div>

      {/* 4. Ranked Candidates Table */}
      <div className="rounded-3xl border border-[#F2DDD2] bg-white overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-7 h-7 text-[#FF7A48] animate-spin" />
            <p className="text-xs text-[#6B544A]">Loading verified candidate rankings...</p>
          </div>
        ) : isError ? (
          <div className="py-16 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-[#FF7A48] mx-auto" />
            <p className="text-sm text-[#0A0706] font-semibold">Error Loading Leaderboard</p>
            <p className="text-xs text-[#6B544A]">{(error as any)?.message || 'Failed to fetch rankings'}</p>
          </div>
        ) : filteredRankings.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <Award className="w-10 h-10 text-[#8C7268] mx-auto" />
            <h3 className="text-sm font-semibold text-[#0A0706]">No Candidates Ranked Yet</h3>
            <p className="text-xs text-[#6B544A] max-w-sm mx-auto">
              Candidates who have not completed all mandatory rounds are marked as INCOMPLETE and excluded from the public leaderboard.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FFFAF7] border-b border-[#F2DDD2] text-[#8C7268] uppercase tracking-wider font-semibold text-[11px]">
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
              <tbody className="divide-y divide-[#F2DDD2] text-[#0A0706]">
                {filteredRankings.map((candidate) => (
                  <tr key={candidate.candidateId} className="hover:bg-[#FFFAF7] transition">
                    <td className="py-4 px-5 text-center">{getRankBadge(candidate.rank)}</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FFEBE1] border border-[#FFD0BC] text-[#A83E14] font-bold text-xs flex items-center justify-center shrink-0">
                          {candidate.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-[#0A0706]">{candidate.displayName}</div>
                          <div className="text-[10px] text-[#8C7268] font-mono">{candidate.candidateId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="font-medium text-[#6B544A]">{candidate.targetDomain}</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100" title="Resume Score (15%)">
                          R: {candidate.breakdown.resume ?? '-'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100" title="OA Score (25%)">
                          OA: {candidate.breakdown.oa ?? '-'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#FFEBE1] text-[#A83E14] border border-[#FFD0BC] font-bold" title="DSA Score (40%)">
                          DSA: {candidate.breakdown.dsa ?? '-'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100" title="HR Score (20%)">
                          HR: {candidate.breakdown.hr ?? '-'}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className="text-sm font-serif font-bold text-[#0A0706]">{candidate.compositeScore}</span>
                      <span className="text-[10px] text-[#8C7268]"> / 100</span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFEBE1] text-[#A83E14] border border-[#FFD0BC]">
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
        <div className="px-6 py-4 bg-[#FFFAF7] border-t border-[#F2DDD2] flex items-center justify-between text-xs text-[#6B544A]">
          <div>
            Showing {filteredRankings.length} of {leaderboard?.totalCandidates || 0} ranked candidates
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
    </div>
  );
};
export default LeaderboardPage;
