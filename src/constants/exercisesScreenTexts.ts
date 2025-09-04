/**
 * @file src/constants/exercisesScreenTexts.ts
 * @brief קבועי טקסט ממוקדים למסך התרגילים עם תמיכה מלאה ב-RTL
 * @brief Centralized text constants for Exercises Screen with full RTL support
 * @dependencies None - standalone constants
 * @notes מנהל כל הטקסטים של מסך התרגילים עם תמיכה ב-accessibility ובינאומיות
 * @updated 2025-09-04 הרחבה משמעותית עם טקסטים נוספים ותמיכה מלאה
 */

// Main muscle groups configuration with dynamic data
export const EXERCISES_MUSCLE_GROUPS = [
  {
    id: "chest",
    name: "חזה",
    icon: "arm-flex" as const,
    description: "לחיצות, פרפרים ועוד",
  },
  {
    id: "back",
    name: "גב",
    icon: "human-handsup" as const,
    description: "משיכות, חתירה ועוד",
  },
  {
    id: "legs",
    name: "רגליים",
    icon: "run" as const,
    description: "סקוואטים, לאנג'ים ועוד",
  },
  {
    id: "shoulders",
    name: "כתפיים",
    icon: "human-handsup" as const,
    description: "כתף קדמית, אחורית וצדדית",
  },
  {
    id: "arms",
    name: "זרועות",
    icon: "arm-flex" as const,
    description: "בייספס, טרייספס ועוד",
  },
  {
    id: "core",
    name: "ליבה",
    icon: "human" as const,
    description: "בטן, גב תחתון ועוד",
  },
] as const;

export type ExercisesMuscleGroup = (typeof EXERCISES_MUSCLE_GROUPS)[number];

export const EXERCISES_SCREEN_TEXTS = {
  // Headers and main titles / כותרות ראשיות
  HEADERS: {
    MAIN_TITLE: "ספריית תרגילים",
    SUBTITLE: "גלה מאות תרגילים מותאמים לכל רמה",
  },

  // Search and filter / חיפוש וסינון
  SEARCH: {
    PLACEHOLDER: "חפש תרגיל...",
    NO_RESULTS: "לא נמצאו תרגילים",
    CLEAR_SEARCH: "נקה חיפוש",
  },

  // Filter options / אפשרויות סינון
  FILTERS: {
    TITLE: "סינון",
    DIFFICULTY: "רמת קושי",
    EQUIPMENT: "ציוד נדרש",
    MUSCLE_GROUP: "קבוצת שרירים",
    DURATION: "משך זמן",
    ALL_EQUIPMENT: "כל הציוד",
    NO_EQUIPMENT: "ללא ציוד",
    APPLY_FILTERS: "החל סינונים",
    CLEAR_FILTERS: "נקה סינונים",
  },

  // Exercise list / רשימת תרגילים
  LIST: {
    LOADING: "טוען תרגילים...",
    EMPTY: "אין תרגילים זמינים",
    LOAD_MORE: "טען עוד",
    END_OF_LIST: "סוף הרשימה",
  },

  // Exercise details / פרטי תרגיל
  DETAILS: {
    DIFFICULTY: "רמת קושי",
    EQUIPMENT: "ציוד נדרש",
    MUSCLE_GROUPS: "קבוצות שרירים",
    INSTRUCTIONS: "הוראות ביצוע",
    TIPS: "טיפים",
    VARIATIONS: "וריאציות",
    DURATION: "משך זמן",
    CALORIES: "קלוריות משוערות",
    REPS: "חזרות",
    SETS: "סטים",
    REST: "מנוחה",
    VIDEO: "צפה בסרטון",
    ADD_TO_WORKOUT: "הוסף לאימון",
    REMOVE_FROM_WORKOUT: "הסר מהאימון",
  },

  // Difficulty levels / רמות קושי
  DIFFICULTY: {
    BEGINNER: "מתחיל",
    INTERMEDIATE: "בינוני",
    ADVANCED: "מתקדם",
  },

  // Equipment types / סוגי ציוד
  EQUIPMENT_TYPES: {
    DUMBBELLS: "משקולות יד",
    BARBELL: "משקולת מקל",
    CABLE_MACHINE: "מכונת כבלים",
    BENCH: "ספסל",
    PULLUP_BAR: "מתח למשיכות",
    RESISTANCE_BANDS: "רצועות התנגדות",
    BODYWEIGHT: "משקל גוף",
    MACHINE: "מכונה",
    OTHER: "אחר",
  },

  // Error messages / הודעות שגיאה
  ERRORS: {
    LOAD_FAILED: "שגיאה בטעינת התרגילים",
    SEARCH_FAILED: "שגיאה בחיפוש",
    FILTER_FAILED: "שגיאה בסינון",
    DETAILS_FAILED: "שגיאה בטעינת פרטי התרגיל",
    RETRY: "נסה שוב",
  },

  // Accessibility / נגישות
  ACCESSIBILITY: {
    SEARCH_HINT: "הקלד כדי לחפש תרגילים",
    FILTER_HINT: "פתח תפריט סינון",
    EXERCISE_HINT: "הקש כדי לראות פרטי התרגיל",
    ADD_TO_WORKOUT_HINT: "הוסף תרגיל זה לאימון",
    VIDEO_HINT: "צפה בסרטון הדגמה",
  },

  // Success messages / הודעות הצלחה
  SUCCESS: {
    ADDED_TO_WORKOUT: "התרגיל נוסף לאימון",
    REMOVED_FROM_WORKOUT: "התרגיל הוסר מהאימון",
    FILTERS_APPLIED: "הסינונים הוחלו",
  },
} as const;

