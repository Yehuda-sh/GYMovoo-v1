import { fieldMapper } from "./fieldMapper";
import { User } from "../types";
import { PersonalData } from "./personalDataUtils";

/**
 * Extract questionnaire answers from user
 */
export function extractSmartAnswers(user: unknown) {
  return fieldMapper.getSmartAnswers(user);
}

/**
 * Convert age to range string
 */
const getAgeRange = (age: number): string => {
  if (age < 25) return "18_24";
  if (age < 35) return "25_34";
  if (age < 45) return "35_44";
  if (age < 55) return "45_54";
  if (age < 65) return "55_64";
  return "65_plus";
};

/**
 * Convert weight to range string
 */
const getWeightRange = (weight: number): string => {
  if (weight < 60) return "50_59";
  if (weight < 70) return "60_69";
  if (weight < 80) return "70_79";
  if (weight < 90) return "80_89";
  if (weight < 100) return "90_99";
  if (weight < 110) return "100_109";
  if (weight < 120) return "110_119";
  return "120_plus";
};

/**
 * Convert height to range string
 */
const getHeightRange = (height: number): string => {
  if (height < 160) return "150_159";
  if (height < 170) return "160_169";
  if (height < 180) return "170_179";
  if (height < 190) return "180_189";
  return "190_plus";
};

/**
 * Extract and validate personal data from user
 */
export function getPersonalDataFromUser(
  user: User | null | undefined
): PersonalData | undefined {
  const answers = extractSmartAnswers(user);
  if (!answers) return undefined;

  const { gender, age, weight, height, fitnessLevel } = answers;

  // Basic validation
  if (!gender || !["male", "female"].includes(gender)) return undefined;
  if (!fitnessLevel || !["beginner", "intermediate", "advanced"].includes(fitnessLevel)) return undefined;

  const ageNum = Number(age);
  const weightNum = Number(weight);
  const heightNum = Number(height);

  if (isNaN(ageNum) || isNaN(weightNum) || isNaN(heightNum)) return undefined;
  if (ageNum < 15 || ageNum > 100) return undefined;
  if (weightNum < 40 || weightNum > 200) return undefined;
  if (heightNum < 140 || heightNum > 220) return undefined;

  return {
    gender: gender as "male" | "female",
    age: getAgeRange(ageNum),
    weight: getWeightRange(weightNum),
    height: getHeightRange(heightNum),
    fitnessLevel: fitnessLevel as "beginner" | "intermediate" | "advanced",
  };
}
