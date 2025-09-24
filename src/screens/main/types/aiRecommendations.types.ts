/**
 * @file /src/screens/main/types/aiRecommendations.types.ts
 * @description טיפוסים עבור מערכת ההמלצות החכמות והתמיכה ב-wearables
 */

import type { ISODateString } from "../../../core/types";

/* ────────────────────────────────────────────────────────────────────────────
 * 🔤 Literal types & aliases
 * ────────────────────────────────────────────────────────────────────────────*/
export type RecommendationType =
  | "rest_recovery"
  | "intensity"
  | "balance"
  | "nutrition"
  | "sleep";

export type RecommendationPriority = "low" | "medium" | "high";

export type SleepQuality = "poor" | "fair" | "good" | "excellent";

export type DeviceType =
  | "apple_health"
  | "google_fit"
  | "fitbit"
  | "garmin"
  | "samsung_health"
  | "unknown";

export type WearablePermission =
  | "heartRate"
  | "steps"
  | "calories"
  | "sleep"
  | "workouts";

/** Hex color string (e.g. #ff0000, #4ecdc4) */
export type HexColor = `#${string}`;

/* ────────────────────────────────────────────────────────────────────────────
 * 🤖 טיפוסי המלצות AI
 * ────────────────────────────────────────────────────────────────────────────*/
export interface AIRecommendation {
  id: string;
  type: RecommendationType;
  title: string;
  description: string;
  action: string;
  priority: RecommendationPriority;
  /** שם אייקון (ספריית האייקונים לבחירתך) */
  icon: string;
  color: HexColor;
  timestamp: ISODateString;
}

/* ────────────────────────────────────────────────────────────────────────────
 * ⌚ טיפוסי נתוני wearables
 *  שדות-בן חובה כאשר האובייקט העליון קיים (optional chaining-friendly)
 * ────────────────────────────────────────────────────────────────────────────*/
export interface WearableData {
  heartRate?: {
    current: number;
    resting: number;
    max: number;
    timestamp: ISODateString;
  };
  steps?: {
    count: number;
    goal: number;
    /** מרחק בק״מ */
    distance: number;
    timestamp: ISODateString;
  };
  calories?: {
    burned: number;
    goal: number;
    active: number;
    resting: number;
    timestamp: ISODateString;
  };
  sleep?: {
    /** שעות שינה כוללות */
    duration: number;
    quality: SleepQuality;
    /** שעות שינה עמוקה */
    deepSleep: number;
    /** שעות REM */
    remSleep: number;
    timestamp: ISODateString;
  };
  activity?: {
    activeMinutes: number;
    goal: number;
    zones: {
      fat_burn: number;
      cardio: number;
      peak: number;
    };
    timestamp: ISODateString;
  };
}

/* ────────────────────────────────────────────────────────────────────────────
 * 🔌 טיפוס לסטטוס חיבור Wearable
 * ────────────────────────────────────────────────────────────────────────────*/
export interface WearableConnectionStatus {
  isConnected: boolean;
  deviceName?: string;
  deviceType: DeviceType;
  lastSync?: ISODateString;
  permissions: Record<WearablePermission, boolean>;
}

/* ────────────────────────────────────────────────────────────────────────────
 * 📈 טיפוס לניתוח דפוסי אימון
 * ────────────────────────────────────────────────────────────────────────────*/
export interface WorkoutPattern {
  frequencyPerWeek: number;
  averageDuration: number;
  preferredTimes: string[];
  muscleGroupFrequency: Record<string, number>;
  difficultyTrend: "increasing" | "decreasing" | "stable";
  /** ציון עקביות 0-100 */
  consistencyScore: number;
}
