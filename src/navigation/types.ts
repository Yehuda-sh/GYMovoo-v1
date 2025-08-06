/**
 * @file src/navigation/types.ts
 * @brief טיפוסי ניווט גלובליים מתקדמים עם תמיכה ב-RTL
 * @brief Advanced global navigation types with RTL support
 * @dependencies React Navigation, Exercise types from workout module
 * @notes קובץ מרכזי לכל טיפוסי הניווט בפרויקט - מונע namespace conflicts
 * @notes Central file for all navigation types in project - prevents namespace conflicts
 * @version 2.1.0 - Enhanced organization and documentation
 * @updated 2025-08-04 Added comprehensive JSDoc and optimized structure
 */

import { Exercise } from "../screens/workout/types/workout.types";

/**
 * @description טיפוסי ניווט ראשיים לכל מסכי האפליקציה
 * @description Main navigation types for all application screens
 * @notes מאורגן לפי קטגוריות: Auth, Workout, Bottom Tabs, Additional
 * @notes Organized by categories: Auth, Workout, Bottom Tabs, Additional
 */
/**
 * @interface RootStackParamList
 * @description מפה מלאה של כל מסכי האפליקציה ופרמטריהם
 * @description Complete map of all application screens and their parameters
 */
export type RootStackParamList = {
  // ===============================================
  // 🔐 Authentication & Onboarding Screens
  // מסכי התחברות וחניכה
  // ===============================================

  /** @description מסך ברוכים הבאים ראשוני / Initial welcome screen */
  Welcome: undefined;

  /** @description מסך התחברות עם תמיכה ב-Google OAuth / Login screen with Google OAuth support */
  Login: { google?: boolean };

  /** @description מסך רישום משתמש חדש / New user registration screen */
  Register: undefined;

  /** @description מסך תנאי שימוש / Terms of service screen */
  Terms: undefined;

  /** @description שאלון חכם עם AI לפרופיל ואימון / Smart AI questionnaire for profile and training */
  Questionnaire: { stage?: QuestionnaireStage };

  // ===============================================
  // 🏋️ Workout & Exercise Screens
  // מסכי אימון ותרגילים
  // ===============================================

  /** @description מסך תוכניות אימון ראשי עם אפשרויות מתקדמות / Main workout plans screen with advanced options */
  WorkoutPlan: BaseWorkoutParams;

  /** @description אימון פעיל עם מעקב זמן ואמת / Active workout with real-time tracking */
  ActiveWorkout: {
    workoutData: {
      name: string;
      dayName: string;
      startTime: string;
      exercises: Exercise[];
    };
  };

  /** @description רשימת תרגילים עם מצבי תצוגה ובחירה / Exercise list with view and selection modes */
  ExerciseList: {
    fromScreen?: string;
    mode?: ExerciseListMode;
    onSelectExercise?: (exercise: Exercise) => void;
    selectedMuscleGroup?: string;
  };

  /** @description מסך פרטי תרגיל מפורט / Detailed exercise information screen */
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

  /** @description מסך ספריית תרגילים עם סינון / Exercise library screen with filtering */
  ExercisesScreen: {
    selectedMuscleGroup?: string;
    filterTitle?: string;
    returnScreen?: string;
  };

  // ===============================================
  // 📱 Main Application Container
  // מכולת האפליקציה הראשית
  // ===============================================

  /** @description מכולת האפליקציה הראשית עם ניווט תחתון / Main app container with bottom navigation */
  MainApp: undefined;

  // ===============================================
  // 📋 Additional Feature Screens
  // מסכי תכונות נוספות
  // ===============================================

  /** @description מסך התראות ועדכונים / Notifications and updates screen */
  Notifications: undefined;

  /** @description מסך מעקב התקדמות / Progress tracking screen */
  Progress: undefined;

  /** @description מסך ספריית תרגילים / Exercise library screen */
  Exercises: undefined;

  // ===============================================
  // 🧭 Bottom Navigation Tab Screens
  // מסכי ניווט תחתון (5 טאבים RTL)
  // ===============================================

  /** @description 🏠 מסך בית - מרכז הפעילות הראשי / Home screen - main activity center */
  Main: undefined;

  /** @description 🏋️ מסכי תוכניות אימון - ניהול תוכניות מתקדם / Workout plans - advanced plan management */
  WorkoutPlans: ExtendedWorkoutParams;

  /** @description 📊 מסך היסטוריית אימונים / Workout history screen */
  History: undefined;

  /** @description 👤 מסך פרופיל משתמש / User profile screen */
  Profile: undefined;
};

// ===============================================
// 🔧 Helper Types - טיפוסים עזר
// ===============================================

/**
 * @description טיפוסי מצב אימון / Workout state types
 */
export type WorkoutSource = "workout_plan" | "quick_start" | "day_selection";

/**
 * @description טיפוסי מצב רשימת תרגילים / Exercise list mode types
 */
export type ExerciseListMode = "view" | "selection";

/**
 * @description שלבי שאלון חכם / Smart questionnaire stages
 */
export type QuestionnaireStage = "profile" | "training";

/**
 * @description פרמטרי תוכנית אימון בסיסיים / Basic workout plan parameters
 * @notes משמש לשיתוף פרמטרים בין WorkoutPlan ו-WorkoutPlans
 * @notes Used for sharing parameters between WorkoutPlan and WorkoutPlans
 */
export interface BaseWorkoutParams {
  regenerate?: boolean;
  autoStart?: boolean;
  returnFromWorkout?: boolean;
  completedWorkoutId?: string;
  preSelectedDay?: number;
}

/**
 * @description פרמטרי תוכניות אימון מתקדמים / Advanced workout plans parameters
 */
export interface ExtendedWorkoutParams extends BaseWorkoutParams {
  requestedWorkoutIndex?: number;
  requestedWorkoutName?: string;
}

// ===============================================
// 🌐 Global Navigation Type Declaration
// הצהרת טיפוסי ניווט גלובליים
// ===============================================

/**
 * @description הצהרה גלובלית לטיפוסי ניווט React Navigation
 * @description Global declaration for React Navigation types
 * @notes מאפשר שימוש בטיפוסים בכל מקום בפרויקט ללא import
 * @notes Enables using types anywhere in project without import
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
