/**
 * @file exerciseFilters.ts
 * @description מערכת סינון מתקדמת לתרגילים - מרכז הלוגיקה לכל הפרויקט
 * @date 2025-08-15
 * @optimization שיפור ביצועים + הסרת כפילויות + אינטגרציה עם constants
 * @enhanced: Performance optimization, duplicate removal, constants integration
 */

import { Exercise } from "./types";
import { DIFFICULTY_LEVELS as CORE_DIFFICULTY_LEVELS } from "../../constants/exercise";

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
  KETTLEBELL: "kettlebell",
  TRX: "trx",
  WATER_BOTTLES: "water_bottles",
  WATER_GALLON: "water_gallon",
  SANDBAG: "sandbag",
  TIRE: "tire",
  NONE: "none",
} as const;

export const ENVIRONMENTS = {
  HOME: "home",
  GYM: "gym",
  OUTDOOR: "outdoor",
} as const;

// Use centralized difficulty levels instead of local definition
export const DIFFICULTY_LEVELS = {
  BEGINNER: CORE_DIFFICULTY_LEVELS[0], // "beginner"
  INTERMEDIATE: CORE_DIFFICULTY_LEVELS[1], // "intermediate"
  ADVANCED: CORE_DIFFICULTY_LEVELS[2], // "advanced"
} as const;

// Type for difficulty validation
export type FilterDifficulty =
  (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS];

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
// 🏋️ פונקציות סינון בסיסיות - מחושבות לביצועים
// Basic filtering functions - Performance optimized
// ====================================

/**
 * סינון תרגילים לפי ציוד (מיטוב ביצועים)
 * Filter exercises by equipment (performance optimized)
 */
export function filterByEquipment(
  exercises: Exercise[],
  equipment: string | string[]
): Exercise[] {
  const equipmentArray = Array.isArray(equipment) ? equipment : [equipment];

  // Performance optimization: create Set for O(1) lookup
  const equipmentSet = new Set(equipmentArray);

  return exercises.filter((ex) => {
    // Quick check for exact match
    if (equipmentSet.has(ex.equipment)) return true;

    // Special case: NONE equipment includes bodyweight
    return (
      equipmentSet.has(EQUIPMENT_TYPES.NONE) &&
      ex.equipment === EQUIPMENT_TYPES.BODYWEIGHT
    );
  });
}

/**
 * סינון תרגילים לפי רמת קושי (מיטוב ביצועים)
 * Filter exercises by difficulty (performance optimized)
 */
export function filterByDifficulty(
  exercises: Exercise[],
  difficulty: string | string[]
): Exercise[] {
  const difficultyArray = Array.isArray(difficulty) ? difficulty : [difficulty];

  // Performance optimization: create Set for O(1) lookup
  const difficultySet = new Set(difficultyArray);

  return exercises.filter((ex) => difficultySet.has(ex.difficulty));
}

/**
 * סינון תרגילים לפי קטגוריה (מיטוב ביצועים)
 * Filter exercises by category (performance optimized)
 */
export function filterByCategory(
  exercises: Exercise[],
  category: string | string[]
): Exercise[] {
  const categoryArray = Array.isArray(category) ? category : [category];

  // Performance optimization: create Set for O(1) lookup
  const categorySet = new Set(categoryArray);

  return exercises.filter((ex) => categorySet.has(ex.category));
}

/**
 * מפה מהירה לקטגוריות תרגילים
 * Fast category mapping for exercise lookup
 */
const CATEGORY_QUICK_MAP = {
  strength: new Set<string>(),
  cardio: new Set<string>(),
  flexibility: new Set<string>(),
  core: new Set<string>(),
} as const;

/**
 * אתחול מפת קטגוריות לביצועים מהירים
 * Initialize category map for fast performance
 */
export function initializeCategoryMap(exercises: Exercise[]): void {
  // Clear existing maps
  Object.values(CATEGORY_QUICK_MAP).forEach((set) => set.clear());

  // Populate quick lookup maps
  exercises.forEach((ex) => {
    const categorySet =
      CATEGORY_QUICK_MAP[ex.category as keyof typeof CATEGORY_QUICK_MAP];
    if (categorySet) {
      categorySet.add(ex.id);
    }
  });
}

