import React from 'react';
import { Persona } from '../types/persona';

interface PersonaAvatarProps {
  persona: Persona;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSpeaking?: boolean;
  className?: string;
}

export const PersonaAvatar: React.FC<PersonaAvatarProps> = ({
  persona,
  size = 'md',
  isSpeaking = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  // Distinct stylized color gradients for each persona
  const getGradientColors = (key: string) => {
    switch (key) {
      case 'arjun':
        return { start: '#34D399', end: '#059669', skin: '#FCD34D', hair: '#1F2937' };
      case 'tanya':
        return { start: '#22D3EE', end: '#0891B2', skin: '#FDE68A', hair: '#374151' };
      case 'samarth':
        return { start: '#60A5FA', end: '#2563EB', skin: '#FBBF24', hair: '#111827' };
      case 'riddhi':
        return { start: '#A78BFA', end: '#7C3AED', skin: '#FCD34D', hair: '#4B5563' };
      case 'vivan':
        return { start: '#FBBF24', end: '#D97706', skin: '#F59E0B', hair: '#1F2937' };
      case 'shreya':
        return { start: '#FB7185', end: '#BE123C', skin: '#FDE68A', hair: '#1E293B' };
      case 'kavya':
      default:
        return { start: '#FF976B', end: '#FF7A48', skin: '#FCD34D', hair: '#334155' };
    }
  };

  const { start, end, hair } = getGradientColors(persona.key);

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Speaking voice ripple ring */}
      {isSpeaking && (
        <>
          <span
            className="absolute inset-0 rounded-full animate-ping opacity-75"
            style={{ backgroundColor: persona.accentColor }}
          />
          <span
            className="absolute -inset-2 rounded-full border-2 animate-pulse"
            style={{ borderColor: persona.accentColor }}
          />
        </>
      )}

      {/* Portrait Container */}
      <div
        className={`relative rounded-full overflow-hidden border-2 shadow-sm flex items-center justify-center ${sizeMap[size]}`}
        style={{
          borderColor: persona.accentColor,
          background: `linear-gradient(135deg, ${persona.accentBg} 0%, #FFFFFF 100%)`,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id={`grad-${persona.key}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={start} stopOpacity="0.25" />
              <stop offset="100%" stopColor={end} stopOpacity="0.45" />
            </linearGradient>
          </defs>

          {/* Background tint */}
          <circle cx="50" cy="50" r="48" fill={`url(#grad-${persona.key})`} />

          {/* Shoulders / Torso */}
          <path
            d="M20 92 C20 74 35 68 50 68 C65 68 80 74 80 92 Z"
            fill={persona.accentColor}
            opacity="0.9"
          />

          {/* Neck */}
          <rect x="44" y="52" width="12" height="18" rx="4" fill="#F8D7BE" />

          {/* Head & Face */}
          <ellipse cx="50" cy="42" rx="20" ry="24" fill="#FFDFC4" />

          {/* Hair */}
          {persona.key === 'tanya' || persona.key === 'riddhi' || persona.key === 'shreya' || persona.key === 'kavya' ? (
            // Long / Styled Hair
            <path
              d="M26 38 C26 22 36 16 50 16 C64 16 74 22 74 38 C74 52 70 60 70 60 C66 48 66 36 64 34 C60 30 54 30 50 30 C46 30 40 30 36 34 C34 36 34 48 30 60 C30 60 26 52 26 38 Z"
              fill={hair}
            />
          ) : (
            // Short / Executive Hair
            <path
              d="M28 36 C28 20 38 18 50 18 C62 18 72 20 72 36 C68 28 62 26 50 26 C38 26 32 28 28 36 Z"
              fill={hair}
            />
          )}

          {/* Eyes */}
          <circle cx="43" cy="42" r="2.5" fill="#1E293B" />
          <circle cx="57" cy="42" r="2.5" fill="#1E293B" />
          <circle cx="44" cy="41" r="0.8" fill="#FFFFFF" />
          <circle cx="58" cy="41" r="0.8" fill="#FFFFFF" />

          {/* Eyebrows */}
          <path d="M40 37 Q43 35 47 37" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <path d="M53 37 Q57 35 60 37" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Glasses for Samarth / Vivan */}
          {(persona.key === 'samarth' || persona.key === 'vivan') && (
            <g stroke="#334155" strokeWidth="1.5" fill="none">
              <rect x="37" y="37" width="11" height="9" rx="2" />
              <rect x="52" y="37" width="11" height="9" rx="2" />
              <line x1="48" y1="41" x2="52" y2="41" />
            </g>
          )}

          {/* Smile */}
          <path
            d={isSpeaking ? 'M44 51 Q50 56 56 51' : 'M45 52 Q50 55 55 52'}
            stroke="#9A3412"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Small tier badge marker */}
        <span
          className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs"
          style={{ backgroundColor: persona.accentColor }}
        />
      </div>
    </div>
  );
};
