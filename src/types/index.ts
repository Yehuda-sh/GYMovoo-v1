// =============================
// Unified Workout & Questionnaire Types (אוגוסט 2025)
// =============================

/** Workout type - אימון מלא */
export interface Workout {
  id: string;
  name: string;
  date?: Date;
  duration?: number;
  exercises?: WorkoutExercise[];
  notes?: string;
  rating?: number;
  estimatedCalories?: number;
  type?: "strength" | "cardio" | "hiit" | "flexibility" | "mixed";
}

/** Questionnaire type - שאלון מלא */
export interface Questionnaire {
  id: string;
  userId?: string;
  answers: QuestionnaireAnswers;
  completedAt?: Date;
  version?: string;
}
/**
 * @file src/types/index.ts
 * @description טיפוסים ראשיים לפרויקט GYMovoo - ממשקים מרכזיים לכל המערכת
 * English: Main types for GYMovoo project - central interfaces for the entire system
 *
 * @features
 * - טיפוסי ניווט ואימון מאוחדים
 * - ממשקי שאלון חכם ומערכת legacy
 * - פרופיל משתמש מקיף עם תמיכה לאחור
 * - סטטיסטיקות אימון מתקדמות
 * - מערכת תרגילים היררכית
 *
 * @dependencies Navigation types, workout types from screens
 * @updated 2025-08-11 ניקוי כפילויות ושיפור ארגון
 */

// טיפוסי ניווט
export * from "../navigation/types";

// טיפוסי אימון
export * from "../screens/workout/types/workout.types";
export * from "../screens/workout/components/types";

// =======================================
// 👤 User Profile & Basic Data (ינואר 2025)
// פרופיל משתמש ונתונים בסיסיים
// =======================================

/**
 * User Profile interface - פרופיל משתמש מקיף
 * Enhanced user profile with comprehensive fitness data
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age?: number;
  height?: number;
  weight?: number;
  fitnessLevel?: string;
  goals?: string[];
  equipment?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// =======================================
// 📊 Workout Statistics (ינואר 2025)
// סטטיסטיקות אימון מאוחדות ומשופרות
// =======================================

/**
 * Unified WorkoutStatistics interface
 * ממשק סטטיסטיקות אימון מאוחד - משלב שני הממשקים הקיימים
 */
export interface WorkoutStatistics {
  // Basic statistics - סטטיסטיקות בסיסיות
  totalWorkouts: number;
  totalTime: number;
  averageRating: number;
  personalRecords: Record<string, number>;
  lastWorkoutDate?: Date;

  // Comprehensive statistics - סטטיסטיקות מקיפות
  total: {
    totalDuration: number;
    averageDifficulty: number;
    workoutStreak: number;
  };

  // Gender-based analytics - אנליטיקות לפי מגדר
  byGender?: {
    male: {
      count: number;
      averageDifficulty: number;
    };
    female: {
      count: number;
      averageDifficulty: number;
    };
    other: {
      count: number;
      averageDifficulty: number;
    };
  };
}

// =======================================
// 📋 Questionnaire Data - CONSOLIDATED (ינואר 2025)
// נתוני שאלון וסקרים - מאוחד ללא כפילויות
// =======================================

/**
 * Questionnaire Basic Data - נתוני שאלון בסיסיים (מאוחד)
 * Core questionnaire data for fitness assessment - SINGLE DEFINITION
 */
export interface QuestionnaireBasicData {
  age?: number;
  height?: number;
  weight?: number;
  gender?: string;
  fitnessLevel?: string;
  goals?: string[];
  daysPerWeek?: number;
  duration?: string;
  equipment?: string[];
  completedAt?: Date;
}

// =======================================
// 🏋️ Exercise Type System (ינואר 2025)
// מערכת טיפוסים מאוחדת לתרגילים
// =======================================

/**
 * Base exercise interface - תבנית בסיסית לכל התרגילים
 * Foundation for all exercise types across the application
 */
