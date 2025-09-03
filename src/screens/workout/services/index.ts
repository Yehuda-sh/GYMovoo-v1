/**
 * @file src/screens/workout/services/index.ts
 * @description ייצוא מרכזי של שירותי האימון
 * @updated 2025-09-03 Simplified documentation and updated examples
 */

// שירותי אימון מרכזיים
export { default as workoutValidationService } from "./workoutValidationService";
export { default as workoutErrorHandlingService } from "./workoutErrorHandlingService";
export * from "./workoutLogicService";

/**
 * דוגמת שימוש:
 *
 * import { workoutValidationService, workoutErrorHandlingService } from '../services';
 *
 * const validation = workoutValidationService.validateWorkoutData(workout);
 * if (!validation.isValid) {
 *   console.error('Validation errors:', validation.errors);
 * }
 */
