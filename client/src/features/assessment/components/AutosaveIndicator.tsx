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
      <div className="flex items-center gap-1.5 text-xs text-[#9B1C1C]">
        <AlertCircle className="w-3.5 h-3.5" />
        <span>Save failed</span>
      </div>
    );
  }

  if (isSaving) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-[#FF7A48]">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (lastSavedAt) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-[#6B544A]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#1F7A3A]" />
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
    <div className="flex items-center gap-1.5 text-xs text-[#8C7268]">
      <span>Ready to save</span>
    </div>
  );
};
