/**
 * @file src/constants/profileScreenColors.ts
 * @brief צבעי הישגים למסך הפרופיל - פושט ומיועל
 * @brief Achievement colors for profile screen - simplified and optimized
 * @notes צבעים בסיסיים להישגים בלבד - מיפוי ישיר ללא קבוצות מיותרות
 * @notes Basic colors for achievements only - direct mapping without unnecessary groups
 * @version 4.0.0 - Dramatically simplified, removed nested structure
 * @updated 2025-09-13 פישוט דרמטי והסרת מבנה מקונן
 */

import { theme } from "../core/theme";

/**
 * Get achievement color by achievement ID
 * קבלת צבע הישג לפי מזהה
 */
export const getAchievementColor = (
  achievementId: number,
  isUnlocked: boolean = true
): string => {
  // If locked, return muted color / אם נעול, החזר צבע עמום
  if (!isUnlocked) {
    return theme.colors.textSecondary;
  }

  // Direct mapping of achievement IDs to colors / מיפוי ישיר של מזהי הישגים לצבעים
  const colorMap: { [key: number]: string } = {
    // Basic achievements / הישגים בסיסיים
    1: theme.colors.primary, // הישג ראשון
    2: theme.colors.success, // השלמת שאלון

    // Streak achievements / הישגי רצף
    3: "#FF6347", // רצף שבועי
    4: "#FF4500", // רצף דו-שבועי
    5: "#DC143C", // רצף חודשי

    // Medal achievements / הישגי מדליות
    6: "#CD7F32", // ברונזה
    7: "#C0C0C0", // כסף
    8: "#FFD700", // זהב
    9: "#9932CC", // יהלום

    // Time achievements / הישגי זמן
    10: "#1E90FF", // שעה של כושר
    11: "#0080FF", // 10 שעות
    12: "#FF69B4", // מרתון כושר

    // Loyalty achievements / הישגי נאמנות
    13: "#32CD32", // שבוע עם GYMovoo
    14: "#228B22", // חודש עם GYMovoo
    15: "#8B4513", // ותיק GYMovoo

    // Performance achievements / הישגי ביצועים
    16: "#FF8C00", // מדרג מעולה
    17: "#FF1493", // מושלם

    // Special achievements / הישגים מיוחדים
    18: "#4B0082", // לוחם סוף השבוע
    19: "#FFA500", // חובב בוקר
    20: "#483D8B", // ינשוף לילה

    // Challenge achievements / הישגי אתגר
    21: "#FF6B35", // אתגר ראשון
    22: "#8B0000", // מאסטר אתגרים
    23: "#9370DB", // אתגר חברתי
  };

  return colorMap[achievementId] || theme.colors.primary;
};
