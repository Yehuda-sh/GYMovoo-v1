/**
 * @file src/screens/workout/components/ExerciseRow.tsx
 * @brief קומפוננט מוממוש לפריט תרגיל בודד ברשימה הוירטואלית עם אופטימיזציות מתקדמות
 * @dependencies React.memo, ExerciseCard
 * @notes ביצועים מותאמים עם memo והשוואת props עמוקה + error handling
 * @version 2.0.0
 * @features
 * - ✅ Performance tracking מתקדם עם מדדי מורכבות
 * - ✅ Error boundary protection
 * - ✅ Deep comparison עם debug logging
 * - ✅ Safe props handling
 * - ✅ Development mode optimizations
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

    // Performance tracking במצב פיתוח עם מדדים מתקדמים
    const renderStart = React.useMemo(() => {
      if (__DEV__) {
        return performance.now();
      }
      return 0;
    }, []);

    const exerciseComplexity = React.useMemo(() => {
      // חישוב מורכבות התרגיל לניתוח ביצועים
      if (!exercise?.sets) return 0;
      return (
        exercise.sets.length *
        (exercise.sets.some((s) => s.completed) ? 1.5 : 1)
      );
    }, [exercise?.sets]);

    React.useEffect(() => {
      if (__DEV__ && renderStart > 0 && exercise?.id) {
        const renderEnd = performance.now();
        const renderTime = renderEnd - renderStart;
        const complexityThreshold = exerciseComplexity > 10 ? 20 : 16;

        if (renderTime > complexityThreshold) {
          logger.debug(
            "Performance",
            `ExerciseRow ${exercise.id} render took ${renderTime.toFixed(2)}ms (complexity: ${exerciseComplexity.toFixed(1)}, sets: ${exercise.sets?.length || 0})`
          );
        }
      }
    }, [renderStart, exercise?.id, exerciseComplexity, exercise?.sets?.length]);

    // Error boundary protection
    const safeExercise = React.useMemo(() => {
      if (!exercise || !exercise.id) {
        logger.error("ExerciseRow", "Invalid exercise data received", {
          exercise,
          index,
        });
        return null;
      }
      return exercise;
    }, [exercise, index]);

    // Early return for invalid data
    if (!safeExercise) {
      return null; // רכיב React נקי במקום JSX לא תקין
    }

    return (
      <ExerciseCard
        key={safeExercise.id}
        exercise={safeExercise}
        sets={safeExercise.sets || []}
        onUpdateSet={(setId: string, updates: Partial<Set>) =>
          onUpdateSet(safeExercise.id, setId, updates)
        }
        onAddSet={() => onAddSet(safeExercise.id)}
        onCompleteSet={(setId: string) => onCompleteSet(safeExercise.id, setId)}
        onDeleteSet={(setId: string) => onDeleteSet(safeExercise.id, setId)}
        onReorderSets={(fromIndex: number, toIndex: number) =>
          onReorderSets(safeExercise.id, fromIndex, toIndex)
        }
        onRemoveExercise={() => onRemoveExercise(safeExercise.id)}
        onStartRest={(duration: number) =>
          onStartRest(duration, safeExercise.name)
        }
        isFirst={isFirst}
        isLast={isLast}
      />
    );
  },
  (prevProps, nextProps) => {
    // השוואה עמוקה מותאמת לביצועים עם בדיקות מתקדמות
    // Custom deep comparison for performance with advanced checks

    // בדיקה בסיסית של מזהה
    if (prevProps.exercise.id !== nextProps.exercise.id) {
      if (__DEV__) {
        logger.debug(
          "ExerciseRow",
          `ID changed: ${prevProps.exercise.id} -> ${nextProps.exercise.id}`
        );
      }
      return false;
    }

    // בדיקת שינויים במיקום ברשימה
    if (
      prevProps.index !== nextProps.index ||
      prevProps.totalCount !== nextProps.totalCount
    ) {
      if (__DEV__) {
        logger.debug(
          "ExerciseRow",
          `Position changed: ${prevProps.index}/${prevProps.totalCount} -> ${nextProps.index}/${nextProps.totalCount}`
        );
      }
      return false;
    }

    // בדיקת שינויים בסטים (השוואה עמוקה מותאמת)
    const prevSets = prevProps.exercise.sets || [];
    const nextSets = nextProps.exercise.sets || [];

    if (prevSets.length !== nextSets.length) {
      if (__DEV__) {
        logger.debug(
          "ExerciseRow",
          `Sets count changed: ${prevSets.length} -> ${nextSets.length}`
        );
      }
      return false;
    }

    // השוואת כל סט עם בדיקת שינויים מפורטת
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
        if (__DEV__) {
          logger.debug(
            "ExerciseRow",
            `Set ${i} changed in exercise ${prevProps.exercise.id}`
          );
        }
        return false;
      }
    }

    // בדיקת שינויים בפרטי תרגיל
    const prevEx = prevProps.exercise;
    const nextEx = nextProps.exercise;

    if (prevEx.name !== nextEx.name || prevEx.restTime !== nextEx.restTime) {
      if (__DEV__) {
        logger.debug(
          "ExerciseRow",
          `Exercise details changed: ${prevEx.name} -> ${nextEx.name}`
        );
      }
      return false;
    }

    // אם הגענו לכאן - אין שינויים משמעותיים
    if (__DEV__) {
      logger.debug(
        "ExerciseRow",
        `No changes detected for exercise ${prevProps.exercise.id} - skipping render`
      );
    }
    return true;
  }
);

ExerciseRow.displayName = "ExerciseRow";

export default ExerciseRow;
