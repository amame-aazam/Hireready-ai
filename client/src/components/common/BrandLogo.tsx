import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = false,
}) => {
  const iconSize =
    size === 'sm' ? 'w-6 h-6 text-xs' : size === 'lg' ? 'w-10 h-10 text-lg' : 'w-8 h-8 text-sm';
  const textClass =
    size === 'sm'
      ? 'text-base'
      : size === 'lg'
      ? 'text-2xl'
      : 'text-lg';

  return (
    <div className="flex items-center gap-2.5">
      {/* Emblem from reference: Golden rounded square */}
      <div
        className={`${iconSize} rounded-xl bg-gradient-to-br from-[#F0B87A] to-[#E2A664] text-[#140808] font-bold font-serif flex items-center justify-center shadow-[0_2px_12px_rgba(240,184,122,0.3)] shrink-0`}
      >
        हा
      </div>

      <div className="leading-none">
        <span className={`font-serif tracking-tight text-[#F5E8DD] ${textClass}`}>
          HireReady <span className="italic font-normal text-[#F0B87A]">AI</span>
        </span>
        {showSubtitle && (
          <span className="block text-[10px] text-[#A88879] tracking-wider uppercase mt-0.5">
            AI Placement &amp; Interview Cockpit
          </span>
        )}
      </div>
    </div>
  );
};
export default BrandLogo;
