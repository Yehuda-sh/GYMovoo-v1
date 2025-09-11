/**
 * User Type Definitions - הגדרות טיפוס משתמש אחידות
 * @description הגדרות מרכזיות לכל טיפוסי המשתמש בפרויקט
 */

// ========== Main User Interface ==========
export interface User {
  id?: string; // Made optional for partial updates
  email?: string; // Made optional for partial updates
  name?: string; // Made optional for partial updates
  avatar?: string;
  provider?: "google" | "manual" | "apple";
  questionnaireData?: QuestionnaireData;
  trainingStats?: TrainingStats;
  activityHistory?: ActivityHistory;
  metadata?: UserMetadata;
  // Additional fields for compatibility
  subscription?: UserSubscription;
  genderprofile?: GenderProfile;
  preferences?: UserPreferences;
  workoutplans?: WorkoutPlans;
  customDemoUser?: Record<string, unknown>; // made optional to allow clearing via omission
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

  // Allow additional fields
  [key: string]: unknown;
}

export interface QuestionnaireData {
  answers?: QuestionnaireAnswers;
  metadata?: {
    completedAt?: string;
    version?: string;
  };
}

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
  selectedEquipment?: string[]; // Added for compatibility
  currentFitnessLevel?: string; // Added for compatibility
  fitnessGoals?: string[]; // Added for compatibility
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
    // Extended optional exercise metadata (added for MainScreen stats safety)
    category?: string;
    primaryMuscles?: string[];
    equipment?: string | string[];
    sets?: Array<{
      reps?: number;
      weight?: number;
      completed?: boolean;
      id?: string; // added for referencing set id safely
    }>;
  }>;
  stats?: {
    totalVolume?: number;
    totalReps?: number;
    caloriesBurned?: number;
  };
  // Additional fields for compatibility
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
  type?: "weight" | "reps" | "volume"; // Added type field for compatibility
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
  [key: string]: unknown;
}

export interface GenderProfile {
  selectedGender?: "male" | "female" | "other";
  adaptedWorkoutNames?: Record<string, string>;
  [key: string]: unknown;
}

export interface UserPreferences {
  [key: string]: unknown;
}

export interface WorkoutPlans {
  basicPlan?: WorkoutPlan;
  smartPlan?: WorkoutPlan;
  additionalPlan?: WorkoutPlan;
  lastUpdated?: string;
  [key: string]: unknown;
}

// Minimal workout plan shape for compatibility
export interface WorkoutPlan {
  id: string;
  name: string;
  description?: string;
  difficulty?: string;
  days?: number;
  [key: string]: unknown;
}

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
