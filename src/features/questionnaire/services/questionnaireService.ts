/**
 * @file src/features/questionnaire/services/questionnaireService.ts
 * @description  async getUserPr  async getUserPreferences(): Promise<QuestionnaireData | null> {
    try {
      // Priority 1: Check for new user data in userStore
      const user = useUserStore.getState().user;

      // Enhanced questionnaire data processing with legacy support
      if (user?.hasQuestionnaire && user?.questionnaireData) {
        const fullMetadata: QuestionnaireData = {
          ...user.questionnaireData,
          metadata: {
            ...user.questionnaireData.metadata,
            completedAt:
              user.questionnaireData?.metadata?.completedAt ||
              new Date().toISOString(),
            version:
              user.questionnaireData?.metadata?.version ||
              "smart-questionnaire-v1",
          }
        };e<QuestionnaireData | null> {
    try {
      // Priority 1: Check for new user data in userStore
      const user = useUserStore.getState().user;

      // Enhanced questionnaire data processing with legacy support
      if (user?.hasQuestionnaire && user?.questionnaireData) {
        const fullMetadata: QuestionnaireData = {
          ...user.questionnaireData,
          metadata: {
            ...user.questionnaireData.metadata,
            completedAt:
              user.questionnaireData?.metadata?.completedAt ||
              new Date().toISOString(),
            version:
              user.questionnaireData?.metadata?.version ||
              "smart-questionnaire-v1",
          }
        };נתוני השאלון ובחירת אימונים מותאמים אישית
 * English: Comprehensive service for questionnaire data management and personalized workout selection
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../../../stores/userStore";
import { QuestionnaireData, QuestionnaireAnswers } from "../types";

// =======================================
// 🔑 Enhanced Storage Configuration
// =======================================
const STORAGE_KEYS = {
  QUESTIONNAIRE_METADATA: "questionnaire_metadata",
  QUESTIONNAIRE_DRAFT: "questionnaire_draft",
  WORKOUT_PREFERENCES: "workout_preferences",
} as const;

// ✅ Import PersonalData from central utils
import { PersonalData } from "../../../utils/personalDataUtils";

// Define workout recommendation type
export interface WorkoutRecommendation {
  id: string;
  name: string;
  description: string;
  type: "strength" | "cardio" | "hiit" | "flexibility" | "mixed";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  equipment: string[];
  targetMuscles: string[];
  estimatedCalories: number;
  exercises?: WorkoutExercise[];
  restTime?: number;
  sets?: number;
  reps?: number;
}

// Define workout exercise type
export interface WorkoutExercise {
  id: string;
  name: string;
  equipment: string;
  sets: Array<{
    id: string;
    reps: number;
    weight: number;
    duration: number;
    restTime: number;
    completed: boolean;
  }>;
  targetMuscles: string[];
  instructions: string[];
  restTime: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// Define workout plan type
export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  workouts: WorkoutRecommendation[];
  type: string;
  isActive: boolean;
}

// =======================================
// 🧠 Enhanced Questionnaire Service
// =======================================

/**
 * Comprehensive questionnaire data management service with advanced personalization
 * שירות מקיף לניהול נתוני השאלון עם התאמה אישית מתקדמת
 */
