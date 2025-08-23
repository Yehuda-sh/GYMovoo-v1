/**
 * @file src/screens/workout/hooks/useWorkoutPlanGeneration.test.ts
 * @brief Tests for workout plan generation hook
 * @created August 2025
 */

import { renderHook, act } from "@testing-library/react-native";
import { useWorkoutPlanGeneration } from "./useWorkoutPlanGeneration";

// Mock dependencies
jest.mock("../services/workoutLogicService", () => ({
  generateWorkoutPlan: jest.fn().mockReturnValue([
    {
      id: "day_0",
      name: "חזה",
      exercises: [
        { exerciseId: "push_up_1", sets: 3, reps: "10-12", restTime: 60 },
      ],
      muscles: ["חזה", "טריצפס"],
    },
  ]),
  initializeExerciseCache: jest.fn(),
  getMuscleGroupsForDay: jest.fn().mockReturnValue(["חזה", "טריצפס"]),
}));

jest.mock("../../../stores/userStore", () => ({
  useUserEquipment: jest.fn().mockReturnValue(["dumbbell", "barbell"]),
}));

jest.mock("../../../utils/equipmentCatalog", () => ({
  normalizeEquipment: jest.fn().mockImplementation((equipment) => equipment),
}));

jest.mock("../../../utils/logger", () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../utils/workoutConstants", () => ({
  WORKOUT_DAYS: {
    3: ["חזה", "גב", "רגליים"],
  },
  DEFAULT_GOAL: "general_fitness",
  DEFAULT_EXPERIENCE: "intermediate",
}));

describe("useWorkoutPlanGeneration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate workout plan successfully", async () => {
    const { result } = renderHook(() => useWorkoutPlanGeneration());

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.lastGeneratedPlan).toBe(null);

    let planResult;
    await act(async () => {
      planResult = await result.current.generatePlan({
        frequency: 3,
        experience: "intermediate",
        duration: 45,
        goal: "muscle_gain",
      });
    });

    expect(planResult).toBeDefined();
    expect(planResult!.workoutPlan).toBeDefined();
    expect(planResult!.error).toBe(null);
    expect(planResult!.equipmentSummary).toBeDefined();
    expect(planResult!.planMetadata).toBeDefined();
    expect(result.current.isGenerating).toBe(false);
  });

  it("should validate plan parameters correctly", () => {
    const { result } = renderHook(() => useWorkoutPlanGeneration());

    // Valid parameters
    const validParams = {
      frequency: 3,
      experience: "intermediate",
      duration: 45,
      goal: "muscle_gain",
    };

    const validResult = result.current.validatePlanParams(validParams);
    expect(validResult.isValid).toBe(true);
    expect(validResult.errors).toHaveLength(0);

    // Invalid parameters
    const invalidParams = {
      frequency: 10, // Too high
      experience: "invalid",
      duration: 10, // Too short
      goal: "invalid_goal",
    };

    const invalidResult = result.current.validatePlanParams(invalidParams);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors.length).toBeGreaterThan(0);
  });

  it("should provide equipment compatibility check", () => {
    const { result } = renderHook(() => useWorkoutPlanGeneration());

    const exercises = [
      {
        exerciseId: "push_up_1",
        sets: 3,
        reps: "10-12",
        restTime: 60,
        notes: "",
      },
    ];

    const compatibility = result.current.checkEquipmentCompatibility(
      exercises,
      ["dumbbell"]
    );

    expect(compatibility).toBeDefined();
    expect(compatibility.canPerformAll).toBe(true);
    expect(compatibility.compatibilityScore).toBeGreaterThan(0);
  });

  it("should recommend appropriate frequency based on experience and goal", () => {
    const { result } = renderHook(() => useWorkoutPlanGeneration());

    // Beginner recommendations
    expect(
      result.current.getRecommendedFrequency("beginner", "weight_loss")
    ).toBe(4);
    expect(
      result.current.getRecommendedFrequency("beginner", "muscle_gain")
    ).toBe(3);

    // Advanced recommendations
    expect(
      result.current.getRecommendedFrequency("advanced", "muscle_gain")
    ).toBe(6);
    expect(result.current.getRecommendedFrequency("advanced", "strength")).toBe(
      5
    );
  });

  it("should handle generation errors gracefully", async () => {
    // Mock a failure in generateWorkoutPlan
    const mockGenerateWorkoutPlan =
      require("../services/workoutLogicService").generateWorkoutPlan;
    mockGenerateWorkoutPlan.mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const { result } = renderHook(() => useWorkoutPlanGeneration());

    let planResult;
    await act(async () => {
      planResult = await result.current.generatePlan({
        frequency: 3,
        experience: "intermediate",
        duration: 45,
        goal: "muscle_gain",
      });
    });

    expect(planResult!.error).toBeDefined();
    expect(planResult!.workoutPlan).toEqual([]);
    expect(result.current.isGenerating).toBe(false);
  });
});
