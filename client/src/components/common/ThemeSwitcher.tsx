import React, { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme, ThemeId } from '../../contexts/ThemeContext';

export const ThemeSwitcher: React.FC = () => {
  const { currentTheme, setTheme, options } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (id: ThemeId) => {
    setTheme(id);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Palette Icon Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
          isOpen
            ? 'bg-[#2D140C] border-[var(--theme-accent,#FF9E79)] text-[var(--theme-accent,#FF9E79)] shadow-[0_0_15px_var(--theme-accent-shadow,rgba(255,158,121,0.35))]'
            : 'bg-[#24110E] border-[#3E1D19] text-[#A88879] hover:text-[#F5E8DD] hover:border-[#52251E]'
        }`}
        title="Change Theme"
        aria-label="Change Theme"
      >
        <Palette className="w-4 h-4" />
      </button>

      {/* Floating Theme Switcher Dropdown (Matching Screenshot) */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-72 sm:w-80 rounded-2xl bg-[#160806]/95 border border-[#3E1D19] backdrop-blur-xl shadow-2xl p-2.5 z-50 text-left animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 pt-1 pb-2">
            <span className="text-xs font-semibold text-[#856658] uppercase tracking-wider">
              Theme
            </span>
          </div>

          <div className="space-y-1">
            {options.map((theme) => {
              const isActive = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => handleSelect(theme.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition text-left group ${
                    isActive
                      ? 'bg-[#24100C] border border-[#52251D]'
                      : 'hover:bg-[#1E0D0A] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Quadrant Conic Swatch */}
                    <div
                      className="w-8 h-8 rounded-full border border-white/10 shrink-0 shadow-sm"
                      style={{ background: theme.swatchConic }}
                    />
                    <div>
                      <div className="text-sm font-semibold text-[#F5E8DD] group-hover:text-white transition">
                        {theme.name}
                      </div>
                      <div className="text-xs text-[#A88879] leading-tight">
                        {theme.description}
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <div className="text-[var(--theme-accent,#FF9E79)] pl-2">
                      <Check className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default ThemeSwitcher;