/**
 * קבלת תרגילים לפי קטגוריה (ביצועים מהירים)
 * Get exercises by category (fast performance)
 */
export function getExercisesByCategory(
  exercises: Exercise[],
  category: string
): Exercise[] {
  const categorySet =
    CATEGORY_QUICK_MAP[category as keyof typeof CATEGORY_QUICK_MAP];

  if (categorySet && categorySet.size > 0) {
    // Use pre-built map for fast lookup
    return exercises.filter((ex) => categorySet.has(ex.id));
  }

  // Fallback to regular filtering
  return filterByCategory(exercises, category);
}
/**
 * סינון תרגילים לפי התאמה לבית
 * Filter exercises by home compatibility
 */
export function filterByHomeCompatibility(exercises: Exercise[]): Exercise[] {
  return exercises.filter((ex) => ex.homeCompatible === true);
}

/**
 * Cache לתרגילים שקטים (מיטוב ביצועים)
 * Cache for quiet exercises (performance optimization)
 */
let quietExercisesCache: Set<string> | null = null;

/**
 * סינון תרגילים שקטים (עם cache)
 * Filter quiet exercises (with caching)
 */
export function filterQuietExercises(exercises: Exercise[]): Exercise[] {
  // Initialize cache if needed
  if (!quietExercisesCache) {
    quietExercisesCache = new Set(
      exercises
        .filter(
          (ex) =>
            ex.noiseLevel === NOISE_LEVELS.SILENT ||
            ex.noiseLevel === NOISE_LEVELS.QUIET
        )
        .map((ex) => ex.id)
    );
  }

  return exercises.filter((ex) => quietExercisesCache!.has(ex.id));
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
// 🎯 פונקציות סינון מתקדמות - ביצועים מיטביים
// Advanced filtering functions - Optimal performance
// ====================================

/**
 * מערכת cache חכמה לביצועים מהירים
 * Smart caching system for fast performance
 */
const FilterCache = {
  equipment: new Map<string, Set<string>>(),
  difficulty: new Map<string, Set<string>>(),
  spaceRequirement: new Map<string, Set<string>>(),

  clear() {
    this.equipment.clear();
    this.difficulty.clear();
    this.spaceRequirement.clear();
  },

  getOrCreate<T extends Exercise>(
    cache: Map<string, Set<string>>,
    key: string,
    creator: () => T[]
  ): T[] {
    if (!cache.has(key)) {
      const items = creator();
      cache.set(key, new Set(items.map((item: T) => item.id)));
    }
    return creator(); // Return fresh array for immutability
  },
};

/**
 * סינון חכם לפי סביבות וציוד (ביצועים מיטביים)
 * Smart filtering by environments and equipment (optimal performance)
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
  let filtered = exercises;

  // סינון לפי סביבה (מיטוב עם Set)
  if (options.environments && options.environments.length > 0) {
    const envSet = new Set(options.environments);
    filtered = filtered.filter((ex) => {
      if (envSet.has(ENVIRONMENTS.HOME)) return ex.homeCompatible === true;
      if (envSet.has(ENVIRONMENTS.GYM)) return ex.gymPreferred === true;
      if (envSet.has(ENVIRONMENTS.OUTDOOR)) return ex.outdoorSuitable === true;
      return true;
    });
  }

  // סינון לפי ציוד (ביצועים מהירים)
  if (options.equipment && options.equipment.length > 0) {
    filtered = filterByEquipment(filtered, options.equipment);
  }

  // סינון לפי רמת קושי (ביצועים מהירים)
  if (options.difficulty) {
    filtered = filterByDifficulty(filtered, options.difficulty);
  }

  // סינון לפי מקום (מיטוב עם cache)
  if (options.maxSpace) {
    const cacheKey = options.maxSpace;
    filtered = FilterCache.getOrCreate(
      FilterCache.spaceRequirement,
      cacheKey,
      () => filterBySpaceRequirement(filtered, options.maxSpace!)
    );
  }

  // סינון תרגילים שקטים (עם cache)
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
// 🔧 פונקציות עזר לסטטיסטיקות - ביצועים מיטביים
// Helper functions for statistics - Optimal performance
// ====================================

/**
 * חישוב סטטיסטיקות תרגילים (ביצועים מהירים)
 * Calculate exercise statistics (fast performance)
 */
export function calculateExerciseStats(exercises: Exercise[]) {
  // Performance optimization: single pass through exercises
  let total = 0;
  let bodyweight = 0;
  let dumbbells = 0;
  let resistanceBands = 0;
  let homeCompatible = 0;
  let quiet = 0;
  let beginner = 0;
  let intermediate = 0;
  let advanced = 0;
  let strength = 0;
  let cardio = 0;
  let flexibility = 0;
  let core = 0;

  exercises.forEach((ex) => {
    total++;

    // Equipment stats
    switch (ex.equipment) {
      case EQUIPMENT_TYPES.BODYWEIGHT:
      case EQUIPMENT_TYPES.NONE:
        bodyweight++;
        break;
      case EQUIPMENT_TYPES.DUMBBELLS:
        dumbbells++;
        break;
      case EQUIPMENT_TYPES.RESISTANCE_BANDS:
        resistanceBands++;
        break;
    }

    // Environment stats
    if (ex.homeCompatible) homeCompatible++;

    // Noise level stats
    if (
      ex.noiseLevel === NOISE_LEVELS.SILENT ||
      ex.noiseLevel === NOISE_LEVELS.QUIET
    ) {
      quiet++;
    }

    // Difficulty stats
    switch (ex.difficulty) {
      case DIFFICULTY_LEVELS.BEGINNER:
        beginner++;
        break;
      case DIFFICULTY_LEVELS.INTERMEDIATE:
        intermediate++;
        break;
      case DIFFICULTY_LEVELS.ADVANCED:
        advanced++;
        break;
    }

    // Category stats
    switch (ex.category) {
      case "strength":
        strength++;
        break;
      case "cardio":
        cardio++;
        break;
      case "flexibility":
        flexibility++;
        break;
      case "core":
        core++;
        break;
    }
  });

  return {
    total,
    bodyweight,
    dumbbells,
    resistanceBands,
    homeCompatible,
    quiet,
    beginner,
    intermediate,
    advanced,
    strength,
    cardio,
    flexibility,
    core,
  };
}

/**
 * מנקה cache לביצועים מיטביים
 * Clear cache for optimal performance
 */
function clearFilterCache(): void {
  FilterCache.clear();
  quietExercisesCache = null;
  Object.values(CATEGORY_QUICK_MAP).forEach((set) => set.clear());
}

/**
 * אתחול מערכת הסינון לביצועים מיטביים
 * Initialize filtering system for optimal performance
 */
function initializeFilterSystem(exercises: Exercise[]): void {
  clearFilterCache();
  initializeCategoryMap(exercises);

  // Pre-populate quiet exercises cache
  filterQuietExercises(exercises);
}

/**
 * סינון מותאם אישית עם קריטריונים מרובים (שופר)
 * Enhanced custom filter with multiple criteria
 */
import { MuscleGroup } from "../../constants/exercise";

function customFilter(
  exercises: Exercise[],
  criteria: {
    equipment?: string[];
    difficulty?: string[];
    category?: string[];
    environment?: string[];
    quietOnly?: boolean;
    homeOnly?: boolean;
    maxSpace?: string;
    primaryMuscles?: MuscleGroup[];
  }
): Exercise[] {
  let filtered = exercises;

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
    const muscleSet = new Set(criteria.primaryMuscles);
    filtered = filtered.filter((ex) =>
      (ex.primaryMuscles as MuscleGroup[]).some((muscle) =>
        muscleSet.has(muscle)
      )
    );
  }

  return filtered;
}

// Export all enhanced functions
export {
  // Cache management
  clearFilterCache,
  initializeFilterSystem,

  // Enhanced filtering
  customFilter,
};
