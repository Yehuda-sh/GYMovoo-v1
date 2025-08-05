/**
 * @file exercises/index.ts
 * @description נקודת כניסה מרכזית לכל התרגילים
 * Central entry point for all exercises
 */

// יבוא טיפוסים
import { Exercise } from "./types";
export { Exercise } from "./types";

// יבוא תרגילים לפי קטגוריות
import { bodyweightExercises } from "./bodyweight";
import { dumbbellExercises } from "./dumbbells";
import { cardioExercises } from "./cardio";
import { flexibilityExercises } from "./flexibility";
import { resistanceBandExercises } from "./resistanceBands";

// ייצוא קטגוריות
export { bodyweightExercises } from "./bodyweight";
export { dumbbellExercises } from "./dumbbells";
export { cardioExercises } from "./cardio";
export { flexibilityExercises } from "./flexibility";
export { resistanceBandExercises } from "./resistanceBands";

// מאגר תרגילים מאוחד
export const allExercises: Exercise[] = [
  ...bodyweightExercises,
  ...dumbbellExercises,
  ...cardioExercises,
  ...flexibilityExercises,
  ...resistanceBandExercises,
];

// פונקציות סינון
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

// פונקציות סינון מתקדמות
export function getSmartFilteredExercises(
  environments?: string[],
  equipment?: string[]
): Exercise[] {
  return allExercises.filter((exercise) => {
    // סינון לפי סביבה
    if (environments && environments.length > 0) {
      const hasMatchingEnvironment = environments.some((env) => {
        if (env === "בית" && exercise.equipment === "bodyweight") return true;
        if (env === "חוץ" && exercise.equipment === "bodyweight") return true;
        if (env === "חדר כושר" && exercise.equipment !== "bodyweight")
          return true;
        return false;
      });
      if (!hasMatchingEnvironment) return false;
    }

    // סינון לפי ציוד
    if (equipment && equipment.length > 0) {
      const hasMatchingEquipment = equipment.some((eq) => {
        if (eq === "ללא ציוד" && exercise.equipment === "bodyweight")
          return true;
        if (eq === "משקולות" && exercise.equipment === "dumbbells") return true;
        if (eq === "גומי התנגדות" && exercise.equipment === "resistance_bands")
          return true;
        return false;
      });
      if (!hasMatchingEquipment) return false;
    }

    return true;
  });
}

export function filterExercisesByEquipment(equipment: string[]): Exercise[] {
  return allExercises.filter((exercise) => {
    return equipment.some((eq) => {
      if (eq === "bodyweight" && exercise.equipment === "bodyweight")
        return true;
      if (eq === "dumbbells" && exercise.equipment === "dumbbells") return true;
      if (
        eq === "resistance_bands" &&
        exercise.equipment === "resistance_bands"
      )
        return true;
      return false;
    });
  });
}

export function getExercisesByEquipment(equipment: string): Exercise[] {
  return allExercises.filter((ex) => ex.equipment === equipment);
}

export function getExercisesByCategory(category: string): Exercise[] {
  return allExercises.filter((ex) => ex.category === category);
}

export function getExercisesByDifficulty(difficulty: string): Exercise[] {
  return allExercises.filter((ex) => ex.difficulty === difficulty);
}

export function getHomeCompatibleExercises(): Exercise[] {
  return allExercises.filter((ex) => ex.homeCompatible);
}

export function getQuietExercises(): Exercise[] {
  return allExercises.filter(
    (ex) => ex.noiseLevel === "silent" || ex.noiseLevel === "quiet"
  );
}

// סטטיסטיקות
export function getExerciseStats() {
  return {
    total: allExercises.length,
    bodyweight: bodyweightExercises.length,
    dumbbells: dumbbellExercises.length,
    cardio: cardioExercises.length,
    flexibility: flexibilityExercises.length,
    resistanceBands: resistanceBandExercises.length,
  };
}
