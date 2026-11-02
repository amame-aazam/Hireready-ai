import React, { useState } from 'react';
import { Mic, MicOff, Send, MessageSquare, Loader2 } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onSendTurn: (text: string) => Promise<void>;
  onClearTranscript: () => void;
  isSendingTurn: boolean;
  isSupported: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  transcript,
  interimTranscript,
  onStartListening,
  onStopListening,
  onSendTurn,
  onClearTranscript,
  isSendingTurn,
  isSupported,
}) => {
  const [manualText, setManualText] = useState('');
  const [isTypingMode, setIsTypingMode] = useState(!isSupported);

  const displayText = isTypingMode ? manualText : transcript + (interimTranscript ? ` ${interimTranscript}` : '');
  const canSend = (displayText.trim().length > 0) && !isSendingTurn;

  const handleSend = async () => {
    if (!canSend) return;
    const message = displayText.trim();
    if (isTypingMode) {
      setManualText('');
    } else {
      onClearTranscript();
      if (isListening) onStopListening();
    }
    await onSendTurn(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isSupported && (
            <button
              type="button"
              onClick={() => {
                if (isListening) {
                  onStopListening();
                } else {
                  setIsTypingMode(false);
                  onStartListening();
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Stop Speaking</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Push to Speak</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (isListening) onStopListening();
              setIsTypingMode(!isTypingMode);
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{isTypingMode ? 'Use Voice' : 'Type Message'}</span>
          </button>
        </div>

        {displayText && (
          <button
            type="button"
            onClick={() => {
              if (isTypingMode) setManualText('');
              else onClearTranscript();
            }}
            className="text-[11px] text-slate-500 hover:text-slate-300 underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Input / Live Transcript Box */}
      <div className="relative">
        {isTypingMode ? (
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response to the interviewer... (Press Enter to send)"
            rows={2}
            className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
          />
        ) : (
          <div
            className={`w-full min-h-[55px] max-h-[85px] p-2.5 rounded-lg bg-slate-950 border text-xs overflow-y-auto leading-relaxed ${
              isListening
                ? 'border-emerald-500/50 text-slate-100 ring-1 ring-emerald-500/30'
                : 'border-slate-800 text-slate-300'
            }`}
          >
            {displayText ? (
              <span>{displayText}</span>
            ) : (
              <span className="text-slate-500 italic">
                {isListening
                  ? 'Listening... Speak your approach clearly.'
                  : 'Click "Push to Speak" or switch to "Type Message" to respond.'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition disabled:opacity-40"
        >
          {isSendingTurn ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>AI thinking...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Send Turn</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
