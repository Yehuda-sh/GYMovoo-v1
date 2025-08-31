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

  it("should handle empty equipment array gracefully", async () => {
    const { result } = renderHook(() => useWorkoutPlanGeneration());

    let planResult;
    await act(async () => {
      planResult = await result.current.generatePlan({
        frequency: 3,
        experience: "intermediate",
        duration: 45,
        goal: "muscle_gain",
        equipment: [], // Empty equipment
      });
    });

    expect(planResult).toBeDefined();
    expect(planResult!.workoutPlan).toBeDefined();
    expect(planResult!.error).toBe(null);
    expect(planResult!.equipmentSummary.normalizedEquipment).toEqual([]);
  });

  it("should handle null and undefined parameters", () => {
    const { result } = renderHook(() => useWorkoutPlanGeneration());

    // Test with null frequency
    const nullParams = {
      frequency: null as any,
      experience: "intermediate",
      duration: 45,
      goal: "muscle_gain",
    };

    const nullResult = result.current.validatePlanParams(nullParams);
    expect(nullResult.isValid).toBe(false);
    expect(nullResult.errors).toContain(
      "תדירות האימון חייבת להיות בין 1 ל-6 פעמים בשבוע"
    );

    // Test with undefined experience
    const undefinedParams = {
      frequency: 3,
      experience: undefined as any,
      duration: 45,
      goal: "muscle_gain",
    };

    const undefinedResult = result.current.validatePlanParams(undefinedParams);
    expect(undefinedResult.isValid).toBe(false);
    expect(undefinedResult.errors).toContain(
      "רמת הניסיון חייבת להיות: beginner, intermediate או advanced"
    );
  });

  it("should validate extreme parameter values", () => {
    const { result } = renderHook(() => useWorkoutPlanGeneration());

    // Test frequency too high
    const highFreqParams = {
      frequency: 10,
      experience: "intermediate",
      duration: 45,
      goal: "muscle_gain",
    };

    const highFreqResult = result.current.validatePlanParams(highFreqParams);
    expect(highFreqResult.isValid).toBe(false);

    // Test duration too short
    const shortDurationParams = {
      frequency: 3,
      experience: "intermediate",
      duration: 10,
      goal: "muscle_gain",
    };

    const shortDurationResult =
      result.current.validatePlanParams(shortDurationParams);
    expect(shortDurationResult.isValid).toBe(false);

    // Test duration too long
    const longDurationParams = {
      frequency: 3,
      experience: "intermediate",
      duration: 150,
      goal: "muscle_gain",
    };

    const longDurationResult =
      result.current.validatePlanParams(longDurationParams);
    expect(longDurationResult.isValid).toBe(false);
  });

  it("should manage plan history correctly", async () => {
    const { result } = renderHook(() => useWorkoutPlanGeneration());

    // Generate multiple plans
    for (let i = 0; i < 7; i++) {
      await act(async () => {
        await result.current.generatePlan({
          frequency: 3,
          experience: "intermediate",
          duration: 45,
          goal: "muscle_gain",
        });
      });
    }

    // Should only keep last 5 plans
    expect(result.current.planHistory).toHaveLength(5);
    expect(result.current.lastGeneratedPlan).toBeDefined();
  });

  it("should handle custom muscle groups parameter", async () => {
    const { result } = renderHook(() => useWorkoutPlanGeneration());

    const customMuscleGroups = ["חזה", "גב", "כתפיים"];

    let planResult;
    await act(async () => {
      planResult = await result.current.generatePlan({
        frequency: 3,
        experience: "intermediate",
        duration: 45,
        goal: "muscle_gain",
        customMuscleGroups,
      });
    });

    expect(planResult).toBeDefined();
    expect(planResult!.workoutPlan).toBeDefined();
    expect(planResult!.error).toBe(null);
  });

  it("should test equipment compatibility with different scenarios", () => {
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

    // Test with no equipment
    const noEquipmentResult = result.current.checkEquipmentCompatibility(
      exercises,
      []
    );
    expect(noEquipmentResult.compatibilityScore).toBe(0.3);
    expect(noEquipmentResult.substitutionSuggestions).toContain("dumbbell");

    // Test with some equipment
    const someEquipmentResult = result.current.checkEquipmentCompatibility(
      exercises,
      ["dumbbell", "barbell"]
    );
    expect(someEquipmentResult.compatibilityScore).toBe(0.8);
    expect(someEquipmentResult.substitutionSuggestions).toHaveLength(0);
  });

  it("should validate all goal types correctly", () => {
    const { result } = renderHook(() => useWorkoutPlanGeneration());

    const validGoals = [
      "weight_loss",
      "muscle_gain",
      "strength",
      "endurance",
      "general_fitness",
    ];

    validGoals.forEach((goal) => {
      const params = {
        frequency: 3,
        experience: "intermediate",
        duration: 45,
        goal,
      };

      const validationResult = result.current.validatePlanParams(params);
      expect(validationResult.isValid).toBe(true);
    });

    // Test invalid goal
    const invalidParams = {
      frequency: 3,
      experience: "intermediate",
      duration: 45,
      goal: "invalid_goal",
    };

    const invalidResult = result.current.validatePlanParams(invalidParams);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toContain("מטרת האימון לא תקינה");
  });

  it("should test frequency recommendations for all combinations", () => {
    const { result } = renderHook(() => useWorkoutPlanGeneration());

    const experiences = ["beginner", "intermediate", "advanced"];
    const goals = [
      "weight_loss",
      "muscle_gain",
      "strength",
      "endurance",
      "general_fitness",
    ];

    experiences.forEach((experience) => {
      goals.forEach((goal) => {
        const recommendation = result.current.getRecommendedFrequency(
          experience,
          goal
        );
        expect(recommendation).toBeGreaterThan(0);
        expect(recommendation).toBeLessThanOrEqual(6);
      });
    });
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
