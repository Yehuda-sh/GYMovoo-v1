/**
 * @file src/screens/workout/hooks/useWorkoutGeneration.test.ts
 * @brief Tests for specialized workout generation hook
 * @created August 2025
 */

import { renderHook, act } from "@testing-library/react-native";
import { useWorkoutGeneration } from "./useWorkoutGeneration";

// Mock dependencies
jest.mock("../services/workoutLogicService", () => ({
  selectExercisesForDay: jest.fn().mockReturnValue([
    {
      exerciseId: "push_up_1",
      sets: 3,
      reps: "10-12",
      restTime: 60,
      notes: "Standard push-up",
    },
    {
      exerciseId: "squat_1",
      sets: 3,
      reps: "12-15",
      restTime: 60,
      notes: "Bodyweight squat",
    },
  ]),
  getMuscleGroupsForDay: jest.fn().mockReturnValue(["חזה", "טריצפס"]),
  getSetsForExperience: jest.fn().mockReturnValue(3),
  getRepsForGoal: jest.fn().mockReturnValue("10-12"),
  getRestTimeForGoal: jest.fn().mockReturnValue(60),
}));

jest.mock("../../../stores/userStore", () => ({
  useUserEquipment: jest.fn().mockReturnValue(["dumbbell", "bodyweight"]),
}));

jest.mock("../../../utils/equipmentCatalog", () => ({
  normalizeEquipment: jest.fn().mockImplementation((equipment) => equipment),
  canPerform: jest.fn().mockReturnValue(true),
  getExerciseAvailability: jest.fn().mockReturnValue({
    canPerform: true,
    isFullySupported: true,
    substitutions: {},
  }),
}));

jest.mock("../../../data/exercises", () => ({
  allExercises: [
    {
      id: "push_up_1",
      name: "Push Up",
      primaryMuscles: ["חזה", "טריצפס"],
      equipment: "bodyweight",
      instructions: "Standard push-up",
    },
    {
      id: "dumbbell_press_1",
      name: "Dumbbell Press",
      primaryMuscles: ["חזה"],
      equipment: "dumbbell",
      instructions: "Dumbbell chest press",
    },
    {
      id: "squat_1",
      name: "Squat",
      primaryMuscles: ["רגליים"],
      equipment: "bodyweight",
      instructions: "Bodyweight squat",
    },
  ],
}));

