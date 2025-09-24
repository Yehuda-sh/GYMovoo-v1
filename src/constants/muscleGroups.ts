/**
 * @file muscleGroups.ts
 * @brief Unified muscle groups system - מערכת מאוחדת לקבוצות שרירים
 * @description אחדנו את המערכות: exercise.ts (מפורט) + UI categories (פשוט)
 */

import type { MuscleGroup } from "./exercise";

// ★ קבוצות UI - למשתמש (פשוטות וברורות)
export const EXERCISES_MUSCLE_GROUPS = [
  {
    id: "chest",
    name: "חזה",
    icon: "arm-flex" as const,
    description: "לחיצות, פרפרים ועוד",
    muscles: ["chest"] as const, // ← מחובר למערכת המפורטת
  },
  {
    id: "back",
    name: "גב",
    icon: "human-handsup" as const,
    description: "משיכות, חתירה ועוד",
    muscles: ["back"] as const,
  },
  {
    id: "legs",
    name: "רגליים",
    icon: "run" as const,
    description: "סקוואטים, לאנג'ים ועוד",
    muscles: ["quadriceps", "hamstrings", "glutes", "calves"] as const, // ← מפוצל מדויק
  },
  {
    id: "shoulders",
    name: "כתפיים",
    icon: "human-handsup" as const,
    description: "כתף קדמית, אחורית וצדדית",
    muscles: ["shoulders"] as const,
  },
  {
    id: "arms",
    name: "זרועות",
    icon: "arm-flex" as const,
    description: "בייספס, טרייספס ועוד",
    muscles: ["biceps", "triceps", "forearms"] as const, // ← מפוצל מדויק
  },
  {
    id: "core",
    name: "ליבה",
    icon: "human" as const,
    description: "בטן, גב תחתון ועוד",
    muscles: ["core"] as const,
  },
  {
    id: "other",
    name: "אחר",
    icon: "dots-horizontal" as const,
    description: "צוואר, ירכיים ועוד",
    muscles: ["hips", "neck"] as const, // ← שרירים שלא נכנסו לקטגוריות אחרות
  },
] as const;

export type ExercisesMuscleGroup = (typeof EXERCISES_MUSCLE_GROUPS)[number];

// ★ מיפוי מקבוצת UI לשרירים ספציפיים
export const getMusclesForUIGroup = (uiGroupId: string): MuscleGroup[] => {
  const group = EXERCISES_MUSCLE_GROUPS.find((g) => g.id === uiGroupId);
  return group ? [...group.muscles] : [];
};

// ★ מיפוי משריר ספציפי לקבוצת UI
export const getUIGroupForMuscle = (muscle: MuscleGroup): string => {
  const group = EXERCISES_MUSCLE_GROUPS.find((g) =>
    (g.muscles as readonly MuscleGroup[]).includes(muscle)
  );
  return group?.id || "other";
};

// ★ צבעים לקבוצות UI (כולל "other" החדש)
export const getMuscleGroupColor = (
  theme: {
    colors: {
      primary: string;
      success: string;
      error: string;
      warning: string;
      info: string;
      accent: string;
      textSecondary: string;
    };
  },
  groupId: string
): string => {
  const colorMap = {
    chest: theme.colors.primary,
    back: theme.colors.success,
    legs: theme.colors.error,
    shoulders: theme.colors.warning,
    arms: theme.colors.info,
    core: theme.colors.accent,
    other: theme.colors.textSecondary, // ← צבע לקטגוריה החדשה
  } as const;

  return colorMap[groupId as keyof typeof colorMap] || theme.colors.primary;
};

// ★ פונקציות עזר נוספות למערכת המאוחדת

/** בדיקה האם תרגיל שייך לקבוצת UI מסוימת */
export const isExerciseInUIGroup = (
  exercisePrimaryMuscles: MuscleGroup[],
  uiGroupId: string
): boolean => {
  const groupMuscles = getMusclesForUIGroup(uiGroupId);
  return exercisePrimaryMuscles.some((muscle) => groupMuscles.includes(muscle));
};

/** קבלת כל קבוצות ה-UI שתרגיל שייך אליהן */
export const getUIGroupsForExercise = (
  exercisePrimaryMuscles: MuscleGroup[]
): string[] => {
  return EXERCISES_MUSCLE_GROUPS.filter((group) =>
    exercisePrimaryMuscles.some((muscle) =>
      (group.muscles as readonly MuscleGroup[]).includes(muscle)
    )
  ).map((group) => group.id);
};

/** סטטיסטיקה: כמה שרירים ספציפיים יש בכל קבוצת UI */
export const getMuscleGroupStats = () => {
  return EXERCISES_MUSCLE_GROUPS.map((group) => ({
    id: group.id,
    name: group.name,
    muscleCount: group.muscles.length,
    muscles: [...group.muscles],
  }));
};
