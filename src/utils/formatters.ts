/**
 * @file src/utils/formatters.ts
 * @brief פונקציות פורמט נפוצות למסך הראשי ואחרים
 * @brief Common formatting functions for MainScreen and others
 * @features פורמטי זמן, מספרים, תאריכים, אחוזים
 * @features Time, numbers, dates, percentages formatters
 *
 * @enhancements_2025-08-24
 * - ✅ Enhanced error handling עם fallback strategies
 * - ✅ Performance optimizations עם memoization למחרוזות תאריך
 * - ✅ Input validation מתקדם
 * - ✅ Accessibility support לקוראי מסך
 * - ✅ TypeScript strict typing
 * - ✅ Consistent error handling בכל הפונקציות
 * - ✅ Modern JavaScript patterns
 *
 * @version 1.1.0
 * @created 2025-08-06
 * @updated 2025-08-24 שיפורים מקיפים לפי תקני הפרויקט
 */

import { MAIN_SCREEN_TEXTS } from "../constants/mainScreenTexts";
import { getEquipmentHebrewName } from "./equipmentIconMapping";
import { logger } from "./logger";

// ===============================================
// � Performance Optimization Utils
// אוטילים לאופטימיזציה של ביצועים
// ===============================================

// Cache for date formatting to improve performance
const __dateFormatCache: Map<string, string> = new Map();
const __timeFormatCache: Map<string, string> = new Map();
const __relativeTimeCache: Map<string, { value: string; timestamp: number }> =
  new Map();

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 100;

// Clear cache when it gets too large
const clearCacheIfNeeded = (cache: Map<string, unknown>) => {
  if (cache.size > MAX_CACHE_SIZE) {
    cache.clear();
    logger.debug("Formatters", "Cache cleared due to size limit");
  }
};

// Enhanced input validation
const validateInput = <T>(
  value: T,
  validator: (val: T) => boolean,
  errorMessage: string
): boolean => {
  try {
    return validator(value);
  } catch (error) {
    logger.warn("Formatters", errorMessage, { value, error });
    return false;
  }
};

// ===============================================
// �📊 Number Formatters - פורמטי מספרים
// ===============================================

/**
 * Format large numbers with K/M suffix
 * פורמט מספרים גדולים עם סיומת K/M
 */
export const formatLargeNumber = (value: number): string => {
  try {
    // Enhanced input validation
    if (
      !validateInput(
        value,
        (v) => typeof v === "number" && !isNaN(v),
        "Invalid number input"
      )
    ) {
      logger.warn("Formatters", "Invalid input for formatLargeNumber", {
        value,
      });
      return "0";
    }

    if (value === 0) return "0";

    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }

    if (value >= 1000) {
      return `${Math.round(value / 1000)}K`;
    }

    return value.toString();
  } catch (error) {
    logger.error("Formatters", "Error in formatLargeNumber", { value, error });
    return "0";
  }
};

/**
 * Format percentage with proper display
 * פורמט אחוזים עם תצוגה נכונה
 */
export const formatPercentage = (
  value: number,
  decimals: number = 0
): string => {
  try {
    if (
      !validateInput(
        value,
        (v) => typeof v === "number" && !isNaN(v),
        "Invalid percentage value"
      )
    ) {
      return "0%";
    }

    if (
      !validateInput(
        decimals,
        (d) => typeof d === "number" && d >= 0 && d <= 10,
        "Invalid decimals value"
      )
    ) {
      decimals = 0;
    }

    const clampedValue = Math.min(100, Math.max(0, value));
    return `${clampedValue.toFixed(decimals)}%`;
  } catch (error) {
    logger.error("Formatters", "Error in formatPercentage", {
      value,
      decimals,
      error,
    });
    return "0%";
  }
};

/**
 * Format rating value
 * פורמט ערך דירוג
 */
export const formatRating = (rating: number): string => {
  try {
    if (
      !validateInput(
        rating,
        (r) => typeof r === "number" && !isNaN(r) && r >= 0 && r <= 5,
        "Invalid rating value"
      )
    ) {
      return "0.0";
    }

    if (rating === 0) return "0.0";
    return rating.toFixed(1);
  } catch (error) {
    logger.error("Formatters", "Error in formatRating", { rating, error });
    return "0.0";
  }
};

/**
 * Format workout count with proper pluralization
 * פורמט מספר אימונים עם רבים/יחיד נכון
 */
