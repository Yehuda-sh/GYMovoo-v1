/**
 * @file src/navigation/types.ts
 * @brief טיפוסי ניווט גלובליים מתקדמים עם תמיכה ב-RTL, AI ואופטימיזציות
 * @brief Advanced global navigation types with RTL, AI and optimization support
 * @dependencies React Navigation, Exercise types, AI capabilities, Performance monitoring
 * @notes קובץ מרכזי לכל טיפוסי הניווט בפרויקט - מונע namespace conflicts
 * @note    // 🤖 הרחבות AI וביצועים / AI and performance extensions
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface NavigationHelpers<T = any> {
      aiInsights?: NavigationAIInsights;
      analytics?: NavigationAnalytics;
      performanceConfig?: NavigationPerformanceConfig;
    }ral file for all navigation types in project - prevents namespace conflicts
 * @performance Enhanced with lazy loading types, cache management, and analytics
 * @accessibility Advanced RTL support with AI-driven insights
 * @version 3.0.0 - Enhanced with AI insights, performance types, and advanced features
 * @updated 2025-08-15 Added comprehensive AI capabilities and performance optimizations
 */

import { Exercise } from "../screens/workout/types/workout.types";

// ===============================================
// 🤖 AI & Analytics Types - טיפוסי AI ואנליטיקה
// ===============================================

/** @description טיפוסי AI insights לניווט חכם / AI insights types for smart navigation */
export interface NavigationAnalytics {
  screenTime: number;
  interactions: number;
  lastVisited: string;
  frequency: number;
  userPreference: number; // 0-10 score
}

/** @description מידע AI לאופטימיזציית ניווט / AI insights for navigation optimization */
export interface NavigationAIInsights {
  suggestedNextScreen?: keyof RootStackParamList;
  optimizationTips: string[];
  performanceScore: number; // 0-100
  userBehaviorPattern: "efficient" | "exploring" | "confused" | "focused";
}

/** @description הגדרות performance לניווט / Navigation performance configuration */
export interface NavigationPerformanceConfig {
  lazyLoading: boolean;
  cacheStrategy: "aggressive" | "balanced" | "minimal";
  preloadScreens: (keyof RootStackParamList)[];
  analyticsEnabled: boolean;
}

/**
 * @description טיפוסי ניווט ראשיים לכל מסכי האפליקציה עם תכונות AI
 * @description Main navigation types for all application screens with AI features
 * @notes מאורגן לפי קטגוריות: Auth, Workout, Bottom Tabs, Additional + AI enhancements
 * @notes Organized by categories: Auth, Workout, Bottom Tabs, Additional + AI enhancements
 * @performance Optimized with conditional types and template literals
 * @analytics Enhanced with navigation tracking and performance monitoring
 */

/**
 * @interface RootStackParamList
 * @description מפה מלאה של כל מסכי האפליקציה ופרמטריהם עם תכונות מתקדמות
 * @description Complete map of all application screens and their parameters with advanced features
 * @performance Enhanced with AI insights, analytics, and performance tracking
 */
