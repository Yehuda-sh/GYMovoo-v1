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
  age?: string;
  gender?: string;
  fitnessLevel?: string;
  primaryGoal?: string;
  workoutLocation?: string;
  availableEquipment?: string[];
  sessionDuration?: string;
  workoutFrequency?: string;
  healthStatus?: string;
  experienceLevel?: string;
  weeklyAvailability?: string;
  [key: string]: any; // For additional dynamic fields
}

export interface QuestionnaireMetadata {
  completedAt?: string;
  version?: string;
  source?: "legacy" | "smart" | "updated";
  [key: string]: any;
}

export interface DynamicQuestion {
  [key: string]: any;
}

export interface LegacyQuestionnaireData {
  age?: string;
  gender?: string;
  fitnessLevel?: string;
  goals?: string[];
  equipment?: string[];
  [key: string]: any;
}

// =======================================
// 🔔 Notification Types
// =======================================

export interface NotificationSettings {
  workoutReminders?: boolean;
  achievementAlerts?: boolean;
  weeklyReports?: boolean;
  motivationalMessages?: boolean;
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  type: "workout_reminder" | "achievement" | "motivation" | "system";
  scheduledFor?: string;
  isRead?: boolean;
  actionUrl?: string;
}

// =======================================
// 🏆 Achievement Types
// =======================================

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  category: string;
  unlocked: boolean;
  progress?: number;
  unlockedAt?: string;
}

export interface AchievementProgress {
  achievementId: number;
  currentValue: number;
  targetValue: number;
  percentage: number;
  lastUpdated: string;
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
  questionnaire?: Questionnaire;
  questionnairedata?: LegacyQuestionnaireData;

  // User preferences
  preferences?: {
    theme?: "light" | "dark" | "system";
    language?: "he" | "en";
    notifications?: boolean;
    soundEnabled?: boolean;
    hapticFeedback?: boolean;
    units?: "metric" | "imperial";
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
    fitnessGoals?: string[];
    streak?: number;
    totalDurationMinutes?: number;
    totalHours?: number;
    xp?: number;
    level?: number;
    totalVolume?: number;
    lastWorkoutDate?: string;
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
  features?: WorkoutPlanFeatures;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

export interface WorkoutPlanFeatures {
  periodization?: boolean;
  progressiveOverload?: boolean;
  deloadWeeks?: boolean;
  customExercises?: boolean;
  aiOptimization?: boolean;
  nutritionIntegration?: boolean;
  personalizedWorkouts?: boolean;
  equipmentOptimization?: boolean;
  progressTracking?: boolean;
  aiRecommendations?: boolean;
  customSchedule?: boolean;
}

// =======================================
// 📈 Progress Tracking Types
// =======================================

export interface ProgressEntry {
  id: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  measurements?: BodyMeasurements;
  photos?: string[];
  notes?: string;
  workoutId?: string;
}

export interface BodyMeasurements {
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
  neck?: number;
  shoulders?: number;
}

export interface ProgressGoal {
  id: string;
  type: "weight_loss" | "muscle_gain" | "measurement" | "strength";
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  isActive: boolean;
}

// =======================================
// 🥗 Nutrition Types
// =======================================

export interface NutritionProfile {
  id: string;
  dailyCalories?: number;
  macroTargets?: MacroTargets;
  mealPreferences?: string[];
  dietaryRestrictions?: string[];
  waterIntake?: number; // glasses per day
  supplementRoutine?: Supplement[];
}

export interface MacroTargets {
  protein?: number; // grams
  carbs?: number; // grams
  fat?: number; // grams
}

export interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  purpose: string;
}

export interface MealEntry {
  id: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  foods: FoodItem[];
  totalCalories: number;
  totalMacros: MacroTargets;
  notes?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  macros: MacroTargets;
  quantity: number;
  unit: string;
}

// =======================================
// 💊 Health & Recovery Types
// =======================================

export interface HealthProfile {
  id: string;
  medicalConditions?: string[];
  injuries?: Injury[];
  medications?: Medication[];
  allergies?: string[];
  sleepQuality?: number; // 1-10
  stressLevel?: number; // 1-10
  recoveryRate?: "slow" | "normal" | "fast";
}

export interface Injury {
  id: string;
  type: string;
  location: string;
  severity: "mild" | "moderate" | "severe";
  occurredAt: string;
  recoveryTime?: number; // days
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  startDate?: string;
  endDate?: string;
}

// =======================================
// 🎯 Goal Management Types
// =======================================

export interface FitnessGoal {
  id: string;
  title: string;
  description?: string;
  category: "weight" | "strength" | "endurance" | "flexibility" | "general";
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  priority: "low" | "medium" | "high";
  status: "active" | "completed" | "paused" | "cancelled";
  milestones?: GoalMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface GoalMilestone {
  id: string;
  description: string;
  targetValue: number;
  achievedAt?: string;
  reward?: string;
}

// =======================================
// 👥 Social & Community Types
// =======================================

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  fitnessLevel?: string;
  mutualFriends?: number;
  isOnline?: boolean;
  lastActive?: string;
}

export interface WorkoutShare {
  id: string;
  workoutId: string;
  sharedBy: string;
  sharedWith: string[];
  message?: string;
  sharedAt: string;
  reactions?: WorkoutReaction[];
}

export interface WorkoutReaction {
  userId: string;
  reaction: "like" | "fire" | "clap" | "trophy";
  reactedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "personal" | "group" | "community";
  category: "workouts" | "calories" | "streak" | "weight";
  targetValue: number;
  unit: string;
  duration: number; // days
  participants: ChallengeParticipant[];
  startDate: string;
  endDate: string;
  status: "upcoming" | "active" | "completed";
  prize?: string;
}

export interface ChallengeParticipant {
  userId: string;
  joinedAt: string;
  currentValue: number;
  completed: boolean;
  rank?: number;
}

// =======================================
// 📱 App Settings Types
// =======================================

export interface AppSettings {
  theme: "light" | "dark" | "system";
  language: "he" | "en";
  units: "metric" | "imperial";
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  dataSync: DataSyncSettings;
}

export interface PrivacySettings {
  profileVisibility: "public" | "friends" | "private";
  workoutSharing: "public" | "friends" | "private";
  leaderboardParticipation: boolean;
  dataCollection: boolean;
}

export interface DataSyncSettings {
  autoBackup: boolean;
  syncFrequency: "realtime" | "hourly" | "daily" | "manual";
  offlineMode: boolean;
  cloudStorage: boolean;
}
