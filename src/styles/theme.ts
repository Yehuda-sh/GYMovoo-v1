/**
 * @file src/styles/theme.ts
 * @description ערכת נושא מרכזית של האפליקציה עם תמיכה מלאה ב-RTL והתאמת מגדר
 * English: Central theme system with full RTL support and gender adaptation
 *
 * @features
 * - מערכת עיצוב מקיפה: צבעים, רווחים, טיפוגרפיה, צללים
 * - תמיכה מלאה ב-RTL עם helpers מתקדמים
 * - רכיבים מוכנים עם סגנונות מרכזיים
 * - התאמת מגדר למשתמשים שונים
 * - מערכת animation ו-layout מתקדמת
 *
 * @dependencies React Native Dimensions, Platform, rtlHelpers
 * @usage Used throughout the entire application for consistent design
 * @updated 2025-08-17 ניקוי כפילויות ושיפור ארגון
 */

import { Dimensions, Platform } from "react-native";
import type { ViewStyle, Insets } from "react-native";
// ייבוא isRTL מהמקום המרכזי | Import isRTL from central location
import { isRTL } from "../utils/rtlHelpers";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

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
  shadow: "#000000",

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

  // Questionnaire & Gender Adaptation Colors - CLEANED
  // קבצי שאלון חכם ישן - נוקה (רק הצבעים החיוניים נשארו)
  genderMale: "#3b82f6",
  genderFemale: "#ec4899",
  genderNeutral: "#8b5cf6",

  // Gradient Colors
  primaryGradientStart: "#4e9eff",
  primaryGradientEnd: "#3a7bc8",
  secondaryGradientStart: "#00d9ff",
  secondaryGradientEnd: "#00b8d4",
  accentGradientStart: "#ff6b6b",
  accentGradientEnd: "#d84848",

  // Smart Questionnaire Gradients - CLEANED (only gender gradients remain)
  genderGradientMale: ["#3b82f6", "#1d4ed8"],
  genderGradientFemale: ["#ec4899", "#be185d"],
  genderGradientNeutral: ["#8b5cf6", "#7c3aed"],
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

// --- Z-Index Levels (Centralized) ---
export const zIndex = {
  base: 1,
  header: 100,
  dropdown: 1300,
  overlay: 1200,
  floatingButton: 1000,
  toast: 1500,
  modal: 2000,
} as const;

// --- Touch & Accessibility Helpers ---
export const touch = {
  minTarget: 44,
  hitSlop: {
    small: { top: 8, right: 8, bottom: 8, left: 8 } as Insets,
    medium: { top: 12, right: 12, bottom: 12, left: 12 } as Insets,
    large: { top: 16, right: 16, bottom: 16, left: 16 } as Insets,
  },
} as const;

export const a11y = {
  minTouchTarget: 44,
} as const;

// --- Generic RTL Helpers ---
export const rtl = {
  // מחזיר ערך על בסיס כיוון
  // Returns a value based on RTL direction
  switch: <T>(rtlValue: T, ltrValue: T): T => (isRTL ? rtlValue : ltrValue),
  // מחזיר style של קצה (left/right) לפי כיוון
  edge: (value: number = spacing.lg) => ({
    left: isRTL ? undefined : value,
    right: isRTL ? value : undefined,
  }),
} as const;

