/**
 * @file profileScreenColors.ts
 * @brief Achievement colors for profile screen
 */

import { theme } from "../core/theme";

/**
 * Get achievement color by achievement ID
 */
export const getAchievementColor = (
  achievementId: number,
  isUnlocked: boolean = true
): string => {
  // If locked, return muted color
  if (!isUnlocked) {
    return theme.colors.textSecondary;
  }

  // Direct mapping of achievement IDs to colors
  const colorMap: { [key: number]: string } = {
    // Basic achievements
    1: theme.colors.primary, // ENTHUSIASTIC_BEGINNER
    2: theme.colors.success, // FIRST_WORKOUT

    // Streak achievements
    3: "#FF6347", // WEEKLY_STREAK
    4: "#FF4500", // BIWEEKLY_STREAK
    5: "#DC143C", // MONTHLY_STREAK
    31: "#8B0000", // STREAK_MASTER
    32: "#FF1493", // UNSTOPPABLE

    // Quantity achievements
    6: "#CD7F32", // TEN_WORKOUTS
    7: "#C0C0C0", // TWENTY_FIVE_WORKOUTS
    8: "#FFD700", // FIFTY_WORKOUTS
    9: "#9932CC", // HUNDRED_WORKOUTS
    29: "#4B0082", // WORKOUT_VETERAN
    30: "#FF8C00", // LEGENDARY_TRAINER

    // Time achievements
    10: "#1E90FF", // ONE_HOUR_FITNESS
    11: "#0080FF", // TEN_HOURS_TRAINING
    12: "#FF69B4", // FITNESS_MARATHON
    21: "#00CED1", // QUARTER_CENTURY

    // Loyalty achievements
    13: "#32CD32", // WEEK_WITH_GYMOVOO
    14: "#228B22", // MONTH_WITH_GYMOVOO
    15: "#8B4513", // VETERAN_GYMOVOO
    33: "#9370DB", // LOYAL_MEMBER
    34: "#FFD700", // YEAR_WITH_GYMOVOO

    // Performance achievements
    16: "#FF8C00", // EXCELLENT_RATER
    17: "#FF1493", // PERFECT
    22: "#32CD32", // CONSISTENT_TRAINER
    23: "#9932CC", // MASTER_RATER

    // Special achievements
    18: "#4B0082", // WEEKEND_WARRIOR
    19: "#FFA500", // MORNING_PERSON
    20: "#483D8B", // NIGHT_OWL

    // Challenge achievements
    26: "#FF6B35", // SPEED_DEMON
    28: "#8B0000", // PERFECTIONIST
  };

  return colorMap[achievementId] || theme.colors.primary;
};
