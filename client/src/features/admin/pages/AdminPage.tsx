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

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'candidates' | 'assessments' | 'leaderboard'>('stats');

  const { data: stats, isLoading, isError, error, refetch, isFetching } = useQuery<PlatformStats>({
    queryKey: ['adminStats'],
    queryFn: () => adminApi.getPlatformStats(),
    staleTime: 30000,
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* 1. Master Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-800/40 border border-slate-700/60 p-6 rounded-2xl backdrop-blur">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-amber-400" /> Executive Admin Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Recruitment Command Center
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Monitor platform health, candidate pipelines, dual-database evaluation dossiers, and manage assessment templates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700 text-xs text-amber-400 font-mono flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>ROLE: ADMIN</span>
          </span>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-slate-900/60 border border-slate-700 hover:border-slate-600 transition"
            title="Refresh Admin Data"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-700/60 pb-px overflow-x-auto scrollbar-none">
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
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
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
              <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" />
              <p className="text-xs text-slate-400">Aggregating platform metrics across PostgreSQL and MongoDB...</p>
            </div>
          ) : isError || !stats ? (
            <div className="py-16 text-center space-y-2">
              <ShieldAlert className="w-8 h-8 text-rose-400 mx-auto" />
              <p className="text-sm text-slate-300 font-semibold">Error Loading Platform Statistics</p>
              <p className="text-xs text-slate-500">{(error as any)?.message || 'Failed to fetch platform metrics'}</p>
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
