import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownTimerProps {
  formattedTime: string;
  isWarning: boolean;
  isDanger: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  formattedTime,
  isWarning,
  isDanger,
}) => {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-semibold transition-colors duration-200 ${
        isDanger
          ? 'bg-rose-500/15 border-rose-500/40 text-rose-300 animate-pulse'
          : isWarning
          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
          : 'bg-slate-800/80 border-slate-700 text-slate-200'
      }`}
    >
      {isDanger ? (
        <AlertTriangle className="w-4 h-4 text-rose-400 animate-bounce" />
      ) : (
        <Clock className={`w-4 h-4 ${isWarning ? 'text-amber-400' : 'text-slate-400'}`} />
      )}
      <span>{formattedTime}</span>
    </div>
  );
};
