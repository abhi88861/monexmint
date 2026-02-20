'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({ theme: 'light', setTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = typeof window !== 'undefined' && localStorage.getItem('mwc-theme');
    if (stored === 'dark' || stored === 'light') setThemeState(stored);
    else if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches)
      setThemeState('dark');
  }, []);

  useEffect(() => {
    if (!mounted || typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('mwc-theme', theme); } catch (_) {}
  }, [theme, mounted]);

  const setTheme = (t) => setThemeState(t === 'dark' ? 'dark' : 'light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  return ctx || { theme: 'light', setTheme: () => {} };
}
