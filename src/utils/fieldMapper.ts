/**
 * @file /src/utils/fieldMapper.ts
 * @description Simple field mapping utilities for user data (safe, typed)
 */

import type { QuestionnaireData } from "../features/questionnaire/types";
import { logger } from "./logger";

type DBRecord = Record<string, unknown>;
type AppRecord = Record<string, unknown>;

/**
 * Extract smart questionnaire answers from user-like object
 */
const getSmartAnswers = (
  user: unknown
): QuestionnaireData["answers"] | null => {
  if (!user || typeof user !== "object") return null;
  const u = user as {
    questionnaireData?: QuestionnaireData | null | undefined;
  };
  const qd = u.questionnaireData;
  if (!qd || typeof qd !== "object") return null;
  return qd.answers ?? null;
};

/**
 * Convert selected camelCase fields to snake_case for database storage.
 * Notes:
 * - Only maps known heavy/structured fields to JSON strings.
 * - Adds has_questionnaire=true if questionnaireData exists and flag not provided.
 */
const mapToDatabase = (data: AppRecord): DBRecord => {
  if (!data || typeof data !== "object") return {};

  const mapped: DBRecord = {};

  const hasQuestionnaireData =
    Object.prototype.hasOwnProperty.call(data, "questionnaireData") &&
    data.questionnaireData != null;
  const hasExplicitQuestionnaire = Object.prototype.hasOwnProperty.call(
    data,
    "hasQuestionnaire"
  );

  // Auto-derive has_questionnaire when questionnaireData exists but no explicit flag
  if (hasQuestionnaireData && !hasExplicitQuestionnaire) {
    mapped.has_questionnaire = true;
  }

  for (const [key, value] of Object.entries(data)) {
    switch (key) {
      case "hasQuestionnaire": {
        mapped.has_questionnaire = value;
        break;
      }
      case "questionnaireData": {
        // Store as JSON string (idempotent if already a string)
        mapped.questionnaire_data =
          typeof value === "string"
            ? value
            : safeStringify(value, "questionnaire_data");
        break;
      }
      case "activityHistory": {
        mapped.activity_history =
          typeof value === "string"
            ? value
            : safeStringify(value, "activity_history");
        break;
      }
      default: {
        // Pass-through for all other fields (unchanged key)
        mapped[key] = value;
        break;
      }
    }
  }

  return mapped;
};

/**
 * Convert selected snake_case fields to camelCase for app runtime.
 * Notes:
 * - Parses JSON strings back to objects where relevant.
 */
const mapFromDatabase = (data: DBRecord): AppRecord => {
  if (!data || typeof data !== "object") return {};

  const mapped: AppRecord = { ...data };

  if (Object.prototype.hasOwnProperty.call(data, "questionnaire_data")) {
    try {
      const questData = data.questionnaire_data;
      mapped.questionnaireData =
        typeof questData === "string" ? JSON.parse(questData) : questData;
    } catch (e) {
      logger.error("FieldMapper", "Error parsing questionnaire_data", e);
      mapped.questionnaireData = (data as AppRecord).questionnaire_data;
    }
    delete (mapped as AppRecord).questionnaire_data;
  }

  if (Object.prototype.hasOwnProperty.call(data, "has_questionnaire")) {
    mapped.hasQuestionnaire = Boolean((data as AppRecord).has_questionnaire);
    delete (mapped as AppRecord).has_questionnaire;
  }

  if (Object.prototype.hasOwnProperty.call(data, "activity_history")) {
    try {
      const histData = (data as AppRecord).activity_history;
      mapped.activityHistory =
        typeof histData === "string" ? JSON.parse(histData) : histData;
    } catch (e) {
      logger.error("FieldMapper", "Error parsing activity_history", e);
      mapped.activityHistory = (data as AppRecord).activity_history;
    }
    delete (mapped as AppRecord).activity_history;
  }

  return mapped;
};

/** Safe JSON.stringify with consistent error logging */
const safeStringify = (value: unknown, fieldName: string): string => {
  try {
    return JSON.stringify(value);
  } catch (e) {
    logger.error("FieldMapper", `Failed to stringify ${fieldName}`, e);
    // Fallback: store a minimal string to avoid throwing
    return `"${String(value)}"`;
  }
};

/**
 * Field mapper object (backward-compatible API)
 */
export const fieldMapper = {
  getSmartAnswers,
  toDB: mapToDatabase,
  fromDB: mapFromDatabase,
};

export default fieldMapper;
