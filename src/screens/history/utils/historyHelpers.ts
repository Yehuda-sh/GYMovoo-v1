/**
 * @fileoverview פונקציות עזר מותאמות עבור מסך היסטוריית אימונים
 * @version 2025.1
 * @author GYMovoo Development Team
 */

import {
  HISTORY_SCREEN_CONFIG,
  HISTORY_SCREEN_FORMATS,
} from "../../../constants/historyScreenConfig";
import { HISTORY_SCREEN_ICONS } from "../../../constants/historyScreenTexts";

/**
 * מחזיר אייקון מתאים למגדר המשתמש
 */
export const getGenderIcon = (gender: string): string => {
  switch (gender) {
    case "male":
      return HISTORY_SCREEN_ICONS.MALE_ICON;
    case "female":
      return HISTORY_SCREEN_ICONS.FEMALE_ICON;
    case "other":
      return HISTORY_SCREEN_ICONS.OTHER_ICON;
    default:
      return HISTORY_SCREEN_ICONS.OTHER_ICON;
  }
};

/**
 * מחזיר כוכבים לייצוג רמת קושי
 */
export const getDifficultyStars = (difficulty: number): string => {
  const clampedDifficulty = Math.max(
    HISTORY_SCREEN_CONFIG.MIN_DIFFICULTY,
    Math.min(HISTORY_SCREEN_CONFIG.MAX_DIFFICULTY, difficulty)
  );

  const fullStars = Math.floor(clampedDifficulty);
  const hasHalfStar = clampedDifficulty % 1 >= 0.5;

  let stars = "⭐".repeat(fullStars);
  if (hasHalfStar && fullStars < HISTORY_SCREEN_CONFIG.MAX_DIFFICULTY) {
    stars += "⭐"; // או סמל חצי כוכב אם יש
  }

  return stars || "⭐"; // ברירת מחדל כוכב אחד
};

/**
 * מחזיר אמוג'י מתאים להרגשה
 */
export const getFeelingEmoji = (feeling: string): string => {
  if (!feeling) return HISTORY_SCREEN_CONFIG.DEFAULT_MOOD;
  const normalized = feeling.trim().toLowerCase();
  const emojiMap: Record<string, string> = {
    "😄": "😄",
    "😊": "😊",
    "�": "😊",
    "😀": "😄",
    "😐": "😐",
    "😞": "😞",
    "😢": "😢",
    "💪": "💪",
    "😴": "😴",
    "🔥": "🔥",
    happy: "😊",
    veryhappy: "�",
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
 */
export const formatDateHebrew = (
  dateString: string | undefined | null,
  now: Date = new Date()
): string => {
  try {
    // בדיקות ראשוניות לערכים לא תקינים
    if (!dateString || dateString === "" || dateString === "Invalid Date") {
      return "תאריך לא זמין";
    }

    // ניסיון לפרסר התאריך
    let date: Date;

    // בדיקה אם זה כבר תאריך או צריך להמיר
    if (typeof dateString === "string") {
      // טיפול בפורמטים שונים של תאריך
      const cleanDateString = dateString.trim();

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
      date = new Date(dateString);
    }

    // בדיקה שהתאריך תקין
    if (!date || isNaN(date.getTime()) || date.getTime() <= 0) {
      console.warn("Invalid date provided:", dateString);
      return "תאריך לא תקין";
    }

    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // תאריך עתידי
    if (diffDays < 0) {
      const futureDays = Math.abs(diffDays);
      if (futureDays === 1) {
        return "מחר";
      } else if (futureDays < 7) {
        return `בעוד ${futureDays} ימים`;
      } else {
        return date.toLocaleDateString("he-IL", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }
    }

    // תאריכים קרובים
    if (diffDays === 0) {
      return "היום";
    } else if (diffDays === 1) {
      return "אתמול";
    } else if (diffDays < 7) {
      return `לפני ${diffDays} ימים`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `לפני ${weeks} שבוע${weeks > 1 ? "ות" : ""}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
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
    console.error(
      "Error formatting date:",
      error,
      "Original input:",
      dateString
    );
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
  const safeCurrent = Math.max(0, current);
  const safeTotal = Math.max(0, total);
  if (safeTotal === 0) return 0;
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
  if (total <= 0) {
    return HISTORY_SCREEN_FORMATS.PROGRESS_TEMPLATE.replace("{loaded}", "0")
      .replace("{total}", "0")
      .replace("{percentage}", "0");
  }
  const percentage = calculateProgressPercentage(loaded, total);
  return HISTORY_SCREEN_FORMATS.PROGRESS_TEMPLATE.replace(
    "{loaded}",
    Math.max(0, loaded).toString()
  )
    .replace("{total}", Math.max(0, total).toString())
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
  return (Math.round(difficulty * 10) / 10).toFixed(
    HISTORY_SCREEN_CONFIG.DIFFICULTY_DECIMAL_PLACES
  );
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
          if (isNaN(testDate.getTime()) || testDate.getTime() <= 0) {
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
        duration: Math.max(0, w.stats?.duration || 0),
        personalRecords: Math.max(0, w.stats?.personalRecords || 0),
        totalSets: Math.max(0, w.stats?.totalSets || 0),
        totalPlannedSets: Math.max(0, w.stats?.totalPlannedSets || 0),
        totalVolume: Math.max(0, w.stats?.totalVolume || 0),
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
    console.error("Error validating workout data:", error);
    return workout;
  }
};
