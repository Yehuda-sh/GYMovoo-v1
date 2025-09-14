/**
 * @file src/constants/exercisesScreenTexts.ts
 * @brief Essential text constants for Exercises Screen - cleaned up version
 * @notes Removed unused text constants, kept only what's actually used in ExercisesScreen.tsx
 */

// Main muscle groups configuration with dynamic data - used in ExercisesScreen
export const EXERCISES_MUSCLE_GROUPS = [
  {
    id: "chest",
    name: "חזה",
    icon: "arm-flex" as const,
    description: "לחיצות, פרפרים ועוד",
  },
  {
    id: "back",
    name: "גב",
    icon: "human-handsup" as const,
    description: "משיכות, חתירה ועוד",
  },
  {
    id: "legs",
    name: "רגליים",
    icon: "run" as const,
    description: "סקוואטים, לאנג'ים ועוד",
  },
  {
    id: "shoulders",
    name: "כתפיים",
    icon: "human-handsup" as const,
    description: "כתף קדמית, אחורית וצדדית",
  },
  {
    id: "arms",
    name: "זרועות",
    icon: "arm-flex" as const,
    description: "בייספס, טרייספס ועוד",
  },
  {
    id: "core",
    name: "ליבה",
    icon: "human" as const,
    description: "בטן, גב תחתון ועוד",
  },
] as const;

export type ExercisesMuscleGroup = (typeof EXERCISES_MUSCLE_GROUPS)[number];

// Only the text constants that are actually used
export const EXERCISES_SCREEN_TEXTS = {
  HEADERS: {
    MAIN_TITLE: "ספריית תרגילים",
    SUBTITLE: "גלה מאות תרגילים מותאמים לכל רמה",
  },
} as const;

/**
 * Helper function to get muscle group color from theme - used in ExercisesScreen
 */
type ThemeColorLike = {
  colors: {
    primary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    accent: string;
    [key: string]: unknown;
  };
};

export const getMuscleGroupColor = (
  theme: ThemeColorLike,
  groupId: string
): string => {
  const colorMap = {
    chest: theme.colors.primary,
    back: theme.colors.success,
    legs: theme.colors.error,
    shoulders: theme.colors.warning,
    arms: theme.colors.info,
    core: theme.colors.accent,
  } as const;

  return colorMap[groupId as keyof typeof colorMap] || theme.colors.primary;
};

export default EXERCISES_SCREEN_TEXTS;
