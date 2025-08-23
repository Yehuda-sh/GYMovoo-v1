/**
 * @file src/screens/workout/services/workoutLogicService.ts
 * @brief Workout Logic Service - שירות לוגיקה לתוכניות אימון
 * @dependencies Exercise types, constants
 * @updated August 2025 - Extracted from main screen for better separation of concerns
 */

/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { allExercises as ALL_EXERCISES } from "../../../data/exercises";
import { ExerciseTemplate } from "../types/workout.types";
import { logger } from "../../../utils/logger";
import {
  normalizeEquipment,
  canPerform,
  getExerciseAvailability,
} from "../../../utils/equipmentCatalog";
import { GOAL_MAP, DEFAULT_GOAL } from "../utils/workoutConstants";

// Global exercise state for repetition prevention
interface GlobalExerciseState {
  usedExercises_day0?: Set<string>;
  usedExercises_day1?: Set<string>;
  usedExercises_day2?: Set<string>;
  [key: string]: Set<string> | undefined;
}

declare global {
  var exerciseState: GlobalExerciseState;
}

if (typeof global !== "undefined") {
  global.exerciseState = global.exerciseState || {};
}

/**
 * Initialize exercise cache for workout generation
 */
export const initializeExerciseCache = (): void => {
  global.exerciseState.usedExercises_day0 = new Set<string>();
  global.exerciseState.usedExercises_day1 = new Set<string>();
  global.exerciseState.usedExercises_day2 = new Set<string>();
};

/**
 * Get muscle groups for a specific workout day
 */
export const getMuscleGroupsForDay = (dayName: string): string[] => {
  const muscleGroupMap: { [key: string]: string[] } = {
    "אימון מלא": ["חזה", "גב", "כתפיים", "ביצפס", "טריצפס", "רגליים", "בטן"],
    "פלג גוף עליון": ["חזה", "גב", "כתפיים", "ביצפס", "טריצפס"],
    "פלג גוף תחתון": ["רגליים", "ישבן", "שוקיים"],
    דחיפה: ["חזה", "כתפיים", "טריצפס"],
    משיכה: ["גב", "ביצפס", "כתפיים אחוריות"],
    רגליים: ["רגליים", "ישבן", "שוקיים"],
    חזה: ["חזה", "טריצפס"],
    גב: ["גב", "ביצפס"],
    כתפיים: ["כתפיים", "טרפזיוס"],
    ידיים: ["ביצפס", "טריצפס", "זרועות"],
    בטן: ["בטן", "core", "מותניים"],
    "חזה + טריצפס": ["חזה", "טריצפס"],
    "גב + ביצפס": ["גב", "ביצפס"],
    "כתפיים + בטן": ["כתפיים", "בטן", "core"],
    "ידיים + בטן": ["ביצפס", "טריצפס", "בטן"],
    "בטן + קרדיו": ["בטן", "core", "cardio"],
  };

  return muscleGroupMap[dayName] || ["חזה", "גב"];
};

/**
 * Map experience level to difficulty
 */
export const mapExperienceToDifficulty = (experience: string): string => {
  const mapping: { [key: string]: string } = {
    beginner: "beginner",
    intermediate: "intermediate",
    advanced: "advanced",
    expert: "advanced",
  };
  return mapping[experience] || "intermediate";
};

/**
 * Get sets count based on experience level
 */
export const getSetsForExperience = (experience: string): number => {
  const diff = mapExperienceToDifficulty(experience);
  if (diff === "advanced") return 5;
  if (diff === "intermediate") return 4;
  return 3;
};

/**
 * Get reps range based on goal
 */
export const getRepsForGoal = (goal: string): string => {
  switch (goal) {
    case GOAL_MAP.strength:
      return "4-6";
    case GOAL_MAP.muscle_gain:
      return "8-12";
    case GOAL_MAP.weight_loss:
      return "12-15";
    case GOAL_MAP.endurance:
      return "15-20";
    default:
      return "10-12"; // general_fitness and fallback
  }
};

/**
 * Get rest time based on goal
 */
export const getRestTimeForGoal = (goal: string): number => {
  switch (goal) {
    case GOAL_MAP.strength:
      return 120;
    case GOAL_MAP.muscle_gain:
      return 75;
    case GOAL_MAP.weight_loss:
      return 45;
    case GOAL_MAP.endurance:
      return 30;
    default:
      return 60;
  }
};

/**
 * Get difficulty filter for exercises
 */
export const getDifficultyFilter = (experience: string): string[] => {
  const diff = mapExperienceToDifficulty(experience);
  if (diff === "advanced") return ["advanced", "intermediate"];
  if (diff === "intermediate") return ["intermediate", "beginner"];
  return ["beginner"];
};

/**
 * Check if exercise targets the required muscle groups
 */
