/**
 * @file src/navigation/types.ts
 * @brief טיפוסי ניווט גלובליים
 * @dependencies React Navigation
 * @notes קובץ נפרד לטיפוסי ניווט כדי להימנע מ-namespace issues
 */

import { Exercise } from "../services/exerciseService";

// טיפוסי ניווט מעודכנים // Updated navigation types
export type RootStackParamList = {
  Welcome: undefined;
  Login: { google?: boolean };
  Register: undefined;
  Terms: undefined;
  Questionnaire: { stage?: "profile" | "training" };
  WorkoutPlan: {
    regenerate?: boolean;
    autoStart?: boolean;
    returnFromWorkout?: boolean;
    completedWorkoutId?: string;
  };
  MainApp: undefined;
  QuickWorkout: {
    exercises?: Exercise[];
    workoutName?: string;
    workoutId?: string;
    source?: "workout_plan" | "quick_start";
    planData?: {
      targetMuscles: string[];
      estimatedDuration: number;
      equipment: string[];
    };
  };
  ExerciseList: {
    fromScreen?: string;
    mode?: "view" | "selection";
    onSelectExercise?: (exercise: Exercise) => void;
    selectedMuscleGroup?: string;
  };
  // מסכים נוספים שחסרים
  Notifications: undefined;
  Progress: undefined;
  Exercises: undefined;
  // Bottom Tab routes
  WorkoutPlans: {
    regenerate?: boolean;
    autoStart?: boolean;
    returnFromWorkout?: boolean;
    completedWorkoutId?: string;
  };
  Profile: undefined;
  History: undefined;
  Main: undefined;
};

// הגדרת טיפוסי ניווט גלובליים
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
