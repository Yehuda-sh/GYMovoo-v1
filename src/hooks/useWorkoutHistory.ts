/**
 * @file src/hooks/useWorkoutHistory.ts
 * @description Hook לטעינת היסטוריית אימונים ועיבוד נתוני ביצועים קודמים
 * @author GYMovoo Development Team
 * @created 2025-08-02
 *
 * @features
 * - טעינת היסטוריה של תרגילים ספציפיים
 * - חישוב ממוצעי ביצועים קודמים
 * - הכנת נתונים לתצוגה בעמודה "קודם"
 * - תמיכה במספר אימונים אחרונים להשוואה
 */

import { useState, useEffect, useCallback } from "react";
import {
  unifiedHistoryService,
  ExerciseProgressData,
} from "../services/unifiedHistoryService";
import { PreviousPerformance } from "../services/workoutHistoryService";
import { Exercise, Set } from "../screens/workout/types/workout.types";

export interface ExerciseHistory {
  exerciseName: string;
  lastPerformance: {
    weight: number;
    reps: number;
    date: string;
  } | null;
  averagePerformance: {
    weight: number;
    reps: number;
  } | null;
  trend: "improving" | "stable" | "declining" | "new";
}

interface UseWorkoutHistoryReturn {
  exercisesHistory: Map<string, ExerciseHistory>;
  loading: boolean;
  error: string | null;
  refreshHistory: () => Promise<void>;
  getExerciseHistory: (exerciseName: string) => ExerciseHistory | null;
}

export const useWorkoutHistory = (
  exercises: Exercise[]
): UseWorkoutHistoryReturn => {
  const [exercisesHistory, setExercisesHistory] = useState<
    Map<string, ExerciseHistory>
  >(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExercisesHistory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const historyMap = new Map<string, ExerciseHistory>();

      // טען היסטוריה לכל תרגיל
      for (const exercise of exercises) {
        try {
          const previousPerformance =
            await unifiedHistoryService.getPreviousPerformanceForExercise(
              exercise.name
            );

          let exerciseHistory: ExerciseHistory;

          if (previousPerformance && previousPerformance.sets.length > 0) {
            // מצא את הסט הטוב ביותר מהאימון האחרון
            const bestSet = previousPerformance.sets.reduce((best, current) => {
              const currentVolume = current.weight * current.reps;
              const bestVolume = best.weight * best.reps;
              return currentVolume > bestVolume ? current : best;
            });

            // חשב ממוצע של כל הסטים
            const totalWeight = previousPerformance.sets.reduce(
              (sum, set) => sum + set.weight,
              0
            );
            const totalReps = previousPerformance.sets.reduce(
              (sum, set) => sum + set.reps,
              0
            );
            const avgWeight = Math.round(
              totalWeight / previousPerformance.sets.length
            );
            const avgReps = Math.round(
              totalReps / previousPerformance.sets.length
            );

            // קבע מגמה בסיסית (יכול להיות משופר בעתיד)
            let trend: ExerciseHistory["trend"] = "stable";
            const personalRecords = previousPerformance.personalRecords;
            if (
              personalRecords &&
              personalRecords.maxWeight &&
              personalRecords.maxReps
            ) {
              const currentMax = bestSet.weight * bestSet.reps;
              const recordMax =
                personalRecords.maxWeight * personalRecords.maxReps;
              if (currentMax >= recordMax * 0.95) trend = "improving";
              else if (currentMax < recordMax * 0.85) trend = "declining";
            }

            exerciseHistory = {
              exerciseName: exercise.name,
              lastPerformance: {
                weight: bestSet.weight,
                reps: bestSet.reps,
                date: previousPerformance.date,
              },
              averagePerformance: {
                weight: avgWeight,
                reps: avgReps,
              },
              trend,
            };
          } else {
            // תרגיל חדש - אין היסטוריה
            exerciseHistory = {
              exerciseName: exercise.name,
              lastPerformance: null,
              averagePerformance: null,
              trend: "new",
            };
          }

          historyMap.set(exercise.name, exerciseHistory);
        } catch (exerciseError) {
          console.warn(
            `Failed to load history for exercise ${exercise.name}:`,
            exerciseError
          );
          // הוסף תרגיל עם נתונים ריקים
          historyMap.set(exercise.name, {
            exerciseName: exercise.name,
            lastPerformance: null,
            averagePerformance: null,
            trend: "new",
          });
        }
      }

      setExercisesHistory(historyMap);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "שגיאה בטעינת היסטוריה";
      console.error("Error loading exercises history:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [exercises]);

  const getExerciseHistory = useCallback(
    (exerciseName: string): ExerciseHistory | null => {
      return exercisesHistory.get(exerciseName) || null;
    },
    [exercisesHistory]
  );

  const refreshHistory = useCallback(async () => {
    await loadExercisesHistory();
  }, [loadExercisesHistory]);

  useEffect(() => {
    if (exercises.length > 0) {
      loadExercisesHistory();
    }
  }, [loadExercisesHistory]);

  return {
    exercisesHistory,
    loading,
    error,
    refreshHistory,
    getExerciseHistory,
  };
};
