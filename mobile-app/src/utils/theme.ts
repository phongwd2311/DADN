// ConveyorCalc Design System - Dark Theme
export const Colors = {
  // Backgrounds
  background: '#0A1628',
  surface: '#0F1E36',
  surfaceLight: '#162A4A',
  card: '#1A2E4D',

  // Primary & Accent
  primary: '#00D4FF',
  primaryDark: '#0095B3',
  accent: '#7B61FF',
  accentLight: '#A78BFA',

  // Semantic
  success: '#00E091',
  warning: '#FFB547',
  error: '#FF5A5A',
  info: '#00D4FF',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',

  // Borders
  border: '#1E3A5F',
  borderLight: '#2A4A6F',
  borderFocus: '#00D4FF',

  // Glassmorphism
  glassBackground: 'rgba(15, 30, 54, 0.8)',
  glassBorder: 'rgba(0, 212, 255, 0.15)',

  // Gradients
  gradientStart: '#00D4FF',
  gradientEnd: '#7B61FF',
  gradientCyan: ['#00D4FF', '#0095B3'] as const,
  gradientPurple: ['#7B61FF', '#A78BFA'] as const,
  gradientBlue: ['#00D4FF', '#7B61FF'] as const,
  gradientSuccess: ['#00E091', '#00B37A'] as const,
  gradientWarning: ['#FFB547', '#FF8C00'] as const,
};

export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: Colors.textPrimary, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, color: Colors.textPrimary, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const, color: Colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400' as const, color: Colors.textPrimary, lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, color: Colors.textSecondary, lineHeight: 18 },
  caption: { fontSize: 11, fontWeight: '500' as const, color: Colors.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' as const },
  label: { fontSize: 14, fontWeight: '500' as const, color: Colors.textSecondary },
  value: { fontSize: 20, fontWeight: '700' as const, color: Colors.textPrimary },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const Shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  }),
};

export const GlassStyle = {
  backgroundColor: Colors.glassBackground,
  borderWidth: 1,
  borderColor: Colors.glassBorder,
  borderRadius: BorderRadius.lg,
};
