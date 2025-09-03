/**
 * Simple field mapping utilities for user data
 */

import type { SmartQuestionnaireData } from "../types";

/**
 * Extract smart questionnaire answers from user data
 */
export const getSmartAnswers = (user: unknown): SmartQuestionnaireData["answers"] | null => {
  if (!user || typeof user !== "object") return null;

  const u = user as Record<string, unknown>;
  
  // Try both camelCase and lowercase variants
  const smartData = u.smartQuestionnaireData || u.smartquestionnairedata;
  
  if (!smartData || typeof smartData !== "object") return null;
  
  const data = smartData as Record<string, unknown>;
  const answers = data.answers;
  
  if (!answers || typeof answers !== "object") return null;
  
  return answers as SmartQuestionnaireData["answers"];
};

/**
 * Convert camelCase fields to lowercase for database
 */
export const mapToDatabase = (data: Record<string, unknown>): Record<string, unknown> => {
  if (!data || typeof data !== "object") return data;

  const mapped: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (key === "smartQuestionnaireData") {
      mapped["smartquestionnairedata"] = value;
    } else if (key === "activityHistory") {
      mapped["activityhistory"] = value;
    } else {
      mapped[key] = value;
    }
  }
  
  return mapped;
};

/**
 * Convert lowercase fields to camelCase for runtime use
 */
export const mapFromDatabase = (data: Record<string, unknown>): Record<string, unknown> => {
  if (!data || typeof data !== "object") return data;

  const mapped = { ...data };
  
  if ("smartquestionnairedata" in data && !("smartQuestionnaireData" in data)) {
    mapped.smartQuestionnaireData = data.smartquestionnairedata;
  }
  
  if ("activityhistory" in data && !("activityHistory" in data)) {
    mapped.activityHistory = data.activityhistory;
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
