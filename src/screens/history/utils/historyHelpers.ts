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

// Debug logging system
const DEBUG = __DEV__;
const dlog = (message: string, ...args: unknown[]) => {
  if (DEBUG) {
    // eslint-disable-next-line no-console
    console.debug(`[HistoryHelpers] ${message}`, ...args);
  }
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
      dateInput === ("Invalid Date" as unknown)
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
      const cleanDateString = dateInput.trim();

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
      date = new Date(dateInput as unknown as string);
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
      new Date(b.feedback.completedAt).getTime() -
      new Date(a.feedback.completedAt).getTime()
  );
};

/**
 * מוודא שנתוני האימון תקינים ומעדכן ערכים לא תקינים
 */
interface RawWorkoutFeedback {
  completedAt?: string;
  difficulty?: number;
  feeling?: string;
}
interface RawWorkoutStats {
  duration?: number;
  personalRecords?: number;
  totalSets?: number;
  totalPlannedSets?: number;
  totalVolume?: number;
}
interface RawWorkoutInner {
  name?: string;
  exercises?: unknown[];
}
interface RawWorkoutRecord {
  id?: string;
  feedback?: RawWorkoutFeedback;
  stats?: RawWorkoutStats;
  workout?: RawWorkoutInner;
  [key: string]: unknown;
}

export const validateWorkoutData = <T = unknown>(workout: T): T => {
  try {
    const w = workout as unknown as RawWorkoutRecord;
    return {
      ...workout,
      feedback: {
        ...w.feedback,
        completedAt: (() => {
          const currentDate = w.feedback?.completedAt;
          if (!currentDate || currentDate === "Invalid Date") {
            return new Date().toISOString();
          }
          const testDate = new Date(currentDate);
          if (
            isNaN(testDate.getTime()) ||
            testDate.getTime() <= CONSTANTS.VALIDATION.INVALID_TIMESTAMP
          ) {
            return new Date().toISOString();
          }
          return currentDate;
        })(),
        difficulty: (() => {
          const diff = w.feedback?.difficulty;
          if (typeof diff !== "number" || isNaN(diff) || diff < 1 || diff > 5) {
            return HISTORY_SCREEN_CONFIG.DEFAULT_DIFFICULTY_RATING;
          }
          return diff;
        })(),
        feeling: w.feedback?.feeling || HISTORY_SCREEN_CONFIG.DEFAULT_MOOD,
      },
      stats: {
        duration: Math.max(
          CONSTANTS.VALIDATION.MIN_VALUE,
          w.stats?.duration || 0
        ),
        personalRecords: Math.max(
          CONSTANTS.VALIDATION.MIN_VALUE,
          w.stats?.personalRecords || 0
        ),
        totalSets: Math.max(
          CONSTANTS.VALIDATION.MIN_VALUE,
          w.stats?.totalSets || 0
        ),
        totalPlannedSets: Math.max(
          CONSTANTS.VALIDATION.MIN_VALUE,
          w.stats?.totalPlannedSets || 0
        ),
        totalVolume: Math.max(
          CONSTANTS.VALIDATION.MIN_VALUE,
          w.stats?.totalVolume || 0
        ),
      },
      workout: {
        ...w.workout,
        name: w.workout?.name || "אימון",
        exercises: Array.isArray(w.workout?.exercises)
          ? w.workout.exercises
          : [],
      },
    } as T;
  } catch (error) {
    dlog("Error validating workout data", { error });
    return workout;
  }
};
