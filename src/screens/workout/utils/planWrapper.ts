/**
 * @file src/screens/workout/utils/planWrapper.ts
 * @status Placeholder (TODO) - לא בשימוש כרגע
 * @note קובץ זה הושאר כ-stub כדי למנוע ייבוא שבור. מומלץ לממש או להסיר באישור.
 */

export interface PlanWrapper<T = unknown> {
  id: string;
  name: string;
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

// TODO: לממש עטיפת תוכנית אימון אמיתית או להסיר אם לא נחוץ.
