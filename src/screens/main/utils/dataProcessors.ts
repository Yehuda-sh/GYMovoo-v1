/**
 * @file src/screens/main/utils/dataProcessors.ts
 * @description יוטיליטיס לעיבוד נתונים במסך הראשי
 */

import type { User } from "../../../types";
import type { WorkoutHistoryItem } from "../../../types/user.types";
import type { WorkoutExercise, Set } from "../../workout/types/workout.types";

/**
 * המרת סט תרגיל מהפורמט הישן לחדש
 */
export const convertExerciseSet = (set: {
  id?: string;
  reps?: number;
  weight?: number;
  completed?: boolean;
}): Set => ({
  id: set.id || "unknown",
  type: "working" as const,
  targetReps: set.reps || 0,
  actualReps: set.completed ? set.reps || 0 : 0,
  targetWeight: set.weight || 0,
  actualWeight: set.completed ? set.weight || 0 : 0,
  completed: set.completed || false,
  isPR: false,
  timeToComplete: 0,
});

/**
 * המרת תרגיל לפורמט הנדרש לחישוב סטטיסטיקות
 */
export const convertToWorkoutExercise = (exercise: {
  id?: string;
  name?: string;
  category?: string;
  primaryMuscles?: string[];
  equipment?: string | string[];
  sets?: Array<{
    id?: string;
    reps?: number;
    weight?: number;
    completed?: boolean;
  }>;
}): WorkoutExercise => ({
  id: exercise.id || "unknown",
  name: exercise.name || "Unknown Exercise",
  category: exercise.category || "Unknown",
  primaryMuscles: exercise.primaryMuscles || ["Unknown"],
  equipment: Array.isArray(exercise.equipment)
    ? exercise.equipment[0] || "Unknown"
    : exercise.equipment || "Unknown",
  sets: (exercise.sets || []).map(convertExerciseSet),
});

/**
 * עיבוד היסטוריית אימונים לתצוגה
 */
export const processWorkoutHistory = (
  workouts: Array<{
    id?: string;
    workout?: { name?: string };
    workoutName?: string;
    type?: string;
    date?: string | Date;
    completedAt?: string | Date;
    duration?: number;
    stats?: { duration?: number };
    feedback?: { difficulty?: number };
    rating?: number;
  }>
): WorkoutHistoryItem[] => {
  if (!workouts || !Array.isArray(workouts)) return [];

  return workouts.map((workout, index) => ({
    id: workout.id || `workout-${index}`,
    name: workout.workout?.name || workout.workoutName || "אימון כללי",
    date: workout.date || workout.completedAt || new Date(),
    duration: workout.duration || workout.stats?.duration || 0,
    rating: workout.feedback?.difficulty || workout.rating || 4.0,
  }));
};

/**
 * חישוב ימי אימון זמינים מנתוני משתמש
 */
export const getAvailableTrainingDays = (user: User | null): number => {
  if (!user) return 3;

  const smartAnswers = user.questionnaireData?.answers;
  if (smartAnswers?.availability) {
    const availability = Array.isArray(smartAnswers.availability)
      ? smartAnswers.availability[0]
      : smartAnswers.availability;

    if (typeof availability === "string") {
      const daysMap: Record<string, number> = {
        "2_days": 2,
        "3_days": 3,
        "4_days": 4,
        "5_days": 5,
        "5_plus_days": 5,
      };

      return daysMap[availability] || 3;
    }
  }

  return 3;
};

/**
 * חישוב היום הבא המומלץ לאימון
 */
export const getNextRecommendedDay = (
  workouts: WorkoutHistoryItem[],
  availableDays: number
): number => {
  if (workouts.length === 0) return 1;

  const lastWorkout = workouts[workouts.length - 1];
  const lastWorkoutType = lastWorkout?.name || "";

  if (lastWorkoutType.includes("1") || lastWorkoutType.includes("יום 1")) {
    return 2;
  } else if (
    lastWorkoutType.includes("2") ||
    lastWorkoutType.includes("יום 2")
  ) {
    return availableDays >= 3 ? 3 : 1;
  } else if (
    lastWorkoutType.includes("3") ||
    lastWorkoutType.includes("יום 3")
  ) {
    return availableDays >= 4 ? 4 : 1;
  } else if (
    lastWorkoutType.includes("4") ||
    lastWorkoutType.includes("יום 4")
  ) {
    return availableDays >= 5 ? 5 : 1;
  } else if (
    lastWorkoutType.includes("5") ||
    lastWorkoutType.includes("יום 5")
  ) {
    return 1;
  }

  return 1;
};

/**
 * חילוץ נתונים אישיים מהמשתמש לאנליטיקס
 */
export const extractPersonalDataFromUser = (user: User | null) => {
  if (!user) {
    return {
      age: "unknown" as const,
      gender: "male" as const,
      availability: "3_days" as const,
      goals: [] as string[],
      fitnessLevel: "beginner" as const,
      weight: "70",
      height: "170",
    };
  }

  const gender = (
    user.questionnaireData?.answers?.gender === "female" ? "female" : "male"
  ) as "male" | "female";

  const age = user.questionnaireData?.answers?.age?.toString() || "unknown";

  const availability = (
    Array.isArray(user.questionnaireData?.answers?.availability)
      ? user.questionnaireData.answers.availability[0] || "3_days"
      : "3_days"
  ) as "2_days" | "3_days" | "4_days" | "5_days";

  const goals = Array.isArray(user.questionnaireData?.answers?.goals)
    ? user.questionnaireData.answers.goals
    : [];

  const fitnessLevel = (user.questionnaireData?.answers?.fitnessLevel ||
    "beginner") as "beginner" | "intermediate" | "advanced";

  const weight = "70";
  const height = "170";

  return {
    age,
    gender,
    availability,
    goals,
    fitnessLevel,
    weight,
    height,
  };
};