export type RootStackParamList = {
  // ===============================================
  // 🔐 Authentication & Onboarding Screens
  // מסכי התחברות וחניכה
  // ===============================================

  /** @description מסך ברוכים הבאים ראשוני עם AI insights / Initial welcome screen with AI insights */
  Welcome:
    | {
        aiInsights?: NavigationAIInsights;
        performanceConfig?: NavigationPerformanceConfig;
      }
    | undefined;

  /** @description מסך התחברות עם תמיכה ב-Google OAuth ואנליטיקה / Login screen with Google OAuth support and analytics */
  Login: {
    google?: boolean;
    analytics?: NavigationAnalytics;
    aiSuggestions?: string[];
  };

  /** @description מסך רישום משתמש חדש עם הדרכה חכמה / New user registration screen with smart guidance */
  Register:
    | {
        aiGuidance?: boolean;
        performanceTracking?: boolean;
      }
    | undefined;

  /** @description מסך תנאי שימוש עם אנליטיקה / Terms of service screen with analytics */
  Terms:
    | {
        source?: keyof RootStackParamList;
        analytics?: NavigationAnalytics;
      }
    | undefined;

  /** @description מסך פיתוח עם כלי ניפוי שגיאות / Developer screen with debugging tools (DEV only) */
  DeveloperScreen: undefined;

  /** @description שאלון חכם עם AI לפרופיל ואימון ואנליטיקה / Smart AI questionnaire for profile and training with analytics */
  Questionnaire: {
    stage?: QuestionnaireStage;
    aiInsights?: NavigationAIInsights;
    performanceTracking?: boolean;
  };

  // ===============================================
  // 🏋️ Workout & Exercise Screens עם תכונות AI
  // מסכי אימון ותרגילים עם יכולות חכמות
  // ===============================================

  /** @description מסך תוכניות אימון ראשי עם אפשרויות מתקדמות ו-AI / Main workout plans screen with advanced options and AI */
  WorkoutPlan: BaseWorkoutParams & {
    aiRecommendations?: string[];
    performanceInsights?: NavigationAnalytics;
    smartOptimization?: boolean;
  };

  /** @description אימון פעיל עם מעקב זמן אמת ו-AI / Active workout with real-time tracking and AI */
  ActiveWorkout: {
    workoutData: {
      name: string;
      dayName: string;
      startTime: string;
      exercises: Exercise[];
    };
    /**
     * @description הזרקת תרגיל מיידית למסך האימון הפעיל (למשל ממסך פרטי תרגיל)
     * @notes אופציונלי – אם קיים, יתווסף בתחילת המסך
     */
    pendingExercise?: {
      id: string;
      name: string;
      muscleGroup?: string;
      equipment?: string;
    };
    // 🤖 תכונות AI חדשות
    aiCoaching?: boolean;
    performanceTracking?: NavigationAnalytics;
    smartSuggestions?: string[];
  };

  /** @description רשימת תרגילים עם מצבי תצוגה ובחירה ו-AI / Exercise list with view and selection modes and AI */
  ExerciseList: {
    fromScreen?: string;
    mode?: ExerciseListMode;
    onSelectExercise?: (exercise: Exercise) => void;
    selectedMuscleGroup?: string;
    // 🤖 תכונות AI חדשות
    aiFiltering?: boolean;
    smartRecommendations?: Exercise[];
    performanceOptimization?: boolean;
  };

  /** @description מסך פרטי תרגיל מפורט עם AI insights / Detailed exercise information screen with AI insights */
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
    // 🤖 תכונות AI חדשות
    aiInsights?: NavigationAIInsights;
    personalizedTips?: string[];
    performanceData?: NavigationAnalytics;
  };

  /** @description מסך ספריית תרגילים עם סינון ו-AI / Exercise library screen with filtering and AI */
  ExercisesScreen: {
    selectedMuscleGroup?: string;
    filterTitle?: string;
    returnScreen?: string;
    // 🤖 תכונות AI חדשות
    aiCuration?: boolean;
    smartFiltering?: boolean;
    performanceOptimized?: boolean;
  };

  // ===============================================
  // 📱 Main Application Container עם תכונות AI
  // מכולת האפליקציה הראשית עם יכולות חכמות
  // ===============================================

  /** @description מכולת האפליקציה הראשית עם ניווט תחתון ו-AI / Main app container with bottom navigation and AI */
  MainApp:
    | {
        aiInsights?: NavigationAIInsights;
        performanceConfig?: NavigationPerformanceConfig;
      }
    | undefined;

  // ===============================================
  // 📋 Additional Feature Screens עם תכונות מתקדמות
  // מסכי תכונות נוספות עם יכולות חכמות
  // ===============================================

  /** @description מסך התראות ועדכונים עם AI filtering / Notifications and updates screen with AI filtering */
  Notifications:
    | {
        aiFiltering?: boolean;
        priorityLevel?: "high" | "medium" | "low";
        performanceTracking?: NavigationAnalytics;
      }
    | undefined;

  /** @description מסך מעקב התקדמות עם AI analytics / Progress tracking screen with AI analytics */
  Progress:
    | {
        aiAnalytics?: boolean;
        performanceInsights?: NavigationAIInsights;
        timeRange?: "7d" | "30d" | "90d" | "all";
      }
    | undefined;

  // ===============================================
  // 🧭 Bottom Navigation Tab Screens עם AI
  // מסכי ניווט תחתון (5 טאבים RTL) עם יכולות חכמות
  // ===============================================

  /** @description 🏠 מסך בית - מרכז הפעילות הראשי עם AI / Home screen - main activity center with AI */
  Main:
    | {
        aiDashboard?: boolean;
        performanceInsights?: NavigationAIInsights;
        smartRecommendations?: string[];
      }
    | undefined;

  /** @description 🏋️ מסכי תוכניות אימון - ניהול תוכניות מתקדם עם AI / Workout plans - advanced plan management with AI */
  WorkoutPlans: ExtendedWorkoutParams & {
    aiOptimization?: boolean;
    performanceAnalytics?: NavigationAnalytics;
    smartCuration?: boolean;
  };

  /** @description 📊 מסך היסטוריית אימונים עם AI analytics / Workout history screen with AI analytics */
  History:
    | {
        aiAnalytics?: boolean;
        performanceInsights?: NavigationAIInsights;
        smartFiltering?: boolean;
      }
    | undefined;

  /** @description 👤 מסך פרופיל משתמש עם AI personalization / User profile screen with AI personalization */
  Profile:
    | {
        aiPersonalization?: boolean;
        performanceTracking?: NavigationAnalytics;
        smartRecommendations?: string[];
      }
    | undefined;
};

