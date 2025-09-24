/**
 * @file src/screens/main/utils/mainScreenHelpers.ts
 * @description Helper functions extracted from MainScreen for better maintainability
 */

import type { User, WorkoutHistoryItem } from "../../../core/types/user.types";

/**
 * Format rating with fallback for invalid values
 */
export const formatRating = (rating: number): string => {
  if (isNaN(rating) || rating === 0) return "-";
  return rating.toFixed(1);
};

/**
 * Format fitness level for Hebrew display
 */
export const formatFitnessLevel = (level: string): string => {
  switch (level.toLowerCase()) {
    case "beginner":
      return "מתחיל";
    case "intermediate":
      return "בינוני";
    case "advanced":
      return "מתקדם";
    default:
      return "מתחיל";
  }
};

/**
 * Calculate available training days from user data - SIMPLIFIED
 * @description Extract training days from questionnaire answers
 */
export const calculateAvailableTrainingDays = (user: User | null): number => {
  if (!user) return 3;

  // Single source: smart questionnaire answers
  const smartAnswers = user.questionnaireData?.answers;
  if (smartAnswers?.availability) {
    const availability = Array.isArray(smartAnswers.availability)
      ? smartAnswers.availability[0]
      : smartAnswers.availability;

    // Type checking and conversion
    if (typeof availability === "string") {
      const daysMap: Record<string, number> = {
        "2_days": 2,
        "3_days": 3,
        "4_days": 4,
        "5_days": 5,
        "5_plus_days": 5,
      };

      return daysMap[availability] || 3;
    }
  }

  // Fallback
  return 3;
};

/**
 * Get next recommended workout day based on history
 */
export const getNextRecommendedDay = (
  workouts: WorkoutHistoryItem[],
  availableDays: number
): number => {
  if (workouts.length === 0) return 1;

  const lastWorkout = workouts[workouts.length - 1];
  const lastWorkoutType = lastWorkout?.name || "";

  // Simple rotation logic
  if (lastWorkoutType.includes("יום 1")) return Math.min(2, availableDays);
  if (lastWorkoutType.includes("יום 2")) return Math.min(3, availableDays);
  if (lastWorkoutType.includes("יום 3")) return availableDays >= 4 ? 4 : 1;
  if (lastWorkoutType.includes("יום 4")) return availableDays >= 5 ? 5 : 1;

  return 1; // Default fallback
};

/**
 * Calculate current workout streak from history
 */
export const calculateWorkoutStreak = (
  workouts: WorkoutHistoryItem[]
): number => {
  if (workouts.length === 0) return 0;

  // Simple implementation - count recent workouts
  return workouts.slice(0, 7).length;
};

/**
 * Calculate average difficulty from workout history
 */
export const calculateAverageDifficulty = (
  workouts: WorkoutHistoryItem[]
): number => {
  if (workouts.length === 0) return 0;

  const totalRating = workouts.reduce(
    (sum, item) => sum + (item.rating || 0),
    0
  );
  return totalRating / workouts.length;
};
