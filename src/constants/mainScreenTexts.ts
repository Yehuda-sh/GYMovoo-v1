/**
 * @file src/constants/mainScreenTexts.ts
 * @brief טקסטים קבועים למסך הראשי - MainScreen
 * @brief Constant texts for MainScreen
 * @features טקסטים מרוכזים, תמיכה RTL, דו-לשוני
 * @features Centralized texts, RTL support, bilingual
 * @version 1.2.0 - Simplified and cleaned up unnecessary components
 * @created 2025-08-06
 * @updated 2025-09-11 - הסרת חלקים מיותרים, פישוט קובץ
 */

// ===============================================
// 🌍 Main Screen Texts - טקסטים מסך ראשי
// ===============================================

export const MAIN_SCREEN_TEXTS = {
  // Welcome section // קטע ברוכים הבאים
  WELCOME: {
    GOOD_MORNING: "בוקר טוב,",
    GOOD_AFTERNOON: "צהריים טובים,",
    GOOD_EVENING: "ערב טוב,",
    READY_TO_WORKOUT: "מוכן לאימון?",
    // DEMO_USER הוסר – אין דמו מצד לקוח
  },

  // Statistics labels // תוויות סטטיסטיקות
  STATS: {
    WORKOUTS_COMPLETED: "אימונים הושלמו",
    STREAK_DAYS: "ימי רצף",
    TOTAL_VOLUME: "נפח כולל",
    AVERAGE_RATING: "דירוג ממוצע",
    WEEKLY_GOAL: "מטרת שבועית",
    CURRENT_STREAK: "רצף נוכחי",
    TOTAL_WORKOUTS: 'סה"כ אימונים',
    FITNESS_LEVEL: "רמת כושר:",
    DAYS: "ימים",
  },

  // Fitness levels // רמות כושר
  FITNESS_LEVELS: {
    BEGINNER: "מתחיל",
    INTERMEDIATE: "בינוני",
    ADVANCED: "מתקדם",
    EXPERT: "מומחה",
  },

  // Section titles // כותרות קטעים
  SECTIONS: {
    SCIENTIFIC_DATA: "הנתונים המדעיים שלך",
    NEXT_WORKOUT: "האימון הבא שלך",
    YOUR_STATUS: "הסטטוס שלך",
    RECENT_WORKOUTS: "אימונים אחרונים",
    SELECT_DAY: "בחר יום אימון ספציפי",
    SELECT_DAY_RECOMMENDED: (day: number) =>
      `בחר יום אימון ספציפי - מומלץ יום ${day}`,
    QUESTIONNAIRE_DETAILS: "הפרטים שלך מהשאלון המדעי",
  },

  // Workout types // סוגי אימונים
  WORKOUT_TYPES: {
    CHEST: "חזה",
    CHEST_TRICEPS: "חזה + טריצפס",
    BACK_BICEPS: "גב + ביצפס",
    LEGS: "רגליים",
    SHOULDERS_CORE: "כתפיים + ליבה",
    STRENGTH: "אימון כח",
    GENERAL: "אימון כללי",
    WELCOME_PROGRAM: "ברוכים הבאים! התחלת תוכנית האימונים",
  },

  // Action buttons // כפתורי פעולה
  ACTIONS: {
    START_QUICK_WORKOUT: "התחל אימון מהיר",
    VIEW_ALL_HISTORY: "צפה בכל ההיסטוריה",
    TRY_AGAIN: "נסה שוב",
    WEEK: "שבוע",
    WORKOUTS: "אימונים",
    ACHIEVEMENT: "הישג",
    CONTINUE: "המשך",
    PAUSE: "השהה",
    STOP: "עצור",
    SAVE: "שמור",
    CANCEL: "ביטול",
    EDIT: "ערוך",
    DELETE: "מחק",
    SHARE: "שתף",
  },

  // Loading and error states // מצבי טעינה ושגיאה
  STATUS: {
    LOADING_DATA: "טוען נתונים...",
    NO_USER_FOUND: "לא נמצא משתמש פעיל",
    DATA_LOAD_ERROR: "שגיאה בטעינת נתונים",
    NO_RECENT_WORKOUTS: "אין לך עדיין אימונים אחרונים",
    START_FIRST_WORKOUT: "התחל את האימון הראשון שלך כדי לראות היסטוריה כאן",
    NETWORK_ERROR: "שגיאת רשת - בדוק חיבור אינטרנט",
    SERVER_ERROR: "שגיאת שרת - נסה שוב מאוחר יותר",
    NO_DATA_AVAILABLE: "אין נתונים זמינים",
  },

  // DEMO_WORKOUTS הוסר – אין דמו מצד לקוח

  // Progress displays // תצוגות התקדמות
  PROGRESS: {
    PERCENTAGE: "%",
    MINUTES: "דקות",
    DAYS_WEEK: "ימים בשבוע",
    PER_WEEK: "בשבוע",
    HOURS: "שעות",
    KG: "ק״ג",
    LBS: "ליברות",
    CALORIES: "קלוריות",
  },

  // Accessibility labels // תוויות נגישות
  A11Y: {
    PROFILE_BUTTON: "כפתור פרופיל משתמש",
    PROFILE_HINT: "לחץ לצפייה ועריכת הפרופיל האישי",
    QUICK_WORKOUT: "התחל אימון מהיר",
    QUICK_WORKOUT_HINT: "לחץ להתחלת אימון מהיר מותאם אישית",
    VIEW_HISTORY: "צפה בכל ההיסטוריה",
    VIEW_HISTORY_HINT: "לחץ לצפייה בהיסטוריית האימונים המלאה",
    DAY_WORKOUT: (day: number) => `יום ${day} אימון`,
    DAY_WORKOUT_HINT: (day: number, type: string) =>
      `לחץ להתחלת אימון יום ${day} - ${type}`,
  },
} as const;

// ===============================================
// 🎯 Helper Functions - פונקציות עזר
// ===============================================

/**
 * Get greeting based on time of day
 * קבלת ברכה לפי שעה ביום
 */
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return MAIN_SCREEN_TEXTS.WELCOME.GOOD_MORNING;
  } else if (hour < 18) {
    return MAIN_SCREEN_TEXTS.WELCOME.GOOD_AFTERNOON;
  } else {
    return MAIN_SCREEN_TEXTS.WELCOME.GOOD_EVENING;
  }
};

/**
 * Get workout type name for day
 * קבלת שם סוג אימון ליום
 */
export const getDayWorkoutType = (dayNum: number): string => {
  const types = {
    1: MAIN_SCREEN_TEXTS.WORKOUT_TYPES.CHEST_TRICEPS,
    2: MAIN_SCREEN_TEXTS.WORKOUT_TYPES.BACK_BICEPS,
    3: MAIN_SCREEN_TEXTS.WORKOUT_TYPES.LEGS,
    4: MAIN_SCREEN_TEXTS.WORKOUT_TYPES.SHOULDERS_CORE,
  };

  return (
    types[dayNum as keyof typeof types] ||
    MAIN_SCREEN_TEXTS.WORKOUT_TYPES.GENERAL
  );
};

export default MAIN_SCREEN_TEXTS;
