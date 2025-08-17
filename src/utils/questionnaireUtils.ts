import { fieldMapper } from "./fieldMapper";
import { User } from "../types";
import { PersonalData } from "./personalDataUtils"; // ✅ משתמש ב-PersonalData המרכזי והמתקדם

export function extractSmartAnswers(user: unknown) {
  return fieldMapper.getSmartAnswers(user);
}

type AnswersShape = Record<string, unknown> & {
  gender?: string;
  age?: string | number;
  weight?: string | number;
  height?: string | number;
  fitnessLevel?: string;
};

export function getPersonalDataFromUser(
  user: User | null | undefined
): PersonalData | undefined {
  const answers = extractSmartAnswers(user) as AnswersShape | null;
  if (!answers) return undefined;

  const toStr = (v: unknown) =>
    v === undefined || v === null || v === "" ? undefined : String(v);

  // ✅ Validation לפי PersonalData המחמיר מ-personalDataUtils
  const gender = answers.gender as "male" | "female" | undefined;
  const age = toStr(answers.age);
  const weight = toStr(answers.weight);
  const height = toStr(answers.height);
  const fitnessLevel = answers.fitnessLevel as
    | "beginner"
    | "intermediate"
    | "advanced"
    | undefined;

  // Return only if we have the required fields
  if (!gender || !age || !weight || !height || !fitnessLevel) {
    return undefined;
  }

  return {
    gender,
    age,
    weight,
    height,
    fitnessLevel,
  };
}
