// Centralized AsyncStorage keys
export const StorageKeys = {
  USER_GENDER_PREFERENCE: "user_gender_preference",
  QUESTIONNAIRE_METADATA: "questionnaire_metadata",
  USER_PERSISTENCE: "user-storage",
  LAST_USER_ID: "lastUserId",
  LAST_EMAIL: "app_last_email",
  SMART_QUESTIONNAIRE_RESULTS: "smart_questionnaire_results", // legacy persisted smart questionnaire blob
  SELECTED_EQUIPMENT: "selected_equipment", // normalized equipment selection
  GENDER_ADAPTATION_DATA: "gender_adaptation_data", // cached gender adaptation info
  WORKOUT_HISTORY: "workout_history", // local workout history storage
  TERMS_AGREEMENT: "terms_agreement", // מסמך הסכמה לתנאי השימוש
  USER_LOGGED_OUT: "user_logged_out",
  // Settings and Cache keys
  APP_SETTINGS: "app_settings", // user preferences and app settings
  WORKOUT_CACHE: "workout_cache", // temporary workout data cache
  EXERCISE_CACHE: "exercise_cache", // temporary exercise data cache
  PROGRESS_CACHE: "progress_cache", // temporary progress data cache
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
