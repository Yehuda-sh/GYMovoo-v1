/**
 * @file src/constants/profileScreenColors.ts
 * @brief צבעי הישגים למסך הפרופיל - פושט ומיועל
 * @brief Achievement colors for profile screen - simplified and optimized
 * @notes צבעים בסיסיים להישגים בלבד
 * @notes Basic colors for achievements only
 * @version 3.0.0 - Drastically simplified, removed unused code
 * @updated 2025-09-11 פישוט דרמטי והסרת קוד לא בשימוש
 */

import { theme } from "../core/theme";

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
