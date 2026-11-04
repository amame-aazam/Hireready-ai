import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showWordmark = true,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const textStyles = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  }[size];

  const badgeStyles = {
    sm: 'text-[10px] px-1 py-0.2',
    md: 'text-xs px-1.5 py-0.5',
    lg: 'text-sm px-2 py-0.5',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 font-extrabold tracking-tight select-none ${className}`}>
      {/* SVG Shield Emblem */}
      <div className={`relative shrink-0 flex items-center justify-center ${iconDimensions}`}>
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full drop-shadow-[0_0_12px_rgba(225,29,72,0.45)]">
          <defs>
            <linearGradient id="logoCrimsonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FB7185" />
              <stop offset="50%" stop-color="#E11D48" />
              <stop offset="100%" stop-color="#881337" />
            </linearGradient>
          </defs>
          <path
            d="M24 4L7 11V22.5C7 32.5 14.3 41.8 24 44C33.7 41.8 41 32.5 41 22.5V11L24 4Z"
            fill="url(#logoCrimsonGrad)"
          />
          <path
            d="M24 8L10.5 13.8V22.5C10.5 30.5 16.3 38.2 24 40.2C31.7 38.2 37.5 30.5 37.5 22.5V13.8L24 8Z"
            fill="#09090B"
            opacity="0.9"
          />
          <path
            d="M19 19L15 24L19 29"
            stroke="#FB7185"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M29 19L33 24L29 29"
            stroke="#FB7185"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon points="24,19 26.5,24 24,29 21.5,24" fill="#E11D48" />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <span className={`text-white flex items-center gap-1.5 ${textStyles}`}>
          <span>HireReady</span>
          <span className={`rounded-md bg-gradient-to-r from-crimson-600 to-rose-700 text-white font-black tracking-wider uppercase shadow-sm ${badgeStyles}`}>
            AI
          </span>
        </span>
      )}
    </div>
  );
};
