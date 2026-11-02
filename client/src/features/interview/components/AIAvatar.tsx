import React from 'react';
import { Volume2, Mic, Sparkles } from 'lucide-react';

interface AIAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
  interviewerName?: string;
}

export const AIAvatar: React.FC<AIAvatarProps> = ({
  isSpeaking,
  isListening,
  interviewerName = 'Sophia',
}) => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-between p-4 sm:p-5 bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden text-center shadow-xl">
      {/* Dynamic Background Ambient Glow */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
          isSpeaking
            ? 'bg-radial from-indigo-600/30 via-cyan-500/10 to-transparent opacity-100'
            : isListening
            ? 'bg-radial from-emerald-600/30 via-teal-500/10 to-transparent opacity-100'
            : 'opacity-0'
        }`}
      />

      {/* Top Header Label */}
      <div className="w-full flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            AI Technical Interviewer
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          Staff Bar Raiser
        </span>
      </div>

      {/* Sophia Vector Portrait & Animated Aura */}
      <div className="relative group my-auto">
        {/* Luminous Pulsing Concentric Sound Rings when Speaking */}
        {isSpeaking && (
          <>
            <div className="absolute -inset-5 rounded-full border-2 border-indigo-400/40 animate-ping opacity-50 pointer-events-none" />
            <div className="absolute -inset-2.5 rounded-full border-2 border-cyan-400/50 animate-pulse pointer-events-none" />
          </>
        )}

        {/* Luminous Pulsing Ripple when Listening to Candidate */}
        {isListening && (
          <>
            <div className="absolute -inset-4 rounded-full border-2 border-emerald-400/50 animate-pulse opacity-70 pointer-events-none" />
            <div className="absolute -inset-2 rounded-full border-2 border-teal-400/60 animate-ping opacity-40 pointer-events-none" />
          </>
        )}

        {/* Circular Avatar Frame */}
        <div
          className={`w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 xl:w-44 xl:h-44 rounded-full p-1.5 border-2 transition-all duration-500 relative z-10 flex items-center justify-center overflow-hidden ${
            isSpeaking
              ? 'border-indigo-400 shadow-[0_0_45px_rgba(99,102,241,0.5)] ring-4 ring-indigo-500/30 scale-105'
              : isListening
              ? 'border-emerald-400 shadow-[0_0_45px_rgba(16,185,129,0.5)] ring-4 ring-emerald-500/30 scale-102 animate-pulse'
              : 'border-slate-700/80 shadow-2xl shadow-slate-950/80 bg-slate-900'
          }`}
        >
          {/* Custom SVG Vector Illustration of Sophia (Professional Female AI Technical Assistant) */}
          <svg
            viewBox="0 0 160 160"
            className="w-full h-full object-cover"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="hairGrad" x1="40" y1="20" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2c184d" />
                <stop offset="60%" stopColor="#1e1b4b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              <linearGradient id="skinGrad" x1="80" y1="40" x2="80" y2="110" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fed7aa" />
                <stop offset="100%" stopColor="#fdba74" />
              </linearGradient>

              <linearGradient id="blazerGrad" x1="40" y1="110" x2="120" y2="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#1e1b4b" />
                <stop offset="50%" stopColor="#312e81" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              <linearGradient id="headsetGrad" x1="30" y1="40" x2="130" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>

              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="glow" />
                <feComposite in="SourceGraphic" in2="glow" operator="over" />
              </filter>
            </defs>

            {/* Background Halo */}
            <circle cx="80" cy="80" r="76" fill="#090d16" />
            <circle
              cx="80"
              cy="80"
              r="74"
              fill={isSpeaking ? 'url(#headsetGrad)' : isListening ? '#064e3b' : '#1e293b'}
              opacity={isSpeaking ? '0.15' : isListening ? '0.2' : '0.08'}
            />

            {/* Back Hair */}
            <path
              d="M44 65 C40 95, 36 125, 42 140 C46 148, 54 150, 58 140 C60 120, 58 85, 58 75 Z"
              fill="url(#hairGrad)"
            />
            <path
              d="M116 65 C120 95, 124 125, 118 140 C114 148, 106 150, 102 140 C100 120, 102 85, 102 75 Z"
              fill="url(#hairGrad)"
            />

            {/* Shoulders & Business Blazer */}
            <path
              d="M32 158 C34 130, 52 118, 70 114 L90 114 C108 118, 126 130, 128 158 Z"
              fill="url(#blazerGrad)"
            />
            {/* Blouse V-Neck Inner */}
            <path d="M68 114 L80 138 L92 114 Z" fill="#f8fafc" opacity="0.9" />
            {/* Blazer Lapel Lines */}
            <path d="M56 120 L78 146 L76 158" stroke="#475569" strokeWidth="1.5" />
            <path d="M104 120 L82 146 L84 158" stroke="#475569" strokeWidth="1.5" />

            {/* Neck */}
            <path d="M72 96 L72 118 C72 122, 88 122, 88 118 L88 96 Z" fill="url(#skinGrad)" />

            {/* Head Contour */}
            <path
              d="M56 64 C56 42, 104 42, 104 64 C104 88, 98 104, 80 105 C62 104, 56 88, 56 64 Z"
              fill="url(#skinGrad)"
            />

            {/* Stylized Modern Hairstyle */}
            <path
              d="M50 62 C50 36, 110 32, 110 56 C110 64, 104 66, 100 66 C94 54, 76 50, 64 62 C58 68, 54 74, 50 62 Z"
              fill="url(#hairGrad)"
            />
            {/* Hair Side Sweep */}
            <path
              d="M53 54 C66 42, 94 44, 107 58 C100 52, 78 48, 62 58 C57 62, 54 66, 53 54 Z"
              fill="#4338ca"
              opacity="0.4"
            />

            {/* Facial Features */}
            {/* Eyebrows */}
            <path d="M64 60 C68 58, 73 59, 76 62" stroke="#312e81" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M84 62 C87 59, 92 58, 96 60" stroke="#312e81" strokeWidth="1.5" strokeLinecap="round" />

            {/* Expressive Eyes */}
            <ellipse cx="70" cy="68" rx="4.5" ry="3" fill="#1e1b4b" />
            <circle cx="71" cy="67" r="1.3" fill="#ffffff" />
            <ellipse cx="90" cy="68" rx="4.5" ry="3" fill="#1e1b4b" />
            <circle cx="91" cy="67" r="1.3" fill="#ffffff" />

            {/* Delicate Nose */}
            <path d="M79 70 L78 78 L82 78" stroke="#f97316" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />

            {/* Friendly Confident Smile */}
            {isSpeaking ? (
              // Animated open smile while speaking
              <path
                d="M74 86 C76 92, 84 92, 86 86 Z"
                fill="#e11d48"
                stroke="#be123c"
                strokeWidth="1"
              />
            ) : (
              // Warm professional closed smile
              <path
                d="M74 87 C77 91, 83 91, 86 87"
                stroke="#e11d48"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}

            {/* High-Tech Communicator Headset */}
            {/* Headset Band */}
            <path
              d="M53 62 C50 38, 110 38, 107 62"
              stroke="#64748b"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Earpiece with LED status */}
            <rect x="104" y="58" width="6" height="14" rx="3" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
            <circle
              cx="107"
              cy="65"
              r="2"
              fill={isSpeaking ? '#38bdf8' : isListening ? '#10b981' : '#64748b'}
              filter={isSpeaking || isListening ? 'url(#glow)' : undefined}
            />

            {/* Headset Mic Boom curving to mouth */}
            <path
              d="M106 68 C104 82, 94 92, 88 90"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Mic Tip with Glowing Audio Sensor */}
            <circle
              cx="87"
              cy="90"
              r="2.5"
              fill={isSpeaking ? '#818cf8' : isListening ? '#34d399' : '#64748b'}
              filter={isSpeaking || isListening ? 'url(#glow)' : undefined}
            />
          </svg>
        </div>

        {/* Floating Mode Indicator Icon */}
        <div
          className={`absolute -bottom-1 -right-1 p-1.5 rounded-full border-2 border-slate-900 transition-all duration-300 shadow-md ${
            isSpeaking
              ? 'bg-indigo-600 text-white animate-bounce'
              : isListening
              ? 'bg-emerald-600 text-white animate-pulse'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {isSpeaking ? (
            <Volume2 className="w-4 h-4" />
          ) : isListening ? (
            <Mic className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
        </div>
      </div>

      {/* Name, Title & Status */}
      <div className="w-full flex flex-col items-center space-y-2 relative z-10">
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-base sm:text-lg font-extrabold text-slate-100 tracking-tight">{interviewerName}</h3>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            AI Bar Raiser
          </span>
        </div>

        {/* Dynamic Animated Soundwave Visualizer Bars */}
        <div className="flex items-center gap-1.5 h-6 justify-center">
          {[
            { delay: '0ms', speakH: 'h-4', listenH: 'h-2' },
            { delay: '120ms', speakH: 'h-6', listenH: 'h-3' },
            { delay: '240ms', speakH: 'h-3', listenH: 'h-4' },
            { delay: '80ms', speakH: 'h-5', listenH: 'h-2' },
            { delay: '180ms', speakH: 'h-6', listenH: 'h-3' },
            { delay: '300ms', speakH: 'h-5', listenH: 'h-5' },
            { delay: '150ms', speakH: 'h-4', listenH: 'h-2' },
            { delay: '220ms', speakH: 'h-6', listenH: 'h-3' },
            { delay: '90ms', speakH: 'h-5', listenH: 'h-4' },
            { delay: '270ms', speakH: 'h-3', listenH: 'h-2' },
            { delay: '140ms', speakH: 'h-6', listenH: 'h-3' },
            { delay: '60ms', speakH: 'h-4', listenH: 'h-2' },
          ].map((bar, i) => (
            <div
              key={i}
              style={{ animationDelay: bar.delay }}
              className={`w-1 sm:w-1.5 rounded-full transition-all duration-200 ${
                isSpeaking
                  ? `bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)] animate-pulse ${bar.speakH}`
                  : isListening
                  ? `bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse ${bar.listenH}`
                  : 'bg-slate-700/60 h-1.5'
              }`}
            />
          ))}
        </div>

        {/* Real-time Status Badge */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold border transition-all duration-300 ${
            isSpeaking
              ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 shadow-sm shadow-indigo-500/20'
              : isListening
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20'
              : 'bg-slate-800/80 border-slate-700 text-slate-400'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isSpeaking
                ? 'bg-indigo-400 animate-ping'
                : isListening
                ? 'bg-emerald-400 animate-pulse'
                : 'bg-slate-500'
            }`}
          />
          <span>
            {isSpeaking
              ? 'Sophia is Speaking...'
              : isListening
              ? 'Listening to Candidate...'
              : 'Waiting for Candidate Response'}
          </span>
        </div>
      </div>
    </div>
  );
};
