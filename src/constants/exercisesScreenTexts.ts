/**
 * @file src/constants/exercisesScreenTexts.ts
 * @brief קבועי טקסט ממוקדים למסך התרגילים עם תמיכה מלאה ב-RTL
 * @brief Centralized text constants for Exercises Screen with full RTL support
 * @dependencies None - standalone constants
 * @notes מנהל כל הטקסטים של מסך התרגילים עם תמיכה ב-accessibility ובינאומיות
 * @updated 2025-08-06 יצירה ראשונית עם תמיכה מלאה ב-RTL ונגישות
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

  // Navigation and actions / ניווט ופעולות
  ACTIONS: {
    VIEW_ALL_EXERCISES: "צפה בכל התרגילים",
  },

  // Section titles and descriptions / כותרות ותיאורי מקטעים
  SECTIONS: {
    MUSCLE_GROUPS_TITLE: "קבוצות שרירים",
    MUSCLE_GROUPS_DESCRIPTION: "בחר קבוצת שרירים לצפייה בתרגילים ספציפיים",
    STATISTICS_TITLE: "סטטיסטיקות",
    TIPS_TITLE: "טיפים",
  },

  // Statistics display / הצגת סטטיסטיקות
  STATISTICS: {
    EXERCISES_COUNT: "150+",
    EXERCISES_LABEL: "תרגילים",
    MUSCLE_GROUPS_LABEL: "קבוצות שרירים",
    AVERAGE_RATING: "4.8",
    RATING_LABEL: "דירוג ממוצע",
  },

  // Tips and advice / טיפים ועצות
  TIPS: {
    BASIC_EXERCISES: {
      TITLE: "התחל בתרגילים בסיסיים",
      TEXT: "למתחילים מומלץ להתחיל בתרגילי משקל גוף ולהתקדם בהדרגה",
    },
    PROPER_TECHNIQUE: {
      TITLE: "שימו לב לטכניקה",
      TEXT: "ביצוע נכון חשוב יותר ממשקל כבד - התמקדו בטכניקה נכונה",
    },
  },

  // Icons and visual elements / אייקונים ואלמנטים ויזואליים
  ICONS: {
    MAIN_DUMBBELL: "dumbbell" as const,
    VIEW_LIST: "view-list" as const,
    CHEVRON_LEFT: "chevron-left" as const,
    STAR: "star" as const,
    HUMAN: "human" as const,
    LIGHTBULB: "lightbulb" as const,
    HEART: "heart" as const,
  },

  // Color scheme / ערכת צבעים
  COLORS: {
    CHEST: "primary",
    BACK: "success",
    LEGS: "error",
    SHOULDERS: "warning",
    ARMS: "info",
    CORE: "accent",
  } as const,

  // Accessibility labels / תוויות נגישות
  A11Y: {
    MAIN_ICON: "אייקון ספריית תרגילים",
    VIEW_ALL_BUTTON: "צפה בכל התרגילים",
    MUSCLE_GROUP_CARD: "כרטיס קבוצת שרירים",
    STATISTICS_SECTION: "מדור סטטיסטיקות",
    TIPS_SECTION: "מדור טיפים ועצות",
    MUSCLE_ARROW: "חץ מעבר לקבוצת שרירים",
  },

  // Console and debugging / קונסול ודיבוג
  CONSOLE: {
    SCREEN_LOADED: "💪 ExercisesScreen - מסך התרגילים נטען בהצלחה",
    MUSCLE_GROUP_SELECTED: "💪 ExercisesScreen - נבחרה קבוצת שרירים:",
    VIEW_ALL_PRESSED: "💪 ExercisesScreen - נלחץ צפייה בכל התרגילים",
    MUSCLES_LOADED: "💪 ExercisesScreen - נטענו קבוצות שרירים:",
    MUSCLES_LOAD_ERROR: "💪 ExercisesScreen - שגיאה בטעינת קבוצות שרירים:",
  },
} as const;

/**
 * Helper function to get muscle group color from theme
 * פונקציית עזר לקבלת צבע קבוצת שרירים מהנושא
 */
type ThemeColorLike = { colors: Record<string, string> };

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
  exercisesCount: EXERCISES_SCREEN_TEXTS.STATISTICS.EXERCISES_COUNT,
  muscleGroupsCount: musclesCount.toString(),
  averageRating: EXERCISES_SCREEN_TEXTS.STATISTICS.AVERAGE_RATING,
});

export default EXERCISES_SCREEN_TEXTS;
