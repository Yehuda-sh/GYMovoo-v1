/**
 * @file src/screens/workout/hooks/useWorkoutGeneration.test.ts
 * @brief Test suite for useWorkoutGeneration hook
 */

import { renderHook, act } from "@testing-library/react-native";
import { useWorkoutGeneration } from "./useWorkoutGeneration";

// Mock dependencies
jest.mock("../../../utils/logger", () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../../../stores/userStore", () => ({
  useUserEquipment: jest.fn(() => ["dumbbells", "bodyweight"]),
}));

jest.mock("../services/workoutLogicService", () => ({
  selectExercisesForDay: jest.fn(() => [
    {
      exerciseId: "test_exercise",
      sets: 3,
      reps: 12,
      restTime: 60,
    },
  ]),
  getMuscleGroupsForDay: jest.fn(() => ["chest", "triceps"]),
  getSetsForExperience: jest.fn(() => 3),
  getRepsForGoal: jest.fn(() => 12),
  getRestTimeForGoal: jest.fn(() => 60),
}));

jest.mock("../../../utils/equipmentCatalog", () => ({
  normalizeEquipment: jest.fn((equipment) => equipment),
  canPerform: jest.fn(() => true),
  getExerciseAvailability: jest.fn(() => ({
    canPerform: true,
    score: 100,
    isFullySupported: true,
  })),
}));

jest.mock("../../../data/exercises", () => ({
  allExercises: [
    {
      id: "test_exercise",
      primaryMuscles: ["chest"],
      equipment: "dumbbell",
    },
  ],
}));

describe("useWorkoutGeneration Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Hook Initialization", () => {
    it("should initialize with correct default state", () => {
      const { result } = renderHook(() => useWorkoutGeneration());

      expect(result.current).toBeDefined();
      expect(result.current.isGenerating).toBe(false);
      expect(Array.isArray(result.current.lastGeneratedExercises)).toBe(true);
      expect(result.current.lastGeneratedExercises).toHaveLength(0);
      expect(Array.isArray(result.current.generationHistory)).toBe(true);
      expect(result.current.generationHistory).toHaveLength(0);
    });

    it("should expose all required functions", () => {
      const { result } = renderHook(() => useWorkoutGeneration());

      expect(typeof result.current.generateExercisesForMuscleGroup).toBe(
        "function"
      );
      expect(typeof result.current.findExerciseSubstitute).toBe("function");
      expect(typeof result.current.generateRandomExercise).toBe("function");
      expect(typeof result.current.analyzeEquipmentCoverage).toBe("function");
      expect(typeof result.current.getEquipmentRecommendations).toBe(
        "function"
      );
    });
  });

  describe("Exercise Generation", () => {
    it("should generate exercises for muscle group", async () => {
      const { result } = renderHook(() => useWorkoutGeneration());

      let generationResult;
      await act(async () => {
        generationResult = await result.current.generateExercisesForMuscleGroup(
          {
            muscleGroup: "chest",
          }
        );
      });

      expect(generationResult).toBeDefined();
      expect(generationResult.exercises).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            exerciseId: expect.any(String),
            sets: expect.any(Number),
            reps: expect.any(Number),
            restTime: expect.any(Number),
          }),
        ])
      );
    });

    it("should handle exercise substitution", () => {
      const { result } = renderHook(() => useWorkoutGeneration());

      const substitutionResult = result.current.findExerciseSubstitute({
        originalExercise: { exerciseId: "test_exercise", equipment: "barbell" },
        availableEquipment: ["dumbbells"],
      });

      expect(substitutionResult).toBeDefined();
      expect(substitutionResult).toHaveProperty("exercise");
      expect(substitutionResult).toHaveProperty("isSubstitution");
    });

    it("should generate random exercises", () => {
      const { result } = renderHook(() => useWorkoutGeneration());

      const randomResult = result.current.generateRandomExercise("chest");

      expect(randomResult).toBeDefined();
      expect(randomResult).toHaveProperty("exercise");
      expect(randomResult).toHaveProperty("isSubstitution");
    });
  });

  describe("Equipment Analysis", () => {
    it("should analyze equipment coverage", () => {
      const { result } = renderHook(() => useWorkoutGeneration());

      const coverage = result.current.analyzeEquipmentCoverage([
        "chest",
        "back",
      ]);

      expect(Array.isArray(coverage)).toBe(true);
      coverage.forEach((item) => {
        expect(item).toHaveProperty("muscleGroup");
        expect(item).toHaveProperty("totalExercises");
        expect(item).toHaveProperty("performableExercises");
        expect(item).toHaveProperty("coveragePercentage");
      });
    });

    it("should provide equipment recommendations", () => {
      const { result } = renderHook(() => useWorkoutGeneration());

      const recommendations = result.current.getEquipmentRecommendations([
        "chest",
        "back",
      ]);

      expect(Array.isArray(recommendations)).toBe(true);
      recommendations.forEach((rec) => {
        expect(rec).toHaveProperty("equipment");
        expect(rec).toHaveProperty("impact");
        expect(rec).toHaveProperty("reason");
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty muscle group", async () => {
      const { result } = renderHook(() => useWorkoutGeneration());

      await act(async () => {
        const result1 = await result.current.generateExercisesForMuscleGroup({
          muscleGroup: "",
        });
        expect(result1).toBeDefined();
      });
    });

    it("should handle invalid parameters gracefully", () => {
      const { result } = renderHook(() => useWorkoutGeneration());

      expect(() => {
        result.current.findExerciseSubstitute({
          originalExercise: { exerciseId: "" },
          availableEquipment: [],
        });
      }).not.toThrow();

      expect(() => {
        result.current.generateRandomExercise("");
      }).not.toThrow();
    });
  });

  describe("State Management", () => {
    it("should maintain stable behavior across re-renders", () => {
      const { result, rerender } = renderHook(() => useWorkoutGeneration());

      const firstRender = result.current;
      rerender({});
      const secondRender = result.current;

      // State should remain consistent
      expect(firstRender.isGenerating).toBe(secondRender.isGenerating);
      expect(firstRender.lastGeneratedExercises).toEqual(
        secondRender.lastGeneratedExercises
      );
      expect(firstRender.generationHistory).toEqual(
        secondRender.generationHistory
      );

      // Functions should still work after re-render
      expect(typeof secondRender.generateExercisesForMuscleGroup).toBe(
        "function"
      );
      expect(typeof secondRender.findExerciseSubstitute).toBe("function");
    });
  });
});
