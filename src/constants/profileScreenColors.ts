/**
 * @file src/constants/profileScreenColors.ts
 * @brief מערכת צבעים מרכזית למסך הפרופיל - מחליפה את הצבעים הקשיחים
 * @brief Centralized color system for profile screen - replacing hardcoded colors
 * @notes תמיכה מלאה בתמה, צבעים סמנטיים, נגישות משופרת
 * @notes Full theme support, semantic colors, enhanced accessibility
 * @version 2025.2
 * @updated 2025-09-04 הרחבה משמעותית עם צבעים חדשים ופונקציות עזר
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

  // Challenge achievements / הישגי אתגר
  CHALLENGE: {
    FIRST_CHALLENGE: "#FF6B35", // כתום אדום - אתגר ראשון
    CHALLENGE_MASTER: "#8B0000", // אדום כהה - מאסטר אתגרים
    SOCIAL_CHALLENGER: "#9370DB", // סגול בינוני - אתגר חברתי
    PERSONAL_BEST: "#00CED1", // טורקיז - שיא אישי
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

  // Nutrition gradient / גרדיאנט תזונה
  NUTRITION: {
    GRADIENT: ["#FF6B6B", "#D32F2F"],
    ICON: theme.colors.surface,
  },

  // Health gradient / גרדיאנט בריאות
  HEALTH: {
    GRADIENT: ["#4CAF50", "#2E7D32"],
    ICON: theme.colors.surface,
  },

  // Social gradient / גרדיאנט חברתי
  SOCIAL: {
    GRADIENT: ["#9C27B0", "#7B1FA2"],
    ICON: theme.colors.surface,
  },

  // Goals gradient / גרדיאנט מטרות
  GOALS: {
    GRADIENT: ["#FF9800", "#F57C00"],
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
    ACCENT: theme.colors.primary,
    SUCCESS: theme.colors.success,
    ERROR: theme.colors.error,
    WARNING: theme.colors.warning || "#FFA500",
  },

  // Status colors / צבעי סטטוס
  STATUS: {
    ONLINE: theme.colors.success,
    OFFLINE: theme.colors.textSecondary,
    BUSY: theme.colors.error,
    AWAY: theme.colors.warning || "#FFA500",
  },

  // Accessibility colors / צבעי נגישות
  ACCESSIBILITY: {
    HIGH_CONTRAST: "#000000",
    LOW_CONTRAST: "#666666",
    FOCUS_RING: theme.colors.primary,
    ERROR_RING: theme.colors.error,
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
  WARNING: {
    BACKGROUND: theme.colors.warning || "#FFA500",
    TEXT: theme.colors.surface,
  },
  DISABLED: {
    BACKGROUND: theme.colors.textSecondary,
    TEXT: theme.colors.surface,
  },
  OUTLINE: {
    BACKGROUND: "transparent",
    TEXT: theme.colors.primary,
    BORDER: theme.colors.primary,
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
    21: ACHIEVEMENT_COLORS.CHALLENGE.FIRST_CHALLENGE,
    22: ACHIEVEMENT_COLORS.CHALLENGE.CHALLENGE_MASTER,
    23: ACHIEVEMENT_COLORS.CHALLENGE.SOCIAL_CHALLENGER,
    24: ACHIEVEMENT_COLORS.CHALLENGE.PERSONAL_BEST,
  };

  return colorMap[achievementId] || theme.colors.primary;
};

/**
 * Get gradient colors for statistics
 * קבלת צבעי גרדיאנט לסטטיסטיקות
 */
export const getStatsGradient = (
  type:
    | "workouts"
    | "streak"
    | "rating"
    | "time"
    | "nutrition"
    | "health"
    | "social"
    | "goals"
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
    case "nutrition":
      return STATS_COLORS.NUTRITION.GRADIENT as [string, string];
    case "health":
      return STATS_COLORS.HEALTH.GRADIENT as [string, string];
    case "social":
      return STATS_COLORS.SOCIAL.GRADIENT as [string, string];
    case "goals":
      return STATS_COLORS.GOALS.GRADIENT as [string, string];
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
    ACHIEVEMENT_COLORS.CHALLENGE.FIRST_CHALLENGE,
    ACHIEVEMENT_COLORS.LOYALTY.VETERAN,
    STATS_COLORS.NUTRITION.GRADIENT[0],
    STATS_COLORS.HEALTH.GRADIENT[0],
  ],

  // Progress colors / צבעי התקדמות
  PROGRESS: {
    LOW: theme.colors.error,
    MEDIUM: "#FFA500", // כתום
    HIGH: theme.colors.success,
    EXCELLENT: ACHIEVEMENT_COLORS.MEDALS.GOLD,
    SUPERB: ACHIEVEMENT_COLORS.MEDALS.DIAMOND,
  },

  // Status indicators / מחווני סטטוס
  STATUS_INDICATORS: {
    ACTIVE: theme.colors.success,
    INACTIVE: theme.colors.textSecondary,
    PENDING: theme.colors.warning || "#FFA500",
    COMPLETED: theme.colors.primary,
    FAILED: theme.colors.error,
  },

  // Trend colors / צבעי מגמה
  TRENDS: {
    UP: theme.colors.success,
    DOWN: theme.colors.error,
    STABLE: theme.colors.warning || "#FFA500",
    IMPROVING: "#00CED1", // טורקיז
    DECLINING: "#DC143C", // אדום כהה
  },
};

