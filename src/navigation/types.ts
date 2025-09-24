// src/navigation/types.ts
/**
 * @file src/navigation/types.ts
 * @description הגדרות סוגים לניווט באפליקציה
 */
import { NavigatorScreenParams } from "@react-navigation/native";
import { WorkoutExercise } from "../core/types/workout.types";
import { AuthStackParamList } from "../features/auth";

// טיפוס עזר רופף ל-ISO DateTime (לא מחייב, רק מגן מהחלקות)
type ISODateTime = `${number}-${number}-${number}T${string}` | string;

export interface WorkoutSummaryData {
  workoutName: string;
  totalDuration: number;
  exercises: Array<{
    id: string;
    name: string;
    sets: Array<{
      reps: number;
      weight?: number;
      completed: boolean;
    }>;
    restTime?: number;
  }>;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  personalRecords: string[];
  completedAt: ISODateTime;
  difficulty?: number;
  feeling?: string;
}

export type RootStackParamList = {
  // Auth screens
  Welcome: undefined;

  // שימוש נכון בנסטינג: מפנה לסטאק של Auth
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;

  DeveloperScreen: undefined;

  // Questionnaire
  Questionnaire: {
    stage?: "profile" | "training";
  };

  // Workout screens
  WorkoutSummary: {
    workoutData: WorkoutSummaryData;
  };
  ActiveWorkout: {
    workoutData: {
      name: string;
      dayName: string;
      startTime: ISODateTime;
      exercises: WorkoutExercise[];
    };
    pendingExercise?: {
      id: string;
      name: string;
      muscleGroup?: string;
      equipment?: string;
    };
  };

  // Exercise screens
  // ⚠️ שים לב: עדיף להימנע מפונקציות בפרמטרים (לא סריאליזבילי).
  ExercisesScreen: {
    fromScreen?: string;
    mode?: "view" | "selection";
    onSelectExercise?: (exercise: WorkoutExercise) => void; // ⚠️ לא נשמר בהתמדה
    selectedMuscleGroup?: string;
    filterTitle?: string;
    returnScreen?: string;
  };

  // ✅ נוסף: מסך רשימת התרגילים שאליו אתה מנווט
  ExerciseList: {
    fromScreen?: string;
    mode?: "view" | "selection";
    onSelectExercise?: (exercise: WorkoutExercise) => void; // ⚠️ לא נשמר בהתמדה
    selectedMuscleGroup?: string;
    filterTitle?: string;
    returnScreen?: string;
  };

  ExerciseDetails: {
    exerciseId: string;
    exerciseName: string;
    muscleGroup: string;
    exerciseData?: {
      equipment?: string;
      difficulty?: string;
      instructions?: string[];
      benefits?: string[];
      tips?: string[];
    };
  };

  // Main app container
  MainApp: undefined;

  // Profile screens
  PersonalInfo: undefined;

  // Bottom navigation screens
  Main: undefined;
  WorkoutPlans: {
    regenerate?: boolean;
    autoStart?: boolean;
    returnFromWorkout?: boolean;
    completedWorkoutId?: string;
    preSelectedDay?: number;
    requestedWorkoutIndex?: number;
    requestedWorkoutName?: string;
  };
  History: undefined;
  Profile: undefined;
  QuickWorkout: undefined;
};
