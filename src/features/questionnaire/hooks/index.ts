// src/features/questionnaire/hooks/index.ts
/**
 * @file src/features/questionnaire/hooks/index.ts
 * @description Export all questionnaire hooks
 */

export { useQuestionnaire } from "./useQuestionnaire";

// ייצוא סוגים בלבד (לא יכניס קוד לבאנדל)
export type { QuestionnaireStatus } from "../types";
// אם תוסיף ב-useQuestionnaire.ts:
//   export type UseQuestionnaireReturn = ReturnType<typeof useQuestionnaire>;
