/**
 * Banking Tayari Nepal - Centralized Design Tokens
 * 
 * Complies with the Frontend Design Constitution:
 * - 60-30-10 color discipline (Canvas: Slate/Navy, Surfaces: Neutral cards, Accent: Subtle Gold/Sky)
 * - Anti-slop zero-pill typography
 * - Tabular numerals for all metrics
 * - Single-elevation card depth
 */

export const DESIGN_TOKENS = {
  colors: {
    // 60% Canvas
    canvas: {
      light: '#F8FAFC',
      dark: '#0B132B',
      altLight: '#F1F5F9',
      altDark: '#0F172A',
    },
    // 30% Structural Surfaces
    surface: {
      cardLight: '#FFFFFF',
      cardDark: '#0F172A',
      cardSubtleLight: '#F8FAFC',
      cardSubtleDark: '#1E293B',
      borderLight: '#E2E8F0',
      borderDark: '#1E293B',
      dividerLight: '#EEF2F6',
      dividerDark: '#334155',
    },
    // Brand Core
    brand: {
      midnight: '#060D1D',   // Ultra-deep Midnight Navy
      navy: '#0B2046',       // Official Banking Tayari Deep Navy
      navyDark: '#040914',
      navyLight: '#142952',
      crimson: '#C8102E',    // Official Accent Crimson
      blue: '#2563EB',       // Modern Fintech Electric Blue
      blueLight: '#38BDF8',
      blueDark: '#1D4ED8',
    },
    // 10% Accents & Semantics
    accent: {
      gold: '#C5A059',       // Subtle Champagne Gold
      goldLight: '#FBF7EE',
      goldDark: '#99732E',
      emerald: '#059669',    // Success / Correct
      emeraldLight: '#ECFDF5',
      rose: '#E11D48',       // Error / Incorrect
      roseLight: '#FFF1F2',
      amber: '#D97706',      // Warning / Review
      amberLight: '#FFFBEB',
    },
    // Typography Colors
    text: {
      primaryLight: '#0F172A',
      primaryDark: '#F8FAFC',
      secondaryLight: '#475569',
      secondaryDark: '#94A3B8',
      mutedLight: '#64748B',
      mutedDark: '#64748B',
      inverseLight: '#FFFFFF',
      inverseDark: '#0F172A',
    }
  },
  typography: {
    fonts: {
      sans: "'Mukta', 'Plus Jakarta Sans', 'Noto Sans Devanagari', sans-serif",
      display: "'Plus Jakarta Sans', 'Mukta', sans-serif",
      mono: "'IBM Plex Mono', monospace",
    },
  },
  elevation: {
    card: 'shadow-[0_1px_3px_0_rgba(15,23,42,0.06)]',
    cardHover: 'hover:shadow-[0_4px_12px_0_rgba(15,23,42,0.08)]',
    modal: 'shadow-2xl',
  },
  radius: {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
  }
} as const;
