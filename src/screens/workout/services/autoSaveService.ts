/**
 * @file src/screens/workout/services/autoSaveService.ts
 * @description שירות שמירה אוטומטית לאימונים
 * English: Auto-save service for workouts
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { WorkoutData, WorkoutDraft } from "../types/workout.types";
import { AUTO_SAVE } from "../utils/workoutConstants";

class AutoSaveService {
  private static instance: AutoSaveService;
  private saveInterval: NodeJS.Timeout | null = null;
  private currentWorkoutId: string | null = null;

  // Singleton pattern
  static getInstance(): AutoSaveService {
    if (!AutoSaveService.instance) {
      AutoSaveService.instance = new AutoSaveService();
    }
    return AutoSaveService.instance;
  }

  // התחל שמירה אוטומטית
  // Start auto-save
  startAutoSave(workoutId: string, getWorkoutState: () => WorkoutData) {
    this.currentWorkoutId = workoutId;

    // שמור מיד
    // Save immediately
    this.saveWorkoutState(getWorkoutState());

    // הגדר interval לשמירה
    // Set save interval
    this.saveInterval = setInterval(() => {
      this.saveWorkoutState(getWorkoutState());
    }, AUTO_SAVE.interval);
  }

  // עצור שמירה אוטומטית
  // Stop auto-save
  stopAutoSave() {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
      this.saveInterval = null;
    }
    this.currentWorkoutId = null;
  }

  // שמור מצב אימון
  // Save workout state
  async saveWorkoutState(workout: WorkoutData): Promise<void> {
    if (!this.currentWorkoutId) return;

    try {
      const draft: WorkoutDraft = {
        workout,
        lastSaved: new Date().toISOString(),
        version: 1,
      };

      await AsyncStorage.setItem(
        `workout_draft_${this.currentWorkoutId}`,
        JSON.stringify(draft)
      );

      // שמירה בשקט ללא לוגים
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  }

  // שחזר טיוטות
  // Recover drafts
  async recoverDrafts(): Promise<WorkoutDraft[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const draftKeys = keys.filter((key) => key.startsWith("workout_draft_"));

      if (draftKeys.length === 0) return [];

      const drafts = await AsyncStorage.multiGet(draftKeys);
      const validDrafts: WorkoutDraft[] = [];

      for (const [, value] of drafts) {
        if (value) {
          try {
            const draft: WorkoutDraft = JSON.parse(value);

            // בדוק אם הטיוטה לא ישנה מדי
            // Check if draft is not too old
            const savedDate = new Date(draft.lastSaved);
            const now = new Date();
            const age = now.getTime() - savedDate.getTime();

            if (age < AUTO_SAVE.draftExpiry) {
              validDrafts.push(draft);
            }
          } catch (e) {
            console.error("Error parsing draft:", e);
          }
        }
      }

      return validDrafts;
    } catch (error) {
      console.error("Error recovering drafts:", error);
      return [];
    }
  }

  // מחק טיוטה
  // Delete draft
  async deleteDraft(workoutId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`workout_draft_${workoutId}`);
    } catch (error) {
      console.error("Error deleting draft:", error);
    }
  }

  // בדוק אם יש טיוטות
  // Check if drafts exist
  async hasDrafts(): Promise<boolean> {
    try {
      const drafts = await this.recoverDrafts();
      return drafts.length > 0;
    } catch {
      return false;
    }
  }

  // הצע שחזור טיוטות
  // Offer draft recovery
  async offerDraftRecovery(): Promise<WorkoutDraft | null> {
    try {
      const drafts = await this.recoverDrafts();
      if (drafts.length === 0) return null;

      // מיין לפי תאריך שמירה
      // Sort by save date
      drafts.sort(
        (a, b) =>
          new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()
      );

      const latestDraft = drafts[0];
      const savedDate = new Date(latestDraft.lastSaved);
      const formattedDate = savedDate.toLocaleString("he-IL");

      return new Promise((resolve) => {
        Alert.alert(
          "שחזור אימון",
          `נמצאה טיוטה שנשמרה ב-${formattedDate}. לשחזר?`,
          [
            {
              text: "לא",
              style: "cancel",
              onPress: () => resolve(null),
            },
            {
              text: "כן",
              onPress: () => resolve(latestDraft),
            },
          ],
          { cancelable: false }
        );
      });
    } catch (error) {
      console.error("Error offering draft recovery:", error);
      return null;
    }
  }
}

export default AutoSaveService.getInstance();
