/**
 * @file src/screens/history/utils/historyHelpers.ts
 * @brief פונקציות עזר מותאמות עבור מסך היסטוריית אימונים
 * @description מספק פונקציות utility לעיבוד נתונים, עיצוב תאריכים ותצוגה של נתוני אימונים
 * @version 2025.1
 * @author GYMovoo Development Team
 * @created 2025-01-XX
 * @updated 2025-08-17 החלפת console calls בלוגינג מותני, הוספת CONSTANTS למניעת כפילויות
 */

import {
  HISTORY_SCREEN_CONFIG,
  HISTORY_SCREEN_FORMATS,
} from "../../../constants/historyScreenConfig";
import { HISTORY_SCREEN_ICONS } from "../../../constants/historyScreenTexts";
import { logger } from "../../../utils/logger";

// ===============================================
// 🔧 Type Definitions - הגדרות טיפוסים
// ===============================================

/** @description טיפוס לבדיקת תקינות ערך */
type ValidationResult<T> = {
  isValid: boolean;
  value: T;
  error?: string;
};

/** @description טיפוס לנתוני feedback גולמיים */
interface RawWorkoutFeedback {
  completedAt?: string | number | Date;
  difficulty?: number;
  feeling?: string;
  congratulationMessage?: string;
}

/** @description טיפוס לנתוני stats גולמיים */
interface RawWorkoutStats {
  duration?: number;
  personalRecords?: number;
  totalSets?: number;
  totalPlannedSets?: number;
  totalVolume?: number;
}

/** @description טיפוס לנתוני workout גולמיים */
interface RawWorkoutInner {
  name?: string;
  exercises?: unknown[];
}

/** @description טיפוס לאימון גולמי לבדיקה */
interface RawWorkoutRecord {
  id?: string;
  feedback?: RawWorkoutFeedback;
  stats?: RawWorkoutStats;
  workout?: RawWorkoutInner;
  metadata?: {
    userGender?: string;
  };
}

/** @description טיפוס לתוצאת חישוב התקדמות */
interface ProgressCalculation {
  percentage: number;
  loaded: number;
  total: number;
  isValid: boolean;
}

// Debug logging system - שימוש בלוגר מרכזי
const dlog = (message: string, ...args: unknown[]) => {
  if (__DEV__) {
    logger.debug("HistoryHelpers", message, ...args);
  }
};

// ===============================================
// 🔧 Type Guards and Validation Helpers
// ===============================================

/** @description בודק אם ערך הוא תאריך תקין */
const isValidDate = (value: unknown): value is Date => {
  return value instanceof Date && !isNaN(value.getTime());
};

/** @description בודק אם ערך הוא מספר תקין */
const isValidNumber = (
  value: unknown,
  min: number = 0,
  max?: number
): boolean => {
  if (typeof value !== "number" || isNaN(value)) return false;
  if (value < min) return false;
  if (max !== undefined && value > max) return false;
  return true;
};

/** @description בודק אם מחרוזת תקינה */
const isValidString = (value: unknown): value is string => {
  return typeof value === "string" && value.trim().length > 0;
};

/** @description ממיר ערך לתאריך תקין עם fallback */
const safeDateConversion = (dateInput: unknown): Date => {
  try {
    if (isValidDate(dateInput as Date)) {
      return dateInput as Date;
    }

    if (typeof dateInput === "number") {
      const date = new Date(dateInput);
      if (isValidDate(date)) return date;
    }

    if (typeof dateInput === "string") {
      const date = new Date(dateInput);
      if (isValidDate(date)) return date;
    }

    dlog("Invalid date input, using current date", { dateInput });
    return new Date();
  } catch (error) {
    dlog("Error converting date", { error, dateInput });
    return new Date();
  }
};

/** @description מקבל ערך מספרי תקין עם fallback */
const safeNumberValue = (
  value: unknown,
  fallback: number,
  min: number = 0,
  max?: number
): number => {
  if (isValidNumber(value, min, max)) {
    return value as number;
  }
  dlog("Invalid number value, using fallback", { value, fallback });
  return fallback;
};

