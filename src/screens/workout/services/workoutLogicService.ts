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
import {
  EXPERIENCE_MAP,
  DURATION_MAP,
  GOAL_MAP,
  DEFAULT_EXPERIENCE,
  DEFAULT_DURATION,
  DEFAULT_FREQUENCY,
  DEFAULT_GOAL,
} from "../utils/workoutConstants";

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
 * Select exercises for a specific workout day
 */
export const selectExercisesForDay = (
  dayName: string,
  equipment: string[],
  experience: string,
  duration: number,
  metadata: Record<string | number, string | string[]>
): ExerciseTemplate[] => {
  console.log("🏗️ WorkoutLogicService: === SELECTING EXERCISES FOR DAY ===");
  console.log("🏗️ WorkoutLogicService: Day name:", dayName);
  console.log("🏗️ WorkoutLogicService: Available equipment:", equipment);
  console.log("🏗️ WorkoutLogicService: Experience level:", experience);
  console.log("🏗️ WorkoutLogicService: Duration:", duration);

  // Get target muscle groups based on day name
  const muscleGroups = getMuscleGroupsForDay(dayName);
  const exerciseCount = Math.max(4, Math.min(8, Math.floor(duration / 10)));

  console.log("🎯 WorkoutLogicService: Target muscle groups:", muscleGroups);
  console.log("🎯 WorkoutLogicService: Target exercise count:", exerciseCount);

  // Filter exercises by muscle groups and equipment
  const availableExercises = ALL_EXERCISES.filter((exercise: any) => {
    // Enhanced muscle check - support both Hebrew and English muscle names
    const targetsCorrectMuscles = exercise.primaryMuscles?.some(
      (muscle: string) => {
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
      }
    );

    // Enhanced equipment check - support for "none" equipment (bodyweight)
    const hasRequiredEquipment = (() => {
      const eq = (exercise.equipment || "").toLowerCase();
      const userEq = equipment.map((e) => (e || "").toLowerCase());
      // accept exact match, and treat 'none' as bodyweight
      if (userEq.includes(eq)) return true;
      if (eq === "none" || eq === "no_equipment") return true;
      if (eq === "body_weight") return userEq.includes("bodyweight");
      return eq === "bodyweight";
    })();

    return targetsCorrectMuscles && hasRequiredEquipment;
  });

  console.log(
    "🔍 WorkoutLogicService: Available exercises after filtering:",
    availableExercises.length
  );

  if (availableExercises.length === 0) {
    console.error(
      "❌ WorkoutLogicService: NO EXERCISES FOUND AFTER FILTERING!"
    );

    // Fallback: try to find ANY exercises for this equipment
    const fallbackExercises = ALL_EXERCISES.filter((exercise: any) => {
      return (
        equipment.includes(exercise.equipment) ||
        exercise.equipment === "none" ||
        exercise.equipment === "bodyweight"
      );
    });

    console.log(
      "🔧 WorkoutLogicService: Fallback exercises found:",
      fallbackExercises.length
    );

    if (fallbackExercises.length > 0) {
      // Use fallback exercises
      const selected = fallbackExercises
        .slice(0, exerciseCount)
        .map((exercise: any) => ({
          exerciseId: exercise.id,
          sets: getSetsForExperience(experience),
          reps: getRepsForGoal((metadata.goal as string) || DEFAULT_GOAL),
          restTime: getRestTimeForGoal(
            (metadata.goal as string) || DEFAULT_GOAL
          ),
          notes: exercise.instructions || "בצע את התרגיל לפי ההנחיות",
        }));

      console.log(
        "🔧 WorkoutLogicService: Using fallback exercises:",
        selected.length
      );
      return selected;
    }

    // Last resort: return basic bodyweight exercises
    return [
      {
        exerciseId: "pushups",
        sets: getSetsForExperience(experience),
        reps: getRepsForGoal((metadata.goal as string) || DEFAULT_GOAL),
        restTime: getRestTimeForGoal((metadata.goal as string) || DEFAULT_GOAL),
        notes: "שכב על הבטן, ידיים ברוחב הכתפיים, דחף את הגוף מעלה ומטה",
      },
    ];
  }

  // Select exercises ensuring variety and proper muscle group coverage
  const selectedExercises: ExerciseTemplate[] = [];
  const usedExerciseIds = new Set<string>();
  const usedMuscleGroups = new Set<string>();

  // First pass: get one exercise per muscle group
  for (const muscleGroup of muscleGroups) {
    const exerciseForMuscle = availableExercises.find((exercise: any) =>
      exercise.primaryMuscles?.some(
        (muscle: string) =>
          muscle.includes(muscleGroup) || muscleGroup.includes(muscle)
      )
    );

    if (exerciseForMuscle && selectedExercises.length < exerciseCount) {
      selectedExercises.push({
        exerciseId: exerciseForMuscle.id,
        sets: getSetsForExperience(experience),
        reps: getRepsForGoal((metadata.goal as string) || DEFAULT_GOAL),
        restTime: getRestTimeForGoal((metadata.goal as string) || DEFAULT_GOAL),
        notes:
          typeof exerciseForMuscle.instructions === "string"
            ? exerciseForMuscle.instructions
            : exerciseForMuscle.instructions?.he?.[0] ||
              "בצע את התרגיל לפי ההנחיות",
      });

      usedExerciseIds.add(exerciseForMuscle.id);
      usedMuscleGroups.add(muscleGroup);
    }
  }

  // Second pass: fill remaining slots with variety
  const remainingSlots = exerciseCount - selectedExercises.length;
  const remainingExercises = availableExercises.filter(
    (exercise: any) => !usedExerciseIds.has(exercise.id)
  );

  for (let i = 0; i < remainingSlots && i < remainingExercises.length; i++) {
    const exercise = remainingExercises[i];
    selectedExercises.push({
      exerciseId: exercise.id,
      sets: getSetsForExperience(experience),
      reps: getRepsForGoal((metadata.goal as string) || DEFAULT_GOAL),
      restTime: getRestTimeForGoal((metadata.goal as string) || DEFAULT_GOAL),
      notes:
        typeof exercise.instructions === "string"
          ? exercise.instructions
          : exercise.instructions?.he?.[0] || "בצע את התרגיל לפי ההנחיות",
    });
  }

  console.log(
    "✅ WorkoutLogicService: Final selected exercises:",
    selectedExercises.length,
    selectedExercises.map((e) => e.exerciseId)
  );

  return selectedExercises;
};

