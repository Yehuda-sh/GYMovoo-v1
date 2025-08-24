/**
 * @file src/services/core/index.ts
 * @brief Hub ייצוא שירותי ליבה - מנהל נתונים מרכזי ותצורות
 * @brief Core Services Export Hub - Central data manager and configurations
 * @updated 2025-08-25 Updated after DataManager logging improvements and type safety enhancements
 *
 * ✅ ACTIVE & CRITICAL: Hub ייצוא מרכזי בשימוש פעיל
 * - App.tsx: אתחול מנהל נתונים במערכת
 * - HistoryScreen.tsx: גישה למנהל נתונים מעודכן עם logger system
 * - Multiple screens: שימוש במנהל נתונים מרכזי
 *
 * @exports dataManager - מנהל נתונים מרכזי יחיד לכל האפליקציה (Singleton)
 * @exports AppDataCache - ממשק מטמון נתוני אפליקציה
 * @exports ServerConfig - ממשק תצורת שרת עתידית (readonly)
 * @exports DataStatus - ממשק סטטוס נתונים מרכזי
 *
 * @architecture Central export hub for core services with improved type safety
 * @usage 10+ files import from this hub across the application
 * @pattern Barrel exports for clean import paths and centralized access
 */

export {
  dataManager,
  type AppDataCache,
  type ServerConfig,
  type DataStatus,
} from "./DataManager";
