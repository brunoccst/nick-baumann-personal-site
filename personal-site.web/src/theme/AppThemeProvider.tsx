import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';

import { createAppTheme } from './createAppTheme';
import { ThemeModeContext, type ThemeMode } from './themeContext';

const STORAGE_KEY = 'nick-baumann-site.theme';

// Tints the browser chrome on mobile. `<meta name="theme-color">` cannot read
// a CSS custom property, so these mirror `--color-bg` in `styles/_tokens.scss`
// and the inline script in `index.html`; update all three together.
const THEME_COLOR: Record<ThemeMode, string> = {
  dark: '#0a1016',
  light: '#145b8a',
};

// Returns the stored mode, then the operating system preference, then 'dark'.
// The inline script in `index.html` repeats this before first paint.
function detectMode(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage is unavailable in private modes; fall through to detection.
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(detectMode);

  // Exposes the mode to CSS through a `data-theme` attribute on <html>.
  useEffect(() => {
    document.documentElement.dataset.theme = mode;

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', THEME_COLOR[mode]);
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Ignore storage failures; the mode still applies for this session.
    }
  }, [mode]);

  const toggleMode = useCallback(() => {
    setMode((current) => (current === 'dark' ? 'light' : 'dark'));
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);
  const contextValue = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <ThemeModeContext value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme={false} />
        {children}
      </ThemeProvider>
    </ThemeModeContext>
  );
}
