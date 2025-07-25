/**
 * @file src/hooks/useWorkoutIntegration.ts
 * @brief Hook לאינטגרציה בין WorkoutPlan ל-QuickWorkout - פונקציונליות בסיסית
 * @brief Hook for integration between WorkoutPlan and QuickWorkout - basic functionality
 * @dependencies React Navigation, workout types
 * @notes Hook בסיסי ליצירת קשר בין מסכי האימון
 * @notes Basic hook for connecting workout screens
 */

import { useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";
import {
  WorkoutTemplate,
  ExerciseTemplate,
} from "../screens/workout/types/workout.types";

// ייבוא מאגר התרגילים
// Import exercise database
import { EXTENDED_EXERCISE_DATABASE } from "../data/exerciseDatabase";

interface UseWorkoutIntegrationReturn {
  // פונקציה להתחלת אימון מתוכנית
  startWorkoutFromPlan: (workout: WorkoutTemplate) => void;

  // פונקציה ליצירת אימון מהיר
  createQuickWorkout: () => Promise<void>;

  // פונקציה לחזרה לתוכנית
  returnToPlan: (workoutId?: string) => void;
}

export function useWorkoutIntegration(): UseWorkoutIntegrationReturn {
  const navigation = useNavigation();

  /**
   * התחלת אימון מתוכנית קיימת
   * Start workout from existing plan
   */
  const startWorkoutFromPlan = useCallback(
    (workout: WorkoutTemplate) => {
      try {
        console.log(`🏋️ Starting workout: ${workout.name}`);

        // המרת תבניות תרגיל לתרגילים פעילים
        const activeExercises = workout.exercises
          .map((template: ExerciseTemplate) => {
            // מציאת התרגיל במאגר
            const exerciseData = EXTENDED_EXERCISE_DATABASE.find(
              (ex) => ex.id === template.exerciseId
            );

            if (!exerciseData) {
              console.warn(`Exercise not found: ${template.exerciseId}`);
              return null;
            }

            // יצירת סטים פעילים
            const activeSets = Array.from(
              { length: template.sets },
              (_, i) => ({
                id: `${template.exerciseId}-set-${i + 1}`,
                type: i === 0 ? "warmup" : ("working" as const),
                targetReps: parseRepsRange(template.reps),
                targetWeight: 0, // המשתמש יקבע במהלך האימון
                completed: false,
                restTime: template.restTime,
                isPR: false,
              })
            );

            return {
              id: exerciseData.id,
              name: exerciseData.name,
              category: exerciseData.category,
              primaryMuscles: exerciseData.primaryMuscles,
              secondaryMuscles: exerciseData.secondaryMuscles || [],
              equipment: exerciseData.equipment,
              sets: activeSets,
              restTime: template.restTime,
              notes: template.notes || "",
              instructions: exerciseData.instructions || [],
              tips: exerciseData.tips || [],
            };
          })
          .filter(Boolean); // הסרת תרגילים null

        if (activeExercises.length === 0) {
          throw new Error("No valid exercises found in workout template");
        }

        // ניווט למסך אימון פעיל עם הנתונים
        (navigation as any).navigate("QuickWorkout", {
          exercises: activeExercises,
          workoutName: workout.name,
          workoutId: workout.id,
          source: "workout_plan", // זיהוי מקור
          planData: {
            targetMuscles: workout.targetMuscles,
            estimatedDuration: workout.estimatedDuration,
            equipment: workout.equipment,
          },
        });

        console.log(
          `✅ Started workout with ${activeExercises.length} exercises`
        );
      } catch (error) {
        console.error("Error starting workout from plan:", error);
        Alert.alert("שגיאה", "לא הצלחנו להתחיל את האימון. נסה שוב.");
      }
    },
    [navigation]
  );

  /**
   * יצירת אימון מהיר - פונקציונליות בסיסית
   * Create quick workout - basic functionality
   */
  const createQuickWorkout = useCallback(async () => {
    try {
      Alert.alert(
        "אימון מהיר",
        "תכונה זו תהיה זמינה בקרוב. כרגע תוכל ליצור תוכנית מותאמת דרך השאלון.",
        [{ text: "אישור", style: "default" }]
      );
    } catch (error) {
      console.error("Error creating quick workout:", error);
    }
  }, []);

  /**
   * חזרה לתוכנית מאימון פעיל
   * Return to plan from active workout
   */
  const returnToPlan = useCallback(
    (workoutId?: string) => {
      (navigation as any).navigate("WorkoutPlan", {
        returnFromWorkout: true,
        completedWorkoutId: workoutId,
      });
    },
    [navigation]
  );

  return {
    startWorkoutFromPlan,
    createQuickWorkout,
    returnToPlan,
  };
}

// פונקציות עזר פרטיות
// Private helper functions

/**
 * המרת טווח חזרות למספר יחיד
 * Convert reps range to single number
 */
function parseRepsRange(repsString: string): number {
  // המרת "8-12" ל-10 (ממוצע)
  if (repsString.includes("-")) {
    const [min, max] = repsString.split("-").map(Number);
    return Math.round((min + max) / 2);
  }
  return parseInt(repsString) || 10;
}

/**
 * Hook נפרד לניהול מצב תוכנית פעילה - זמני
 * Separate hook for active plan state management - temporary
 */
export function useActivePlan() {
  // תכונה זו תיושם בעתיד
  // This feature will be implemented in the future

  return {
    activePlan: null,
    progress: 0,
    nextWorkout: null,
    // פונקציות נוספות יתווספו בעתיד
    // Additional functions will be added in the future
  };
}
