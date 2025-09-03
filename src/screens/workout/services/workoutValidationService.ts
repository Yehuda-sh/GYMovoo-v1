/**
 * @file src/screens/workout/services/workoutValidationService.ts
 * @description שירות וידוא נתונים לאימונים עם התאמה אישית
 * @updated 2025-09-03 Updated validation messages constants and simplified documentation
 */

import { WorkoutData } from "../types/workout.types";
import { PersonalData } from "../../../utils/personalDataUtils";

// קבועי הודעות וידוא
const VALIDATION_MESSAGES = {
  // שגיאות
  MISSING_WORKOUT_DATA: "נתוני האימון חסרים",
  INVALID_EXERCISES_LIST: "רשימת התרגילים לא תקינה",
  VALIDATION_ERROR: "שגיאה בתהליך הוידוא",

  // אזהרות
  MISSING_WORKOUT_NAME: "שם האימון חסר - ייקבע שם ברירת מחדל",
  NO_EXERCISES: "האימון לא כולל תרגילים",
  INVALID_WORKOUT_TIMES: "זמני האימון לא תקינים",
  END_TIME_BEFORE_START: "זמן סיום האימון קודם לזמן ההתחלה",
  INVALID_DURATION: "משך האימון לא תקין",
  EXCESSIVE_DURATION: "משך האימון חריג (יותר מ-24 שעות)",
  NEGATIVE_SETS: "מספר הסטים לא יכול להיות שלילי",
  EXCESSIVE_COMPLETED_SETS: "מספר הסטים שהושלמו גבוה באופן חריג",

  // הודעות מותאמות אישית
  LONG_WORKOUT_FOR_AGE: "אימון ארוך מהמומלץ לגילך - שקול להקצר",
  TOO_MANY_EXERCISES: "מספר רב של תרגילים - שקול לפשט",
  SHORT_WORKOUT_FOR_YOUNG: "אימון קצר - אתה יכול יותר!",
  TOO_MANY_EXERCISES_BEGINNER: "הרבה תרגילים למתחיל - התחל עם פחות",

  // הצעות מותאמות אישית
  REST_IMPORTANT_FOR_AGE: "💡 זכור: מנוחה נאותה בין הסטים חשובה בגילך",
  INCREASE_CHALLENGE_YOUNG: "🚀 באופן האנרגיה שלך - שקול להגדיל את האתגר",
  FEMALE_CORE_GLUTES: "💪 זכרי: חיזוק ליבה וגלוטאוס יכול להיות מעולה עבורך",
  MALE_BALANCE_BODY: "🏋️ שקול: איזון בין פלג גוף עליון ותחתון",
  LIGHT_WEIGHTS_START: "🎯 התחל עם משקלים קלים יותר ותגדל בהדרגה",
  WARMUP_FOR_HEAVY: "💡 שים דגש על חימום מקיף לפני תרגילי כוח",
  BEGINNER_TECHNIQUE: "🌱 כמתחיל: התמקד בטכניקה נכונה על פני כמות",
  ADVANCED_VARIATIONS: "🎖️ כמתקדם: שקול להוסיף וריאציות מתקדמות",
} as const;

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
  personalizedSuggestions?: string[];
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
  validateWorkoutData(workout: BaseWorkoutData): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let isValid = true;

    try {
      // וידוא מבנה בסיסי
      if (!workout) {
        errors.push(VALIDATION_MESSAGES.MISSING_WORKOUT_DATA);
        return { isValid: false, errors, warnings };
      }

      // וידוא שם אימון
      const workoutName = workout.name;
      if (
        !workoutName ||
        typeof workoutName !== "string" ||
        workoutName.trim() === ""
      ) {
        warnings.push(VALIDATION_MESSAGES.MISSING_WORKOUT_NAME);
      }

      // וידוא תרגילים
      if (!Array.isArray(workout.exercises)) {
        errors.push(VALIDATION_MESSAGES.INVALID_EXERCISES_LIST);
        isValid = false;
      } else if (workout.exercises.length === 0) {
        warnings.push(VALIDATION_MESSAGES.NO_EXERCISES);
      }
      // --- ציוד חכם ---
      // נבדוק התאמת ציוד לכל תרגיל
      if (
        Array.isArray(workout.exercises) &&
        workout.exercises.length > 0 &&
        (workout as BaseWorkoutData & { userEquipment?: string[] })
          .userEquipment
      ) {
        const {
          normalizeEquipment,
          canPerform,
          getExerciseAvailability,
        } = require("../../../utils/equipmentCatalog");
        const userEquipment = normalizeEquipment(
          (workout as BaseWorkoutData & { userEquipment?: string[] })
            .userEquipment
        );
        const equipmentWarnings: string[] = [];
        const substitutionSuggestions: string[] = [];
        workout.exercises.forEach((ex: unknown) => {
          const exercise = ex as {
            exerciseId?: string;
            id?: string;
            equipment?: string;
          };
          if (!canPerform([exercise.equipment], userEquipment)) {
            equipmentWarnings.push(
              `התרגיל '${exercise.exerciseId || exercise.id}' לא תואם לציוד שלך`
            );
            const availability = getExerciseAvailability(
              [exercise.equipment],
              userEquipment
            );
            if (availability.substitutions) {
              Object.entries(availability.substitutions).forEach(
                ([orig, sub]) => {
                  substitutionSuggestions.push(`תחליף ל-${orig}: ${sub}`);
                }
              );
            } else {
              substitutionSuggestions.push(
                `נסה תרגיל משקל גוף במקום '${exercise.exerciseId || exercise.id}'`
              );
            }
            isValid = false;
          }
        });
        if (equipmentWarnings.length) warnings.push(...equipmentWarnings);
        if (substitutionSuggestions.length)
          warnings.push(...substitutionSuggestions);
      }

      // וידוא זמנים
      const startTime = workout.startTime;
      const endTime = workout.endTime;

      if (startTime && endTime) {
        const start = new Date(startTime);
        const end = new Date(endTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
          warnings.push(VALIDATION_MESSAGES.INVALID_WORKOUT_TIMES);
        } else if (end.getTime() <= start.getTime()) {
          warnings.push(VALIDATION_MESSAGES.END_TIME_BEFORE_START);
        }
      }

      // וידוא משך אימון
      const duration = workout.duration;
      if (duration !== undefined) {
        if (typeof duration !== "number" || duration < 0) {
          warnings.push(VALIDATION_MESSAGES.INVALID_DURATION);
        } else if (duration > 24 * 60) {
          // יותר מ-24 שעות
          warnings.push(VALIDATION_MESSAGES.EXCESSIVE_DURATION);
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
            warnings.push(VALIDATION_MESSAGES.NEGATIVE_SETS);
          }
          if (totalSetsCompleted > totalSetsPlanned * 2) {
            warnings.push(VALIDATION_MESSAGES.EXCESSIVE_COMPLETED_SETS);
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
        errors: [VALIDATION_MESSAGES.VALIDATION_ERROR],
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
          personalizedWarnings.push(VALIDATION_MESSAGES.LONG_WORKOUT_FOR_AGE);
        }
        if (workout.exercises && workout.exercises.length > 8) {
          personalizedWarnings.push(VALIDATION_MESSAGES.TOO_MANY_EXERCISES);
        }
        personalizedSuggestions.push(
          VALIDATION_MESSAGES.REST_IMPORTANT_FOR_AGE
        );
      } else if (
        personalData.age.includes("18_") ||
        personalData.age.includes("25_")
      ) {
        // המלצות לצעירים
        if (workout.duration && workout.duration < 30) {
          personalizedWarnings.push(
            VALIDATION_MESSAGES.SHORT_WORKOUT_FOR_YOUNG
          );
        }
        personalizedSuggestions.push(
          VALIDATION_MESSAGES.INCREASE_CHALLENGE_YOUNG
        );
      }
    }

    // ✅ בדיקות מותאמות למין
    if (personalData.gender === "female") {
      personalizedSuggestions.push(VALIDATION_MESSAGES.FEMALE_CORE_GLUTES);
    } else if (personalData.gender === "male") {
      personalizedSuggestions.push(VALIDATION_MESSAGES.MALE_BALANCE_BODY);
    }

    // ✅ בדיקות לפי משקל גוף (התאמת עומסים)
    if (personalData.weight && workout.exercises) {
      if (
        personalData.weight.includes("under_") ||
        personalData.weight.includes("50_")
      ) {
        personalizedSuggestions.push(VALIDATION_MESSAGES.LIGHT_WEIGHTS_START);
      } else if (
        personalData.weight.includes("over_90") ||
        personalData.weight.includes("over_100")
      ) {
        personalizedSuggestions.push(VALIDATION_MESSAGES.WARMUP_FOR_HEAVY);
      }
    }

    // ✅ בדיקות לפי רמת כושר
    if (personalData.fitnessLevel === "beginner") {
      if (workout.exercises && workout.exercises.length > 6) {
        personalizedWarnings.push(
          VALIDATION_MESSAGES.TOO_MANY_EXERCISES_BEGINNER
        );
      }
      personalizedSuggestions.push(VALIDATION_MESSAGES.BEGINNER_TECHNIQUE);
    } else if (personalData.fitnessLevel === "advanced") {
      personalizedSuggestions.push(VALIDATION_MESSAGES.ADVANCED_VARIATIONS);
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
}

export default WorkoutValidationService.getInstance();
