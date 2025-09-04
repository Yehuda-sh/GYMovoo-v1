/**
 * @file src/constants/exercise.ts
 * @description Centralized exercise domain constants (muscles, categories, difficulty levels, equipment, goals).
 * @description Comprehensive exercise constants for the entire application - single source of truth.
 * @notes DRY principle applied - all exercise-related constants in one place.
 * @notes Includes validation functions and utility helpers for exercise domain.
 * @features Type-safe constants, validation functions, utility helpers, comprehensive coverage.
 * @features Rest times, intensity levels, workout frequencies, progression patterns, equipment compatibility.
 * @updated 2025-09-04 Enhanced with rest time recommendations, intensity levels, workout planning utilities, and equipment compatibility functions.
 */

export const EXERCISE_CATEGORIES = [
  "strength",
  "cardio",
  "flexibility",
  "core",
] as const;
export type ExerciseCategory = (typeof EXERCISE_CATEGORIES)[number];

export const DIFFICULTY_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
] as const;
export type ExerciseDifficulty = (typeof DIFFICULTY_LEVELS)[number];

// Canonical muscle groups (expandable). Keep lowercase; UI layer handles localization.
export const MUSCLE_GROUPS = [
  "shoulders",
  "chest",
  "back",
  "biceps",
  "triceps",
  "forearms",
  "core",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "hips",
  "neck",
] as const;
export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];

// Additional exercise-related constants for comprehensive coverage
export const EXERCISE_TYPES = [
  "compound",
  "isolation",
  "functional",
  "plyometric",
  "isometric",
] as const;
export type ExerciseType = (typeof EXERCISE_TYPES)[number];

export const EQUIPMENT_TYPES = [
  "bodyweight",
  "dumbbells",
  "barbell",
  "kettlebell",
  "resistance_bands",
  "cable_machine",
  "smith_machine",
  "leg_press",
  "treadmill",
  "bike",
  "rowing_machine",
  "pullup_bar",
  "bench",
  "foam_roller",
  "yoga_mat",
] as const;
export type EquipmentType = (typeof EQUIPMENT_TYPES)[number];

export const TRAINING_GOALS = [
  "strength",
  "hypertrophy",
  "endurance",
  "weight_loss",
  "muscle_gain",
  "general_fitness",
  "rehabilitation",
  "sports_performance",
] as const;
export type TrainingGoal = (typeof TRAINING_GOALS)[number];

export const REP_RANGES = {
  STRENGTH: { min: 1, max: 6 },
  HYPERTROPHY: { min: 8, max: 12 },
  ENDURANCE: { min: 15, max: 25 },
  GENERAL: { min: 8, max: 15 },
} as const;

export const DURATION_RANGES = {
  QUICK: { min: 5, max: 15 }, // minutes
  MODERATE: { min: 15, max: 45 },
  LONG: { min: 45, max: 90 },
  EXTENDED: { min: 90, max: 180 },
} as const;

// Rest time recommendations (in seconds)
export const REST_TIMES = {
  STRENGTH: { min: 180, max: 300 }, // 3-5 minutes
  HYPERTROPHY: { min: 60, max: 120 }, // 1-2 minutes
  ENDURANCE: { min: 30, max: 60 }, // 30-60 seconds
  CARDIO: { min: 30, max: 90 }, // 30-90 seconds between sets
  GENERAL: { min: 60, max: 90 }, // General purpose rest
} as const;

// Intensity levels for progressive overload
export const INTENSITY_LEVELS = [
  "light",
  "moderate",
  "heavy",
  "very_heavy",
] as const;
export type IntensityLevel = (typeof INTENSITY_LEVELS)[number];

// Workout frequency recommendations
export const WORKOUT_FREQUENCIES = {
  BEGINNER: { min: 2, max: 3, optimal: 3 },
  INTERMEDIATE: { min: 3, max: 5, optimal: 4 },
  ADVANCED: { min: 4, max: 6, optimal: 5 },
} as const;

// Exercise progression patterns
export const PROGRESSION_PATTERNS = [
  "linear_progression",
  "double_progression",
  "wave_loading",
  "deload_week",
  "periodization",
] as const;
export type ProgressionPattern = (typeof PROGRESSION_PATTERNS)[number];

// Equipment availability levels
export const EQUIPMENT_AVAILABILITY = [
  "minimal", // bodyweight only
  "basic", // dumbbells, bench
  "standard", // full gym access
  "premium", // all equipment available
] as const;
export type EquipmentAvailability = (typeof EQUIPMENT_AVAILABILITY)[number];

// Utility functions for working with exercise constants
export const isValidMuscleGroup = (muscle: string): muscle is MuscleGroup => {
  return MUSCLE_GROUPS.includes(muscle as MuscleGroup);
};

export const isValidExerciseCategory = (
  category: string
): category is ExerciseCategory => {
  return EXERCISE_CATEGORIES.includes(category as ExerciseCategory);
};

export const isValidDifficultyLevel = (
  level: string
): level is ExerciseDifficulty => {
  return DIFFICULTY_LEVELS.includes(level as ExerciseDifficulty);
};

