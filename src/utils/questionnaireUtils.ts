import { fieldMapper } from "./fieldMapper";
import { User } from "../types";

export interface PersonalData {
  gender?: string;
  age?: string;
  weight?: string;
  height?: string;
  fitnessLevel?: string;
}

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
  return {
    gender: answers.gender,
    age: toStr(answers.age),
    weight: toStr(answers.weight),
    height: toStr(answers.height),
    fitnessLevel: answers.fitnessLevel,
  };
}
