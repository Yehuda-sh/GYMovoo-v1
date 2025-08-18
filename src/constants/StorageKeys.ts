// Centralized AsyncStorage keys
export const StorageKeys = {
  USER_GENDER_PREFERENCE: "user_gender_preference",
  QUESTIONNAIRE_ANSWERS: "questionnaire_answers",
  QUESTIONNAIRE_METADATA: "questionnaire_metadata",
  USER_PERSISTENCE: "user-storage",
  LAST_LOGGED_OUT_USER_ID: "lastLoggedOutUserId",
  TERMS_AGREEMENT: "terms_agreement",
  SAVED_EMAIL: "savedEmail",
  LAST_USER_ID: "lastUserId",
  LAST_EMAIL: "lastEmail",
  WORKOUT_PLANS: "workout_plans",
  WORKOUT_HISTORY: "workout_history",
  SMART_QUESTIONNAIRE_RESULTS: "smart_questionnaire_results", // legacy persisted smart questionnaire blob
  SELECTED_EQUIPMENT: "selected_equipment", // normalized equipment selection
  GENDER_ADAPTATION_DATA: "gender_adaptation_data", // cached gender adaptation info
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
