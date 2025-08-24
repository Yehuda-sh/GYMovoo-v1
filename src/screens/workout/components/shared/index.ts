/**
 * @file src/screens/workout/components/shared/index.ts
 * @brief ייצוא רכיבים משותפים לרכיבי אימון
 * @version 1.4.0
 * @author GYMovoo Development Team
 * @created 2025-08-05
 * @updated 2025-08-24 Enhanced with additional shared components and utilities
 *
 * @description
 * קובץ מרכזי לייצוא כל הרכיבים המשותפים
 * מספק import נוח ומאוחד עם תמיכה ברכיבים מתקדמים
 */

// Core Components
export { CloseButton } from "./CloseButton";
export { SkipButton } from "./SkipButton";
export { StatItem } from "./StatItem";
export { TimeAdjustButton } from "./TimeAdjustButton";
export { TimerDisplay } from "./TimerDisplay";

// Enhanced Components (removed non-existent exports)
// Note: These components don't exist yet, removing placeholder exports

// Core Types
export type { StatItemProps } from "./StatItem";
export type { SkipButtonProps } from "./SkipButton";
export type { CloseButtonProps } from "./CloseButton";
export type { TimeAdjustButtonProps } from "./TimeAdjustButton";
export type { TimerDisplayProps } from "./TimerDisplay";

// Shared Constants and Utilities
export const SHARED_CONSTANTS = {
  ANIMATION_DURATIONS: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
  SPACING: {
    XS: 4,
    SM: 8,
    MD: 16,
    LG: 24,
    XL: 32,
  },
  SHADOWS: {
    LIGHT: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    MEDIUM: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    HEAVY: {
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
  },
} as const;
