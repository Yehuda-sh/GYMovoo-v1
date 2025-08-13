/**
 * @file src/services/demo/demoUserService.ts
 * @brief 🔴 DEMO ONLY - שירות יצירת משתמשים דמו למטרות פיתוח בלבד
 * @description יוצר נתוני דמו מציאותיים לבדיקות ופיתוח - לא לשימוש בפרודקשן!
 * @updated 2025-08-11 ✅ OPTIMIZED - שופר תיעוד, זוהו נקודות שיפור לעתיד
 * @status ⚠️ ACTIVE BUT NEEDS REFACTORING - קובץ גדול (1304 שורות) עם פונקציונליות קריטית
 * @used_by demoWorkoutService.ts, services export hub, demo ecosystem
 * @critical_functions generateDemoUserFromQuestionnaire, generateRealisticWorkout, generateWorkoutHistory
 * @todo REFACTOR: פיצול לקבצים קטנים יותר, השלמת TODO בקוד, ניקוי קוד מיותר
 * @warning NOT FOR PRODUCTION - DEMO DATA ONLY
 */

// 🔴 DEMO ONLY - הגנה מפני שימוש בפרודקשן
if (!__DEV__) {
  throw new Error("Demo service should not be used in production");
}

/**
 * src/services/demo/demoUserService.ts
 * Status: REMOVED (stub) - 2025-08-13
 */

export type DemoUser = never;

export const demoUserService = {
  getCurrentDemoUser(): never {
    throw new Error("demoUserService removed");
  },
  generateDemoUser(): never {
    throw new Error("demoUserService removed");
  },
} as const;

export const realisticDemoService = demoUserService;

export default demoUserService;
