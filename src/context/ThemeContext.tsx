import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeMode = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
  compactMode: boolean;
  toggleCompactMode: () => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('kalatrack_theme') as ThemeMode) || 'dark';
  });

  const [compactMode, setCompactMode] = useState<boolean>(() => {
    return localStorage.getItem('kalatrack_compact') === 'true';
  });

  const [accentColor, setAccentColor] = useState<string>(() => {
    return localStorage.getItem('kalatrack_accent') || 'indigo';
  });

  useEffect(() => {
    localStorage.setItem('kalatrack_theme', theme);
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('kalatrack_compact', String(compactMode));
  }, [compactMode]);

  useEffect(() => {
    localStorage.setItem('kalatrack_accent', accentColor);
  }, [accentColor]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleCompactMode = () => {
    setCompactMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        compactMode,
        toggleCompactMode,
        accentColor,
        setAccentColor,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
