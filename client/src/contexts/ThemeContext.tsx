import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeId = 'ember-night' | 'violet' | 'crimson-gold' | 'charcoal-gold';

export interface ThemeOption {
  id: ThemeId;
  name: string;
  description: string;
  swatchConic: string;
  accentColor: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'ember-night',
    name: 'Ember Night',
    description: 'Warm peach on black.',
    swatchConic: 'conic-gradient(#FF9E79 0deg 90deg, #180907 90deg 180deg, #FF9E79 180deg 270deg, #180907 270deg 360deg)',
    accentColor: '#FF9E79',
  },
  {
    id: 'violet',
    name: 'Violet',
    description: 'Deep indigo with lavender light.',
    swatchConic: 'conic-gradient(#B89DFF 0deg 90deg, #130E29 90deg 180deg, #B89DFF 180deg 270deg, #130E29 270deg 360deg)',
    accentColor: '#B89DFF',
  },
  {
    id: 'crimson-gold',
    name: 'Crimson & Gold',
    description: 'A red-black glow, gold buttons. The default.',
    swatchConic: 'conic-gradient(#C93B3B 0deg 90deg, #F0B87A 90deg 180deg, #1A0C09 180deg 270deg, #C93B3B 270deg 360deg)',
    accentColor: '#F0B87A',
  },
  {
    id: 'charcoal-gold',
    name: 'Charcoal & Gold',
    description: 'Plain black with a gold accent.',
    swatchConic: 'conic-gradient(#E5B869 0deg 90deg, #141414 90deg 180deg, #E5B869 180deg 270deg, #141414 270deg 360deg)',
    accentColor: '#E5B869',
  },
];

interface ThemeContextType {
  currentTheme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  options: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'hireready_theme_preference';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to 'ember-night' as requested by the user
  const [currentTheme, setCurrentThemeState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeId;
      if (saved && THEME_OPTIONS.some((t) => t.id === saved)) {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'ember-night';
  });

  const setTheme = (theme: ThemeId) => {
    setCurrentThemeState(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // Apply attribute to html and body
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.body.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, options: THEME_OPTIONS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