export const getMuscleGroupsByCategory = (
  category: ExerciseCategory
): MuscleGroup[] => {
  const categoryMuscleMap: Record<ExerciseCategory, MuscleGroup[]> = {
    strength: [
      "shoulders",
      "chest",
      "back",
      "biceps",
      "triceps",
      "forearms",
      "quadriceps",
      "hamstrings",
      "glutes",
      "calves",
    ],
    cardio: ["quadriceps", "hamstrings", "glutes", "calves", "core"],
    flexibility: ["shoulders", "back", "hips", "hamstrings", "calves", "neck"],
    core: ["core", "hips", "back"],
  };
  return categoryMuscleMap[category] || [];
};

export const getRecommendedRepRange = (goal: TrainingGoal) => {
  const goalMap: Record<TrainingGoal, { min: number; max: number }> = {
    strength: REP_RANGES.STRENGTH,
    hypertrophy: REP_RANGES.HYPERTROPHY,
    endurance: REP_RANGES.ENDURANCE,
    weight_loss: REP_RANGES.GENERAL,
    muscle_gain: REP_RANGES.HYPERTROPHY,
    general_fitness: REP_RANGES.GENERAL,
    rehabilitation: { min: 10, max: 15 },
    sports_performance: REP_RANGES.GENERAL,
  };
  return goalMap[goal] || REP_RANGES.GENERAL;
};

// Enhanced utility functions for workout planning
export const getRestTimeRecommendation = (
  goal: TrainingGoal,
  difficulty: ExerciseDifficulty
): { min: number; max: number } => {
  let baseRest: { min: number; max: number } = REST_TIMES.GENERAL;

  switch (goal) {
    case "strength":
      baseRest = REST_TIMES.STRENGTH;
      break;
    case "hypertrophy":
    case "muscle_gain":
      baseRest = REST_TIMES.HYPERTROPHY;
      break;
    case "endurance":
    case "weight_loss":
      baseRest = REST_TIMES.ENDURANCE;
      break;
  }

  // Adjust for difficulty level
  const multiplier =
    difficulty === "beginner" ? 0.8 : difficulty === "advanced" ? 1.2 : 1.0;

  return {
    min: Math.round(baseRest.min * multiplier),
    max: Math.round(baseRest.max * multiplier),
  };
};

export const getWorkoutFrequencyRecommendation = (
  difficulty: ExerciseDifficulty,
  goal: TrainingGoal
) => {
  const baseFrequency =
    WORKOUT_FREQUENCIES[
      difficulty.toUpperCase() as keyof typeof WORKOUT_FREQUENCIES
    ];

  // Adjust based on goal
  if (goal === "rehabilitation") {
    return { min: 2, max: 3, optimal: 3 };
  }

  return baseFrequency;
};

export const getCompatibleExercises = (
  availableEquipment: EquipmentType[],
  targetMuscles: MuscleGroup[],
  _category?: ExerciseCategory
): EquipmentType[] => {
  // This would be expanded with actual exercise database
  // For now, return equipment that could target the muscles
  const muscleEquipmentMap: Record<MuscleGroup, EquipmentType[]> = {
    chest: ["bodyweight", "dumbbells", "barbell", "cable_machine", "bench"],
    back: ["bodyweight", "dumbbells", "barbell", "cable_machine", "pullup_bar"],
    shoulders: ["bodyweight", "dumbbells", "barbell", "cable_machine"],
    biceps: ["bodyweight", "dumbbells", "barbell", "cable_machine"],
    triceps: ["bodyweight", "dumbbells", "barbell", "cable_machine"],
    forearms: ["bodyweight", "dumbbells", "barbell"],
    core: ["bodyweight", "foam_roller", "yoga_mat"],
    quadriceps: [
      "bodyweight",
      "dumbbells",
      "barbell",
      "leg_press",
      "smith_machine",
    ],
    hamstrings: ["bodyweight", "dumbbells", "barbell", "leg_press"],
    glutes: ["bodyweight", "dumbbells", "barbell", "cable_machine"],
    calves: ["bodyweight", "dumbbells", "barbell", "smith_machine"],
    hips: ["bodyweight", "foam_roller", "yoga_mat"],
    neck: ["bodyweight"],
  };

  const compatibleEquipment = new Set<EquipmentType>();

  targetMuscles.forEach((muscle) => {
    const equipmentForMuscle = muscleEquipmentMap[muscle] || [];
    equipmentForMuscle.forEach((equipment) => {
      if (availableEquipment.includes(equipment)) {
        compatibleEquipment.add(equipment);
      }
    });
  });

  return Array.from(compatibleEquipment);
};

export const calculateWorkoutIntensity = (
  weight: number,
  maxWeight: number,
  reps: number
): IntensityLevel => {
  const percentage = (weight / maxWeight) * 100;

  // Adjust intensity based on reps performed
  const adjustedPercentage = percentage * (1 + (reps - 8) * 0.02); // Slight adjustment for rep count

  if (adjustedPercentage < 60) return "light";
  if (adjustedPercentage < 75) return "moderate";
  if (adjustedPercentage < 90) return "heavy";
  return "very_heavy";
};

export const getProgressionRecommendation = (
  currentLevel: ExerciseDifficulty,
  goal: TrainingGoal
): ProgressionPattern => {
  if (currentLevel === "beginner") {
    return goal === "strength" ? "linear_progression" : "double_progression";
  }

  if (currentLevel === "intermediate") {
    return "wave_loading";
  }

  return "periodization";
};
