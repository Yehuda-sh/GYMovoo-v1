/**
 * @file useExerciseManager.ts
 * @description ניהול תרגילים באימון פעיל
 */

import { useState, useCallback } from "react";

interface Exercise {
  id: string;
  name: string;
  sets?: Set[];
  category?: string;
  primaryMuscles?: string[];
  equipment?: string;
  restTime?: number;
}

interface Set {
  id: string;
  targetReps?: number;
  targetWeight?: number;
  actualReps?: number;
  actualWeight?: number;
  completed: boolean;
  type?: string;
  isPR?: boolean;
}

interface UseExerciseManagerProps {
  initialExercises?: Exercise[];
  pendingExercise?: {
    id: string;
    name: string;
    muscleGroup?: string;
    equipment?: string;
  };
}

export const useExerciseManager = ({
  initialExercises = [],
  pendingExercise,
}: UseExerciseManagerProps) => {
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const result = [...initialExercises];

    // הוסף תרגיל ממתין אם יש
    if (pendingExercise) {
      const newExercise: Exercise = {
        id: `${pendingExercise.id}_${Date.now()}`,
        name: pendingExercise.name,
        sets: [
          {
            id: `set_${Date.now()}`,
            targetReps: 10,
            targetWeight: 0,
            completed: false,
          },
        ],
      };
      result.push(newExercise);
    }

    return result;
  });

  const handleUpdateSet = useCallback(
    (exerciseId: string, setId: string, updates: Partial<Set>) => {
      setExercises((prev) =>
        prev.map((exercise) =>
          exercise.id === exerciseId
            ? {
                ...exercise,
                sets:
                  exercise.sets?.map((set) =>
                    set.id === setId ? { ...set, ...updates } : set
                  ) || [],
              }
            : exercise
        )
      );
    },
    []
  );

  const handleCompleteSet = useCallback((exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets:
                exercise.sets?.map((set) =>
                  set.id === setId
                    ? {
                        ...set,
                        completed: !set.completed,
                        actualReps: set.actualReps || set.targetReps || 0,
                        actualWeight: set.actualWeight || set.targetWeight || 0,
                      }
                    : set
                ) || [],
            }
          : exercise
      )
    );
  }, []);

  const handleAddSet = useCallback((exerciseId: string) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [
                ...(exercise.sets || []),
                {
                  id: `set_${Date.now()}`,
                  targetReps: 10,
                  targetWeight: 0,
                  completed: false,
                },
              ],
            }
          : exercise
      )
    );
  }, []);

  const handleDeleteSet = useCallback((exerciseId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets?.filter((set) => set.id !== setId) || [],
            }
          : exercise
      )
    );
  }, []);

  const handleAddExercise = useCallback((exercise: Exercise) => {
    const newExercise: Exercise = {
      ...exercise,
      id: `${exercise.id}_${Date.now()}`,
      sets: [
        {
          id: `set_${Date.now()}`,
          targetReps: 10,
          targetWeight: 0,
          completed: false,
        },
      ],
    };
    setExercises((prev) => [...prev, newExercise]);
  }, []);

  const handleRemoveExercise = useCallback((exerciseId: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exerciseId));
  }, []);

  return {
    exercises,
    handleUpdateSet,
    handleCompleteSet,
    handleAddSet,
    handleDeleteSet,
    handleAddExercise,
    handleRemoveExercise,
  };
};
