/**
 * @file /src/screens/main/utils/dataProcessors.ts
 * @description Data processing utilities for MainScreen
 */

import type { WorkoutHistoryItem } from "../../../core/types/user.types";

/**
 * Extract day index (1..n) from a workout name/title in HE/EN.
 * Matches patterns like "יום 2", "Day 3", "יום3", "day   4" (case-insensitive for EN).
 */
const extractDayIndex = (name?: string): number | null => {
  if (!name) return null;

  // Normalize whitespace
  const cleaned = name.replace(/\s+/g, " ").trim();

  // 1) Explicit patterns: "יום 2" / "day 2"
  const dayPattern = /(?:יום|day)\s*(\d+)/i;
  const explicitMatch = cleaned.match(dayPattern);
  if (explicitMatch?.[1]) {
    const num = parseInt(explicitMatch[1], 10);
    return Number.isFinite(num) && num > 0 ? num : null;
  }

  // 2) Conservative fallback: starts with "יום/Day" then a number
  const startPattern = /^(?:יום|day)[^\d]*?(\d+)/i;
  const startMatch = cleaned.match(startPattern);
  if (startMatch?.[1]) {
    const num = parseInt(startMatch[1], 10);
    return Number.isFinite(num) && num > 0 ? num : null;
  }

  // 3) If contains a day keyword and any number anywhere
  if (/(יום|day)/i.test(cleaned)) {
    const anyNum = cleaned.match(/(\d+)/);
    if (anyNum?.[1]) {
      const num = parseInt(anyNum[1], 10);
      return Number.isFinite(num) && num > 0 ? num : null;
    }
  }

  return null;
};

/**
 * Safe normalize to timestamp (ms) from string | Date | unknown.
 * Avoids `instanceof` on unions that include primitives.
 */
const toTime = (val: unknown): number => {
  if (typeof val === "string") {
    const t = Date.parse(val);
    return Number.isFinite(t) ? t : 0;
  }
  if (val && typeof val === "object") {
    // now it's safe to check instanceof
    if (val instanceof Date) {
      const t = val.getTime();
      return Number.isFinite(t) ? t : 0;
    }
  }
  return 0;
};

/**
 * Return the most recent workout by `completedAt` or `date` if available.
 * Falls back to the last item if no dates are present.
 */
const getMostRecentWorkout = (
  workouts: WorkoutHistoryItem[]
): WorkoutHistoryItem | null => {
  if (!workouts.length) return null;

  const copy = [...workouts];
  copy.sort((a, b) => {
    const aCompleted = toTime(a.completedAt as unknown);
    const bCompleted = toTime(b.completedAt as unknown);
    const aDate = aCompleted || toTime(a.date as unknown);
    const bDate = bCompleted || toTime(b.date as unknown);
    return bDate - aDate; // desc
  });

  const mostRecent = copy[0] ?? workouts[workouts.length - 1];
  return mostRecent ?? null;
};

/**
 * Calculate next recommended training day (1..availableDays).
 * Robust to HE/EN titles like "יום 2" / "Day 2"; sorts by date safely.
 */
export const getNextRecommendedDay = (
  workouts: WorkoutHistoryItem[],
  availableDays: number
): number => {
  // Validate availableDays
  const days =
    Number.isFinite(availableDays) && availableDays >= 1 && availableDays <= 7
      ? Math.floor(availableDays)
      : 1;

  if (workouts.length === 0) return 1;

  const lastWorkout = getMostRecentWorkout(workouts);
  if (!lastWorkout) return 1;

  const dayFromName =
    extractDayIndex(lastWorkout.name) ??
    extractDayIndex(lastWorkout.workoutName);

  if (!dayFromName) return 1;

  return (dayFromName % days) + 1;
};
