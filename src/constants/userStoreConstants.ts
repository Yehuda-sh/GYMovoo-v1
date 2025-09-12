/**
 * @file src/constants/userStoreConstants.ts
 * @brief קבועים עבור userStore
 * @features ניהול קאש, מנוי, סנכרון והגדרות פיתוח
 */

export const USER_STORE_CONSTANTS = {
  // Cache settings - הגדרות קאש
  CACHE: {
    MEMO_CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  },

  // Trial & Subscription - תקופת ניסיון ומנוי
  SUBSCRIPTION: {
    TRIAL_DAYS: 7,
  },

  // Sync Configuration - הגדרות סנכרון
  SYNC: {
    DEBOUNCE_MS: 800,
  },

  // Development - הגדרות פיתוח
  DEV: {
    AUTO_CLEAR: false, // Set to true for development auto-clear
  },
} as const;
