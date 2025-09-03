/**
 * @file src/screens/workout/services/workoutLogicService.test.ts
 * @brief Tests for workout logic service - בדיקות לשירות לוגיקת האימון
 * @dependencies Jest, workoutLogicService
 * @updated September 2025 - Enhanced tests with better coverage and organization
 */

import {
  selectExercisesForDay,
  getMuscleGroupsForDay,
  getSetsForExperience,
  getRepsForGoal,
  getRestTimeForGoal,
} from "./workoutLogicService";

// Test constants
const TEST_CONSTANTS = {
  DURATION: {
    SHORT: 30,
    NORMAL: 60,
    LONG: 90,
  },
  EXERCISE_LIMITS: {
    MIN: 1,
    MAX: 8,
  },
  EXPERIENCE_LEVELS: ["beginner", "intermediate", "advanced"] as const,
  MUSCLE_GROUPS: ["חזה", "גב", "רגליים", "כתפיים"] as const,
} as const;

// Mock metadata for consistent testing
const mockMetadata = {
  goal: "muscle_gain",
  level: "intermediate",
};

// Helper function to validate exercise structure
const validateExercise = (exercise: any) => {
  expect(exercise.exerciseId).toBeDefined();
  expect(exercise.sets).toBeGreaterThan(0);
  expect(exercise.reps).toBeDefined();
  expect(exercise.restTime).toBeGreaterThan(0);
  expect(exercise.notes).toBeDefined();
};

