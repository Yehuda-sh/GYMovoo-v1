/**
 * @file src/services/demo/index.ts
 * @brief 🔴 DEMO SERVICES INDEX - שירותי דמו למטרות פיתוח בלבד
 * @description מרכז יצוא כל שירותי הדמו
 * @warning NOT FOR PRODUCTION - DEMO DATA ONLY
 */

// 🔴 DEMO ONLY - הגנה מפני שימוש בפרודקשן
if (!__DEV__) {
  throw new Error("Demo services should not be used in production");
}

export { demoUserService, realisticDemoService } from "./demoUserService";
export { demoWorkoutService } from "./demoWorkoutService";
export { demoHistoryService } from "./demoHistoryService";
export { demoWorkoutDurationService } from "./demoWorkoutDurationService";

// Export types for demo data
export type { DemoUser } from "./demoUserService";
