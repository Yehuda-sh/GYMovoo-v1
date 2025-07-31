/**
 * @file src/navigation/types.ts
 * @brief טיפוסי ניווט גלובליים
 * @dependencies React Navigation
 * @notes קובץ נפרד לטיפוסי ניווט כדי להימנע מ-namespace issues
 */

import { Exercise } from "../screens/workout/types/workout.types";

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
    preSelectedDay?: number;
  };
  MainApp: undefined;
  QuickWorkout: {
    exercises?: Exercise[];
    workoutName?: string;
    workoutId?: string;
    source?: "workout_plan" | "quick_start" | "day_selection";
    requestedDay?: number;
    planData?: {
      targetMuscles: string[];
      estimatedDuration: number;
      equipment: string[];
    };
  };
  ActiveWorkout: {
    exercise: Exercise;
    exerciseIndex: number;
    totalExercises: number;
    workoutData?: {
      name?: string;
      startTime?: string;
      exercises?: Exercise[];
    };
    onExerciseUpdate?: (exercise: Exercise) => void;
    onNavigate?: (direction: "prev" | "next") => void;
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
    requestedWorkoutIndex?: number;
    requestedWorkoutName?: string;
    preSelectedDay?: number;
  };
  Profile: undefined;
  History: undefined;
  Main: undefined;
};

// הגדרת טיפוסי ניווט גלובליים
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
