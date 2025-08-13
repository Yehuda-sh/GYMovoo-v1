/**
 * src/services/workoutSimulationService.ts
 *
 * Status: REMOVED (stub)
 * Reason: Demo/simulation were deprecated and removed. This minimal stub remains
 * temporarily to avoid breaking imports during cleanup. It returns empty results.
 */

export type SimulationParameters = Record<string, never>;

export const workoutSimulationService = {
  /**
   * Stubbed method: returns an empty array and logs a warning.
   */
  async simulateHistoryCompatibleWorkouts(
    _params?: SimulationParameters
  ): Promise<unknown[]> {
    console.warn(
      "[workoutSimulationService] Service removed – stub returns []"
    );
    return [];
  },
} as const;

export default workoutSimulationService;
