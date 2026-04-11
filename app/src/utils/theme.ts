// ConveyorCalc Design System - Light Theme
export const Colors = {
  // Backgrounds
  background: '#F4F7FB', // Light grayish-blue bg in Figma
  surface: '#FFFFFF', // White cards
  surfaceLight: '#F8FAFC',
  card: '#FFFFFF',

  // Primary & Accent
  primary: '#3B82F6', // Blue for buttons and active states
  primaryDark: '#2563EB',
  accent: '#7B61FF',
  accentLight: '#A78BFA',

  // Semantic
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Text
  textPrimary: '#1E293B', // Dark gray for headings
  textSecondary: '#475569', // Medium gray for body/labels
  textMuted: '#94A3B8', // Light gray for placeholders

  // Borders
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  borderFocus: '#3B82F6',

  // Glassmorphism (used less in light theme, but kept for compatibility)
  glassBackground: 'rgba(255, 255, 255, 0.8)',
  glassBorder: 'rgba(226, 232, 240, 0.8)',

  // Gradients
  gradientStart: '#3B82F6',
  gradientEnd: '#60A5FA',
  gradientCyan: ['#0EA5E9', '#38BDF8'] as const,
  gradientPurple: ['#8B5CF6', '#A78BFA'] as const,
  // Using a custom one for the Home Screen header
  gradientHero: ['#38BDF8', '#8B5CF6'] as const,
  gradientBlue: ['#3B82F6', '#60A5FA'] as const,
  gradientSuccess: ['#10B981', '#34D399'] as const,
  gradientWarning: ['#F59E0B', '#FBBF24'] as const,
};

export const Typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: Colors.textPrimary, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700' as const, color: Colors.textPrimary, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const, color: Colors.textPrimary },
  body: { fontSize: 15, fontWeight: '400' as const, color: Colors.textPrimary, lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, color: Colors.textSecondary, lineHeight: 18 },
  caption: { fontSize: 11, fontWeight: '500' as const, color: Colors.textMuted, letterSpacing: 0.5, textTransform: 'uppercase' as const },
  label: { fontSize: 14, fontWeight: '600' as const, color: Colors.textPrimary }, // Darker labels in the new design
  value: { fontSize: 20, fontWeight: '700' as const, color: Colors.primary },
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
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  }),
};

export const GlassStyle = {
  backgroundColor: Colors.glassBackground,
  borderWidth: 1,
  borderColor: Colors.glassBorder,
  borderRadius: BorderRadius.lg,
};