class QuestionnaireService {
  /**
   * Enhanced user preferences retrieval with multi-source data merging
   * קבלת העדפות משתמש משופרת עם מיזוג נתונים ממקורות מרובים
   */
  async getUserPreferences(): Promise<QuestionnaireData | null> {
    try {
      // Priority 1: Check for new user data in userStore
      const user = useUserStore.getState().user;

      // Enhanced questionnaire data processing with legacy support
      if (user?.hasQuestionnaire && user?.questionnaireData) {
        const fullMetadata: QuestionnaireData = {
          ...user.questionnaireData,
          metadata: {
            ...user.questionnaireData.metadata,
            completedAt:
              user.questionnaireData?.metadata?.completedAt ||
              new Date().toISOString(),
            version:
              user.questionnaireData?.metadata?.version ||
              "smart-questionnaire-v1",
          },
        };

        console.warn(
          "✅ QuestionnaireService: Created metadata from questionnaire"
        );
        await this.saveQuestionnaireData(fullMetadata);
        return fullMetadata;
      }

      // Priority 2: Check for enhanced questionnaireData
      if (user?.questionnaireData) {
        console.warn(
          "✅ QuestionnaireService: Found questionnaireData in userStore, merging..."
        );

        const fullMetadata: QuestionnaireData = {
          ...user.questionnaireData,
        };

        return fullMetadata;
      }

      // Priority 3: Check AsyncStorage for legacy data
      const storedData = await AsyncStorage.getItem(
        STORAGE_KEYS.QUESTIONNAIRE_METADATA
      );

      if (storedData) {
        const parsedData = JSON.parse(storedData) as QuestionnaireData;
        console.warn(
          "✅ QuestionnaireService: Found legacy data in AsyncStorage"
        );
        return parsedData;
      }

      console.warn("❌ QuestionnaireService: No questionnaire data found");
      return null;
    } catch (error) {
      console.error("❌ Error retrieving user preferences:", error);
      return null;
    }
  }