// ===============================================
// 🔧 Helper Types מתקדמים - טיפוסים עזר מתקדמים
// ===============================================

/**
 * @description טיפוסי מצב אימון מתקדמים / Advanced workout state types
 */
export type WorkoutSource =
  | "workout_plan"
  | "quick_start"
  | "day_selection"
  | "ai_suggestion";

/**
 * @description טיפוסי מצב רשימת תרגילים מתקדמים / Advanced exercise list mode types
 */
export type ExerciseListMode =
  | "view"
  | "selection"
  | "ai_curation"
  | "smart_filtering";

/**
 * @description שלבי שאלון חכם מתקדמים / Advanced smart questionnaire stages
 */
export type QuestionnaireStage =
  | "profile"
  | "training"
  | "ai_analysis"
  | "personalization";

/**
 * @description דפוסי התנהגות משתמש לAI / User behavior patterns for AI
 */
export type UserBehaviorPattern =
  | "efficient"
  | "exploring"
  | "confused"
  | "focused"
  | "advanced"
  | "beginner";

/**
 * @description אסטרטגיות cache לביצועים / Cache strategies for performance
 */
export type CacheStrategy =
  | "aggressive"
  | "balanced"
  | "minimal"
  | "ai_optimized";

/**
 * @description רמות עדיפות להתראות / Priority levels for notifications
 */
export type PriorityLevel = "critical" | "high" | "medium" | "low" | "info";

/**
 * @description טווחי זמן לאנליטיקה / Time ranges for analytics
 */
export type AnalyticsTimeRange =
  | "1d"
  | "7d"
  | "30d"
  | "90d"
  | "1y"
  | "all"
  | "custom";

// ===============================================
// 🚀 Advanced Interface Types - ממשקים מתקדמים
// ===============================================

/**
 * @description פרמטרי תוכנית אימון בסיסיים מתקדמים / Advanced basic workout plan parameters
 * @notes משמש לשיתוף פרמטרים בין WorkoutPlan ו-WorkoutPlans עם תכונות AI
 * @notes Used for sharing parameters between WorkoutPlan and WorkoutPlans with AI features
 */
export interface BaseWorkoutParams {
  regenerate?: boolean;
  autoStart?: boolean;
  returnFromWorkout?: boolean;
  completedWorkoutId?: string;
  preSelectedDay?: number;
  // 🤖 תכונות AI חדשות
  aiOptimized?: boolean;
  performanceTracking?: boolean;
  smartRecommendations?: boolean;
}

/**
 * @description פרמטרי תוכניות אימון מתקדמים עם AI / Advanced workout plans parameters with AI
 */