export interface BaseExercise {
  id: string;
  name: string;
  category: string;
  equipment: string | string[];
  instructions?: string[];
  tips?: string[];
}

/**
 * Exercise Set interface - מאוחד ומשופר
 * Unified and enhanced exercise set definition
 */
export interface ExerciseSet {
  // Basic set data - נתוני סט בסיסיים
  reps: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  completed?: boolean;

  // Enhanced workout data - נתוני אימון מתקדמים
  id?: string;
  type?: "warmup" | "working" | "dropset" | "failure";
  targetReps?: number;
  targetWeight?: number;
  actualReps?: number;
  actualWeight?: number;
  isPR?: boolean;
  rpe?: number;
  notes?: string;
}

/**
 * Workout Exercise interface - ממשק תרגיל מלא לאימון
 * Complete exercise interface for workout sessions
 */
export interface WorkoutExercise extends BaseExercise {
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment: string; // Specific for workout exercises
  sets: ExerciseSet[];
  restTime?: number;
  notes?: string;
  videoUrl?: string;
  imageUrl?: string;
}

// =======================================
// 📋 Questionnaire System (אוגוסט 2025)
// מערכת שאלון מאוחדת ומשופרת
// =======================================

/**
 * Enhanced questionnaire metadata interface with complete type safety
 * ממשק מטא-דאטה מקיף לשאלון עם בטיחות טיפוסים מלאה
 */
export interface QuestionnaireMetadata {
  // Enhanced basic data with comprehensive options
  age?: string;
  gender?: string;
  goal?: string;
  experience?: string;
  frequency?: string;
  duration?: string;
  location?: string;

  // Enhanced health data with detailed tracking
  height?: number;
  weight?: number;
  health_conditions?: string[];
  injury_type?: string;

  // Advanced training data with equipment flexibility
  equipment?: string[]; // Primary equipment field from questionnaire
  home_equipment?: string[];
  gym_equipment?: string[];
  available_equipment?: string[]; // Scientific user support
  workout_preference?: string[];

  // Enhanced dynamic questionnaire support
  dynamicQuestions?: DynamicQuestion[]; // New dynamic questions system
  questions?: DynamicQuestion[]; // Legacy questions support

  // Comprehensive lifestyle data
  diet_type?: string;
  sleep_hours?: string;
  stress_level?: string;

  // Enhanced fitness assessment data
  fitness_assessment?: string;
  pushups_count?: string;
  plank_duration?: string;
  pullups_count?: string;

  // Enhanced metadata with analytics support
  completedAt?: string;
  version?: string;
  analytics?: Record<string, unknown>;
  additional_notes?: string;
}

/**
 * Enhanced dynamic question interface for type safety
 * ממשק שאלה דינמית משופר לבטיחות טיפוסים
 */
export interface DynamicQuestion {
  questionId: string;
  answer: string;
}

/**
 * Enhanced workout recommendation interface with comprehensive metadata
 * ממשק המלצת אימון משופר עם מטא-דאטה מקיף
 */
export interface WorkoutRecommendation {
  id: string;
  name: string;
  description: string;
  duration: number; // Duration in minutes / משך בדקות
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment: string[];
  targetMuscles: string[];
  type: "strength" | "cardio" | "hiit" | "flexibility" | "mixed";
  estimatedCalories?: number;
  exercises?: WorkoutExerciseBase[]; // Use existing exercise interface
}

/**
 * Enhanced exercise interface for questionnaire recommendations
 * ממשק תרגיל משופר להמלצות השאלון
 */
export interface WorkoutExerciseBase {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  duration?: number;
  restTime?: number;
}

/**
 * Quick Workout Template interface - תבנית ליצירת אימונים מהירים
 * Template for quick workout generation with enhanced metadata
 */
export interface QuickWorkoutTemplate {
  id: string;
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  instructions?: string[];
  tips?: string[];
}

