/**
 * @file src/services/questionnaireService.ts
 * @brief שירות לניהול נתוני השאלון ובחירת אימונים מותאמים אישית
 * @brief Service for managing questionnaire data and selecting personalized workouts
 * @dependencies AsyncStorage, userStore
 * @notes שירות מרכזי לכל הפעולות הקשורות לנתוני השאלון
 * @notes Central service for all questionnaire       case "general_health":
      case "שמירה על כושר":
      case "fitness_maintenance":
        recommendations.push(
          this.createBalancedWorkout(duration, equipment, prefs),
          this.createFunctionalWorkout(duration, equipment, prefs),
          this.createMobilityWorkout(duration, equipment, prefs)
        );
        break;erations
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../stores/userStore";

// טיפוסים
// Types
export interface QuestionnaireMetadata {
  // נתוני בסיס
  // Basic data
  age?: string;
  gender?: string;
  goal?: string;
  experience?: string;
  frequency?: string;
  duration?: string;
  location?: string;

  // נתוני בריאות
  // Health data
  height?: number;
  weight?: number;
  health_conditions?: string[];
  injury_type?: string;

  // נתוני אימון
  // Training data
  home_equipment?: string[];
  gym_equipment?: string[];
  available_equipment?: string[]; // 🔧 תמיכה במשתמש מדעי
  workout_preference?: string[];

  // נתוני אורח חיים
  // Lifestyle data
  diet_type?: string;
  sleep_hours?: string;
  stress_level?: string;

  // נתוני כושר
  // Fitness data
  fitness_assessment?: string;
  pushups_count?: string;
  plank_duration?: string;
  pullups_count?: string;

  // מטא-דאטה
  // Metadata
  completedAt?: string;
  version?: string;
  analytics?: Record<string, unknown>;
  additional_notes?: string;
}

export interface WorkoutRecommendation {
  id: string;
  name: string;
  description: string;
  duration: number; // בדקות / in minutes
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment: string[];
  targetMuscles: string[];
  type: "strength" | "cardio" | "hiit" | "flexibility" | "mixed";
  estimatedCalories?: number;
  exercises?: Exercise[]; // רשימת תרגילים / exercise list
}

// טיפוס עבור תרגיל
interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  duration?: number;
  restTime?: number;
}

// מפתחות אחסון
// Storage keys
const STORAGE_KEYS = {
  QUESTIONNAIRE_METADATA: "questionnaire_metadata",
  QUESTIONNAIRE_DRAFT: "questionnaire_draft",
  WORKOUT_PREFERENCES: "workout_preferences",
};

/**
 * שירות ניהול נתוני השאלון
 * Questionnaire data management service
 */
class QuestionnaireService {
  /**
   * קבלת נתוני השאלון המלאים
   * Get complete questionnaire data
   */
  async getUserPreferences(): Promise<QuestionnaireMetadata | null> {
    try {
      console.log("🔍 getUserPreferences - מתחיל...");
      // בדוק קודם אם יש משתמש חדש ב-userStore
      const user = useUserStore.getState().user;
      console.log("🔍 user from userStore:", user);

      // אם יש נתונים חדשים ב-userStore, תן להם עדיפות תמיד
      if (user?.questionnaire) {
        console.log("🔍 נמצא questionnaire ב-userStore:", user.questionnaire);

        // יצירת metadata מלא מהשאלון
        const fullMetadata = {
          // העתק את כל הנתונים מהשאלון
          ...user.questionnaire,
          // וודא שיש completedAt
          completedAt:
            user.questionnaireData?.completedAt || new Date().toISOString(),
          version: user.questionnaireData?.version || "smart-questionnaire-v1",
        };

        console.log("🔍 fullMetadata שנוצר מהשאלון:", fullMetadata);
        // שמור את הנתונים בפורמט החדש (יחליף את הישנים)
        await this.saveQuestionnaireData(fullMetadata);
        return fullMetadata;
      }

      // אם יש questionnaireData, השתמש בו
      if (user?.questionnaireData) {
        console.log(
          "🔍 נמצא questionnaireData ב-userStore:",
          user.questionnaireData
        );
        // יצירת metadata מלא עם completedAt
        const fullMetadata = {
          // נתונים מ-answers (השאלון האמיתי)
          ...user.questionnaireData.answers,
          // נתונים מ-metadata (מטא-דאטה)
          ...user.questionnaireData.metadata,
          // completedAt מהשדה הנכון
          completedAt: user.questionnaireData.completedAt,
        };

        console.log("🔍 fullMetadata שנוצר מ-questionnaireData:", fullMetadata);
        // שמור את הנתונים בפורמט החדש (יחליף את הישנים)
        await this.saveQuestionnaireData(fullMetadata);
        return fullMetadata;
      }

      // רק אם אין נתונים ב-userStore, נסה לקרוא מ-AsyncStorage
      const metadata = await AsyncStorage.getItem(
        STORAGE_KEYS.QUESTIONNAIRE_METADATA
      );
      if (metadata) {
        const parsed = JSON.parse(metadata);
        console.log(
          "🔍 getUserPreferences - מצא נתונים ב-AsyncStorage:",
          parsed
        );
        return parsed;
      }

      console.log("🔍 getUserPreferences - לא מצא נתונים");
      return null;
    } catch (error) {
      console.error("Error getting user preferences:", error);
      return null;
    }
  }

