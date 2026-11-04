import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, AssessmentItem } from '../api/adminApi';
import { AdminCreateAssessmentModal } from './AdminCreateAssessmentModal';
import {
  Terminal,
  Plus,
  Clock,
  Award,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const AdminAssessmentsTab: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: assessments, isLoading, isError, error, refetch, isFetching } = useQuery<AssessmentItem[]>({
    queryKey: ['adminAssessments'],
    queryFn: () => adminApi.getAssessments(),
    staleTime: 30000,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.toggleAssessmentStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAssessments'] });
    },
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" /> OA Assessment Templates
          </h3>
          <p className="text-xs text-slate-400">
            Configure coding tests, time budgets, and passing score thresholds for candidate screening.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 transition"
            title="Refresh Assessments"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Template</span>
          </button>
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-7 h-7 text-indigo-400 animate-spin" />
          <p className="text-xs text-slate-400">Loading assessment templates...</p>
        </div>
      ) : isError ? (
        <div className="py-16 text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
          <p className="text-sm text-slate-300 font-semibold">Error Loading Assessments</p>
          <p className="text-xs text-slate-500">{(error as any)?.message || 'Failed to fetch assessments'}</p>
        </div>
      ) : !assessments || assessments.length === 0 ? (
        <div className="py-16 text-center space-y-3 rounded-2xl border border-slate-700/60 bg-slate-800/40">
          <HelpCircle className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-300">No Assessment Templates Configured</h3>
          <p className="text-xs text-slate-500">Create your first OA template to begin evaluating candidates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assessments.map((a) => (
            <div
              key={a.id}
              className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition backdrop-blur"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                    {a.domain}
                  </span>
                  <button
                    onClick={() => toggleMutation.mutate({ id: a.id, isActive: !a.isActive })}
                    disabled={toggleMutation.isPending}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border transition ${
                      a.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-slate-700 text-slate-400 border-slate-600 hover:bg-slate-600'
                    }`}
                  >
                    {a.isActive ? 'Active' : 'Archived'}
                  </button>
                </div>

                <div>
                  <h4 className="font-bold text-white text-base">{a.title}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {a.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-700/60">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Duration: <strong className="text-white">{a.durationMinutes}m</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Award className="w-3.5 h-3.5 text-slate-500" />
                    <span>Passing Bar: <strong className="text-white">{a.passingScore}%</strong></span>
                  </div>
                </div>
              </div>

              {/* Stats Footer */}
              <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <div>
                  Attempts: <span className="text-white font-bold">{a.totalAttempts}</span>
                </div>
                <div>
                  Pass Rate: <span className="text-emerald-400 font-bold">{a.passRate}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      {isCreateOpen && <AdminCreateAssessmentModal onClose={() => setIsCreateOpen(false)} />}
    </div>
  );
};
