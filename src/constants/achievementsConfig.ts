/**
 * @file src/constants/achievementsConfig.ts
 * @brief קונפיגורציה מרכזית למערכת הישגים - הגדרות, כללים וחישובים
 * @brief Centralized achievements system configuration - definitions, rules and calculations
 * @notes מערכת הישגים דינמית, חישובים מדעיים, תמיכה RTL
 * @notes Dynamic achievements system, scientific calculations, RTL support
 */

import type { ComponentProps } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { User } from "../types";
import type { WorkoutHistoryItem } from "../types/user.types";
import { PROFILE_SCREEN_TEXTS } from "./profileScreenTexts";
import { getAchievementColor } from "./profileScreenColors";

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
  CHALLENGE = "challenge",
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
  priority: number; // עדיפות הצגה / Display priority
}

/**
 * Constants for calculations
 * קבועים לחישובים
 */
const WORKOUT_CONSTANTS = {
  DEFAULT_DURATION_MINUTES: 45,
  SECONDS_TO_MINUTES_THRESHOLD: 180,
  MAX_STREAK_GAP_DAYS: 2, // Allow for 1 day gap in streak
  TIME_RANGES: {
    MORNING_START: 5,
    MORNING_END: 12,
    NIGHT_START: 22,
    NIGHT_END: 5,
  },
  SPECIAL_TARGETS: {
    weekend: 5,
    morning: 10,
    night: 8,
  },
} as const;

/**
 * Achievement definitions configuration
 * קונפיגורציית הגדרות הישגים
 */
