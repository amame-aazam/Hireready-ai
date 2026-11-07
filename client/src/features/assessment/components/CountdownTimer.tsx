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
          ? 'bg-[#FDE8E8] border-[#F8B4B4] text-[#9B1C1C] animate-pulse'
          : isWarning
          ? 'bg-[#FEF3D6] border-[#FAD77B] text-[#8C5E00]'
          : 'bg-[#FFFAF7] border-[#F2DDD2] text-[#0A0706]'
      }`}
    >
      {isDanger ? (
        <AlertTriangle className="w-3.5 h-3.5 text-[#9B1C1C] animate-bounce" />
      ) : (
        <Clock className={`w-3.5 h-3.5 ${isWarning ? 'text-[#8C5E00]' : 'text-[#8C7268]'}`} />
      )}
      <span>{formattedTime}</span>
    </div>
  );
};
