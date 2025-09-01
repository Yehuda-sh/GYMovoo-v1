// =======================================
// 🎯 User Store Constants
// קבועים עבור userStore
// =======================================

export const USER_STORE_CONSTANTS = {
  // AsyncStorage Keys
  STORAGE_KEYS: {
    USER_DATA: "user_data",
    USER_PREFERENCES: "user_preferences",
    LAST_SYNC: "last_sync_timestamp",
  },

  // Demo User Defaults
  DEMO_USER: {
    ID_PREFIX: "demo_",
    DEFAULT_NAME: "משתמש דמו",
    DEFAULT_GENDER: "other",
    DEFAULT_AGE: 30, // Updated to match existing usage
    DEFAULT_HEIGHT: 170,
    DEFAULT_WEIGHT: 70,
    DEFAULT_EXPERIENCE: "intermediate",
    DEFAULT_AVAILABLE_DAYS: 3, // Updated to match User type (number)
    DEFAULT_PREFERRED_TIME: "evening",
    DEFAULT_SESSION_DURATION: "60",
  },

  // Trial & Subscription
  SUBSCRIPTION: {
    TRIAL_DAYS: 7,
    TRIAL_TYPE: "trial",
    PREMIUM_TYPE: "premium",
    FREE_TYPE: "free",
  },

  // Sync Configuration
  SYNC: {
    DEBOUNCE_MS: 800, // Updated to match existing usage
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY_MS: 1000,
  },

  // Cache settings
  CACHE: {
    MEMO_CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  },

  // Frequency parsing
  FREQUENCY_PATTERN: /_days$/,

  // Validation
  VALIDATION: {
    MIN_QUESTIONNAIRE_ANSWERS: 3,
    MAX_RETRY_ATTEMPTS: 3,
  },

  // Development
  DEV: {
    AUTO_CLEAR: false, // Set to true for development auto-clear
    LOG_LEVEL: "debug",
  },

  // Error Messages
  ERRORS: {
    NO_USER: "No user found in store",
    INVALID_USER_ID: "Invalid user ID provided",
    SYNC_FAILED: "Failed to sync with server",
    STORAGE_ERROR: "Storage operation failed",
    VALIDATION_FAILED: "Data validation failed",
  },
} as const;

// =======================================
// 🎯 Type Definitions for Constants
// =======================================

export type DemoUserDefaults = typeof USER_STORE_CONSTANTS.DEMO_USER;
export type SubscriptionConstants = typeof USER_STORE_CONSTANTS.SUBSCRIPTION;
export type SyncConstants = typeof USER_STORE_CONSTANTS.SYNC;
export type ValidationConstants = typeof USER_STORE_CONSTANTS.VALIDATION;
