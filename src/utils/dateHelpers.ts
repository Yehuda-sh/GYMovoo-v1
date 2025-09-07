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

/**
 * בדיקה אם תאריך הוא תקין
 * @param date תאריך לבדיקה
 * @returns true אם התאריך תקין
 */
export function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * התחלת השבוע (יום ראשון)
 * @param date תאריך
 * @param weekStartsOn יום התחלת השבוע (0 = ראשון, 1 = שני)
 * @returns תאריך תחילת השבוע
 */
export function startOfWeek(date: Date, weekStartsOn: 0 | 1 = 0): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day - weekStartsOn;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * המרת תאריך ל-ISO string בטוח
 * @param date תאריך
 * @returns ISO string או empty string אם התאריך לא תקין
 */
export function safeToISOString(date: unknown): string {
  if (!isValidDate(date)) return "";
  return date.toISOString();
}

/**
 * חישוב גיל מתאריך לידה
 * @param birthDate תאריך לידה
 * @returns גיל בשנים
 */
export function calculateAge(birthDate: string | Date): number {
  try {
    const birth =
      typeof birthDate === "string" ? new Date(birthDate) : birthDate;
    if (!isValidDate(birth)) return 0;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return Math.max(0, age);
  } catch (error) {
    console.error("Error calculating age:", error);
    return 0;
  }
}