export interface ExtendedWorkoutParams extends BaseWorkoutParams {
  requestedWorkoutIndex?: number;
  requestedWorkoutName?: string;
  // 🤖 תכונות AI מתקדמות
  aiPersonalization?: boolean;
  performanceAnalytics?: NavigationAnalytics;
  smartCuration?: boolean;
  behaviorPattern?: UserBehaviorPattern;
}

// ===============================================
// 🎯 Template Literal Types - טיפוסי תבנית מתקדמים
// ===============================================

/**
 * @description טיפוסי מסך דינמיים / Dynamic screen types
 */
export type ScreenWithAI<T extends keyof RootStackParamList> = `${T}_with_ai`;
export type ScreenWithAnalytics<T extends keyof RootStackParamList> =
  `${T}_with_analytics`;

/**
 * @description מסכים שתומכים ב-AI / AI-supported screens
 */
export type AISupportedScreens =
  | "Welcome"
  | "Login"
  | "Questionnaire"
  | "WorkoutPlan"
  | "ActiveWorkout"
  | "Main"
  | "Profile";

/**
 * @description מסכים עם אנליטיקה / Analytics-enabled screens
 */
export type AnalyticsEnabledScreens = keyof RootStackParamList;

// ===============================================
// 🔄 Conditional Types - טיפוסים תנאיים
// ===============================================

/**
 * @description טיפוס תנאי לפרמטרי מסך / Conditional type for screen parameters
 */
export type ScreenParams<T extends keyof RootStackParamList> =
  RootStackParamList[T] extends undefined
    ? { aiInsights?: NavigationAIInsights }
    : RootStackParamList[T] & { aiInsights?: NavigationAIInsights };

/**
 * @description טיפוס תנאי למסכים עם ביצועים / Conditional type for performance-enabled screens
 */
export type PerformanceEnabledScreen<T extends keyof RootStackParamList> =
  T extends AISupportedScreens
    ? RootStackParamList[T] & { performanceConfig: NavigationPerformanceConfig }
    : RootStackParamList[T];

// ===============================================
// 🌐 Global Navigation Type Declaration מתקדם
// הצהרת טיפוסי ניווט גלובליים מתקדמים
// ===============================================

/**
 * @description הצהרה גלובלית לטיפוסי ניווט React Navigation עם תכונות AI
 * @description Global declaration for React Navigation types with AI features
 * @notes מאפשר שימוש בטיפוסים בכל מקום בפרויקט ללא import עם תמיכה ב-AI
 * @notes Enables using types anywhere in project without import with AI support
 * @performance Enhanced with performance tracking and analytics
 * @accessibility Advanced RTL support with AI-driven navigation optimization
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootStackParamList {}

    // 🤖 הרחבות AI וביצועים / AI and performance extensions
    interface NavigationHelpers {
      aiInsights?: NavigationAIInsights;
      analytics?: NavigationAnalytics;
      performanceConfig?: NavigationPerformanceConfig;
    }
  }
}

// ===============================================
// 📈 Export Utilities - כלים מותאמים לייצוא
// ===============================================

/**
 * @description כלי עזר לזיהוי מסכים עם AI / Utility for identifying AI-enabled screens
 */
export const isAISupportedScreen = (
  screen: keyof RootStackParamList
): screen is AISupportedScreens => {
  const aiScreens: AISupportedScreens[] = [
    "Welcome",
    "Login",
    "Questionnaire",
    "WorkoutPlan",
    "ActiveWorkout",
    "Main",
    "Profile",
  ];
  return aiScreens.includes(screen as AISupportedScreens);
};

/**
 * @description כלי עזר ליצירת פרמטרי ניווט עם AI / Utility for creating navigation params with AI
 */
export const createAIEnabledParams = <T extends keyof RootStackParamList>(
  screen: T,
  baseParams: RootStackParamList[T],
  aiInsights?: NavigationAIInsights
): ScreenParams<T> => {
  if (baseParams === undefined) {
    return { aiInsights } as ScreenParams<T>;
  }
  return { ...baseParams, aiInsights } as ScreenParams<T>;
};
