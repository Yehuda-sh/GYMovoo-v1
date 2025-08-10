/**
 * @file src/constants/mainScreenTexts.ts
 * @brief טקסטים קבועים למסך הראשי - MainScreen
 * @brief Constant texts for MainScreen
 * @features טקסטים מרוכזים, תמיכה RTL, דו-לשוני
 * @features Centralized texts, RTL support, bilingual
 * @version 1.0.0
 * @created 2025-08-06
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
    DEMO_USER: "משתמש",
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
  },

  // Loading and error states // מצבי טעינה ושגיאה
  STATUS: {
    LOADING_DATA: "טוען נתונים...",
    NO_USER_FOUND: "לא נמצא משתמש פעיל",
    DATA_LOAD_ERROR: "שגיאה בטעינת נתונים",
    NOT_SPECIFIED: "לא צוין",
  },

  // Questionnaire answers // תשובות שאלון
  QUESTIONNAIRE: {
    AGE: "גיל:",
    GENDER: "מין:",
    PRIMARY_GOAL: "מטרה עיקרית:",
    FITNESS_EXPERIENCE: "ניסיון באימונים:",
    WORKOUT_LOCATION: "מיקום אימון:",
    SESSION_DURATION: "זמן לאימון:",
    FREQUENCY: "תדירות:",
    AVAILABLE_EQUIPMENT: "ציוד זמין:",
    HEALTH_STATUS: "מצב בריאותי:",

    // Gender values // ערכי מגדר
    MALE: "גבר",
    FEMALE: "אישה",

    // Goals // מטרות
    LOSE_WEIGHT: "הורדת משקל",
    BUILD_MUSCLE: "בניית שריר",
    IMPROVE_HEALTH: "שיפור בריאות",
    FEEL_STRONGER: "הרגשה חזקה יותר",
    IMPROVE_FITNESS: "שיפור כושר",

    // Experience levels // רמות ניסיון
    COMPLETE_BEGINNER: "מתחיל לחלוטין",
    SOME_EXPERIENCE: "קצת ניסיון",
    INTERMEDIATE: "בינוני",
    ADVANCED: "מתקדם",
    ATHLETE: "ספורטאי",

    // Locations // מקומות
    HOME_ONLY: "בית בלבד",
    GYM_ONLY: "חדר כושר בלבד",
    BOTH: "שניהם",
    OUTDOOR: "חוץ",

    // Equipment // ציוד
    FULL_GYM: "חדר כושר מלא",
    DUMBBELLS: "דמבלים",
    BARBELL: "מוט ומשקולות",
    BODYWEIGHT: "משקל גוף",
    RESISTANCE_BANDS: "גומיות",

    // Health status // מצב בריאותי
    EXCELLENT: "מעולה",
    GOOD: "טוב",
    SOME_ISSUES: "יש כמה בעיות",
    SERIOUS_ISSUES: "בעיות רציניות",

    // Note about demo user // הערה על משתמש דמו
    DEMO_NOTE:
      "השם נוצר אוטומטית למשתמש הדמו. בשאלון האמיתי לא שואלים שם אישי.",
  },

  // Demo workout data // נתוני אימונים דמו
  DEMO_WORKOUTS: [
    {
      name: "אימון חזה וכתפיים",
      date: "אתמול • 45 דקות",
      rating: "4.8",
      icon: "dumbbell" as const,
    },
    {
      name: "רגליים וישבן",
      date: "לפני 3 ימים • 50 דקות",
      rating: "4.5",
      icon: "run" as const,
    },
    {
      name: "גב וביצפס",
      date: "לפני 5 ימים • 40 דקות",
      rating: "4.7",
      icon: "arm-flex" as const,
    },
  ] as const,

  // Progress displays // תצוגות התקדמות
  PROGRESS: {
    PERCENTAGE: "%",
    MINUTES: "דקות",
    DAYS_WEEK: "ימים בשבוע",
    PER_WEEK: "בשבוע",
  },

  // Accessibility labels // תוויות נגישות
  A11Y: {
    PROFILE_BUTTON: "כפתור פרופיל משתמש",
    PROFILE_HINT: "לחץ לצפייה ועריכת הפרופיל האישי",
    DEMO_BUTTON: "כפתור דמו לשינוי נתונים",
    DEMO_HINT: "לחץ לבחירת נתונים חדשים בצורה רנדומלית",
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

/**
 * Format questionnaire answer value
 * פורמט ערך תשובת שאלון
 */
