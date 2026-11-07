import React from 'react';
import { Volume2, VolumeX, Mic, Sparkles } from 'lucide-react';
import { Persona, getPersonaByKey } from '../types/persona';
import { PersonaAvatar } from './PersonaAvatar';

interface AIAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  interviewerName?: string;
  personaKey?: string;
  subtitle?: string;
  persona?: Persona;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({
  isSpeaking,
  isListening,
  interviewerName = 'Sophia',
  personaKey,
  subtitle,
  persona: passedPersona,
  isMuted,
  onToggleMute,
}) => {
  const persona = passedPersona || getPersonaByKey(personaKey || interviewerName.toLowerCase());
  const displayName = interviewerName || persona.name;
  const displaySubtitle = subtitle || persona.role || 'AI Interviewer';

  return (
    <div className="h-full w-full flex flex-col items-center justify-between p-4 sm:p-5 bg-white border border-[#F2DDD2] rounded-2xl relative overflow-hidden text-center shadow-xs">
      {/* Background Soft Glow */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
          isSpeaking
            ? 'bg-gradient-to-b from-[#FFF5F0] via-[#FFEBE1]/30 to-transparent opacity-100'
            : isListening
            ? 'bg-gradient-to-b from-[#ECFDF5] via-[#D1FAE5]/20 to-transparent opacity-100'
            : 'opacity-0'
        }`}
      />

      {/* Top Header Label */}
      <div className="w-full flex items-center justify-between relative z-10 text-xs">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: persona.accentColor }}
          />
          <span className="text-[11px] font-semibold text-[#6B544A] uppercase tracking-wider">
            AI Interviewer
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border"
            style={{
              backgroundColor: persona.accentBg,
              borderColor: persona.accentBorder,
              color: persona.accentColor,
            }}
          >
            {persona.tier}
          </span>
          {onToggleMute && (
            <button
              onClick={onToggleMute}
              type="button"
              className="p-1 rounded-full text-[#8C7268] hover:text-[#0A0706] hover:bg-[#F2DDD2]/40 transition"
              title={isMuted ? 'Unmute voice' : 'Mute voice'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Avatar Portrait */}
      <div className="relative my-auto flex flex-col items-center">
        <PersonaAvatar persona={persona} size="xl" isSpeaking={isSpeaking} />

        {/* Floating Mode Icon */}
        <div
          className={`absolute -bottom-2 p-1.5 rounded-full border-2 border-white shadow-sm transition-all duration-300 ${
            isSpeaking
              ? 'bg-[#FF7A48] text-white animate-bounce'
              : isListening
              ? 'bg-[#10B981] text-white animate-pulse'
              : 'bg-white text-[#8C7268] border-[#F2DDD2]'
          }`}
        >
          {isSpeaking ? (
            <Volume2 className="w-3.5 h-3.5" />
          ) : isListening ? (
            <Mic className="w-3.5 h-3.5" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-[#FF7A48]" />
          )}
        </div>
      </div>

      {/* Name & Soundwave Visualizer */}
      <div className="w-full flex flex-col items-center space-y-2 relative z-10">
        <div className="flex flex-col items-center">
          <h3 className="text-base sm:text-lg font-bold text-[#0A0706] tracking-tight">{displayName}</h3>
          <p className="text-xs text-[#6B544A]">{displaySubtitle}</p>
        </div>

        {/* Soundwave Visualizer */}
        <div className="flex items-center gap-1 h-5 justify-center">
          {[
            { delay: '0ms', speakH: 'h-3.5', listenH: 'h-2' },
            { delay: '120ms', speakH: 'h-5', listenH: 'h-3' },
            { delay: '240ms', speakH: 'h-2.5', listenH: 'h-3.5' },
            { delay: '80ms', speakH: 'h-4.5', listenH: 'h-2' },
            { delay: '180ms', speakH: 'h-5', listenH: 'h-2.5' },
            { delay: '300ms', speakH: 'h-4', listenH: 'h-4' },
            { delay: '150ms', speakH: 'h-3.5', listenH: 'h-2' },
            { delay: '220ms', speakH: 'h-5', listenH: 'h-3' },
            { delay: '90ms', speakH: 'h-4', listenH: 'h-3.5' },
            { delay: '270ms', speakH: 'h-2.5', listenH: 'h-2' },
            { delay: '140ms', speakH: 'h-5', listenH: 'h-3' },
            { delay: '60ms', speakH: 'h-3.5', listenH: 'h-2' },
          ].map((bar, i) => (
            <div
              key={i}
              style={{ animationDelay: bar.delay }}
              className={`w-1 rounded-full transition-all duration-200 ${
                isSpeaking
                  ? `bg-[#FF7A48] animate-pulse ${bar.speakH}`
                  : isListening
                  ? `bg-[#10B981] animate-pulse ${bar.listenH}`
                  : 'bg-[#F2DDD2] h-1.5'
              }`}
            />
          ))}
        </div>

        {/* Status Pill */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
            isSpeaking
              ? 'bg-[#FFEBE1] border-[#FFD7C5] text-[#A83E14]'
              : isListening
              ? 'bg-[#E6F4EA] border-[#CEEAD6] text-[#1F7A3A]'
              : 'bg-[#FFF5F0] border-[#F2DDD2] text-[#6B544A]'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSpeaking
                ? 'bg-[#FF7A48] animate-ping'
                : isListening
                ? 'bg-[#10B981] animate-pulse'
                : 'bg-[#8C7268]'
            }`}
          />
          <span>
            {isSpeaking
              ? `${displayName} is speaking...`
              : isListening
              ? 'Listening to your response...'
              : 'Waiting for your response'}
          </span>
        </div>
      </div>
    </div>
  );
};
export default AIAvatar;
