/**
 * @file src/services/workout/types.ts
 * @description Types for WorkoutPlanManager and related services
 */

import { ExerciseTemplate } from "../../screens/workout/types/workout.types";

export interface WorkoutPlanRequest {
  frequency: number; // 1-7 days per week
  experience: "beginner" | "intermediate" | "advanced";
  duration: number; // minutes
  goal:
    | "strength"
    | "muscle_gain"
    | "weight_loss"
    | "endurance"
    | "general_fitness";
  equipment?: string[];
  customMuscleGroups?: string[];
  forceBasicPlan?: boolean; // Override for testing
}

export interface WorkoutDay {
  id: string;
  name: string;
  dayNumber: number;
  muscles: string[];
  exercises: ExerciseTemplate[];
  metadata?: {
    difficulty: "easy" | "moderate" | "hard";
    estimatedDuration: number;
    caloriesBurned: number;
    aiSuggestions?: string[];
  };
}

export interface WorkoutPlan {
  id: string;
  type: "basic" | "smart" | "ai_premium";
  name: string;
  description: string;
  workouts: WorkoutDay[];
  createdAt: string;
  metadata: {
    totalDuration: number;
    weeklyVolume: number;
    muscleGroupsCovered: string[];
    progressionStrategy: "fixed" | "linear" | "adaptive";
    subscriptionLevel: "free" | "trial" | "premium";
  };
}

export interface ProgressiveOverloadSuggestion {
  exerciseId: string;
  currentWeight?: number;
  currentReps?: number;
  suggestion: {
    action: "increase_weight" | "increase_reps" | "increase_sets" | "maintain";
    newWeight?: number;
    newReps?: number;
    newSets?: number;
    reasoning: string;
  };
}

export interface SmartSuggestion {
  type:
    | "exercise_swap"
    | "rest_adjustment"
    | "intensity_change"
    | "volume_change";
  priority: "low" | "medium" | "high";
  title: string;
  description: string;
  actionable: boolean;
  premiumFeature: boolean;
}
