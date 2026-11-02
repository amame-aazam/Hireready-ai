import React, { useEffect, useRef } from 'react';
import { InterviewTurn } from '../api/interviewApi';
import { Bot, User, Volume2, Code } from 'lucide-react';

interface TranscriptFeedProps {
  turns: InterviewTurn[];
  onReplaySpeech?: (text: string) => void;
  isAiSpeaking?: boolean;
}

export const TranscriptFeed: React.FC<TranscriptFeedProps> = ({
  turns,
  onReplaySpeech,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  return (
    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40 rounded-xl border border-slate-800/80 min-h-[300px]">
      {turns.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 text-xs py-10 space-y-2">
          <Bot className="w-8 h-8 text-slate-600" />
          <p>Interview session initializing... AI will present your challenge shortly.</p>
        </div>
      ) : (
        turns.map((turn, index) => {
          const isAi = turn.role === 'ai';

          return (
            <div
              key={index}
              className={`flex items-start gap-2.5 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 text-xs leading-relaxed transition-all ${
                  isAi
                    ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm shadow-sm'
                    : 'bg-indigo-600/20 border border-indigo-500/30 text-indigo-100 rounded-tr-sm shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between gap-4 pb-1">
                  <span
                    className={`font-semibold text-[11px] ${
                      isAi ? 'text-indigo-400' : 'text-slate-300'
                    }`}
                  >
                    {isAi ? 'Interviewer' : 'You'}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span>
                      {new Date(turn.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isAi && onReplaySpeech && (
                      <button
                        type="button"
                        onClick={() => onReplaySpeech(turn.content)}
                        className="p-1 hover:text-indigo-400 transition"
                        title="Replay audio"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="font-sans whitespace-pre-wrap">{turn.content}</div>

                {turn.codeSnippet && (
                  <div className="mt-2 p-2 rounded bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-300">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 pb-1">
                      <Code className="w-3 h-3 text-amber-400" />
                      <span>Code snapshot</span>
                    </div>
                    <pre className="overflow-x-auto max-h-32 text-slate-400">
                      {turn.codeSnippet}
                    </pre>
                  </div>
                )}
              </div>

              {!isAi && (
                <div className="w-7 h-7 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4 text-emerald-400" />
                </div>
              )}
            </div>
          );
        })
      )}
      <div ref={bottomRef} />
    </div>
  );
};