const checkMuscleMatch = (exercise: any, muscleGroups: string[]): boolean => {
  return exercise.primaryMuscles?.some((muscle: string) => {
    // Direct match
    const directMatch = muscleGroups.some(
      (group) => muscle.includes(group) || group.includes(muscle)
    );

    // Additional flexible matching for common muscle name variations
    const flexibleMatch = muscleGroups.some((group) => {
      // Hebrew to English mappings
      if (
        group === "חזה" &&
        (muscle.includes("chest") || muscle.includes("pectoral"))
      )
        return true;
      if (
        group === "גב" &&
        (muscle.includes("back") ||
          muscle.includes("lat") ||
          muscle.includes("rhomboid"))
      )
        return true;
      if (
        group === "כתפיים" &&
        (muscle.includes("shoulder") || muscle.includes("deltoid"))
      )
        return true;
      if (group === "טריצפס" && muscle.includes("tricep")) return true;
      if (group === "ביצפס" && muscle.includes("bicep")) return true;
      if (
        group === "רגליים" &&
        (muscle.includes("quad") || muscle.includes("leg"))
      )
        return true;
      if (group === "ישבן" && muscle.includes("glute")) return true;
      if (group === "בטן" && muscle.includes("core")) return true;

      // English to Hebrew mappings
      if (muscle === "chest" && group.includes("חזה")) return true;
      if (muscle === "back" && group.includes("גב")) return true;
      if (muscle === "shoulders" && group.includes("כתפיים")) return true;
      if (muscle === "triceps" && group.includes("טריצפס")) return true;
      if (muscle === "biceps" && group.includes("ביצפס")) return true;
      if (
        (muscle === "quadriceps" || muscle === "legs") &&
        group.includes("רגליים")
      )
        return true;
      if (muscle === "glutes" && group.includes("ישבן")) return true;
      if (muscle === "core" && group.includes("בטן")) return true;

      return false;
    });

    return directMatch || flexibleMatch;
  });
};

/**
 * Helper function to convert exercises to workout templates
 */
const createExerciseTemplate = (
  exercise: any,
  experience: string,
  metadata: Record<string | number, string | string[]>
): ExerciseTemplate => ({
  exerciseId: exercise.id,
  sets: getSetsForExperience(experience),
  reps: getRepsForGoal((metadata.goal as string) || DEFAULT_GOAL),
  restTime: getRestTimeForGoal((metadata.goal as string) || DEFAULT_GOAL),
  notes: exercise.instructions || "בצע את התרגיל לפי ההנחיות",
});

/**
 * Select exercises for a specific workout day with intelligent equipment handling
 */
export const selectExercisesForDay = (
  dayName: string,
  equipment: string[],
  experience: string,
  duration: number,
  metadata: Record<string | number, string | string[]>
): ExerciseTemplate[] => {
  logger.debug("Workout", "SELECTING EXERCISES FOR DAY", {
    dayName,
    equipmentCount: equipment.length,
    experience,
    duration,
  });

  // Normalize user equipment for consistent matching
  const normalizedEquipment = normalizeEquipment(equipment);

  // Get target muscle groups based on day name
  const muscleGroups = getMuscleGroupsForDay(dayName);
  const exerciseCount = Math.max(4, Math.min(8, Math.floor(duration / 10)));

  logger.debug("Workout", "Target selection", {
    muscleGroups: muscleGroups.slice(0, 3),
    exerciseCount,
    normalizedEquipment: normalizedEquipment.slice(0, 3),
  });

  // Primary filtering: exercises that target correct muscles
  const muscleFilteredExercises = ALL_EXERCISES.filter((exercise: any) => {
    return checkMuscleMatch(exercise, muscleGroups);
  });

  // Secondary filtering: exercises that user can perform with available equipment
  const availableExercises = muscleFilteredExercises.filter((exercise: any) => {
    return canPerform([exercise.equipment], normalizedEquipment);
  });

  console.log(
    "🔍 WorkoutLogicService: Available exercises after filtering:",
    availableExercises.length,
    "from muscle-filtered:",
    muscleFilteredExercises.length
  );

  // If we have enough exercises, use them
  if (availableExercises.length >= exerciseCount) {
    return availableExercises
      .slice(0, exerciseCount)
      .map((exercise) =>
        createExerciseTemplate(exercise, experience, metadata)
      );
  }

  // Not enough exercises - try intelligent substitution
  console.log("⚡ WorkoutLogicService: Attempting equipment substitution...");

  const enhancedExercises = muscleFilteredExercises.map((exercise: any) => {
    const availability = getExerciseAvailability(
      [exercise.equipment],
      normalizedEquipment
    );
    return { ...exercise, availability };
  });

  // Sort by availability score (higher is better)
  enhancedExercises.sort((a, b) => {
    const scoreA = a.availability.canPerform
      ? a.availability.isFullySupported
        ? 1.0
        : 0.8
      : 0;
    const scoreB = b.availability.canPerform
      ? b.availability.isFullySupported
        ? 1.0
        : 0.8
      : 0;
    return scoreB - scoreA;
  });

  // Take the best available exercises
  const selectedExercises = enhancedExercises.slice(0, exerciseCount);

  console.log(
    "🔧 WorkoutLogicService: Selected exercises with substitution scores:",
    selectedExercises.map((ex) => ({
      id: ex.id,
      canPerform: ex.availability.canPerform,
    }))
  );

  if (selectedExercises.length > 0) {
    return selectedExercises.map((exercise) =>
      createExerciseTemplate(exercise, experience, metadata)
    );
  }

  // Last resort: return basic bodyweight exercises
  console.log("⚠️ WorkoutLogicService: Using last resort bodyweight exercises");
  return [
    {
      exerciseId: "pushups",
      sets: getSetsForExperience(experience),
      reps: getRepsForGoal((metadata.goal as string) || DEFAULT_GOAL),
      restTime: getRestTimeForGoal((metadata.goal as string) || DEFAULT_GOAL),
      notes: "שכב על הבטן, ידיים ברוחב הכתפיים, דחף את הגוף מעלה ומטה",
    },
  ];
};

/**
 * Generate workout plan for all days
 */
export const generateWorkoutPlan = (
  workoutDays: any[],
  equipment: string[],
  experience: string,
  duration: number,
  metadata: Record<string | number, string | string[]>
): any => {
  const normalizedEquipment = normalizeEquipment(equipment);

  return workoutDays.map((day, _index) => ({
    ...day,
    exercises: selectExercisesForDay(
      day.name,
      normalizedEquipment,
      experience,
      duration,
      metadata
    ),
  }));
};
