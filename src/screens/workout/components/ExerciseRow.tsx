/**
 * @file src/screens/workout/components/ExerciseRow.tsx
 * @brief קומפוננט מוממוש לפריט תרגיל בודד ברשימה הוירטואלית
 * @dependencies React.memo, ExerciseCard
 * @notes ביצועים מותאמים עם memo והשוואת props עמוקה
 */

import React from "react";
import ExerciseCard from "./ExerciseCard/index";
import { WorkoutExercise, Set } from "../types/workout.types";
import { logger } from "../../../utils/logger";

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

/**
 * פריט תרגיל בודד ברשימה עם אופטימיזציה לביצועים
 * Single exercise item in list with performance optimization
 */
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
    const isFirst = index === 0;
    const isLast = index === totalCount - 1;

    // Performance tracking במצב פיתוח
    const renderStart = React.useMemo(() => {
      if (__DEV__) {
        return performance.now();
      }
      return 0;
    }, []);

    React.useEffect(() => {
      if (__DEV__ && renderStart > 0) {
        const renderEnd = performance.now();
        if (renderEnd - renderStart > 16) {
          logger.debug(
            "Performance",
            `ExerciseRow ${exercise.id} render took ${(renderEnd - renderStart).toFixed(2)}ms`
          );
        }
      }
    }, [renderStart, exercise.id]);

    return (
      <ExerciseCard
        key={exercise.id}
        exercise={exercise}
        sets={exercise.sets}
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
  },
  (prevProps, nextProps) => {
    // השוואה עמוקה מותאמת לביצועים
    // Custom deep comparison for performance

    // בדיקה בסיסית של מזהה
    if (prevProps.exercise.id !== nextProps.exercise.id) {
      return false;
    }

    // בדיקת שינויים במיקום ברשימה
    if (
      prevProps.index !== nextProps.index ||
      prevProps.totalCount !== nextProps.totalCount
    ) {
      return false;
    }

    // בדיקת שינויים בסטים (השוואה עמוקה מותאמת)
    const prevSets = prevProps.exercise.sets;
    const nextSets = nextProps.exercise.sets;

    if (prevSets.length !== nextSets.length) {
      return false;
    }

    // השוואת כל סט
    for (let i = 0; i < prevSets.length; i++) {
      const prevSet = prevSets[i];
      const nextSet = nextSets[i];

      if (
        prevSet.id !== nextSet.id ||
        prevSet.targetWeight !== nextSet.targetWeight ||
        prevSet.targetReps !== nextSet.targetReps ||
        prevSet.actualWeight !== nextSet.actualWeight ||
        prevSet.actualReps !== nextSet.actualReps ||
        prevSet.completed !== nextSet.completed ||
        prevSet.restTime !== nextSet.restTime
      ) {
        return false;
      }
    }

    // בדיקת שינויים בפרטי תרגיל
    const prevEx = prevProps.exercise;
    const nextEx = nextProps.exercise;

    if (prevEx.name !== nextEx.name || prevEx.restTime !== nextEx.restTime) {
      return false;
    }

    // אם הגענו לכאן - אין שינויים משמעותיים
    return true;
  }
);

ExerciseRow.displayName = "ExerciseRow";

export default ExerciseRow;
