/**
 * @file src/utils/mainScreenUtils.ts
 * @description Utility functions extracted from MainScreen for reuse across the app
 * @description פונקציות עזר מחולצות מ-MainScreen לשימוש חוזר באפליקציה
 */

import type { User } from "../types";

/**
 * Calculate available training days from user data
 * חישוב ימי האימון הזמינים מנתוני המשתמש
 * @param user - User object or null
 * @returns Number of available training days (2-5)
 */
export const calculateAvailableTrainingDays = (user: User | null): number => {
  if (!user) return 3;

  // Try to extract from new smart questionnaire
  const smartAnswers = user.smartquestionnairedata?.answers as
    | { availability?: string | string[] }
    | undefined;
  if (smartAnswers?.availability) {
    const availability = Array.isArray(smartAnswers.availability)
      ? smartAnswers.availability[0]
      : smartAnswers.availability;
    switch (availability) {
      case "2_days":
        return 2;
      case "3_days":
        return 3;
      case "4_days":
        return 4;
      case "5_days":
        return 5;
      default:
        return 3;
    }
  }

  // Try to extract from training stats
  if (user.trainingstats?.preferredWorkoutDays) {
    const days =
      typeof user.trainingstats.preferredWorkoutDays === "number"
        ? user.trainingstats.preferredWorkoutDays
        : parseInt(String(user.trainingstats.preferredWorkoutDays), 10);
    if (days >= 2 && days <= 5) return days;
  }

  // Try to extract from legacy questionnaire data
  if (user.questionnairedata?.answers) {
    const answers = user.questionnairedata.answers as Record<string, unknown>;
    const frequency = answers.frequency;
    if (typeof frequency === "string") {
      switch (frequency) {
        case "2_days":
          return 2;
        case "3_days":
          return 3;
        case "4_days":
          return 4;
        case "5_days":
          return 5;
        default:
          return 3;
      }
    }
  }

  // Try to extract from old questionnaire
  if (user.questionnaire) {
    const questionnaireValues = Object.values(user.questionnaire);
    for (const value of questionnaireValues) {
      if (typeof value === "string") {
        if (
          value.includes("2") &&
          (value.includes("times") || value.includes("פעמים"))
        )
          return 2;
        if (
          value.includes("3") &&
          (value.includes("times") || value.includes("פעמים"))
        )
          return 3;
        if (
          value.includes("4") &&
          (value.includes("times") || value.includes("פעמים"))
        )
          return 4;
        if (
          value.includes("5") &&
          (value.includes("times") || value.includes("פעמים"))
        )
          return 5;
      }
    }
  }

  // Fallback - try to extract from scientific profile
  const availableDays = user.scientificprofile?.available_days;
  if (
    typeof availableDays === "number" &&
    availableDays >= 2 &&
    availableDays <= 5
  ) {
    return availableDays;
  }

  return 3; // Default
};

/**
 * Calculate next recommended workout day
 * חישוב היום הבא המומלץ לאימון
 * @param workouts - Array of workout history items
 * @param availableDays - Number of available training days
 * @returns Recommended day number (1-based)
 */
export const getNextRecommendedDay = (
  workouts: Array<{
    type?: string;
    workoutName?: string;
  }>,
  availableDays: number
): number => {
  if (workouts.length === 0) return 1;

  const lastWorkout = workouts[workouts.length - 1];
  const lastWorkoutType = lastWorkout?.type || lastWorkout?.workoutName || "";

  if (lastWorkoutType.includes("1") || lastWorkoutType.includes("יום 1")) {
    return 2;
  } else if (
    lastWorkoutType.includes("2") ||
    lastWorkoutType.includes("יום 2")
  ) {
    return availableDays >= 3 ? 3 : 1;
  } else if (
    lastWorkoutType.includes("3") ||
    lastWorkoutType.includes("יום 3")
  ) {
    return availableDays >= 4 ? 4 : 1;
  } else if (
    lastWorkoutType.includes("4") ||
    lastWorkoutType.includes("יום 4")
  ) {
    return availableDays >= 5 ? 5 : 1;
  } else if (
    lastWorkoutType.includes("5") ||
    lastWorkoutType.includes("יום 5")
  ) {
    return 1;
  }

  return 1;
};

/**
 * Extract personal data from user for analytics
 * חילוץ נתונים אישיים מהמשתמש לניתוח
 * @param user - User object or null
 * @returns Personal data object with defaults
 */
export const extractPersonalDataFromUser = (user: User | null) => {
  if (!user) {
    return {
      age: "unknown" as const,
      gender: "male" as const,
      availability: "3_days" as const,
      goals: [] as string[],
      fitnessLevel: "beginner" as const,
      weight: "70",
      height: "170",
    };
  }

  // Extract gender
  const gender = (
    user.smartquestionnairedata?.answers?.gender === "female"
      ? "female"
      : "male"
  ) as "male" | "female";

  // Extract age
  const age =
    user.smartquestionnairedata?.answers?.age?.toString() || "unknown";

  // Extract availability
  const availability = (
    Array.isArray(user.smartquestionnairedata?.answers?.availability)
      ? user.smartquestionnairedata.answers.availability[0] || "3_days"
      : "3_days"
  ) as "2_days" | "3_days" | "4_days" | "5_days";

  // Extract goals
  const goals = Array.isArray(user.smartquestionnairedata?.answers?.goals)
    ? user.smartquestionnairedata.answers.goals
    : [];

  // Extract fitness level
  const fitnessLevel = (user.smartquestionnairedata?.answers?.fitnessLevel ||
    "beginner") as "beginner" | "intermediate" | "advanced";

  // Use default values for weight and height since they're not in ScientificProfile
  const weight = "70";
  const height = "170";

  return {
    age,
    gender,
    availability,
    goals,
    fitnessLevel,
    weight,
    height,
  };
};

/**
 * Get time-based greeting in Hebrew
 * קבלת ברכה דינמית לפי שעה בעברית
 * @returns Time-based greeting string
 */
export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "בוקר טוב";
  } else if (hour >= 12 && hour < 17) {
    return "צהריים טובים";
  } else if (hour >= 17 && hour < 21) {
    return "ערב טוב";
  } else {
    return "לילה טוב";
  }
};