jest.mock("../../../utils/logger", () => ({
  logger: {
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("../utils/workoutConstants", () => ({
  DEFAULT_GOAL: "general_fitness",
  DEFAULT_EXPERIENCE: "intermediate",
}));

describe("useWorkoutGeneration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate exercises for muscle group successfully", async () => {
    const { result } = renderHook(() => useWorkoutGeneration());

    expect(result.current.isGenerating).toBe(false);
    expect(result.current.lastGeneratedExercises).toEqual([]);

    let generationResult;
    await act(async () => {
      generationResult = await result.current.generateExercisesForMuscleGroup({
        muscleGroup: "חזה",
        maxExercises: 3,
      });
    });

    expect(generationResult).toBeDefined();
    expect(generationResult!.exercises).toBeDefined();
    expect(generationResult!.exercises.length).toBeGreaterThan(0);
    expect(generationResult!.availabilityScore).toBeGreaterThan(0);
    expect(result.current.isGenerating).toBe(false);
  });

  it("should find exercise substitutes correctly", () => {
    const { result } = renderHook(() => useWorkoutGeneration());

    const originalExercise = {
      id: "barbell_press_1",
      equipment: "barbell",
      primaryMuscles: ["חזה"],
    };

    const substitutionResult = result.current.findExerciseSubstitute({
      originalExercise,
      availableEquipment: ["dumbbell", "bodyweight"],
      muscleGroup: "חזה",
    });

    expect(substitutionResult).toBeDefined();
    expect(substitutionResult.exercise).toBeDefined();
    expect(substitutionResult.isSubstitution).toBeDefined();
    expect(substitutionResult.availableAlternatives).toBeDefined();
  });

  it("should generate random exercises successfully", () => {
    const { result } = renderHook(() => useWorkoutGeneration());

    const randomResult = result.current.generateRandomExercise("חזה", [
      "dumbbell",
    ]);

    expect(randomResult).toBeDefined();
    expect(randomResult.exercise).toBeDefined();
    expect(randomResult.isSubstitution).toBe(false);
    expect(randomResult.availableAlternatives).toBeDefined();
  });

  it("should analyze equipment coverage correctly", () => {
    const { result } = renderHook(() => useWorkoutGeneration());

    const coverage = result.current.analyzeEquipmentCoverage(
      ["חזה", "רגליים"],
      ["dumbbell", "bodyweight"]
    );

    expect(coverage).toBeDefined();
    expect(Array.isArray(coverage)).toBe(true);
    coverage.forEach((item) => {
      expect(item.muscleGroup).toBeDefined();
      expect(item.totalExercises).toBeDefined();
      expect(item.performableExercises).toBeDefined();
      expect(item.coveragePercentage).toBeDefined();
      expect(item.missingEquipment).toBeDefined();
    });
  });

  it("should provide equipment recommendations", () => {
    const { result } = renderHook(() => useWorkoutGeneration());

    const recommendations = result.current.getEquipmentRecommendations([
      "חזה",
      "גב",
    ]);

    expect(recommendations).toBeDefined();
    expect(Array.isArray(recommendations)).toBe(true);

    if (recommendations.length > 0) {
      recommendations.forEach((rec) => {
        expect(rec.equipment).toBeDefined();
        expect(rec.impact).toBeDefined();
        expect(rec.reason).toBeDefined();
      });
    }
  });

  it("should handle generation errors gracefully", async () => {
    // Mock an error in selectExercisesForDay
    const mockSelectExercisesForDay =
      require("../services/workoutLogicService").selectExercisesForDay;
    mockSelectExercisesForDay.mockImplementationOnce(() => {
      throw new Error("Test error");
    });

    const { result } = renderHook(() => useWorkoutGeneration());

    let generationResult;
    await act(async () => {
      generationResult = await result.current.generateExercisesForMuscleGroup({
        muscleGroup: "חזה",
      });
    });

    expect(generationResult!.exercises).toEqual([]);
    expect(generationResult!.warnings.length).toBeGreaterThan(0);
    expect(generationResult!.availabilityScore).toBe(0);
    expect(result.current.isGenerating).toBe(false);
  });

  it("should filter exercises by exclusion list", async () => {
    const { result } = renderHook(() => useWorkoutGeneration());

    let generationResult;
    await act(async () => {
      generationResult = await result.current.generateExercisesForMuscleGroup({
        muscleGroup: "חזה",
        excludeExercises: ["push_up_1"],
      });
    });

    expect(generationResult).toBeDefined();
    expect(generationResult!.exercises).toBeDefined();

    // Should not include excluded exercise
    const hasExcludedExercise = generationResult!.exercises.some(
      (ex) => ex.exerciseId === "push_up_1"
    );
    expect(hasExcludedExercise).toBe(false);
  });

  it("should adjust sets based on parameters", async () => {
    const { result } = renderHook(() => useWorkoutGeneration());

    let generationResult;
    await act(async () => {
      generationResult = await result.current.generateExercisesForMuscleGroup({
        muscleGroup: "חזה",
        minSets: 4,
        maxSets: 5,
      });
    });

    expect(generationResult).toBeDefined();
    expect(generationResult!.exercises).toBeDefined();

    // All exercises should have sets within the specified range
    generationResult!.exercises.forEach((exercise) => {
      expect(exercise.sets).toBeGreaterThanOrEqual(4);
      expect(exercise.sets).toBeLessThanOrEqual(5);
    });
  });
});
