/**
 * @file src/services/workout/personalRecordService.ts
 * @description Service for detecting and managing personal records.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  WorkoutData,
  PersonalRecord,
  PreviousPerformance,
} from "../../screens/workout/types/workout.types";
import {
  adaptExerciseNameToGender,
  UserGender,
} from "../../utils/genderAdaptation";

const PREVIOUS_PERFORMANCES_KEY = "previous_performances";

class PersonalRecordService {
  /**
   * Detect new personal records from a workout.
   */
  async detectPersonalRecords(workout: WorkoutData): Promise<PersonalRecord[]> {
    try {
      const existingPerformances = await this.getPreviousPerformances();
      const newRecords: PersonalRecord[] = [];

      for (const exercise of workout.exercises) {
        const completedSets = exercise.sets.filter((set) => set.completed);
        if (completedSets.length === 0) continue;

        const existingPerf = existingPerformances.find(
          (p) => p.exerciseName === exercise.name
        );
        if (!existingPerf) {
          // First time doing this exercise, everything is a record!
          const maxWeight = Math.max(
            ...completedSets.map((s) => s.actualWeight || 0)
          );
          if (maxWeight > 0) {
            newRecords.push({
              exerciseName: exercise.name,
              type: "weight",
              value: maxWeight,
              previousValue: 0,
              date: new Date().toISOString(),
              improvement: maxWeight,
            });
          }
          // ... similar logic for reps and volume
          continue;
        }

        // Check for new records against existing ones
        const currentMaxWeight = Math.max(
          ...completedSets.map((s) => s.actualWeight || 0)
        );
        if (currentMaxWeight > existingPerf.personalRecords.maxWeight) {
          newRecords.push({
            exerciseName: exercise.name,
            type: "weight",
            value: currentMaxWeight,
            previousValue: existingPerf.personalRecords.maxWeight,
            date: new Date().toISOString(),
            improvement:
              currentMaxWeight - existingPerf.personalRecords.maxWeight,
          });
        }
        // ... similar logic for reps and volume
      }

      return newRecords;
    } catch (error) {
      console.error("Error detecting personal records:", error);
      return [];
    }
  }

  /**
   * Save the performances from a workout for future comparison.
   */
  async savePreviousPerformances(
    workout: WorkoutData,
    userGender?: UserGender
  ): Promise<void> {
    try {
      const existingPerformances = await this.getPreviousPerformances();
      const performances: PreviousPerformance[] = workout.exercises.map(
        (exercise) => {
          const completedSets = exercise.sets.filter((set) => set.completed);
          const setsData = completedSets.map((set) => ({
            weight: set.actualWeight || set.targetWeight || 0,
            reps: set.actualReps || set.targetReps || 0,
          }));

          const adaptedExerciseName = adaptExerciseNameToGender(
            exercise.name,
            userGender
          );

          return {
            exerciseName: adaptedExerciseName,
            sets: setsData,
            date: new Date().toISOString(),
            personalRecords: {
              maxWeight: Math.max(...setsData.map((s) => s.weight), 0),
              maxReps: Math.max(...setsData.map((s) => s.reps), 0),
              maxVolume: Math.max(...setsData.map((s) => s.weight * s.reps), 0),
              totalVolume: setsData.reduce(
                (sum, s) => sum + s.weight * s.reps,
                0
              ),
            },
          };
        }
      );

      const updatedPerformances = [...existingPerformances];
      performances.forEach((newPerf) => {
        const existingIndex = updatedPerformances.findIndex(
          (perf) => perf.exerciseName === newPerf.exerciseName
        );
        if (existingIndex >= 0) {
          updatedPerformances[existingIndex] = newPerf;
        } else {
          updatedPerformances.push(newPerf);
        }
      });

      await AsyncStorage.setItem(
        PREVIOUS_PERFORMANCES_KEY,
        JSON.stringify(updatedPerformances)
      );
    } catch (error) {
      console.error("Error saving previous performances:", error);
    }
  }

  /**
   * Get previous performance for a specific exercise.
   */
  async getPreviousPerformanceForExercise(
    exerciseName: string
  ): Promise<PreviousPerformance | null> {
    try {
      const performances = await this.getPreviousPerformances();
      return (
        performances.find((perf) => perf.exerciseName === exerciseName) || null
      );
    } catch (error) {
      console.error("Error getting previous performance:", error);
      return null;
    }
  }

  /**
   * Get all previous performances from local storage.
   */
  private async getPreviousPerformances(): Promise<PreviousPerformance[]> {
    try {
      const performancesJson = await AsyncStorage.getItem(
        PREVIOUS_PERFORMANCES_KEY
      );
      return performancesJson ? JSON.parse(performancesJson) : [];
    } catch (error) {
      console.error("Error loading previous performances:", error);
      return [];
    }
  }

  /**
   * Clear all previous performance data.
   */
  async clearPreviousPerformances(): Promise<void> {
    try {
      await AsyncStorage.removeItem(PREVIOUS_PERFORMANCES_KEY);
    } catch (error) {
      console.error("Error clearing previous performances:", error);
    }
  }
}

export const personalRecordService = new PersonalRecordService();
