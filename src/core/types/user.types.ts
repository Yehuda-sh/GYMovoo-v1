/**
 * טיפוסים מרכזיים למשתמש
 * @file src/core/types/user.types.ts
 * @description הגדרות טיפוס מרכזיות למשתמש וכל המידע הקשור אליו
 */

import type { QuestionnaireData } from "../../features/questionnaire/types";
import type { ISODateString } from "./workout.types"; // שימוש בטיפוס תאריך אחיד ISO

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

  lastUpdated?: ISODateString;
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

  /**
   * @deprecated השתמשו ב־genderProfile (camelCase). נשאר לתאימות לאחור.
   */
  genderprofile?: GenderProfile;

  /**
   * פרופיל מגדרי במבנה תקין (camelCase)
   */
  genderProfile?: GenderProfile;

  preferences?: UserPreferences;

  /**
   * @deprecated השתמשו ב־workoutPlans (camelCase). נשאר לתאימות לאחור.
   */
  workoutplans?: WorkoutPlans;

  /**
   * תוכניות האימון במבנה תקין (camelCase)
   */
  workoutPlans?: WorkoutPlans;

  hasQuestionnaire?: boolean;
  bmiHistory?: BMIBMRHistory[];
  lastBMICalculation?: BMIBMRResults & { date: ISODateString };
}

// ========== Training Statistics ==========
export interface TrainingStats {
  totalWorkouts?: number;
  currentStreak?: number;
  longestStreak?: number;
  totalVolume?: number;
  averageRating?: number;
  preferredWorkoutDays?: string[];
  lastWorkoutDate?: ISODateString;
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
  date: ISODateString;
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
  completedAt?: ISODateString;
  type?: string;
  workoutName?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description?: string;
  unlockedAt?: ISODateString;
  progress?: number;
}

export interface PersonalRecord {
  exerciseName: string;
  value: number;
  unit: string;
  date: ISODateString;
  type?: "weight" | "reps" | "volume";
}

// ========== BMI/BMR Related Types ==========
export interface BMIBMRHistory {
  date: ISODateString;
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
  createdAt: ISODateString;
  lastLogin?: ISODateString;
  appVersion?: string;
  platform?: "ios" | "android"; // מובייל בלבד
  deviceId?: string;
  lastSyncAt?: ISODateString;
}

// ========== Additional Compatibility Types ==========
export interface UserSubscription {
  type?: "free" | "premium" | "trial";
  isActive?: boolean;
  hasCompletedTrial?: boolean;
  startDate?: ISODateString;
  endDate?: ISODateString;
  registrationDate?: ISODateString;
  trialDaysRemaining?: number;
  lastTrialCheck?: ISODateString;
}

export interface GenderProfile {
  selectedGender?: "male" | "female" | "other";
  adaptedWorkoutNames?: Record<string, string>;
}

export interface UserPreferences {
  [key: string]: unknown; // גמיש אך בטוח יותר מ-any
}

export interface WorkoutPlans {
  basicPlan?: WorkoutPlan;
  smartPlan?: WorkoutPlan;
  additionalPlan?: WorkoutPlan;
  lastUpdated?: ISODateString;
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
