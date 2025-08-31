/**
 * @file src/screens/workout/hooks/useExerciseManager.ts
 * @brief Custom hook for managing exercises in active workout
 * @author GYMovoo Development Team
 */

import { useState, useCallback } from "react";
import { Exercise, Set } from "../types/workout.types";
import { workoutLogger } from "../../../utils";
import { logger } from "../../../utils/logger";

interface UseExerciseManagerProps {
  initialExercises?: Exercise[];
  pendingExercise?: {
    id: string;
    name: string;
    muscleGroup?: string;
    equipment?: string;
  };
}

interface UseExerciseManagerReturn {
  exercises: Exercise[];
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  handleUpdateSet: (
    exerciseId: string,
    setId: string,
    updates: Partial<Set>
  ) => void;
  handleCompleteSet: (exerciseId: string, setId: string) => void;
  handleAddSet: (exerciseId: string) => void;
  handleDeleteSet: (exerciseId: string, setId: string) => void;
  handleReorderSets: (
    exerciseId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
  handleAddExercise: (exercise: Exercise) => void;
  handleRemoveExercise: (exerciseId: string) => void;
  createDefaultSets: (exerciseId: string, count?: number) => Set[];
}

export const useExerciseManager = ({
  initialExercises = [],
  pendingExercise,
}: UseExerciseManagerProps): UseExerciseManagerReturn => {
  // Create default sets for an exercise
  const createDefaultSets = useCallback(
    (exerciseId: string, count: number = 2): Set[] => {
      return Array.from({ length: count }, (_, index) => ({
        id: `${exerciseId}_set_${index + 1}_${Date.now()}`,
        type: "working" as const,
        targetReps: 10,
        targetWeight: 0,
        completed: false,
        isPR: false,
      }));
    },
    []
  );

  // Initialize exercises with proper sets
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const base = initialExercises || [];

    if (__DEV__) {
      logger.debug("useExerciseManager", "הגדרת exercises state", {
        baseExercisesCount: base.length,
        baseExercises: base.map((ex) => ({
          id: ex.id,
          name: ex.name,
          hasSets: !!(ex.sets && ex.sets.length > 0),
          setsCount: ex.sets?.length || 0,
        })),
        hasPendingExercise: !!pendingExercise,
      });
    }

    // Convert base exercises to exercises with sets
    const baseExercisesWithSets: Exercise[] = base.map((ex) => {
      if (ex.sets && ex.sets.length > 0) {
        return ex as Exercise;
      }

      return {
        id: ex.id,
        name: ex.name,
        category: ex.category || "כללי",
        primaryMuscles: ex.primaryMuscles || ["כללי"],
        equipment: ex.equipment || "bodyweight",
        restTime: ex.restTime || 60,
        sets: createDefaultSets(ex.id),
      } as Exercise;
    });

    if (pendingExercise) {
      const newExercise: Exercise = {
        id: `${pendingExercise.id}_${Date.now()}`,
        name: pendingExercise.name,
        category: "כללי",
        primaryMuscles: pendingExercise.muscleGroup
          ? [pendingExercise.muscleGroup]
          : ["כללי"],
        equipment: pendingExercise.equipment || "bodyweight",
        restTime: 60,
        sets: createDefaultSets(pendingExercise.id, 1),
      };
      return [...baseExercisesWithSets, newExercise];
    }

    return baseExercisesWithSets;
  });

  // Update a set in an exercise
  const handleUpdateSet = useCallback(
    (exerciseId: string, setId: string, updates: Partial<Set>) => {
      workoutLogger.setCompleted(exerciseId, setId, updates);

      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.id === exerciseId) {
            return {
              ...exercise,
              sets: (exercise.sets || []).map((set: Set) => {
                if (set.id === setId) {
                  return { ...set, ...updates };
                }
                return set;
              }),
            };
          }
          return exercise;
        })
      );
    },
    []
  );

  // Complete a set
  const handleCompleteSet = useCallback((exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: (exercise.sets || []).map((set: Set) => {
              if (set.id === setId) {
                const isCompleting = !set.completed;

                // If marking as completed and no actual values, use target values
                if (isCompleting && !set.actualReps && !set.actualWeight) {
                  return {
                    ...set,
                    completed: isCompleting,
                    actualReps: set.targetReps,
                    actualWeight: set.targetWeight,
                  };
                }

                return { ...set, completed: isCompleting };
              }
              return set;
            }),
          };
        }
        return exercise;
      })
    );
  }, []);

  // Add a set to an exercise
  const handleAddSet = useCallback((exerciseId: string) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id === exerciseId) {
          const sets = exercise.sets || [];
          const lastSet = sets.length > 0 ? sets[sets.length - 1] : null;
          const newSet: Set = {
            id: `${exercise.id}_set_${Date.now()}`,
            type: "working",
            targetReps: lastSet?.targetReps || 10,
            targetWeight: lastSet?.targetWeight || 0,
            completed: false,
            isPR: false,
          };

          return {
            ...exercise,
            sets: [...(exercise.sets || []), newSet],
          };
        }
        return exercise;
      })
    );
  }, []);

  // Delete a set from an exercise
  const handleDeleteSet = useCallback((exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((exercise) => {
        if (exercise.id === exerciseId) {
          return {
            ...exercise,
            sets: (exercise.sets || []).filter((set: Set) => set.id !== setId),
          };
        }
        return exercise;
      })
    );
  }, []);

  // Reorder sets within an exercise
  const handleReorderSets = useCallback(
    (exerciseId: string, fromIndex: number, toIndex: number) => {
      workoutLogger.reorderSets(exerciseId, fromIndex, toIndex);

      setExercises((prev) =>
        prev.map((exercise) => {
          if (exercise.id === exerciseId) {
            const newSets = [...(exercise.sets || [])];
            const [movedSet] = newSets.splice(fromIndex, 1);
            newSets.splice(toIndex, 0, movedSet);

            return {
              ...exercise,
              sets: newSets,
            };
          }
          return exercise;
        })
      );
    },
    []
  );

  // Add a new exercise
  const handleAddExercise = useCallback(
    (exercise: Exercise) => {
      const newExercise: Exercise = {
        ...exercise,
        id: `${exercise.id}_${Date.now()}`,
        sets: createDefaultSets(exercise.id, 1),
      };

      setExercises((prev) => [...prev, newExercise]);
    },
    [createDefaultSets]
  );

  // Remove an exercise
  const handleRemoveExercise = useCallback((exerciseId: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  }, []);

  return {
    exercises,
    setExercises,
    handleUpdateSet,
    handleCompleteSet,
    handleAddSet,
    handleDeleteSet,
    handleReorderSets,
    handleAddExercise,
    handleRemoveExercise,
    createDefaultSets,
  };
};
