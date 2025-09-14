import { WorkoutExercise } from "../core/types/workout.types";
import { AuthStackParamList } from "../features/auth";

interface WorkoutSummaryData {
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
  completedAt: string;
  difficulty?: number;
  feeling?: string;
}

export type RootStackParamList = {
  // Auth screens
  Welcome: undefined;
  Auth:
    | undefined
    | {
        screen?: keyof AuthStackParamList;
        params?: {
          fromQuestionnaire?: boolean;
        };
      };
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
      startTime: string;
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
  ExerciseList: {
    fromScreen?: string;
    mode?: "view" | "selection";
    onSelectExercise?: (exercise: WorkoutExercise) => void;
    selectedMuscleGroup?: string;
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
  ExercisesScreen: {
    selectedMuscleGroup?: string;
    filterTitle?: string;
    returnScreen?: string;
  };

  // Main app
  MainApp: undefined;

  // Additional screens
  Progress: {
    timeRange?: "7d" | "30d" | "90d" | "all";
  };

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
