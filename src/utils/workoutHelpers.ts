/**
 * @file src/utils/workoutHelpers.ts
 * @description יוטיליטיז מאופטמים לאימונים - זמן, רטט, ואנימציות
 */

import { Platform, Vibration } from "react-native";
import { logger } from "./logger";

// ===============================================
// ⏱️ Time Formatting - עיצוב זמן
// ===============================================

/**
 * פורמט זמן גמיש - MM:SS או HH:MM:SS
 */
export const formatWorkoutTime = (
  seconds: number,
  includeHours: boolean = false
): string => {
  if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
    return includeHours ? "00:00:00" : "00:00";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (includeHours || hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

/**
 * @deprecated שימוש ב-formatWorkoutTime(seconds, true) במקום
 */
export const formatWorkoutTimeExtended = (seconds: number): string => {
  return formatWorkoutTime(seconds, true);
};

// ===============================================
// 📳 Vibration Patterns - דפוסי רטט
// ===============================================

export const vibrationPatterns = {
  short: 50,
  medium: 100,
  long: 200,
  double: [0, 200, 100, 200],
  countdown: [0, 100, 50, 100],
  personalRecord: [0, 100, 50, 100, 50, 300],
  start: [0, 300, 100, 100],
  complete: [0, 200, 50, 200, 50, 300],
} as const;

/**
 * הפעלת רטט עם דפוס
 */
export const triggerVibration = (
  pattern: number | number[] | keyof typeof vibrationPatterns = "short"
): void => {
  if (Platform.OS === "web") return;

  try {
    const vibrationPattern =
      typeof pattern === "string" ? vibrationPatterns[pattern] : pattern;

    Vibration.vibrate(vibrationPattern as number | number[]);
  } catch (error) {
    logger.error(
      "triggerVibration",
      error instanceof Error ? error.message : String(error)
    );
  }
};

// ===============================================
// 🎬 Animation Configurations - הגדרות אנימציה
// ===============================================

export const animationConfig = {
  spring: { friction: 10, tension: 40, useNativeDriver: true },
  springFast: { friction: 8, tension: 50, useNativeDriver: true },
  timing: { duration: 200, useNativeDriver: true },
  timingFast: { duration: 150, useNativeDriver: true },
  fade: { duration: 250, useNativeDriver: true },
  pulse: { duration: 600, useNativeDriver: true },
  // הוספת אנימציות חדשות לאימונים
  setComplete: { duration: 300, useNativeDriver: true },
  exerciseTransition: { duration: 400, useNativeDriver: true },
} as const;

// ===============================================
// 📊 Data Formatting - עיצוב נתונים
// ===============================================

/**
 * עיצוב נפח עם מפרידי אלפים
 */
export const formatVolume = (volume: number): string => {
  if (typeof volume !== "number" || isNaN(volume)) return "0";
  return volume.toLocaleString("he-IL");
};

/**
 * המרת דקות לשעות ודקות
 */
export const formatMinutesToTime = (minutes: number): string => {
  if (typeof minutes !== "number" || isNaN(minutes) || minutes < 0)
    return "0 דק'";

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes} דק'`;
  if (remainingMinutes === 0) return `${hours} שע'`;
  return `${hours} שע' ${remainingMinutes} דק'`;
};

/**
 * המרת קושי לכוכבים
 */
export const getDifficultyStars = (difficulty: number): string => {
  if (typeof difficulty !== "number" || isNaN(difficulty)) return "⭐";
  const clampedDifficulty = Math.max(1, Math.min(5, Math.round(difficulty)));
  return "⭐".repeat(clampedDifficulty);
};

// ===============================================
// 😊 Workout Feedback - משוב לאימון
// ===============================================

const FEELING_EMOJIS = new Map([
  // English
  ["challenging", "😤"],
  ["strong", "💪"],
  ["enjoyable", "😊"],
  ["easy", "😴"],
  ["excellent", "🔥"],
  ["good", "👍"],
  ["okay", "😐"],
  ["tired", "😴"],
  ["energetic", "⚡"],
  // Hebrew
  ["מאתגר", "😤"],
  ["חזק", "💪"],
  ["מהנה", "😊"],
  ["קל", "😴"],
  ["מעולה", "🔥"],
  ["טוב", "👍"],
  ["בסדר", "😐"],
  ["עייף", "😴"],
  ["אנרגטי", "⚡"],
]);

/**
 * המרת תחושה לemoji
 */
export const getFeelingEmoji = (feeling: string): string => {
  if (!feeling || typeof feeling !== "string") return "😐";
  return FEELING_EMOJIS.get(feeling.toLowerCase().trim()) || "😐";
};

// ===============================================
// 🎯 Workout-Specific Utilities - עזרים ספציפיים לאימונים
// ===============================================

/**
 * חישוב אחוז התקדמות באימון
 */
export const calculateWorkoutProgress = (
  completedSets: number,
  totalSets: number
): number => {
  if (totalSets <= 0) return 0;
  return Math.min(100, Math.round((completedSets / totalSets) * 100));
};

/**
 * בדיקה אם אימון הושלם
 */
export const isWorkoutComplete = (
  completedSets: number,
  totalSets: number,
  threshold: number = 80
): boolean => {
  return calculateWorkoutProgress(completedSets, totalSets) >= threshold;
};

/**
 * חישוב זמן מנוחה מומלץ בהתבסס על אינטנסיביות
 */
export const getRecommendedRestTime = (
  intensity: "low" | "medium" | "high" = "medium"
): number => {
  const restTimes = { low: 30, medium: 60, high: 120 };
  return restTimes[intensity];
};

// ===============================================
// 🔧 Legacy Functions - פונקציות מורשת
// ===============================================

/**
 * @deprecated העבר לformatMinutesToTime לתוצאות טובות יותר
 */
export const minutesToHours = (minutes: number): number => {
  if (typeof minutes !== "number" || isNaN(minutes) || minutes < 0) return 0;
  return Math.floor(minutes / 60);
};

/**
 * @deprecated העבר לworkout-agnostic date utility
 */
export const formatDateHebrew = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "תאריך לא תקין";
    return date.toLocaleDateString("he-IL", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "תאריך לא תקין";
  }
};
