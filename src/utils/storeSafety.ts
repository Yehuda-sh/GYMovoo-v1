/**
 * @file storeSafety.ts
 * @description Helper functions to harden store operations (validation, coercion, guards).
 */
import {
  User,
  QuestionnaireData,
  TrainingStats,
  UserSubscription,
} from "../types/user.types";
import { WorkoutPlan } from "../screens/workout/types/workout.types";

export const safeNumber = (val: unknown, fallback = 0): number =>
  typeof val === "number" && isFinite(val) ? val : fallback;

export const isValidDate = (d: unknown): d is Date =>
  d instanceof Date && !isNaN(d.getTime());

export const parseDateOrNow = (value?: string): Date => {
  if (!value) return new Date();
  const d = new Date(value);
  return isValidDate(d) ? d : new Date();
};

export const coerceWorkoutPlanShape = (plan: unknown): WorkoutPlan | null => {
  if (!plan || typeof plan !== "object") return null;
  const p = plan as Partial<WorkoutPlan> & Record<string, unknown>;
  if (!p.id || !p.name) return null;
  return {
    id: String(p.id),
    name: String(p.name),
    description: typeof p.description === "string" ? p.description : "",
    difficulty: ((): WorkoutPlan["difficulty"] => {
      if (
        p.difficulty === "beginner" ||
        p.difficulty === "intermediate" ||
        p.difficulty === "advanced"
      )
        return p.difficulty;
      return "beginner";
    })(),
    duration: safeNumber(p.duration, 30),
    frequency: safeNumber(p.frequency, 3),
    workouts: Array.isArray(p.workouts)
      ? (p.workouts as WorkoutPlan["workouts"])
      : [],
    createdAt:
      typeof p.createdAt === "string" ? p.createdAt : new Date().toISOString(),
    updatedAt:
      typeof p.updatedAt === "string" ? p.updatedAt : new Date().toISOString(),
    tags: Array.isArray(p.tags) ? (p.tags as string[]) : [],
  };
};

// Light validation/sanitization of server user object
export const validateServerUser = (user: unknown): Partial<User> => {
  if (!user || typeof user !== "object") return {};
  const u = user as Partial<User> & Record<string, unknown>;
  const sanitized: Partial<User> = {};

  if (u.id && typeof u.id === "string") sanitized.id = u.id;
  if (u.email && typeof u.email === "string") sanitized.email = u.email;
  if (u.name && typeof u.name === "string") sanitized.name = u.name;
  if (u.questionnaireData && typeof u.questionnaireData === "object") {
    sanitized.questionnaireData = u.questionnaireData as QuestionnaireData;
  }
  if (u.trainingStats && typeof u.trainingStats === "object") {
    const ts = u.trainingStats as Record<string, unknown>;
    const preferredWorkoutDays = Array.isArray(ts.preferredWorkoutDays)
      ? (ts.preferredWorkoutDays as string[]).filter(
          (d) => typeof d === "string"
        )
      : ["monday", "wednesday", "friday"];
    const selectedEquipment = Array.isArray(ts.selectedEquipment)
      ? (ts.selectedEquipment as string[])
      : [];
    const fitnessGoals = Array.isArray(ts.fitnessGoals)
      ? (ts.fitnessGoals as string[]).filter((g) => typeof g === "string")
      : [];
    const trainingStats: TrainingStats = {
      totalWorkouts: safeNumber(ts.totalWorkouts),
      currentStreak: safeNumber(ts.currentStreak),
      longestStreak: safeNumber(ts.longestStreak),
      totalVolume: safeNumber(ts.totalVolume),
      averageRating: safeNumber(ts.averageRating, 0),
      preferredWorkoutDays,
      lastWorkoutDate:
        typeof ts.lastWorkoutDate === "string"
          ? ts.lastWorkoutDate
          : new Date().toISOString(),
      weeklyAverage: safeNumber(ts.weeklyAverage),
      monthlyWorkouts: safeNumber(ts.monthlyWorkouts),
      selectedEquipment,
      currentFitnessLevel:
        typeof ts.currentFitnessLevel === "string"
          ? ts.currentFitnessLevel
          : "beginner",
      fitnessGoals,
    };
    sanitized.trainingStats = trainingStats;
  }
  if (u.subscription && typeof u.subscription === "object") {
    const sub = u.subscription as Record<string, unknown>;
    type SubscriptionTier = "free" | "premium" | "trial";
    const resolvedType: SubscriptionTier = [
      "free",
      "premium",
      "trial",
    ].includes(String(sub.type))
      ? (sub.type as SubscriptionTier)
      : "free";
    const subscription: UserSubscription = {
      type: resolvedType,
      isActive: Boolean(sub.isActive),
      trialDaysRemaining: safeNumber(sub.trialDaysRemaining),
      hasCompletedTrial: Boolean(sub.hasCompletedTrial),
    };
    if (typeof sub.startDate === "string")
      subscription.startDate = sub.startDate;
    if (typeof sub.registrationDate === "string")
      subscription.registrationDate = sub.registrationDate;
    if (typeof sub.lastTrialCheck === "string")
      subscription.lastTrialCheck = sub.lastTrialCheck;
    sanitized.subscription = subscription;
  }
  if (u.workoutplans && typeof u.workoutplans === "object") {
    const wp = u.workoutplans as Record<string, unknown>;
    const coerced: Record<string, WorkoutPlan> = {};
    if (wp.basicPlan) {
      const c = coerceWorkoutPlanShape(wp.basicPlan);
      if (c) coerced.basicPlan = c;
    }
    if (wp.smartPlan) {
      const c = coerceWorkoutPlanShape(wp.smartPlan);
      if (c) coerced.smartPlan = c;
    }
    if (wp.additionalPlan) {
      const c = coerceWorkoutPlanShape(wp.additionalPlan);
      if (c) coerced.additionalPlan = c;
    }
    if (Object.keys(coerced).length) sanitized.workoutplans = coerced;
  }
  return sanitized;
};

export const fallbackTrainingStats = () =>
  ({
    totalWorkouts: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalVolume: 0,
    averageRating: 0,
    preferredWorkoutDays: ["monday", "wednesday", "friday"],
  }) as const;