/** @description מקבל ערך מחרוזת תקין עם fallback */
const safeStringValue = (value: unknown, fallback: string): string => {
  if (isValidString(value)) {
    return (value as string).trim();
  }
  dlog("Invalid string value, using fallback", { value, fallback });
  return fallback;
};

// Constants to prevent duplications
const CONSTANTS = {
  TIME_INTERVALS: {
    MILLISECONDS_PER_DAY: 1000 * 60 * 60 * 24,
    DAYS_IN_WEEK: 7,
    DAYS_IN_MONTH: 30,
    DAYS_IN_YEAR: 365,
  },
  DATE_RANGES: {
    TODAY: 0,
    YESTERDAY: 1,
    WEEK_THRESHOLD: 7,
    MONTH_THRESHOLD: 30,
    YEAR_THRESHOLD: 365,
  },
  VALIDATION: {
    MIN_VALUE: 0,
    INVALID_TIMESTAMP: 0,
    DECIMAL_PRECISION: 10,
  },
  MATH: {
    HALF_STAR_THRESHOLD: 0.5,
    PERCENTAGE_MAX: 100,
  },
};

/**
 * מחזיר אייקון מתאים למגדר המשתמש
 */
export const getGenderIcon = (
  gender: "male" | "female" | "other" | string
): string => {
  const g = (gender || "other").toString().toLowerCase();
  switch (g) {
    case "male":
      return HISTORY_SCREEN_ICONS.MALE_ICON;
    case "female":
      return HISTORY_SCREEN_ICONS.FEMALE_ICON;
    default:
      return HISTORY_SCREEN_ICONS.OTHER_ICON;
  }
};

/**
 * מחזיר כוכבים לייצוג רמת קושי
 * פונקציה מתקדמת יותר מהגרסה ב־workoutHelpers
 */
export const getDifficultyStars = (difficulty: number): string => {
  const clampedDifficulty = Math.max(
    HISTORY_SCREEN_CONFIG.MIN_DIFFICULTY,
    Math.min(HISTORY_SCREEN_CONFIG.MAX_DIFFICULTY, difficulty)
  );

  const fullStars = Math.floor(clampedDifficulty);
  const hasHalfStar =
    clampedDifficulty % 1 >= CONSTANTS.MATH.HALF_STAR_THRESHOLD;

  let stars = "⭐".repeat(fullStars);
  if (hasHalfStar && fullStars < HISTORY_SCREEN_CONFIG.MAX_DIFFICULTY) {
    stars += "½"; // מציג חצי כהשלמה טקסטואלית
  }

  return stars || "⭐"; // ברירת מחדל כוכב אחד
};

/**
 * מחזיר אמוג'י מתאים להרגשה
 * פונקציה מתקדמת יותר מהגרסה ב־workoutHelpers
 */
export const getFeelingEmoji = (feeling: string): string => {
  if (!feeling) return HISTORY_SCREEN_CONFIG.DEFAULT_MOOD;
  const normalized = feeling.trim().toLowerCase();
  const emojiMap: Record<string, string> = {
    "😄": "😄",
    "😊": "😊",
    "": "😄",
    "😐": "😐",
    "😞": "😞",
    "😢": "😢",
    "💪": "💪",
    "😴": "😴",
    "🔥": "🔥",
    happy: "😊",
    veryhappy: "😊",
    very_happy: "😊",
    "very-happy": "😊",
    sad: "😞",
    verysad: "😢",
    neutral: "😐",
    tired: "😴",
    strong: "💪",
    motivated: "🔥",
    motivation: "🔥",
  };
  return (
    emojiMap[feeling] ||
    emojiMap[normalized] ||
    HISTORY_SCREEN_CONFIG.DEFAULT_MOOD
  );
};

/**
 * מעצב תאריך לתצוגה בעברית עם טיפול משופר בשגיאות
 * פונקציה מתקדמת יותר מהגרסה ב־workoutHelpers
 */
