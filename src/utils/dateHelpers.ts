/**
 * @file src/utils/dateHelpers.ts
 * @description יוטיליטיז מרכזיים לחישובי תאריכים ועבודה עם זמן
 */

import { logger } from "./logger";

/** Parse various date inputs into a Date or return null on failure */
function safeParseDate(input: string | Date | number): Date | null {
  try {
    if (input instanceof Date) {
      return isNaN(input.getTime()) ? null : input;
    }
    if (typeof input === "number") {
      const d = new Date(input);
      return isNaN(d.getTime()) ? null : d;
    }
    if (typeof input === "string") {
      const d = new Date(input);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  } catch {
    return null;
  }
}

/** Normalize a Date to UTC midnight (avoids הטיות אזור זמן בחישובי ימים) */
function startOfDayUTC(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  );
}

/** מספר ימים מלאים בין שני תאריכים (UTC-midnight to UTC-midnight) */
function diffInDaysUTC(a: Date, b: Date): number {
  const aUTC = startOfDayUTC(a).getTime();
  const bUTC = startOfDayUTC(b).getTime();
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((bUTC - aUTC) / msPerDay);
}

/**
 * חישוב ימים מהאימון האחרון (0 אם התאריך עתידי או היום)
 * @param lastWorkoutDate תאריך האימון האחרון (Date | ISO string | timestamp)
 * @returns מספר ימים מלאים מאז האימון האחרון (0+), 999 אם לא תקין/חסר
 */
export function daysSinceLastWorkout(
  lastWorkoutDate: string | Date | number
): number {
  if (lastWorkoutDate == null) return 999;

  try {
    const startDate = safeParseDate(lastWorkoutDate);
    if (!startDate) return 999;

    const today = new Date();

    // אם האימון בעתיד או היום, החזר 0 (אין ימים שחלפו)
    const days = diffInDaysUTC(startDate, today);
    if (days <= 0) return 0;

    return days;
  } catch (error) {
    logger.error(
      "DateHelpers",
      "Error calculating days since last workout",
      error
    );
    return 999;
  }
}
