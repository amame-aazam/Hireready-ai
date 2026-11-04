import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, CandidateItem, AuditLogItem } from '../api/adminApi';
import {
  X,
  ShieldAlert,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface AdminStatusOverrideModalProps {
  candidate: CandidateItem;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { value: 'SELECTED', label: 'SELECTED — Extend Job Offer', color: 'text-emerald-400' },
  { value: 'WAITLISTED', label: 'WAITLISTED — Cohort Reserve Pool', color: 'text-amber-400' },
  { value: 'NOT_SELECTED', label: 'NOT_SELECTED — Candidate Pool Reviewed', color: 'text-rose-400' },
  { value: 'REJECTED', label: 'REJECTED — Application Closed', color: 'text-rose-500' },
  { value: 'INTERVIEW_PENDING', label: 'INTERVIEW_PENDING — Fast-Track Technical Round', color: 'text-indigo-400' },
  { value: 'OA_PASSED', label: 'OA_PASSED — Advance Past OA', color: 'text-blue-400' },
  { value: 'COMPLETED', label: 'COMPLETED — Awaiting Selection Review', color: 'text-slate-300' },
];

export const AdminStatusOverrideModal: React.FC<AdminStatusOverrideModalProps> = ({
  candidate,
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>(candidate.status);
  const [reason, setReason] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch chronological audit history
  const { data: auditLogs, refetch: refetchAuditLogs } = useQuery<AuditLogItem[]>({
    queryKey: ['candidateAuditLogs', candidate.applicationId],
    queryFn: () => adminApi.getCandidateAuditLogs(candidate.applicationId),
  });

  const overrideMutation = useMutation({
    mutationFn: () => adminApi.overrideCandidateStatus(candidate.applicationId, selectedStatus, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCandidates'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      refetchAuditLogs();
      onClose();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.error?.message || err.message || 'Failed to override candidate status');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!reason.trim()) {
      setFormError('An audit justification is mandatory for compliance recording.');
      return;
    }

    if (selectedStatus === candidate.status) {
      setFormError('The chosen status matches the current status. Please select a different status.');
      return;
    }

    overrideMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Manual Status Override & Audit Trail</h2>
              <p className="text-xs text-slate-400">
                Candidate: <span className="text-slate-200 font-semibold">{candidate.fullName}</span> ({candidate.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Current vs Target Status */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Select Target Status
            </label>
            <div className="text-xs text-slate-400 mb-1">
              Current Status: <span className="font-semibold text-white">{candidate.status}</span>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Audit Reason Textarea */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Compliance Justification / Audit Reason <span className="text-rose-400">*</span>
            </label>
            <p className="text-[11px] text-slate-400">
              Provide an official rationale for why this candidate is being manually reassigned.
            </p>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Cleared executive hiring review; algorithmic and behavioral scores met exceptional threshold."
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Chronological Audit Trail History */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-4 h-4 text-indigo-400" />
              <span>Audit Log History ({auditLogs?.length || 0})</span>
            </h4>

            {auditLogs && auditLogs.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>
                        <span className="text-white font-medium">{log.admin.firstName} {log.admin.lastName}</span> ({log.admin.email})
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-rose-400">{log.previousVal || 'NONE'}</span>
                      <span className="text-slate-500">&rarr;</span>
                      <span className="text-emerald-400 font-semibold">{log.newVal}</span>
                    </div>
                    <p className="text-slate-300 text-[11px] italic leading-relaxed">
                      &ldquo;{log.reason}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No previous manual overrides recorded for this candidate.</p>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={overrideMutation.isPending}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={overrideMutation.isPending}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
            >
              {overrideMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Recording Override...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Commit Status Override</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
