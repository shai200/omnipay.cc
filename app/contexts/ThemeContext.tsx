'use client';

import React, { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const STORAGE_KEY = 'theme';

const ThemeContext = createContext<ThemeContextType>({ theme: 'light', toggleTheme: () => {} });

// Runs in <head> before first paint so a saved dark theme does not flash light.
// The default stays light (system preference is intentionally ignored).
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}catch(e){document.documentElement.setAttribute('data-theme','light');}})();`;

function readTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(subscribe, readTheme, () => 'light');

  const toggleTheme = useCallback(() => {
    const next: Theme = readTheme() === 'light' ? 'dark' : 'light';
    const root = document.documentElement;
    root.classList.add('theme-transition');
    root.setAttribute('data-theme', next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private mode). The theme still applies.
    }
    window.setTimeout(() => root.classList.remove('theme-transition'), 250);
  }, []);

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
