/**
 * @file exerciseFilters.ts
 * @description פונקציות סינון מרכזיות לתרגילים - מאוחדות לכל הפרויקט
 * @date 2025-01-06
 * @optimization הסרת כפילויות מרובות בין קבצי הנתונים השונים
 */

import { Exercise } from "./types";

// ====================================
// 🎯 קבועים מרכזיים לסינון
// Central filtering constants
// ====================================

export const EQUIPMENT_TYPES = {
  BODYWEIGHT: "bodyweight",
  DUMBBELLS: "dumbbells",
  RESISTANCE_BANDS: "resistance_bands",
  PULLUP_BAR: "pullup_bar",
  BARBELL: "barbell",
  CABLE_MACHINE: "cable_machine",
  NONE: "none",
} as const;

export const ENVIRONMENTS = {
  HOME: "home",
  GYM: "gym",
  OUTDOOR: "outdoor",
} as const;

export const DIFFICULTY_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;

export const NOISE_LEVELS = {
  SILENT: "silent",
  QUIET: "quiet",
  MODERATE: "moderate",
  LOUD: "loud",
} as const;

export const SPACE_REQUIREMENTS = {
  MINIMAL: "minimal",
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
} as const;

// ====================================
// 🏋️ פונקציות סינון בסיסיות
// Basic filtering functions
// ====================================

/**
 * סינון תרגילים לפי ציוד
 * Filter exercises by equipment
 */
export function filterByEquipment(
  exercises: Exercise[],
  equipment: string | string[]
): Exercise[] {
  const equipmentArray = Array.isArray(equipment) ? equipment : [equipment];

  return exercises.filter(
    (ex) =>
      equipmentArray.includes(ex.equipment) ||
      (equipmentArray.includes(EQUIPMENT_TYPES.NONE) &&
        ex.equipment === EQUIPMENT_TYPES.BODYWEIGHT)
  );
}

/**
 * סינון תרגילים לפי רמת קושי
 * Filter exercises by difficulty
 */
export function filterByDifficulty(
  exercises: Exercise[],
  difficulty: string | string[]
): Exercise[] {
  const difficultyArray = Array.isArray(difficulty) ? difficulty : [difficulty];

  return exercises.filter((ex) => difficultyArray.includes(ex.difficulty));
}

/**
 * סינון תרגילים לפי קטגוריה
 * Filter exercises by category
 */
export function filterByCategory(
  exercises: Exercise[],
  category: string | string[]
): Exercise[] {
  const categoryArray = Array.isArray(category) ? category : [category];

  return exercises.filter((ex) => categoryArray.includes(ex.category));
}

/**
 * סינון תרגילים לפי התאמה לבית
 * Filter exercises by home compatibility
 */
export function filterByHomeCompatibility(exercises: Exercise[]): Exercise[] {
  return exercises.filter((ex) => ex.homeCompatible === true);
}

/**
 * סינון תרגילים שקטים
 * Filter quiet exercises
 */
export function filterQuietExercises(exercises: Exercise[]): Exercise[] {
  return exercises.filter(
    (ex) =>
      ex.noiseLevel === NOISE_LEVELS.SILENT ||
      ex.noiseLevel === NOISE_LEVELS.QUIET
  );
}

/**
 * סינון תרגילים לפי דרישת מקום
 * Filter exercises by space requirement
 */
export function filterBySpaceRequirement(
  exercises: Exercise[],
  maxSpace: string = SPACE_REQUIREMENTS.MEDIUM
): Exercise[] {
  const spaceOrder = [
    SPACE_REQUIREMENTS.MINIMAL,
    SPACE_REQUIREMENTS.SMALL,
    SPACE_REQUIREMENTS.MEDIUM,
    SPACE_REQUIREMENTS.LARGE,
  ] as const;

  const maxIndex = spaceOrder.indexOf(maxSpace as (typeof spaceOrder)[number]);
  const allowedSpaces =
    maxIndex >= 0 ? spaceOrder.slice(0, maxIndex + 1) : spaceOrder;

  return exercises.filter((ex) =>
    allowedSpaces.includes(ex.spaceRequired as (typeof spaceOrder)[number])
  );
}

// ====================================
// 🎯 פונקציות סינון מתקדמות
// Advanced filtering functions
// ====================================

/**
 * סינון חכם לפי סביבות וציוד
 * Smart filtering by environments and equipment
 */
export function smartFilter(
  exercises: Exercise[],
  options: {
    environments?: string[];
    equipment?: string[];
    difficulty?: string;
    maxSpace?: string;
    quietOnly?: boolean;
  }
): Exercise[] {
  let filtered = [...exercises];

  // סינון לפי סביבה
  if (options.environments && options.environments.length > 0) {
    filtered = filtered.filter((ex) => {
      return options.environments!.some((env) => {
        switch (env) {
          case ENVIRONMENTS.HOME:
            return ex.homeCompatible === true;
          case ENVIRONMENTS.GYM:
            return ex.gymPreferred === true;
          case ENVIRONMENTS.OUTDOOR:
            return ex.outdoorSuitable === true;
          default:
            return true;
        }
      });
    });
  }

  // סינון לפי ציוד
  if (options.equipment && options.equipment.length > 0) {
    filtered = filterByEquipment(filtered, options.equipment);
  }

  // סינון לפי רמת קושי
  if (options.difficulty) {
    filtered = filterByDifficulty(filtered, options.difficulty);
  }

  // סינון לפי מקום
  if (options.maxSpace) {
    filtered = filterBySpaceRequirement(filtered, options.maxSpace);
  }

  // סינון תרגילים שקטים
  if (options.quietOnly) {
    filtered = filterQuietExercises(filtered);
  }

  return filtered;
}

