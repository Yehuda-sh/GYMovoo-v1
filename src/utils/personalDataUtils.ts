/**
 * @file src/utils/personalDataUtils.ts
 * @description פונקציות עזר פשוטות לטיפול בנתונים אישיים
 * @updated 2025-09-03 - פישוט והסרת קוד מיותר
 * English: Simple utility functions for personal data handling
 */

// ✅ ממשק נתונים אישיים מרכזי
export interface PersonalData {
  gender: "male" | "female";
  age: string; // "25_34", "35_44", etc.
  weight: string; // "70_79", "80_89", etc.
  height: string; // "170_179", "180_189", etc.
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  availability?: string; // "2_days", "3_days", etc.
}

/**
 * מיצוי ערך אמצעי מטווח משקל/גובה
 * Used internally by calculatePersonalizedCalories
 */
const extractMidValueFromRange = (range: string): number => {
  const ranges: Record<string, number> = {
    // Weight ranges (kg)
    "50_59": 55,
    "60_69": 65,
    "70_79": 75,
    "80_89": 85,
    "90_99": 95,
    "100_109": 105,
    // Height ranges (cm)
    "160_169": 165,
    "170_179": 175,
    "180_189": 185,
    "190_199": 195,
    "200_209": 205,
  };
  return ranges[range] || 70; // Default fallback
};

/**
 * חישוב פקטור מטבוליזם לפי גיל
 * Used internally by calculatePersonalizedCalories
 */
const getAgeMetabolismFactor = (age: string): number => {
  const factors: Record<string, number> = {
    "18_24": 1.1,
    "25_34": 1.0,
    "35_44": 0.95,
    "45_54": 0.9,
    "55_64": 0.85,
    "65_plus": 0.8,
  };
  return factors[age] || 1.0;
};

/**
 * חישוב פקטור כוח לפי גיל
 * Used by: workoutRecommendationService
 */
export const getAgeStrengthFactor = (age: string): number => {
  const factors: Record<string, number> = {
    "18_24": 1.0,
    "25_34": 0.98,
    "35_44": 0.95,
    "45_54": 0.9,
    "55_64": 0.85,
    "65_plus": 0.75,
  };
  return factors[age] || 1.0;
};

/**
 * חישוב קלוריות משוערות מותאם אישית
 * Used by: workoutRecommendationService
 */
export const calculatePersonalizedCalories = (
  durationMinutes: number,
  personalData?: PersonalData
): number => {
  if (!personalData) {
    // Fallback to basic calculation
    return Math.round(durationMinutes * 8); // 8 calories per minute base
  }

  // Extract weight range for calculation
  const weightMid = extractMidValueFromRange(personalData.weight);

  // Age factor (younger = higher metabolism)
  const ageFactor = getAgeMetabolismFactor(personalData.age);

  // Gender factor (male = higher base metabolism)
  const genderFactor = personalData.gender === "male" ? 1.2 : 1.0;

  // Fitness level factor
  const fitnessFactors = {
    beginner: 0.9,
    intermediate: 1.0,
    advanced: 1.1,
  };
  const fitnessFactor = fitnessFactors[personalData.fitnessLevel];

  // Calculate calories: base rate * weight * time * factors
  const baseCaloriesPerMinutePerKg = 0.15;
  const totalCalories = Math.round(
    baseCaloriesPerMinutePerKg *
      weightMid *
      durationMinutes *
      ageFactor *
      genderFactor *
      fitnessFactor
  );

  return Math.max(50, totalCalories); // Minimum 50 calories
};