/**
 * History Exercise interface - ממשק תרגיל לצרכי היסטוריה
 * Simplified exercise interface for history tracking
 */
export interface HistoryExercise extends BaseExercise {
  muscleGroups: string[];
  equipment: string[];
  sets?: ExerciseSet[];
}

/**
 * Primary Exercise type - הטיפוס הראשי
 * Main exercise type used throughout the application
 * @deprecated Use WorkoutExercise for active workouts or HistoryExercise for history
 * @note This type is maintained for backward compatibility only
 */
export type Exercise = WorkoutExercise;

export interface WorkoutHistoryItem {
  id: string;
  name: string;
  date: Date;
  duration: number;
  exercises: HistoryExercise[];
  rating?: number;
  notes?: string;
}

/**
 * Questionnaire Answers - תשובות שאלון
 * Flexible answer structure for dynamic questionnaires
 */
export interface QuestionnaireAnswers {
  [questionId: string]: string | string[] | number | boolean;
}

// =======================================
// 🧠 Smart Questionnaire System (ינואר 2025)
// מערכת שאלון חכם מתקדמת
// =======================================

/**
 * Smart Questionnaire Data - נתוני השאלון החכם
 * Comprehensive data structure for the smart questionnaire system
 */
export interface SmartQuestionnaireData {
  // תשובות השאלון החכם
  // Smart questionnaire answers
  answers: {
    // נתונים בסיסיים שאישיים
    gender?: "male" | "female" | "other";
    age?: number;
    height?: number; // ס"מ
    weight?: number; // ק"ג

    // נתוני אימון ותוכנית
    fitnessLevel?: "beginner" | "intermediate" | "advanced";
    goals?: string[];
    availability?: string[];
    sessionDuration?: string;
    workoutLocation?: string;
    preferences?: string[];
    equipment?: string[];

    // תזונה והעדפות
    nutrition?: string[];
    preferredTime?: string;
  };

  // מטאדאטה מורחבת
  // Extended metadata
  metadata: {
    completedAt: string;
    version: string;
    sessionId?: string;
    completionTime?: number; // זמן השלמה במילישניות
    questionsAnswered?: number;
    totalQuestions?: number;
    deviceInfo?: {
      platform?: string;
      screenWidth?: number;
      screenHeight?: number;
    };
  };

  // נתוני AI ותובנות
  // AI data and insights
  aiInsights?: {
    fitnessAssessment?: string;
    recommendedProgram?: string;
    equipmentSuggestions?: string[];
    nutritionTips?: string[];
    personalizedMessage?: string;
  };

  // נתוני התאמת מגדר
  // Gender adaptation data
  genderAdaptation?: {
    textVariations?: { [key: string]: string };
    workoutNameAdaptations?: { [key: string]: string };
    preferredLanguageStyle?: string;
  };
}

/**
 * Legacy Questionnaire Data - נתוני שאלון ישן
 * Backward compatibility for old questionnaire format
 */
export interface LegacyQuestionnaireData {
  // תשובות בפורמט הישן
  // Answers in old format
  answers?: { [key: number]: string | string[] };

  // נתונים מורחבים
  // Extended data
  metadata?: {
    [key: string]: unknown;
  };

  // תאריך השלמה
  // Completion date
  completedAt?: string;

  // גרסת השאלון
  // Questionnaire version
  version?: string;
}

// =======================================
// 👤 User System (ינואר 2025)
// מערכת משתמש מאוחדת
// =======================================

// =======================================
// 🧪 Supporting Profile & Stats Interfaces
// =======================================

/** פרופיל מדעי בסיסי / Basic scientific profile */
export interface ScientificProfile {
  available_days?: number;
  fitnessTests?: {
    overallLevel?: "beginner" | "intermediate" | "advanced";
  };
  // future fields can be appended here safely
}

/** היסטוריית פעילות / Activity history */
export interface ActivityHistory {
  // שימוש זמני ב-any עד יישור מלא של טיפוסי האימון בכל המערכת
  // Temporary any until full workout type unification (History/Achievements/Main/Profile)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  workouts: any[];
  weeklyProgress?: number;
}

