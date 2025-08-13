/**
 * src/services/demo/demoHistoryService.ts
 * Status: REMOVED (stub) - 2025-08-13
 */

export const demoHistoryService = {
  async addWorkoutSession(): Promise<void> {
    console.warn("[demoHistoryService] removed – no-op");
  },
  async getHistory(): Promise<never[]> {
    console.warn("[demoHistoryService] removed – returns []");
    return [] as never[];
  },
  async generateDemoWorkoutHistoryForUser(): Promise<void> {
    console.warn("[demoHistoryService] removed – no-op");
  },
} as const;

export default demoHistoryService;
