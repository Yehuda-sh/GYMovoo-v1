/**
 * @file src/utils/dateHelpers.ts
 * @description יוטיליטיז מרכזיים לחישובי תאריכים ועבודה עם זמן
 */

/**
 * חישוב ימים בין תאריכים
 * @param fromDate תאריך התחלה
 * @param toDate תאריך סיום (ברירת מחדל: היום)
 * @returns מספר ימים (תמיד חיובי)
 */
export function calculateDaysBetween(
  fromDate: string | Date,
  toDate: string | Date = new Date()
): number {
  if (!fromDate) return 999; // Default for missing data

  try {
    const startDate =
      typeof fromDate === "string" ? new Date(fromDate) : fromDate;
    const endDate = typeof toDate === "string" ? new Date(toDate) : toDate;

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 999;
    }

    const timeDiff = Math.abs(endDate.getTime() - startDate.getTime());
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    return Math.max(0, daysDiff);
  } catch (error) {
    console.error("Error calculating days between dates:", error);
    return 999;
  }
}

/**
 * חישוב ימים מהאימון האחרון
 * @param lastWorkoutDate תאריך האימון האחרון
 * @returns מספר ימים מהאימון האחרון
 */
export function daysSinceLastWorkout(lastWorkoutDate: string | Date): number {
  return calculateDaysBetween(lastWorkoutDate, new Date());
}
