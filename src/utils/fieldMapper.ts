/**
 * Simple field mapping utilities for user data
 */

import type { QuestionnaireData } from "../features/questionnaire/types";
import { logger } from "./logger";

/**
 * Extract smart questionnaire answers from user data
 */
export const getSmartAnswers = (
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
export const mapToDatabase = (
  data: Record<string, unknown>
): Record<string, unknown> => {
  if (!data || typeof data !== "object") return data;

  const mapped: Record<string, unknown> = {};

  // Check if we need to infer hasQuestionnaire from questionnaireData
  const hasQuestionnaireData = !!data.questionnaireData;
  const hasExplicitQuestionnaire = "hasQuestionnaire" in data;

  // If questionnaireData exists but hasQuestionnaire isn't explicitly set, set it to true
  if (hasQuestionnaireData && !hasExplicitQuestionnaire) {
    logger.info(
      "FieldMapper",
      "Auto-setting hasQuestionnaire to true based on questionnaireData"
    );
    mapped["has_questionnaire"] = true;
  }

  for (const [key, value] of Object.entries(data)) {
    // מיפוי שמות שדות מיוחדים
    if (key === "hasQuestionnaire") {
      mapped["has_questionnaire"] = value;
      logger.debug("FieldMapper", `Mapped '${key}' -> 'has_questionnaire'`);
    } else if (key === "questionnaireData") {
      // המר אובייקט ל-JSON אם צריך
      mapped["questionnaire_data"] =
        typeof value === "string" ? value : JSON.stringify(value);
      logger.debug("FieldMapper", `Mapped '${key}' -> 'questionnaire_data'`);
    } else if (key === "activityHistory") {
      mapped["activity_history"] =
        typeof value === "string" ? value : JSON.stringify(value);
      logger.debug("FieldMapper", `Mapped '${key}' -> 'activity_history'`);
    }
    // השתמש בשם השדה כמו שהוא לרוב השדות
    else {
      mapped[key] = value;
    }
  }

  logger.debug("FieldMapper", "Mapped to database", mapped);
  return mapped;
};

/**
 * Convert lowercase fields to camelCase for runtime use
 */
export const mapFromDatabase = (
  data: Record<string, unknown>
): Record<string, unknown> => {
  if (!data || typeof data !== "object") return data;

  const mapped = { ...data };

  // מיפוי שמות שדות מיוחדים מהדאטאבייס לפורמט האפליקציה
  if ("questionnaire_data" in data) {
    try {
      // המר JSON למבנה נתונים אם צריך
      const questData = data.questionnaire_data;
      mapped.questionnaireData =
        typeof questData === "string"
          ? JSON.parse(questData as string)
          : questData;
      logger.debug(
        "FieldMapper",
        `Mapped 'questionnaire_data' -> 'questionnaireData'`
      );
    } catch (e) {
      console.error("Error parsing questionnaire_data:", e);
      mapped.questionnaireData = data.questionnaire_data;
    }
    // מחק את השדה המקורי
    delete mapped.questionnaire_data;
  }

  if ("has_questionnaire" in data) {
    mapped.hasQuestionnaire = Boolean(data.has_questionnaire);
    logger.debug(
      "FieldMapper",
      `Mapped 'has_questionnaire' -> 'hasQuestionnaire'`
    );
    delete mapped.has_questionnaire;
  }

  if ("activity_history" in data) {
    try {
      // המר JSON למבנה נתונים אם צריך
      const histData = data.activity_history;
      mapped.activityHistory =
        typeof histData === "string"
          ? JSON.parse(histData as string)
          : histData;
      logger.debug(
        "FieldMapper",
        `Mapped 'activity_history' -> 'activityHistory'`
      );
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
