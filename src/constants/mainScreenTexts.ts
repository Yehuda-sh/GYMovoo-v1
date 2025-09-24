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
    SELECT_DAY_RECOMMENDED: (day: number) => {
      const letters = ["A", "B", "C", "D", "E", "F", "G"];
      const dayLetter = letters[day - 1] || `יום ${day}`;
      return `בחר יום אימון ספציפי - מומלץ אימון ${dayLetter}`;
    },
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

/**
 * Get greeting based on time of day
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
 * Get workout type name for day - עדכון לתיאורים משופרים
 */
export const getDayWorkoutType = (dayNum: number): string => {
  const types = {
    1: MAIN_SCREEN_TEXTS.WORKOUT_TYPES.CHEST_TRICEPS, // A: חזה + זרועות
    2: MAIN_SCREEN_TEXTS.WORKOUT_TYPES.BACK_BICEPS, // B: גב + זרועות
    3: MAIN_SCREEN_TEXTS.WORKOUT_TYPES.LEGS, // C: רגליים + ליבה
    4: MAIN_SCREEN_TEXTS.WORKOUT_TYPES.SHOULDERS_CORE, // D: כתפיים + ליבה
    5: MAIN_SCREEN_TEXTS.WORKOUT_TYPES.FULL_BODY, // E: כל הגוף
    6: MAIN_SCREEN_TEXTS.WORKOUT_TYPES.CARDIO, // F: קרדיו
    7: MAIN_SCREEN_TEXTS.WORKOUT_TYPES.UPPER_BODY, // G: גוף עליון
  };

  return (
    types[dayNum as keyof typeof types] ||
    MAIN_SCREEN_TEXTS.WORKOUT_TYPES.GENERAL
  );
};

export default MAIN_SCREEN_TEXTS;