  /**
   * קבלת מטרת האימון של המשתמש
   * Get user's training goal
   */
  async getUserGoal(): Promise<string> {
    const prefs = await this.getUserPreferences();
    return prefs?.goal || "בריאות כללית";
  }

  /**
   * קבלת רמת הניסיון
   * Get experience level
   */
  async getUserExperience(): Promise<string> {
    const prefs = await this.getUserPreferences();
    return prefs?.experience || "מתחיל";
  }

  /**
   * קבלת רשימת הציוד הזמין
   * Get available equipment list
   */
  async getAvailableEquipment(): Promise<string[]> {
    console.log("🔍 questionnaireService.getAvailableEquipment - מתחיל...");
    const prefs = await this.getUserPreferences();
    console.log("🔍 prefs מתוך getUserPreferences:", prefs);

    const homeEquipment = prefs?.home_equipment || [];
    const gymEquipment = prefs?.gym_equipment || [];
    console.log("🔍 homeEquipment:", homeEquipment);
    console.log("🔍 gymEquipment:", gymEquipment);

    // 🔧 FIX: תמיכה במשתמש מדעי - בדיקת available_equipment
    // Support for scientific user - check available_equipment
    const availableEquipment = prefs?.available_equipment || [];
    console.log("🔍 availableEquipment:", availableEquipment);

    // 🆕 תמיכה בשאלות ציוד דינמיות חדשות
    // Support for new dynamic equipment questions
    const dynamicEquipment =
      QuestionnaireService.extractEquipmentFromQuestionnaire(prefs);
    console.log("🔍 dynamicEquipment:", dynamicEquipment);

    // מיזוג רשימות ללא כפילויות
    // Merge lists without duplicates
    const mergedEquipment = [
      ...new Set([
        ...homeEquipment,
        ...gymEquipment,
        ...availableEquipment,
        ...dynamicEquipment,
      ]),
    ];

    console.log("🔍 mergedEquipment final:", mergedEquipment);
    return mergedEquipment;
  }

  /**
   * חילוץ ציוד מהשאלות הדינמיות החדשות
   * Extract equipment from new dynamic questions
   */
  private static extractExperienceFromQuestionnaire(prefs: any): string {
    // תמיכה בפורמט החדש - מחפש בדינמיים
    // Support new format - search in dynamic questions
    if (prefs.dynamicQuestions) {
      const experienceQuestion = prefs.dynamicQuestions.find(
        (q: any) => q.questionId === "experience"
      );
      if (experienceQuestion && experienceQuestion.answer) {
        return experienceQuestion.answer;
      }
    }

    // תמיכה לאחור בפורמט הישן
    // Backward compatibility with old format
    return prefs.experience || "מתחיל";
  }

