import { User } from "../core/types";
import { fieldMapper } from "./fieldMapper";
import { PersonalData } from "./personalDataUtils";

export function extractSmartAnswers(user: unknown) {
  try {
    return fieldMapper.getSmartAnswers(user);
  } catch (error) {
    console.error("Error extracting smart answers:", error);
    return undefined;
  }
}

export function getPersonalDataFromUser(
  user: User | null | undefined
): PersonalData | undefined {
  try {
    const answers = extractSmartAnswers(user);
    if (!answers) {
      return undefined;
    }

    const { gender, age, weight, height, fitnessLevel } = answers;

    if (!gender || !age || !weight || !height || !fitnessLevel) {
      return undefined;
    }

    return {
      gender: gender as "male" | "female",
      age: String(age),
      weight: String(weight),
      height: String(height),
      fitnessLevel: fitnessLevel as "beginner" | "intermediate" | "advanced",
    };
  } catch (error) {
    console.error("Error getting personal data from user:", error);
    return undefined;
  }
}