describe("workoutLogicService", () => {
  describe("getMuscleGroupsForDay", () => {
    test("should return correct muscle groups for known workout days", () => {
      expect(getMuscleGroupsForDay("חזה")).toEqual(["חזה", "טריצפס"]);
      expect(getMuscleGroupsForDay("גב")).toEqual(["גב", "ביצפס"]);
      expect(getMuscleGroupsForDay("רגליים")).toEqual([
        "רגליים",
        "ישבן",
        "שוקיים",
      ]);
    });

    test("should return fallback muscle groups for unknown days", () => {
      const result = getMuscleGroupsForDay("unknown_day");
      expect(result).toEqual(["חזה", "גב"]);
    });
  });

  describe("getSetsForExperience", () => {
    test("should return appropriate sets for each experience level", () => {
      expect(getSetsForExperience("beginner")).toBe(3);
      expect(getSetsForExperience("intermediate")).toBe(4);
      expect(getSetsForExperience("advanced")).toBe(5);
      expect(getSetsForExperience("expert")).toBe(5); // maps to advanced
    });

    test("should return default sets for unknown experience", () => {
      expect(getSetsForExperience("unknown")).toBe(4);
    });
  });

  describe("getRepsForGoal", () => {
    test("should return appropriate reps for each goal", () => {
      expect(getRepsForGoal("strength")).toBe("4-6");
      expect(getRepsForGoal("build_muscle")).toBe("8-12");
      expect(getRepsForGoal("weight_loss")).toBe("12-15");
      expect(getRepsForGoal("endurance")).toBe("15-20");
    });

    test("should return default reps for unknown goal", () => {
      expect(getRepsForGoal("unknown")).toBe("10-12");
    });
  });

  describe("getRestTimeForGoal", () => {
    test("should return appropriate rest time for each goal", () => {
      expect(getRestTimeForGoal("strength")).toBe(120);
      expect(getRestTimeForGoal("build_muscle")).toBe(75);
      expect(getRestTimeForGoal("weight_loss")).toBe(45);
      expect(getRestTimeForGoal("endurance")).toBe(30);
    });

    test("should return default rest time for unknown goal", () => {
      expect(getRestTimeForGoal("unknown")).toBe(60);
    });
  });

  describe("selectExercisesForDay", () => {
    test("should select appropriate exercises for a user with FULL equipment", () => {
      const userEquipment = [
        "barbell",
        "dumbbell",
        "machine",
        "cable",
        "kettlebell",
      ];

      const exercises = selectExercisesForDay(
        "חזה",
        userEquipment,
        "intermediate",
        TEST_CONSTANTS.DURATION.NORMAL,
        mockMetadata
      );

      expect(exercises.length).toBeGreaterThanOrEqual(
        TEST_CONSTANTS.EXERCISE_LIMITS.MIN
      );
      expect(exercises.length).toBeLessThanOrEqual(
        TEST_CONSTANTS.EXERCISE_LIMITS.MAX
      );

      exercises.forEach(validateExercise);
    });

    test("should select exercises with substitutions for PARTIAL equipment", () => {
      const userEquipment = ["dumbbell", "resistance_bands"];

      const exercises = selectExercisesForDay(
        "גב",
        userEquipment,
        "intermediate",
        TEST_CONSTANTS.DURATION.NORMAL,
        mockMetadata
      );

      expect(exercises.length).toBeGreaterThanOrEqual(
        TEST_CONSTANTS.EXERCISE_LIMITS.MIN
      );
      expect(exercises.length).toBeLessThanOrEqual(
        TEST_CONSTANTS.EXERCISE_LIMITS.MAX
      );

      exercises.forEach(validateExercise);
    });

    test("should select bodyweight exercises for NO equipment", () => {
      const userEquipment: string[] = [];

      const exercises = selectExercisesForDay(
        "רגליים",
        userEquipment,
        "intermediate",
        TEST_CONSTANTS.DURATION.NORMAL,
        mockMetadata
      );

      expect(exercises.length).toBeGreaterThan(0);
      exercises.forEach(validateExercise);
    });

    test("should handle invalid muscle group gracefully", () => {
      const userEquipment = ["dumbbell"];

      const exercises = selectExercisesForDay(
        "invalid_muscle_group",
        userEquipment,
        "intermediate",
        TEST_CONSTANTS.DURATION.NORMAL,
        mockMetadata
      );

      expect(exercises.length).toBeGreaterThan(0);
      exercises.forEach(validateExercise);
    });

    test("should adjust exercise count based on duration", () => {
      const userEquipment = ["dumbbell", "barbell"];

      const shortExercises = selectExercisesForDay(
        "חזה",
        userEquipment,
        "intermediate",
        TEST_CONSTANTS.DURATION.SHORT,
        mockMetadata
      );

      const longExercises = selectExercisesForDay(
        "חזה",
        userEquipment,
        "intermediate",
        TEST_CONSTANTS.DURATION.LONG,
        mockMetadata
      );

      expect(shortExercises.length).toBeGreaterThan(0);
      expect(longExercises.length).toBeGreaterThanOrEqual(
        shortExercises.length
      );

      shortExercises.forEach(validateExercise);
      longExercises.forEach(validateExercise);
    });

    test("should adapt sets count to experience level", () => {
      const userEquipment = ["dumbbell"];

      TEST_CONSTANTS.EXPERIENCE_LEVELS.forEach((experience) => {
        const exercises = selectExercisesForDay(
          "חזה",
          userEquipment,
          experience,
          TEST_CONSTANTS.DURATION.NORMAL,
          mockMetadata
        );

        expect(exercises.length).toBeGreaterThan(0);

        // Verify sets count matches experience level
        const expectedSets = getSetsForExperience(experience);
        exercises.forEach((exercise) => {
          expect(exercise.sets).toBe(expectedSets);
        });
      });
    });

    test("should return appropriate data for different muscle groups", () => {
      const userEquipment = ["dumbbell", "bodyweight"];

      TEST_CONSTANTS.MUSCLE_GROUPS.forEach((muscleGroup) => {
        const exercises = selectExercisesForDay(
          muscleGroup,
          userEquipment,
          "intermediate",
          TEST_CONSTANTS.DURATION.NORMAL,
          mockMetadata
        );

        expect(exercises.length).toBeGreaterThan(0);
        exercises.forEach(validateExercise);
      });
    });
  });

  describe("getMuscleGroupsForDay", () => {
    test("should return muscle groups for valid day", () => {
      const muscleGroups = getMuscleGroupsForDay("day1");

      expect(Array.isArray(muscleGroups)).toBe(true);
      expect(muscleGroups.length).toBeGreaterThan(0);
    });

    test("should handle invalid day", () => {
      const muscleGroups = getMuscleGroupsForDay("invalid_day");

      expect(Array.isArray(muscleGroups)).toBe(true);
      // Should return empty array or default muscle groups
    });
  });

  describe("getSetsForExperience", () => {
    test("should return correct sets for each experience level", () => {
      const beginnerSets = getSetsForExperience("beginner");
      const intermediateSets = getSetsForExperience("intermediate");
      const advancedSets = getSetsForExperience("advanced");

      expect(beginnerSets).toBeGreaterThan(0);
      expect(intermediateSets).toBeGreaterThan(0);
      expect(advancedSets).toBeGreaterThan(0);

      // Advanced should have most sets, beginner should have least
      expect(advancedSets).toBeGreaterThanOrEqual(intermediateSets);
      expect(intermediateSets).toBeGreaterThanOrEqual(beginnerSets);
    });

    test("should handle invalid experience level", () => {
      const sets = getSetsForExperience("invalid" as any);

      expect(sets).toBeGreaterThan(0);
      // Should return default value
    });
  });

  describe("getRepsForGoal", () => {
    test("should return appropriate reps for strength goal", () => {
      const reps = getRepsForGoal("strength");

      expect(reps).toMatch(/^\d+(-\d+)?$/); // Should be number or range like "5-8"
    });

    test("should return appropriate reps for muscle building goal", () => {
      const reps = getRepsForGoal("muscle_building");

      expect(reps).toMatch(/^\d+(-\d+)?$/);
    });

    test("should return appropriate reps for endurance goal", () => {
      const reps = getRepsForGoal("endurance");

      expect(reps).toMatch(/^\d+(-\d+)?$/);
    });

    test("should handle invalid goal", () => {
      const reps = getRepsForGoal("invalid" as any);

      expect(reps).toMatch(/^\d+(-\d+)?$/);
      // Should return default reps
    });
  });

  describe("getRestTimeForGoal", () => {
    test("should return appropriate rest time for strength goal", () => {
      const restTime = getRestTimeForGoal("strength");

      expect(restTime).toBeGreaterThan(0);
      expect(restTime).toBeLessThanOrEqual(300); // Max 5 minutes
    });

    test("should return appropriate rest time for muscle building goal", () => {
      const restTime = getRestTimeForGoal("muscle_building");

      expect(restTime).toBeGreaterThan(0);
      expect(restTime).toBeLessThanOrEqual(300);
    });

    test("should return appropriate rest time for endurance goal", () => {
      const restTime = getRestTimeForGoal("endurance");

      expect(restTime).toBeGreaterThan(0);
      expect(restTime).toBeLessThanOrEqual(300);
    });

    test("should handle invalid goal", () => {
      const restTime = getRestTimeForGoal("invalid" as any);

      expect(restTime).toBeGreaterThan(0);
      // Should return default rest time
    });
  });
});