export const ACHIEVEMENTS_CONFIG: ReadonlyArray<AchievementConfig> = [
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
    titleKey: "FIRST_WORKOUT",
    category: AchievementCategory.BASIC,
    icon: "dumbbell",
    requirement: {
      type: "workoutCount",
      value: 1,
      condition: "gte",
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
  {
    id: 31,
    titleKey: "STREAK_MASTER",
    category: AchievementCategory.STREAK,
    icon: "fire-circle",
    requirement: {
      type: "streak",
      value: 50,
      condition: "gte",
    },
    priority: 13,
  },
  {
    id: 32,
    titleKey: "UNSTOPPABLE",
    category: AchievementCategory.STREAK,
    icon: "fire-alert",
    requirement: {
      type: "streak",
      value: 100,
      condition: "gte",
    },
    priority: 14,
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
  {
    id: 29,
    titleKey: "WORKOUT_VETERAN",
    category: AchievementCategory.QUANTITY,
    icon: "shield-star",
    requirement: {
      type: "workoutCount",
      value: 200,
      condition: "gte",
    },
    priority: 24,
  },
  {
    id: 30,
    titleKey: "LEGENDARY_TRAINER",
    category: AchievementCategory.QUANTITY,
    icon: "crown-outline",
    requirement: {
      type: "workoutCount",
      value: 500,
      condition: "gte",
    },
    priority: 25,
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
  {
    id: 21,
    titleKey: "QUARTER_CENTURY",
    category: AchievementCategory.TIME,
    icon: "timer-sand",
    requirement: {
      type: "totalTime",
      value: 2250, // 37.5 hours in minutes
      condition: "gte",
    },
    priority: 33,
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
  {
    id: 33,
    titleKey: "LOYAL_MEMBER",
    category: AchievementCategory.LOYALTY,
    icon: "heart",
    requirement: {
      type: "registrationTime",
      value: 180, // 6 months
      condition: "gte",
    },
    priority: 43,
  },
  {
    id: 34,
    titleKey: "YEAR_WITH_GYMOVOO",
    category: AchievementCategory.LOYALTY,
    icon: "calendar-star",
    requirement: {
      type: "registrationTime",
      value: 365, // 1 year
      condition: "gte",
    },
    priority: 44,
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
  {
    id: 22,
    titleKey: "CONSISTENT_TRAINER",
    category: AchievementCategory.PERFORMANCE,
    icon: "target",
    requirement: {
      type: "averageRating",
      value: 4.0,
      condition: "gte",
    },
    priority: 52,
  },
  {
    id: 23,
    titleKey: "MASTER_RATER",
    category: AchievementCategory.PERFORMANCE,
    icon: "crown",
    requirement: {
      type: "perfectRatings",
      value: 25,
      condition: "gte",
    },
    priority: 53,
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
  {
    id: 24,
    titleKey: "EARLY_BIRD",
    category: AchievementCategory.SPECIAL,
    icon: "bird",
    requirement: {
      type: "timeOfDay",
      value: "morning",
    },
    priority: 63,
  },
  {
    id: 25,
    titleKey: "DEDICATED_TRAINER",
    category: AchievementCategory.SPECIAL,
    icon: "account-hard-hat",
    requirement: {
      type: "workoutCount",
      value: 5,
      condition: "gte",
    },
    priority: 64,
  },

  // 🏆 Challenge achievements / הישגי אתגר
  {
    id: 26,
    titleKey: "SPEED_DEMON",
    category: AchievementCategory.CHALLENGE,
    icon: "lightning-bolt",
    requirement: {
      type: "totalTime",
      value: 3000, // 50 hours
      condition: "gte",
    },
    priority: 70,
  },
  {
    id: 27,
    titleKey: "CENTURY_CLUB",
    category: AchievementCategory.CHALLENGE,
    icon: "numeric-10",
    requirement: {
      type: "workoutCount",
      value: 100,
      condition: "gte",
    },
    priority: 71,
  },
  {
    id: 28,
    titleKey: "PERFECTIONIST",
    category: AchievementCategory.CHALLENGE,
    icon: "bullseye",
    requirement: {
      type: "perfectRatings",
      value: 50,
      condition: "gte",
    },
    priority: 72,
  },
];

/**
 * Achievement interface with computed properties
 * ממשק הישג עם מאפיינים מחושבים
 */
export interface AchievementDisplay {
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
const calculateStreak = (workouts: WorkoutHistoryItem[]): number => {
  if (!workouts || workouts.length === 0) return 0;

  const sortedWorkouts = [...workouts]
    .map((workout) => ({
      ...workout,
      workoutDate: new Date(workout.date),
    }))
    .filter((workout) => !isNaN(workout.workoutDate.getTime()))
    .sort((a, b) => b.workoutDate.getTime() - a.workoutDate.getTime());

  if (sortedWorkouts.length === 0) return 0;

  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day

  // Check if user worked out today or yesterday (within streak gap)
  const mostRecentWorkout = sortedWorkouts[0];
  if (!mostRecentWorkout) return 0; // Safety check

  const daysSinceLastWorkout = Math.floor(
    (today.getTime() - mostRecentWorkout.workoutDate.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  // If last workout is more than MAX_STREAK_GAP_DAYS ago, no current streak
  if (daysSinceLastWorkout > WORKOUT_CONSTANTS.MAX_STREAK_GAP_DAYS) {
    return 0;
  }

  // Count consecutive days backwards from the most recent workout
  let checkDate = new Date(mostRecentWorkout.workoutDate);
  checkDate.setHours(0, 0, 0, 0); // Reset time to start of day

  for (const workout of sortedWorkouts) {
    const workoutDate = new Date(workout.workoutDate);
    workoutDate.setHours(0, 0, 0, 0); // Reset time to start of day

    const diffDays = Math.floor(
      (checkDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= WORKOUT_CONSTANTS.MAX_STREAK_GAP_DAYS) {
      currentStreak++;
      checkDate = new Date(workoutDate);
      checkDate.setDate(checkDate.getDate() - 1); // Move to previous day
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
const calculateTotalTime = (workouts: WorkoutHistoryItem[]): number => {
  // Normalize duration to minutes. If value looks like seconds (> threshold), convert to minutes.
  return workouts.reduce((sum: number, workout: WorkoutHistoryItem) => {
    const raw = workout.duration;
    if (raw == null) return sum + WORKOUT_CONSTANTS.DEFAULT_DURATION_MINUTES;
    const minutes =
      raw > WORKOUT_CONSTANTS.SECONDS_TO_MINUTES_THRESHOLD
        ? Math.round(raw / 60)
        : raw;
    return sum + minutes;
  }, 0);
};

/**
 * Calculate average rating from workouts
 * חישוב דירוג ממוצע מאימונים
 */
const calculateAverageRating = (workouts: WorkoutHistoryItem[]): number => {
  const ratedWorkouts = workouts.filter((w) => w.rating && w.rating > 0);
  if (ratedWorkouts.length === 0) return 0;

  const totalRating = ratedWorkouts.reduce(
    (sum, w) => sum + (w.rating ?? 0),
    0
  );
  return totalRating / ratedWorkouts.length;
};

/**
 * Count perfect ratings (5 stars)
 * ספירת דירוגים מושלמים (5 כוכבים)
 */
const countPerfectRatings = (workouts: WorkoutHistoryItem[]): number => {
  return workouts.filter((w) => w.rating === 5).length;
};

/**
 * Calculate days since registration
 * חישוב ימים מאז הרשמה
 */
const calculateDaysSinceRegistration = (user: User): number | null => {
  // Require actual creation date; no fallback to avoid false positives
  const createdAt = (user as User & { createdAt?: string })?.createdAt;
  if (!createdAt) return null;
  const created = new Date(createdAt);
  if (isNaN(created.getTime())) return null;
  const diffMs = Date.now() - created.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
};

/**
 * Count workouts by time of day
 * ספירת אימונים לפי שעות היום
 */
const countWorkoutsByTime = (
  workouts: WorkoutHistoryItem[],
  timeType: string
): number => {
  const { TIME_RANGES } = WORKOUT_CONSTANTS;

  return workouts.filter((workout) => {
    const workoutDate = new Date(workout.date);
    if (isNaN(workoutDate.getTime())) return false;
    const hour = workoutDate.getHours();
    const dayOfWeek = workoutDate.getDay();

    switch (timeType) {
      case "morning":
        return (
          hour >= TIME_RANGES.MORNING_START && hour < TIME_RANGES.MORNING_END
        );
      case "night":
        return hour >= TIME_RANGES.NIGHT_START || hour < TIME_RANGES.NIGHT_END;
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
    case "questionnaire": {
      // Consider either legacy questionnaire or the new smartQuestionnaireData presence
      const hasLegacy =
        !!user.questionnaireData &&
        Object.keys(user.questionnaireData).length > 0;
      const hasSmart = !!(
        user as User & {
          smartQuestionnaireData?: { answers?: Record<string, unknown> };
        }
      )?.smartQuestionnaireData?.answers;
      const hasQuestionnaire = hasLegacy || hasSmart;
      return { met: hasQuestionnaire, progress: hasQuestionnaire ? 100 : 0 };
    }

    case "workoutCount": {
      const count = workouts.length;
      const target = requirement.value as number;
      return {
        met: count >= target,
        progress: Math.min((count / target) * 100, 100),
      };
    }

    case "streak": {
      const streak = calculateStreak(workouts);
      const streakTarget = requirement.value as number;
      return {
        met: streak >= streakTarget,
        progress: Math.min((streak / streakTarget) * 100, 100),
      };
    }

    case "totalTime": {
      const totalTime = calculateTotalTime(workouts);
      const totalTimeTarget = requirement.value as number;
      return {
        met: totalTime >= totalTimeTarget,
        progress: Math.min((totalTime / totalTimeTarget) * 100, 100),
      };
    }

    case "registrationTime": {
      const daysSince = calculateDaysSinceRegistration(user);
      if (daysSince == null) return { met: false, progress: 0 };
      const daysTarget = requirement.value as number;
      return {
        met: daysSince >= daysTarget,
        progress: Math.min((daysSince / daysTarget) * 100, 100),
      };
    }

    case "averageRating": {
      const avgRating = calculateAverageRating(workouts);
      const ratingTarget = requirement.value as number;
      return {
        met: avgRating >= ratingTarget,
        progress: Math.min((avgRating / ratingTarget) * 100, 100),
      };
    }

    case "perfectRatings": {
      const perfectCount = countPerfectRatings(workouts);
      const perfectTarget = requirement.value as number;
      return {
        met: perfectCount >= perfectTarget,
        progress: Math.min((perfectCount / perfectTarget) * 100, 100),
      };
    }

    case "timeOfDay": {
      const timeValue = requirement.value as string;
      const timeCount = countWorkoutsByTime(workouts, timeValue);
      const specialTimeTarget =
        WORKOUT_CONSTANTS.SPECIAL_TARGETS[
          timeValue as keyof typeof WORKOUT_CONSTANTS.SPECIAL_TARGETS
        ] ?? 10;
      return {
        met: timeCount >= specialTimeTarget,
        progress: Math.min((timeCount / specialTimeTarget) * 100, 100),
      };
    }

    default:
      return { met: false, progress: 0 };
  }
};

/**
 * Calculate all achievements for a user
 * חישוב כל ההישגים עבור משתמש
 */
export const calculateAchievements = (
  user: User | null
): AchievementDisplay[] => {
  // Helper: check data availability for requirement
  const hasDataForRequirement = (
    u: User | null,
    req: AchievementConfig["requirement"]
  ): boolean => {
    if (!u) return false;
    const workouts = u.activityHistory?.workouts;
    switch (req.type) {
      case "questionnaire": {
        const hasLegacy =
          !!u.questionnaireData && Object.keys(u.questionnaireData).length > 0;
        const hasSmart = !!(
          u as User & {
            smartQuestionnaireData?: { answers?: Record<string, unknown> };
          }
        )?.smartQuestionnaireData?.answers;
        return hasLegacy || hasSmart;
      }
      case "workoutCount":
      case "streak":
      case "totalTime":
      case "averageRating":
      case "perfectRatings":
      case "timeOfDay":
        return Array.isArray(workouts) && workouts.length >= 1; // hide when no workout data
      case "registrationTime": {
        const createdAt = (u as User & { createdAt?: string })?.createdAt;
        return !!createdAt && !isNaN(new Date(createdAt).getTime());
      }
      default:
        return false;
    }
  };

  return ACHIEVEMENTS_CONFIG.filter((config) =>
    hasDataForRequirement(user, config.requirement)
  )
    .map((config) => {
      const achievementTexts =
        PROFILE_SCREEN_TEXTS.ACHIEVEMENTS[config.titleKey];
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
    })
    .sort((a, b) => {
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
  achievements: AchievementDisplay[],
  category: AchievementCategory
): AchievementDisplay[] => {
  return achievements.filter(
    (achievement) => achievement.category === category
  );
};

/**
 * Get unlocked achievements count
 * קבלת מספר הישגים פתוחים
 */
export const getUnlockedCount = (
  achievements: AchievementDisplay[]
): number => {
  return achievements.filter((achievement) => achievement.unlocked).length;
};

/**
 * Get next achievement to unlock
 * קבלת ההישג הבא לפתיחה
 */
export const getNextAchievement = (
  achievements: AchievementDisplay[]
): AchievementDisplay | null => {
  const lockedAchievements = achievements
    .filter((achievement) => !achievement.unlocked)
    .sort((a, b) => (b.progress || 0) - (a.progress || 0));

  return lockedAchievements[0] || null;
};
