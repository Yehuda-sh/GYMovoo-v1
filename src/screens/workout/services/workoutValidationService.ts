/**
 * @file src/screens/workout/services/workoutValidationService.ts
 * @description שירות וידוא נתונים לאימונים - מתקדם עם התאמה אישית חכמה
 * @description English: Workout data validation service - Advanced with smart personalization
 * @inspired מתוך ההצלחה במסך ההיסטוריה עם validateWorkoutData
 * @updated 2025-08-17 Updated documentation and PersonalData import standardization
 *
 * ✅ CORE & INNOVATIVE: שירות וידוא נתונים מתקדם ומותאם אישית
 * - Used by 4+ services: autoSaveService, workoutErrorHandlingService, workoutStorageService
 * - Exported system-wide via services/index.ts and src/services/index.ts
 * - Singleton pattern: instance יחיד לכל המערכת
 * - Personalized validation: וידוא מותאם לגיל, מין, משקל, רמת כושר (חדשנות!)
 *
 * @features
 * - 🔍 Comprehensive validation עם correction mechanisms מתקדמים
 * - 🎯 Personalized suggestions מותאמות לנתונים אישיים (גיל, מין, משקל)
 * - 📊 Smart age-based recommendations (מתחילים, מבוגרים, צעירים)
 * - ⚡ Quick validation לשמירה אוטומטית עם performance optimization
 * - 📅 Advanced date validation עם multiple format support
 * - 🛡️ Data sanitization לפני שמירה למניעת corruption
 *
 * @architecture Singleton validation service with personalization engine
 * @usage Core validation for all workout-related data operations
 * @innovation First-of-its-kind personalized workout validation in fitness apps
 * @performance Optimized validation with quick checks for auto-save scenarios
 */

import { WorkoutData, WorkoutDraft } from "../types/workout.types";
import { AUTO_SAVE } from "../utils/workoutConstants";

// Interface לנתוני אימון בסיסי - מותאם ל-WorkoutData
interface BaseWorkoutData {
  name?: string;
  exercises?: unknown[];
  startTime?: string;
  endTime?: string;
  duration?: number;
  plannedVsActual?: {
    totalSetsPlanned?: number;
    totalSetsCompleted?: number;
  };
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  correctedData?: WorkoutData;
  personalizedSuggestions?: string[]; // ✅ הצעות מותאמות אישית
}

// ✅ Import PersonalData from central utils
import { PersonalData } from "../../../utils/personalDataUtils";

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
  validateWorkoutData(workout: BaseWorkoutData): ValidationResult {
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
   * ✅ וידוא נתוני אימון מותאם אישית עם נתונים אישיים
   */
  validateWorkoutDataWithPersonalData(
    workout: BaseWorkoutData,
    personalData?: PersonalData
  ): ValidationResult {
    // התחל עם הוידוא הבסיסי
    const baseValidation = this.validateWorkoutData(workout);

    if (!personalData) {
      return baseValidation;
    }

    const personalizedWarnings: string[] = [];
    const personalizedSuggestions: string[] = [];

    // ✅ בדיקות מותאמות לגיל
    if (personalData.age) {
      if (
        personalData.age.includes("50_") ||
        personalData.age.includes("over_")
      ) {
        // בדיקות לגיל מבוגר
        if (workout.duration && workout.duration > 90) {
          personalizedWarnings.push("אימון ארוך מהמומלץ לגילך - שקול להקצר");
        }
        if (workout.exercises && workout.exercises.length > 8) {
          personalizedWarnings.push("מספר רב של תרגילים - שקול לפשט");
        }
        personalizedSuggestions.push(
          "💡 זכור: מנוחה נאותה בין הסטים חשובה בגילך"
        );
      } else if (
        personalData.age.includes("18_") ||
        personalData.age.includes("25_")
      ) {
        // המלצות לצעירים
        if (workout.duration && workout.duration < 30) {
          personalizedWarnings.push("אימון קצר - אתה יכול יותר!");
        }
        personalizedSuggestions.push(
          "🚀 באופן האנרגיה שלך - שקול להגדיל את האתגר"
        );
      }
    }

    // ✅ בדיקות מותאמות למין
    if (personalData.gender === "female") {
      personalizedSuggestions.push(
        "💪 זכרי: חיזוק ליבה וגלוטאוס יכול להיות מעולה עבורך"
      );
    } else if (personalData.gender === "male") {
      personalizedSuggestions.push("🏋️ שקול: איזון בין פלג גוף עליון ותחתון");
    }

    // ✅ בדיקות לפי משקל גוף (התאמת עומסים)
    if (personalData.weight && workout.exercises) {
      if (
        personalData.weight.includes("under_") ||
        personalData.weight.includes("50_")
      ) {
        personalizedSuggestions.push(
          "🎯 התחל עם משקלים קלים יותר ותגדל בהדרגה"
        );
      } else if (
        personalData.weight.includes("over_90") ||
        personalData.weight.includes("over_100")
      ) {
        personalizedSuggestions.push(
          "💡 שים דגש על חימום מקיף לפני תרגילי כוח"
        );
      }
    }

    // ✅ בדיקות לפי רמת כושר
    if (personalData.fitnessLevel === "beginner") {
      if (workout.exercises && workout.exercises.length > 6) {
        personalizedWarnings.push("הרבה תרגילים למתחיל - התחל עם פחות");
      }
      personalizedSuggestions.push(
        "🌱 כמתחיל: התמקד בטכניקה נכונה על פני כמות"
      );
    } else if (personalData.fitnessLevel === "advanced") {
      personalizedSuggestions.push("🎖️ כמתקדם: שקול להוסיף וריאציות מתקדמות");
    }

    return {
      ...baseValidation,
      warnings: [...baseValidation.warnings, ...personalizedWarnings],
      personalizedSuggestions,
    };
  }

  /**
   * יצירת נתונים מתוקנים (מבוסס על ההצלחה בהיסטוריה)
   */
  private createCorrectedWorkoutData(workout: BaseWorkoutData): WorkoutData {
    const workoutAsData = workout as unknown as WorkoutData;
    return {
      id: workoutAsData.id || `workout_${Date.now()}`,
      name: workout.name || "אימון",
      startTime:
        this.validateDate(workout.startTime) || new Date().toISOString(),
      endTime: this.validateDate(workout.endTime) || undefined,
      duration: Math.max(0, workout.duration || 0),
      exercises: Array.isArray(workout.exercises)
        ? (workout.exercises as WorkoutData["exercises"])
        : [],
      totalVolume: workoutAsData.totalVolume || 0,
      totalSets: workout.plannedVsActual?.totalSetsPlanned || 0,
      completedSets: workout.plannedVsActual?.totalSetsCompleted || 0,
      caloriesBurned: workoutAsData.caloriesBurned || 0,
      notes: workoutAsData.notes || "",
      rating: workoutAsData.rating || undefined,
      location: workoutAsData.location || undefined,
      weather: workoutAsData.weather || undefined,
      mood: workoutAsData.mood || undefined,
    };
  }

  /**
   * וידוא תאריך (מבוסס על הטיפול המוצלח בהיסטוריה)
   */
  private validateDate(dateString: string | unknown): string | null {
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
        date = new Date(dateString as string);
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
    const workoutValidation = this.validateWorkoutData(
      draft.workout as BaseWorkoutData
    );

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
    const validation = this.validateWorkoutData(workout as BaseWorkoutData);
    return validation.correctedData || workout;
  }
}

export default WorkoutValidationService.getInstance();
