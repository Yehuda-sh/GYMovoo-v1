/**
 * @file src/constants/logging.ts
 * @description קבועי לוג מרכזיים לשליטה ברמת הפלט בזמן פיתוח
 * הערה: ברירת המחדל שקטה יחסית; ניתן להפעיל פירוט ע"י שינוי ערכים כאן
 * או שימוש במשתני סביבה (EXPO_PUBLIC_LOG_*), אם זמינים.
 */

// קריאה בטוחה של משתני סביבה (Expo משתמש ב-EXPO_PUBLIC_*)
const envBool = (val: string | undefined, def = false) => {
  if (typeof val !== "string") return def;
  return ["1", "true", "yes", "on"].includes(val.toLowerCase());
};

export const LOGGING = {
  // לוגים מפורטים מאוד (דאמפים גדולים כמו _logCompleteUserData)
  VERBOSE: envBool(process.env.EXPO_PUBLIC_LOG_VERBOSE, false),
  // פלט דמו ("Generating DEMO...", "Using real user data for demo")
  DEMO: envBool(process.env.EXPO_PUBLIC_LOG_DEMO, false),
  // פלט שירות סימולציה ("Simulated 103 workouts")
  SIMULATION: envBool(process.env.EXPO_PUBLIC_LOG_SIMULATION, false),
  // סיכומי DataManager קצרים (נטען X אימונים וכו')
  DATA_MANAGER_SUMMARY: envBool(process.env.EXPO_PUBLIC_LOG_DM_SUMMARY, true),
  // לכפות שימוש בנתוני משתמש אמיתיים גם ב-DEV (מבטל דמו)
  FORCE_REAL_DATA: envBool(process.env.EXPO_PUBLIC_DM_FORCE_REAL, false),
} as const;

export type LoggingConfig = typeof LOGGING;
