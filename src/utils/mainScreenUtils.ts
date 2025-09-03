/**
 * Main screen utility functions
 */

import type { User } from "../types";

/**
 * Calculate available training days from user data
 */
export const calculateAvailableTrainingDays = (user: User | null): number => {
  if (!user) return 3;

  // Check smart questionnaire first
  const smartAnswers = user.smartquestionnairedata?.answers as
    | { availability?: string | string[] }
    | undefined;
  
  if (smartAnswers?.availability) {
    const availability = Array.isArray(smartAnswers.availability)
      ? smartAnswers.availability[0]
      : smartAnswers.availability;
    
    const dayMap: Record<string, number> = {
      "2_days": 2,
      "3_days": 3,
      "4_days": 4,
      "5_days": 5,
    };
    
    return dayMap[availability] || 3;
  }

  // Check training stats
  const preferredDays = user.trainingstats?.preferredWorkoutDays;
  if (preferredDays) {
    const days = typeof preferredDays === "number" ? preferredDays : parseInt(String(preferredDays), 10);
    if (days >= 2 && days <= 5) return days;
  }

  return 3; // Default
};

/**
 * Calculate next recommended workout day
 */
export const getNextRecommendedDay = (
  workouts: Array<{ type?: string; workoutName?: string }>,
  availableDays: number
): number => {
  if (workouts.length === 0) return 1;

  const lastWorkout = workouts[workouts.length - 1];
  const lastWorkoutType = lastWorkout?.type || lastWorkout?.workoutName || "";

  if (lastWorkoutType.includes("1") || lastWorkoutType.includes("יום 1")) {
    return 2;
  } else if (lastWorkoutType.includes("2") || lastWorkoutType.includes("יום 2")) {
    return availableDays >= 3 ? 3 : 1;
  } else if (lastWorkoutType.includes("3") || lastWorkoutType.includes("יום 3")) {
    return availableDays >= 4 ? 4 : 1;
  } else if (lastWorkoutType.includes("4") || lastWorkoutType.includes("יום 4")) {
    return availableDays >= 5 ? 5 : 1;
  } else if (lastWorkoutType.includes("5") || lastWorkoutType.includes("יום 5")) {
    return 1;
  }

  return 1;
};

/**
 * Extract basic personal data from user
 */
export const extractPersonalDataFromUser = (user: User | null) => {
  const defaults = {
    age: "unknown" as const,
    gender: "male" as const,
    availability: "3_days" as const,
    goals: [] as string[],
    fitnessLevel: "beginner" as const,
    weight: "70",
    height: "170",
  };

  if (!user?.smartquestionnairedata?.answers) return defaults;

  const answers = user.smartquestionnairedata.answers;
  
  return {
    age: answers.age?.toString() || defaults.age,
    gender: (answers.gender === "female" ? "female" : "male") as "male" | "female",
    availability: (Array.isArray(answers.availability) 
      ? answers.availability[0] || defaults.availability 
      : defaults.availability) as "2_days" | "3_days" | "4_days" | "5_days",
    goals: Array.isArray(answers.goals) ? answers.goals : defaults.goals,
    fitnessLevel: (answers.fitnessLevel || defaults.fitnessLevel) as "beginner" | "intermediate" | "advanced",
    weight: defaults.weight,
    height: defaults.height,
  };
};

/**
 * Get time-based greeting in Hebrew
 */
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) return "בוקר טוב";
  if (hour >= 12 && hour < 17) return "צהריים טובים";
  if (hour >= 17 && hour < 21) return "ערב טוב";
  return "לילה טוב";
};
