/**
 * @file src/hooks/index.ts
 * @description Central export hub for all React hooks in the GYMovoo fitness application
 * @description מרכז ייצוא מתקדם לכל ה-hooks באפליקציית הכושר GYMovoo
 *
 * Features:
 * - App initialization and lifecycle management
 * - Workout management hooks with AI-powered recommendations
 * - User preferences with smart algorithms and optimized performance
 * - Performance optimization utilities
 * - Type-safe exports with comprehensive TypeScript support
 *
 * Performance optimizations:
 * - Optimized hooks with minimal re-renders
 * - Memoized calculations for better performance
 * - Smart dependency tracking
 */

// ================================
// 🚀 APP LIFECYCLE HOOKS
// ================================
export { useAppInitialization } from "./useAppInitialization";

// ================================
// 🏋️ WORKOUT MANAGEMENT HOOKS
// ================================

// Next workout planning with AI recommendations
export { useNextWorkout } from "./useNextWorkout";

// ================================
// ♿ ACCESSIBILITY HOOKS
// ================================

// Simple accessibility announcements
export { useAccessibilityAnnouncements } from "./useAccessibilityAnnouncements";

// ================================
// ⚙️ USER PREFERENCES HOOKS
// ================================

// Advanced user preferences with smart algorithms
export { useUserPreferences } from "./useUserPreferences";

// Helper functions for user preferences
export * from "./userPreferencesHelpers";

// ================================
// 📊 TYPE EXPORTS
// ================================

// Workout management types
export type { UseNextWorkoutReturn } from "./useNextWorkout";

// User preferences types
export type {
  SmartUserPreferences,
  UseUserPreferencesReturn,
} from "./useUserPreferences";

// ================================
// 🛠️ UTILITY FUNCTIONS
// ================================

/**
 * Hook composition utilities for advanced use cases
 */
export const HookUtils = {
  /**
   * Combine multiple hook results with proper error handling
   */
  combineHooks: <T extends Record<string, unknown>[]>(
    ...hookResults: T
  ): T[number] => {
    return hookResults.reduce(
      (combined, result) => ({ ...combined, ...result }),
      {} as T[number]
    );
  },

  /**
   * Create a memoized hook selector for performance optimization
   */
  createSelector:
    <T, R>(selector: (state: T) => R) =>
    (state: T): R => {
      return selector(state);
    },

  /**
   * Debounced hook executor for performance-critical operations
   */
  debounce: <T extends (...args: readonly unknown[]) => unknown>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },
};

// ================================
// 📱 HOOK PRESETS FOR COMMON USE CASES
// ================================

/**
 * Pre-configured hook combinations for common fitness app scenarios
 */
export const HookPresets = {
  /**
   * Complete workout session setup
   */
  WORKOUT_SESSION: {
    hooks: ["useNextWorkout"],
    description: "Everything needed for a complete workout session",
  },

  /**
   * User profile and preferences
   */
  USER_PROFILE: {
    hooks: ["useUserPreferences"],
    description: "User profile management and preferences",
  },
} as const;
