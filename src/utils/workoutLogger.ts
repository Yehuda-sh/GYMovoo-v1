/**
 * @file src/utils/workoutLogger.ts
 * @brief לוגר מותנה לאימונים - פעיל רק בפיתוח
 * @description מנהל לוגים של אימונים בצורה מותנה לפי סביבה
 */

const IS_DEVELOPMENT = __DEV__ || process.env.NODE_ENV === "development";

export const workoutLogger = {
  info: (message: string, data?: any) => {
    if (IS_DEVELOPMENT) {
      console.log(`🏋️ [Workout] ${message}`, data || "");
    }
  },

  error: (message: string, error?: any) => {
    if (IS_DEVELOPMENT) {
      console.error(`❌ [Workout] ${message}`, error || "");
    }
  },

  warn: (message: string, data?: any) => {
    if (IS_DEVELOPMENT) {
      console.warn(`⚠️ [Workout] ${message}`, data || "");
    }
  },

  debug: (message: string, data?: any) => {
    if (IS_DEVELOPMENT) {
    }
  },

  setCompleted: (exerciseId: string, setId: string, updates: any) => {
    if (IS_DEVELOPMENT) {
      console.log(`✅ [Set Update] ${exerciseId}/${setId}:`, updates);
    }
  },

  reorderSets: (exerciseId: string, fromIndex: number, toIndex: number) => {
    if (IS_DEVELOPMENT) {
      console.log(
        `🔄 [Sets Reorder] ${exerciseId}: ${fromIndex} -> ${toIndex}`
      );
    }
  },
};
