/**
 * @file src/styles/theme.ts
 * @brief הגדרות עיצוב מרכזיות (Global Design Tokens for GYMovoo)
 * @dependencies Expo, React Native, Theme components, I18nManager
 * @notes כל שינוי דורש עדכון פה! אין להשתמש בערכים קשיחים באף מסך/קומפוננטה.
 * @recurring_errors חובה לתעד כל ערך חדש, להוסיף RTL לכל סגנון, ולעדכן טיפוסים אם צריך.
 */

// --- RTL Support ---
import { I18nManager } from "react-native";
const isRTL = I18nManager.isRTL;

// --- Color Palette ---
export const colors = {
  // Main backgrounds
  background: "#181E41",
  backgroundAlt: "#1F2C4C",
  darkCard: "#1E1E1E",
  darkText: "#FFFFFF",
  darkBackground: "#121212",
  primaryLight: "#4A90E2",
  info: "#2196F3",
  surface: "#1E1E1E",

  // Cards and surfaces
  card: "#242a47",
  cardBorder: "rgba(107, 181, 255, 0.2)",

  // Main colors
  primary: "#007AFF",
  primaryGradientStart: "#4e9eff",
  primaryGradientEnd: "#007AFF",

  // Secondary & status
  secondary: "#5856D6",
  accent: "#4e9eff",
  success: "#34C759",
  error: "#FF3B30",
  warning: "#FF9500",

  white: "#FFFFFF",

  // Text
  text: "#fff",
  textSecondary: "#8CA8FF",

  // Borders and lines
  border: "#6bb5ff",
  divider: "#4b5a7a",

  // Auth
  google: "#DB4437",
  googleText: "#fff",

  // Others
  overlay: "rgba(0, 0, 0, 0.5)",
  shadow: "#000",
  indicator: "rgba(255, 255, 255, 0.3)",
  indicatorActive: "#4e9eff",
  userCounterBg: "rgba(78, 158, 255, 0.1)",
};

// --- Border Radius ---
export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// --- Spacing ---
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

// --- Typography ---
export const typography = {
  // Headings
  h1: {
    fontSize: 36,
    fontWeight: "600" as const,
    lineHeight: 44,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: "600" as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
    lineHeight: 32,
  },
  // Body text
  body: {
    fontSize: 16,
    fontWeight: "normal" as const,
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "normal" as const,
    lineHeight: 20,
  },
  // Captions
  caption: {
    fontSize: 13,
    fontWeight: "normal" as const,
    lineHeight: 18,
  },
  captionSmall: {
    fontSize: 12,
    fontWeight: "normal" as const,
    lineHeight: 16,
  },
  // Buttons
  button: {
    fontSize: 16,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
  buttonLarge: {
    fontSize: 18,
    fontWeight: "600" as const,
    letterSpacing: 0.5,
  },
};

// --- Shadows ---
export const shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: "#4e9eff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
};

// --- Animations ---
export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

// --- Icon Directions (For RTL) ---
export const icons = {
  chevron: isRTL ? "chevron-forward" : "chevron-back",
  // תוכל להוסיף פה עוד אייקונים תלויי RTL
};

// --- Component Styles (Centralized) ---
export const components = {
  // Card (Main)
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.medium,
  },
  exerciseCard: {
    flexDirection: isRTL ? "row-reverse" : "row",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.medium,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    ...shadows.medium,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.cardBorder,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  actionButton: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center" as const,
    backgroundColor: colors.card,
    paddingStart: spacing.md,
    paddingEnd: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    // gap: 8 (gap עדיין לא מומלץ)
  },
  badge: {
    backgroundColor: colors.userCounterBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  input: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: radius.lg,
    paddingStart: spacing.md,
    paddingEnd: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    color: colors.text,
    fontSize: 16,
    textAlign: isRTL ? "right" : "left",
    writingDirection: isRTL ? "rtl" : "ltr",
    height: 56,
    ...shadows.small,
  },
  modalContainer: {
    backgroundColor: colors.card,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    ...shadows.large,
  },
  screenHeader: {
    paddingStart: spacing.xl,
    paddingEnd: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.md,
    flexDirection: isRTL ? "row-reverse" : "row",
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  listContent: {
    paddingStart: spacing.xl,
    paddingEnd: spacing.xl,
    paddingBottom: spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    padding: spacing.xxl,
  },
  rtlText: {
    textAlign: "right" as const,
    writingDirection: "rtl" as const,
  },
  gradientButton: {
    paddingStart: spacing.xl,
    paddingEnd: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexDirection: isRTL ? "row-reverse" : "row",
    // gap: 10,
  },
};

// --- Theme Object ---
export const theme = {
  isRTL,
  colors,
  radius,
  spacing,
  typography,
  shadows,
  animations,
  components,
  icons, // for chevrons etc.
};

export default theme;
