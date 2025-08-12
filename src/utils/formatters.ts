/**
 * @file src/utils/formatters.ts
 * @brief פונקציות פורמט נפוצות למסך הראשי ואחרים
 * @brief Common formatting functions for MainScreen and others
 * @features פורמטי זמן, מספרים, תאריכים, אחוזים
 * @features Time, numbers, dates, percentages formatters
 * @version 1.0.0
 * @created 2025-08-06
 */

import { MAIN_SCREEN_TEXTS } from "../constants/mainScreenTexts";
import { getEquipmentHebrewName } from "./equipmentIconMapping";

// ===============================================
// 📊 Number Formatters - פורמטי מספרים
// ===============================================

/**
 * Format large numbers with K/M suffix
 * פורמט מספרים גדולים עם סיומת K/M
 */
export const formatLargeNumber = (value: number): string => {
  if (value === 0) return "0";

  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${Math.round(value / 1000)}K`;
  }

  return value.toString();
};

/**
 * Format percentage with proper display
 * פורמט אחוזים עם תצוגה נכונה
 */
export const formatPercentage = (
  value: number,
  decimals: number = 0
): string => {
  const clampedValue = Math.min(100, Math.max(0, value));
  return `${clampedValue.toFixed(decimals)}%`;
};

/**
 * Format rating value
 * פורמט ערך דירוג
 */
export const formatRating = (rating: number): string => {
  if (rating === 0) return "0.0";
  return rating.toFixed(1);
};

/**
 * Format workout count with proper pluralization
 * פורמט מספר אימונים עם רבים/יחיד נכון
 */
export const formatWorkoutCount = (count: number): string => {
  if (count === 0) return "0 אימונים";
  if (count === 1) return "אימון אחד";
  if (count === 2) return "2 אימונים";
  return `${count} אימונים`;
};

/**
 * Format days count with proper pluralization
 * פורמט מספר ימים עם רבים/יחיד נכון
 */
export const formatDaysCount = (days: number): string => {
  if (days === 0) return "0 ימים";
  if (days === 1) return "יום אחד";
  if (days === 2) return "יומיים";
  return `${days} ימים`;
};

// ===============================================
// 📅 Date & Time Formatters - פורמטי תאריך וזמן
// ===============================================

/**
 * Format date to Hebrew locale
 * פורמט תאריך לעברית
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "תאריך לא חוקי";
  }

  return dateObj.toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format time to Hebrew locale
 * פורמט שעה לעברית
 */
export const formatTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "שעה לא חוקית";
  }

  return dateObj.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Format relative time (e.g., "yesterday", "3 days ago")
 * פורמט זמן יחסי (למשל "אתמול", "לפני 3 ימים")
 */
export const formatRelativeTime = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return "היום";
  } else if (diffInDays === 1) {
    return "אתמול";
  } else if (diffInDays === 2) {
    return "שלשום";
  } else if (diffInDays <= 7) {
    return `לפני ${diffInDays} ימים`;
  } else if (diffInDays <= 30) {
    const weeks = Math.floor(diffInDays / 7);
    return weeks === 1 ? "לפני שבוע" : `לפני ${weeks} שבועות`;
  } else {
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "לפני חודש" : `לפני ${months} חודשים`;
  }
};

/**
 * Format duration in minutes to readable format
 * פורמט משך זמן בדקות לפורמט קריא
 */
export const formatDuration = (minutes: number): string => {
  if (minutes === 0) return "0 דקות";
  if (minutes < 60) {
    return `${minutes} דקות`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return hours === 1 ? "שעה" : `${hours} שעות`;
  }

  const hoursText = hours === 1 ? "שעה" : `${hours} שעות`;
  const minutesText = `${remainingMinutes} דקות`;

  return `${hoursText} ו${minutesText}`;
};

// ===============================================
// 🏃‍♂️ Workout Formatters - פורמטי אימונים
// ===============================================

/**
 * Format workout date with duration
 * פורמט תאריך אימון עם משך זמן
 */
export const formatWorkoutDate = (
  date: string | Date,
  duration?: number,
  startTime?: string
): string => {
  const relativeDate = formatRelativeTime(date);
  let result = relativeDate;

  // Add start time if available
  if (startTime) {
    const timeStr = formatTime(startTime);
    result += ` • ${timeStr}`;
  }

  // Add duration if available
  if (duration) {
    result += ` • ${duration} דקות`;
  }

  return result;
};

/**
 * Get workout icon based on workout type or name
 * קבלת אייקון אימון לפי סוג או שם האימון
 */
export const getWorkoutIcon = (
  workoutType?: string,
  workoutName?: string
): string => {
  const name = workoutName?.toLowerCase() || "";
  const type = workoutType?.toLowerCase() || "";

  // Check by workout name
  if (name.includes("חזה") || name.includes("chest")) {
    return "dumbbell";
  }

  if (name.includes("רגל") || name.includes("leg") || type === "cardio") {
    return "run";
  }

  if (name.includes("גב") || name.includes("back")) {
    return "arm-flex";
  }

  if (name.includes("כתף") || name.includes("shoulder")) {
    return "weight-lifter";
  }

  // Check by workout type
  if (type === "strength") {
    return "dumbbell";
  }

  if (type === "cardio") {
    return "run";
  }

  // Default icon
  return "weight-lifter";
};

// ===============================================
// 📈 Progress Formatters - פורמטי התקדמות
// ===============================================

/**
 * Calculate and format weekly progress percentage
 * חישוב ופורמט אחוז התקדמות שבועית
 */
export const formatWeeklyProgress = (
  completedWorkouts: number,
  targetWorkouts: number
): { percentage: number; text: string } => {
  if (targetWorkouts === 0) {
    return { percentage: 0, text: "0%" };
  }

  const percentage = Math.round((completedWorkouts / targetWorkouts) * 100);
  const clampedPercentage = Math.min(100, percentage);

  return {
    percentage: clampedPercentage,
    text: `${clampedPercentage}%`,
  };
};

/**
 * Format progress ratio text (e.g., "2/3 workouts")
 * פורמט טקסט יחס התקדמות (למשל "2/3 אימונים")
 */
export const formatProgressRatio = (
  completed: number,
  target: number,
  unit: string = "אימונים"
): string => {
  return `${completed}/${target} ${unit}`;
};

// ===============================================
// 🎯 Fitness Level Formatters - פורמטי רמת כושר
// ===============================================

/**
 * Format fitness level to Hebrew
 * פורמט רמת כושר לעברית
 */
export const formatFitnessLevel = (level: string): string => {
  const levelMap: { [key: string]: string } = {
    beginner: MAIN_SCREEN_TEXTS.FITNESS_LEVELS.BEGINNER,
    intermediate: MAIN_SCREEN_TEXTS.FITNESS_LEVELS.INTERMEDIATE,
    advanced: MAIN_SCREEN_TEXTS.FITNESS_LEVELS.ADVANCED,
    expert: MAIN_SCREEN_TEXTS.FITNESS_LEVELS.EXPERT,
  };

  return (
    levelMap[level.toLowerCase()] || MAIN_SCREEN_TEXTS.FITNESS_LEVELS.BEGINNER
  );
};

// ===============================================
// 🔧 Utility Functions - פונקציות עזר
// ===============================================

/**
 * Safely format any value with fallback
 * פורמט בטוח של כל ערך עם fallback
 */
export const safeFormat = <T>(
  value: T,
  formatter: (val: T) => string,
  fallback: string = MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED
): string => {
  try {
    if (value === null || value === undefined) {
      return fallback;
    }
    return formatter(value);
  } catch (error) {
    console.warn("Formatting error:", error);
    return fallback;
  }
};

/**
 * Format equipment list to readable string
 * פורמט רשימת ציוד למחרוזת קריאה
 */
export const formatEquipmentList = (equipment: string[]): string => {
  if (!equipment || equipment.length === 0) {
    return MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED;
  }
  // מניעת כפילויות ושימוש בשמות עבריים אחודים מהמערכת
  const uniqueList = Array.from(new Set(equipment.filter(Boolean)));
  return uniqueList.map((eq) => getEquipmentHebrewName(eq)).join(", ");
};

export default {
  formatLargeNumber,
  formatPercentage,
  formatRating,
  formatWorkoutCount,
  formatDaysCount,
  formatDate,
  formatTime,
  formatRelativeTime,
  formatDuration,
  formatWorkoutDate,
  getWorkoutIcon,
  formatWeeklyProgress,
  formatProgressRatio,
  formatFitnessLevel,
  safeFormat,
  formatEquipmentList,
};
