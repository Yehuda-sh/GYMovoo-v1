/**
 * @file src/constants/profileScreenColors.ts
 * @brief מערכת צבעים מרכזית למסך הפרופיל - מחליפה את הצבעים הקשיחים
 * @brief Centralized color system for profile screen - replacing hardcoded colors
 * @notes תמיכה מלאה בתמה, צבעים סמנטיים, נגישות משופרת
 * @notes Full theme support, semantic colors, enhanced accessibility
 */

import { theme } from "../styles/theme";

/**
 * Achievement colors based on tier system
 * צבעי הישגים מבוססי מערכת שכבות
 */
export const ACHIEVEMENT_COLORS = {
  // Basic achievements / הישגים בסיסיים
  BASIC: {
    FIRST_WORKOUT: theme.colors.primary, // זהב - הישג ראשון
    QUESTIONNAIRE: theme.colors.success, // ירוק - השלמת שאלון
  },

  // Streak achievements / הישגי רצף
  STREAK: {
    WEEKLY: "#FF6347", // אדום עגבנייה - רצף שבועי
    BIWEEKLY: "#FF4500", // אדום כתום - רצף דו-שבועי
    MONTHLY: "#DC143C", // אדום כהה - רצף חודשי
  },

  // Medal tiers / שכבות מדליות
  MEDALS: {
    BRONZE: "#CD7F32", // ברונזה - 10 אימונים
    SILVER: "#C0C0C0", // כסף - 25 אימונים
    GOLD: "#FFD700", // זהב - 50 אימונים
    DIAMOND: "#9932CC", // יהלום - 100 אימונים
  },

  // Time-based achievements / הישגים מבוססי זמן
  TIME: {
    HOUR: "#1E90FF", // כחול - שעה של כושר
    TEN_HOURS: "#0080FF", // כחול כהה - 10 שעות
    MARATHON: "#FF69B4", // ורוד - מרתון כושר
  },

  // Loyalty achievements / הישגי נאמנות
  LOYALTY: {
    WEEK: "#32CD32", // ירוק לימון - שבוע עם GYMovoo
    MONTH: "#228B22", // ירוק יער - חודש עם GYMovoo
    VETERAN: "#8B4513", // חום - ותיק GYMovoo
  },

  // Performance achievements / הישגי ביצועים
  PERFORMANCE: {
    EXCELLENT_RATER: "#FF8C00", // כתום כהה - מדרג מעולה
    PERFECT: "#FF1493", // ורוד עמוק - מושלם
  },

  // Special achievements / הישגים מיוחדים
  SPECIAL: {
    WEEKEND_WARRIOR: "#4B0082", // סגול כהה - לוחם סוף השבוע
    MORNING_PERSON: "#FFA500", // כתום - חובב בוקר
    NIGHT_OWL: "#483D8B", // כחול כהה - ינשוף לילה
  },
};

/**
 * Statistics card colors
 * צבעי כרטיסי סטטיסטיקה
 */
export const STATS_COLORS = {
  // Total workouts gradient / גרדיאנט סך אימונים
  WORKOUTS: {
    GRADIENT: ["#4e9eff", "#3a7bc8"],
    ICON: theme.colors.surface,
  },

  // Streak gradient / גרדיאנט רצף
  STREAK: {
    GRADIENT: ["#ff6b6b", "#d84848"],
    ICON: theme.colors.surface,
    ACTIVE: "#FF6347", // צבע רצף פעיל
  },

  // Rating gradient / גרדיאנט דירוג
  RATING: {
    GRADIENT: ["#00d9ff", "#00b8d4"],
    ICON: theme.colors.surface,
  },

  // Time gradient / גרדיאנט זמן
  TIME: {
    GRADIENT: ["#32cd32", "#228b22"],
    ICON: theme.colors.surface,
  },
};

/**
 * Profile screen UI colors
 * צבעי ממשק מסך הפרופיל
 */
export const PROFILE_UI_COLORS = {
  // Shadow colors / צבעי צללים
  SHADOW: theme.colors.shadow || "#000",

  // Background colors / צבעי רקע
  BACKGROUND: {
    MODAL: theme.colors.surface,
    CARD: theme.colors.card || theme.colors.surface,
    OVERLAY: "rgba(0, 0, 0, 0.5)",
  },

  // Border colors / צבעי גבולות
  BORDER: {
    DEFAULT: theme.colors.border,
    FOCUS: theme.colors.primary,
    ERROR: theme.colors.error,
  },

  // Text colors / צבעי טקסט
  TEXT: {
    PRIMARY: theme.colors.text,
    SECONDARY: theme.colors.textSecondary,
    MUTED: theme.colors.textSecondary,
    WHITE: theme.colors.surface,
  },
};

/**
 * Equipment management colors
 * צבעי ניהול ציוד
 */
