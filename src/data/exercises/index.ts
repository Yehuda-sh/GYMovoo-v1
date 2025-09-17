/**
 * @file src/data/exercises/index.ts
 * @description ייצוא מאגר התרגילים המלא
 * Export all exercises from the database
 */

export * from "./types";
export { bodyweightExercises } from "./bodyweight";
export { cardioExercises } from "./cardio";
export { dumbbellExercises } from "./dumbbells";
export { flexibilityExercises } from "./flexibility";
export { kettlebellExercises } from "./kettlebells";
export { resistanceBandExercises } from "./resistanceBands";
export { trxExercises } from "./trx";
export { waterWeightExercises } from "./water_weights";

import { Exercise } from "./types";
import { bodyweightExercises } from "./bodyweight";
import { cardioExercises } from "./cardio";
import { dumbbellExercises } from "./dumbbells";
import { flexibilityExercises } from "./flexibility";
import { kettlebellExercises } from "./kettlebells";
import { resistanceBandExercises } from "./resistanceBands";
import { trxExercises } from "./trx";
import { waterWeightExercises } from "./water_weights";

/**
 * מאגר התרגילים המלא
 * Complete exercises database
 */
export const allExercises: Exercise[] = [
  ...bodyweightExercises,
  ...cardioExercises,
  ...dumbbellExercises,
  ...flexibilityExercises,
  ...kettlebellExercises,
  ...resistanceBandExercises,
  ...trxExercises,
  ...waterWeightExercises,
];

/**
 * תרגילים לפי קטגוריה
 * Exercises by category
 */
export const exercisesByCategory = {
  strength: allExercises.filter((ex) => ex.category === "strength"),
  cardio: allExercises.filter((ex) => ex.category === "cardio"),
  flexibility: allExercises.filter((ex) => ex.category === "flexibility"),
  core: allExercises.filter((ex) => ex.category === "core"),
};

/**
 * תרגילים לפי רמת קושי
 * Exercises by difficulty
 */
export const exercisesByDifficulty = {
  beginner: allExercises.filter((ex) => ex.difficulty === "beginner"),
  intermediate: allExercises.filter((ex) => ex.difficulty === "intermediate"),
  advanced: allExercises.filter((ex) => ex.difficulty === "advanced"),
};

/**
 * תרגילים לפי ציוד
 * Exercises by equipment
 */
export const exercisesByEquipment = {
  bodyweight: bodyweightExercises,
  dumbbells: dumbbellExercises,
  kettlebells: kettlebellExercises,
  resistance_bands: resistanceBandExercises,
  trx: trxExercises,
  water_weights: waterWeightExercises,
};

/**
 * חיפוש תרגילים לפי קריטריונים
 * Search exercises by criteria
 */
export function searchExercises(criteria: {
  category?: string;
  difficulty?: string;
  equipment?: string[];
  muscleGroup?: string[];
  homeCompatible?: boolean;
}): Exercise[] {
  return allExercises.filter((exercise) => {
    if (criteria.category && exercise.category !== criteria.category) {
      return false;
    }

    if (criteria.difficulty && exercise.difficulty !== criteria.difficulty) {
      return false;
    }

    if (
      criteria.equipment &&
      !criteria.equipment.includes(exercise.equipment)
    ) {
      return false;
    }

    if (criteria.muscleGroup) {
      const exerciseMuscles = [
        ...exercise.primaryMuscles,
        ...(exercise.secondaryMuscles || []),
      ];
      const hasMatchingMuscle = criteria.muscleGroup.some((muscle) =>
        exerciseMuscles.some((em) =>
          em.toLowerCase().includes(muscle.toLowerCase())
        )
      );
      if (!hasMatchingMuscle) {
        return false;
      }
    }

    if (
      criteria.homeCompatible !== undefined &&
      exercise.homeCompatible !== criteria.homeCompatible
    ) {
      return false;
    }

    return true;
  });
}
