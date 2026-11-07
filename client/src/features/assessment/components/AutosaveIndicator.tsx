import React from 'react';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface AutosaveIndicatorProps {
  isSaving: boolean;
  lastSavedAt: Date | null;
  saveError: string | null;
}

export const AutosaveIndicator: React.FC<AutosaveIndicatorProps> = ({
  isSaving,
  lastSavedAt,
  saveError,
}) => {
  if (saveError) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-red-400">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Save failed</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-[#F0B87A]">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (lastSavedAt) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-[#A88879]">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>
          Saved at{' '}
          {lastSavedAt.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-[#856658]">
      <span>Ready to save</span>
    </div>
  );
};
