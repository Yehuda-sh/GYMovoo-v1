// =======================================
// 🎯 User Store Constants
// קבועים עבור userStore
// =======================================

export const USER_STORE_CONSTANTS = {
  // Cache settings
  CACHE: {
    MEMO_CACHE_TTL: 5 * 60 * 1000, // 5 minutes
  },

  // Trial & Subscription
  SUBSCRIPTION: {
    TRIAL_DAYS: 7,
  },

  // Sync Configuration
  SYNC: {
    DEBOUNCE_MS: 800,
  },

  // Development
  DEV: {
    AUTO_CLEAR: false, // Set to true for development auto-clear
  },
} as const;
