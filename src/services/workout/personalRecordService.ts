import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "../../utils/logger";
import type {
  WorkoutData,
  WorkoutExercise,
  Set,
  PersonalRecord,
  PreviousPerformance,
} from "../../screens/workout/types/workout.types";

// PersonalRecords type based on PreviousPerformance.personalRecords
type PersonalRecords = PreviousPerformance["personalRecords"];

const STORED_PERSONAL_RECORDS_KEY = "stored_personal_records";
const PREVIOUS_PERFORMANCES_KEY = "previous_performances";

class PersonalRecordService {
  async detectPersonalRecords(workout: WorkoutData): Promise<PersonalRecord[]> {
    try {
      const existingPerformances = await this.getPreviousPerformances();
      const records: PersonalRecord[] = [];

      for (const exercise of workout.exercises) {
        const completedSets = (exercise.sets || []).filter(
          (set: Set) => set.completed
        );
        if (completedSets.length === 0) continue;

        const exerciseRecords = await this.detectExerciseRecords(
          exercise,
          existingPerformances
        );
        records.push(...exerciseRecords);
      }

      return records;
    } catch (error) {
      logger.error(
        "PersonalRecordService",
        "Error detecting personal records",
        { error }
      );
      return [];
    }
  }

  private async detectExerciseRecords(
    exercise: WorkoutExercise,
    existingPerformances: PreviousPerformance[]
  ): Promise<PersonalRecord[]> {
    try {
      const completedSets = (exercise.sets || []).filter(
        (set: Set) => set.completed
      );
      if (completedSets.length === 0) return [];

      const records: PersonalRecord[] = [];
      const existingPerf = existingPerformances.find(
        (p) => p.exerciseName === exercise.name
      );

      if (!existingPerf) {
        return this.createFirstTimeRecords(exercise, completedSets);
      }

      const currentMaxWeight = Math.max(
        ...completedSets.map((s: Set) => s.actualWeight || 0)
      );
      const currentMaxReps = Math.max(
        ...completedSets.map((s: Set) => s.actualReps || 0)
      );
      const currentMaxVolume = Math.max(
        ...completedSets.map(
          (s: Set) => (s.actualWeight || 0) * (s.actualReps || 0)
        )
      );

      if (currentMaxWeight > existingPerf.personalRecords.maxWeight) {
        records.push({
          exerciseName: exercise.name,
          type: "weight",
          value: currentMaxWeight,
          previousValue: existingPerf.personalRecords.maxWeight,
          date: new Date().toISOString(),
          improvement:
            currentMaxWeight - existingPerf.personalRecords.maxWeight,
        });
      }

      if (currentMaxReps > existingPerf.personalRecords.maxReps) {
        records.push({
          exerciseName: exercise.name,
          type: "reps",
          value: currentMaxReps,
          previousValue: existingPerf.personalRecords.maxReps,
          date: new Date().toISOString(),
          improvement: currentMaxReps - existingPerf.personalRecords.maxReps,
        });
      }

      if (currentMaxVolume > existingPerf.personalRecords.maxVolume) {
        records.push({
          exerciseName: exercise.name,
          type: "volume",
          value: currentMaxVolume,
          previousValue: existingPerf.personalRecords.maxVolume,
          date: new Date().toISOString(),
          improvement:
            currentMaxVolume - existingPerf.personalRecords.maxVolume,
        });
      }

      return records;
    } catch (error) {
      logger.error(
        "PersonalRecordService",
        "Error detecting exercise records",
        {
          exerciseName: exercise.name,
          error,
        }
      );
      return [];
    }
  }

