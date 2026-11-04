import React from 'react';
import { PlatformStats } from '../api/adminApi';
import {
  Users,
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  Trophy,
  Clock,
  AlertCircle,
  Layers,
} from 'lucide-react';

interface AdminStatsTabProps {
  stats: PlatformStats;
}

export const AdminStatsTab: React.FC<AdminStatsTabProps> = ({ stats }) => {
  const { overview, outcomes, domainBreakdown } = stats;

  return (
    <div className="space-y-8">
      {/* 1. Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students */}
        <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 backdrop-blur space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Students</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{overview.totalStudents}</div>
          <p className="text-[11px] text-slate-400">Registered student candidate profiles</p>
        </div>

        {/* Active Applications */}
        <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 backdrop-blur space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Applications</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{overview.activeApplications}</div>
          <p className="text-[11px] text-slate-400">
            {overview.totalApplications} total submitted &bull; Active in pipeline
          </p>
        </div>

        {/* OA Completion Rate */}
        <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 backdrop-blur space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">OA Completion Rate</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{overview.oaCompletionRate}%</div>
          <p className="text-[11px] text-slate-400">Submitted vs initiated assessment attempts</p>
        </div>

        {/* Average DSA Score */}
        <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 backdrop-blur space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average DSA Score</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {overview.avgDsaScore !== null ? `${overview.avgDsaScore}/100` : 'N/A'}
          </div>
          <p className="text-[11px] text-slate-400">Primary algorithmic round (40% weight)</p>
        </div>
      </div>

      {/* 2. Secondary Round Averages & Placement Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outcome Breakdown */}
        <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 backdrop-blur space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" /> Candidate Placement Pipeline
            </h3>
            <span className="text-xs text-slate-400">Final Decision Cohort</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <Trophy className="w-3.5 h-3.5" /> Selected
              </div>
              <div className="text-2xl font-bold text-white">{outcomes.selected}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <Clock className="w-3.5 h-3.5" /> Waitlisted
              </div>
              <div className="text-2xl font-bold text-white">{outcomes.waitlisted}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                <AlertCircle className="w-3.5 h-3.5" /> Not Selected
              </div>
              <div className="text-2xl font-bold text-white">{outcomes.notSelected}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-700/60 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> In Progress
              </div>
              <div className="text-2xl font-bold text-white">{outcomes.inProgress}</div>
            </div>
          </div>

          {/* Benchmark Round Scores */}
          <div className="pt-3 border-t border-slate-700/60 grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
              <span className="text-slate-400">Avg HR Behavioral Score</span>
              <span className="font-bold text-white">
                {overview.avgHrScore !== null ? `${overview.avgHrScore}/100` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
              <span className="text-slate-400">Avg Resume ATS Score</span>
              <span className="font-bold text-white">
                {overview.avgResumeScore !== null ? `${overview.avgResumeScore}/100` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Domain Distribution */}
        <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/60 backdrop-blur space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" /> Applications by Domain
            </h3>
            <span className="text-xs text-slate-400">{domainBreakdown.length} Domains Active</span>
          </div>

          <div className="space-y-3">
            {domainBreakdown.map((item) => (
              <div key={item.domain} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{item.domain}</span>
                  <span className="text-slate-400">
                    <span className="text-white font-bold">{item.completedCount}</span> completed / {item.applicationsCount} total
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-900 overflow-hidden flex">
                  <div
                    style={{
                      width: `${item.applicationsCount > 0 ? (item.completedCount / item.applicationsCount) * 100 : 0}%`,
                    }}
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
