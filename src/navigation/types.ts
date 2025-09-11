import { WorkoutExercise } from "../screens/workout/types/workout.types";
import { AuthStackParamList } from "../features/auth";
import { QuestionnaireStackParamList } from "../features/questionnaire";

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
  Login: {
    google?: boolean;
  };
  Register: {
    fromQuestionnaire?: boolean;
  };
  Terms: {
    source?: keyof RootStackParamList;
  };
  DeveloperScreen: undefined;

  // Questionnaire
  Questionnaire: {
    stage?: QuestionnaireStage;
  };

  // Workout screens
  WorkoutPlan: BaseWorkoutParams;
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
    mode?: ExerciseListMode;
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
  Notifications: undefined;
  Progress: {
    timeRange?: "7d" | "30d" | "90d" | "all";
  };

  // Bottom navigation screens
  Main: undefined;
  WorkoutPlans: ExtendedWorkoutParams;
  History: undefined;
  Profile: undefined;
};

// Helper types
export type WorkoutSource = "workout_plan" | "quick_start" | "day_selection";
export type ExerciseListMode = "view" | "selection";
export type QuestionnaireStage = "profile" | "training";

// Workout parameter interfaces
export interface BaseWorkoutParams {
  regenerate?: boolean;
  autoStart?: boolean;
  returnFromWorkout?: boolean;
  completedWorkoutId?: string;
  preSelectedDay?: number;
}

export interface ExtendedWorkoutParams extends BaseWorkoutParams {
  requestedWorkoutIndex?: number;
  requestedWorkoutName?: string;
}
