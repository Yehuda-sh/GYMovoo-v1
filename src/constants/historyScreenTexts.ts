/**
 * @fileoverview קבצי טקסטים וקונסטנטים עבור מסך היסטוריית אימונים
 * @version 2025.1
 * @author GYMovoo Development Team
 */

export const HISTORY_SCREEN_TEXTS = {
  // כותרות עיקריות
  SCREEN_TITLE: "היסטוריית אימונים",
  STATISTICS_TITLE: "📊 סטטיסטיקות",

  // הודעות שגיאה
  ERROR_TITLE: "שגיאה",
  ERROR_LOADING_HISTORY: "לא ניתן לטעון את היסטוריית האימונים",
  ERROR_LOADING_STATISTICS: "❌ Error loading statistics:",
  ERROR_LOADING_CONGRATULATION: "Error loading congratulation message:",

  // הודעות טעינה
  LOADING_MAIN: "טוען היסטוריה...",
  LOADING_MORE: "טוען עוד...",
  LOADING_SUBTEXT: "מאחזר נתוני אימונים קודמים",

  // מצב ריק
  EMPTY_STATE_TITLE: "אין עדיין אימונים שמורים",
  EMPTY_STATE_DESCRIPTION:
    "לאחר סיום אימון, לחץ על 'שמור אימון ומשוב' כדי לראות את ההיסטוריה שלך כאן. האימונים הבאים שלך יופיעו כאן עם פרטים מלאים וסטטיסטיקות.",
  EMPTY_ACTION_TEXT: "בואו נתחיל לאמן!",

  // תאריכים ושגיאות
  INVALID_DATE_FALLBACK: "תאריך לא זמין",
  DATE_UNKNOWN: "תאריך לא ידוע",

  // תוויות סטטיסטיקה
  STAT_TOTAL_WORKOUTS: 'סה"כ אימונים',
  STAT_AVERAGE_DIFFICULTY: "קושי ממוצע",
  STAT_MY_WORKOUTS: "האימונים שלי",

  // פרטי אימון
  WORKOUT_DEFAULT_NAME: "אימון",
  WORKOUT_DURATION_UNIT: "דק'",
  WORKOUT_EXERCISES_LABEL: "תרגילים",
  WORKOUT_SETS_COMPLETED: "סטים",
  WORKOUT_PERSONAL_RECORDS: "שיאים",

  // משוב על אימון
  FEEDBACK_DIFFICULTY_LABEL: "קושי:",
  FEEDBACK_FEELING_LABEL: "הרגשה:",

  // ניווט ועמוד נוסף
  LOAD_MORE_HINT: "גלול למטה לראות עוד אימונים",
  PROGRESS_TEXT_TEMPLATE: "נטענו {loaded} מתוך {total} אימונים ({percentage}%)",

  // הודעות קונסול (לצורך דיבוג)
  CONSOLE_ERROR_HISTORY: "❌ Error loading history:",
  CONSOLE_ERROR_STATISTICS: "❌ Error loading statistics:",
  CONSOLE_ERROR_CONGRATULATION: "Error loading congratulation message:",
} as const;

export const HISTORY_SCREEN_ACCESSIBILITY = {
  // מזהים לבדיקות
  MAIN_LOADING_TEST_ID: "history-main-loading",
  LOADING_MORE_TEST_ID: "history-loading-more",
  EMPTY_STATE_TEST_ID: "history-empty-state",

  // תוויות נגישות
  LOADING_SPINNER_LABEL: "טוען נתוני היסטוריה",
  STATISTICS_CARD_LABEL: "כרטיס סטטיסטיקות אימונים",
  WORKOUT_CARD_LABEL: "כרטיס פרטי אימון",
  PROGRESS_BAR_LABEL: "מחוון התקדמות טעינת נתונים",
} as const;

export const HISTORY_SCREEN_ICONS = {
  // אייקונים עיקריים
  TROPHY: "trophy",
  CLOCK: "clock",
  DUMBBELL: "dumbbell",
  CHECK_CIRCLE: "check-circle",
  TIME_OUTLINE: "time-outline",

  // אייקונים למצבים שונים
  MALE_ICON: "gender-male",
  FEMALE_ICON: "gender-female",
  OTHER_ICON: "gender-transgender",
} as const;