// --- Color Utils ---
export const getContrastTextColor = (bg: string): string => {
  // תמיכה בסיסית ב-#RRGGBB
  const hex =
    bg.startsWith("#") && (bg.length === 7 || bg.length === 4)
      ? bg
      : colors.card;
  const parse = (h: string) => {
    if (h.length === 4) {
      const r = parseInt(h[1] + h[1], 16);
      const g = parseInt(h[2] + h[2], 16);
      const b = parseInt(h[3] + h[3], 16);
      return { r, g, b };
    }
    const r = parseInt(h.slice(1, 3), 16);
    const g = parseInt(h.slice(3, 5), 16);
    const b = parseInt(h.slice(5, 7), 16);
    return { r, g, b };
  };
  const { r, g, b } = parse(hex);
  // luminance יחסית
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? colors.textInverse : colors.text;
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

  // Legacy Smart Questionnaire Components - REMOVED 2025-08-17
  // רכיבי שאלון חכם ישנים - הוסרו לטובת מערכת אחודה
  // These components moved to unified questionnaire system

  selectionIndicator: {
    position: "absolute" as const,
    right: 16,
    top: "50%",
    transform: [{ translateY: -12 }],
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

  // RTL-Enhanced Input
  rtlInput: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: radius.lg,
    paddingRight: spacing.md, // Specific for RTL
    paddingLeft: spacing.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    color: colors.text,
    fontSize: 16,
    textAlign: "right" as const,
    writingDirection: "rtl" as const,
    width: "100%",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  modalOverlayBottom: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end" as const,
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    maxHeight: "80%",
    ...shadows.large,
  },
  modalHeader: {
    flexDirection: isRTL ? "row-reverse" : "row",
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: spacing.lg,
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
  rtlText: {
    textAlign: "right" as const,
    writingDirection: "rtl" as const,
  },

  // Enhanced RTL Text Variants
  rtlTextTitle: {
    textAlign: "right" as const,
    writingDirection: "rtl" as const,
    width: "100%",
    ...typography.title2,
    color: colors.text,
  },

  rtlTextBody: {
    textAlign: "right" as const,
    writingDirection: "rtl" as const,
    width: "100%",
    ...typography.body,
    color: colors.textSecondary,
  },

  rtlTextCaption: {
    textAlign: "right" as const,
    writingDirection: "rtl" as const,
    width: "100%",
    ...typography.caption,
    color: colors.textTertiary,
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

  // כפתור צף ראשי - Enhanced floating button
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
    zIndex: zIndex.floatingButton,
  },

  // גדלים שונים לכפתור צף - Floating button sizes
  floatingButtonSizes: {
    small: {
      width: 40,
      height: 40,
      borderRadius: 20,
      button: 40,
      icon: 18,
    },
    medium: {
      width: 56,
      height: 56,
      borderRadius: 28,
      button: 56,
      icon: 24,
    },
    large: {
      width: 72,
      height: 72,
      borderRadius: 36,
      button: 72,
      icon: 32,
    },
    workout: {
      width: 64,
      height: 64,
      borderRadius: 32,
      button: 64,
      icon: 28,
    },
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

  // ✨ עוזרי כפתור חזרה מאוחדים - Unified back button helpers
  getBackButtonStyle: ({
    absolute = true,
    variant = "default",
    customStyle,
  }: {
    absolute?: boolean;
    variant?: "default" | "minimal" | "large";
    customStyle?: ViewStyle; // Proper ViewStyle type
  }) => {
    const baseStyle = {
      backgroundColor: colors.card + "CC",
      borderRadius: 24,
      width: 42,
      height: 42,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      ...shadows.medium,
      zIndex: 99,
    };

    const variantStyles = {
      minimal: {
        backgroundColor: "transparent",
        width: 36,
        height: 36,
        shadowOpacity: 0,
        elevation: 0,
      },
      large: {
        width: 48,
        height: 48,
        borderRadius: 28,
      },
      default: {},
    };

    const absoluteStyle = absolute
      ? {
          position: "absolute" as const,
          top: Platform.OS === "ios" ? 50 : 40,
          left: isRTL ? spacing.md : undefined,
          right: isRTL ? undefined : spacing.md,
        }
      : {};

    return [baseStyle, variantStyles[variant], absoluteStyle, customStyle];
  },

  getBackButtonIconSize: (
    variant: "default" | "minimal" | "large" = "default",
    customSize?: number
  ) => {
    const defaultSize = customSize || 24;
    switch (variant) {
      case "large":
        return defaultSize + 4;
      case "minimal":
        return defaultSize - 2;
      default:
        return defaultSize;
    }
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
};

/**
 * 👤 Avatar Helpers - עוזרי אווטאר מאוחדים
 */
const getAvatarStyle = (
  size: number,
  backgroundColor?: string,
  borderColor?: string
) => ({
  width: size,
  height: size,
  borderRadius: size / 2,
  backgroundColor: backgroundColor || colors.backgroundAlt,
  borderWidth: 2,
  borderColor: borderColor || colors.accent,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  overflow: "hidden" as const,
  ...shadows.small,
});

// --- Layout Helpers ---
export const layout = {
  screenPadding: spacing.xl,
  screenWidth: screenWidth,
  screenHeight: screenHeight,
  isSmallDevice: screenWidth < 375,
  isMediumDevice: screenWidth >= 375 && screenWidth < 768,
  isLargeDevice: screenWidth >= 768,
};

// --- Gender-Adaptive Theme Helpers ---
export const genderHelpers = {
  /**
   * קבלת צבע לפי מגדר
   * Get color by gender
   */
  getGenderColor: (gender: "male" | "female" | "other") => {
    switch (gender) {
      case "male":
        return colors.genderMale;
      case "female":
        return colors.genderFemale;
      default:
        return colors.genderNeutral;
    }
  },

  /**
   * קבלת גרדיאנט לפי מגדר
   * Get gradient by gender
   */
  getGenderGradient: (gender: "male" | "female" | "other") => {
    switch (gender) {
      case "male":
        return colors.genderGradientMale;
      case "female":
        return colors.genderGradientFemale;
      default:
        return colors.genderGradientNeutral;
    }
  },

  /**
   * קבלת סגנון כפתור מגדר - צור ידנית עם צבעי מגדר
   * Get gender button style - create manually with gender colors
   */
  getGenderButtonStyle: (
    gender: "male" | "female" | "other",
    isSelected: boolean = false
  ) => {
    const baseStyle = {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderRadius: radius.lg,
      alignItems: "center" as const,
      justifyContent: "center" as const,
      minWidth: 100,
      borderWidth: 2,
      borderColor: colors.border,
    };

    if (!isSelected) return baseStyle;

    const genderColor = genderHelpers.getGenderColor(gender);
    return {
      ...baseStyle,
      backgroundColor: genderColor,
      borderColor: genderColor,
    };
  },
};

// --- RTL Theme Helpers ---
export const rtlHelpers = {
  /**
   * קבלת סגנון RTL מלא לטקסט
   * Get full RTL text style
   */
  getFullRTLTextStyle: (variant: "title" | "body" | "caption" = "body") => {
    switch (variant) {
      case "title":
        return components.rtlTextTitle;
      case "caption":
        return components.rtlTextCaption;
      default:
        return components.rtlTextBody;
    }
  },

  /**
   * קבלת סגנון קונטיינר RTL
   * Get RTL container style
   */
  getRTLContainerStyle: (
    options: {
      alignItems?: "flex-start" | "flex-end" | "center";
      paddingDirection?: "right" | "left";
      paddingValue?: number;
    } = {}
  ) => ({
    alignItems: options.alignItems || "flex-end",
    flexDirection: isRTL ? "row-reverse" : "row",
    ...(options.paddingDirection === "right"
      ? { paddingRight: options.paddingValue || spacing.md }
      : options.paddingDirection === "left"
        ? { paddingLeft: options.paddingValue || spacing.md }
        : {}),
  }),

  /**
   * קבלת סגנון אינדיקטור בחירה RTL
   * Get RTL selection indicator style
   */
  getSelectionIndicatorStyle: (isSelected: boolean = false) => ({
    ...components.selectionIndicator,
    opacity: isSelected ? 1 : 0,
  }),

  /**
   * קבלת סגנון input RTL מלא
   * Get full RTL input style
   */
  getRTLInputStyle: () => components.rtlInput,
};

// --- Smart Questionnaire Theme Helpers (Legacy - DEPRECATED 2025-08-17) ---
export const questionnaireHelpers = {
  /**
   * @deprecated Legacy - השתמש ב-components.card במקום זה
   * Use components.card instead
   */
  getOptionStyle: (isSelected: boolean = false) => {
    const baseStyle = {
      backgroundColor: colors.backgroundElevated,
      borderRadius: radius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: isRTL ? "row-reverse" : "row",
      alignItems: "center" as const,
      paddingRight: spacing.lg,
    };

    return isSelected
      ? {
          ...baseStyle,
          backgroundColor: colors.primary + "20",
          borderColor: colors.primary,
          borderWidth: 2,
        }
      : baseStyle;
  },

  /**
   * @deprecated Legacy - השתמש ב-theme.progressBar במקום זה
   * Use theme.progressBar instead
   */
  getProgressStyle: (progress: number) => ({
    container: {
      height: 4,
      backgroundColor: colors.backgroundElevated,
      borderRadius: 2,
      overflow: "hidden" as const,
      marginBottom: spacing.md,
    },
    fill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 2,
      width: `${Math.min(100, Math.max(0, progress))}%`,
    },
  }),

  /**
   * @deprecated Legacy - השתמש ב-components.floatingButton במקום זה
   * Use components.floatingButton instead - this method is deprecated
   */
  getFloatingButtonStyle: (
    options: {
      isVisible?: boolean;
      size?: "small" | "medium" | "large";
      color?: string;
      bottom?: number;
      withAnimation?: boolean;
    } = {}
  ) => {
    const {
      isVisible = true,
      size = "medium",
      color = colors.primary,
      bottom = spacing.xl,
      withAnimation = true,
    } = options;

    // Manual size config since we removed the components
    const sizeConfig = {
      small: { button: 48, icon: 20 },
      medium: { button: 56, icon: 24 },
      large: { button: 64, icon: 28 },
    }[size];

    return {
      container: {
        position: "absolute" as const,
        left: isRTL ? spacing.lg : undefined,
        right: isRTL ? undefined : spacing.lg,
        flexDirection: isRTL ? "row-reverse" : "row",
        alignItems: "center" as const,
        zIndex: 999,
        bottom,
        opacity: withAnimation ? (isVisible ? 1 : 0) : 1,
        transform: withAnimation ? [{ scale: isVisible ? 1 : 0.8 }] : [],
      },
      button: {
        justifyContent: "center" as const,
        alignItems: "center" as const,
        elevation: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4.5,
        overflow: "hidden" as const,
        backgroundColor: color,
        width: sizeConfig.button,
        height: sizeConfig.button,
        borderRadius: sizeConfig.button / 2,
      },
      iconSize: sizeConfig.icon,
      label: {
        backgroundColor: colors.card,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginLeft: isRTL ? 0 : 8,
        marginRight: isRTL ? 8 : 0,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        borderWidth: 1,
        borderColor: colors.cardBorder,
      },
      labelText: {
        fontSize: 12,
        fontWeight: "600" as const,
        color: colors.text,
      },
    };
  },

  /**
   * ✨ קונפיגורציית אנימציות כפתור צף - Floating button animation config
   */
  getFloatingButtonAnimationConfig: () => ({
    entry: {
      scale: { tension: 50, friction: 7 },
      rotate: { duration: 300 },
    },
    exit: {
      scale: { duration: 200 },
      rotate: { duration: 200 },
    },
    rotation: {
      inputRange: [0, 1] as [number, number],
      outputRange: ["0deg", "90deg"] as [string, string],
    },
  }),
};

/**
 * 🎭 Modal Helpers - עוזרי מודלים מאוחדים
 */
const getModalOverlayStyle = (position: "center" | "bottom" = "center") => ({
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent:
    position === "bottom" ? ("flex-end" as const) : ("center" as const),
  alignItems: position === "center" ? ("center" as const) : undefined,
});

const getModalContentStyle = (position: "center" | "bottom" = "center") => ({
  backgroundColor: colors.card,
  borderRadius: position === "bottom" ? 0 : radius.xl,
  borderTopLeftRadius: position === "bottom" ? radius.xl : radius.xl,
  borderTopRightRadius: position === "bottom" ? radius.xl : radius.xl,
  padding: spacing.xl,
  borderWidth: position === "center" ? 1 : 0,
  borderColor: position === "center" ? colors.cardBorder : "transparent",
  ...shadows.large,
});

const getModalHeaderStyle = () => ({
  flexDirection: (isRTL ? "row-reverse" : "row") as "row" | "row-reverse",
  justifyContent: "space-between" as const,
  alignItems: "center" as const,
  marginBottom: spacing.lg,
});

// --- Theme Object ---
export const theme = {
  isRTL,
  colors,
  radius,
  spacing,
  typography,
  shadows,
  animations,
  zIndex,
  touch,
  a11y,
  components,
  icons,
  layout,
  rtl,

  // Enhanced helpers for gender adaptation (questionnaire helpers are legacy)
  genderHelpers,
  rtlHelpers,
  questionnaireHelpers,

  // Modal helpers
  getModalOverlayStyle,
  getModalContentStyle,
  getModalHeaderStyle,

  // Avatar helpers
  getAvatarStyle,
  getContrastTextColor,

  // Utility styles (previously unused constants - now part of components)
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

export default theme;