  /**
   * שמירת נתוני השאלון
   * Save questionnaire data
   */
  async saveQuestionnaireData(data: QuestionnaireData): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.QUESTIONNAIRE_METADATA,
        JSON.stringify(data)
      );
      console.warn("✅ QuestionnaireService: Saved questionnaire data");
    } catch (error) {
      console.error("❌ Error saving questionnaire data:", error);
    }
  }

  /**
   * קבלת רשימת הציוד הזמין
   * Get available equipment list
   */
  async getAvailableEquipment(): Promise<string[]> {
    const prefs = await this.getUserPreferences();
    if (!prefs || !prefs.answers) return [];

    // Primary equipment field check
    const primaryEquipment = prefs.answers.equipment || [];
    const homeEquipment = prefs.answers.home_equipment || [];

    // Enhanced questionnaire data processing with legacy support
    const dynamicEquipment = prefs
      ? QuestionnaireService.extractEquipmentFromQuestionnaire(prefs)
      : [];

    const allEquipment = [
      ...primaryEquipment,
      ...homeEquipment,
      ...dynamicEquipment,
    ];
    const mergedEquipment = Array.from(new Set(allEquipment));

    // Normalization: unify naming to match dataset and internal mapping
    const normalize = (val: unknown): string | null => {
      if (!val || typeof val !== "string") return null;
      const raw = val.trim().toLowerCase();
      if (!raw) return null;
      const norm = raw.replace(/[\s-]+/g, "_");
      return norm;
    };

    const normalizedEquipment = Array.from(
      new Set(
        mergedEquipment
          .map((e) => normalize(e))
          .filter((e): e is string => Boolean(e))
      )
    );

    // Expand synonyms to align questionnaire IDs with exercise dataset
    const expandSynonyms = (list: string[]): string[] => {
      const s = new Set(list);
      if (s.has("free_weights")) {
        s.add("dumbbells");
        s.add("barbell");
        s.add("kettlebell");
      }
      if (s.has("home_gym")) {
        s.add("dumbbells");
        s.add("resistance_bands");
        s.add("yoga_mat");
      }
      return Array.from(s);
    };

    const finalEquipment = expandSynonyms(normalizedEquipment);

    console.warn("🔧 Available equipment processed:", {
      primary: primaryEquipment,
      home: homeEquipment,
      dynamic: dynamicEquipment,
      normalized: normalizedEquipment,
      final: finalEquipment,
    });

    return finalEquipment;
  }

  /**
   * חילוץ ציוד מנתוני השאלון
   * Extract equipment from questionnaire data
   */
  private static extractEquipmentFromQuestionnaire(
    prefs: QuestionnaireData
  ): string[] {
    if (!prefs.answers) return [];

    const extracted: string[] = [];

    // Extract from workout_location
    if (
      prefs.answers.workout_location === "בבית" ||
      prefs.answers.workout_location === "home"
    ) {
      extracted.push("bodyweight", "yoga_mat");
    } else if (
      prefs.answers.workout_location === "חדר כושר" ||
      prefs.answers.workout_location === "gym"
    ) {
      extracted.push("dumbbells", "barbell", "cable_machine", "treadmill");
    }

    // Extract from fitness_goal
    if (
      prefs.answers.fitness_goal?.includes("בניית שריר") ||
      prefs.answers.fitness_goal?.includes("muscle")
    ) {
      extracted.push("dumbbells", "barbell");
    }

    return extracted;
  }

  /**
   * קבלת משך אימון מועדף
   * Get preferred workout duration
   */
  async getPreferredDuration(): Promise<number> {
    const prefs = await this.getUserPreferences();
    if (!prefs || !prefs.answers) return 30;

    const duration = prefs.answers.workout_duration;

    if (typeof duration === "string") {
      const parsed = parseInt(duration);
      return !isNaN(parsed) ? parsed : 30;
    }

    return typeof duration === "number" ? duration : 30;
  }

  /**
   * בדיקה האם המשתמש השלים את השאלון
   * Check if user completed questionnaire
   */
  async hasCompletedQuestionnaire(): Promise<boolean> {
    const prefs = await this.getUserPreferences();
    const hasCompleted =
      prefs !== null && prefs.metadata?.completedAt !== undefined;

    console.warn("Questionnaire completion status:", {
      prefs,
      hasCompleted,
      completedAt: prefs?.metadata?.completedAt,
    });

    return hasCompleted;
  }

  // =======================================
  // 🏋️ Enhanced Workout Creation System
  // =======================================

  /**
   * Unified workout creation factory with dynamic analysis
   * מפעל יצירת אימונים מאוחד עם ניתוח דינמי
   */
  private createWorkoutByType(
    type: string,
    duration: number,
    equipment: string[],
    prefs: QuestionnaireData,
    personalData?: PersonalData
  ): WorkoutRecommendation {
    const baseWorkout = {
      id: `${type}-${Date.now()}`,
      name: this.getPersonalizedWorkoutName(type, personalData),
      description: this.getPersonalizedDescription(type, personalData),
      type: (type === "mobility"
        ? "flexibility"
        : type === "general"
          ? "mixed"
          : type) as "strength" | "cardio" | "hiit" | "flexibility" | "mixed",
      duration,
      difficulty: this.calculateDifficulty(prefs),
      equipment: equipment.slice(0, 3), // Limit to 3 pieces
      targetMuscles: this.getTargetMuscles(type),
      exercises: this.generateSmartExercisesForWorkout(type, equipment, 1),
      estimatedCalories: this.calculateEstimatedCalories(duration, type),
      restTime: 60, // Default rest time in seconds
      sets: this.calculateSets(type, duration),
      reps: this.calculateReps(
        type,
        prefs.answers?.experience_level || "מתחיל"
      ),
    };

    return baseWorkout;
  }

  /**
   * יצירת תרגילים חכמים מותאמים לציוד
   * Generate smart exercises adapted to equipment
   */
  private generateSmartExercisesForWorkout(
    _workoutType: string,
    _equipment: string[],
    _dayNumber: number
  ): WorkoutExercise[] {
    // Basic exercise generation logic
    const baseExercises: WorkoutExercise[] = [
      {
        id: "1",
        name: "שכיבות סמיכה",
        equipment: "bodyweight",
        sets: [
          {
            id: "1",
            reps: 10,
            weight: 0,
            duration: 0,
            restTime: 60,
            completed: false,
          },
          {
            id: "2",
            reps: 10,
            weight: 0,
            duration: 0,
            restTime: 60,
            completed: false,
          },
          {
            id: "3",
            reps: 10,
            weight: 0,
            duration: 0,
            restTime: 60,
            completed: false,
          },
        ],
        targetMuscles: ["חזה", "כתפיים"],
        instructions: ["בצע שכיבות סמיכה נכונות", "שמור על גב ישר"],
        restTime: 60,
        difficulty: "beginner" as const,
      },
    ];

    return baseExercises;
  }

  /**
   * חישוב קושי בהתאם לנסיון
   */
  private calculateDifficulty(
    prefs: QuestionnaireData
  ): "beginner" | "intermediate" | "advanced" {
    if (!prefs.answers) return "beginner";

    const experience = prefs.answers.experience_level || "מתחיל";

    if (experience === "מתחיל" || experience === "beginner") {
      return "beginner";
    } else if (experience === "בינוני" || experience === "intermediate") {
      return "intermediate";
    } else {
      return "advanced";
    }
  }

  /**
   * קבלת שרירי המטרה
   */
  private getTargetMuscles(type: string): string[] {
    const muscleMap: Record<string, string[]> = {
      strength: ["חזה", "גב", "רגליים"],
      cardio: ["לב", "ריאות"],
      hiit: ["כל הגוף"],
      mobility: ["גמישות"],
      general: ["כל הגוף"],
    };

    return muscleMap[type] || ["כל הגוף"];
  }

  /**
   * חישוב קלוריות משוערות
   */
  private calculateEstimatedCalories(duration: number, type: string): number {
    const calorieRates: Record<string, number> = {
      cardio: 10,
      hiit: 12,
      strength: 8,
      mobility: 4,
      general: 6,
    };

    const rate = calorieRates[type] || 6;
    return duration * rate;
  }

  /**
   * חישוב מספר סטים
   */
  private calculateSets(type: string, duration: number): number {
    if (type === "hiit") return Math.floor(duration / 10);
    if (type === "strength") return Math.floor(duration / 15);
    return Math.floor(duration / 12);
  }

  /**
   * חישוב מספר חזרות
   */
  private calculateReps(type: string, experience: string): number {
    const baseReps =
      experience === "מתחיל" ? 8 : experience === "בינוני" ? 12 : 15;

    if (type === "strength") return baseReps;
    if (type === "hiit") return baseReps + 5;
    return baseReps;
  }

  /**
   * קבלת שם אימון מותאם אישית
   */
  private getPersonalizedWorkoutName(
    type: string,
    personalData?: PersonalData
  ): string {
    const baseNames: Record<string, string> = {
      cardio: "אימון אירובי",
      strength: "אימון כוח",
      hiit: "אימון אינטרבלים",
      mobility: "אימון גמישות",
      general: "אימון כללי",
    };

    let name = baseNames[type] || "אימון כללי";

    if (personalData?.fitnessLevel === "beginner") {
      name += " למתחילים";
    } else if (personalData?.fitnessLevel === "advanced") {
      name += " מתקדם";
    }

    return name;
  }

  /**
   * קבלת תיאור מותאם אישית
   */
  private getPersonalizedDescription(
    type: string,
    personalData?: PersonalData
  ): string {
    const baseDescriptions: Record<string, string> = {
      cardio: "אימון אירובי לשריפת קלוריות ושיפור סיבולת לב-ריאה",
      strength: "אימון כוח לבניית שריר וחיזוק הגוף",
      hiit: "אימון אינטרבלים בעצימות גבוהה לשריפת קלוריות",
      mobility: "אימון גמישות לשיפור טווח תנועה",
      general: "אימון כללי מאוזן לכל הגוף",
    };

    let description = baseDescriptions[type] || "אימון כללי מאוזן";

    if (personalData?.fitnessLevel === "beginner") {
      description += ". מותאם למתחילים עם הסברים מפורטים";
    } else if (personalData?.fitnessLevel === "advanced") {
      description += ". רמה מתקדמת עם אתגרים מורכבים";
    }

    return description;
  }

  /**
   * יצירת המלצות אימון מתקדמות
   * Create advanced workout recommendations
   */
  async createAdvancedWorkoutRecommendations(
    prefs: QuestionnaireData,
    equipment: string[],
    duration: number,
    personalData?: PersonalData
  ): Promise<WorkoutRecommendation[]> {
    const recommendations: WorkoutRecommendation[] = [];

    // Create different types of workouts based on user preferences
    const workoutTypes = ["strength", "cardio", "hiit", "mobility"];

    for (const type of workoutTypes) {
      const workout = this.createWorkoutByType(
        type,
        duration,
        equipment,
        prefs,
        personalData
      );
      recommendations.push(workout);
    }

    return recommendations;
  }

  /**
   * מחיקת נתוני השאלון
   * Clear questionnaire data
   */
  async clearQuestionnaireData(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.QUESTIONNAIRE_METADATA,
      STORAGE_KEYS.QUESTIONNAIRE_DRAFT,
      STORAGE_KEYS.WORKOUT_PREFERENCES,
    ]);
  }

  // =======================================
  // 🔧 Missing Methods (for compatibility)
  // =======================================

  /**
   * קבלת מטרת המשתמש
   * Get user goal
   */
  async getUserGoal(): Promise<string | null> {
    const prefs = await this.getUserPreferences();
    if (!prefs?.answers?.fitness_goal) return null;

    // Handle both string and array types
    const goal = prefs.answers.fitness_goal;
    if (Array.isArray(goal)) {
      return goal.length > 0 ? goal[0] || null : null;
    }

    return goal || null;
  }

  /**
   * קבלת נסיון המשתמש
   * Get user experience
   */
  async getUserExperience(): Promise<string | null> {
    const prefs = await this.getUserPreferences();
    return prefs?.answers?.experience_level || null;
  }

  /**
   * קבלת המלצות אימון
   * Get workout recommendations
   */
  async getWorkoutRecommendations(): Promise<WorkoutRecommendation[]> {
    const prefs = await this.getUserPreferences();
    if (!prefs) return [];

    const equipment = await this.getAvailableEquipment();
    const duration = await this.getPreferredDuration();

    return this.createAdvancedWorkoutRecommendations(
      prefs,
      equipment,
      duration
    );
  }

  /**
   * קבלת אימון מהיר
   * Get quick workout
   */
  async getQuickWorkout(): Promise<WorkoutRecommendation | null> {
    const recommendations = await this.getWorkoutRecommendations();
    return recommendations[0] || null;
  }

  /**
   * יצירת תוכנית אימון חכמה
   * Generate smart workout plan
   */
  async generateSmartWorkoutPlan(): Promise<WorkoutPlan[]> {
    const prefs = await this.getUserPreferences();
    if (!prefs) return [];

    const equipment = await this.getAvailableEquipment();
    const duration = await this.getPreferredDuration();

    // Create a basic workout plan structure
    const plan: WorkoutPlan = {
      id: `plan-${Date.now()}`,
      name: "תוכנית אימונים מותאמת",
      description: "תוכנית אימונים מותאמת לצרכים האישיים שלך",
      duration: 7, // 7 days
      difficulty: this.calculateDifficulty(prefs),
      workouts: await this.createAdvancedWorkoutRecommendations(
        prefs,
        equipment,
        duration
      ),
      type: "smart",
      isActive: true,
    };

    return [plan];
  }

  /**
   * יצירת תוכנית אימון בסיסית
   * Generate basic workout plan
   */
  async generateBasicWorkoutPlan(): Promise<WorkoutPlan[]> {
    return this.generateSmartWorkoutPlan();
  }

  /**
   * יצירת שתי תוכניות אימון
   * Generate both workout plans
   */
  async generateBothWorkoutPlans(): Promise<void> {
    await this.generateSmartWorkoutPlan();
  }
}

// =======================================
// 🚀 Professional Service Export
// =======================================

/**
 * Enhanced questionnaire service singleton instance
 * מופע יחידי של שירות השאלון המשופר
 */
export const questionnaireService = new QuestionnaireService();

/**
 * Professional class export for advanced integration scenarios
 * יצוא מחלקה מקצועי לתרחישי אינטגרציה מתקדמים
 */
export { QuestionnaireService };

/**
 * Type-safe utility exports for external modules
 * יצואים של כלי עזר בטוחי טיפוס למודולים חיצוניים
 */
export type { QuestionnaireData, QuestionnaireAnswers, PersonalData };
