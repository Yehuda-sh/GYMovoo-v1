/**
 * @fileoverview קונסטנטים עבור מסך היסטוריית אימונים
 * @updated 2025-09-11 פישוט משמעותי - הסרת over-engineering
 */

export const HISTORY_SCREEN_CONFIG = {
  // הגדרות בסיסיות
  ITEMS_PER_PAGE: 10,
  DEFAULT_WORKOUT_DURATION: 3600, // 60 דקות בשניות
  DEFAULT_DIFFICULTY_RATING: 3,
  DEFAULT_MOOD: "😐",

  // הגדרות ממשק משתמש
  ANIMATION_DURATION: 300,
  MIN_DIFFICULTY: 1,
  MAX_DIFFICULTY: 5,
} as const;

export const HISTORY_SCREEN_TEXTS = {
  // כותרות ראשיות
  HEADERS: {
    MAIN_TITLE: "היסטוריית אימונים",
    SUBTITLE: "עקוב אחרי ההתקדמות שלך",
    STATISTICS: "סטטיסטיקות",
  },

  // הודעות טעינה ומצב ריק
  LOADING_MAIN: "טוען היסטוריה...",
  EMPTY_STATE_TITLE: "אין עדיין אימונים שמורים",
  EMPTY_STATE_DESCRIPTION:
    "לאחר סיום אימון, לחץ על 'שמור אימון ומשוב' כדי לראות את ההיסטוריה שלך כאן.",

  // פרטי אימון
  WORKOUT_DEFAULT_NAME: "אימון",
  FEEDBACK_DIFFICULTY_LABEL: "קושי:",
  FEEDBACK_FEELING_LABEL: "הרגשה:",

  // סטטיסטיקות
  STAT_TOTAL_WORKOUTS: 'סה"כ אימונים',
  STAT_AVERAGE_DIFFICULTY: "קושי ממוצע",

  // יחידות מידה
  UNITS: {
    MINUTES: "דקות",
    HOURS: "שעות",
    DAYS: "ימים",
  },
} as const;

// פונקציות עזר בסיסיות
export const HISTORY_SCREEN_HELPERS = {
  /**
   * פונקציה לעיצוב משך זמן
   */
  formatDuration: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")} ${HISTORY_SCREEN_TEXTS.UNITS.HOURS}`;
    }
    return `${minutes} ${HISTORY_SCREEN_TEXTS.UNITS.MINUTES}`;
  },

  /**
   * פונקציה לקבלת טקסט מצב רוח
   */
  getMoodText: (mood: string): string => {
    const moodMap: Record<string, string> = {
      "😀": "מצוין",
      "🙂": "טוב",
      "😐": "נייטרלי",
      "😴": "עייף",
      "😣": "כואב",
    };
    return moodMap[mood] || mood;
  },
} as const;
