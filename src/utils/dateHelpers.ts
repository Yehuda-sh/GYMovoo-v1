/**
 * @file src/utils/dateHelpers.ts
 * @description יוטיליטיז מרכזיים לחישובי תאריכים ועבודה עם זמן
 */

import { logger } from "./logger";

/**
 * חישוב ימים מהאימון האחרון
 * @param lastWorkoutDate תאריך האימון האחרון
 * @returns מספר ימים מהאימון האחרון
 */
export function daysSinceLastWorkout(lastWorkoutDate: string | Date): number {
  if (!lastWorkoutDate) return 999; // Default for missing data

  try {
    const startDate =
      typeof lastWorkoutDate === "string"
        ? new Date(lastWorkoutDate)
        : lastWorkoutDate;
    const endDate = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 999;
    }

    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return Math.max(0, daysDiff);
  } catch (error) {
    logger.error(
      "DateHelpers",
      "Error calculating days since last workout",
      error
    );
    return 999;
  }
}
