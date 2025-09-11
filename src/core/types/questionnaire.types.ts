/**
 * טיפוסים מרכזיים לשאלון
 * @file src/core/types/questionnaire.types.ts
 * @description הגדרות טיפוס הקשורות לשאלון המשתמש
 */

import { DietType, ExperienceLevel, TrainingGoal } from "./user.types";

/**
 * ימי השבוע
 */
export type DayOfWeek =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

/**
 * אזורי כאב בגוף
 */
export type BodyArea =
  | "shoulder"
  | "back"
  | "knee"
  | "elbow"
  | "wrist"
  | "ankle"
  | "hip"
  | "neck";

/**
 * מיקום אימון
 */
export type WorkoutLocation = "home" | "gym" | "both";

/**
 * לוח זמנים שבועי
 */
export interface WeeklySchedule {
  /** מספר ימי אימון בשבוע */
  daysPerWeek: number;
  /** זמן לכל אימון (בדקות) */
  timePerWorkout: number;
  /** ימים מועדפים (אופציונלי) */
  preferredDays?: DayOfWeek[];
}

/**
 * העדפות משתמש
 */
export interface UserPreferences {
  /** העדפות הודעות */
  notifications: boolean;
  /** זמני תזכורת מועדפים */
  reminderTime?: string;
  /** תצוגת מידות - מטרי/אימפריאלי */
  usesMetricSystem: boolean;
  /** העדפות נוספות */
  [key: string]: unknown;
}

/**
 * מידע בריאותי
 */
export interface HealthInformation {
  /** האם יש מגבלות רפואיות */
  hasLimitations: boolean;
  /** אזורי כאב (אם יש) */
  painAreas?: BodyArea[];
  /** פירוט מגבלות (טקסט חופשי) */
  limitationsDetails?: string;
}

/**
 * מבנה נתוני השאלון המלא
 */
export interface QuestionnaireData {
  /** מטרות אימון */
  goals: TrainingGoal[];
  /** לוח זמנים שבועי */
  schedule: WeeklySchedule;
  /** רשימת ציוד זמין */
  equipment: string[];
  /** רמת ניסיון */
  experience: ExperienceLevel;
  /** העדפות משתמש */
  preferences: UserPreferences;
  /** מיקום אימון */
  location: WorkoutLocation;
  /** העדפות תזונה */
  diet?: DietType;
  /** מידע בריאותי */
  healthInfo?: HealthInformation;
  /** תאריך השלמת השאלון */
  completionDate: Date;
  /** גרסת השאלון */
  version: string;

  /** תשובות מעקב תקופתיות */
  followUpResponses?: {
    /** תאריך המעקב */
    date: Date;
    /** תשובות המעקב */
    responses: Record<string, unknown>;
  }[];
}