export const formatDateHebrew = (
  dateInput: string | number | Date | undefined | null,
  now: Date = new Date()
): string => {
  try {
    // בדיקות ראשוניות לערכים לא תקינים
    if (
      dateInput === undefined ||
      dateInput === null ||
      dateInput === "" ||
      !isValidDate(dateInput)
    ) {
      return "תאריך לא זמין";
    }

    // ניסיון לפרסר התאריך
    let date: Date;

    // בדיקה אם זה כבר תאריך או צריך להמיר
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === "number") {
      date = new Date(dateInput);
    } else if (typeof dateInput === "string") {
      // טיפול בפורמטים שונים של תאריך
      const cleanDateString = safeStringValue(dateInput, "").trim();

      // בדיקה לפורמט ISO
      if (cleanDateString.includes("T") || cleanDateString.includes("Z")) {
        date = new Date(cleanDateString);
      }
      // בדיקה לפורמט timestamp
      else if (/^\d+$/.test(cleanDateString)) {
        const timestamp = parseInt(cleanDateString);
        date = new Date(timestamp);
      }
      // פורמט רגיל
      else {
        date = new Date(cleanDateString);
      }
    } else {
      // במקרה של סוג לא צפוי, נשתמש בערך ברירת מחדל
      dlog("Unexpected date input type", { dateInput, type: typeof dateInput });
      return "תאריך לא זמין";
    }

    // בדיקה שהתאריך תקין
    if (
      !date ||
      isNaN(date.getTime()) ||
      date.getTime() <= CONSTANTS.VALIDATION.INVALID_TIMESTAMP
    ) {
      dlog("Invalid date provided", { dateInput });
      return "תאריך לא תקין";
    }

    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(
      diffTime / CONSTANTS.TIME_INTERVALS.MILLISECONDS_PER_DAY
    );

    // תאריך עתידי - זה לא אמור לקרות באימונים
    if (diffDays < CONSTANTS.VALIDATION.MIN_VALUE) {
      dlog("Future date found in workout history", { dateInput });
      // נציג את התאריך המלא במקום "מחר"
      return date.toLocaleDateString("he-IL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    // תאריכים קרובים
    if (diffDays === CONSTANTS.DATE_RANGES.TODAY) {
      return "היום";
    } else if (diffDays === CONSTANTS.DATE_RANGES.YESTERDAY) {
      return "אתמול";
    } else if (diffDays < CONSTANTS.DATE_RANGES.WEEK_THRESHOLD) {
      return `לפני ${diffDays} ימים`;
    } else if (diffDays < CONSTANTS.DATE_RANGES.MONTH_THRESHOLD) {
      const weeks = Math.floor(
        diffDays / CONSTANTS.TIME_INTERVALS.DAYS_IN_WEEK
      );
      return `לפני ${weeks} שבוע${weeks > 1 ? "ות" : ""}`;
    } else if (diffDays < CONSTANTS.DATE_RANGES.YEAR_THRESHOLD) {
      const months = Math.floor(
        diffDays / CONSTANTS.TIME_INTERVALS.DAYS_IN_MONTH
      );
      return `לפני ${months} חודש${months > 1 ? "ים" : ""}`;
    } else {
      // תצוגת תאריך מלא לתאריכים ישנים
      return date.toLocaleDateString("he-IL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  } catch (error) {
    dlog("Error formatting date", { error, originalInput: dateInput });
    return "תאריך לא זמין";
  }
};

/**
 * מחשב אחוז התקדמות
 */
export const calculateProgressPercentage = (
  current: number,
  total: number
): number => {
  const safeCurrent = Math.max(CONSTANTS.VALIDATION.MIN_VALUE, current);
  const safeTotal = Math.max(CONSTANTS.VALIDATION.MIN_VALUE, total);
  if (safeTotal === CONSTANTS.VALIDATION.MIN_VALUE)
    return CONSTANTS.VALIDATION.MIN_VALUE;
  return Math.min(
    HISTORY_SCREEN_FORMATS.PERCENTAGE_MULTIPLIER,
    Math.round(
      (safeCurrent / safeTotal) * HISTORY_SCREEN_FORMATS.PERCENTAGE_MULTIPLIER
    )
  );
};

/**
 * יוצר טקסט התקדמות
 */
export const formatProgressText = (loaded: number, total: number): string => {
  if (total <= CONSTANTS.VALIDATION.MIN_VALUE) {
    return HISTORY_SCREEN_FORMATS.PROGRESS_TEMPLATE.replace("{loaded}", "0")
      .replace("{total}", "0")
      .replace("{percentage}", "0");
  }
  const percentage = calculateProgressPercentage(loaded, total);
  return HISTORY_SCREEN_FORMATS.PROGRESS_TEMPLATE.replace(
    "{loaded}",
    Math.max(CONSTANTS.VALIDATION.MIN_VALUE, loaded).toString()
  )
    .replace(
      "{total}",
      Math.max(CONSTANTS.VALIDATION.MIN_VALUE, total).toString()
    )
    .replace("{percentage}", percentage.toString());
};

/**
 * מעצב יחס סטים (הושלמו/מתוכננים)
 */
export const formatSetRatio = (completed: number, planned: number): string => {
  return HISTORY_SCREEN_FORMATS.SET_RATIO_TEMPLATE.replace(
    "{completed}",
    completed.toString()
  ).replace("{planned}", planned.toString());
};

/**
 * מעצב ציון קושי לתצוגה
 */
export const formatDifficultyScore = (difficulty: number): string => {
  return (
    Math.round(difficulty * CONSTANTS.VALIDATION.DECIMAL_PRECISION) /
    CONSTANTS.VALIDATION.DECIMAL_PRECISION
  ).toFixed(HISTORY_SCREEN_CONFIG.DIFFICULTY_DECIMAL_PLACES);
};

/**
 * מסנן כפילויות באימונים לפי ID ותאריך
 */
export const removeDuplicateWorkouts = <
  T extends { id: string; feedback: { completedAt: string } },
>(
  workouts: T[]
): T[] => {
  return workouts.filter(
    (workout, index, array) =>
      array.findIndex(
        (w) =>
          w.id === workout.id &&
          w.feedback.completedAt === workout.feedback.completedAt
      ) === index
  );
};

/**
 * ממיין אימונים לפי תאריך (מהחדש לישן)
 */
export const sortWorkoutsByDate = <
  T extends { feedback: { completedAt: string } },
>(
  workouts: T[]
): T[] => {
  return [...workouts].sort(
    (a, b) =>
      safeDateConversion(b.feedback.completedAt).getTime() -
      safeDateConversion(a.feedback.completedAt).getTime()
  );
};

/**
 * מוודא שנתוני האימון תקינים ומעדכן ערכים לא תקינים
 */
export const validateWorkoutData = <T = unknown>(workout: T): T => {
  try {
    const w = workout as Partial<RawWorkoutRecord>;

    // Safe validation of the workout data
    const validatedFeedback = w.feedback
      ? {
          ...w.feedback,
          completedAt: safeDateConversion(w.feedback.completedAt).toISOString(),
          difficulty: safeNumberValue(
            w.feedback.difficulty,
            HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING,
            1,
            5
          ),
          feeling: safeStringValue(
            w.feedback.feeling,
            HISTORY_SCREEN_CONFIG.DEFAULT_MOOD
          ),
        }
      : {
          completedAt: new Date().toISOString(),
          difficulty: HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING,
          feeling: HISTORY_SCREEN_CONFIG.DEFAULT_MOOD,
        };

    const validatedStats = w.stats
      ? {
          ...w.stats,
          duration: safeNumberValue(w.stats.duration, 0),
          personalRecords: safeNumberValue(w.stats.personalRecords, 0),
          totalSets: safeNumberValue(w.stats.totalSets, 0),
          totalPlannedSets: safeNumberValue(w.stats.totalPlannedSets, 0),
          totalVolume: safeNumberValue(w.stats.totalVolume, 0),
        }
      : {
          duration: 0,
          personalRecords: 0,
          totalSets: 0,
          totalPlannedSets: 0,
          totalVolume: 0,
        };

    const validatedWorkout = w.workout
      ? {
          ...w.workout,
          name: safeStringValue(w.workout.name, "אימון"),
          exercises: Array.isArray(w.workout.exercises)
            ? w.workout.exercises
            : [],
        }
      : {
          name: "אימון",
          exercises: [],
        };

    return {
      ...workout,
      feedback: validatedFeedback,
      stats: validatedStats,
      workout: validatedWorkout,
    } as T;
  } catch (error) {
    dlog("Error validating workout data", { error, workout });
    return workout;
  }
};