export const formatWorkoutCount = (count: number): string => {
  try {
    if (
      !validateInput(
        count,
        (c) => typeof c === "number" && !isNaN(c) && c >= 0,
        "Invalid workout count"
      )
    ) {
      return "0 אימונים";
    }

    if (count === 0) return "0 אימונים";
    if (count === 1) return "אימון אחד";
    if (count === 2) return "2 אימונים";
    return `${count} אימונים`;
  } catch (error) {
    logger.error("Formatters", "Error in formatWorkoutCount", { count, error });
    return "0 אימונים";
  }
};

/**
 * Format days count with proper pluralization
 * פורמט מספר ימים עם רבים/יחיד נכון
 */
export const formatDaysCount = (days: number): string => {
  try {
    if (
      !validateInput(
        days,
        (d) => typeof d === "number" && !isNaN(d) && d >= 0,
        "Invalid days count"
      )
    ) {
      return "0 ימים";
    }

    if (days === 0) return "0 ימים";
    if (days === 1) return "יום אחד";
    if (days === 2) return "יומיים";
    return `${days} ימים`;
  } catch (error) {
    logger.error("Formatters", "Error in formatDaysCount", { days, error });
    return "0 ימים";
  }
};

// ===============================================
// 📅 Date & Time Formatters - פורמטי תאריך וזמן
// ===============================================

/**
 * Format date to Hebrew locale with caching
 * פורמט תאריך לעברית עם caching
 */
export const formatDate = (date: string | Date): string => {
  try {
    const dateKey = typeof date === "string" ? date : date.toISOString();

    // Check cache first
    const cached = __dateFormatCache.get(dateKey);
    if (cached) {
      return cached;
    }

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (
      !validateInput(
        dateObj,
        (d) => d instanceof Date && !isNaN(d.getTime()),
        "Invalid date object"
      )
    ) {
      return "תאריך לא חוקי";
    }

    const formatted = dateObj.toLocaleDateString("he-IL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Cache the result
    clearCacheIfNeeded(__dateFormatCache);
    __dateFormatCache.set(dateKey, formatted);

    return formatted;
  } catch (error) {
    logger.error("Formatters", "Error in formatDate", { date, error });
    return "תאריך לא חוקי";
  }
};

/**
 * Format time to Hebrew locale with caching
 * פורמט שעה לעברית עם caching
 */
export const formatTime = (date: string | Date): string => {
  try {
    const dateKey = typeof date === "string" ? date : date.toISOString();

    // Check cache first
    const cached = __timeFormatCache.get(dateKey);
    if (cached) {
      return cached;
    }

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (
      !validateInput(
        dateObj,
        (d) => d instanceof Date && !isNaN(d.getTime()),
        "Invalid time object"
      )
    ) {
      return "שעה לא חוקית";
    }

    const formatted = dateObj.toLocaleTimeString("he-IL", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Cache the result
    clearCacheIfNeeded(__timeFormatCache);
    __timeFormatCache.set(dateKey, formatted);

    return formatted;
  } catch (error) {
    logger.error("Formatters", "Error in formatTime", { date, error });
    return "שעה לא חוקית";
  }
};

/**
 * Format relative time (e.g., "yesterday", "3 days ago") with smart caching
 * פורמט זמן יחסי (למשל "אתמול", "לפני 3 ימים") עם caching חכם
 */
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const dateKey = typeof date === "string" ? date : date.toISOString();
    const now = Date.now();

    // Check cache with TTL validation (relative time changes over time)
    const cached = __relativeTimeCache.get(dateKey);
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return cached.value;
    }

    const dateObj = typeof date === "string" ? new Date(date) : date;

    if (
      !validateInput(
        dateObj,
        (d) => d instanceof Date && !isNaN(d.getTime()),
        "Invalid date for relative time"
      )
    ) {
      return "תאריך לא חוקי";
    }

    const diffInMs = now - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    let result: string;
    if (diffInDays === 0) {
      result = "היום";
    } else if (diffInDays === 1) {
      result = "אתמול";
    } else if (diffInDays === 2) {
      result = "שלשום";
    } else if (diffInDays <= 7) {
      result = `לפני ${diffInDays} ימים`;
    } else if (diffInDays <= 30) {
      const weeks = Math.floor(diffInDays / 7);
      result = weeks === 1 ? "לפני שבוע" : `לפני ${weeks} שבועות`;
    } else {
      const months = Math.floor(diffInDays / 30);
      result = months === 1 ? "לפני חודש" : `לפני ${months} חודשים`;
    }

    // Cache with timestamp for TTL
    clearCacheIfNeeded(__relativeTimeCache);
    __relativeTimeCache.set(dateKey, { value: result, timestamp: now });

    return result;
  } catch (error) {
    logger.error("Formatters", "Error in formatRelativeTime", { date, error });
    return "תאריך לא חוקי";
  }
};

