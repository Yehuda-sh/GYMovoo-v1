/**
 * @file src/utils/workoutHelpers.ts
 * @description Simple workout helper functions
 */

import { Platform, Vibration } from "react-native";
import { logger } from "./logger";

/**
 * Format time from seconds to MM:SS format
 */
export const formatWorkoutTime = (seconds: number): string => {
  if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Format time from seconds to HH:MM:SS format
 */
export const formatWorkoutTimeExtended = (seconds: number): string => {
  if (typeof seconds !== "number" || isNaN(seconds) || seconds < 0) {
    return "00:00:00";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
};

/**
 * Standard vibration patterns
 */
export const vibrationPatterns = {
  short: 50,
  medium: 100,
  long: 200,
  double: [0, 200, 100, 200] as number[],
  countdown: [0, 100, 50, 100] as number[],
  personalRecord: [0, 100, 50, 100, 50, 300] as number[],
  start: [0, 300, 100, 100] as number[],
} as const;

/**
 * Trigger vibration with pattern
 */
export const triggerVibration = (
  pattern: number | number[] | keyof typeof vibrationPatterns = "short"
): void => {
  if (Platform.OS === "web") {
    return;
  }

  try {
    let vibrationPattern: number | number[];

    if (typeof pattern === "string") {
      vibrationPattern = vibrationPatterns[pattern];
    } else {
      vibrationPattern = pattern;
    }

    Vibration.vibrate(vibrationPattern);
  } catch (error) {
    logger.error(
      "triggerVibration failed",
      error instanceof Error ? error.message : String(error)
    );
  }
};

/**
 * Standard animation configurations
 */
export const animationConfig = {
  spring: {
    friction: 10,
    tension: 40,
    useNativeDriver: true,
  },
  springFast: {
    friction: 8,
    tension: 50,
    useNativeDriver: true,
  },
  timing: {
    duration: 200,
    useNativeDriver: true,
  },
  timingFast: {
    duration: 150,
    useNativeDriver: true,
  },
  fade: {
    duration: 250,
    useNativeDriver: true,
  },
  pulse: {
    duration: 600,
    useNativeDriver: true,
  },
} as const;

/**
 * Format volume with thousand separators
 */
export const formatVolume = (volume: number): string => {
  if (typeof volume !== "number" || isNaN(volume)) {
    return "0";
  }
  return volume.toLocaleString("he-IL");
};

/**
 * Calculate hours from minutes
 */
export const minutesToHours = (minutes: number): number => {
  if (typeof minutes !== "number" || isNaN(minutes) || minutes < 0) {
    return 0;
  }
  return Math.floor(minutes / 60);
};

/**
 * Format date for Hebrew locale
 */
export const formatDateHebrew = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "תאריך לא תקין";
    }
    return date.toLocaleDateString("he-IL", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "תאריך לא תקין";
  }
};

/**
 * Convert difficulty rating to stars
 */
export const getDifficultyStars = (difficulty: number): string => {
  if (typeof difficulty !== "number" || isNaN(difficulty)) {
    return "⭐";
  }
  const clampedDifficulty = Math.max(1, Math.min(5, Math.round(difficulty)));
  return "⭐".repeat(clampedDifficulty);
};

/**
 * Convert feeling to emoji
 */
export const getFeelingEmoji = (feeling: string): string => {
  if (!feeling || typeof feeling !== "string") {
    return "😐";
  }

  const emojiMap: { [key: string]: string } = {
    challenging: "😤",
    strong: "💪",
    enjoyable: "😊",
    easy: "😴",
    excellent: "🔥",
    good: "👍",
    okay: "😐",
    tired: "😴",
    energetic: "⚡",
    // Hebrew
    מאתגר: "😤",
    חזק: "💪",
    מהנה: "😊",
    קל: "😴",
    מעולה: "🔥",
    טוב: "👍",
    בסדר: "😐",
    עייף: "😴",
    אנרגטי: "⚡",
  };

  return emojiMap[feeling.toLowerCase().trim()] || "😐";
};

/**
 * Gender icon mapping
 */
export const getGenderIcon = (gender?: "male" | "female" | "other") => {
  switch (gender) {
    case "male":
      return "gender-male" as const;
    case "female":
      return "gender-female" as const;
    default:
      return "account" as const;
  }
};

/**
 * Extract user gender from questionnaire data
 */
interface UserGenderSource {
  smartquestionnairedata?: {
    answers?: { gender?: "male" | "female" | "other" };
  };
  questionnaire?: Record<number, unknown>;
}

export const getUserGender = (
  user?: UserGenderSource
): "male" | "female" | "other" => {
  if (!user) return "other";

  const smartData = user?.smartquestionnairedata;
  const regularData = user?.questionnaire;

  if (smartData?.answers?.gender) {
    return smartData.answers.gender;
  }

  if (regularData?.[1]) {
    const genderAnswer = regularData[1] as string;
    if (["male", "female", "other"].includes(genderAnswer)) {
      return genderAnswer as "male" | "female" | "other";
    }
  }

  return "other";
};

/**
 * Shared button styles
 */
export const sharedButtonStyles = {
  skipButton: {
    borderRadius: 24,
    overflow: "hidden" as const,
    borderWidth: 2,
  },
  compactButton: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderWidth: 1,
  },
  floatingButton: {
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 0,
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  primaryAction: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 0,
  },
} as const;
