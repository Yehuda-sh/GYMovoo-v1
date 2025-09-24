/**
 * @file src/screens/main/utils/workoutDataHelpers.ts
 * @description פונקציות עזר לעיבוד נתוני אימונים
 */

import { formatWeeklyProgress } from "../../../utils/formatters";
import { getNextRecommendedDay } from "./mainScreenHelpers";

import type { WorkoutHistoryItem } from "../../../core/types/user.types";

/**
 * פישוט המרת נתוני אימונים להיסטוריה
 */
export const transformWorkoutsToHistory = (workouts: WorkoutHistoryItem[]) => {
  return workouts.map((workout) => ({
    id: workout.id || "",
    name: workout.name || workout.workoutName || "",
    workoutName: workout.workoutName || workout.name,
    type: workout.type || workout.name,
    date: workout.date || new Date().toISOString(),
    completedAt:
      workout.completedAt || workout.date || new Date().toISOString(),
    duration: workout.duration || 0,
    rating: workout.rating || 0,
  }));
};

/**
 * חישוב היום הבא המומלץ לאימון - פשוט יותר
 */
export const calculateNextRecommendedDay = (
  workouts: WorkoutHistoryItem[],
  availableTrainingDays: number
) => {
  const historyItems = transformWorkoutsToHistory(workouts);
  return getNextRecommendedDay(historyItems, availableTrainingDays);
};

/**
 * חישוב נתוני התקדמות שבועית - פשוט יותר
 */
export const calculateWeeklyProgress = (
  weeklyProgress: number,
  availableTrainingDays: number
) => {
  return formatWeeklyProgress(weeklyProgress || 0, availableTrainingDays);
};
