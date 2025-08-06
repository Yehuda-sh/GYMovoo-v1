/**
 * @file src/constants/achievementsConfig.ts
 * @brief קונפיגורציה מרכזית למערכת הישגים - הגדרות, כללים וחישובים
 * @brief Centralized achievements system configuration - definitions, rules and calculations
 * @notes מערכת הישגים דינמית, חישובים מדעיים, תמיכה RTL
 * @notes Dynamic achievements system, scientific calculations, RTL support
 */

import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PROFILE_SCREEN_TEXTS } from "./profileScreenTexts";
import { getAchievementColor } from "./profileScreenColors";
import type { User } from "../types";

/**
 * Material Community Icon name type for type safety
 * טיפוס לשם אייקון מ-Material Community עבור בטיחות טיפוסים
 */
type MaterialCommunityIconName = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

/**
 * Achievement categories for organization
 * קטגוריות הישגים לארגון
 */
export enum AchievementCategory {
  BASIC = "basic",
  STREAK = "streak",
  QUANTITY = "quantity",
  TIME = "time",
  LOYALTY = "loyalty",
  PERFORMANCE = "performance",
  SPECIAL = "special",
}

/**
 * Achievement configuration interface
 * ממשק קונפיגורציית הישג
 */
export interface AchievementConfig {
  id: number;
  titleKey: keyof typeof PROFILE_SCREEN_TEXTS.ACHIEVEMENTS;
  category: AchievementCategory;
  icon: MaterialCommunityIconName;
  requirement: {
    type:
      | "workoutCount"
      | "streak"
      | "totalTime"
      | "registrationTime"
      | "averageRating"
      | "perfectRatings"
      | "timeOfDay"
      | "questionnaire";
    value: number | string;
    condition?: "gte" | "eq" | "lte";
  };
  priority: number; // תעדיפות הצגה / Display priority
}

/**
 * Workout interface with rating and feedback support
 * ממשק אימון עם תמיכה בדירוג ומשוב
 */
interface WorkoutWithRating {
  id: string;
  date?: string;
  completedAt?: string;
  duration?: number;
  rating?: number;
  feedback?: {
    difficulty?: number;
    enjoyment?: number;
    effectiveness?: number;
  };
}

/**
 * Achievement definitions configuration
 * קונפיגורציית הגדרות הישגים
 */
