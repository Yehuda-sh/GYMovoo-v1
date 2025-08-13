/**
 * @file src/screens/workout/utils/planWrapper.ts
 * עטיפת תוכנית אימון כללית עם טיפוסים ו-helpers קלים.
 * נשמר מינימלי כדי למנוע שבירת ייבוא, בלי לייצר נתונים מהאוויר.
 */

export interface PlanWrapper<T = unknown> {
  /** מזהה ייחודי של התוכנית */
  id: string;
  /** שם תיאור של התוכנית */
  name: string;
  /** מטען גנרי של תוכנית/יום/מבנה */
  payload: T;
}

export const wrapPlan = <T>(
  id: string,
  name: string,
  payload: T
): PlanWrapper<T> => ({
  id,
  name,
  payload,
});

/**
 * בדיקת טיפוס להרשאת עבודה בטוחה עם עטיפה.
 */
export const isPlanWrapper = (
  value: unknown
): value is PlanWrapper<unknown> => {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" && typeof v.name === "string" && "payload" in v
  );
};

/**
 * חילוץ המטען מתוך עטיפת תוכנית.
 */
export const unwrapPlan = <T>(wrapper: PlanWrapper<T>): T => wrapper.payload;

// הערה: אם מודול זה אינו נדרש – אפשר להסיר בעתיד באישור, לאחר בדיקת ייבוא.
