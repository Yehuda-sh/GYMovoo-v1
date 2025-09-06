/**
 * @file Exercise Row Component
 * @description רכיב עטיפה לכרטיס תרגיל
 * @version 1.0.0
 */

import React from "react";
import { WorkoutExercise, Set } from "../types/workout.types";
import ExerciseCard from "./ExerciseCard/index";

interface ExerciseRowProps {
  exercise: WorkoutExercise;
  index: number;
  totalCount: number;
  onUpdateSet: (
    exerciseId: string,
    setId: string,
    updates: Partial<Set>
  ) => void;
  onAddSet: (exerciseId: string) => void;
  onCompleteSet: (exerciseId: string, setId: string) => void;
  onDeleteSet: (exerciseId: string, setId: string) => void;
  onReorderSets: (
    exerciseId: string,
    fromIndex: number,
    toIndex: number
  ) => void;
  onRemoveExercise: (exerciseId: string) => void;
  onStartRest: (duration: number, exerciseName: string) => void;
}

const ExerciseRow: React.FC<ExerciseRowProps> = React.memo(
  ({
    exercise,
    index,
    totalCount,
    onUpdateSet,
    onAddSet,
    onCompleteSet,
    onDeleteSet,
    onReorderSets,
    onRemoveExercise,
    onStartRest,
  }) => {
    if (!exercise || !exercise.id) {
      return null;
    }

    const isFirst = index === 0;
    const isLast = index === totalCount - 1;

    return (
      <ExerciseCard
        key={exercise.id}
        exercise={exercise}
        sets={exercise.sets || []}
        onUpdateSet={(setId: string, updates: Partial<Set>) =>
          onUpdateSet(exercise.id, setId, updates)
        }
        onAddSet={() => onAddSet(exercise.id)}
        onCompleteSet={(setId: string) => onCompleteSet(exercise.id, setId)}
        onDeleteSet={(setId: string) => onDeleteSet(exercise.id, setId)}
        onReorderSets={(fromIndex: number, toIndex: number) =>
          onReorderSets(exercise.id, fromIndex, toIndex)
        }
        onRemoveExercise={() => onRemoveExercise(exercise.id)}
        onStartRest={(duration: number) => onStartRest(duration, exercise.name)}
        isFirst={isFirst}
        isLast={isLast}
      />
    );
  }
);

ExerciseRow.displayName = "ExerciseRow";

export default ExerciseRow;
