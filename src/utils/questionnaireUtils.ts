import { fieldMapper } from "./fieldMapper";
import { User } from "../types";
import { PersonalData } from "./personalDataUtils";

/**
 * Extract smart questionnaire answers from user
 * Note: This is a thin wrapper around fieldMapper.getSmartAnswers for backward compatibility
 */
export function extractSmartAnswers(user: unknown) {
  return fieldMapper.getSmartAnswers(user);
}

/**
 * Validate that a value is a valid gender
 */
const isValidGender = (gender: unknown): gender is "male" | "female" => {
  return gender === "male" || gender === "female";
};

/**
 * Validate that a value is a valid fitness level
 */
const isValidFitnessLevel = (
  level: unknown
): level is "beginner" | "intermediate" | "advanced" => {
  return (
    level === "beginner" || level === "intermediate" || level === "advanced"
  );
};

/**
 * Convert numeric value to age range string (e.g., 25 -> "25_34")
 */
const convertToAgeRange = (age: number): string => {
  if (age < 18) return "18_24";
  if (age < 25) return "18_24";
  if (age < 35) return "25_34";
  if (age < 45) return "35_44";
  if (age < 55) return "45_54";
  if (age < 65) return "55_64";
  return "65_plus";
};

/**
 * Convert numeric value to weight range string (e.g., 75 -> "70_79")
 */
const convertToWeightRange = (weight: number): string => {
  const ranges = [50, 60, 70, 80, 90, 100, 110, 120];
  for (let i = 0; i < ranges.length - 1; i++) {
    if (weight >= ranges[i] && weight < ranges[i + 1]) {
      return `${ranges[i]}_${ranges[i + 1] - 1}`;
    }
  }
  return weight >= 120 ? "120_plus" : "under_50";
};

/**
 * Convert numeric value to height range string (e.g., 175 -> "170_179")
 */
const convertToHeightRange = (height: number): string => {
  const ranges = [150, 160, 170, 180, 190];
  for (let i = 0; i < ranges.length - 1; i++) {
    if (height >= ranges[i] && height < ranges[i + 1]) {
      return `${ranges[i]}_${ranges[i + 1] - 1}`;
    }
  }
  return height >= 190 ? "190_plus" : "under_150";
};

/**
 * Extract and validate personal data from user questionnaire answers
 * Returns PersonalData with proper range formatting or undefined if invalid
 */
export function getPersonalDataFromUser(
  user: User | null | undefined
): PersonalData | undefined {
  const answers = extractSmartAnswers(user);
  if (!answers) return undefined;

  // Validate required fields with proper type checking
  const rawGender = answers.gender;
  const rawAge = answers.age;
  const rawWeight = answers.weight;
  const rawHeight = answers.height;
  const rawFitnessLevel = answers.fitnessLevel;

  // Gender validation
  if (!isValidGender(rawGender)) return undefined;

  // Fitness level validation
  if (!isValidFitnessLevel(rawFitnessLevel)) return undefined;

  // Numeric field validation and conversion
  const ageNum =
    typeof rawAge === "number" ? rawAge : parseFloat(String(rawAge || ""));
  const weightNum =
    typeof rawWeight === "number"
      ? rawWeight
      : parseFloat(String(rawWeight || ""));
  const heightNum =
    typeof rawHeight === "number"
      ? rawHeight
      : parseFloat(String(rawHeight || ""));

  if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum)) return undefined;
  if (ageNum < 10 || ageNum > 120) return undefined; // Reasonable age bounds
  if (weightNum < 30 || weightNum > 300) return undefined; // Reasonable weight bounds
  if (heightNum < 120 || heightNum > 250) return undefined; // Reasonable height bounds

  return {
    gender: rawGender,
    age: convertToAgeRange(ageNum),
    weight: convertToWeightRange(weightNum),
    height: convertToHeightRange(heightNum),
    fitnessLevel: rawFitnessLevel,
  };
}