export const ACHIEVEMENTS_CONFIG: AchievementConfig[] = [
  // 🎯 Basic achievements / הישגים בסיסיים
  {
    id: 1,
    titleKey: "ENTHUSIASTIC_BEGINNER",
    category: AchievementCategory.BASIC,
    icon: "star",
    requirement: {
      type: "questionnaire",
      value: "completed",
    },
    priority: 1,
  },
  {
    id: 2,
    titleKey: "QUESTIONNAIRE_COMPLETE",
    category: AchievementCategory.BASIC,
    icon: "clipboard-check",
    requirement: {
      type: "questionnaire",
      value: "completed",
    },
    priority: 2,
  },

  // 🔥 Streak achievements / הישגי רצף
  {
    id: 3,
    titleKey: "WEEKLY_STREAK",
    category: AchievementCategory.STREAK,
    icon: "fire",
    requirement: {
      type: "streak",
      value: 7,
      condition: "gte",
    },
    priority: 10,
  },
  {
    id: 4,
    titleKey: "BIWEEKLY_STREAK",
    category: AchievementCategory.STREAK,
    icon: "fire-circle",
    requirement: {
      type: "streak",
      value: 14,
      condition: "gte",
    },
    priority: 11,
  },
  {
    id: 5,
    titleKey: "MONTHLY_STREAK",
    category: AchievementCategory.STREAK,
    icon: "fire-truck",
    requirement: {
      type: "streak",
      value: 30,
      condition: "gte",
    },
    priority: 12,
  },

  // 💪 Quantity achievements / הישגי כמות
  {
    id: 6,
    titleKey: "TEN_WORKOUTS",
    category: AchievementCategory.QUANTITY,
    icon: "medal-outline",
    requirement: {
      type: "workoutCount",
      value: 10,
      condition: "gte",
    },
    priority: 20,
  },
  {
    id: 7,
    titleKey: "TWENTY_FIVE_WORKOUTS",
    category: AchievementCategory.QUANTITY,
    icon: "medal",
    requirement: {
      type: "workoutCount",
      value: 25,
      condition: "gte",
    },
    priority: 21,
  },
  {
    id: 8,
    titleKey: "FIFTY_WORKOUTS",
    category: AchievementCategory.QUANTITY,
    icon: "trophy-award",
    requirement: {
      type: "workoutCount",
      value: 50,
      condition: "gte",
    },
    priority: 22,
  },
  {
    id: 9,
    titleKey: "HUNDRED_WORKOUTS",
    category: AchievementCategory.QUANTITY,
    icon: "trophy",
    requirement: {
      type: "workoutCount",
      value: 100,
      condition: "gte",
    },
    priority: 23,
  },

  // ⏰ Time achievements / הישגי זמן
  {
    id: 10,
    titleKey: "ONE_HOUR_FITNESS",
    category: AchievementCategory.TIME,
    icon: "clock-check",
    requirement: {
      type: "totalTime",
      value: 60, // minutes
      condition: "gte",
    },
    priority: 30,
  },
  {
    id: 11,
    titleKey: "TEN_HOURS_TRAINING",
    category: AchievementCategory.TIME,
    icon: "clock-check-outline",
    requirement: {
      type: "totalTime",
      value: 600, // minutes
      condition: "gte",
    },
    priority: 31,
  },
  {
    id: 12,
    titleKey: "FITNESS_MARATHON",
    category: AchievementCategory.TIME,
    icon: "run",
    requirement: {
      type: "totalTime",
      value: 1500, // 25 hours in minutes
      condition: "gte",
    },
    priority: 32,
  },

  // 📅 Loyalty achievements / הישגי נאמנות
  {
    id: 13,
    titleKey: "WEEK_WITH_GYMOVOO",
    category: AchievementCategory.LOYALTY,
    icon: "calendar-week",
    requirement: {
      type: "registrationTime",
      value: 7, // days
      condition: "gte",
    },
    priority: 40,
  },
  {
    id: 14,
    titleKey: "MONTH_WITH_GYMOVOO",
    category: AchievementCategory.LOYALTY,
    icon: "calendar-month",
    requirement: {
      type: "registrationTime",
      value: 30, // days
      condition: "gte",
    },
    priority: 41,
  },
  {
    id: 15,
    titleKey: "VETERAN_GYMOVOO",
    category: AchievementCategory.LOYALTY,
    icon: "account-star",
    requirement: {
      type: "registrationTime",
      value: 90, // days
      condition: "gte",
    },
    priority: 42,
  },

  // 🎯 Performance achievements / הישגי ביצועים
  {
    id: 16,
    titleKey: "EXCELLENT_RATER",
    category: AchievementCategory.PERFORMANCE,
    icon: "star-four-points",
    requirement: {
      type: "averageRating",
      value: 4.5,
      condition: "gte",
    },
    priority: 50,
  },
  {
    id: 17,
    titleKey: "PERFECT",
    category: AchievementCategory.PERFORMANCE,
    icon: "star-check",
    requirement: {
      type: "perfectRatings",
      value: 10,
      condition: "gte",
    },
    priority: 51,
  },

  // 💯 Special achievements / הישגים מיוחדים
  {
    id: 18,
    titleKey: "WEEKEND_WARRIOR",
    category: AchievementCategory.SPECIAL,
    icon: "sword-cross",
    requirement: {
      type: "timeOfDay",
      value: "weekend",
    },
    priority: 60,
  },
  {
    id: 19,
    titleKey: "MORNING_PERSON",
    category: AchievementCategory.SPECIAL,
    icon: "weather-sunny",
    requirement: {
      type: "timeOfDay",
      value: "morning",
    },
    priority: 61,
  },
  {
    id: 20,
    titleKey: "NIGHT_OWL",
    category: AchievementCategory.SPECIAL,
    icon: "owl",
    requirement: {
      type: "timeOfDay",
      value: "night",
    },
    priority: 62,
  },
];

