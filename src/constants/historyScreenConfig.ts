/**
 * @fileoverview קונסטנטים וערכי ברירת מחדל עבור מסך היסטוריית אימונים
 * @version 2025.1
 * @author GYMovoo Development Team
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
} as const;
