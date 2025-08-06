/**
 * @file src/screens/workout/services/index.ts
 * @description ייצוא מרכזי של כל שירותי האימון
 * English: Central export for all workout services
 * @inspired מהארכיטקטורה המוצלחת במסך ההיסטוריה
 */

// שירותים בסיסיים
export { default as autoSaveService } from "./autoSaveService";

// שירותים מתקדמים שנוספו על בסיס ההיסטוריה
export { default as workoutValidationService } from "./workoutValidationService";
export { default as workoutErrorHandlingService } from "./workoutErrorHandlingService";
export { default as workoutFeedbackService } from "./workoutFeedbackService";
export { default as workoutDataService } from "./workoutDataService";

/**
 * דוגמת שימוש:
 *
 * ```typescript
 * import {
 *   autoSaveService,
 *   workoutValidationService,
 *   workoutErrorHandlingService,
 *   workoutFeedbackService,
 *   workoutDataService
 * } from '../services';
 *
 * // שמירה אוטומטית משופרת
 * autoSaveService.startAutoSave(workoutId, () => {
 *   const workout = getCurrentWorkout();
 *   const validation = workoutValidationService.validateWorkoutData(workout);
 *   return validation.correctedData || workout;
 * });
 *
 * // טיפול בשגיאות
 * try {
 *   await workoutDataService.saveWorkoutData(workout);
 * } catch (error) {
 *   const strategy = await workoutErrorHandlingService.handleAutoSaveError(
 *     error,
 *     workout,
 *     () => retryFunction()
 *   );
 *   // ביצוע האסטרטגיה...
 * }
 *
 * // שמירת משוב
 * const feedback = {
 *   difficulty: 4,
 *   feeling: "💪",
 *   completedAt: new Date().toISOString(),
 *   readyForMore: true
 * };
 * await workoutFeedbackService.saveFeedback(workoutId, feedback);
 *
 * // אנליטיקה
 * const analytics = await workoutDataService.calculateWorkoutAnalytics();
 * console.log("Total workouts:", analytics.totalWorkouts);
 * ```
 */
