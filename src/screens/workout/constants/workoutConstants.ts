/**
 * @file src/screens/workout/constants/workoutConstants.ts
 * @brief Workout Plans Constants - קבועים למסכי תוכניות אימון
 * @updated August 2025 - Separated from main screen for better maintainability
 */

// Workout day templates
export const WORKOUT_DAYS = {
  1: ["אימון מלא"],
  2: ["פלג גוף עליון", "פלג גוף תחתון"],
  3: ["דחיפה", "משיכה", "רגליים"],
  4: ["חזה + טריצפס", "גב + ביצפס", "רגליים", "כתפיים + בטן"],
  5: ["חזה", "גב", "רגליים", "כתפיים", "ידיים + בטן"],
  6: ["חזה", "גב", "רגליים", "כתפיים", "ידיים", "בטן + קרדיו"],
} as const;

// Icons mapping for workout days
export const DAY_ICONS: { [key: string]: string } = {
  "אימון מלא": "dumbbell",
  "פלג גוף עליון": "arm-flex",
  "פלג גוף תחתון": "run",
  דחיפה: "arrow-up-bold",
  משיכה: "arrow-down-bold",
  רגליים: "run",
  חזה: "shield",
  גב: "human",
  "גב + ביצפס": "human",
  כתפיים: "human-handsup",
  ידיים: "arm-flex",
  בטן: "ab-testing",
  "חזה + טריצפס": "shield",
  "כתפיים + בטן": "human-handsup",
  "ידיים + בטן": "arm-flex",
  "בטן + קרדיו": "run-fast",
} as const;

// Default values for workout generation
export const DEFAULT_EXPERIENCE = "intermediate";
export const DEFAULT_DURATION = "45-60";
export const DEFAULT_FREQUENCY = "3_times";
export const DEFAULT_GOAL = "build_muscle";

// Experience level mappings
export const EXPERIENCE_MAP = {
  beginner: "beginner",
  intermediate: "intermediate",
  advanced: "advanced",
  expert: "advanced", // fallback for expert level
} as const;

// Duration mappings
export const DURATION_MAP = {
  "30_45_min": "30-45",
  "45_60_min": "45-60",
  "60_90_min": "60-90",
  "90_plus_min": "90+",
} as const;

// Goal mappings
export const GOAL_MAP = {
  build_muscle: "build_muscle",
  lose_weight: "weight_loss",
  get_stronger: "strength",
  improve_endurance: "endurance",
  general_fitness: "general_fitness",
  muscle_gain: "build_muscle", // alias
  weight_loss: "weight_loss",
  strength: "strength",
  endurance: "endurance",
} as const;

// Performance tracking thresholds
export const PERFORMANCE_THRESHOLDS = {
  SLOW_RENDER_WARNING: 100, // ms
  CRITICAL_RENDER_WARNING: 200, // ms
  SLOW_RENDER_MS: 100,
  AUTO_START_DELAY: 1500,
  PRE_SELECTED_DELAY: 1000,
} as const;

// Haptic feedback types
export type HapticIntensity = "light" | "medium" | "heavy";

// Global exercise state interface
export interface GlobalExerciseState {
  usedExercises_day0?: Set<string>;
  usedExercises_day1?: Set<string>;
  usedExercises_day2?: Set<string>;
  [key: string]: Set<string> | undefined;
}

// Workout plan types
export type PlanType = "basic" | "smart";

// Equipment display types
export type EquipmentDisplayState = string[];
