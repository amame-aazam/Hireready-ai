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
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-xs font-semibold transition-colors duration-200 ${
        isDanger
          ? 'bg-[#2E100D] border-red-800 text-red-300 animate-pulse'
          : isWarning
          ? 'bg-[#2D1A10] border-[#F0B87A] text-[#F0B87A]'
          : 'bg-[#140705] border-[#3E1D19] text-[#F0B87A]'
      }`}
    >
      {isDanger ? (
        <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-[#F0B87A]" />
      )}
      <span>{formattedTime}</span>
    </div>
  );
};
