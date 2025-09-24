/**
 * @file mainScreenTexts.ts
 * @brief Constant texts for MainScreen
 */

export const MAIN_SCREEN_TEXTS = {
  // Welcome section
  WELCOME: {
    GOOD_MORNING: "בוקר טוב,",
    GOOD_AFTERNOON: "צהריים טובים,",
    GOOD_EVENING: "ערב טוב,",
    READY_TO_WORKOUT: "מוכן לאימון?",
  },

  // Statistics labels
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

  // Section titles
  SECTIONS: {
    SCIENTIFIC_DATA: "הנתונים המדעיים שלך",
    YOUR_STATUS: "הסטטוס שלך",
    RECENT_WORKOUTS: "אימונים אחרונים",
    SELECT_DAY: "בחר יום אימון ספציפי",
    SELECT_DAY_RECOMMENDED: (day: number) =>
      `בחר יום אימון ספציפי - מומלץ אימון ${["A", "B", "C", "D", "E", "F", "G"][day - 1] || `יום ${day}`}`,
  },

  // Workout types - עדכון לתיאורים דינמיים
  WORKOUT_TYPES: {
    CHEST_TRICEPS: "חזה + זרועות",
    BACK_BICEPS: "גב + זרועות",
    LEGS: "רגליים + ליבה",
    SHOULDERS_CORE: "כתפיים + ליבה",
    UPPER_BODY: "גוף עליון",
    LOWER_BODY: "גוף תחתון",
    FULL_BODY: "כל הגוף",
    CARDIO: "קרדיו",
    STRENGTH: "אימון כח",
    GENERAL: "אימון כללי",
  },

  // Action buttons
  ACTIONS: {
    START_QUICK_WORKOUT: "התחל אימון מהיר",
    VIEW_ALL_HISTORY: "צפה בכל ההיסטוריה",
    TRY_AGAIN: "נסה שוב",
    WORKOUTS: "אימונים",
  },

  // Loading and error states
  STATUS: {
    LOADING_DATA: "טוען נתונים...",
    NO_USER_FOUND: "לא נמצא משתמש פעיל",
    DATA_LOAD_ERROR: "שגיאה בטעינת נתונים",
    NO_RECENT_WORKOUTS: "אין לך עדיין אימונים אחרונים",
    START_FIRST_WORKOUT: "התחל את האימון הראשון שלך כדי לראות היסטוריה כאן",
  },

  // Accessibility labels
  A11Y: {
    PROFILE_BUTTON: "כפתור פרופיל משתמש",
    QUICK_WORKOUT: "התחל אימון מהיר",
    QUICK_WORKOUT_HINT: "לחץ להתחלת אימון מהיר מותאם אישית",
    VIEW_HISTORY: "צפה בכל ההיסטוריה",
    VIEW_HISTORY_HINT: "לחץ לצפייה בהיסטוריית האימונים המלאה",
  },
} as const;

// ========== פונקציות עזר - פושטו לפי המתודולוגיה שלנו ==========
// מיושמות השאלות: "למה הפונקציה הזאת כל כך מורכבת?" ו"אפשר לעשות את זה בשורה אחת?"

/**
 * Get greeting based on time of day
 * שאלה: "אפשר לעשות את זה בשורה אחת?" - כן!
 */
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  const { GOOD_MORNING, GOOD_AFTERNOON, GOOD_EVENING } =
    MAIN_SCREEN_TEXTS.WELCOME;

  return hour < 12 ? GOOD_MORNING : hour < 18 ? GOOD_AFTERNOON : GOOD_EVENING;
};

/**
 * Get workout type name for day - פושט לטבלה ישירה
 * שאלה: "למה הפונקציה הזאת כל כך מורכבת?" - עכשיו היא לא!
 */
export const getDayWorkoutType = (dayNum: number): string => {
  const {
    CHEST_TRICEPS,
    BACK_BICEPS,
    LEGS,
    SHOULDERS_CORE,
    FULL_BODY,
    CARDIO,
    UPPER_BODY,
    GENERAL,
  } = MAIN_SCREEN_TEXTS.WORKOUT_TYPES;

  const workoutTypes = [
    CHEST_TRICEPS, // 1: A - חזה + זרועות
    BACK_BICEPS, // 2: B - גב + זרועות
    LEGS, // 3: C - רגליים + ליבה
    SHOULDERS_CORE, // 4: D - כתפיים + ליבה
    FULL_BODY, // 5: E - כל הגוף
    CARDIO, // 6: F - קרדיו
    UPPER_BODY, // 7: G - גוף עליון
  ];

  return workoutTypes[dayNum - 1] || GENERAL;
};

export default MAIN_SCREEN_TEXTS;
