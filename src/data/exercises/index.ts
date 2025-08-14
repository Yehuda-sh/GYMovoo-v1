/**
 * @file exercises/index.ts
 * @description מרכז הבקרה המתקדם לכל התרגילים - עם פונקציות עזר חכמות
 * Advanced exercise control center with smart utility functions
 * @date 2025-08-15
 * @enhanced Added utility functions from all exercise categories, performance optimization
 *
 * ✅ מותאם לעקרונות DRY - Single Source of Truth
 * ✅ משתמש במערכת הסינון המרכזית מ-exerciseFilters.ts
 * ✅ מונע כפילות קוד בפונקציות הסינון
 * ✅ משלב פונקציות עזר מתקדמות מכל הקטגוריות
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
import { kettlebellExercises } from "./kettlebells";
import { trxExercises } from "./trx";
import { israeliMilitaryExercises } from "./israeli_military";
import { waterWeightExercises } from "./water_weights";

// יבוא פונקציות עזר מתקדמות מכל הקטגוריות
import {
  getBodyweightExercisesByDifficulty,
  getBodyweightExercisesByMuscle,
  generateQuickBodyweightWorkout,
  getMinimalSpaceExercises,
} from "./bodyweight";

import {
  getDumbbellsByMuscleGroup,
  generateFullBodyDumbbellWorkout,
  getWeightRecommendation,
  calculateTrainingVolume,
} from "./dumbbells";

import {
  getCardioByIntensity,
  generateHIITWorkout,
  estimateCaloriesBurned,
} from "./cardio";

import {
  getFlexibilityByIntensity,
  generateCoolDownRoutine,
  generateMorningMobilityRoutine,
  getStretchesByBodyArea,
} from "./flexibility";

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
export { kettlebellExercises } from "./kettlebells";
export { trxExercises } from "./trx";
export { israeliMilitaryExercises } from "./israeli_military";
export { waterWeightExercises } from "./water_weights";

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
  ...kettlebellExercises,
  ...trxExercises,
  ...israeliMilitaryExercises,
  ...waterWeightExercises,
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

// =====================================
// 💪 פונקציות עזר מתקדמות - ממוחוסות מהקטגוריות
// Advanced Utility Functions - Integrated from Categories
// =====================================

/**
 * יצירת אימון גוף מלא עם משקולות
 * Generate full-body dumbbell workout
 */
export function createFullBodyDumbbellWorkout(
  experience: "beginner" | "intermediate" | "advanced"
) {
  return generateFullBodyDumbbellWorkout(experience);
}

/**
 * יצירת אימון HIIT מותאם
 * Generate customized HIIT workout
 */
export function createHIITWorkout(
  difficulty: "beginner" | "intermediate" | "advanced" = "intermediate",
  duration: number = 20
) {
  return generateHIITWorkout(difficulty, duration);
}

/**
 * יצירת שגרת התרגעות לאחר אימון
 * Generate post-workout cool-down routine
 */
export function createCoolDownRoutine(
  workoutType: "strength" | "cardio" | "full_body" = "full_body",
  duration: number = 10
) {
  return generateCoolDownRoutine(workoutType, duration);
}

/**
 * יצירת שגרת ניידות בוקר
 * Generate morning mobility routine
 */
export function createMorningMobilityRoutine() {
  return generateMorningMobilityRoutine();
}

/**
 * יצירת אימון משקל גוף מהיר
 * Generate quick bodyweight workout
 */
export function createQuickBodyweightWorkout(
  duration: "short" | "medium" | "long" = "medium",
  difficulty: "beginner" | "intermediate" | "advanced" = "intermediate"
) {
  return generateQuickBodyweightWorkout(duration, difficulty);
}

/**
 * קבלת המלצת משקל לתרגיל משקולות
 * Get weight recommendation for dumbbell exercise
 */
