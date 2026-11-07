import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showWordmark?: boolean;
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showWordmark = true,
  showSubtitle = false,
  className = '',
}) => {
  const iconDimensions = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }[size];

  const textClass = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl sm:text-4xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 font-bold tracking-tight select-none ${className}`}>
      {/* SVG Shield & Code Emblem styled in Luxury Gold & Wine */}
      <div className={`relative shrink-0 flex items-center justify-center ${iconDimensions}`}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          className="w-full h-full drop-shadow-[0_2px_12px_rgba(240,184,122,0.35)]"
        >
          <defs>
            <linearGradient id="brandShieldGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5C68F" />
              <stop offset="50%" stopColor="#F0B87A" />
              <stop offset="100%" stopColor="#C49156" />
            </linearGradient>
            <linearGradient id="brandSparkGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF5EA" />
              <stop offset="100%" stopColor="#E2A664" />
            </linearGradient>
          </defs>

          {/* Outer Shield in Amber Gold Gradient */}
          <path
            d="M24 4L7 11V22.5C7 32.5 14.3 41.8 24 44C33.7 41.8 41 32.5 41 22.5V11L24 4Z"
            fill="url(#brandShieldGoldGrad)"
          />

          {/* Inner Contrast Shield in Dark Wine Espresso */}
          <path
            d="M24 7.5L10 13.5V22.5C10 30.8 16 38.6 24 40.5C32 38.6 38 30.8 38 22.5V13.5L24 7.5Z"
            fill="#140705"
            opacity="0.95"
          />

          {/* Code Left Bracket */}
          <path
            d="M19 19L15 24L19 29"
            stroke="#F0B87A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Code Right Bracket */}
          <path
            d="M29 19L33 24L29 29"
            stroke="#F0B87A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central Spark / Diamond */}
          <polygon points="24,19 26.5,24 24,29 21.5,24" fill="url(#brandSparkGrad)" />
        </svg>
      </div>

      {/* Wordmark */}
      {showWordmark && (
        <div className="leading-none">
          <span className={`font-serif tracking-tight text-[#F5E8DD] font-medium ${textClass}`}>
            HireReady <span className="italic font-normal text-[#F0B87A]">AI</span>
          </span>
          {showSubtitle && (
            <span className="block text-[11px] text-[#A88879] tracking-wider uppercase mt-1">
              AI Placement &amp; Interview Cockpit
            </span>
          )}
        </div>
      )}
    </div>
  );
};
export default BrandLogo;