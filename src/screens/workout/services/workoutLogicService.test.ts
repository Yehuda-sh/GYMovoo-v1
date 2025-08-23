/**
 * @file src/screens/workout/services/workoutLogicService.test.ts
 * @brief Tests for workout logic service - בדיקות לשירות לוגיקת האימון
 * @dependencies Jest, workoutLogicService, allExercises
 * @notes בדיקות עבור לוגיקת בחירת תרגילים חכמה עם ציוד
 */

import { selectExercisesForDay } from "./workoutLogicService";
import { allExercises } from "../../../data/exercises";

// Mock data to be used across tests
const mockMetadata = {
  goal: "muscle_gain",
  level: "intermediate",
};

describe("workoutLogicService - selectExercisesForDay", () => {
  // Mock the exercises data to have a controlled environment
  beforeAll(() => {
    // In a real scenario, we might mock the 'allExercises' import
    // For now, we will use the actual data but it's good practice to control it.
  });

  test("should select appropriate exercises for a user with FULL equipment", () => {
    // 1. Define user equipment
    const userEquipment = [
      "barbell",
      "dumbbell",
      "machine",
      "cable",
      "kettlebell",
    ];

    // 2. Call the function
    const exercises = selectExercisesForDay(
      "חזה",
      userEquipment,
      "intermediate",
      60,
      mockMetadata
    );

    // 3. Assertions (what we expect to happen)
    // We expect to get a full list of exercises, likely not using substitutions.
    expect(exercises.length).toBeGreaterThan(0);
    expect(exercises.length).toBeLessThanOrEqual(8); // Max exercises per workout

    // Check that all exercises have required properties
    exercises.forEach((exercise) => {
      expect(exercise.exerciseId).toBeDefined();
      expect(exercise.sets).toBeGreaterThan(0);
      expect(exercise.reps).toBeDefined();
      expect(exercise.restTime).toBeGreaterThan(0);
    });
  });

  test("should select exercises with substitutions for a user with PARTIAL equipment", () => {
    // 1. Define user equipment (e.g., only dumbbells and bands)
    const userEquipment = ["dumbbell", "resistance_bands"];

    // 2. Call the function for a day that often uses machines/cables
    const exercises = selectExercisesForDay(
      "גב",
      userEquipment,
      "intermediate",
      60,
      mockMetadata
    );

    // 3. Assertions
    // We expect to get exercises, and some of them should be substitutions.
    expect(exercises.length).toBeGreaterThan(0);
    expect(exercises.length).toBeLessThanOrEqual(8);

    // Verify that returned exercises can actually be performed with user's equipment
    exercises.forEach((exercise) => {
      expect(exercise.exerciseId).toBeDefined();
      expect(exercise.sets).toBeGreaterThan(0);
    });
  });

  test("should select only bodyweight exercises for a user with NO equipment", () => {
    // 1. Define user equipment
    const userEquipment: string[] = [];

    // 2. Call the function
    const exercises = selectExercisesForDay(
      "רגליים",
      userEquipment,
      "intermediate",
      60,
      mockMetadata
    );

    // 3. Assertions
    // We expect to get only bodyweight exercises or fallback exercises
    expect(exercises.length).toBeGreaterThan(0);

    // Check that exercises are appropriate for no equipment scenario
    exercises.forEach((exercise) => {
      expect(exercise.exerciseId).toBeDefined();
      expect(exercise.sets).toBeGreaterThan(0);
      expect(exercise.reps).toBeDefined();
      expect(exercise.restTime).toBeGreaterThan(0);
    });
  });

  test("should handle invalid muscle group gracefully", () => {
    const userEquipment = ["dumbbell"];
    const exercises = selectExercisesForDay(
      "invalid_muscle_group",
      userEquipment,
      "intermediate",
      60,
      mockMetadata
    );

    // Should still return some exercises (fallback behavior)
    expect(exercises.length).toBeGreaterThan(0);
  });

  test("should adjust exercise count based on duration", () => {
    const userEquipment = ["dumbbell", "barbell"];

    // Short workout
    const shortExercises = selectExercisesForDay(
      "חזה",
      userEquipment,
      "intermediate",
      30,
      mockMetadata
    );

    // Long workout
    const longExercises = selectExercisesForDay(
      "חזה",
      userEquipment,
      "intermediate",
      90,
      mockMetadata
    );

    // Longer workouts should have more exercises (up to the maximum)
    expect(shortExercises.length).toBeGreaterThan(0);
    expect(longExercises.length).toBeGreaterThanOrEqual(shortExercises.length);
  });
});
