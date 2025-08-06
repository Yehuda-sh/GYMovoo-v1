/**
 * @file src/screens/workout/services/workoutDataService.ts
 * @description שירות לניהול נתונים מתקדם של אימונים
 * English: Advanced workout data management service
 * @inspired מהטיפול המוצלח בנתונים מורכבים במסך ההיסטוריה
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkoutData, WorkoutWithFeedback } from "../types/workout.types";
import workoutValidationService from "./workoutValidationService";
import workoutErrorHandlingService from "./workoutErrorHandlingService";
import workoutFeedbackService from "./workoutFeedbackService";

interface DataSyncStatus {
  lastSync: string;
  pendingChanges: number;
  syncInProgress: boolean;
  errors: string[];
}

interface WorkoutAnalytics {
  totalWorkouts: number;
  totalDuration: number;
  averageIntensity: number;
  progressTrend: "up" | "down" | "stable";
  strongestMuscleGroups: string[];
  improvementAreas: string[];
}

class WorkoutDataService {
  private static instance: WorkoutDataService;
  private readonly DATA_VERSION = "v2.0";
  private readonly MAIN_DATA_KEY = "workout_data_main";
  private readonly BACKUP_DATA_KEY = "workout_data_backup";
  private readonly SYNC_STATUS_KEY = "data_sync_status";

  static getInstance(): WorkoutDataService {
    if (!WorkoutDataService.instance) {
      WorkoutDataService.instance = new WorkoutDataService();
    }
    return WorkoutDataService.instance;
  }

  /**
   * שמירת נתונים עם גיבוי אוטומטי (מבוסס על הלקחים מההיסטוריה)
   */
  async saveWorkoutData(
    workout: WorkoutData,
    createBackup: boolean = true
  ): Promise<{ success: boolean; warnings?: string[] }> {
    try {
      // וידואי נתונים לפני שמירה
      const validation = workoutValidationService.validateWorkoutData(workout);
      const finalWorkout = validation.correctedData || workout;

      // שמירה ראשית
      const mainData = {
        workout: finalWorkout,
        version: this.DATA_VERSION,
        savedAt: new Date().toISOString(),
        checksum: this.generateChecksum(finalWorkout),
      };

      await AsyncStorage.setItem(
        `${this.MAIN_DATA_KEY}_${workout.id}`,
        JSON.stringify(mainData)
      );

      // יצירת גיבוי אם נדרש
      if (createBackup) {
        await this.createBackup(workout.id, mainData);
      }

      // עדכון סטטוס סנכרון
      await this.updateSyncStatus({
        lastSync: new Date().toISOString(),
        pendingChanges: 0,
        syncInProgress: false,
        errors: [],
      });

      return {
        success: true,
        warnings:
          validation.warnings.length > 0 ? validation.warnings : undefined,
      };
    } catch (error) {
      const result = await workoutErrorHandlingService.handleDataLoadError(
        error,
        "workout_save"
      );

      return {
        success: result.success,
        warnings: result.message ? [result.message] : undefined,
      };
    }
  }

  /**
   * טעינת נתוני אימון עם חזרה לגיבוי במקרה הצורך
   */
  async loadWorkoutData(workoutId: string): Promise<WorkoutData | null> {
    try {
      // ניסיון טעינה ראשית
      const mainData = await AsyncStorage.getItem(
        `${this.MAIN_DATA_KEY}_${workoutId}`
      );

      if (mainData) {
        const parsed = JSON.parse(mainData);

        // וידוא תקינות הנתונים
        const checksum = this.generateChecksum(parsed.workout);
        if (checksum === parsed.checksum) {
          const validation = workoutValidationService.validateWorkoutData(
            parsed.workout
          );
          return validation.correctedData || parsed.workout;
        } else {
          console.warn("⚠️ Main data corrupted, trying backup...");
        }
      }

      // אם הנתונים הראשיים פגומים, נסה גיבוי
      const backupData = await AsyncStorage.getItem(
        `${this.BACKUP_DATA_KEY}_${workoutId}`
      );

      if (backupData) {
        const parsed = JSON.parse(backupData);
        const validation = workoutValidationService.validateWorkoutData(
          parsed.workout
        );
        console.log("✅ Restored from backup");
        return validation.correctedData || parsed.workout;
      }

      return null;
    } catch (error) {
      const result = await workoutErrorHandlingService.handleDataLoadError(
        error,
        "workout_load"
      );

      return result.success ? result.data : null;
    }
  }

  /**
   * קבלת רשימת כל האימונים עם פילטור וסידור
   */
  async getAllWorkouts(options?: {
    sortBy?: "date" | "name" | "duration";
    filterBy?: {
      startDate?: string;
      endDate?: string;
      minDuration?: number;
      exerciseType?: string;
    };
    limit?: number;
  }): Promise<WorkoutData[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const workoutKeys = keys.filter((key) =>
        key.startsWith(this.MAIN_DATA_KEY)
      );

      if (workoutKeys.length === 0) return [];

      const workouts = await AsyncStorage.multiGet(workoutKeys);
      const validWorkouts: WorkoutData[] = [];

      for (const [, value] of workouts) {
        if (value) {
          try {
            const parsed = JSON.parse(value);
            const validation = workoutValidationService.validateWorkoutData(
              parsed.workout
            );

            if (validation.correctedData) {
              validWorkouts.push(validation.correctedData);
            }
          } catch (error) {
            console.warn("Skipping corrupted workout data");
          }
        }
      }

      // יישום פילטרים
      let filteredWorkouts = this.applyFilters(
        validWorkouts,
        options?.filterBy
      );

      // סידור
      if (options?.sortBy) {
        filteredWorkouts = this.sortWorkouts(filteredWorkouts, options.sortBy);
      }

      // הגבלת תוצאות
      if (options?.limit) {
        filteredWorkouts = filteredWorkouts.slice(0, options.limit);
      }

      return filteredWorkouts;
    } catch (error) {
      console.error("Error loading all workouts:", error);
      return [];
    }
  }

  /**
   * חישוב אנליטיקה של אימונים (מבוסס על הסטטיסטיקות בהיסטוריה)
   */
  async calculateWorkoutAnalytics(): Promise<WorkoutAnalytics> {
    try {
      const workouts = await this.getAllWorkouts({ sortBy: "date" });

      if (workouts.length === 0) {
        return {
          totalWorkouts: 0,
          totalDuration: 0,
          averageIntensity: 0,
          progressTrend: "stable",
          strongestMuscleGroups: [],
          improvementAreas: [],
        };
      }

      // חישובים בסיסיים
      const totalWorkouts = workouts.length;
      const totalDuration = workouts.reduce(
        (sum, w) => sum + (w.duration || 0),
        0
      );

      // חישוב עוצמה ממוצעת (בהתבסס על מספר תרגילים ומשך)
      const averageIntensity =
        workouts.reduce((sum, w) => {
          const exerciseCount = w.exercises?.length || 0;
          const durationHours = (w.duration || 0) / 3600;
          const intensity =
            durationHours > 0 ? exerciseCount / durationHours : 0;
          return sum + intensity;
        }, 0) / totalWorkouts;

      // מגמת התקדמות
      const progressTrend = this.calculateProgressTrend(workouts);

      // קבוצות שרירים חזקות
      const strongestMuscleGroups = this.findStrongestMuscleGroups(workouts);

      // תחומי שיפור
      const improvementAreas = this.findImprovementAreas(workouts);

      return {
        totalWorkouts,
        totalDuration,
        averageIntensity: Math.round(averageIntensity * 100) / 100,
        progressTrend,
        strongestMuscleGroups,
        improvementAreas,
      };
    } catch (error) {
      console.error("Error calculating analytics:", error);
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        averageIntensity: 0,
        progressTrend: "stable",
        strongestMuscleGroups: [],
        improvementAreas: [],
      };
    }
  }

  /**
   * ניקוי נתונים ישנים ופגומים
   */
  async cleanupOldData(olderThanDays: number = 365): Promise<{
    deletedCount: number;
    backupsCreated: number;
    errors: string[];
  }> {
    const result = {
      deletedCount: 0,
      backupsCreated: 0,
      errors: [] as string[],
    };

    try {
      const keys = await AsyncStorage.getAllKeys();
      const workoutKeys = keys.filter(
        (key) =>
          key.startsWith(this.MAIN_DATA_KEY) ||
          key.startsWith(this.BACKUP_DATA_KEY)
      );

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      for (const key of workoutKeys) {
        try {
          const data = await AsyncStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            const savedDate = new Date(parsed.savedAt);

            if (savedDate < cutoffDate) {
              await AsyncStorage.removeItem(key);
              result.deletedCount++;
              console.log("🧹 Removed old workout data:", key);
            }
          }
        } catch (error) {
          // נתונים פגומים - מחק
          await AsyncStorage.removeItem(key);
          result.deletedCount++;
          result.errors.push(`Corrupted data removed: ${key}`);
        }
      }
    } catch (error) {
      result.errors.push(`Cleanup error: ${error}`);
    }

    return result;
  }

  // פונקציות עזר פרטיות

  private async createBackup(workoutId: string, data: any): Promise<void> {
    try {
      await AsyncStorage.setItem(
        `${this.BACKUP_DATA_KEY}_${workoutId}`,
        JSON.stringify({
          ...data,
          backupCreatedAt: new Date().toISOString(),
        })
      );
    } catch (error) {
      console.warn("Failed to create backup:", error);
    }
  }

  private generateChecksum(workout: WorkoutData): string {
    // פשוט וחומר להפקת hash בסיסי
    const data = JSON.stringify(workout);
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private async updateSyncStatus(status: DataSyncStatus): Promise<void> {
    try {
      await AsyncStorage.setItem(this.SYNC_STATUS_KEY, JSON.stringify(status));
    } catch (error) {
      console.warn("Failed to update sync status:", error);
    }
  }

  private applyFilters(workouts: WorkoutData[], filters?: any): WorkoutData[] {
    if (!filters) return workouts;

    return workouts.filter((workout) => {
      // פילטר תאריכים
      if (filters.startDate) {
        const workoutDate = new Date(workout.startTime);
        const filterDate = new Date(filters.startDate);
        if (workoutDate < filterDate) return false;
      }

      if (filters.endDate) {
        const workoutDate = new Date(workout.startTime);
        const filterDate = new Date(filters.endDate);
        if (workoutDate > filterDate) return false;
      }

      // פילטר משך מינימלי
      if (filters.minDuration && workout.duration < filters.minDuration) {
        return false;
      }

      // פילטר סוג תרגיל
      if (filters.exerciseType) {
        const hasExerciseType = workout.exercises?.some(
          (ex) => ex.category === filters.exerciseType
        );
        if (!hasExerciseType) return false;
      }

      return true;
    });
  }

  private sortWorkouts(workouts: WorkoutData[], sortBy: string): WorkoutData[] {
    return [...workouts].sort((a, b) => {
      switch (sortBy) {
        case "date":
          return (
            new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
          );
        case "name":
          return a.name.localeCompare(b.name);
        case "duration":
          return (b.duration || 0) - (a.duration || 0);
        default:
          return 0;
      }
    });
  }

  private calculateProgressTrend(
    workouts: WorkoutData[]
  ): "up" | "down" | "stable" {
    if (workouts.length < 5) return "stable";

    // השוואה בין רבע ראשון לאחרון
    const quarterSize = Math.floor(workouts.length / 4);
    const firstQuarter = workouts.slice(-quarterSize);
    const lastQuarter = workouts.slice(0, quarterSize);

    const firstAvgDuration =
      firstQuarter.reduce((sum, w) => sum + (w.duration || 0), 0) / quarterSize;
    const lastAvgDuration =
      lastQuarter.reduce((sum, w) => sum + (w.duration || 0), 0) / quarterSize;

    const difference = (lastAvgDuration - firstAvgDuration) / firstAvgDuration;

    if (difference > 0.1) return "up";
    if (difference < -0.1) return "down";
    return "stable";
  }

  private findStrongestMuscleGroups(workouts: WorkoutData[]): string[] {
    const muscleGroupCounts: Record<string, number> = {};

    workouts.forEach((workout) => {
      workout.exercises?.forEach((exercise) => {
        exercise.primaryMuscles?.forEach((muscle) => {
          muscleGroupCounts[muscle] = (muscleGroupCounts[muscle] || 0) + 1;
        });
      });
    });

    return Object.entries(muscleGroupCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([muscle]) => muscle);
  }

  private findImprovementAreas(workouts: WorkoutData[]): string[] {
    // זיהוי תחומים שצריכים שיפור בהתבסס על תדירות נמוכה
    const muscleGroupCounts: Record<string, number> = {};
    const totalWorkouts = workouts.length;

    workouts.forEach((workout) => {
      workout.exercises?.forEach((exercise) => {
        exercise.primaryMuscles?.forEach((muscle) => {
          muscleGroupCounts[muscle] = (muscleGroupCounts[muscle] || 0) + 1;
        });
      });
    });

    return Object.entries(muscleGroupCounts)
      .filter(([, count]) => count / totalWorkouts < 0.3) // פחות מ-30% מהאימונים
      .sort(([, a], [, b]) => a - b)
      .slice(0, 3)
      .map(([muscle]) => muscle);
  }
}

export default WorkoutDataService.getInstance();
