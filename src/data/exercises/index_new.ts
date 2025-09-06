/**
 * @file exercises/index.ts
 * @description מרכז ייצוא התרגילים
 * Exercise export center
 */

import { Exercise } from "./types";
export type { Exercise } from "./types";

// ייצוא קטגוריות תרגילים
export { bodyweightExercises } from "./bodyweight";
export { dumbbellExercises } from "./dumbbells";
export { cardioExercises } from "./cardio";
export { flexibilityExercises } from "./flexibility";
export { resistanceBandExercises } from "./resistanceBands";
export { machineExercises } from "./machines";
export { kettlebellExercises } from "./kettlebells";
export { trxExercises } from "./trx";
export { israeliMilitaryExercises } from "./israeli_military";
export { waterWeightExercises } from "./water_weights";

// יבוא התרגילים
import { bodyweightExercises } from "./bodyweight";
import { dumbbellExercises } from "./dumbbells";
import { cardioExercises } from "./cardio";
import { flexibilityExercises } from "./flexibility";
import { resistanceBandExercises } from "./resistanceBands";
import { machineExercises } from "./machines";
import { kettlebellExercises } from "./kettlebells";
import { trxExercises } from "./trx";
import { israeliMilitaryExercises } from "./israeli_military";
import { waterWeightExercises } from "./water_weights";

/**
 * מאגר תרגילים מאוחד
 * Unified exercise database
 */
export const allExercises: Exercise[] = [
  ...bodyweightExercises,
  ...dumbbellExercises,
  ...cardioExercises,
  ...flexibilityExercises,
  ...resistanceBandExercises,
  ...machineExercises,
  ...kettlebellExercises,
  ...trxExercises,
  ...israeliMilitaryExercises,
  ...waterWeightExercises,
];

/**
 * פונקציות בסיסיות לקבלת תרגילים לפי קטגוריה
 * Basic functions to get exercises by category
 */

export function getBodyweightExercises(): Exercise[] {
  return bodyweightExercises;
}

export function getDumbbellExercises(): Exercise[] {
  return dumbbellExercises;
}

export function getCardioExercises(): Exercise[] {
  return cardioExercises;
}

export function getFlexibilityExercises(): Exercise[] {
  return flexibilityExercises;
}

export function getResistanceBandExercises(): Exercise[] {
  return resistanceBandExercises;
}

/**
 * פונקציות סינון בסיסיות
 * Basic filtering functions
 */

export function getExercisesByEquipment(equipment: string): Exercise[] {
  return allExercises.filter((exercise) => exercise.equipment === equipment);
}

export function getExercisesByCategory(category: string): Exercise[] {
  return allExercises.filter((exercise) => exercise.category === category);
}

export function getExercisesByDifficulty(difficulty: string): Exercise[] {
  return allExercises.filter((exercise) => exercise.difficulty === difficulty);
}

export function getHomeCompatibleExercises(): Exercise[] {
  return allExercises.filter((exercise) => exercise.homeCompatible);
}

export function getQuietExercises(): Exercise[] {
  return allExercises.filter(
    (exercise) =>
      exercise.noiseLevel === "silent" || exercise.noiseLevel === "quiet"
  );
}

/**
 * פונקציות עזר בסיסיות
 * Basic utility functions
 */

export function getExerciseById(id: string): Exercise | undefined {
  return allExercises.find((exercise) => exercise.id === id);
}

export function getRandomExercises(count: number = 10): Exercise[] {
  const shuffled = [...allExercises].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getExerciseStats() {
  return {
    total: allExercises.length,
    byCategory: allExercises.reduce(
      (acc, exercise) => {
        acc[exercise.category] = (acc[exercise.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    byEquipment: allExercises.reduce(
      (acc, exercise) => {
        acc[exercise.equipment] = (acc[exercise.equipment] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    byDifficulty: allExercises.reduce(
      (acc, exercise) => {
        acc[exercise.difficulty] = (acc[exercise.difficulty] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
  };
}

export default allExercises;