  private static extractEquipmentFromQuestionnaire(prefs: any): string[] {
    console.log("🔍 extractEquipmentFromQuestionnaire - prefs:", prefs);
    const equipment: string[] = [];

    // שאלות ציוד דינמיות חדשות - מעודכן!
    const dynamicQuestions = [
      "bodyweight_equipment_options", // ציוד ביתי בסיסי
      "home_equipment_options", // ציוד ביתי מתקדם
      "gym_equipment_options", // ציוד חדר כושר
    ];

    dynamicQuestions.forEach((questionId) => {
      const answer = prefs?.[questionId];
      console.log(`🔍 בדיקת ${questionId}:`, answer);
      if (Array.isArray(answer)) {
        answer.forEach((option: any) => {
          console.log(`🔍 אפשרות:`, option);
          if (option?.metadata?.equipment) {
            console.log(`🔍 מוסיף ציוד:`, option.metadata.equipment);
            equipment.push(...option.metadata.equipment);
          }
        });
      }
    });

    console.log("🔍 ציוד שנמצא לפני הסינון:", equipment);
    const result = [...new Set(equipment)]; // ללא כפילויות
    console.log("🔍 ציוד סופי אחרי הסינון:", result);
    return result;
  }

  /**
   * קבלת משך אימון מועדף
   * Get preferred workout duration
   */
  async getPreferredDuration(): Promise<number> {
    const prefs = await this.getUserPreferences();
    const duration = prefs?.duration || "45-60-min";

    // המרה לדקות - תמיכה בפורמטים ישנים וחדשים
    // Convert to minutes - support old and new formats
    const durationMap: { [key: string]: number } = {
      // פורמט חדש
      "20-30-min": 25,
      "30-45-min": 37,
      "45-60-min": 52,
      "60-90-min": 75,
      "90-plus-min": 105,
      // פורמט ישן (לתמיכה לאחור)
      "20-30 דקות": 25,
      "30-45 דקות": 37,
      "45-60 דקות": 52,
      "60-90 דקות": 75,
      "90+ דקות": 105,
    };

    return durationMap[duration] || 45;
  }

  /**
   * בדיקה האם המשתמש השלים את השאלון
   * Check if user completed questionnaire
   */
  async hasCompletedQuestionnaire(): Promise<boolean> {
    const prefs = await this.getUserPreferences();
    const hasCompleted = prefs !== null && prefs.completedAt !== undefined;

    console.log("🔍 hasCompletedQuestionnaire בדיקה:", {
      prefs,
      hasCompleted,
      completedAt: prefs?.completedAt,
    });

    return hasCompleted;
  }

  /**
   * קבלת המלצות אימון מותאמות אישית
   * Get personalized workout recommendations
   */
  async getWorkoutRecommendations(): Promise<WorkoutRecommendation[]> {
    const prefs = await this.getUserPreferences();
    if (!prefs) return [];

    const recommendations: WorkoutRecommendation[] = [];
    const equipment = await this.getAvailableEquipment();
    const duration = await this.getPreferredDuration();

    // המלצות לפי מטרה - תמיכה בפורמטים ישנים וחדשים
    // Recommendations by goal - support old and new formats
    switch (prefs.goal) {
      case "ירידה במשקל":
      case "weight_loss":
        recommendations.push(
          this.createCardioWorkout(duration, equipment, prefs),
          this.createHIITWorkout(Math.min(duration, 30), equipment, prefs),
          this.createCircuitWorkout(duration, equipment, prefs)
        );
        break;

      case "עליה במסת שריר":
      case "muscle_gain":
        recommendations.push(
          this.createUpperBodyWorkout(duration, equipment, prefs),
          this.createLowerBodyWorkout(duration, equipment, prefs),
          this.createPushPullWorkout(duration, equipment, prefs)
        );
        break;

      case "שיפור כוח":
      case "strength_improvement":
        recommendations.push(
          this.createStrengthWorkout(duration, equipment, prefs),
          this.createPowerWorkout(duration, equipment, prefs),
          this.createCompoundWorkout(duration, equipment, prefs)
        );
        break;

      case "שיפור סיבולת":
      case "endurance_improvement":
        recommendations.push(
          this.createEnduranceWorkout(duration, equipment, prefs),
          this.createCardioWorkout(duration, equipment, prefs),
          this.createMetabolicWorkout(duration, equipment, prefs)
        );
        break;

      case "בריאות כללית":
      case "general_health":
        recommendations.push(
          this.createFullBodyWorkout(duration, equipment, prefs),
          this.createFunctionalWorkout(duration, equipment, prefs),
          this.createBalancedWorkout(duration, equipment, prefs)
        );
        break;

      case "שיקום מפציעה":
        recommendations.push(
          this.createRehabWorkout(duration, equipment, prefs),
          this.createMobilityWorkout(duration, equipment, prefs),
          this.createLowImpactWorkout(duration, equipment, prefs)
        );
        break;

      default:
        recommendations.push(
          this.createGeneralWorkout(duration, equipment, prefs)
        );
    }

    // סינון לפי זמינות ציוד
    // Filter by equipment availability
    return recommendations.filter((workout) =>
      workout.equipment.every(
        (eq) => equipment.includes(eq) || eq === "bodyweight"
      )
    );
  }

