/**
 * @file src/styles/theme.ts
 * @brief ערכת נושא מרכזית של האפליקציה עם תמיכה מלאה ב-RTL
 * @dependencies React Native, Dimensions
 * @notes כולל צבעים, רווחים, טיפוגרפיה, צללים ורכיבים מוכנים
 * @recurring_errors אין להשתמש בערכים קשיחים - הכל דרך theme בלבד
 */

import { Dimensions, Platform } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// --- Locale Configuration ---
export const isRTL = true;

// --- Colors ---
export const colors = {
  // Primary Colors
  primary: "#4e9eff",
  primaryDark: "#3a7bc8",
  primaryLight: "#a8d0ff",
  secondary: "#00d9ff",
  secondaryDark: "#00b8d4",
  secondaryLight: "#6effff",
  accent: "#ff6b6b",
  accentDark: "#d84848",
  accentLight: "#ff9999",

  // Background Colors
  background: "#0a0a0a",
  backgroundAlt: "#1a1a1a",
  backgroundElevated: "#2a2a2a",

  // Card & Surface Colors
  card: "#161616",
  cardBorder: "#2a2a2a",
  surface: "#1e1e1e",
  surfaceVariant: "#252525",

  // Text Colors
  text: "#ffffff",
  textSecondary: "#9a9a9a",
  textTertiary: "#6a6a6a",
  textInverse: "#000000",

  // Status Colors
  success: "#4ade80",
  warning: "#fbbf24",
  error: "#ef4444",
  info: "#3b82f6",

  // UI Colors
  border: "#3a3a3a",
  divider: "#2a2a2a",
  overlay: "rgba(0, 0, 0, 0.8)",
  ripple: "rgba(78, 158, 255, 0.2)",

  // Special Colors
  white: "#ffffff",
  black: "#000000",
  transparent: "transparent",
  userCounterBg: "#3a3a3a",
  workoutCardStart: "#2d5a7a",
  workoutCardEnd: "#1a3a5a",

  // Gradient Colors
  primaryGradientStart: "#4e9eff",
  primaryGradientEnd: "#3a7bc8",
  secondaryGradientStart: "#00d9ff",
  secondaryGradientEnd: "#00b8d4",
  accentGradientStart: "#ff6b6b",
  accentGradientEnd: "#d84848",
};

// --- Border Radius ---
export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 50,
  round: 999,
};

// --- Spacing ---
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

// --- Typography ---
export const typography = {
  // Headers (h1-h6 style)
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
    letterSpacing: -0.2,
    lineHeight: 30,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600" as const,
    letterSpacing: -0.1,
    lineHeight: 26,
  },
  h5: {
    fontSize: 18,
    fontWeight: "600" as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  h6: {
    fontSize: 16,
    fontWeight: "600" as const,
    letterSpacing: 0,
    lineHeight: 22,
  },

  // Named sizes (aliases)
  largeTitle: {
    fontSize: 32,
    fontWeight: "700" as const,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  title1: {
    fontSize: 28,
    fontWeight: "700" as const,
    letterSpacing: -0.3,
    lineHeight: 34,
  },
  title2: {
    fontSize: 24,
    fontWeight: "600" as const,
    letterSpacing: -0.2,
    lineHeight: 30,
  },
  title3: {
    fontSize: 20,
    fontWeight: "600" as const,
    letterSpacing: -0.1,
    lineHeight: 26,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600" as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    fontWeight: "400" as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: "400" as const,
    letterSpacing: 0.1,
    lineHeight: 16,
  },
  caption: {
    fontSize: 10,
    fontWeight: "400" as const,
    letterSpacing: 0.2,
    lineHeight: 14,
  },
  captionSmall: {
    fontSize: 9,
    fontWeight: "400" as const,
    letterSpacing: 0.3,
    lineHeight: 12,
  },
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
  buttonSmall: {
    fontSize: 14,
    fontWeight: "600" as const,
    letterSpacing: 0.3,
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
  arrow: isRTL ? "arrow-forward" : "arrow-back",
  arrowDropdown: isRTL ? "caret-down" : "caret-down",
  menu: isRTL ? "menu" : "menu",
};

// --- Component Styles (Centralized) ---
export const components = {
  // קומפוננטות קיימות
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
    paddingTop: Platform.OS === "ios" ? 60 : 50,
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
  },

  // קומפוננטות חדשות
  floatingButton: {
    position: "absolute" as const,
    bottom: spacing.xl,
    right: isRTL ? undefined : spacing.xl,
    left: isRTL ? spacing.xl : undefined,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    ...shadows.large,
  },

  backButton: {
    position: "absolute" as const,
    top: Platform.OS === "ios" ? 50 : 40,
    left: isRTL ? spacing.md : undefined,
    right: isRTL ? undefined : spacing.md,
    backgroundColor: colors.card + "CC",
    borderRadius: 24,
    width: 42,
    height: 42,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    ...shadows.medium,
    zIndex: 99,
  },

  chipButton: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center" as const,
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },

  chipButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.cardBorder,
    borderTopWidth: 1,
    paddingBottom: Platform.OS === "ios" ? 20 : 8,
    paddingTop: 8,
    height: Platform.OS === "ios" ? 80 : 65,
  },

  listItem: {
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center" as const,
    backgroundColor: colors.card,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  sectionHeader: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },

  toast: {
    position: "absolute" as const,
    bottom: 100,
    left: spacing.xl,
    right: spacing.xl,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: isRTL ? "row-reverse" : "row",
    alignItems: "center" as const,
    ...shadows.large,
  },

  progressBar: {
    height: 8,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 4,
    overflow: "hidden" as const,
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
};

// --- Layout Helpers ---
export const layout = {
  screenPadding: spacing.xl,
  screenWidth: screenWidth,
  screenHeight: screenHeight,
  isSmallDevice: screenWidth < 375,
  isMediumDevice: screenWidth >= 375 && screenWidth < 768,
  isLargeDevice: screenWidth >= 768,
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
  icons,
  layout,
};

export default theme;