export const EQUIPMENT_COLORS = {
  SELECTED: theme.colors.primary,
  UNSELECTED: theme.colors.textSecondary,
  BACKGROUND: theme.colors.card || theme.colors.surface,
  BORDER: theme.colors.border,
};

/**
 * Button colors for different states
 * צבעי כפתורים למצבים שונים
 */
export const BUTTON_COLORS = {
  PRIMARY: {
    BACKGROUND: theme.colors.primary,
    TEXT: theme.colors.surface,
  },
  SECONDARY: {
    BACKGROUND: theme.colors.surface,
    TEXT: theme.colors.primary,
    BORDER: theme.colors.primary,
  },
  DANGER: {
    BACKGROUND: theme.colors.error,
    TEXT: theme.colors.surface,
  },
  SUCCESS: {
    BACKGROUND: theme.colors.success,
    TEXT: theme.colors.surface,
  },
};

/**
 * Get achievement color by achievement ID and type
 * קבלת צבע הישג לפי מזהה וסוג
 */
export const getAchievementColor = (
  achievementId: number,
  isUnlocked: boolean = true
): string => {
  // If locked, return muted color / אם נעול, החזר צבע עמום
  if (!isUnlocked) {
    return theme.colors.textSecondary;
  }

  // Map achievement IDs to colors / מיפוי מזהי הישגים לצבעים
  const colorMap: { [key: number]: string } = {
    1: ACHIEVEMENT_COLORS.BASIC.FIRST_WORKOUT,
    2: ACHIEVEMENT_COLORS.BASIC.QUESTIONNAIRE,
    3: ACHIEVEMENT_COLORS.STREAK.WEEKLY,
    4: ACHIEVEMENT_COLORS.STREAK.BIWEEKLY,
    5: ACHIEVEMENT_COLORS.STREAK.MONTHLY,
    6: ACHIEVEMENT_COLORS.MEDALS.BRONZE,
    7: ACHIEVEMENT_COLORS.MEDALS.SILVER,
    8: ACHIEVEMENT_COLORS.MEDALS.GOLD,
    9: ACHIEVEMENT_COLORS.MEDALS.DIAMOND,
    10: ACHIEVEMENT_COLORS.TIME.HOUR,
    11: ACHIEVEMENT_COLORS.TIME.TEN_HOURS,
    12: ACHIEVEMENT_COLORS.TIME.MARATHON,
    13: ACHIEVEMENT_COLORS.LOYALTY.WEEK,
    14: ACHIEVEMENT_COLORS.LOYALTY.MONTH,
    15: ACHIEVEMENT_COLORS.LOYALTY.VETERAN,
    16: ACHIEVEMENT_COLORS.PERFORMANCE.EXCELLENT_RATER,
    17: ACHIEVEMENT_COLORS.PERFORMANCE.PERFECT,
    18: ACHIEVEMENT_COLORS.SPECIAL.WEEKEND_WARRIOR,
    19: ACHIEVEMENT_COLORS.SPECIAL.MORNING_PERSON,
    20: ACHIEVEMENT_COLORS.SPECIAL.NIGHT_OWL,
  };

  return colorMap[achievementId] || theme.colors.primary;
};

/**
 * Get gradient colors for statistics
 * קבלת צבעי גרדיאנט לסטטיסטיקות
 */
export const getStatsGradient = (
  type: "workouts" | "streak" | "rating" | "time"
): [string, string] => {
  switch (type) {
    case "workouts":
      return STATS_COLORS.WORKOUTS.GRADIENT as [string, string];
    case "streak":
      return STATS_COLORS.STREAK.GRADIENT as [string, string];
    case "rating":
      return STATS_COLORS.RATING.GRADIENT as [string, string];
    case "time":
      return STATS_COLORS.TIME.GRADIENT as [string, string];
    default:
      return [theme.colors.primary, theme.colors.primary];
  }
};

/**
 * Color palette for data visualization
 * פלטת צבעים להמחשת נתונים
 */
export const DATA_VISUALIZATION_COLORS = {
  // Chart colors / צבעי גרפים
  CHART: [
    theme.colors.primary,
    theme.colors.success,
    ACHIEVEMENT_COLORS.STREAK.WEEKLY,
    ACHIEVEMENT_COLORS.TIME.HOUR,
    ACHIEVEMENT_COLORS.MEDALS.GOLD,
    ACHIEVEMENT_COLORS.SPECIAL.MORNING_PERSON,
  ],

  // Progress colors / צבעי התקדמות
  PROGRESS: {
    LOW: theme.colors.error,
    MEDIUM: "#FFA500", // כתום
    HIGH: theme.colors.success,
    EXCELLENT: ACHIEVEMENT_COLORS.MEDALS.GOLD,
  },
};