export const formatQuestionnaireValue = (key: string, value: any): string => {
  const { QUESTIONNAIRE } = MAIN_SCREEN_TEXTS;

  // Gender mapping
  if (key === "gender") {
    return value === "male"
      ? QUESTIONNAIRE.MALE
      : value === "female"
        ? QUESTIONNAIRE.FEMALE
        : MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED;
  }

  // Goals mapping
  if (key === "primary_goal") {
    const goalMap: { [key: string]: string } = {
      lose_weight: QUESTIONNAIRE.LOSE_WEIGHT,
      build_muscle: QUESTIONNAIRE.BUILD_MUSCLE,
      improve_health: QUESTIONNAIRE.IMPROVE_HEALTH,
      feel_stronger: QUESTIONNAIRE.FEEL_STRONGER,
      improve_fitness: QUESTIONNAIRE.IMPROVE_FITNESS,
    };
    return goalMap[value] || MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED;
  }

  // Experience mapping
  if (key === "fitness_experience") {
    const expMap: { [key: string]: string } = {
      complete_beginner: QUESTIONNAIRE.COMPLETE_BEGINNER,
      some_experience: QUESTIONNAIRE.SOME_EXPERIENCE,
      intermediate: QUESTIONNAIRE.INTERMEDIATE,
      advanced: QUESTIONNAIRE.ADVANCED,
      athlete: QUESTIONNAIRE.ATHLETE,
    };
    return expMap[value] || MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED;
  }

  // Location mapping
  if (key === "workout_location") {
    const locMap: { [key: string]: string } = {
      home_only: QUESTIONNAIRE.HOME_ONLY,
      gym_only: QUESTIONNAIRE.GYM_ONLY,
      both: QUESTIONNAIRE.BOTH,
      outdoor: QUESTIONNAIRE.OUTDOOR,
    };
    return locMap[value] || MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED;
  }

  // Health status mapping
  if (key === "health_status") {
    const healthMap: { [key: string]: string } = {
      excellent: QUESTIONNAIRE.EXCELLENT,
      good: QUESTIONNAIRE.GOOD,
      some_issues: QUESTIONNAIRE.SOME_ISSUES,
      serious_issues: QUESTIONNAIRE.SERIOUS_ISSUES,
    };
    return healthMap[value] || MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED;
  }

  // Equipment mapping
  if (key === "available_equipment" && Array.isArray(value)) {
    const equipMap: { [key: string]: string } = {
      full_gym: QUESTIONNAIRE.FULL_GYM,
      dumbbells: QUESTIONNAIRE.DUMBBELLS,
      barbell: QUESTIONNAIRE.BARBELL,
      bodyweight: QUESTIONNAIRE.BODYWEIGHT,
      resistance_bands: QUESTIONNAIRE.RESISTANCE_BANDS,
    };
    return (
      value.map((eq) => equipMap[eq] || eq).join(", ") ||
      MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED
    );
  }

  // Duration and frequency with units
  if (key === "session_duration") {
    return value
      ? `${value} ${MAIN_SCREEN_TEXTS.PROGRESS.MINUTES}`
      : MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED;
  }

  if (key === "available_days") {
    return value
      ? `${value} ${MAIN_SCREEN_TEXTS.PROGRESS.DAYS_WEEK}`
      : MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED;
  }

  return value || MAIN_SCREEN_TEXTS.STATUS.NOT_SPECIFIED;
};

export default MAIN_SCREEN_TEXTS;
