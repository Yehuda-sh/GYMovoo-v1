/**
 * Personal data utilities for fitness calculations
 */

export interface PersonalData {
  gender: "male" | "female";
  age: string; // "25_34", "35_44", etc.
  weight: string; // "70_79", "80_89", etc.
  height: string; // "170_179", "180_189", etc.
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  availability?: string; // "2_days", "3_days", etc.
}

/**
 * Extract mid value from weight/height range
 */
const extractMidValueFromRange = (range: string): number => {
  const ranges: Record<string, number> = {
    // Weight ranges (kg)
    "50_59": 55, "60_69": 65, "70_79": 75, "80_89": 85, "90_99": 95, "100_109": 105,
    // Height ranges (cm)
    "160_169": 165, "170_179": 175, "180_189": 185, "190_199": 195, "200_209": 205,
  };
  return ranges[range] || 70;
};

/**
 * Get age-based metabolism factor
 */
const getAgeMetabolismFactor = (age: string): number => {
  const factors: Record<string, number> = {
    "18_24": 1.1, "25_34": 1.0, "35_44": 0.95, "45_54": 0.9, "55_64": 0.85, "65_plus": 0.8,
  };
  return factors[age] || 1.0;
};

/**
 * Get age-based strength factor
 */
export const getAgeStrengthFactor = (age: string): number => {
  const factors: Record<string, number> = {
    "18_24": 1.0, "25_34": 0.98, "35_44": 0.95, "45_54": 0.9, "55_64": 0.85, "65_plus": 0.75,
  };
  return factors[age] || 1.0;
};

/**
 * Calculate personalized calories for workout
 */
export const calculatePersonalizedCalories = (
  durationMinutes: number,
  personalData?: PersonalData
): number => {
  if (!personalData) {
    return Math.round(durationMinutes * 8); // 8 calories per minute base
  }

  const weightMid = extractMidValueFromRange(personalData.weight);
  const ageFactor = getAgeMetabolismFactor(personalData.age);
  const genderFactor = personalData.gender === "male" ? 1.2 : 1.0;
  
  const fitnessFactors = { beginner: 0.9, intermediate: 1.0, advanced: 1.1 };
  const fitnessFactor = fitnessFactors[personalData.fitnessLevel];

  const baseCaloriesPerMinutePerKg = 0.15;
  const totalCalories = Math.round(
    baseCaloriesPerMinutePerKg * weightMid * durationMinutes * ageFactor * genderFactor * fitnessFactor
  );

  return Math.max(50, totalCalories);
};