  /**
   * קבלת אימון מהיר מומלץ
   * Get recommended quick workout
   */
  async getQuickWorkout(): Promise<WorkoutRecommendation | null> {
    const recommendations = await this.getWorkoutRecommendations();
    if (recommendations.length === 0) return null;

    // בחירת אימון לפי העדפות המשתמש
    // Select workout based on user preferences
    const prefs = await this.getUserPreferences();

    // אם יש העדפת סוג אימון
    // If there's a workout type preference
    if (prefs?.workout_preference && prefs.workout_preference.length > 0) {
      const preferredType = prefs.workout_preference[0];
      const matchingWorkout = recommendations.find(
        (w) =>
          w.name.includes(preferredType) ||
          w.type === this.mapPreferenceToType(preferredType)
      );
      if (matchingWorkout) return matchingWorkout;
    }

    // ברירת מחדל - האימון הראשון המומלץ
    // Default - first recommended workout
    return recommendations[0];
  }

  /**
   * שמירת נתוני השאלון
   * Save questionnaire data
   */
  async saveQuestionnaireData(data: QuestionnaireMetadata): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.QUESTIONNAIRE_METADATA,
        JSON.stringify({
          ...data,
          completedAt: data.completedAt || new Date().toISOString(), // שמור את completedAt הקיים או יצור חדש
          version: "2.0",
        })
      );
    } catch (error) {
      console.error("Error saving questionnaire data:", error);
      throw error;
    }
  }

  /**
   * מחיקת נתוני השאלון
   * Clear questionnaire data
   */
  async clearQuestionnaireData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.QUESTIONNAIRE_METADATA,
        STORAGE_KEYS.QUESTIONNAIRE_DRAFT,
        STORAGE_KEYS.WORKOUT_PREFERENCES,
      ]);
    } catch (error) {
      console.error("Error clearing questionnaire data:", error);
      throw error;
    }
  }

  // פונקציות עזר ליצירת אימונים
  // Helper functions for creating workouts

  private createCardioWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "cardio-1",
      name: "אימון קרדיו שורף קלוריות",
      description: "אימון אירובי לשריפת קלוריות ושיפור סיבולת לב-ריאה",
      duration,
      difficulty: this.getDifficultyByExperience(prefs.experience),
      equipment: ["bodyweight"],
      targetMuscles: ["לב", "ריאות"],
      type: "cardio",
      estimatedCalories: Math.round(duration * 10),
    };
  }

  private createHIITWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "hiit-1",
      name: "HIIT אינטנסיבי",
      description: "אימון אינטרוולים בעצימות גבוהה לשריפת קלוריות מקסימלית",
      duration: Math.min(duration, 30),
      difficulty: this.getDifficultyByExperience(prefs.experience),
      equipment: ["bodyweight"],
      targetMuscles: ["גוף מלא"],
      type: "hiit",
      estimatedCalories: Math.round(duration * 15),
    };
  }

  private createUpperBodyWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    const hasWeights = equipment.some(
      (eq) => eq.includes("dumbbell") || eq.includes("barbell")
    );

    return {
      id: "upper-1",
      name: "אימון פלג גוף עליון",
      description: "אימון מקיף לחיזוק וחיטוב פלג גוף עליון",
      duration,
      difficulty: this.getDifficultyByExperience(prefs.experience),
      equipment: hasWeights ? ["dumbbells", "barbell"] : ["bodyweight"],
      targetMuscles: ["חזה", "גב", "כתפיים", "ידיים"],
      type: "strength",
      estimatedCalories: Math.round(duration * 8),
    };
  }

  private createLowerBodyWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "lower-1",
      name: "אימון רגליים וישבן",
      description: "אימון מקיף לחיזוק רגליים וישבן",
      duration,
      difficulty: this.getDifficultyByExperience(prefs.experience),
      equipment: equipment.includes("barbell") ? ["barbell"] : ["bodyweight"],
      targetMuscles: ["רגליים", "ישבן", "שוקיים"],
      type: "strength",
      estimatedCalories: Math.round(duration * 9),
    };
  }

  private createFullBodyWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "fullbody-1",
      name: "אימון גוף מלא מאוזן",
      description: "אימון מקיף לכל שרירי הגוף",
      duration,
      difficulty: this.getDifficultyByExperience(prefs.experience),
      equipment: ["bodyweight"],
      targetMuscles: ["גוף מלא"],
      type: "mixed",
      estimatedCalories: Math.round(duration * 10),
    };
  }

  private createCircuitWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "circuit-1",
      name: "אימון מעגלים",
      description: "אימון מעגלים המשלב כוח וסיבולת",
      duration,
      difficulty: this.getDifficultyByExperience(prefs.experience),
      equipment: ["bodyweight"],
      targetMuscles: ["גוף מלא"],
      type: "mixed",
      estimatedCalories: Math.round(duration * 12),
    };
  }

  private createStrengthWorkout(
    duration: number,
    _equipment: string[],
    _prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "strength-1",
      name: "אימון כוח מתקדם",
      description: "אימון כוח עם דגש על תרגילים מורכבים",
      duration,
      difficulty: "advanced",
      equipment: ["barbell", "dumbbells"],
      targetMuscles: ["גוף מלא"],
      type: "strength",
      estimatedCalories: Math.round(duration * 7),
    };
  }

  private createPowerWorkout(
    duration: number,
    _equipment: string[],
    _prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "power-1",
      name: "אימון כוח מתפרץ",
      description: "אימון לפיתוח כוח מתפרץ ומהירות",
      duration,
      difficulty: "advanced",
      equipment: ["barbell"],
      targetMuscles: ["גוף מלא"],
      type: "strength",
      estimatedCalories: Math.round(duration * 8),
    };
  }

  private createCompoundWorkout(
    duration: number,
    _equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "compound-1",
      name: "תרגילים מורכבים",
      description: "אימון המתמקד בתרגילים מורכבים רב-מפרקיים",
      duration,
      difficulty: this.getDifficultyByExperience(prefs.experience),
      equipment: ["barbell", "dumbbells"],
      targetMuscles: ["גוף מלא"],
      type: "strength",
      estimatedCalories: Math.round(duration * 9),
    };
  }

  private createEnduranceWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "endurance-1",
      name: "אימון סיבולת",
      description: "אימון לשיפור סיבולת שרירית ולב-ריאה",
      duration,
      difficulty: this.getDifficultyByExperience(prefs.experience),
      equipment: ["bodyweight"],
      targetMuscles: ["גוף מלא"],
      type: "cardio",
      estimatedCalories: Math.round(duration * 11),
    };
  }

  private createMetabolicWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "metabolic-1",
      name: "אימון מטבולי",
      description: "אימון להאצת חילוף החומרים",
      duration,
      difficulty: this.getDifficultyByExperience(prefs.experience),
      equipment: ["bodyweight", "dumbbells"],
      targetMuscles: ["גוף מלא"],
      type: "hiit",
      estimatedCalories: Math.round(duration * 14),
    };
  }

  private createPushPullWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "pushpull-1",
      name: "דחיפה/משיכה",
      description: "אימון המחלק בין תרגילי דחיפה למשיכה",
      duration,
      difficulty: this.getDifficultyByExperience(prefs.experience),
      equipment: ["dumbbells", "barbell"],
      targetMuscles: ["חזה", "גב", "כתפיים", "ידיים"],
      type: "strength",
      estimatedCalories: Math.round(duration * 8),
    };
  }

  private createFunctionalWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "functional-1",
      name: "אימון פונקציונלי",
      description: "אימון לשיפור תנועות יומיומיות",
      duration,
      difficulty: this.getDifficultyByExperience(prefs.experience),
      equipment: ["bodyweight"],
      targetMuscles: ["גוף מלא"],
      type: "mixed",
      estimatedCalories: Math.round(duration * 9),
    };
  }

  private createBalancedWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "balanced-1",
      name: "אימון מאוזן",
      description: "אימון המשלב כוח, סיבולת וגמישות",
      duration,
      difficulty: this.getDifficultyByExperience(prefs.experience),
      equipment: ["bodyweight"],
      targetMuscles: ["גוף מלא"],
      type: "mixed",
      estimatedCalories: Math.round(duration * 10),
    };
  }

  private createRehabWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "rehab-1",
      name: "אימון שיקומי",
      description: "אימון עדין לשיקום ומניעת פציעות",
      duration,
      difficulty: "beginner",
      equipment: ["bodyweight"],
      targetMuscles: this.getRehabTargetMuscles(prefs.injury_type),
      type: "flexibility",
      estimatedCalories: Math.round(duration * 4),
    };
  }

  private createMobilityWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "mobility-1",
      name: "אימון ניידות וגמישות",
      description: "אימון לשיפור טווחי תנועה וגמישות",
      duration,
      difficulty: "beginner",
      equipment: ["bodyweight"],
      targetMuscles: ["גוף מלא"],
      type: "flexibility",
      estimatedCalories: Math.round(duration * 3),
    };
  }

  private createLowImpactWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "lowimpact-1",
      name: "אימון בעצימות נמוכה",
      description: "אימון עדין למפרקים",
      duration,
      difficulty: "beginner",
      equipment: ["bodyweight"],
      targetMuscles: ["גוף מלא"],
      type: "mixed",
      estimatedCalories: Math.round(duration * 5),
    };
  }

  private createGeneralWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    return {
      id: "general-1",
      name: "אימון כללי",
      description: "אימון מגוון לכלל הגוף",
      duration,
      difficulty: this.getDifficultyByExperience(prefs.experience),
      equipment: ["bodyweight"],
      targetMuscles: ["גוף מלא"],
      type: "mixed",
      estimatedCalories: Math.round(duration * 8),
    };
  }

  // פונקציות עזר
  // Helper functions

  private getDifficultyByExperience(
    experience?: string
  ): "beginner" | "intermediate" | "advanced" {
    switch (experience) {
      case "מתחיל (0-6 חודשים)":
        return "beginner";
      case "בינוני (6-24 חודשים)":
        return "intermediate";
      case "מתקדם (2-5 שנים)":
      case "מקצועי (5+ שנים)":
      case "ספורטאי תחרותי":
        return "advanced";
      default:
        return "beginner";
    }
  }

  private mapPreferenceToType(
    preference: string
  ): WorkoutRecommendation["type"] {
    const mapping: { [key: string]: WorkoutRecommendation["type"] } = {
      "אימוני כוח": "strength",
      "אימוני סיבולת": "cardio",
      HIIT: "hiit",
      "יוגה/פילאטיס": "flexibility",
      קרוספיט: "mixed",
      "אימונים פונקציונליים": "mixed",
      "אימוני משקל גוף": "strength",
    };
    return mapping[preference] || "mixed";
  }

  private getRehabTargetMuscles(injuryType?: string): string[] {
    switch (injuryType) {
      case "פציעת גב":
        return ["גב", "core"];
      case "פציעת כתף":
        return ["כתפיים", "גב עליון"];
      case "פציעת ברך":
        return ["רגליים", "ישבן"];
      case "פציעת קרסול":
        return ["שוקיים", "רגליים"];
      case "פציעת מרפק":
        return ["ידיים", "אמות"];
      case "פציעת צוואר":
        return ["צוואר", "גב עליון"];
      default:
        return ["גוף מלא"];
    }
  }
}

// יצוא instance יחיד
// Export singleton instance
export const questionnaireService = new QuestionnaireService();

// יצוא גם את המחלקה למקרי שימוש מיוחדים
// Also export the class for special use cases
export default QuestionnaireService;