export function getExerciseWeightRecommendation(
  exerciseId: string,
  experience: "beginner" | "intermediate" | "advanced",
  gender: "men" | "women",
  intensity: "light" | "medium" | "heavy" = "medium"
): number {
  return getWeightRecommendation(exerciseId, experience, gender, intensity);
}

/**
 * הערכת קלוריות שרופות לתרגיל קרדיו יחיד
 * Estimate calories burned for single cardio exercise
 */
export function estimateExerciseCalories(
  exerciseId: string,
  durationMinutes: number,
  weightKg: number = 70
): number {
  return estimateCaloriesBurned(exerciseId, durationMinutes, weightKg);
}

/**
 * חישוב נפח אימון כוח
 * Calculate strength training volume
 */
export function calculateWorkoutVolume(
  exercises: {
    exerciseId: string;
    sets: number;
    reps: number;
    weight: number;
  }[]
) {
  return calculateTrainingVolume(exercises);
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
// 🔍 פונקציות סינון מתקדמות נוספות
// Additional Advanced Filtering Functions
// =====================================

/**
 * קבלת תרגילי משקל גוף לפי רמת קושי
 * Get bodyweight exercises by difficulty
 */
export function getBodyweightByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced"
): Exercise[] {
  return getBodyweightExercisesByDifficulty(difficulty);
}

/**
 * קבלת תרגילי משקל גוף לפי שריר ספציפי
 * Get bodyweight exercises by muscle group
 */
export function getBodyweightByMuscle(muscle: string): Exercise[] {
  return getBodyweightExercisesByMuscle(muscle);
}

/**
 * קבלת תרגילי משקולות לפי קבוצת שרירים
 * Get dumbbell exercises by muscle group
 */
export function getDumbbellsByMuscle(
  group: "chest" | "shoulders" | "back" | "arms" | "legs"
): Exercise[] {
  return getDumbbellsByMuscleGroup(group);
}

/**
 * קבלת תרגילי קרדיו לפי עוצמה
 * Get cardio exercises by intensity
 */
export function getCardioByIntensityLevel(
  intensity: "low" | "moderate" | "high"
): Exercise[] {
  return getCardioByIntensity(intensity);
}

/**
 * קבלת תרגילי גמישות לפי עוצמה
 * Get flexibility exercises by intensity
 */
export function getFlexibilityByIntensityLevel(
  intensity: "gentle" | "moderate" | "deep"
): Exercise[] {
  return getFlexibilityByIntensity(intensity);
}

/**
 * קבלת תרגילי מתיחה לפי אזור גוף
 * Get stretches by body area
 */
export function getStretchesByArea(
  area: "upper_body" | "lower_body" | "extremities"
): Exercise[] {
  return getStretchesByBodyArea(area);
}

/**
 * קבלת תרגילים למקום מינימלי
 * Get exercises for minimal space
 */
export function getMinimalSpaceWorkout(): Exercise[] {
  return getMinimalSpaceExercises();
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
  initializeFilterSystem,
  clearFilterCache,
} from "./exerciseFilters";

// ייצוא פונקציות עזר מתקדמות מהקטגוריות
export {
  // Bodyweight utilities
  getBodyweightExercisesByDifficulty,
  getBodyweightExercisesByMuscle,
  generateQuickBodyweightWorkout,
  getMinimalSpaceExercises,

  // Dumbbell utilities
  getDumbbellsByMuscleGroup,
  generateFullBodyDumbbellWorkout,
  getWeightRecommendation,
  calculateTrainingVolume,

  // Cardio utilities
  getCardioByIntensity,
  generateHIITWorkout,
  estimateCaloriesBurned,

  // Flexibility utilities
  getFlexibilityByIntensity,
  generateCoolDownRoutine,
  generateMorningMobilityRoutine,
  getStretchesByBodyArea,
};

// =====================================
// 🎲 פונקציות תאימות ותמיכה במערכת הישנה
// Compatibility Functions for Legacy Support
// =====================================
