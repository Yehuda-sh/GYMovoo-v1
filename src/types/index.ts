/**
 * @file src/types/index.ts
 * @description טיפוסים ראשיים לאפליקציית GYMovoo
 * @brief Main types for GYMovoo fitness app
 */

// Navigation types
export * from "../navigation/types";

// Workout types
export * from "../screens/workout/types/workout.types";

// =======================================
// 🏋️ Core Workout Types
// =======================================

export interface ExerciseSet {
  id: string;
  reps: number;
  weight?: number;
  duration?: number;
  distance?: number;
  rest?: number;
  completed: boolean;
  restTime?: number;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  category?: string;
  equipment?: string | string[];
  sets: ExerciseSet[];
  targetMuscles?: string[];
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  instructions?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
  restTime?: number;
  notes?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface Workout {
  id: string;
  name: string;
  date?: Date;
  duration?: number;
  exercises?: WorkoutExercise[];
  rating?: number;
  totalCalories?: number;
  difficulty?: "beginner" | "intermediate" | "advanced";
  createdAt?: string;
  completedAt?: string;
  type?: "strength" | "cardio" | "hiit" | "flexibility";
}

// =======================================
// 📋 Questionnaire Types
// =======================================

export interface QuestionnaireAnswers {
  [key: string]: string | number | boolean | string[];
}

export interface SmartQuestionnaireData {
  answers: QuestionnaireAnswers;
  metadata: {
    completedAt: string;
    version: string;
  };
}

export interface Questionnaire {
  [key: string]: any;
}

export interface QuestionnaireMetadata {
  [key: string]: any;
}

export interface DynamicQuestion {
  [key: string]: any;
}

export interface LegacyQuestionnaireData {
  [key: string]: any;
}

// =======================================
// 👤 User Types
// =======================================

export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  age?: number;
  height?: number;
  weight?: number;
  fitnessLevel?: string;
  goals?: string[];
  equipment?: string[];
}

export interface GenderProfile {
  selectedGender?: string;
  [key: string]: any;
}

export interface Subscription {
  type?: string;
  isActive?: boolean;
  hasCompletedTrial?: boolean;
  [key: string]: any;
}

export interface ActivityHistory {
  workouts?: Workout[];
  weeklyProgress?: number;
  [key: string]: any;
}

export interface WorkoutPlans {
  basicPlan?: WorkoutPlan;
  smartPlan?: WorkoutPlan;
  planPreference?: string;
  lastUpdated?: string;
  [key: string]: any;
}

export interface User {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  provider?: string; // Added for authentication provider (Google, email, etc.)

  // Questionnaire data
  smartquestionnairedata?: SmartQuestionnaireData;
  hasQuestionnaire?: boolean;
  questionnaire?: any;
  questionnairedata?: any;

  // User preferences
  preferences?: {
    theme?: "light" | "dark";
    language?: "he" | "en";
    notifications?: boolean;
  };

  // User profiles and subscriptions
  genderprofile?: GenderProfile;
  subscription?: Subscription;
  activityhistory?: ActivityHistory;
  scientificprofile?: any;
  airecommendations?: any;
  workoutplans?: WorkoutPlans;
  customDemoUser?: any;

  // Training stats
  trainingstats?: {
    totalWorkouts?: number;
    totalMinutes?: number;
    currentStreak?: number;
    favoriteExercises?: string[];
    selectedEquipment?: string[];
    preferredWorkoutDays?: string[];
    currentFitnessLevel?: string;
    streak?: number;
    totalDurationMinutes?: number;
    totalHours?: number;
    xp?: number;
    level?: number;
    totalVolume?: number;
  };
}

// =======================================
// 📊 Statistics Types
// =======================================

export interface WorkoutStatistics {
  totalWorkouts?: number;
  totalTime?: number;
  totalMinutes?: number;
  averageRating?: number;
  lastWorkoutDate?: Date;
  workoutStreak?: number;
  currentStreak?: number;
  favoriteExercises?: string[];
  selectedEquipment?: string[];
  preferredWorkoutDays?: string[];
  currentFitnessLevel?: string;
  streak?: number;
  totalDurationMinutes?: number;
  totalHours?: number;
  xp?: number;
  level?: number;
  totalVolume?: number;
}

// =======================================
// 🎯 Workout Planning Types
// =======================================

export interface WorkoutRecommendation {
  id: string;
  name: string;
  description: string;
  type: "strength" | "cardio" | "hiit" | "flexibility" | "mixed";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  equipment: string[];
  targetMuscles: string[];
  estimatedCalories: number;
  exercises?: WorkoutExercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  type?: "basic" | "smart" | "premium";
  workouts?: WorkoutRecommendation[];
  exercises?: WorkoutExercise[];
  duration?: number;
  estimatedDuration?: number;
  frequency?: number;
  requiresSubscription?: boolean;
  difficulty?: "beginner" | "intermediate" | "advanced";
  targetMuscles?: string[];
  features?: any;
}
