import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminApi, PlatformStats } from '../api/adminApi';
import { AdminStatsTab } from '../components/AdminStatsTab';
import { AdminCandidatesTab } from '../components/AdminCandidatesTab';
import { AdminAssessmentsTab } from '../components/AdminAssessmentsTab';
import { AdminLeaderboardTab } from '../components/AdminLeaderboardTab';
import {
  ShieldAlert,
  BarChart3,
  Users,
  Terminal,
  Award,
  RefreshCw,
} from 'lucide-react';
import { BackButton } from '../../../components/common/BackButton';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'candidates' | 'assessments' | 'leaderboard'>('stats');

  const { data: stats, isLoading, isError, error, refetch, isFetching } = useQuery<PlatformStats>({
    queryKey: ['adminStats'],
    queryFn: () => adminApi.getPlatformStats(),
    staleTime: 30000,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 text-[#F5E8DD]">
      <BackButton />

      {/* 1. Master Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#1A0C09]/80 border border-[#3E1D19] p-6 sm:p-8 rounded-3xl shadow-sm backdrop-blur-md">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[#F0B87A] text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-[#F0B87A]" /> Executive Admin Console
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-normal text-[#F5E8DD] tracking-tight">
            Recruitment Command Center
          </h1>
          <p className="text-sm text-[#A88879] max-w-xl">
            Monitor platform health, candidate pipelines, dual-database evaluation dossiers, and manage assessment templates.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="px-3.5 py-1.5 rounded-full bg-[#2D1A10] border border-[#522E22] text-xs text-[#F0B87A] font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#F0B87A] animate-pulse" />
            <span>ROLE: ADMIN</span>
          </span>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 text-[#856658] hover:text-[#F5E8DD] rounded-full bg-[#140705] border border-[#3E1D19] hover:bg-[#24110E] transition"
            title="Refresh Admin Data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-[#F0B87A]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#3E1D19] pb-px overflow-x-auto scrollbar-none">
        {[
          { id: 'stats', label: 'Platform Statistics', icon: BarChart3 },
          { id: 'candidates', label: 'Candidate Management', icon: Users },
          { id: 'assessments', label: 'Assessment Studio', icon: Terminal },
          { id: 'leaderboard', label: 'Unmasked Leaderboard', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 flex items-center gap-2 text-xs font-semibold border-b-2 transition whitespace-nowrap ${
                isSelected
                  ? 'border-[#F0B87A] text-[#F0B87A]'
                  : 'border-transparent text-[#856658] hover:text-[#F5E8DD]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Content */}
      <div>
        {activeTab === 'stats' && (
          isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-7 h-7 text-[#F0B87A] animate-spin" />
              <p className="text-xs text-[#A88879]">Aggregating platform metrics across PostgreSQL and MongoDB...</p>
            </div>
          ) : isError || !stats ? (
            <div className="py-16 text-center space-y-2 bg-[#1A0C09]/80 rounded-3xl border border-[#3E1D19] p-8">
              <ShieldAlert className="w-8 h-8 text-red-400 mx-auto" />
              <p className="text-sm text-[#F5E8DD] font-semibold">Error Loading Platform Statistics</p>
              <p className="text-xs text-[#A88879]">{(error as any)?.message || 'Failed to fetch platform metrics'}</p>
            </div>
          ) : (
            <AdminStatsTab stats={stats} />
          )
        )}

        {activeTab === 'candidates' && <AdminCandidatesTab />}
        {activeTab === 'assessments' && <AdminAssessmentsTab />}
        {activeTab === 'leaderboard' && <AdminLeaderboardTab />}
      </div>
    </div>
  );
};
export default AdminPage;