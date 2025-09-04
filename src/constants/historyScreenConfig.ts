/**
 * @fileoverview קונסטנטים וערכי ברירת מחדל עבור מסך היסטוריית אימונים
 * @version 2025.2
 * @author GYMovoo Development Team
 * @updated 2025-09-04 הרחבה משמעותית עם טקסטים בעברית והגדרות נוספות
 */

export const HISTORY_SCREEN_CONFIG = {
  // הגדרות עמוד נוסף (pagination)
  ITEMS_PER_PAGE: 10,
  LOAD_MORE_THRESHOLD: 0.3,

  // ערכי ברירת מחדל לאימון
  DEFAULT_WORKOUT_DURATION: 3600, // 60 דקות בשניות
  DEFAULT_PERSONAL_RECORDS: 0,
  DEFAULT_TOTAL_SETS: 0,
  DEFAULT_TOTAL_PLANNED_SETS: 0,
  DEFAULT_TOTAL_VOLUME: 0,
  DEFAULT_DIFFICULTY_RATING: 3,
  DEFAULT_MOOD: "😐",
  DEFAULT_WORKOUT_STREAK: 1,

  // הגדרות אנימציה
  ANIMATION_DURATION: 300,
  FADE_IN_DELAY: 100,
  SLIDE_ANIMATION_RANGE: {
    INPUT: [0, 50] as number[],
    OUTPUT: [30, 0] as number[],
  },

  // הגדרות ממשק משתמש
  PROGRESS_BAR_HEIGHT: 4,
  PROGRESS_BAR_RADIUS: 2,
  BORDER_WIDTH: 1,
  CONGRATULATION_BORDER_WIDTH: 3,

  // ציוני קושי
  MIN_DIFFICULTY: 1,
  MAX_DIFFICULTY: 5,
  DIFFICULTY_DECIMAL_PLACES: 1,

  // הגדרות זמן
  INITIAL_PAGE: 2, // העמוד הבא לאחר טעינה ראשונית

  // הגדרות תצוגה נוספות
  MAX_VISIBLE_WORKOUTS: 50,
  CACHE_SIZE: 100,
  REFRESH_INTERVAL: 30000, // 30 שניות

  // הגדרות התראות
  NOTIFICATION_DURATION: 2000,
  SUCCESS_COLOR: "#4CAF50",
  ERROR_COLOR: "#F44336",
  WARNING_COLOR: "#FF9800",
} as const;

export const HISTORY_SCREEN_FILTERS = {
  // מסנני מגדר
  GENDER_TYPES: {
    MALE: "male" as const,
    FEMALE: "female" as const,
    OTHER: "other" as const,
  },

  // סוגי פידבק
  FEEDBACK_TYPES: {
    DIFFICULTY: "difficulty",
    FEELING: "feeling",
    READY_FOR_MORE: "readyForMore",
  },

  // סוגי סטטיסטיקה
  STAT_TYPES: {
    TOTAL_WORKOUTS: "totalWorkouts",
    TOTAL_DURATION: "totalDuration",
    AVERAGE_DIFFICULTY: "averageDifficulty",
    WORKOUT_STREAK: "workoutStreak",
  },

  // מסנני תאריך
  DATE_FILTERS: {
    TODAY: "today",
    THIS_WEEK: "thisWeek",
    THIS_MONTH: "thisMonth",
    THIS_YEAR: "thisYear",
    CUSTOM: "custom",
  },

  // מסנני סוג אימון
  WORKOUT_TYPES: {
    STRENGTH: "strength",
    CARDIO: "cardio",
    FLEXIBILITY: "flexibility",
    MIXED: "mixed",
  },

  // מסנני רמת קושי
  DIFFICULTY_FILTERS: {
    EASY: "easy",
    MEDIUM: "medium",
    HARD: "hard",
    VERY_HARD: "veryHard",
  },

  // מסנני מצב רוח
  MOOD_FILTERS: {
    EXCELLENT: "😀",
    GOOD: "🙂",
    NEUTRAL: "😐",
    TIRED: "😴",
    SORE: "😣",
  },
} as const;

export const HISTORY_SCREEN_FORMATS = {
  // פורמטים לתצוגה
  PERCENTAGE_MULTIPLIER: 100,
  PERCENTAGE_DECIMAL_PLACES: 0,
  DURATION_DECIMAL_PLACES: 0,

  // תבניות טקסט
  PROGRESS_TEMPLATE: "נטענו {loaded} מתוך {total} אימונים ({percentage}%)",
  SET_RATIO_TEMPLATE: "{completed}/{planned} סטים",

  // פורמטי תאריך
  DATE_FORMAT: "DD/MM/YYYY",
  TIME_FORMAT: "HH:mm",

  // פורמטי זמן נוספים
  DURATION_FORMAT: "HH:mm:ss",
  SHORT_DATE_FORMAT: "DD/MM",
  FULL_DATE_FORMAT: "dddd, DD/MM/YYYY",

  // פורמטי מספרים
  VOLUME_FORMAT: "{value} kg",
  CALORIES_FORMAT: "{value} kcal",
  WEIGHT_FORMAT: "{value} kg",

  // תבניות טקסט נוספות
  STREAK_TEMPLATE: "רצף של {days} ימים",
  PERSONAL_RECORD_TEMPLATE: "שיא אישי: {value}",
  AVERAGE_TEMPLATE: "ממוצע: {value}",
} as const;

