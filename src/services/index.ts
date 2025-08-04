/**
 * @file src/services/index.ts
 * @brief ייצוא מרכזי לכל השירותים
 * @dependencies All service modules
 * @notes מאפשר ייבוא נוח של שירותים מחוץ לתיקיה
 */

// Core services
export * from "./authService";
export * from "./exerciseService";
export * from "./questionnaireService";
export * from "./workoutDataService";

// Specialized services
export { workoutHistoryService } from "./workoutHistoryService";
export { workoutSimulationService } from "./workoutSimulationService";
export { nextWorkoutLogicService } from "./nextWorkoutLogicService";
export { realisticDemoService } from "./realisticDemoService";
export type {
  WorkoutSession,
  WorkoutExercise,
  RealisticExerciseSet,
  WorkoutFeedback,
  PerformanceRecommendation,
} from "./realisticDemoService";
export { scientificAIService } from "./scientificAIService";
export { wgerApiService } from "./wgerApiService";
export type { WgerExerciseInfo } from "./wgerApiService";

// Quick workout generator
export {
  QuickWorkoutGenerator,
  generateQuickWorkout,
} from "./quickWorkoutGenerator";
export type { ExerciseTemplate } from "./quickWorkoutGenerator";
