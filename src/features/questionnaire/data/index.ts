// src/features/questionnaire/data/index.ts
/**
 * @file src/features/questionnaire/data/index.ts
 * @description Export all questionnaire data
 */

export * from "./unifiedQuestionnaire";
// re-export the default as a named export from the barrel:
export { default as UnifiedQuestionnaireManager } from "./unifiedQuestionnaire";

// (אופציונלי) אם נוח לך לייצא גם טיפוסים מכאן:
export type {
  Question,
  QuestionOption,
  QuestionnaireAnswer,
  QuestionnaireResults,
  QuestionnaireData,
} from "../types";
export { QUESTIONNAIRE_VERSION } from "../types";
