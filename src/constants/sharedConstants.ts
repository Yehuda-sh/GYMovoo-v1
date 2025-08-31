/**
 * @file src/constants/sharedConstants.ts
 * @brief קבועים משותפים לכל האפליקציה
 * @features ריכוז קבועים, מניעת כפילויות, שיפור תחזוקתיות
 */

// 🎨 SHARED ICON SIZES - גדלי אייקונים משותפים
export const SHARED_ICON_SIZES = {
  // Basic sizes - גדלים בסיסיים
  EXTRA_SMALL: 12,
  SMALL: 14,
  SMALL_MEDIUM: 16,
  MEDIUM: 20,
  MEDIUM_LARGE: 24,
  LARGE: 28,
  EXTRA_LARGE: 32,

  // Specific use cases - שימושים ספציפיים
  EQUIPMENT: 20,
  FOCUS: 16,
  COMPLETED: 20,
  STATS: 14,
  MENU: 24,
  CHEVRON: 24,
  BUTTON_ICON: 20,
  HEADER_ICON: 24,
  TAB_BAR: 24,
} as const;

// 🔊 VIBRATION TYPES - סוגי רטט משותפים
export const SHARED_VIBRATION_TYPES = {
  SHORT: "short" as const,
  MEDIUM: "medium" as const,
  DOUBLE: "double" as const,
  LONG: "long" as const,
  START: "start" as const,
} as const;

// 🎭 ANIMATION CONSTANTS - קבועי אנימציה
export const SHARED_ANIMATION = {
  INPUT_RANGE: [0, 1] as [number, number],
  DURATION: {
    SHORT: 200,
    MEDIUM: 300,
    LONG: 500,
  },
  EASING: {
    EASE_IN_OUT: "ease-in-out",
    EASE_IN: "ease-in",
    EASE_OUT: "ease-out",
  },
} as const;

// ♿ ACCESSIBILITY STRINGS - מחרוזות נגישות משותפות
export const SHARED_ACCESSIBILITY = {
  BUTTONS: {
    CLOSE: "סגור",
    BACK: "חזור",
    MENU: "תפריט",
    EDIT: "עריכה",
    DELETE: "מחיקה",
    SAVE: "שמירה",
    CANCEL: "ביטול",
    CONFIRM: "אישור",
  },
  LABELS: {
    LOADING: "טוען...",
    ERROR: "שגיאה",
    SUCCESS: "הצלחה",
    WARNING: "אזהרה",
    INFO: "מידע",
  },
  ROLES: {
    BUTTON: "button" as const,
    TEXT: "text" as const,
    IMAGE: "image" as const,
    HEADER: "header" as const,
    PROGRESS_BAR: "progressbar" as const,
  },
} as const;

// 🎨 MODAL STRINGS - מחרוזות מודאלים משותפות
export const SHARED_MODAL_STRINGS = {
  DELETE: {
    TITLE: "מחיקה",
    CONFIRM_TEXT: "מחק",
    CANCEL_TEXT: "ביטול",
  },
  SAVE: {
    TITLE: "שמירה",
    CONFIRM_TEXT: "שמור",
    CANCEL_TEXT: "ביטול",
  },
  EXIT: {
    TITLE: "יציאה",
    CONFIRM_TEXT: "צא",
    CANCEL_TEXT: "הישאר",
  },
} as const;

// 🔄 DATA MANAGER CONSTANTS - קבועי מנהל נתונים
export const DATA_MANAGER_CONSTANTS = {
  // Server sync intervals (minutes)
  SYNC_INTERVAL_DEFAULT: 30,
  SYNC_INTERVAL_MIN: 5,
  SYNC_INTERVAL_MAX: 1440, // 24 hours

  // Cache settings
  CACHE_TTL_MINUTES: 60,
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY_MS: 1000,

  // Health check settings
  HEALTH_CHECK_TIMEOUT_MS: 5000,
  HEALTH_CHECK_RETRIES: 2,

  // Error messages
  ERRORS: {
    INVALID_USER: "Invalid user data provided",
    INITIALIZATION_FAILED: "DataManager initialization failed",
    SERVER_UNREACHABLE: "Server is unreachable",
    CACHE_NOT_INITIALIZED: "Cache not initialized",
    INVALID_CONFIG: "Invalid server configuration",
  },
} as const;
