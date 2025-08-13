/**
 * @file src/utils/personalDataUtils.ts
 * @description פונקציות עזר מרכזיות לטיפול בנתונים אישיים
 * @created 2025-08-10 - ריכוז כפילויות מקבצים שונים
 * English: Central utility functions for personal data handling
 */

// ✅ ממשק נתונים אישיים מרכזי - מחליף את כל הממשקים הכפולים
export interface PersonalData {
  gender: "male" | "female";
  age: string; // "25_34", "35_44", etc.
  weight: string; // "70_79", "80_89", etc.
  height: string; // "170_179", "180_189", etc.
  fitnessLevel: "beginner" | "intermediate" | "advanced";
}

/**
 * מיצוי ערך אמצעי מטווח משקל/גובה
 * Used by: workoutSimulationService, workoutHistoryService
 */
export const extractMidValueFromRange = (range: string): number => {
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
 * Used by: workoutSimulationService, workoutHistoryService
 */
export const getAgeMetabolismFactor = (age: string): number => {
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
 * Used by: workoutHistoryService
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
 * חישוב קלוריות משוערות מותאם אישית - פונקציה מרכזית
 * Replaces: calculatePersonalizedCalories in multiple services
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

/**
 * חישוב BMI מנתוני משקל וגובה
 * Used by: workoutHistoryService
 */
export const calculatePersonalizedBMI = (
  personalData: PersonalData
): number => {
  const weightMid = extractMidValueFromRange(personalData.weight);
  const heightMid = extractMidValueFromRange(personalData.height) / 100; // Convert to meters

  return Math.round((weightMid / (heightMid * heightMid)) * 10) / 10;
};

/**
 * ניתוח ביצועים מותאם לגיל ורמת כושר
 * Used by: workoutHistoryService
 */
export const analyzePersonalizedPerformance = (
  currentValue: number,
  exerciseType: "weight" | "volume" | "reps",
  personalData?: PersonalData
): {
  percentile: number;
  rating: "excellent" | "good" | "average" | "below_average" | "poor";
  ageAdjusted: boolean;
} => {
  if (!personalData) {
    return { percentile: 50, rating: "average", ageAdjusted: false };
  }

  // Base expectations by fitness level
  const baseExpectations = {
    beginner: { weight: 0.7, volume: 0.8, reps: 0.9 },
    intermediate: { weight: 1.0, volume: 1.0, reps: 1.0 },
    advanced: { weight: 1.3, volume: 1.2, reps: 1.1 },
  };

  // Age adjustment factor
  const ageAdjustment = getAgeStrengthFactor(personalData.age);

  // Gender adjustment factor
  const genderAdjustment = personalData.gender === "male" ? 1.0 : 0.85;

  const expectedValue =
    baseExpectations[personalData.fitnessLevel][exerciseType] *
    ageAdjustment *
    genderAdjustment *
    50; // Base reference value

  const ratio = currentValue / expectedValue;

  let percentile: number;
  let rating: "excellent" | "good" | "average" | "below_average" | "poor";

  if (ratio >= 1.5) {
    percentile = 95;
    rating = "excellent";
  } else if (ratio >= 1.2) {
    percentile = 80;
    rating = "good";
  } else if (ratio >= 0.8) {
    percentile = 50;
    rating = "average";
  } else if (ratio >= 0.6) {
    percentile = 25;
    rating = "below_average";
  } else {
    percentile = 10;
    rating = "poor";
  }

  return { percentile, rating, ageAdjusted: true };
};