  private createFirstTimeRecords(
    exercise: WorkoutExercise,
    completedSets: Set[]
  ): PersonalRecord[] {
    const records: PersonalRecord[] = [];

    try {
      const maxWeight = Math.max(
        ...completedSets.map((s: Set) => s.actualWeight || 0)
      );
      const maxReps = Math.max(
        ...completedSets.map((s: Set) => s.actualReps || 0)
      );
      const maxVolume = Math.max(
        ...completedSets.map(
          (s: Set) => (s.actualWeight || 0) * (s.actualReps || 0)
        )
      );

      if (maxWeight > 0) {
        records.push({
          exerciseName: exercise.name,
          type: "weight",
          value: maxWeight,
          previousValue: 0,
          date: new Date().toISOString(),
          improvement: maxWeight,
        });
      }

      if (maxReps > 0) {
        records.push({
          exerciseName: exercise.name,
          type: "reps",
          value: maxReps,
          previousValue: 0,
          date: new Date().toISOString(),
          improvement: maxReps,
        });
      }

      if (maxVolume > 0) {
        records.push({
          exerciseName: exercise.name,
          type: "volume",
          value: maxVolume,
          previousValue: 0,
          date: new Date().toISOString(),
          improvement: maxVolume,
        });
      }
    } catch (error) {
      logger.error(
        "PersonalRecordService",
        "Error creating first-time records",
        {
          exerciseName: exercise.name,
          error,
        }
      );
    }

    return records;
  }

  async savePersonalRecord(record: PersonalRecord): Promise<void> {
    try {
      const existingRecords = await this.getStoredRecords();
      const updatedRecords = [...existingRecords, record];

      await AsyncStorage.setItem(
        STORED_PERSONAL_RECORDS_KEY,
        JSON.stringify(updatedRecords)
      );

      logger.info("PersonalRecordService", "Personal record saved", {
        exerciseName: record.exerciseName,
        type: record.type,
        value: record.value,
      });
    } catch (error) {
      logger.error("PersonalRecordService", "Error saving personal record", {
        record,
        error,
      });
    }
  }

  async getPersonalRecords(exerciseName?: string): Promise<PersonalRecord[]> {
    try {
      const records = await this.getStoredRecords();

      if (exerciseName) {
        return records.filter((record) => record.exerciseName === exerciseName);
      }

      return records;
    } catch (error) {
      logger.error("PersonalRecordService", "Error getting personal records", {
        exerciseName,
        error,
      });
      return [];
    }
  }

  async updatePerformanceRecord(
    exerciseName: string,
    newRecord: Partial<PersonalRecords>
  ): Promise<void> {
    try {
      const existingPerformances = await this.getPreviousPerformances();
      const existingIndex = existingPerformances.findIndex(
        (p) => p.exerciseName === exerciseName
      );

      if (existingIndex >= 0) {
        const existing = existingPerformances[existingIndex];
        if (existing && existing.personalRecords) {
          existing.personalRecords = {
            ...existing.personalRecords,
            ...newRecord,
          };
        }
      } else {
        existingPerformances.push({
          exerciseName,
          sets: [],
          date: new Date().toISOString(),
          personalRecords: {
            maxWeight: newRecord.maxWeight || 0,
            maxReps: newRecord.maxReps || 0,
            maxVolume: newRecord.maxVolume || 0,
            totalVolume: newRecord.totalVolume || 0,
          },
        });
      }

      await AsyncStorage.setItem(
        PREVIOUS_PERFORMANCES_KEY,
        JSON.stringify(existingPerformances)
      );

      logger.info("PersonalRecordService", "Performance record updated", {
        exerciseName,
        newRecord,
      });
    } catch (error) {
      logger.error(
        "PersonalRecordService",
        "Error updating performance record",
        {
          exerciseName,
          newRecord,
          error,
        }
      );
    }
  }

  private async getStoredRecords(): Promise<PersonalRecord[]> {
    try {
      const stored = await AsyncStorage.getItem(STORED_PERSONAL_RECORDS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      logger.error("PersonalRecordService", "Error getting stored records", {
        error,
      });
      return [];
    }
  }

  private async getPreviousPerformances(): Promise<PreviousPerformance[]> {
    try {
      const stored = await AsyncStorage.getItem(PREVIOUS_PERFORMANCES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      logger.error(
        "PersonalRecordService",
        "Error getting previous performances",
        { error }
      );
      return [];
    }
  }
}

export default new PersonalRecordService();
