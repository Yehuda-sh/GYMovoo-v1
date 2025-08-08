/**
 * @file exercises/index.ts
 * @description נקודת כניסה מרכזית לכל התרגילים עם מערכת סינון מרכזית
 * Central entry point for all exercises with centralized filtering system
 *
 * ✅ מותאם לעקרונות DRY - Single Source of Truth
 * ✅ משתמש במערכת הסינון המרכזית מ-exerciseFilters.ts
 * ✅ מונע כפילות קוד בפונקציות הסינון
 */

// =====================================
// 📦 יבוא טיפוסים ונתונים
// Types and Data Imports
// =====================================

import { Exercise } from "./types";
export { Exercise } from "./types";

// יבוא תרגילים לפי קטגוריות
import { bodyweightExercises } from "./bodyweight";
import { dumbbellExercises } from "./dumbbells";
import { cardioExercises } from "./cardio";
import { flexibilityExercises } from "./flexibility";
import { resistanceBandExercises } from "./resistanceBands";
import { machineExercises } from "./machines";

// יבוא מערכת הסינון המרכזית - חיסכון בכפילות קוד!
import {
  smartFilter,
  calculateExerciseStats,
  filterByEquipment,
  filterByCategory,
  filterByDifficulty,
  getHomeCompatibleExercises as getHomeCompatibleFiltered,
  getQuietExercises as getQuietFiltered,
} from "./exerciseFilters";

// יבוא תמונות זמניות
import { getTemporaryImage } from "./temporaryImages";

// =====================================
// 📊 מאגר תרגילים מאוחד
// Unified Exercise Database
// =====================================

// ייצוא קטגוריות תרגילים
export { bodyweightExercises } from "./bodyweight";
export { dumbbellExercises } from "./dumbbells";
export { cardioExercises } from "./cardio";
export { flexibilityExercises } from "./flexibility";
export { resistanceBandExercises } from "./resistanceBands";
export { machineExercises } from "./machines";

/**
 * מאגר תרגילים מאוחד - Single Source of Truth
 * Unified exercise database
 */
export const allExercises: Exercise[] = [
  ...bodyweightExercises,
  ...dumbbellExercises,
  ...cardioExercises,
  ...flexibilityExercises,
  ...resistanceBandExercises,
  ...machineExercises,
];

// =====================================
// 🔧 פונקציות נוחות לקטגוריות
// Convenience Functions for Categories
// =====================================

/**
 * החזרת תרגילי משקל גוף
 * Get bodyweight exercises from static arrays
 */
export function getBodyweightExercises(): Exercise[] {
  return bodyweightExercises;
}

/**
 * החזרת תרגילי משקולות
 * Get dumbbell exercises from static arrays
 */
export function getDumbbellExercises(): Exercise[] {
  return dumbbellExercises;
}

/**
 * החזרת תרגילי קרדיו
 * Get cardio exercises from static arrays
 */
export function getCardioExercises(): Exercise[] {
  return cardioExercises;
}

/**
 * החזרת תרגילי גמישות
 * Get flexibility exercises from static arrays
 */
export function getFlexibilityExercises(): Exercise[] {
  return flexibilityExercises;
}

/**
 * החזרת תרגילי גומיות התנגדות
 * Get resistance band exercises from static arrays
 */
export function getResistanceBandExercises(): Exercise[] {
  return resistanceBandExercises;
}

// =====================================
// 🎯 פונקציות סינון מתקדמות - מתבססות על exerciseFilters
// Advanced Filtering Functions - Based on exerciseFilters
// =====================================

/**
 * סינון חכם לפי סביבות וציוד - משתמש במערכת המרכזית
 * Smart filtering by environments and equipment - Using centralized system
 */
export function getSmartFilteredExercises(
  environments?: string[],
  equipment?: string[]
): Exercise[] {
  // 🎯 שימוש במערכת הסינון המרכזית במקום הלוגיקה הכפולה
  return smartFilter(allExercises, {
    environments: environments || [],
    equipment: equipment || [],
  });
}

