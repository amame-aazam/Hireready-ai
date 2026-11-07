import React, { useEffect, useRef } from 'react';
import { InterviewTurn } from '../api/interviewApi';
import { Bot, User, Volume2, Code } from 'lucide-react';

interface TranscriptFeedProps {
  turns: InterviewTurn[];
  onReplaySpeech?: (text: string) => void;
  isAiSpeaking?: boolean;
  aiName?: string;
}

export const TranscriptFeed: React.FC<TranscriptFeedProps> = ({
  turns,
  onReplaySpeech,
  aiName = 'Interviewer',
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns]);

  return (
    <div className="h-full flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#140705] rounded-2xl border border-[#3E1D19] min-h-0 text-[#F5E8DD]">
      {turns.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-[#856658] text-xs py-6 space-y-1.5">
          <Bot className="w-6 h-6 text-[#F0B87A]" />
          <p className="text-[11px]">{aiName} will introduce your challenge momentarily.</p>
        </div>
      ) : (
        turns.map((turn, index) => {
          const isAi = turn.role === 'ai';

          return (
            <div
              key={index}
              className={`flex items-start gap-2 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-6 h-6 rounded-full bg-[#2D1A10] border border-[#522E22] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-[#F0B87A]" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl p-3 space-y-1 text-xs leading-relaxed transition-all ${
                  isAi
                    ? 'bg-[#1A0C09] border border-[#3E1D19] text-[#F5E8DD] rounded-tl-xs shadow-xs'
                    : 'bg-[#2D1A10] border border-[#522E22] text-[#F5E8DD] rounded-tr-xs shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 pb-0.5">
                  <span
                    className={`font-semibold text-[11px] ${
                      isAi ? 'text-[#F0B87A]' : 'text-[#D4B8A8]'
                    }`}
                  >
                    {isAi ? `${aiName}` : 'You'}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#856658]">
                    {turn.timestamp && (
                      <span>
                        {new Date(turn.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                    {isAi && onReplaySpeech && (
                      <button
                        type="button"
                        onClick={() => onReplaySpeech(turn.content)}
                        className="hover:text-[#F0B87A] transition"
                        title="Replay Spoken Audio"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="whitespace-pre-wrap">{turn.content}</p>

                {turn.codeSnapshot && (
                  <div className="mt-2 pt-2 border-t border-[#3E1D19]">
                    <div className="flex items-center gap-1 text-[10px] text-[#856658] mb-1">
                      <Code className="w-3 h-3" />
                      <span>Submitted code snippet:</span>
                    </div>
                    <pre className="p-2 rounded-xl bg-[#0D0403] border border-[#3E1D19] text-[11px] font-mono text-[#F0B87A] overflow-x-auto">
                      {typeof turn.codeSnapshot === 'string'
                        ? turn.codeSnapshot
                        : turn.codeSnapshot?.code}
                    </pre>
                  </div>
                )}
              </div>

              {!isAi && (
                <div className="w-6 h-6 rounded-full bg-[#24110E] border border-[#3E1D19] flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-[#A88879]" />
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
