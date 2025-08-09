/**
 * userPreferencesHelpers.ts
 * פונקציות עזר חכמות להעדפות משתמש (מופרד לניקוי useUserPreferences)
 */
import { QuestionnaireMetadata, WorkoutRecommendation } from "../types";

// משקולות לחישוב איכות נתונים
export const WEIGHTS = {
  age: 1,
  gender: 1,
  goal: 2,
  experience: 2,
  frequency: 2,
  duration: 1,
  location: 1,
} as const;

// מיפוי ניקוד לתדירות
const FREQUENCY_SCORES: Record<string, number> = {
  יומי: 10,
  "5-6 פעמים בשבוע": 9,
  "3-4 פעמים בשבוע": 7,
  "2-3 פעמים בשבוע": 5,
};

export const scoreFrequency = (freq?: string): number => {
  if (!freq) return 3;
  return FREQUENCY_SCORES[freq] ?? 3;
};

export const calculateDataQuality = (data: QuestionnaireMetadata): number => {
  let score = 0;
  if (data.age) score += WEIGHTS.age;
  if (data.gender) score += WEIGHTS.gender;
  if (data.goal) score += WEIGHTS.goal;
  if (data.experience) score += WEIGHTS.experience;
  if (data.frequency) score += WEIGHTS.frequency;
  if (data.duration) score += WEIGHTS.duration;
  if (data.location) score += WEIGHTS.location;
  return Math.min(10, score);
};

export const generateFocusAreas = (data: QuestionnaireMetadata): string[] => {
  const areas: string[] = [];
  if (data.goal?.includes("שריפת שומן")) areas.push("קרדיו");
  if (data.goal?.includes("בניית שריר")) areas.push("כוח");
  if (data.experience === "מתחיל") areas.push("טכניקה");
  if (data.health_conditions?.length) areas.push("בטיחות");
  return areas.length ? areas : ["כושר כללי"];
};

export const generateWarningFlags = (
  data: QuestionnaireMetadata,
  motivation: number,
  consistency: number
): string[] => {
  const warnings: string[] = [];
  if (motivation < 4) warnings.push("מוטיבציה נמוכה");
  if (consistency < 4) warnings.push("תדירות נמוכה");
  if (data.health_conditions?.length) warnings.push("מצב בריאותי");
  if (!data.home_equipment?.length && !data.gym_equipment?.length) {
    warnings.push("ציוד מוגבל");
  }
  return warnings;
};

export interface SmartWorkoutPlan {
  weeklySchedule: WorkoutRecommendation[];
  personalityMatch: string;
  focusAreas: string[];
  progressionPace: string;
  motivationalBoost: string;
  generatedAt: string;
}

export const createSmartWorkoutPlan = (
  recommendations: WorkoutRecommendation[],
  prefs: {
    personalityProfile: string;
    smartRecommendations: { focusAreas: string[]; progressionPace: string };
    motivationLevel: number;
  } | null
): SmartWorkoutPlan | null => {
  if (!prefs) return null;
  return {
    weeklySchedule: recommendations.slice(0, 3),
    personalityMatch: prefs.personalityProfile,
    focusAreas: prefs.smartRecommendations.focusAreas,
    progressionPace: prefs.smartRecommendations.progressionPace,
    motivationalBoost:
      prefs.motivationLevel >= 7
        ? "מוכן לפריצת דרך!"
        : "התקדמות יציבה היא המפתח",
    generatedAt: new Date().toISOString(),
  };
};
