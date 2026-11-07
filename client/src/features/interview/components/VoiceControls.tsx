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
    <div className="bg-white border border-[#F2DDD2] rounded-2xl p-3 space-y-2.5 shrink-0 shadow-xs">
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
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse shadow-sm'
                  : 'bg-[#FF7A48] hover:bg-[#F05A24] text-white shadow-xs'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Stop Speaking</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>Push to Speak</span>
                </>
              )}
            </button>
          )}

          {isSupported && (
            <button
              type="button"
              onClick={() => {
                if (isListening) onStopListening();
                setIsTypingMode(!isTypingMode);
              }}
              className="text-[#6B544A] hover:text-[#0A0706] text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-full hover:bg-[#FFF5F0]"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isTypingMode ? 'Use Voice' : 'Type Response'}</span>
            </button>
          )}
        </div>

        {isListening && (
          <span className="flex items-center gap-1.5 text-xs text-rose-600 font-medium animate-pulse">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Recording your voice...</span>
          </span>
        )}
      </div>

      {/* Input / Transcript Area */}
      <div className="relative">
        {isTypingMode ? (
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your response here (Press Enter to send)..."
            rows={2}
            className="w-full bg-[#FFFAF7] border border-[#F2DDD2] focus:border-[#FF7A48] focus:ring-1 focus:ring-[#FF7A48] rounded-xl p-2.5 text-xs text-[#0A0706] placeholder-[#8C7268] resize-none outline-hidden"
          />
        ) : (
          <div className="w-full min-h-[44px] bg-[#FFFAF7] border border-[#F2DDD2] rounded-xl p-2.5 text-xs text-[#0A0706] flex items-center">
            {displayText ? (
              <span className="text-[#0A0706]">{displayText}</span>
            ) : (
              <span className="text-[#8C7268] italic">
                {isListening ? 'Speak now... your answer is being transcribed in real-time.' : 'Click "Push to Speak" or type your response.'}
              </span>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleSend}
          disabled={!canSend}
          className={`absolute right-2 bottom-2 p-1.5 rounded-lg transition-all ${
            canSend
              ? 'bg-[#FF7A48] text-white hover:bg-[#F05A24] shadow-xs cursor-pointer'
              : 'bg-[#F2DDD2] text-[#8C7268] cursor-not-allowed'
          }`}
          title="Send turn"
        >
          {isSendingTurn ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
};
export default VoiceControls;