/**
 * Validate and apply smart defaults for questionnaire data
 */
export const processQuestionnaireData = (
  userQuestionnaireData: any
): Record<string, any> => {
  const questData = userQuestionnaireData as Record<
    string | number,
    string | string[]
  >;

  // Convert data to expected format
  const metadata = {
    // תדירות: ננסה קודם frequency, ואז availability (שאלון אחוד), ואז אינדקס היסטורי
    frequency:
      (questData.frequency as string) ||
      (questData["availability"] as string) ||
      (questData[7] as string),
    duration: questData.duration || questData[8],
    goal: questData.goal || questData[5],
    experience: questData.experience || questData[6],
    location: questData.location || questData[9],
    age: questData.age || questData[1],
    height: questData.height || questData[3],
    weight: questData.weight || questData[4],
    gender: questData.gender || questData[2],
  };

  console.log("🏗️ WorkoutLogicService: Processed metadata:", metadata);

  // Apply smart defaults for invalid data using constants
  if (
    !metadata.experience ||
    typeof metadata.experience !== "string" ||
    !isNaN(Number(metadata.experience))
  ) {
    metadata.experience = DEFAULT_EXPERIENCE;
  } else if (
    EXPERIENCE_MAP[metadata.experience as keyof typeof EXPERIENCE_MAP]
  ) {
    metadata.experience =
      EXPERIENCE_MAP[metadata.experience as keyof typeof EXPERIENCE_MAP];
  }

  if (!metadata.duration || typeof metadata.duration !== "string") {
    metadata.duration = DEFAULT_DURATION;
  } else if (metadata.duration.includes("_min")) {
    metadata.duration =
      DURATION_MAP[metadata.duration as keyof typeof DURATION_MAP] ||
      DEFAULT_DURATION;
  }

  if (!metadata.frequency || typeof metadata.frequency !== "string") {
    metadata.frequency = DEFAULT_FREQUENCY;
  }

  if (!metadata.goal || typeof metadata.goal !== "string") {
    metadata.goal = DEFAULT_GOAL;
  } else if (GOAL_MAP[metadata.goal as keyof typeof GOAL_MAP]) {
    metadata.goal = GOAL_MAP[metadata.goal as keyof typeof GOAL_MAP];
  }

  console.log(
    "🏗️ WorkoutLogicService: Final metadata after defaults:",
    metadata
  );

  return metadata;
};

/**
 * Validate required fields for workout generation
 */
export const validateRequiredFields = (
  data: Record<string, any>,
  fields: string[]
): string[] => {
  const missing = fields.filter((field) => !data[field]);
  return missing;
};
