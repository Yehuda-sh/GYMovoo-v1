/**
 * @file src/utils/workoutSafetyUtils.ts
 * @description יוטיליטיז מאופטמים לטיפול בטוח בנתוני אימון
 */

import { WorkoutExercise, Set } from "../screens/workout/types/workout.types";
import { logger } from "./logger";

// ===============================================
// 🛡️ Validation Constants - קבועי אימות
// ===============================================

const DEFAULT_VALUES = {
  CATEGORY: "general" as const,
  PRIMARY_MUSCLES: ["general"],
  EQUIPMENT: "bodyweight" as const,
  REST_TIME_RANGE: { min: 30, max: 300, default: 90 }, // 30 seconds to 5 minutes
} as const;

const VALIDATION_RULES = {
  MIN_EXERCISE_NAME_LENGTH: 2,
  MAX_EXERCISE_NAME_LENGTH: 100,
  MIN_SETS_COUNT: 0,
  MAX_SETS_COUNT: 20,
} as const;

// ===============================================
// 🔧 Core Safety Functions - פונקציות בטיחות עיקריות
// ===============================================

/**
 * בדיקה אם לתרגיל יש סטים תקינים
 */
export const hasValidSets = (exercise?: WorkoutExercise): boolean => {
  return (exercise?.sets?.length ?? 0) > 0;
};

/**
 * קבלת רשימת סטים בטוחה עם validation
 */
export const getSafeSets = (exercise?: WorkoutExercise): Set[] => {
  const sets = exercise?.sets ?? [];

  // Validate sets count
  if (sets.length > VALIDATION_RULES.MAX_SETS_COUNT) {
    logger.warn(
      "workoutSafetyUtils",
      `Too many sets: ${sets.length}, limiting to ${VALIDATION_RULES.MAX_SETS_COUNT}`
    );
    return sets.slice(0, VALIDATION_RULES.MAX_SETS_COUNT);
  }

  return sets;
};

/**
 * נורמליזציה של זמן מנוחה לטווח הגיוני
 */
const normalizeRestTime = (restTime?: number): number => {
  if (!restTime || !Number.isFinite(restTime)) {
    return DEFAULT_VALUES.REST_TIME_RANGE.default;
  }

  const { min, max } = DEFAULT_VALUES.REST_TIME_RANGE;

  if (restTime < min) return min;
  if (restTime > max) return max;
  return restTime;
};

/**
 * אימות מקיף של תרגיל עם ברירות מחדל חכמות
 */
export const validateExercise = (
  exercise: WorkoutExercise
): WorkoutExercise => {
  if (!exercise) {
    logger.error("workoutSafetyUtils", "Exercise cannot be undefined");
    throw new Error("Exercise cannot be undefined");
  }

  // Validate exercise name
  const name = exercise.name?.trim();
  if (!name || name.length < VALIDATION_RULES.MIN_EXERCISE_NAME_LENGTH) {
    logger.warn("workoutSafetyUtils", `Invalid exercise name: "${name}"`);
  }

  if (name && name.length > VALIDATION_RULES.MAX_EXERCISE_NAME_LENGTH) {
    logger.warn(
      "workoutSafetyUtils",
      `Exercise name too long: ${name.length} chars`
    );
  }

  // Return validated exercise with safe defaults
  return {
    ...exercise,
    name: name || "Unknown Exercise",
    sets: getSafeSets(exercise), // Use our safe function
    category: exercise.category || DEFAULT_VALUES.CATEGORY,
    primaryMuscles: exercise.primaryMuscles?.length
      ? exercise.primaryMuscles
      : [...DEFAULT_VALUES.PRIMARY_MUSCLES],
    equipment: exercise.equipment || DEFAULT_VALUES.EQUIPMENT,
    restTime: normalizeRestTime(exercise.restTime),
  };
};

/**
 * אימות מערך תרגילים עם error recovery חכם
 */
export const validateExercises = (
  exercises: WorkoutExercise[]
): WorkoutExercise[] => {
  if (!Array.isArray(exercises)) {
    logger.error(
      "workoutSafetyUtils",
      "Expected array of exercises, got:",
      typeof exercises
    );
    return [];
  }

  if (exercises.length === 0) {
    logger.warn("workoutSafetyUtils", "Empty exercises array provided");
    return [];
  }

  // Filter out invalid exercises and validate the rest
  const validatedExercises: WorkoutExercise[] = [];

  exercises.forEach((exercise, index) => {
    try {
      const validated = validateExercise(exercise);
      validatedExercises.push(validated);
    } catch (error) {
      logger.error(
        "workoutSafetyUtils",
        `Failed to validate exercise at index ${index}:`,
        error
      );
      // Continue with other exercises instead of failing completely
    }
  });

  logger.info(
    "workoutSafetyUtils",
    `Validated ${validatedExercises.length}/${exercises.length} exercises`
  );
  return validatedExercises;
};

// ===============================================
// 🎯 Additional Safety Utilities - עזרים נוספים
// ===============================================

/**
 * בדיקה מהירה אם workout exercise תקין
 */
export const isValidExercise = (
  exercise?: WorkoutExercise
): exercise is WorkoutExercise => {
  return Boolean(
    exercise &&
      typeof exercise === "object" &&
      exercise.name?.trim().length >= VALIDATION_RULES.MIN_EXERCISE_NAME_LENGTH
  );
};

/**
 * ספירת תרגילים תקינים במערך
 */
export const countValidExercises = (exercises: WorkoutExercise[]): number => {
  return exercises.filter(isValidExercise).length;
};
