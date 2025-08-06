/**
 * @file src/screens/workout/services/workoutValidationService.ts
 * @description שירות וידואי נתונים לאימונים
 * English: Workout data validation service
 * @inspired מתוך ההצלחה במסך ההיסטוריה עם validateWorkoutData
 */

import { WorkoutData, WorkoutDraft } from "../types/workout.types";
import { AUTO_SAVE } from "../utils/workoutConstants";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  correctedData?: WorkoutData;
}

class WorkoutValidationService {
  private static instance: WorkoutValidationService;

  static getInstance(): WorkoutValidationService {
    if (!WorkoutValidationService.instance) {
      WorkoutValidationService.instance = new WorkoutValidationService();
    }
    return WorkoutValidationService.instance;
  }

  /**
   * וידוא נתוני אימון מלאים (מבוסס על validateWorkoutData מההיסטוריה)
   */
  validateWorkoutData(workout: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let isValid = true;

    try {
      // וידוא מבנה בסיסי
      if (!workout) {
        errors.push("נתוני האימון חסרים");
        return { isValid: false, errors, warnings };
      }

      // וידוא שם אימון
      const workoutName = workout.name;
      if (
        !workoutName ||
        typeof workoutName !== "string" ||
        workoutName.trim() === ""
      ) {
        warnings.push("שם האימון חסר - ייקבע שם ברירת מחדל");
      }

      // וידוא תרגילים
      if (!Array.isArray(workout.exercises)) {
        errors.push("רשימת התרגילים לא תקינה");
        isValid = false;
      } else if (workout.exercises.length === 0) {
        warnings.push("האימון לא כולל תרגילים");
      }

      // וידוא זמנים
      const startTime = workout.startTime;
      const endTime = workout.endTime;

      if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          warnings.push("זמני האימון לא תקינים");
        } else if (end.getTime() <= start.getTime()) {
          warnings.push("זמן סיום האימון קודם לזמן ההתחלה");
        }
      }

      // וידוא משך אימון
      const duration = workout.duration;
      if (duration !== undefined) {
        if (typeof duration !== "number" || duration < 0) {
          warnings.push("משך האימון לא תקין");
        } else if (duration > 24 * 60) {
          // יותר מ-24 שעות
          warnings.push("משך האימון חריג (יותר מ-24 שעות)");
        }
      }

      // וידוא נתוני ביצועים
      if (workout.plannedVsActual) {
        const { totalSetsPlanned, totalSetsCompleted } =
          workout.plannedVsActual;
        if (
          typeof totalSetsPlanned === "number" &&
          typeof totalSetsCompleted === "number"
        ) {
          if (totalSetsCompleted < 0 || totalSetsPlanned < 0) {
            warnings.push("מספר הסטים לא יכול להיות שלילי");
          }
          if (totalSetsCompleted > totalSetsPlanned * 2) {
            warnings.push("מספר הסטים שהושלמו גבוה באופן חריג");
          }
        }
      }

      // יצירת נתונים מתוקנים
      const correctedData = this.createCorrectedWorkoutData(workout);

      return {
        isValid,
        errors,
        warnings,
        correctedData,
      };
    } catch (error) {
      console.error("Error validating workout data:", error);
      return {
        isValid: false,
        errors: ["שגיאה בתהליך הוידוא"],
        warnings,
      };
    }
  }

  /**
   * יצירת נתונים מתוקנים (מבוסס על ההצלחה בהיסטוריה)
   */
  private createCorrectedWorkoutData(workout: any): WorkoutData {
    return {
      ...workout,
      name: workout.name || "אימון",
      exercises: Array.isArray(workout.exercises) ? workout.exercises : [],
      startTime:
        this.validateDate(workout.startTime) || new Date().toISOString(),
      endTime: this.validateDate(workout.endTime) || new Date().toISOString(),
      duration: Math.max(0, workout.duration || 0),
      plannedVsActual: {
        ...workout.plannedVsActual,
        totalSetsPlanned: Math.max(
          0,
          workout.plannedVsActual?.totalSetsPlanned || 0
        ),
        totalSetsCompleted: Math.max(
          0,
          workout.plannedVsActual?.totalSetsCompleted || 0
        ),
        personalRecords: Math.max(
          0,
          workout.plannedVsActual?.personalRecords || 0
        ),
      },
    };
  }

  /**
   * וידוא תאריך (מבוסס על הטיפול המוצלח בהיסטוריה)
   */
  private validateDate(dateString: any): string | null {
    if (!dateString) return null;

    try {
      let date: Date;

      if (typeof dateString === "string") {
        const cleanDateString = dateString.trim();

        // בדיקה לפורמט ISO
        if (cleanDateString.includes("T") || cleanDateString.includes("Z")) {
          date = new Date(cleanDateString);
        }
        // בדיקה לפורמט timestamp
        else if (/^\d+$/.test(cleanDateString)) {
          const timestamp = parseInt(cleanDateString);
          date = new Date(timestamp);
        }
        // פורמט רגיל
        else {
          date = new Date(cleanDateString);
        }
      } else {
        date = new Date(dateString);
      }

      // בדיקה שהתאריך תקין
      if (!date || isNaN(date.getTime()) || date.getTime() <= 0) {
        return null;
      }

      return date.toISOString();
    } catch (error) {
      console.error("Error validating date:", error, "Input:", dateString);
      return null;
    }
  }

  /**
   * וידוא טיוטת אימון
   */
  validateWorkoutDraft(draft: WorkoutDraft): ValidationResult {
    const workoutValidation = this.validateWorkoutData(draft.workout);

    // בדיקות נוספות לטיוטה
    const additionalWarnings: string[] = [];

    if (!draft.lastSaved) {
      additionalWarnings.push("זמן השמירה האחרונה חסר");
    } else {
      const savedDate = new Date(draft.lastSaved);
      if (isNaN(savedDate.getTime())) {
        additionalWarnings.push("זמן השמירה האחרונה לא תקין");
      } else {
        const now = new Date();
        const age = now.getTime() - savedDate.getTime();
        const maxAge = AUTO_SAVE.draftExpiry;

        if (age > maxAge) {
          additionalWarnings.push("הטיוטה ישנה מדי");
        }
      }
    }

    return {
      ...workoutValidation,
      warnings: [...workoutValidation.warnings, ...additionalWarnings],
    };
  }

  /**
   * וידוא מהיר לפני שמירה אוטומטית
   */
  quickValidateForAutoSave(workout: WorkoutData): boolean {
    try {
      // בדיקות מהירות בלבד
      if (!workout) return false;
      if (!workout.name) return false;
      if (!Array.isArray(workout.exercises)) return false;

      return true;
    } catch {
      return false;
    }
  }

  /**
   * ניקוי נתונים לפני שמירה
   */
  sanitizeWorkoutForSave(workout: WorkoutData): WorkoutData {
    const validation = this.validateWorkoutData(workout);
    return validation.correctedData || workout;
  }
}

export default WorkoutValidationService.getInstance();
