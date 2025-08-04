/**
 * @file src/utils/workoutHelpers.ts
 * @description פונקציות עזר לאימון - ריכוז לוגיקה חוזרת
 * English: Workout helper functions - centralized common logic
 *
 * @features
 * - ✅ Enhanced time formatting utilities (MM:SS and HH:MM:SS)
 * - ✅ Cross-platform vibration handling with patterns
 * - ✅ Standardized animation configurations
 * - ✅ Shared button styles
 * - ✅ Gender and date utilities moved from HistoryScreen
 *
 * @usage
 * import { formatTime, formatTimeExtended, triggerVibration, animationConfig } from '@/utils/workoutHelpers'
 *
 * @dependencies
 * - react-native: Platform, Vibration
 *
 * @performance
 * - Lightweight pure functions
 * - Immutable configuration objects
 * - Platform-optimized vibration
 * - Consolidated duplicate code from multiple components
 *
 * @created 2025-08-02 - Initial implementation for code deduplication
 * @updated 2025-08-04 - Enhanced with advanced formatting and vibration patterns
 */

import { Platform, Vibration } from "react-native";

/**
 * פורמט זמן מתוך שניות לפורמט MM:SS (פשוט)
 * Format time from seconds to MM:SS format (simple)
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * פורמט זמן מתוך שניות לפורמט HH:MM:SS (מתקדם)
 * Format time from seconds to HH:MM:SS format (advanced)
 */
export const formatTimeExtended = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

/**
 * דפוסי רטט סטנדרטיים
 * Standard vibration patterns
 */
export const vibrationPatterns = {
  // רטט קצר - פעולות רגילות
  short: 50,
  // רטט בינוני - אישורים
  medium: 100,
  // רטט ארוך - התראות חשובות
  long: 200,
  // רטט כפול - סיום טיימר
  double: [0, 200, 100, 200] as number[],
  // רטט ספירה לאחור - שניות אחרונות
  countdown: [0, 100, 50, 100] as number[],
  // רטט שיא אישי - הישג
  personalRecord: [0, 100, 50, 100, 50, 300] as number[],
  // רטט התחלה - תחילת טיימר
  start: [0, 300, 100, 100] as number[],
} as const;

/**
 * הפעלת רטט עם בדיקה לפלטפורמה ותמיכה בדפוסים
 * Trigger vibration with platform check and pattern support
 */
export const triggerVibration = (
  pattern: number | number[] | keyof typeof vibrationPatterns = "short"
): void => {
  if (Platform.OS === "web") return;

  try {
    if (typeof pattern === "string") {
      // שימוש בדפוס מוגדר מראש
      const vibrationPattern = vibrationPatterns[pattern];
      if (Array.isArray(vibrationPattern)) {
        Vibration.vibrate(vibrationPattern);
      } else {
        Vibration.vibrate(vibrationPattern);
      }
    } else if (Array.isArray(pattern)) {
      // דפוס מותאם אישית
      Vibration.vibrate(pattern);
    } else {
      // משך זמן פשוט
      Vibration.vibrate(pattern);
    }
  } catch (error) {
    console.warn("Vibration not supported or failed:", error);
  }
};

/**
 * פרמטרי אנימציה סטנדרטיים מורחבים
 * Extended standard animation parameters
 */
