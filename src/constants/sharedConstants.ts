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
