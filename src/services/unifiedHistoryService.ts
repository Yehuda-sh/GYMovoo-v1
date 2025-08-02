/**
 * @file src/services/unifiedHistoryService.ts
 * @description שירות מאוחד לניהול היסטוריית אימונים שעובד עם דמו ונתונים אמיתיים
 * @author GYMovoo Development Team
 * @created 2025-08-02
 *
 * @features
 * - איחוד נתוני דמו עם היסטוריה אמיתית
 * - שמירת היסטוריית תרגילים לגרפים
 * - חישוב מגמות והתקדמות
 * - תמיכה בחזרות ומשקלים לכל תרגיל
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  workoutHistoryService,
  PreviousPerformance,
} from "./workoutHistoryService";
import { realisticDemoService } from "./realisticDemoService";

export interface ExerciseHistoryEntry {
  date: string;
  sets: {
    reps: number;
    weight: number;
    volume: number; // reps * weight
  }[];
  bestSet: {
    reps: number;
    weight: number;
    volume: number;
  };
}

export interface ExerciseProgressData {
  exerciseName: string;
  history: ExerciseHistoryEntry[];
  trend: "improving" | "stable" | "declining" | "new";
  personalRecords: {
    maxWeight: number;
    maxReps: number;
    maxVolume: number;
  };
  averageProgression: {
    weightPerWeek: number;
    repsPerWeek: number;
    volumePerWeek: number;
  };
}

class UnifiedHistoryService {
  private readonly UNIFIED_HISTORY_KEY = "unified_exercise_history";

  /**
   * שמירת אימון להיסטוריה המאוחדת
   */
  async saveWorkoutToUnifiedHistory(workoutData: {
    date: string;
    exercises: {
      name: string;
      sets: { reps: number; weight: number; completed: boolean }[];
    }[];
  }): Promise<void> {
    try {
      // קבלת היסטוריה קיימת
      const existingHistory = await this.getUnifiedHistory();

      // עיבוד התרגילים מהאימון החדש
      for (const exercise of workoutData.exercises) {
        const completedSets = exercise.sets.filter((set) => set.completed);
        if (completedSets.length === 0) continue;

        // חישוב הסט הטוב ביותר
        const bestSet = completedSets.reduce((best, current) => {
          const currentVolume = current.reps * current.weight;
          const bestVolume = best.reps * best.weight;
          return currentVolume > bestVolume ? current : best;
        });

        // יצירת רשומת היסטוריה
        const historyEntry: ExerciseHistoryEntry = {
          date: workoutData.date,
          sets: completedSets.map((set) => ({
            reps: set.reps,
            weight: set.weight,
            volume: set.reps * set.weight,
          })),
          bestSet: {
            reps: bestSet.reps,
            weight: bestSet.weight,
            volume: bestSet.reps * bestSet.weight,
          },
        };

        // הוספה להיסטוריה
        if (!existingHistory[exercise.name]) {
          existingHistory[exercise.name] = [];
        }

        // הסרת רשומה קיימת מאותו תאריך (אם יש)
        existingHistory[exercise.name] = existingHistory[exercise.name].filter(
          (entry) => entry.date !== workoutData.date
        );

        // הוספת הרשומה החדשה
        existingHistory[exercise.name].push(historyEntry);

        // מיון לפי תאריך
        existingHistory[exercise.name].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      }

      // שמירה
      await AsyncStorage.setItem(
        this.UNIFIED_HISTORY_KEY,
        JSON.stringify(existingHistory)
      );
    } catch (error) {
      console.error("Error saving workout to unified history:", error);
    }
  }

  /**
   * קבלת היסטוריה מאוחדת (דמו + אמיתי)
   */
  private async getUnifiedHistory(): Promise<{
    [exerciseName: string]: ExerciseHistoryEntry[];
  }> {
    try {
      const unifiedJson = await AsyncStorage.getItem(this.UNIFIED_HISTORY_KEY);
      return unifiedJson ? JSON.parse(unifiedJson) : {};
    } catch (error) {
      console.error("Error getting unified history:", error);
      return {};
    }
  }

  /**
   * קבלת נתוני התקדמות מלאים לתרגיל ספציפי
   */
  async getExerciseProgressData(
    exerciseName: string
  ): Promise<ExerciseProgressData | null> {
    try {
      // איחוד נתונים מכל המקורות
      const unifiedHistory = await this.getUnifiedHistory();
      const demoWorkouts = await realisticDemoService.getWorkoutHistory();

      let allEntries: ExerciseHistoryEntry[] = [];

      // הוספת נתונים מהיסטוריה מאוחדת
      if (unifiedHistory[exerciseName]) {
        allEntries.push(...unifiedHistory[exerciseName]);
      }

      // הוספת נתונים מהדמו
      demoWorkouts.forEach((workout) => {
        const demoExercise = workout.exercises.find(
          (ex) => ex.name === exerciseName
        );
        if (demoExercise && demoExercise.actualSets.length > 0) {
          const completedSets = demoExercise.actualSets.filter(
            (set) => set.completed
          );
          if (completedSets.length > 0) {
            const bestSet = completedSets.reduce((best, current) => {
              const currentVolume = current.reps * (current.weight || 1);
              const bestVolume = best.reps * (best.weight || 1);
              return currentVolume > bestVolume ? current : best;
            });

            const entry: ExerciseHistoryEntry = {
              date: workout.date,
              sets: completedSets.map((set) => ({
                reps: set.reps,
                weight: set.weight || 0,
                volume: set.reps * (set.weight || 1),
              })),
              bestSet: {
                reps: bestSet.reps,
                weight: bestSet.weight || 0,
                volume: bestSet.reps * (bestSet.weight || 1),
              },
            };

            // בדיקה שאין כפשה לפי תאריך
            if (!allEntries.some((existing) => existing.date === entry.date)) {
              allEntries.push(entry);
            }
          }
        }
      });

      if (allEntries.length === 0) {
        return null;
      }

      // מיון לפי תאריך
      allEntries.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      // חישוב שיאים אישיים
      const personalRecords = allEntries.reduce(
        (records, entry) => {
          const maxWeight = Math.max(records.maxWeight, entry.bestSet.weight);
          const maxReps = Math.max(records.maxReps, entry.bestSet.reps);
          const maxVolume = Math.max(records.maxVolume, entry.bestSet.volume);
          return { maxWeight, maxReps, maxVolume };
        },
        { maxWeight: 0, maxReps: 0, maxVolume: 0 }
      );

      // חישוב מגמה
      const trend = this.calculateTrend(allEntries);

      // חישוב התקדמות ממוצעת
      const averageProgression = this.calculateAverageProgression(allEntries);

      return {
        exerciseName,
        history: allEntries,
        trend,
        personalRecords,
        averageProgression,
      };
    } catch (error) {
      console.error(`Error getting progress data for ${exerciseName}:`, error);
      return null;
    }
  }

  /**
   * חישוב מגמה על בסיס ההיסטוריה
   */
  private calculateTrend(
    entries: ExerciseHistoryEntry[]
  ): "improving" | "stable" | "declining" | "new" {
    if (entries.length < 3) return "new";

    // השוואה בין החמישית האחרונה לחמישית הראשונה
    const recentEntries = entries.slice(
      -Math.min(5, Math.floor(entries.length / 2))
    );
    const earlierEntries = entries.slice(
      0,
      Math.min(5, Math.floor(entries.length / 2))
    );

    const recentAvgVolume =
      recentEntries.reduce((sum, entry) => sum + entry.bestSet.volume, 0) /
      recentEntries.length;
    const earlierAvgVolume =
      earlierEntries.reduce((sum, entry) => sum + entry.bestSet.volume, 0) /
      earlierEntries.length;

    const improvement = (recentAvgVolume - earlierAvgVolume) / earlierAvgVolume;

    if (improvement > 0.1) return "improving";
    if (improvement < -0.1) return "declining";
    return "stable";
  }

  /**
   * חישוב התקדמות ממוצעת לשבוע
   */
  private calculateAverageProgression(entries: ExerciseHistoryEntry[]) {
    if (entries.length < 2) {
      return { weightPerWeek: 0, repsPerWeek: 0, volumePerWeek: 0 };
    }

    const firstEntry = entries[0];
    const lastEntry = entries[entries.length - 1];

    const daysDiff =
      (new Date(lastEntry.date).getTime() -
        new Date(firstEntry.date).getTime()) /
      (1000 * 60 * 60 * 24);
    const weeksDiff = daysDiff / 7;

    if (weeksDiff === 0) {
      return { weightPerWeek: 0, repsPerWeek: 0, volumePerWeek: 0 };
    }

    const weightDiff = lastEntry.bestSet.weight - firstEntry.bestSet.weight;
    const repsDiff = lastEntry.bestSet.reps - firstEntry.bestSet.reps;
    const volumeDiff = lastEntry.bestSet.volume - firstEntry.bestSet.volume;

    return {
      weightPerWeek: Math.round((weightDiff / weeksDiff) * 100) / 100,
      repsPerWeek: Math.round((repsDiff / weeksDiff) * 100) / 100,
      volumePerWeek: Math.round((volumeDiff / weeksDiff) * 100) / 100,
    };
  }

  /**
   * קבלת ביצועים קודמים לתרגיל (לתאימות עם useWorkoutHistory)
   */
  async getPreviousPerformanceForExercise(
    exerciseName: string
  ): Promise<PreviousPerformance | null> {
    try {
      // ניסיון קבלה מ-workoutHistoryService רגיל קודם
      const regularHistory =
        await workoutHistoryService.getPreviousPerformanceForExercise(
          exerciseName
        );
      if (regularHistory) {
        return regularHistory;
      }

      // אם אין, נבנה מהנתונים המאוחדים
      const progressData = await this.getExerciseProgressData(exerciseName);
      if (!progressData || progressData.history.length === 0) {
        return null;
      }

      const latestEntry = progressData.history[progressData.history.length - 1];

      return {
        exerciseName,
        date: latestEntry.date,
        sets: latestEntry.sets.map((set) => ({
          weight: set.weight,
          reps: set.reps,
          restTime: 60, // ברירת מחדל
          perceivedExertion: 7, // ברירת מחדל
        })),
        personalRecords: {
          maxWeight: progressData.personalRecords.maxWeight,
          maxReps: progressData.personalRecords.maxReps,
          maxVolume: progressData.personalRecords.maxVolume,
          totalVolume: progressData.personalRecords.maxVolume, // בינתיים נשתמש באותו ערך
        },
      };
    } catch (error) {
      console.error(
        `Error getting previous performance for ${exerciseName}:`,
        error
      );
      return null;
    }
  }

  /**
   * מחיקת כל ההיסטוריה
   */
  async clearAllHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.UNIFIED_HISTORY_KEY);
      await workoutHistoryService.clearHistory();
      await realisticDemoService.clearDemoData();
    } catch (error) {
      console.error("Error clearing all history:", error);
    }
  }
}

export const unifiedHistoryService = new UnifiedHistoryService();
