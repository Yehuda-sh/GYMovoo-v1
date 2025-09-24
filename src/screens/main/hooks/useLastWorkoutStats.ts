/**
 * @file src/screens/main/hooks/useLastWorkoutStats.ts
 * @description Hook לניהול סטטיסטיקות האימון האחרון
 */

import { useMemo } from "react";
import { calculateWorkoutStats } from "../../../features/workout/utils";

import type { WorkoutHistoryItem } from "../../../core/types/user.types";

interface UseLastWorkoutStatsProps {
  workouts?: WorkoutHistoryItem[];
}

export const useLastWorkoutStats = ({ workouts }: UseLastWorkoutStatsProps) => {
  return useMemo(() => {
    if (!Array.isArray(workouts) || workouts.length === 0) return null;

    const lastWorkout = workouts[0];
    if (!lastWorkout?.exercises?.length) return null;

    const formattedExercises = lastWorkout.exercises.map(
      (exercise, index: number) => ({
        id: exercise.id || `ex-${index}`,
        name: exercise.name || "Unknown Exercise",
        category: exercise.category || "Unknown",
        primaryMuscles: exercise.primaryMuscles || ["Unknown"],
        equipment: Array.isArray(exercise.equipment)
          ? exercise.equipment[0] || "Unknown"
          : exercise.equipment || "Unknown",
        sets: Array.isArray(exercise.sets)
          ? exercise.sets.map((set, setIndex: number) => ({
              id: set.id || `set-${index}-${setIndex}`,
              type: "working" as const,
              targetReps: set.reps || 0,
              actualReps: set.completed ? set.reps || 0 : 0,
              targetWeight: set.weight || 0,
              actualWeight: set.completed ? set.weight || 0 : 0,
              completed: !!set.completed,
              isPR: false,
              timeToComplete: 0,
            }))
          : [],
      })
    );

    return calculateWorkoutStats(formattedExercises);
  }, [workouts]);
};
