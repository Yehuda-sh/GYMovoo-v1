/**
 * src/services/demo/demoWorkoutService.ts
 * Status: REMOVED (stub) - 2025-08-13
 * Reason: Demo/simulation removed. This stub prevents import breaks temporarily.
 */

export const demoWorkoutService = {
  async createDemoWorkouts(): Promise<never[]> {
    console.warn("[demoWorkoutService] removed – returns []");
    return [] as never[];
  },
  async createSingleWorkoutForDemo(): Promise<never[]> {
    console.warn("[demoWorkoutService] removed – returns []");
    return [] as never[];
  },
  async quickDemoWorkout(): Promise<never[]> {
    console.warn("[demoWorkoutService] removed – returns []");
    return [] as never[];
  },
} as const;

export default demoWorkoutService;
