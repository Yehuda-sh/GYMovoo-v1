import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "../../../utils/logger";
import type {
  WorkoutData,
  WorkoutExercise,
  Set,
  PreviousPerformance,
} from "../../../core/types/workout.types";
import type { PersonalRecord } from "../../../core/types/user.types";

// Extended PersonalRecord for internal use (with tracking improvements)
interface ExtendedPersonalRecord extends PersonalRecord {
  previousValue: number;
  improvement: number;
}

// PersonalRecords type based on PreviousPerformance.personalRecords
type PersonalRecords = PreviousPerformance["personalRecords"];

const STORED_PERSONAL_RECORDS_KEY = "stored_personal_records";
const PREVIOUS_PERFORMANCES_KEY = "previous_performances";

class PersonalRecordService {
  async detectPersonalRecords(
    workout: WorkoutData
  ): Promise<ExtendedPersonalRecord[]> {
    try {
      const existingPerformances = await this.getPreviousPerformances();
      const records: ExtendedPersonalRecord[] = [];

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
  ): Promise<ExtendedPersonalRecord[]> {
    try {
      const completedSets = (exercise.sets || []).filter(
        (set: Set) => set.completed
      );
      if (completedSets.length === 0) return [];

      const records: ExtendedPersonalRecord[] = [];
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
          unit: "kg",
          date: new Date().toISOString(),
          previousValue: existingPerf.personalRecords.maxWeight,
          improvement:
            currentMaxWeight - existingPerf.personalRecords.maxWeight,
        } as ExtendedPersonalRecord);
      }

      if (currentMaxReps > existingPerf.personalRecords.maxReps) {
        records.push({
          exerciseName: exercise.name,
          type: "reps",
          value: currentMaxReps,
          unit: "reps",
          date: new Date().toISOString(),
          previousValue: existingPerf.personalRecords.maxReps,
          improvement: currentMaxReps - existingPerf.personalRecords.maxReps,
        } as ExtendedPersonalRecord);
      }

      if (currentMaxVolume > existingPerf.personalRecords.maxVolume) {
        records.push({
          exerciseName: exercise.name,
          type: "volume",
          value: currentMaxVolume,
          unit: "kg×reps",
          date: new Date().toISOString(),
          previousValue: existingPerf.personalRecords.maxVolume,
          improvement:
            currentMaxVolume - existingPerf.personalRecords.maxVolume,
        } as ExtendedPersonalRecord);
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
  ): ExtendedPersonalRecord[] {
    const records: ExtendedPersonalRecord[] = [];

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
          unit: "kg",
          date: new Date().toISOString(),
          previousValue: 0,
          improvement: maxWeight,
        } as ExtendedPersonalRecord);
      }

      if (maxReps > 0) {
        records.push({
          exerciseName: exercise.name,
          type: "reps",
          value: maxReps,
          unit: "reps",
          date: new Date().toISOString(),
          previousValue: 0,
          improvement: maxReps,
        } as ExtendedPersonalRecord);
      }

      if (maxVolume > 0) {
        records.push({
          exerciseName: exercise.name,
          type: "volume",
          value: maxVolume,
          unit: "kg×reps",
          date: new Date().toISOString(),
          previousValue: 0,
          improvement: maxVolume,
        } as ExtendedPersonalRecord);
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
