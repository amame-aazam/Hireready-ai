import React, { useState } from 'react';
import { Mic, MicOff, Send, MessageSquare, Loader2 } from 'lucide-react';

interface VoiceControlsProps {
  isListening: boolean;
  transcript: string;
  interimTranscript?: string;
  onStartListening: () => void;
  onStopListening: () => void;
  onSendTurn?: (text: string) => Promise<void>;
  onSubmit?: (text: string) => void | Promise<void>;
  onClearTranscript?: () => void;
  isSendingTurn?: boolean;
  isSupported: boolean;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  transcript,
  interimTranscript = '',
  onStartListening,
  onStopListening,
  onSendTurn,
  onSubmit,
  onClearTranscript,
  isSendingTurn = false,
  isSupported,
}) => {
  const [manualText, setManualText] = useState('');
  const [isTypingMode, setIsTypingMode] = useState(!isSupported);

  const displayText = isTypingMode ? manualText : transcript + (interimTranscript ? ` ${interimTranscript}` : '');
  const canSend = displayText.trim().length > 0 && !isSendingTurn;

  const handleSend = async () => {
    if (!canSend) return;
    const message = displayText.trim();
    if (isTypingMode) {
      setManualText('');
    } else {
      if (onClearTranscript) onClearTranscript();
      if (isListening) onStopListening();
    }
    if (onSubmit) {
      await onSubmit(message);
    } else if (onSendTurn) {
      await onSendTurn(message);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-[#1A0C09]/95 border border-[#3E1D19] rounded-2xl p-3 space-y-2.5 shrink-0 shadow-sm text-[#F5E8DD]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isSupported && (
            <button
              type="button"
              onClick={isListening ? onStopListening : onStartListening}
              className={`p-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-all ${
                isListening
                  ? 'bg-red-950 border border-red-700 text-red-300 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                  : 'bg-gradient-to-r from-[#F0B87A] to-[#E2A664] hover:from-[#F5C68F] hover:to-[#EDB373] text-[#140808] font-bold shadow-[0_0_15px_rgba(240,184,122,0.3)]'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4" />
                  <span>Listening... (Click to Mute)</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4" />
                  <span>Push to Speak</span>
                </>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsTypingMode(!isTypingMode)}
            className="p-2 rounded-xl bg-[#140705] border border-[#3E1D19] text-[#A88879] hover:text-[#F5E8DD] hover:bg-[#24110E] transition"
            title={isTypingMode ? 'Switch to Voice Mode' : 'Switch to Keyboard Input'}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[11px] text-[#856658]">
          {isListening ? 'Speak your thoughts out loud' : isTypingMode ? 'Type & press Enter' : 'Mic paused'}
        </div>
      </div>

      {isTypingMode ? (
        <div className="relative">
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response to the interviewer..."
            rows={2}
            className="w-full p-2.5 pr-10 rounded-xl bg-[#140705] border border-[#3E1D19] text-xs text-[#F5E8DD] placeholder-[#856658] focus:outline-none focus:border-[#F0B87A] resize-none transition"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!canSend}
            className="absolute right-2.5 bottom-3 p-1.5 rounded-lg bg-[#2D1A10] text-[#F0B87A] border border-[#522E22] hover:bg-[#F0B87A] hover:text-[#140808] transition disabled:opacity-30"
          >
            {isSendingTurn ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>
      ) : (
        displayText && (
          <div className="p-2.5 rounded-xl bg-[#140705] border border-[#3E1D19] flex items-center justify-between gap-2 text-xs">
            <span className="text-[#D4B8A8] italic truncate">{displayText}</span>
            <button
              type="button"
              onClick={handleSend}
              disabled={!canSend}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-[#F0B87A] to-[#E2A664] text-[#140808] font-bold text-xs shrink-0 flex items-center gap-1 shadow-xs disabled:opacity-30"
            >
              {isSendingTurn ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              <span>Send</span>
            </button>
          </div>
        )
      )}
    </div>
  );
};
