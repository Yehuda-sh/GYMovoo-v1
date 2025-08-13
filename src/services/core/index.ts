/**
 * @file src/services/core/index.ts
 * @brief Hub ייצוא שירותי ליבה - מנהל נתונים מרכזי ותצורות
 * @brief Core Services Export Hub - Central data manager and configurations
 * @updated 2025-01-17 Enhanced documentation for audit completion
 *
 * ✅ ACTIVE & CRITICAL: Hub ייצוא מרכזי בשימוש פעיל
 * - App.tsx: אתחול מנהל נתונים במערכת
 * - HistoryScreen.tsx/simple.tsx: גישה למנהל נתונים
 * - WORKOUT_SERVICES_COMPLETION_REPORT.md: תיעוד אדריכלות
 *
 * @exports dataManager - מנהל נתונים מרכזי יחיד לכל האפליקציה
 * @exports AppDataCache - ממשק מטמון נתוני אפליקציה
 * @exports ServerConfig - ממשק תצורת שרת עתידית
 *
 * @architecture Central export hub for core services
 * @usage 5+ files import from this hub across the application
 * @pattern Barrel exports for clean import paths
 */

export {
  dataManager,
  type AppDataCache,
  type ServerConfig,
  type DataStatus,
} from "./DataManager";
