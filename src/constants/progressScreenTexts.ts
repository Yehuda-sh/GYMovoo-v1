/**
 * @file src/constants/progressScreenTexts.ts
 * @brief קבועי טקסט ממוקדים למסך התקדמות עם תמיכה מלאה ב-RTL
 * @brief Centralized text constants for Progress Screen with full RTL support
 * @dependencies None - standalone constants
 * @notes מנהל כל הטקסטים של מסך ההתקדמות עם תמיכה ב-accessibility ובינאומיות
 * @updated 2025-08-05 יצירה ראשונית עם תמיכה מלאה ב-RTL ונגישות
 */

export const PROGRESS_SCREEN_TEXTS = {
  // Headers and main titles / כותרות ראשיות
  HEADERS: {
    MAIN_TITLE: "מסך התקדמות",
    SUBTITLE: "הנתונים שלך נשמרים ונמצאים ב-WorkoutHistoryService",
  },

  // Information content / תוכן מידע
  INFO: {
    BOX_TITLE: "📊 נתוני התקדמות זמינים:",
    FEATURES: {
      TOTAL_WORKOUTS: "• סך כל האימונים",
      TOTAL_TIME: "• זמן אימון כולל",
      CURRENT_STREAK: "• רצף אימונים נוכחי",
      AVERAGE_RATING: "• דירוג קושי ממוצע",
      PERSONAL_RECORDS: "• שיאים אישיים",
    },
  },

  // Icons and visual elements / אייקונים ואלמנטים ויזואליים
  ICONS: {
    MAIN_CHART: "chart-line-variant" as const,
  },

  // Accessibility labels / תוויות נגישות
  A11Y: {
    MAIN_ICON: "אייקון מסך התקדמות",
    BACK_BUTTON: "חזור למסך הקודם",
    INFO_BOX: "מידע על נתוני התקדמות זמינים",
  },

  // Console and debugging / קונסול ודיבוג
  CONSOLE: {
    SCREEN_LOADED: "📊 ProgressScreen - מסך התקדמות נטען בהצלחה",
    NAVIGATION_BACK: "📊 ProgressScreen - חזרה למסך הקודם",
  },
} as const;

export default PROGRESS_SCREEN_TEXTS;
