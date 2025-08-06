/**
 * @file src/screens/workout/services/autoSaveService.ts
 * @description שירות שמירה אוטומטית לאימונים - משופר עם וידואי נתונים וטיפול בשגיאות
 * English: Auto-save service for workouts - enhanced with data validation and error handling
 * @inspired מההצלחה במסך ההיסטוריה עם validateWorkoutData וטיפול בשגיאות
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { WorkoutData, WorkoutDraft } from "../types/workout.types";
import { AUTO_SAVE } from "../utils/workoutConstants";
import workoutValidationService from "./workoutValidationService";
import workoutErrorHandlingService from "./workoutErrorHandlingService";

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

  // שמור מצב אימון - משופר עם וידואי נתונים
  // Save workout state - enhanced with data validation
  async saveWorkoutState(workout: WorkoutData): Promise<void> {
    if (!this.currentWorkoutId) return;

    try {
      // וידואי מהיר לפני שמירה (מבוסס על הלקחים מההיסטוריה)
      if (!workoutValidationService.quickValidateForAutoSave(workout)) {
        console.warn("⚠️ Workout data failed quick validation - skipping save");
        return;
      }

      // ניקוי נתונים לפני שמירה
      const sanitizedWorkout =
        workoutValidationService.sanitizeWorkoutForSave(workout);

      const draft: WorkoutDraft = {
        workout: sanitizedWorkout,
        lastSaved: new Date().toISOString(),
        version: 1,
      };

      await AsyncStorage.setItem(
        `workout_draft_${this.currentWorkoutId}`,
        JSON.stringify(draft)
      );

      // שמירה בשקט ללא לוגים
    } catch (error: unknown) {
      // טיפול משופר בשגיאות באמצעות השירות החדש
      const recoveryStrategy =
        await workoutErrorHandlingService.handleAutoSaveError(
          error,
          workout,
          () => this.saveWorkoutState(workout)
        );

      // ביצוע אסטרטגיית השחזור
      if (recoveryStrategy.action) {
        try {
          await recoveryStrategy.action();
        } catch (recoveryError) {
          console.error("❌ Recovery action failed:", recoveryError);
          // עצירת השירות אם השחזור נכשל
          this.stopAutoSave();
        }
      }

      // אם זה שגיאה קריטית, עצור את השירות
      if (recoveryStrategy.type === "user_action") {
        this.stopAutoSave();
      }
    }
  }

  // שחזר טיוטות - משופר עם וידואי נתונים
  // Recover drafts - enhanced with data validation
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

            // וידואי הטיוטה באמצעות השירות החדש
            const validation =
              workoutValidationService.validateWorkoutDraft(draft);

            if (validation.isValid || validation.warnings.length === 0) {
              // בדוק אם הטיוטה לא ישנה מדי
              const savedDate = new Date(draft.lastSaved);
              const now = new Date();
              const age = now.getTime() - savedDate.getTime();

              if (age < AUTO_SAVE.draftExpiry) {
                validDrafts.push(draft);
              } else {
                // נקה טיוטות ישנות
                await AsyncStorage.removeItem(key);
                console.log("🧹 Removed expired draft:", key);
              }
            } else if (validation.correctedData) {
              // שמור טיוטה מתוקנת
              const correctedDraft: WorkoutDraft = {
                ...draft,
                workout: validation.correctedData,
              };
              validDrafts.push(correctedDraft);
              console.log("🔧 Using corrected draft data for:", key);
            } else {
              // מחק טיוטות לא תקינות
              await AsyncStorage.removeItem(key);
              console.warn("🗑️ Removed invalid draft:", key);
            }
          } catch (e) {
            // טיפול בשגיאת פירסור JSON
            const result =
              await workoutErrorHandlingService.handleDataLoadError(
                e,
                "draft_parsing"
              );

            if (!result.success) {
              console.error("Error parsing draft:", e);
              // מחק את הטיוטה הפגומה
              await AsyncStorage.removeItem(key);
            }
          }
        }
      }

      return validDrafts;
    } catch (error) {
      const result = await workoutErrorHandlingService.handleDataLoadError(
        error,
        "draft_recovery"
      );

      if (result.success && result.data) {
        return result.data;
      }

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
