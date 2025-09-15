/**
 * @file fieldMapper.ts
 * @description Simple field mapping utilities for user data
 */

import type { QuestionnaireData } from "../features/questionnaire/types";

/**
 * Extract smart questionnaire answers from user data
 */
const getSmartAnswers = (
  user: unknown
): QuestionnaireData["answers"] | null => {
  if (!user || typeof user !== "object") return null;
  const u = user as { questionnaireData?: QuestionnaireData };
  const questionnaireData = u.questionnaireData;
  if (!questionnaireData || !questionnaireData.answers) return null;
  return questionnaireData.answers;
};

/**
 * Convert camelCase fields to lowercase for database
 */
const mapToDatabase = (
  data: Record<string, unknown>
): Record<string, unknown> => {
  if (!data || typeof data !== "object") return data;

  const mapped: Record<string, unknown> = {};

  // Check if we need to infer hasQuestionnaire from questionnaireData
  const hasQuestionnaireData = !!data.questionnaireData;
  const hasExplicitQuestionnaire = "hasQuestionnaire" in data;

  // If questionnaireData exists but hasQuestionnaire isn't explicitly set, set it to true
  if (hasQuestionnaireData && !hasExplicitQuestionnaire) {
    mapped["has_questionnaire"] = true;
  }

  for (const [key, value] of Object.entries(data)) {
    if (key === "hasQuestionnaire") {
      mapped["has_questionnaire"] = value;
    } else if (key === "questionnaireData") {
      mapped["questionnaire_data"] =
        typeof value === "string" ? value : JSON.stringify(value);
    } else if (key === "activityHistory") {
      mapped["activity_history"] =
        typeof value === "string" ? value : JSON.stringify(value);
    } else {
      mapped[key] = value;
    }
  }

  return mapped;
};

/**
 * Convert lowercase fields to camelCase for runtime use
 */
const mapFromDatabase = (
  data: Record<string, unknown>
): Record<string, unknown> => {
  if (!data || typeof data !== "object") return data;

  const mapped = { ...data };

  // מיפוי שמות שדות מיוחדים מהדאטאבייס לפורמט האפליקציה
  if ("questionnaire_data" in data) {
    try {
      const questData = data.questionnaire_data;
      mapped.questionnaireData =
        typeof questData === "string"
          ? JSON.parse(questData as string)
          : questData;
    } catch (e) {
      console.error("Error parsing questionnaire_data:", e);
      mapped.questionnaireData = data.questionnaire_data;
    }
    delete mapped.questionnaire_data;
  }

  if ("has_questionnaire" in data) {
    mapped.hasQuestionnaire = Boolean(data.has_questionnaire);
    delete mapped.has_questionnaire;
  }

  if ("activity_history" in data) {
    try {
      const histData = data.activity_history;
      mapped.activityHistory =
        typeof histData === "string"
          ? JSON.parse(histData as string)
          : histData;
    } catch (e) {
      console.error("Error parsing activity_history:", e);
      mapped.activityHistory = data.activity_history;
    }
    delete mapped.activity_history;
  }

  return mapped;
};

/**
 * Field mapper object for backward compatibility
 */
export const fieldMapper = {
  getSmartAnswers,
  toDB: mapToDatabase,
  fromDB: mapFromDatabase,
};

export default fieldMapper;