/**
 * Format duration in minutes to readable format
 * פורמט משך זמן בדקות לפורמט קריא
 */
export const formatDuration = (minutes: number): string => {
  try {
    if (
      !validateInput(
        minutes,
        (m) => typeof m === "number" && !isNaN(m) && m >= 0,
        "Invalid duration minutes"
      )
    ) {
      return "0 דקות";
    }

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
  } catch (error) {
    logger.error("Formatters", "Error in formatDuration", { minutes, error });
    return "0 דקות";
  }
};

// ===============================================
// 🏃‍♂️ Workout Formatters - פורמטי אימונים
// ===============================================

/**
 * Format workout date with duration and enhanced error handling
 * פורמט תאריך אימון עם משך זמן וטיפול שגיאות משופר
 */
export const formatWorkoutDate = (
  date: string | Date,
  duration?: number,
  startTime?: string
): string => {
  try {
    const relativeDate = formatRelativeTime(date);
    let result = relativeDate;

    // Add start time if available
    if (startTime) {
      try {
        const timeStr = formatTime(startTime);
        result += ` • ${timeStr}`;
      } catch (timeError) {
        logger.warn(
          "Formatters",
          "Error formatting start time in formatWorkoutDate",
          { startTime, timeError }
        );
      }
    }

    // Add duration if available
    if (
      duration &&
      validateInput(
        duration,
        (d) => typeof d === "number" && d > 0,
        "Invalid duration"
      )
    ) {
      result += ` • ${duration} דקות`;
    }

    return result;
  } catch (error) {
    logger.error("Formatters", "Error in formatWorkoutDate", {
      date,
      duration,
      startTime,
      error,
    });
    return "תאריך אימון לא זמין";
  }
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
 * Calculate and format weekly progress percentage with enhanced validation
 * חישוב ופורמט אחוז התקדמות שבועית עם וולידציה משופרת
 */
export const formatWeeklyProgress = (
  completedWorkouts: number,
  targetWorkouts: number
): { percentage: number; text: string } => {
  try {
    if (
      !validateInput(
        targetWorkouts,
        (t) => typeof t === "number" && t > 0,
        "Invalid target workouts"
      )
    ) {
      return { percentage: 0, text: "0%" };
    }

    if (
      !validateInput(
        completedWorkouts,
        (c) => typeof c === "number" && c >= 0,
        "Invalid completed workouts"
      )
    ) {
      return { percentage: 0, text: "0%" };
    }

    const percentage = Math.round((completedWorkouts / targetWorkouts) * 100);
    const clampedPercentage = Math.min(100, percentage);

    return {
      percentage: clampedPercentage,
      text: `${clampedPercentage}%`,
    };
  } catch (error) {
    logger.error("Formatters", "Error in formatWeeklyProgress", {
      completedWorkouts,
      targetWorkouts,
      error,
    });
    return { percentage: 0, text: "0%" };
  }
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
// ♿ Accessibility Support - תמיכה בנגישות
// ===============================================

/**
 * Get accessibility label for formatted numbers
 * קבלת תווית נגישות למספרים מפורמטים
 */
export const getNumberAccessibilityLabel = (
  value: number,
  context: string
): string => {
  try {
    const formattedNumber = formatLargeNumber(value);
    const valueText = value === 1 ? "ערך אחד" : `${value} ערכים`;
    return `${context}: ${formattedNumber}, ${valueText}`;
  } catch (error) {
    logger.error("Formatters", "Error in getNumberAccessibilityLabel", {
      value,
      context,
      error,
    });
    return `${context}: לא זמין`;
  }
};

/**
 * Get accessibility label for dates with context
 * קבלת תווית נגישות לתאריכים עם הקשר
 */
export const getDateAccessibilityLabel = (
  date: string | Date,
  context: string
): string => {
  try {
    const formattedDate = formatDate(date);
    const relativeTime = formatRelativeTime(date);
    return `${context}: ${formattedDate}, ${relativeTime}`;
  } catch (error) {
    logger.error("Formatters", "Error in getDateAccessibilityLabel", {
      date,
      context,
      error,
    });
    return `${context}: תאריך לא זמין`;
  }
};

/**
 * Get accessibility description for workout progress
 * קבלת תיאור נגישות להתקדמות אימון
 */
export const getWorkoutProgressAccessibilityText = (
  completed: number,
  target: number,
  percentage: number
): string => {
  try {
    const progressText = formatProgressRatio(completed, target);
    const percentageText = formatPercentage(percentage);

    let status = "";
    if (percentage >= 100) {
      status = "הושלם במלואו";
    } else if (percentage >= 75) {
      status = "קרוב להשלמה";
    } else if (percentage >= 50) {
      status = "באמצע הדרך";
    } else if (percentage > 0) {
      status = "התחיל";
    } else {
      status = "לא התחיל";
    }

    return `התקדמות אימונים: ${progressText}, ${percentageText}, סטטוס: ${status}`;
  } catch (error) {
    logger.error("Formatters", "Error in getWorkoutProgressAccessibilityText", {
      completed,
      target,
      percentage,
      error,
    });
    return "התקדמות אימונים: לא זמין";
  }
};

// ===============================================
// 🧹 Cache Management - ניהול Cache
// ===============================================

/**
 * Clear all formatting caches
 * ניקוי כל ה-caches של הפורמטים
 */
export const clearFormatterCaches = (): void => {
  try {
    __dateFormatCache.clear();
    __timeFormatCache.clear();
    __relativeTimeCache.clear();
    logger.debug("Formatters", "All formatter caches cleared");
  } catch (error) {
    logger.error("Formatters", "Error clearing formatter caches", error);
  }
};

/**
 * Get cache statistics for debugging
 * קבלת סטטיסטיקות cache לדיבוג
 */
export const getFormatterCacheStats = (): {
  dateCache: number;
  timeCache: number;
  relativeTimeCache: number;
  totalEntries: number;
} => {
  try {
    const stats = {
      dateCache: __dateFormatCache.size,
      timeCache: __timeFormatCache.size,
      relativeTimeCache: __relativeTimeCache.size,
      totalEntries:
        __dateFormatCache.size +
        __timeFormatCache.size +
        __relativeTimeCache.size,
    };

    logger.debug("Formatters", "Cache statistics retrieved", stats);
    return stats;
  } catch (error) {
    logger.error("Formatters", "Error getting cache statistics", error);
    return {
      dateCache: 0,
      timeCache: 0,
      relativeTimeCache: 0,
      totalEntries: 0,
    };
  }
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
    logger.warn("Formatters", "Formatting error", {
      error,
      formatter: formatter.name,
    });
    return fallback;
  }
};

/**
 * Format equipment list to readable string with enhanced error handling
 * פורמט רשימת ציוד למחרוזת קריאה עם שיפור טיפול בשגיאות
 */
export const formatEquipmentList = (equipment: string[]): string => {
  try {
    if (
      !validateInput(
        equipment,
        (eq) => Array.isArray(eq),
        "Invalid equipment array"
      )
    ) {
      return MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED;
    }

    if (!equipment || equipment.length === 0) {
      return MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED;
    }

    // מניעת כפילויות ושימוש בשמות עבריים אחודים מהמערכת
    const uniqueList = Array.from(new Set(equipment.filter(Boolean)));

    if (uniqueList.length === 0) {
      return MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED;
    }

    const hebrewNames = uniqueList
      .map((eq) => {
        try {
          return getEquipmentHebrewName(eq);
        } catch (error) {
          logger.warn("Formatters", "Error getting Hebrew equipment name", {
            equipment: eq,
            error,
          });
          return eq; // Fallback to original name
        }
      })
      .filter(Boolean);

    return hebrewNames.length > 0
      ? hebrewNames.join(", ")
      : MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED;
  } catch (error) {
    logger.error("Formatters", "Error in formatEquipmentList", {
      equipment,
      error,
    });
    return MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED;
  }
};

export default {
  // Core formatting functions
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

  // Accessibility functions
  getNumberAccessibilityLabel,
  getDateAccessibilityLabel,
  getWorkoutProgressAccessibilityText,

  // Cache management functions
  clearFormatterCaches,
  getFormatterCacheStats,
};
