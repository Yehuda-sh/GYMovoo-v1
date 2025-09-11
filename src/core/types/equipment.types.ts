/**
 * טיפוסים מרכזיים לציוד
 * @file src/core/types/equipment.types.ts
 * @description הגדרות טיפוס הקשורות לציוד אימון
 */

/**
 * קטגוריות ציוד
 */
export type EquipmentCategory = "home" | "gym" | "cardio";

/**
 * רמות ניסיון (מיובא מ-user.types.ts)
 */
import { ExperienceLevel } from "./user.types";

/**
 * טיפוס בסיסי של ציוד אימון
 */
export interface Equipment {
  /** מזהה ייחודי */
  id: string;
  /** שם לתצוגה */
  label: string;
  /** תמונה/אייקון */
  image:
    | {
        uri?: string;
        default?: unknown;
      }
    | number;
  /** תיאור קצר */
  description: string;
  /** קטגוריה */
  category: EquipmentCategory;
  /** תגיות לחיפוש */
  tags: string[];
  /** משקל אלגוריתמי להמלצות (1-10) */
  algorithmWeight: number;
  /** רמות המלצה */
  recommendedFor: ExperienceLevel[];
  /** האם זה ברירת מחדל */
  isDefault?: boolean;
  /** האם זה ציוד פרימיום */
  isPremium?: boolean;
}

/**
 * טיפוסי סוגי ציוד
 */
export type EquipmentType =
  | "STRENGTH"
  | "CARDIO"
  | "FLEXIBILITY"
  | "FUNCTIONAL";

/**
 * טיפוסי דרישות מקום
 */
export type SpaceRequirement = "MINIMAL" | "SMALL" | "MEDIUM" | "LARGE";

/**
 * טיפוסים של סביבת אימון
 */
export type WorkoutEnvironment = "home" | "gym" | "both";

/**
 * טיפוסים של תקציב
 */
export type BudgetLevel = "low" | "medium" | "high";

/**
 * אופציית בחירה בשאלון
 */
export interface QuestionOption {
  /** מזהה ייחודי */
  id: string;
  /** תווית לתצוגה */
  label: string;
  /** תיאור מורחב */
  description?: string;
  /** תמונה/אייקון */
  icon?: string;
}

/**
 * פרופיל משתמש להמלצות ציוד חכמות
 */
export interface EquipmentRecommendationProfile {
  /** רמת ניסיון */
  experience: ExperienceLevel;
  /** סביבת אימון */
  environment: WorkoutEnvironment;
  /** תקציב */
  budget: BudgetLevel;
  /** דרישות מקום */
  space: Lowercase<SpaceRequirement>;
  /** סוגי אימון */
  workoutTypes: Lowercase<EquipmentType>[];
}
