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
    <div className="h-full flex-1 p-3 overflow-y-auto space-y-2.5 bg-[#FFFAF7] rounded-xl border border-[#F2DDD2] min-h-0">
      {turns.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-[#8C7268] text-xs py-6 space-y-1.5">
          <Bot className="w-6 h-6 text-[#FF7A48]" />
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
                <div className="w-6 h-6 rounded-full bg-[#FFEBE1] border border-[#FBD7C7] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-[#FF7A48]" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl p-3 space-y-1 text-xs leading-relaxed transition-all ${
                  isAi
                    ? 'bg-white border border-[#F2DDD2] text-[#0A0706] rounded-tl-xs shadow-xs'
                    : 'bg-[#FFEBE1] border border-[#FBD7C7] text-[#0A0706] rounded-tr-xs shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-3 pb-0.5">
                  <span
                    className={`font-semibold text-[11px] ${
                      isAi ? 'text-[#A83E14]' : 'text-[#6B544A]'
                    }`}
                  >
                    {isAi ? `${aiName}` : 'You'}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#8C7268]">
                    <span>
                      {new Date(turn.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {isAi && onReplaySpeech && (
                      <button
                        onClick={() => onReplaySpeech(turn.content)}
                        className="hover:text-[#FF7A48] transition-colors p-0.5"
                        title="Replay dialogue audio"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="whitespace-pre-wrap font-sans text-xs text-[#0A0706]">{turn.content}</div>

                {((turn as any).codeSnapshot || turn.codeSnippet) && (
                  <div className="mt-2 p-2 rounded-lg bg-[#FFFAF7] border border-[#F2DDD2] font-mono text-[11px] text-[#6B544A]">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-[#A83E14] mb-1">
                      <Code className="w-3 h-3" />
                      <span>Code Snapshot</span>
                    </div>
                    <pre className="overflow-x-auto text-[10px] leading-tight text-[#0A0706]">
                      {String((turn as any).codeSnapshot?.code || (turn as any).codeSnapshot || turn.codeSnippet).slice(0, 300)}
                      {String((turn as any).codeSnapshot?.code || (turn as any).codeSnapshot || turn.codeSnippet).length > 300 && '...'}
                    </pre>
                  </div>
                )}
              </div>

              {!isAi && (
                <div className="w-6 h-6 rounded-full bg-[#E8CBBE] border border-[#F2DDD2] flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-[#6B544A]" />
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
export default TranscriptFeed;
