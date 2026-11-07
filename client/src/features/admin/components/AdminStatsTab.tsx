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
        <div className="p-6 rounded-3xl bg-white border border-[#F2DDD2] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7268] uppercase tracking-wider">Total Students</span>
            <div className="p-2.5 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-[#0A0706]">{overview.totalStudents}</div>
          <p className="text-[11px] text-[#6B544A]">Registered student candidate profiles</p>
        </div>

        {/* Active Applications */}
        <div className="p-6 rounded-3xl bg-white border border-[#F2DDD2] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7268] uppercase tracking-wider">Active Applications</span>
            <div className="p-2.5 rounded-2xl bg-[#FFEBE1] text-[#FF7A48] border border-[#FFD0BC]">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-[#0A0706]">{overview.activeApplications}</div>
          <p className="text-[11px] text-[#6B544A]">
            {overview.totalApplications} total submitted &bull; Active in pipeline
          </p>
        </div>

        {/* OA Completion Rate */}
        <div className="p-6 rounded-3xl bg-white border border-[#F2DDD2] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7268] uppercase tracking-wider">OA Completion Rate</span>
            <div className="p-2.5 rounded-2xl bg-[#E6F4EA] text-[#1F7A3A] border border-[#B7E1CD]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-[#1F7A3A]">{overview.oaCompletionRate}%</div>
          <p className="text-[11px] text-[#6B544A]">Submitted vs initiated assessment attempts</p>
        </div>

        {/* Average DSA Score */}
        <div className="p-6 rounded-3xl bg-white border border-[#F2DDD2] shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#8C7268] uppercase tracking-wider">Average DSA Score</span>
            <div className="p-2.5 rounded-2xl bg-[#FEF3D6] text-[#8C5E00] border border-[#FAD77B]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-serif font-bold text-[#0A0706]">
            {overview.avgDsaScore !== null ? `${overview.avgDsaScore}/100` : 'N/A'}
          </div>
          <p className="text-[11px] text-[#6B544A]">Primary algorithmic round (40% weight)</p>
        </div>
      </div>

      {/* 2. Secondary Round Averages & Placement Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outcome Breakdown */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F2DDD2] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-medium text-[#0A0706] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#FF7A48]" /> Candidate Placement Pipeline
            </h3>
            <span className="text-xs text-[#8C7268]">Final Decision Cohort</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-[#E6F4EA]/40 border border-[#B7E1CD] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F7A3A]">
                <Trophy className="w-3.5 h-3.5" /> Selected
              </div>
              <div className="text-2xl font-serif font-bold text-[#0A0706]">{outcomes.selected}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FEF3D6]/40 border border-[#FAD77B] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#8C5E00]">
                <Clock className="w-3.5 h-3.5" /> Waitlisted
              </div>
              <div className="text-2xl font-serif font-bold text-[#0A0706]">{outcomes.waitlisted}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FDE8E8]/40 border border-[#F8B4B4] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#9B1C1C]">
                <AlertCircle className="w-3.5 h-3.5" /> Not Selected
              </div>
              <div className="text-2xl font-serif font-bold text-[#0A0706]">{outcomes.notSelected}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6B544A]">
                <Sparkles className="w-3.5 h-3.5 text-[#FF7A48]" /> In Progress
              </div>
              <div className="text-2xl font-serif font-bold text-[#0A0706]">{outcomes.inProgress}</div>
            </div>
          </div>

          {/* Benchmark Round Scores */}
          <div className="pt-3 border-t border-[#F2DDD2] grid grid-cols-2 gap-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2]">
              <span className="text-[#6B544A]">Avg HR Behavioral Score</span>
              <span className="font-bold text-[#0A0706]">
                {overview.avgHrScore !== null ? `${overview.avgHrScore}/100` : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFFAF7] border border-[#F2DDD2]">
              <span className="text-[#6B544A]">Avg Resume ATS Score</span>
              <span className="font-bold text-[#0A0706]">
                {overview.avgResumeScore !== null ? `${overview.avgResumeScore}/100` : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Domain Distribution */}
        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-[#F2DDD2] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-serif font-medium text-[#0A0706] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FF7A48]" /> Applications by Domain
            </h3>
            <span className="text-xs text-[#8C7268]">{domainBreakdown.length} Domains Active</span>
          </div>

          <div className="space-y-3">
            {domainBreakdown.map((item) => (
              <div key={item.domain} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#0A0706]">{item.domain}</span>
                  <span className="text-[#6B544A]">
                    <span className="text-[#0A0706] font-bold">{item.completedCount}</span> completed / {item.applicationsCount} total
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#FFFAF7] border border-[#F2DDD2] overflow-hidden flex">
                  <div
                    style={{
                      width: `${item.applicationsCount > 0 ? (item.completedCount / item.applicationsCount) * 100 : 0}%`,
                    }}
                    className="h-full bg-[#FF7A48] rounded-full"
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
export default AdminStatsTab;