/**
 * Helper functions for color management
 * פונקציות עזר לניהול צבעים
 */
export const COLOR_HELPERS = {
  /**
   * Get achievement category color
   * קבלת צבע קטגוריית הישג
   */
  getAchievementCategoryColor: (category: string): string => {
    const categoryColors: Record<string, string> = {
      basic: ACHIEVEMENT_COLORS.BASIC.FIRST_WORKOUT,
      streak: ACHIEVEMENT_COLORS.STREAK.WEEKLY,
      medals: ACHIEVEMENT_COLORS.MEDALS.GOLD,
      time: ACHIEVEMENT_COLORS.TIME.HOUR,
      loyalty: ACHIEVEMENT_COLORS.LOYALTY.WEEK,
      performance: ACHIEVEMENT_COLORS.PERFORMANCE.EXCELLENT_RATER,
      special: ACHIEVEMENT_COLORS.SPECIAL.WEEKEND_WARRIOR,
      challenge: ACHIEVEMENT_COLORS.CHALLENGE.FIRST_CHALLENGE,
    };
    return categoryColors[category] || theme.colors.primary;
  },

  /**
   * Get button color by state
   * קבלת צבע כפתור לפי מצב
   */
  getButtonColor: (
    state:
      | "primary"
      | "secondary"
      | "danger"
      | "success"
      | "warning"
      | "disabled"
      | "outline",
    property: "background" | "text" | "border" = "background"
  ): string => {
    const stateColors =
      BUTTON_COLORS[state.toUpperCase() as keyof typeof BUTTON_COLORS];
    if (!stateColors) return theme.colors.primary;

    return (
      stateColors[property.toUpperCase() as keyof typeof stateColors] ||
      theme.colors.primary
    );
  },

  /**
   * Get text color by type
   * קבלת צבע טקסט לפי סוג
   */
  getTextColor: (
    type:
      | "primary"
      | "secondary"
      | "muted"
      | "white"
      | "accent"
      | "success"
      | "error"
      | "warning"
  ): string => {
    return (
      PROFILE_UI_COLORS.TEXT[
        type.toUpperCase() as keyof typeof PROFILE_UI_COLORS.TEXT
      ] || theme.colors.text
    );
  },

  /**
   * Get status indicator color
   * קבלת צבע מחוון סטטוס
   */
  getStatusColor: (status: "online" | "offline" | "busy" | "away"): string => {
    return (
      PROFILE_UI_COLORS.STATUS[
        status.toUpperCase() as keyof typeof PROFILE_UI_COLORS.STATUS
      ] || theme.colors.textSecondary
    );
  },

  /**
   * Get progress color based on percentage
   * קבלת צבע התקדמות לפי אחוז
   */
  getProgressColor: (percentage: number): string => {
    if (percentage >= 90) return DATA_VISUALIZATION_COLORS.PROGRESS.EXCELLENT;
    if (percentage >= 75) return DATA_VISUALIZATION_COLORS.PROGRESS.HIGH;
    if (percentage >= 50) return DATA_VISUALIZATION_COLORS.PROGRESS.MEDIUM;
    return DATA_VISUALIZATION_COLORS.PROGRESS.LOW;
  },

  /**
   * Get trend color based on change
   * קבלת צבע מגמה לפי שינוי
   */
  getTrendColor: (change: number): string => {
    if (change > 0) return DATA_VISUALIZATION_COLORS.TRENDS.UP;
    if (change < 0) return DATA_VISUALIZATION_COLORS.TRENDS.DOWN;
    return DATA_VISUALIZATION_COLORS.TRENDS.STABLE;
  },

  /**
   * Check if color has good contrast with background
   * בדיקה אם צבע יש ניגודיות טובה עם הרקע
   */
  hasGoodContrast: (
    color: string,
    background: string = theme.colors.surface
  ): boolean => {
    // Simple contrast check - in a real app you'd use a proper contrast calculation
    const colorBrightness = color === theme.colors.surface ? 1 : 0;
    const bgBrightness = background === theme.colors.surface ? 1 : 0;
    return Math.abs(colorBrightness - bgBrightness) > 0.5;
  },

  /**
   * Get accessible color variant
   * קבלת גרסת צבע נגישה
   */
  getAccessibleColor: (color: string, forDarkBg: boolean = false): string => {
    // Return high contrast version for accessibility
    if (forDarkBg) {
      return PROFILE_UI_COLORS.ACCESSIBILITY.HIGH_CONTRAST;
    }
    return color;
  },
};