/**
 * קבלת תרגילים לפי זמינות ציוד
 * Get exercises by available equipment
 */
export function getExercisesByAvailableEquipment(
  exercises: Exercise[],
  availableEquipment: string[]
): Exercise[] {
  if (availableEquipment.length === 0) {
    // אם אין ציוד - רק תרגילי משקל גוף
    return filterByEquipment(exercises, [
      EQUIPMENT_TYPES.BODYWEIGHT,
      EQUIPMENT_TYPES.NONE,
    ]);
  }

  // אפשר תרגילי משקל גוף + הציוד הזמין
  const allowedEquipment = [
    EQUIPMENT_TYPES.BODYWEIGHT,
    EQUIPMENT_TYPES.NONE,
    ...availableEquipment,
  ];

  return filterByEquipment(exercises, allowedEquipment);
}

// ====================================
// 📊 פונקציות נוחות לקבצי נתונים ספציפיים
// Convenience functions for specific exercise types
// ====================================

/**
 * קבלת תרגילי משקל גוף בלבד
 * Get bodyweight exercises only
 */
export function getBodyweightExercises(exercises: Exercise[]): Exercise[] {
  return filterByEquipment(exercises, [
    EQUIPMENT_TYPES.BODYWEIGHT,
    EQUIPMENT_TYPES.NONE,
  ]);
}

/**
 * קבלת תרגילים עם משקולות
 * Get dumbbell exercises
 */
export function getDumbbellExercises(exercises: Exercise[]): Exercise[] {
  return filterByEquipment(exercises, EQUIPMENT_TYPES.DUMBBELLS);
}

/**
 * קבלת תרגילי גומיות התנגדות
 * Get resistance band exercises
 */
export function getResistanceBandExercises(exercises: Exercise[]): Exercise[] {
  return filterByEquipment(exercises, EQUIPMENT_TYPES.RESISTANCE_BANDS);
}

/**
 * קבלת תרגילים מתאימים לבית
 * Get home-compatible exercises
 */
export function getHomeCompatibleExercises(exercises: Exercise[]): Exercise[] {
  return filterByHomeCompatibility(exercises);
}

/**
 * קבלת תרגילים שקטים לדירה
 * Get quiet exercises for apartment
 */
export function getQuietExercises(exercises: Exercise[]): Exercise[] {
  return filterQuietExercises(exercises);
}

// ====================================
// 🔧 פונקציות עזר לסטטיסטיקות
// Helper functions for statistics
// ====================================

/**
 * חישוב סטטיסטיקות תרגילים
 * Calculate exercise statistics
 */
export function calculateExerciseStats(exercises: Exercise[]) {
  const stats = {
    total: exercises.length,
    bodyweight: getBodyweightExercises(exercises).length,
    dumbbells: getDumbbellExercises(exercises).length,
    resistanceBands: getResistanceBandExercises(exercises).length,
    homeCompatible: getHomeCompatibleExercises(exercises).length,
    quiet: getQuietExercises(exercises).length,

    // סטטיסטיקות לפי רמת קושי
    beginner: filterByDifficulty(exercises, DIFFICULTY_LEVELS.BEGINNER).length,
    intermediate: filterByDifficulty(exercises, DIFFICULTY_LEVELS.INTERMEDIATE)
      .length,
    advanced: filterByDifficulty(exercises, DIFFICULTY_LEVELS.ADVANCED).length,

    // סטטיסטיקות לפי קטגורית תרגיל
    strength: filterByCategory(exercises, "strength").length,
    cardio: filterByCategory(exercises, "cardio").length,
    flexibility: filterByCategory(exercises, "flexibility").length,
    core: filterByCategory(exercises, "core").length,
  };

  return stats;
}

/**
 * סינון מותאם אישית עם קריטריונים מרובים
 * Custom filter with multiple criteria
 */
export function customFilter(
  exercises: Exercise[],
  criteria: {
    equipment?: string[];
    difficulty?: string[];
    category?: string[];
    environment?: string[];
    quietOnly?: boolean;
    homeOnly?: boolean;
    maxSpace?: string;
    primaryMuscles?: string[];
  }
): Exercise[] {
  let filtered = [...exercises];

  if (criteria.equipment) {
    filtered = filterByEquipment(filtered, criteria.equipment);
  }

  if (criteria.difficulty) {
    filtered = filterByDifficulty(filtered, criteria.difficulty);
  }

  if (criteria.category) {
    filtered = filterByCategory(filtered, criteria.category);
  }

  if (criteria.homeOnly) {
    filtered = filterByHomeCompatibility(filtered);
  }

  if (criteria.quietOnly) {
    filtered = filterQuietExercises(filtered);
  }

  if (criteria.maxSpace) {
    filtered = filterBySpaceRequirement(filtered, criteria.maxSpace);
  }

  if (criteria.primaryMuscles && criteria.primaryMuscles.length > 0) {
    filtered = filtered.filter((ex) =>
      criteria.primaryMuscles!.some((muscle) =>
        ex.primaryMuscles.includes(muscle)
      )
    );
  }

  return filtered;
}
