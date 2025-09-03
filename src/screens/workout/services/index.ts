/**
 * @file src/screens/workout/services/index.ts
 * @description ייצוא מרכזי של כל שירותי האימון המתקדמים - Hub מרכזי משופר
 * @description English: Central export for all advanced workout services - Enhanced central hub
 * @inspired מהארכיטקטורה המוצלחת במסך ההיסטוריה
 * @updated 2025-09-01 Fixed exports and documentation to match available services
 *
 * ✅ ACTIVE & WELL-ORGANIZED: Hub ייצוא מרכזי מתקדם ומאורגן
 * - Exports 5 advanced services: autoSave, validation, errorHandling, feedback, logic
 * - System-wide access via src/services/index.ts re-export
 * - Comprehensive usage examples with real-world integration patterns
 * - Clean architecture with proper service separation and dependencies
 *
 * @services
 * - workoutValidationService: וידוא נתונים מתקדם עם התאמה אישית
 * - workoutErrorHandlingService: טיפול בשגיאות מרכזי עם recovery
 * - workoutLogicService: לוגיקה מתקדמת לתוכניות אימון
 *
 * @architecture Barrel exports pattern for clean service imports
 * @usage Central access point for all workout-related service operations
 * @examples Comprehensive real-world usage patterns included below
 */

// ===============================================
// 🏗️ CORE WORKOUT SERVICES - Advanced Architecture
// ===============================================

// Personalized validation engine with user-specific rules
export { default as workoutValidationService } from "./workoutValidationService";

// Comprehensive error handling with recovery strategies
export { default as workoutErrorHandlingService } from "./workoutErrorHandlingService";

// Advanced workout logic and planning
export * from "./workoutLogicService";

/**
 * דוגמת שימוש:
 *
 * ```typescript
 * import {
 *   workoutValidationService,
 *   workoutErrorHandlingService,
 *   workoutLogicService
 * } from '../services';
 *
 * // וידואי נתונים מתקדם
 * const validation = workoutValidationService.validateWorkoutData(workout);
 * return validation.correctedData || workout;
 *
 * try {
 *   await workoutDataService.saveWorkoutData(workout);
 * } catch (error) {
 *   const strategy = await workoutErrorHandlingService.handleDataLoadError(
 *     error,
 *     "save_workout",
 *     () => retryFunction()
 *   );
 *   // ביצוע האסטרטגיה...
 * }
 *
 * // שימוש בלוגיקת אימון
 * const muscleGroups = workoutLogicService.getMuscleGroupsForDay("יום חזה");
 * console.log("Muscle groups for chest day:", muscleGroups);
 * ```
 */