export const animationConfig = {
  // אנימציית קפיץ בסיסית
  spring: {
    friction: 10,
    tension: 40,
    useNativeDriver: true,
  },
  // אנימציית קפיץ מהירה
  springFast: {
    friction: 8,
    tension: 50,
    useNativeDriver: true,
  },
  // אנימציית קפיץ איטית
  springSlow: {
    friction: 12,
    tension: 30,
    useNativeDriver: true,
  },
  // אנימציית זמן בסיסית
  timing: {
    duration: 200,
    useNativeDriver: true,
  },
  // אנימציית זמן מהירה
  timingFast: {
    duration: 150,
    useNativeDriver: true,
  },
  // אנימציית זמן איטית
  timingSlow: {
    duration: 300,
    useNativeDriver: true,
  },
  // אנימציית דופק
  pulse: {
    toValue: 1.05,
    duration: 1000,
    useNativeDriver: true,
  },
  // אנימציית דופק מהירה
  pulseFast: {
    toValue: 1.03,
    duration: 500,
    useNativeDriver: true,
  },
  // אנימציית מעבר (fade)
  fade: {
    duration: 250,
    useNativeDriver: true,
  },
  // אנימציית סקייל
  scale: {
    duration: 200,
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
 * פורמט תאריך לעברית
 * Format date for Hebrew locale
 */
export const formatDateHebrew = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("he-IL", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

/**
 * המרת ציון קושי לכוכבים
 * Convert difficulty rating to stars
 */
export const getDifficultyStars = (difficulty: number): string => {
  return "⭐".repeat(Math.max(1, Math.min(5, difficulty)));
};

/**
 * המרת רגש לאמוג'י
 * Convert feeling to emoji
 */
export const getFeelingEmoji = (feeling: string): string => {
  const emojiMap: { [key: string]: string } = {
    challenging: "😤",
    strong: "💪",
    enjoyable: "😊",
    easy: "😴",
    excellent: "🔥",
    good: "👍",
    okay: "😐",
    tired: "😴",
    energetic: "⚡",
  };
  return emojiMap[feeling] || feeling || "😐";
};

/**
 * אייקון מגדר
 * Gender icon mapping
 */
export const getGenderIcon = (gender?: "male" | "female" | "other") => {
  switch (gender) {
    case "male":
      return "gender-male" as const;
    case "female":
      return "gender-female" as const;
    default:
      return "account" as const;
  }
};

/**
 * חילוץ מגדר משתמש
 * Extract user gender from questionnaire data
 */
export const getUserGender = (user?: any): "male" | "female" | "other" => {
  if (!user) return "other";

  // בדיקה של מגדר מתוך smartQuestionnaireData (חדש) או questionnaire רגיל (ישן)
  const smartData = user?.smartQuestionnaireData;
  const regularData = user?.questionnaire;

  if (smartData?.answers?.gender) {
    return smartData.answers.gender;
  }

  // לשאלון הישן - מגדר בדרך כלל נמצא בשאלה 1
  if (regularData && regularData[1]) {
    const genderAnswer = regularData[1] as string;
    if (
      genderAnswer === "male" ||
      genderAnswer === "female" ||
      genderAnswer === "other"
    ) {
      return genderAnswer;
    }
  }

  return "other";
};

/**
 * סגנונות כפתורים משותפים מורחבים
 * Extended shared button styles
 */
export const sharedButtonStyles = {
  // כפתור דילוג
  skipButton: {
    borderRadius: 24,
    overflow: "hidden" as const,
    borderWidth: 2,
  },
  // כפתור זמן
  timeButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  // כפתור קומפקטי
  compactButton: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
  },
  // כפתור צף
  floatingButton: {
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 0,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  // כפתור פעולה ראשי
  primaryAction: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 0,
  },
} as const;

/**
 * פונקציות עזר לחישובי אימון
 * Workout calculation helper functions
 */

/**
 * חישוב אחוז השלמה
 * Calculate completion percentage
 */
export const calculateCompletionPercentage = (
  completed: number,
  total: number
): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * חישוב נפח כולל (משקל × חזרות × סטים)
 * Calculate total volume (weight × reps × sets)
 */
export const calculateTotalVolume = (
  weight: number,
  reps: number,
  sets: number
): number => {
  return weight * reps * sets;
};

/**
 * חישוב ציון יעילות אימון (1-10)
 * Calculate workout efficiency score (1-10)
 */
export const calculateWorkoutEfficiency = (
  completedSets: number,
  plannedSets: number,
  duration: number,
  plannedDuration: number
): number => {
  const completionRate = completedSets / plannedSets;
  const timeEfficiency = plannedDuration / duration;
  const efficiency = (completionRate * 0.7 + timeEfficiency * 0.3) * 10;
  return Math.round(Math.max(1, Math.min(10, efficiency)));
};
