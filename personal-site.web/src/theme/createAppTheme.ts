import { createTheme, type Theme } from '@mui/material/styles';

import type { ThemeMode } from './themeContext';

// Builds the Material UI theme for the two icon buttons and their tooltips.
// Colours are read from the CSS custom properties in `styles/_tokens.scss`,
// which change with the `data-theme` attribute, so only `palette.mode` depends
// on the argument.
export function createAppTheme(mode: ThemeMode): Theme {
  return createTheme({
    palette: {
      mode,
      background: {
        default: 'var(--color-bg)',
        paper: 'var(--color-surface)',
      },
      text: {
        primary: 'var(--color-text)',
        secondary: 'var(--color-text-muted)',
      },
    },
    // The neutral baseline has no border radii.
    shape: { borderRadius: 0 },
    typography: { fontFamily: 'var(--font-sans)' },
    components: {
      MuiIconButton: {
        defaultProps: { disableRipple: true },
        styleOverrides: {
          root: {
            color: 'var(--color-text-muted)',
            borderRadius: 0,
            transition: 'color var(--transition), background-color var(--transition)',
            '&:hover': {
              color: 'var(--color-text)',
              backgroundColor: 'var(--color-surface)',
            },
            // Mirrors the `focus-ring` mixin in `_mixins.scss` — a Sass mixin
            // cannot be called from TypeScript, so keep the two in step by hand.
            '&:focus-visible': {
              outline: '2px solid var(--color-focus)',
              outlineOffset: '2px',
            },
          },
          // Set here rather than in a stylesheet because MUI's own sizeSmall
          // rule would otherwise win on specificity.
          sizeSmall: { padding: 'var(--space-2)' },
        },
      },
      MuiTooltip: {
        defaultProps: { arrow: false, enterDelay: 400 },
        styleOverrides: {
          tooltip: {
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            borderRadius: 0,
            fontSize: 'var(--text-sm)',
            padding: 'var(--space-1) var(--space-2)',
          },
        },
      },
    },
  });
}