/**
 * Achievement interface with computed properties
 * ממשק הישג עם מאפיינים מחושבים
 */
export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: MaterialCommunityIconName;
  color: string;
  unlocked: boolean;
  category: AchievementCategory;
  priority: number;
  progress?: number; // אחוז התקדמות / Progress percentage
}

/**
 * Calculate user's current streak from workout history
 * חישוב הרצף הנוכחי של המשתמש מהיסטוריית האימונים
 */
const calculateStreak = (workouts: WorkoutWithRating[]): number => {
  if (!workouts || workouts.length === 0) return 0;

  const sortedWorkouts = [...workouts].sort(
    (a, b) =>
      new Date(b.date || b.completedAt || "").getTime() -
      new Date(a.date || a.completedAt || "").getTime()
  );

  let currentStreak = 0;
  let checkDate = new Date();

  for (const workout of sortedWorkouts) {
    const workoutDate = new Date(workout.date || workout.completedAt || "");
    const diffDays = Math.floor(
      (checkDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 2) {
      // Allow for 1 day gap
      currentStreak++;
      checkDate = workoutDate;
    } else {
      break;
    }
  }

  return currentStreak;
};

/**
 * Calculate total workout time in minutes
 * חישוב זמן אימון כולל בדקות
 */
const calculateTotalTime = (workouts: WorkoutWithRating[]): number => {
  return workouts.reduce(
    (sum: number, workout: WorkoutWithRating) => sum + (workout.duration || 45),
    0
  );
};

/**
 * Calculate average rating from workouts
 * חישוב דירוג ממוצע מאימונים
 */
const calculateAverageRating = (workouts: WorkoutWithRating[]): number => {
  const ratedWorkouts = workouts.filter((w) => w.rating && w.rating > 0);
  if (ratedWorkouts.length === 0) return 0;

  const totalRating = ratedWorkouts.reduce(
    (sum, w) => sum + (w.rating || 0),
    0
  );
  return totalRating / ratedWorkouts.length;
};

/**
 * Count perfect ratings (5 stars)
 * ספירת דירוגים מושלמים (5 כוכבים)
 */
const countPerfectRatings = (workouts: WorkoutWithRating[]): number => {
  return workouts.filter((w) => w.rating === 5).length;
};

/**
 * Calculate days since registration
 * חישוב ימים מאז הרשמה
 */
const calculateDaysSinceRegistration = (user: User): number => {
  // For now, return a default of 30 days for all users
  // לעת עתה, החזר ברירת מחדל של 30 ימים לכל המשתמשים
  // This should be updated when user registration date is available
  // זה צריך להתעדכן כאשר תאריך הרשמת המשתמש יהיה זמין
  return 30;
};

/**
 * Count workouts by time of day
 * ספירת אימונים לפי שעות היום
 */
const countWorkoutsByTime = (
  workouts: WorkoutWithRating[],
  timeType: string
): number => {
  return workouts.filter((workout) => {
    const workoutDate = new Date(workout.date || workout.completedAt || "");
    const hour = workoutDate.getHours();
    const dayOfWeek = workoutDate.getDay();

    switch (timeType) {
      case "morning":
        return hour >= 5 && hour < 12;
      case "night":
        return hour >= 22 || hour < 5;
      case "weekend":
        return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
      default:
        return false;
    }
  }).length;
};

/**
 * Check if achievement requirement is met
 * בדיקה אם דרישת ההישג מתקיימת
 */
const checkRequirement = (
  user: User | null,
  requirement: AchievementConfig["requirement"]
): { met: boolean; progress: number } => {
  if (!user) return { met: false, progress: 0 };

  const workouts = user.activityHistory?.workouts || [];

  switch (requirement.type) {
    case "questionnaire":
      const hasQuestionnaire =
        !!user.questionnaire && Object.keys(user.questionnaire).length > 5;
      return { met: hasQuestionnaire, progress: hasQuestionnaire ? 100 : 0 };

    case "workoutCount":
      const count = workouts.length;
      const target = requirement.value as number;
      return {
        met: count >= target,
        progress: Math.min((count / target) * 100, 100),
      };

    case "streak":
      const streak = calculateStreak(workouts);
      const streakTarget = requirement.value as number;
      return {
        met: streak >= streakTarget,
        progress: Math.min((streak / streakTarget) * 100, 100),
      };

    case "totalTime":
      const totalTime = calculateTotalTime(workouts);
      const totalTimeTarget = requirement.value as number;
      return {
        met: totalTime >= totalTimeTarget,
        progress: Math.min((totalTime / totalTimeTarget) * 100, 100),
      };

    case "registrationTime":
      const daysSince = calculateDaysSinceRegistration(user);
      const daysTarget = requirement.value as number;
      return {
        met: daysSince >= daysTarget,
        progress: Math.min((daysSince / daysTarget) * 100, 100),
      };

    case "averageRating":
      const avgRating = calculateAverageRating(workouts);
      const ratingTarget = requirement.value as number;
      return {
        met: avgRating >= ratingTarget,
        progress: Math.min((avgRating / ratingTarget) * 100, 100),
      };

    case "perfectRatings":
      const perfectCount = countPerfectRatings(workouts);
      const perfectTarget = requirement.value as number;
      return {
        met: perfectCount >= perfectTarget,
        progress: Math.min((perfectCount / perfectTarget) * 100, 100),
      };

    case "timeOfDay":
      const timeCount = countWorkoutsByTime(
        workouts,
        requirement.value as string
      );
      const specialTimeTarget = 10; // Default target for time-based achievements
      return {
        met: timeCount >= specialTimeTarget,
        progress: Math.min((timeCount / specialTimeTarget) * 100, 100),
      };

    default:
      return { met: false, progress: 0 };
  }
};

/**
 * Calculate all achievements for a user
 * חישוב כל ההישגים עבור משתמש
 */
export const calculateAchievements = (user: User | null): Achievement[] => {
  return ACHIEVEMENTS_CONFIG.map((config) => {
    const achievementTexts = PROFILE_SCREEN_TEXTS.ACHIEVEMENTS[config.titleKey];
    const { met, progress } = checkRequirement(user, config.requirement);

    return {
      id: config.id,
      title: achievementTexts.title,
      description: achievementTexts.description,
      icon: config.icon,
      color: getAchievementColor(config.id, met),
      unlocked: met,
      category: config.category,
      priority: config.priority,
      progress: met ? 100 : progress,
    };
  }).sort((a, b) => {
    // Sort by unlocked status first, then by priority
    if (a.unlocked !== b.unlocked) {
      return a.unlocked ? -1 : 1;
    }
    return a.priority - b.priority;
  });
};

/**
 * Get achievements by category
 * קבלת הישגים לפי קטגוריה
 */
export const getAchievementsByCategory = (
  achievements: Achievement[],
  category: AchievementCategory
): Achievement[] => {
  return achievements.filter(
    (achievement) => achievement.category === category
  );
};

/**
 * Get unlocked achievements count
 * קבלת מספר הישגים פתוחים
 */
export const getUnlockedCount = (achievements: Achievement[]): number => {
  return achievements.filter((achievement) => achievement.unlocked).length;
};

/**
 * Get next achievement to unlock
 * קבלת ההישג הבא לפתיחה
 */
export const getNextAchievement = (
  achievements: Achievement[]
): Achievement | null => {
  const lockedAchievements = achievements
    .filter((achievement) => !achievement.unlocked)
    .sort((a, b) => (b.progress || 0) - (a.progress || 0));

  return lockedAchievements[0] || null;
};