/** סטטיסטיקות משתמש נוכחיות / Current user stats */
export interface CurrentStats {
  totalWorkouts: number;
  totalVolume?: number;
  averageRating?: number; // unified rating
  averageDifficulty?: number; // @deprecated – kept for backward compatibility (mapped into averageRating)
  currentStreak?: number; // unified streak
  workoutStreak?: number; // @deprecated – kept for backward compatibility
}

/** המלצות AI / AI driven recommendations */
export interface AIRecommendations {
  quickTip?: string;
  insights?: string[];
  updatedAt?: string; // ISO timestamp
}

/**
 * Comprehensive User interface - ממשק משתמש מקיף
 * Central user data structure for the entire application
 *
 * @structure
 * - Basic data: id, name, email, avatar
 * - Smart questionnaire data (primary): smartQuestionnaireData
 * - Legacy questionnaire support: questionnaire, questionnaireData
 * - User preferences: theme, notifications, language
 * - Training statistics: workouts, volume, goals
 * - Gender adaptation: personalized messages and workout names
 */
export interface User {
  // נתוני בסיס
  // Basic data
  id?: string;
  name?: string;
  email?: string;
  avatar?: string; // URL או נתיב מקומי
  provider?: string; // לדוגמה: "google", "facebook"

  // נתוני השאלון החכם החדש (עיקרי)
  // New smart questionnaire data (primary)
  smartQuestionnaireData?: SmartQuestionnaireData;

  // נתוני השאלון הישן (לתאימות לאחור)
  // Old questionnaire data (for backward compatibility)
  questionnaire?: { [key: number]: string | string[] };
  questionnaireData?: LegacyQuestionnaireData;

  // נתונים מדעיים (לתאימות לאחור)
  // Scientific data (for backward compatibility)
  /** פרופיל מדעי / Scientific profile */
  scientificProfile?: ScientificProfile;
  /** המלצות AI */
  aiRecommendations?: AIRecommendations;
  /** היסטוריית פעילות */
  activityHistory?: ActivityHistory;
  /** סטטיסטיקות נוכחיות */
  currentStats?: CurrentStats;

  // העדפות משתמש
  // User preferences
  preferences?: {
    theme?: "light" | "dark";
    notifications?: boolean;
    language?: "he" | "en";
    units?: "metric" | "imperial";
    gender?: "male" | "female" | "other";
    rtlPreference?: boolean;
    workoutNameStyle?: "adapted" | "neutral" | "original";
  };

  // נתוני אימון
  // Training data
  trainingStats?: {
    totalWorkouts?: number;
    totalVolume?: number;
    favoriteExercises?: string[];
    lastWorkoutDate?: string;
    preferredWorkoutDays?: number;
    selectedEquipment?: string[];
    fitnessGoals?: string[];
    currentFitnessLevel?: "beginner" | "intermediate" | "advanced";
  };

  // נתוני פרופיל מותאמים למגדר
  // Gender-adapted profile data
  genderProfile?: {
    selectedGender: "male" | "female" | "other";
    adaptedWorkoutNames?: { [key: string]: string };
    personalizedMessages?: string[];
    completionMessages?: {
      male?: string;
      female?: string;
      neutral?: string;
    };
  };

  // משתמש דמו מותאם (על בסיס תשובות השאלון)
  // Custom demo user (based on questionnaire answers)
  customDemoUser?: {
    id: string;
    name: string;
    gender: "male" | "female" | "other";
    age: number;
    experience: "beginner" | "intermediate" | "advanced";
    height: number;
    weight: number;
    fitnessGoals: string[];
    availableDays: number;
    sessionDuration: string;
    equipment: string[];
    preferredTime: string;
    createdFromQuestionnaire: boolean;
    questionnaireTimestamp?: string;
  };
}
