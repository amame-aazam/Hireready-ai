import React from 'react';
import { Bot, Volume2, Mic } from 'lucide-react';

interface AIAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  interviewerName?: string;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({
  isSpeaking,
  isListening,
  interviewerName = 'Sophia — Technical Bar Raiser',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-2xl relative overflow-hidden text-center space-y-3">
      {/* Background Ambient Glow */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
          isSpeaking
            ? 'bg-gradient-to-b from-indigo-500/20 via-transparent to-transparent opacity-100'
            : isListening
            ? 'bg-gradient-to-b from-emerald-500/15 via-transparent to-transparent opacity-100'
            : 'opacity-0'
        }`}
      />

      {/* Avatar Container with Animated Rings */}
      <div className="relative">
        {/* Pulsing ring during speech */}
        {isSpeaking && (
          <div className="absolute -inset-2.5 rounded-full border border-indigo-500/40 animate-ping opacity-60" />
        )}
        {isListening && (
          <div className="absolute -inset-2 rounded-full border border-emerald-500/40 animate-pulse opacity-70" />
        )}

        <div
          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-xl ${
            isSpeaking
              ? 'border-indigo-400 bg-indigo-950/80 shadow-indigo-500/20 scale-105'
              : isListening
              ? 'border-emerald-400 bg-emerald-950/80 shadow-emerald-500/20'
              : 'border-slate-700 bg-slate-800 shadow-slate-900/50'
          }`}
        >
          <Bot
            className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
              isSpeaking ? 'text-indigo-300' : isListening ? 'text-emerald-300' : 'text-slate-400'
            }`}
          />
        </div>

        {/* Small Mode Badge */}
        <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-slate-900 border border-slate-700">
          {isSpeaking ? (
            <Volume2 className="w-3.5 h-3.5 text-indigo-400 animate-bounce" />
          ) : isListening ? (
            <Mic className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          ) : (
            <div className="w-3.5 h-3.5 rounded-full bg-slate-600" />
          )}
        </div>
      </div>

      {/* Interviewer Metadata & Dynamic Status */}
      <div className="space-y-1">
        <h3 className="text-sm font-bold text-slate-100">{interviewerName}</h3>
        <p className="text-xs font-mono transition-colors">
          {isSpeaking ? (
            <span className="text-indigo-400 font-semibold flex items-center justify-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
              Speaking response...
            </span>
          ) : isListening ? (
            <span className="text-emerald-400 font-semibold flex items-center justify-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Listening to your thoughts...
            </span>
          ) : (
            <span className="text-slate-500">Ready for your answer</span>
          )}
        </p>
      </div>
    </div>
  );
};
