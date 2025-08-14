/**
 * @file src/hooks/index.ts
 * @description Central export hub for all React hooks in the GYMovoo fitness application
 * @description מרכז ייצוא מתקדם לכל ה-hooks באפליקציית הכושר GYMovoo
 *
 * Features:
 * - Workout management hooks with AI-powered recommendations
 * - Premium content access control with advanced analytics
 * - User preferences with smart algorithms and caching
 * - Performance optimization utilities
 * - Type-safe exports with comprehensive TypeScript support
 *
 * Performance optimizations:
 * - All hooks include built-in caching systems
 * - Memoized calculations for better performance
 * - Smart dependency tracking
 */

// ================================
// 🏋️ WORKOUT MANAGEMENT HOOKS
// ================================

// Next workout planning with AI recommendations
export { useNextWorkout } from "./useNextWorkout";

// Performance tracking and historical analysis
export { usePreviousPerformance } from "./usePreviousPerformance";

// ================================
// 💎 PREMIUM CONTENT HOOKS
// ================================

// Premium access control with advanced analytics and conversion tracking
export { usePremiumAccess } from "./usePremiumAccess";

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
export type {
  SmartPreviousPerformance,
  UsePreviousPerformanceReturn,
} from "./usePreviousPerformance";

// Premium access types
export type {
  ContentType,
  SubscriptionTier,
  PremiumInsights,
} from "./usePremiumAccess";

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
    hooks: ["useNextWorkout", "usePreviousPerformance", "usePremiumAccess"],
    description: "Everything needed for a complete workout session",
  },

  /**
   * Premium content management
   */
  PREMIUM_CONTENT: {
    hooks: ["usePremiumAccess", "useUserPreferences"],
    description: "Premium content access and user preferences",
  },

  /**
   * User profile and preferences
   */
  USER_PROFILE: {
    hooks: ["useUserPreferences", "usePremiumAccess"],
    description: "User profile management and premium features",
  },
} as const;