/**
 * סינון תרגילים לפי ציוד - משתמש במערכת המרכזית
 * Filter exercises by equipment - Using centralized system
 */
export function filterExercisesByEquipment(equipment: string[]): Exercise[] {
  // 🔧 שימוש בפונקציית הסינון המרכזית
  return filterByEquipment(allExercises, equipment);
}

/**
 * החזרת תרגילים לפי ציוד ספציפי - משתמש במערכת המרכזית
 * Get exercises by specific equipment - Using centralized system
 */
export function getExercisesByEquipment(equipment: string): Exercise[] {
  return filterByEquipment(allExercises, [equipment]);
}

/**
 * החזרת תרגילים לפי קטגוריה - משתמש במערכת המרכזית
 * Get exercises by category - Using centralized system
 */
export function getExercisesByCategory(category: string): Exercise[] {
  return filterByCategory(allExercises, [category]);
}

/**
 * החזרת תרגילים לפי רמת קושי - משתמש במערכת המרכזית
 * Get exercises by difficulty - Using centralized system
 */
export function getExercisesByDifficulty(difficulty: string): Exercise[] {
  return filterByDifficulty(allExercises, [difficulty]);
}

/**
 * החזרת תרגילים מתאימים לבית - משתמש במערכת המרכזית
 * Get home compatible exercises - Using centralized system
 */
export function getHomeCompatibleExercises(): Exercise[] {
  return getHomeCompatibleFiltered(allExercises);
}

/**
 * החזרת תרגילים שקטים - משתמש במערכת המרכזית
 * Get quiet exercises - Using centralized system
 */
export function getQuietExercises(): Exercise[] {
  return getQuietFiltered(allExercises);
}

// =====================================
// �️ תמונות זמניות לתרגילים
// Temporary Images for Exercises
// =====================================

/**
 * מעדכן תרגילים עם תמונות זמניות
 * Updates exercises with temporary images
 */
function addTemporaryImages(exercises: Exercise[]): Exercise[] {
  return exercises.map((exercise) => ({
    ...exercise,
    media: {
      ...exercise.media,
      image: getTemporaryImage(exercise.name),
      thumbnail: getTemporaryImage(exercise.name),
    },
  }));
}

/**
 * מחזיר תרגילים רנדומליים עם תמונות זמניות
 * Returns random exercises with temporary images
 */
export function fetchRandomExercises(count: number = 15): Exercise[] {
  const shuffled = [...allExercises].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  return addTemporaryImages(selected);
}

/**
 * מחזיר כל התרגילים עם תמונות זמניות
 * Returns all exercises with temporary images
 */
export function getAllExercisesWithImages(): Exercise[] {
  return addTemporaryImages(allExercises);
}

// =====================================
// �📈 סטטיסטיקות - משתמש במערכת המרכזית
// Statistics - Using centralized system
// =====================================

/**
 * חישוב סטטיסטיקות תרגילים - משתמש במערכת המרכזית
 * Calculate exercise statistics - Using centralized system
 */
export function getExerciseStats() {
  // 🎯 שימוש בפונקציית הסטטיסטיקות המרכזית
  return calculateExerciseStats(allExercises);
}

// =====================================
// 🚀 ייצוא נוסף של פונקציות הסינון המתקדמות
// Additional Export of Advanced Filtering Functions
// =====================================

// ייצוא הפונקציות המתקדמות מהמערכת המרכזית
export {
  smartFilter,
  customFilter,
  EQUIPMENT_TYPES,
  filterByEquipment,
  filterByCategory,
  filterByDifficulty,
} from "./exerciseFilters";

// =====================================
// 🎲 פונקציות תאימות ותמיכה במערכת הישנה
// Compatibility Functions for Legacy Support
// =====================================
