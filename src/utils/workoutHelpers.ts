/**
 * @file src/utils/workoutHelpers.ts
 * @description פונקציות עזר לאימון - ריכוז לוגיקה חוזרת
 * English: Workout helper functions - centralized common logic
 *
 * @features
 * - ✅ Time formatting utilities
 * - ✅ Cross-platform vibration handling
 * - ✅ Standardized animation configurations
 * - ✅ Shared button styles
 *
 * @usage
 * import { formatTime, triggerVibration, animationConfig } from '@/utils/workoutHelpers'
 *
 * @dependencies
 * - react-native: Platform, Vibration
 *
 * @performance
 * - Lightweight pure functions
 * - Immutable configuration objects
 * - Platform-optimized vibration
 *
 * @created 2025-08-02 - Initial implementation for code deduplication
 */

import { Platform, Vibration } from "react-native";

/**
 * פורמט זמן מתוך שניות לפורמט MM:SS
 * Format time from seconds to MM:SS format
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * הפעלת רטט עם בדיקה לפלטפורמה
 * Trigger vibration with platform check
 */
export const triggerVibration = (duration: number = 50): void => {
  if (Platform.OS !== "web") {
    Vibration.vibrate(duration);
  }
};

/**
 * פרמטרי אנימציה סטנדרטיים
 * Standard animation parameters
 */
export const animationConfig = {
  spring: {
    friction: 10,
    tension: 40,
    useNativeDriver: true,
  },
  timing: {
    duration: 200,
    useNativeDriver: true,
  },
  pulse: {
    toValue: 1.05,
    duration: 1000,
    useNativeDriver: true,
  },
} as const;

/**
 * פורמט משך זמן מדקות לפורמט קריא
 * Format duration from minutes to readable format
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours} שעות ו-${mins} דקות`;
  }
  return `${mins} דקות`;
};

/**
 * פורמט נפח במספרים גדולים עם פסיקים
 * Format volume with thousand separators
 */
export const formatVolume = (volume: number): string => {
  return volume.toLocaleString();
};

/**
 * חישוב שעות מדקות
 * Calculate hours from minutes
 */
export const minutesToHours = (minutes: number): number => {
  return Math.floor(minutes / 60);
};

/**
 * סגנונות כפתורים משותפים
 * Shared button styles
 */
export const sharedButtonStyles = {
  skipButton: {
    borderRadius: 24,
    overflow: "hidden" as const,
    borderWidth: 2,
  },
  timeButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
} as const;
