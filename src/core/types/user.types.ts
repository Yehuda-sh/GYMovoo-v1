/**
 * טיפוסים מרכזיים למשתמש
 * @file src/core/types/user.types.ts
 * @description הגדרות טיפוס מרכזיות למשתמש וכל המידע הקשור אליו
 */

import type { QuestionnaireData } from "../../features/questionnaire/types";

// ========== Personal Information Interface ==========
export interface PersonalInfo {
  // Body measurements
  weight?: number; // kg
  height?: number; // cm
  bodyFat?: number; // percentage
  muscleMass?: number; // kg

  // Body measurements - circumferences
  chest?: number; // cm
  waist?: number; // cm
  hips?: number; // cm
  bicep?: number; // cm
  thigh?: number; // cm

  // Lifestyle
  workStyle?: "sitting" | "standing" | "mixed" | "active";
  dailySteps?: number;
  sleepHours?: number;
  stressLevel?: "low" | "medium" | "high";

  // Health
  injuries?: string[];
  medications?: string[];
  allergies?: string[];

  // Training preferences
  preferredTrainingTime?: "morning" | "afternoon" | "evening" | "night";
  warmupDuration?: number; // minutes
  cooldownDuration?: number; // minutes
  restBetweenSets?: number; // seconds

  // Goals
  targetWeight?: number;
  targetBodyFat?: number;
  specificGoals?: string[];

  lastUpdated?: string;
}

// ========== Main User Interface ==========
export interface User {
  id?: string;
  email?: string;
  name?: string;
  avatar?: string;
  provider?: "google" | "manual" | "apple";
  questionnaireData?: QuestionnaireData;
  personalInfo?: PersonalInfo;
  trainingStats?: TrainingStats;
  activityHistory?: ActivityHistory;
  metadata?: UserMetadata;
  subscription?: UserSubscription;
  genderprofile?: GenderProfile;
  preferences?: UserPreferences;
  workoutplans?: WorkoutPlans;
  hasQuestionnaire?: boolean;
  bmiHistory?: BMIBMRHistory[];
  lastBMICalculation?: BMIBMRResults & { date: string };
}

// QuestionnaireAnswers is now imported from questionnaire types

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

// ========== BMI/BMR Related Types ==========
export interface BMIBMRHistory {
  date: string;
  weight: number;
  bmi: number;
  bmr: number;
}

export interface BMIBMRResults {
  bmi: number;
  bmiCategory: string;
  bmr: number;
  tdee: number;
  idealWeight: { min: number; max: number };
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
