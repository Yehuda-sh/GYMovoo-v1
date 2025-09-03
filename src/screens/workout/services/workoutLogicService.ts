/**
 * @file src/screens/workout/services/workoutLogicService.ts
 * @brief Workout Logic Service - שירות לוגיקה לתוכניות אימון
 * @dependencies Exercise types, constants
 * @updated September 2025 - Code cleanup: Removed unused functions and console.log statements
 */

import { allExercises as ALL_EXERCISES } from "../../../data/exercises";
import { ExerciseTemplate } from "../types/workout.types";
import { logger } from "../../../utils/logger";
import {
  normalizeEquipment,
  canPerform,
  checkExerciseAvailability,
  type EquipmentTag,
} from "../../../utils/equipmentCatalog";
import { GOAL_MAP, DEFAULT_GOAL } from "../utils/workoutConstants";

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
  switch (diff) {
    case "advanced":
      return 5;
    case "intermediate":
      return 4;
    default:
      return 3;
  }
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
 * Check if exercise targets the required muscle groups
 */
const checkMuscleMatch = (
  exercise: { primaryMuscles?: string[] },
  muscleGroups: string[]
): boolean => {
  return (
    exercise.primaryMuscles?.some((muscle: string) => {
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
    }) ?? false
  );
};

/**
 * Helper function to convert exercises to workout templates
 */
const createExerciseTemplate = (
  exercise: { id: string; instructions?: { he: string[]; en: string[] } },
  experience: string,
  metadata: Record<string | number, string | string[]>
): ExerciseTemplate => ({
  exerciseId: exercise.id,
  sets: getSetsForExperience(experience),
  reps: getRepsForGoal((metadata.goal as string) || DEFAULT_GOAL),
  restTime: getRestTimeForGoal((metadata.goal as string) || DEFAULT_GOAL),
  notes: exercise.instructions?.he[0] || "בצע את התרגיל לפי ההנחיות",
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
  const muscleFilteredExercises = ALL_EXERCISES.filter((exercise) => {
    return checkMuscleMatch(exercise, muscleGroups);
  });

  // Secondary filtering: exercises that user can perform with available equipment
  const availableExercises = muscleFilteredExercises.filter((exercise) => {
    // Normalize exercise equipment to match expected format
    const exerciseEquipment =
      exercise.equipment === "none" ? "bodyweight" : exercise.equipment;
    return canPerform([exerciseEquipment as EquipmentTag], normalizedEquipment);
  });

  logger.debug("WorkoutLogicService", "Available exercises after filtering", {
    available: availableExercises.length,
    muscleFiltered: muscleFilteredExercises.length,
  });

  // If we have enough exercises, use them
  if (availableExercises.length >= exerciseCount) {
    return availableExercises
      .slice(0, exerciseCount)
      .map((exercise) =>
        createExerciseTemplate(exercise, experience, metadata)
      );
  }

  // Not enough exercises - try intelligent substitution
  logger.debug("WorkoutLogicService", "Attempting equipment substitution");

  const enhancedExercises = muscleFilteredExercises.map((exercise) => {
    const exerciseEquipment =
      exercise.equipment === "none" ? "bodyweight" : exercise.equipment;
    const availability = checkExerciseAvailability(
      [exerciseEquipment as EquipmentTag],
      normalizedEquipment
    );
    return { ...exercise, availability };
  });

  // Sort by availability score (higher is better)
  enhancedExercises.sort((a, b) => {
    const scoreA = a.availability.available
      ? !a.availability.needsSubstitutes
        ? 1.0
        : 0.8
      : 0;
    const scoreB = b.availability.available
      ? !b.availability.needsSubstitutes
        ? 1.0
        : 0.8
      : 0;
    return scoreB - scoreA;
  });

  // Take the best available exercises
  const selectedExercises = enhancedExercises.slice(0, exerciseCount);

  logger.debug("WorkoutLogicService", "Selected exercises with substitution", {
    selected: selectedExercises.length,
    scores: selectedExercises.map((ex) => ({
      id: ex.id,
      available: ex.availability.available,
    })),
  });

  if (selectedExercises.length > 0) {
    return selectedExercises.map((exercise) =>
      createExerciseTemplate(exercise, experience, metadata)
    );
  }

  // Last resort: return basic bodyweight exercises
  logger.warn("WorkoutLogicService", "Using last resort bodyweight exercises");
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
  workoutDays: Array<{ name: string; [key: string]: unknown }>,
  equipment: string[],
  experience: string,
  duration: number,
  metadata: Record<string | number, string | string[]>
): Array<{
  name: string;
  exercises: ExerciseTemplate[];
  [key: string]: unknown;
}> => {
  const normalizedEquipment = normalizeEquipment(equipment);

  return workoutDays.map((day) => ({
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