/**
 * Helper function to get muscle group color from theme
 * פונקציית עזר לקבלת צבע קבוצת שרירים מהנושא
 */
type ThemeColorLike = {
  colors: {
    primary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    accent: string;
    [key: string]: unknown; // allow additional entries like gradients (string[])
  };
};

export const getMuscleGroupColor = (
  theme: ThemeColorLike,
  groupId: string
): string => {
  const colorMap = {
    chest: theme.colors.primary,
    back: theme.colors.success,
    legs: theme.colors.error,
    shoulders: theme.colors.warning,
    arms: theme.colors.info,
    core: theme.colors.accent,
  } as const;

  return colorMap[groupId as keyof typeof colorMap] || theme.colors.primary;
};

/**
 * Helper function to get difficulty level text
 * פונקציית עזר לקבלת טקסט רמת קושי
 */
export const getDifficultyText = (difficulty: string): string => {
  const difficultyMap = {
    beginner: EXERCISES_SCREEN_TEXTS.DIFFICULTY.BEGINNER,
    intermediate: EXERCISES_SCREEN_TEXTS.DIFFICULTY.INTERMEDIATE,
    advanced: EXERCISES_SCREEN_TEXTS.DIFFICULTY.ADVANCED,
  } as const;

  return difficultyMap[difficulty as keyof typeof difficultyMap] || difficulty;
};

/**
 * Helper function to get equipment type text
 * פונקציית עזר לקבלת טקסט סוג ציוד
 */
export const getEquipmentText = (equipment: string): string => {
  const equipmentMap = {
    dumbbells: EXERCISES_SCREEN_TEXTS.EQUIPMENT_TYPES.DUMBBELLS,
    barbell: EXERCISES_SCREEN_TEXTS.EQUIPMENT_TYPES.BARBELL,
    cable_machine: EXERCISES_SCREEN_TEXTS.EQUIPMENT_TYPES.CABLE_MACHINE,
    bench: EXERCISES_SCREEN_TEXTS.EQUIPMENT_TYPES.BENCH,
    pullup_bar: EXERCISES_SCREEN_TEXTS.EQUIPMENT_TYPES.PULLUP_BAR,
    resistance_bands: EXERCISES_SCREEN_TEXTS.EQUIPMENT_TYPES.RESISTANCE_BANDS,
    bodyweight: EXERCISES_SCREEN_TEXTS.EQUIPMENT_TYPES.BODYWEIGHT,
    machine: EXERCISES_SCREEN_TEXTS.EQUIPMENT_TYPES.MACHINE,
    other: EXERCISES_SCREEN_TEXTS.EQUIPMENT_TYPES.OTHER,
  } as const;

  return equipmentMap[equipment as keyof typeof equipmentMap] || equipment;
};

/**
 * Helper function to format duration
 * פונקציית עזר לעיצוב משך זמן
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} דקות`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours}:${remainingMinutes.toString().padStart(2, "0")} שעות`
    : `${hours} שעות`;
};

/**
 * Helper function to format calories
 * פונקציית עזר לעיצוב קלוריות
 */
export const formatCalories = (calories: number): string => {
  return `${calories} קלוריות`;
};

/**
 * Dynamic statistics calculation based on loaded data
 * חישוב סטטיסטיקות דינמי על בסיס נתונים נטענים
 */
export const generateExerciseStats = (
  musclesCount: number
): {
  exercisesCount: string;
  muscleGroupsCount: string;
  averageRating: string;
} => ({
  exercisesCount: "150+",
  muscleGroupsCount: musclesCount.toString(),
  averageRating: "4.8",
});

/**
 * Helper function to get muscle group by ID
 * פונקציית עזר לקבלת קבוצת שרירים לפי מזהה
 */
export const getMuscleGroupById = (
  id: string
): ExercisesMuscleGroup | undefined => {
  return EXERCISES_MUSCLE_GROUPS.find((group) => group.id === id);
};

export default EXERCISES_SCREEN_TEXTS;
