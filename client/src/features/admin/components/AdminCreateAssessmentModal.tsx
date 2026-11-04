import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { X, Plus, AlertCircle, Loader2 } from 'lucide-react';

interface AdminCreateAssessmentModalProps {
  onClose: () => void;
}

export const AdminCreateAssessmentModal: React.FC<AdminCreateAssessmentModalProps> = ({
  onClose,
}) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [passingScore, setPassingScore] = useState(70);
  const [isActive, setIsActive] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () =>
      adminApi.createAssessment({
        title,
        description,
        durationMinutes,
        passingScore,
        isActive,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminAssessments'] });
      onClose();
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.error?.message || err.message || 'Failed to create assessment template');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!title.trim() || !description.trim()) {
      setErrorMsg('Assessment title and description are required.');
      return;
    }

    createMutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Create New OA Template</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Template Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Backend Systems Assessment"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
              Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Describe the topics, level, and format covered in this assessment..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Duration (Minutes)
              </label>
              <input
                type="number"
                min={15}
                max={180}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Passing Score (%)
              </label>
              <input
                type="number"
                min={40}
                max={100}
                value={passingScore}
                onChange={(e) => setPassingScore(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="isActive" className="text-xs text-slate-300">
              Active immediately in the candidate assessment pool
            </label>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating Template...</span>
                </>
              ) : (
                <span>Publish Template</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