// טקסטים בעברית למסך ההיסטוריה
export const HISTORY_SCREEN_TEXTS = {
  // כותרות ראשיות
  HEADERS: {
    MAIN_TITLE: "היסטוריית אימונים",
    SUBTITLE: "עקוב אחרי ההתקדמות שלך",
    STATISTICS: "סטטיסטיקות",
    RECENT_WORKOUTS: "אימונים אחרונים",
  },

  // פעולות
  ACTIONS: {
    VIEW_DETAILS: "צפה בפרטים",
    EDIT_WORKOUT: "ערוך אימון",
    DELETE_WORKOUT: "מחק אימון",
    SHARE_WORKOUT: "שתף אימון",
    EXPORT_DATA: "ייצא נתונים",
    REFRESH: "רענן",
  },

  // מסננים ומיון
  FILTERS: {
    TITLE: "סינון ומיון",
    DATE_RANGE: "טווח תאריכים",
    WORKOUT_TYPE: "סוג אימון",
    DIFFICULTY: "רמת קושי",
    MOOD: "מצב רוח",
    SORT_BY: "מיין לפי",
    SORT_BY_DATE_DESC: "תאריך (חדש לישן)",
    SORT_BY_DATE_ASC: "תאריך (ישן לחדש)",
    SORT_BY_DURATION_DESC: "משך זמן (ארוך לקצר)",
    SORT_BY_DURATION_ASC: "משך זמן (קצר לארוך)",
    SORT_BY_DIFFICULTY_DESC: "קושי (גבוה לנמוך)",
    SORT_BY_DIFFICULTY_ASC: "קושי (נמוך לגבוה)",
  },

  // הודעות
  MESSAGES: {
    NO_WORKOUTS: "אין אימונים להצגה",
    LOADING: "טוען אימונים...",
    LOADING_MORE: "טוען עוד...",
    ERROR_LOADING: "שגיאה בטעינת האימונים",
    NO_FILTER_RESULTS: "לא נמצאו אימונים התואמים לסינון",
    WORKOUT_DELETED: "האימון נמחק בהצלחה",
    WORKOUT_UPDATED: "האימון עודכן בהצלחה",
    EXPORT_SUCCESS: "הנתונים יוצאו בהצלחה",
    EXPORT_ERROR: "שגיאה בייצוא הנתונים",
  },

  // סטטיסטיקות
  STATISTICS: {
    TOTAL_WORKOUTS: "סך הכל אימונים",
    TOTAL_DURATION: "זמן אימון כולל",
    AVERAGE_DURATION: "זמן אימון ממוצע",
    AVERAGE_DIFFICULTY: "רמת קושי ממוצעת",
    LONGEST_STREAK: "רצף הארוך ביותר",
    CURRENT_STREAK: "רצף נוכחי",
    PERSONAL_RECORDS: "שיאים אישיים",
    MOST_FREQUENT_DAY: "היום הפופולרי ביותר",
    BEST_PERFORMANCE: "הביצוע הטוב ביותר",
  },

  // יחידות מידה
  UNITS: {
    MINUTES: "דקות",
    HOURS: "שעות",
    DAYS: "ימים",
    WEEKS: "שבועות",
    MONTHS: "חודשים",
    YEARS: "שנים",
    KILOGRAMS: "ק״ג",
    CALORIES: "קלוריות",
    TIMES: "פעמים",
  },
} as const;

// פונקציות עזר למסך ההיסטוריה
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
   * פונקציה לעיצוב משקל
   */
  formatWeight: (weight: number): string => {
    return `${weight} ${HISTORY_SCREEN_TEXTS.UNITS.KILOGRAMS}`;
  },

  /**
   * פונקציה לעיצוב קלוריות
   */
  formatCalories: (calories: number): string => {
    return `${calories} ${HISTORY_SCREEN_TEXTS.UNITS.CALORIES}`;
  },

  /**
   * פונקציה לעיצוב רצף
   */
  formatStreak: (days: number): string => {
    return HISTORY_SCREEN_FORMATS.STREAK_TEMPLATE.replace(
      "{days}",
      days.toString()
    );
  },

  /**
   * פונקציה לעיצוב שיא אישי
   */
  formatPersonalRecord: (value: string | number): string => {
    return HISTORY_SCREEN_FORMATS.PERSONAL_RECORD_TEMPLATE.replace(
      "{value}",
      value.toString()
    );
  },

  /**
   * פונקציה לעיצוב ממוצע
   */
  formatAverage: (value: string | number): string => {
    return HISTORY_SCREEN_FORMATS.AVERAGE_TEMPLATE.replace(
      "{value}",
      value.toString()
    );
  },

  /**
   * פונקציה לקבלת צבע לפי רמת קושי
   */
  getDifficultyColor: (difficulty: number): string => {
    if (difficulty <= 2) return HISTORY_SCREEN_CONFIG.SUCCESS_COLOR;
    if (difficulty <= 3) return HISTORY_SCREEN_CONFIG.WARNING_COLOR;
    return HISTORY_SCREEN_CONFIG.ERROR_COLOR;
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

  /**
   * פונקציה לחישוב אחוז השלמה
   */
  calculateCompletionPercentage: (completed: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round(
      (completed / total) * HISTORY_SCREEN_FORMATS.PERCENTAGE_MULTIPLIER
    );
  },
} as const;
