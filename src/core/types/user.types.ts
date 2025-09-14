/**
 * טיפוסים מרכזיים למשתמש
 * @file src/core/types/user.types.ts
 * @description הגדרות טיפוס מרכזיות למשתמש וכל המידע הקשור אליו
 */

import type { QuestionnaireData } from "../../features/questionnaire/types";

// ========== Main User Interface ==========
export interface User {
  id?: string;
  email?: string;
  name?: string;
  avatar?: string;
  provider?: "google" | "manual" | "apple";
  questionnaireData?: QuestionnaireData;
  trainingStats?: TrainingStats;
  activityHistory?: ActivityHistory;
  metadata?: UserMetadata;
  subscription?: UserSubscription;
  genderprofile?: GenderProfile;
  preferences?: UserPreferences;
  workoutplans?: WorkoutPlans;
  hasQuestionnaire?: boolean;
}

// ========== Questionnaire Types ==========
export interface QuestionnaireAnswers {
  // Personal Info
  gender?: string;
  age?: string | number;
  weight?: string | number;
  height?: string | number;

  // Fitness Profile
  fitness_goal?: string | string[];
  experience_level?: string;
  fitnessLevel?: string;
  goals?: string[];

  // Workout Preferences
  workout_location?: string;
  availability?: string | string[];
  workout_duration?: string;
  equipment?: string[];

  // Equipment specific fields
  bodyweight_equipment?: string[];
  home_equipment?: string[];
  gym_equipment?: string[];

  // Additional
  diet_preferences?: string | string[];
  health_conditions?: string[];
  nutrition?: string[];
}

// QuestionnaireData moved to features/questionnaire/types/questionnaire.types.ts

// ========== Training Statistics ==========
export interface TrainingStats {
  totalWorkouts?: number;
  currentStreak?: number;
  longestStreak?: number;
  totalVolume?: number;
  averageRating?: number;
  preferredWorkoutDays?: string[];
  lastWorkoutDate?: string;
  weeklyAverage?: number;
  monthlyWorkouts?: number;
  selectedEquipment?: string[];
  currentFitnessLevel?: string;
  fitnessGoals?: string[];
}

// ========== Activity History ==========
export interface ActivityHistory {
  workouts?: WorkoutHistoryItem[];
  weeklyProgress?: number;
  achievements?: Achievement[];
  personalRecords?: PersonalRecord[];
}

// ========== Supporting Types ==========
export interface WorkoutHistoryItem {
  id: string;
  name: string;
  date: string | Date;
  duration: number; // in seconds
  rating?: number;
  exercises?: Array<{
    id?: string;
    name?: string;
    category?: string;
    primaryMuscles?: string[];
    equipment?: string | string[];
    sets?: Array<{
      reps?: number;
      weight?: number;
      completed?: boolean;
      id?: string;
    }>;
  }>;
  stats?: {
    totalVolume?: number;
    totalReps?: number;
    caloriesBurned?: number;
  };
  completedAt?: string | Date;
  type?: string;
  workoutName?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  unlockedAt?: string;
  progress?: number;
}

export interface PersonalRecord {
  exerciseName: string;
  value: number;
  unit: string;
  date: string;
  type?: "weight" | "reps" | "volume";
}

export interface UserMetadata {
  createdAt: string;
  lastLogin?: string;
  appVersion?: string;
  platform?: "ios" | "android" | "web";
  deviceId?: string;
  lastSyncAt?: string;
}

// ========== Additional Compatibility Types ==========
export interface UserSubscription {
  type?: "free" | "premium" | "trial";
  isActive?: boolean;
  hasCompletedTrial?: boolean;
  startDate?: string;
  endDate?: string;
  registrationDate?: string;
  trialDaysRemaining?: number;
  lastTrialCheck?: string;
}

export interface GenderProfile {
  selectedGender?: "male" | "female" | "other";
  adaptedWorkoutNames?: Record<string, string>;
}

export interface UserPreferences {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Temporary flexible interface
}

export interface WorkoutPlans {
  basicPlan?: WorkoutPlan;
  smartPlan?: WorkoutPlan;
  additionalPlan?: WorkoutPlan;
  lastUpdated?: string;
}

// Minimal workout plan shape for compatibility
export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  difficulty?: string;
  days?: number;
}

// ========== Questionnaire Supporting Types ==========
export type DietType =
  | "none_diet"
  | "vegetarian"
  | "vegan"
  | "keto"
  | "paleo"
  | "other_meal";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type TrainingGoal =
  | "weight_loss"
  | "muscle_gain"
  | "endurance"
  | "strength"
  | "general_fitness";

// ========== Helper Types ==========
export type UserCompletionStatus = {
  hasUser: boolean;
  hasQuestionnaire: boolean;
  hasName: boolean;
  isFullySetup: boolean;
};

export type UserProgress = {
  totalWorkouts: number;
  currentStreak: number;
  weeklyProgress: number;
  level?: number;
  experience?: number;
};
