/**
 * @file src/services/workoutHistoryService.ts
 * @description שירות לניהול היסטוריית אימונים עם משוב
 * English: Workout history service with feedback management
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkoutData } from "../screens/workout/types/workout.types";

// טיפוס לאימון עם משוב
export interface WorkoutWithFeedback {
  id: string;
  workout: WorkoutData;
  feedback: {
    difficulty: number; // 1-5 stars
    feeling: string; // emoji value
    readyForMore: boolean | null;
    completedAt: string; // ISO string
  };
  stats: {
    duration: number;
    totalSets: number;
    totalPlannedSets: number;
    totalVolume: number;
    personalRecords: number;
  };
}

// טיפוס לביצועים קודמים (לתצוגה באימון הבא)
export interface PreviousPerformance {
  exerciseName: string;
  sets: Array<{
    weight: number;
    reps: number;
  }>;
  date: string;
  // שיאים אישיים
  personalRecords: {
    maxWeight: number; // המשקל הגבוה ביותר שנרשם
    maxVolume: number; // הנפח הגבוה ביותר (משקל × חזרות) בסט יחיד
    maxReps: number; // מספר החזרות הגבוה ביותר
    totalVolume: number; // הנפח הכולל של התרגיל באימון זה
  };
}

// טיפוס לשיא אישי
export interface PersonalRecord {
  exerciseName: string;
  type: "weight" | "volume" | "reps"; // סוג השיא
  value: number;
  previousValue: number;
  date: string;
  improvement: number; // שיפור באחוזים או בערך מוחלט
}

const WORKOUT_HISTORY_KEY = "workout_history";
const PREVIOUS_PERFORMANCES_KEY = "previous_performances";

class WorkoutHistoryService {
  /**
   * שמירת אימון עם משוב להיסטוריה
   */
  async saveWorkoutWithFeedback(
    workoutWithFeedback: Omit<WorkoutWithFeedback, "id">
  ): Promise<void> {
    try {
      const id = Date.now().toString();
      const fullWorkout: WorkoutWithFeedback = {
        id,
        ...workoutWithFeedback,
      };

      // קבלת היסטוריה קיימת
      const existingHistory = await this.getWorkoutHistory();

      // הוספת האימון החדש
      const updatedHistory = [fullWorkout, ...existingHistory];

      // שמירה
      await AsyncStorage.setItem(
        WORKOUT_HISTORY_KEY,
        JSON.stringify(updatedHistory)
      );

      // שמירת ביצועים לעיון באימון הבא
      await this.savePreviousPerformances(workoutWithFeedback.workout);

      console.log("Workout saved to history successfully");
    } catch (error) {
      console.error("Error saving workout to history:", error);
      throw error;
    }
  }

  /**
   * זיהוי שיאים חדשים באימון הנוכחי
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
          // אם זה התרגיל הראשון מהסוג הזה, הכל שיא!
          const maxWeight = Math.max(
            ...completedSets.map((s) => s.actualWeight || 0)
          );
          const maxReps = Math.max(
            ...completedSets.map((s) => s.actualReps || 0)
          );
          const maxVolume = Math.max(
            ...completedSets.map(
              (s) => (s.actualWeight || 0) * (s.actualReps || 0)
            )
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

          if (maxVolume > 0) {
            newRecords.push({
              exerciseName: exercise.name,
              type: "volume",
              value: maxVolume,
              previousValue: 0,
              date: new Date().toISOString(),
              improvement: maxVolume,
            });
          }
          continue;
        }

        // בדיקת שיא משקל
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

        // בדיקת שיא נפח (בסט יחיד)
        const currentMaxVolume = Math.max(
          ...completedSets.map(
            (s) => (s.actualWeight || 0) * (s.actualReps || 0)
          )
        );
        if (currentMaxVolume > existingPerf.personalRecords.maxVolume) {
          newRecords.push({
            exerciseName: exercise.name,
            type: "volume",
            value: currentMaxVolume,
            previousValue: existingPerf.personalRecords.maxVolume,
            date: new Date().toISOString(),
            improvement:
              currentMaxVolume - existingPerf.personalRecords.maxVolume,
          });
        }

        // בדיקת שיא חזרות
        const currentMaxReps = Math.max(
          ...completedSets.map((s) => s.actualReps || 0)
        );
        if (currentMaxReps > existingPerf.personalRecords.maxReps) {
          newRecords.push({
            exerciseName: exercise.name,
            type: "reps",
            value: currentMaxReps,
            previousValue: existingPerf.personalRecords.maxReps,
            date: new Date().toISOString(),
            improvement: currentMaxReps - existingPerf.personalRecords.maxReps,
          });
        }
      }

      return newRecords;
    } catch (error) {
      console.error("Error detecting personal records:", error);
      return [];
    }
  }

  /**
   * קבלת כל היסטוריית האימונים
   */
  async getWorkoutHistory(): Promise<WorkoutWithFeedback[]> {
    try {
      const historyJson = await AsyncStorage.getItem(WORKOUT_HISTORY_KEY);
      if (!historyJson) return [];

      return JSON.parse(historyJson);
    } catch (error) {
      console.error("Error loading workout history:", error);
      return [];
    }
  }

  /**
   * שמירת ביצועים קודמים לשימוש באימון הבא
   */
  private async savePreviousPerformances(workout: WorkoutData): Promise<void> {
    try {
      const existingPerformances = await this.getPreviousPerformances();

      const performances: PreviousPerformance[] = workout.exercises.map(
        (exercise) => {
          const completedSets = exercise.sets.filter((set) => set.completed);
          const setsData = completedSets.map((set) => ({
            weight: set.actualWeight || set.targetWeight || 0,
            reps: set.actualReps || set.targetReps || 0,
          }));

          // חישוב שיאים אישיים לתרגיל זה
          const maxWeight = Math.max(...setsData.map((s) => s.weight), 0);
          const maxReps = Math.max(...setsData.map((s) => s.reps), 0);
          const maxVolume = Math.max(
            ...setsData.map((s) => s.weight * s.reps),
            0
          );
          const totalVolume = setsData.reduce(
            (sum, s) => sum + s.weight * s.reps,
            0
          );

          // חישוב שיפור לעומת ביצועים קודמים
          const existingPerf = existingPerformances.find(
            (p) => p.exerciseName === exercise.name
          );
          const previousMaxWeight =
            existingPerf?.personalRecords.maxWeight || 0;
          const previousMaxVolume =
            existingPerf?.personalRecords.maxVolume || 0;
          const previousMaxReps = existingPerf?.personalRecords.maxReps || 0;

          return {
            exerciseName: exercise.name,
            sets: setsData,
            date: new Date().toISOString(),
            personalRecords: {
              maxWeight,
              maxVolume,
              maxReps,
              totalVolume,
            },
          };
        }
      );

      // מיזוג עם קיימים (שמירה רק על הביצועים האחרונים לכל תרגיל)
      const updatedPerformances = [...existingPerformances];

      performances.forEach((newPerf) => {
        const existingIndex = updatedPerformances.findIndex(
          (perf) => perf.exerciseName === newPerf.exerciseName
        );

        if (existingIndex >= 0) {
          updatedPerformances[existingIndex] = newPerf; // עדכון
        } else {
          updatedPerformances.push(newPerf); // הוספה
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
   * קבלת ביצועים קודמים לתרגיל מסוים
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
   * קבלת כל הביצועים הקודמים
   */
  private async getPreviousPerformances(): Promise<PreviousPerformance[]> {
    try {
      const performancesJson = await AsyncStorage.getItem(
        PREVIOUS_PERFORMANCES_KEY
      );
      if (!performancesJson) return [];

      return JSON.parse(performancesJson);
    } catch (error) {
      console.error("Error loading previous performances:", error);
      return [];
    }
  }

  /**
   * מחיקת כל ההיסטוריה (לטסטים או איפוס)
   */
  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(WORKOUT_HISTORY_KEY);
      await AsyncStorage.removeItem(PREVIOUS_PERFORMANCES_KEY);
      console.log("Workout history cleared");
    } catch (error) {
      console.error("Error clearing workout history:", error);
      throw error;
    }
  }

  /**
   * קבלת סטטיסטיקות כלליות
   */
  async getWorkoutStatistics(): Promise<{
    totalWorkouts: number;
    totalDuration: number;
    averageDifficulty: number;
    workoutStreak: number;
  }> {
    try {
      const history = await this.getWorkoutHistory();

      if (history.length === 0) {
        return {
          totalWorkouts: 0,
          totalDuration: 0,
          averageDifficulty: 0,
          workoutStreak: 0,
        };
      }

      const totalDuration = history.reduce(
        (sum, workout) => sum + workout.stats.duration,
        0
      );
      const averageDifficulty =
        history.reduce((sum, workout) => sum + workout.feedback.difficulty, 0) /
        history.length;

      // חישוב רצף אימונים (כמה ימים ברצף)
      const workoutStreak = this.calculateWorkoutStreak(history);

      return {
        totalWorkouts: history.length,
        totalDuration,
        averageDifficulty,
        workoutStreak,
      };
    } catch (error) {
      console.error("Error calculating workout statistics:", error);
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        averageDifficulty: 0,
        workoutStreak: 0,
      };
    }
  }

  /**
   * חישוב רצף אימונים (כמה ימים ברצף יש אימונים)
   */
  private calculateWorkoutStreak(history: WorkoutWithFeedback[]): number {
    if (history.length === 0) return 0;

    // מיון לפי תאריך (החדש ביותר ראשון)
    const sortedHistory = history.sort(
      (a, b) =>
        new Date(b.feedback.completedAt).getTime() -
        new Date(a.feedback.completedAt).getTime()
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const workout of sortedHistory) {
      const workoutDate = new Date(workout.feedback.completedAt);
      workoutDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }
}

export const workoutHistoryService = new WorkoutHistoryService();
