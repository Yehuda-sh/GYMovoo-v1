/**
 * @file src/screens/workout/services/autoSaveService.ts
 * @description שירות שמירה אוטומטית לאימונים
 * English: Auto-save service for workouts
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { Workout, WorkoutDraft } from "../types/workout.types";
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
  startAutoSave(workoutId: string, getWorkoutState: () => Workout) {
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
  async saveWorkoutState(workout: Workout): Promise<void> {
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

      console.log("💾 אימון נשמר אוטומטית:", new Date().toLocaleTimeString());
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

      for (const [key, value] of drafts) {
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
            } else {
              // מחק טיוטות ישנות
              // Delete old drafts
              await AsyncStorage.removeItem(key);
            }
          } catch (parseError) {
            console.error("Error parsing draft:", parseError);
          }
        }
      }

      // מיין לפי תאריך - החדשות ראשונות
      // Sort by date - newest first
      return validDrafts.sort(
        (a, b) =>
          new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()
      );
    } catch (error) {
      console.error("Error recovering drafts:", error);
      return [];
    }
  }

  // הצג התראה לשחזור טיוטה
  // Show draft recovery alert
  async checkAndPromptDraftRecovery(): Promise<WorkoutDraft | null> {
    const drafts = await this.recoverDrafts();

    if (drafts.length === 0) return null;

    return new Promise((resolve) => {
      const latestDraft = drafts[0];
      const savedDate = new Date(latestDraft.lastSaved);
      const formattedDate = savedDate.toLocaleString("he-IL");

      Alert.alert(
        "🔄 נמצאה טיוטת אימון",
        `נמצא אימון לא גמור מ-${formattedDate}\n"${latestDraft.workout.name}"\n\nהאם לשחזר?`,
        [
          {
            text: "מחק",
            style: "destructive",
            onPress: async () => {
              await this.deleteDraft(latestDraft.workout.id);
              resolve(null);
            },
          },
          {
            text: "התחל חדש",
            style: "cancel",
            onPress: () => resolve(null),
          },
          {
            text: "שחזר",
            style: "default",
            onPress: () => resolve(latestDraft),
          },
        ],
        { cancelable: false }
      );
    });
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

  // מחק את כל הטיוטות
  // Delete all drafts
  async deleteAllDrafts(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const draftKeys = keys.filter((key) => key.startsWith("workout_draft_"));
      await AsyncStorage.multiRemove(draftKeys);
    } catch (error) {
      console.error("Error deleting all drafts:", error);
    }
  }

  // נקה טיוטות ישנות
  // Clean old drafts
  async cleanOldDrafts(): Promise<void> {
    const drafts = await this.recoverDrafts();

    if (drafts.length > AUTO_SAVE.maxDrafts) {
      // השאר רק את החדשות ביותר
      // Keep only the newest ones
      const draftsToDelete = drafts.slice(AUTO_SAVE.maxDrafts);

      for (const draft of draftsToDelete) {
        await this.deleteDraft(draft.workout.id);
      }
    }
  }
}

export default AutoSaveService.getInstance();
