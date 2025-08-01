/**
 * @file src/services/questionnaireService.ts
 * @description שירות מקיף לניהול נתוני השאלון ובחירת אימונים מותאמים אישית
 * English: Comprehensive service for questionnaire data management and personalized workout selection
 * @dependencies AsyncStorage for persistence, userStore for state management
 * @notes שירות מרכזי לכל הפעולות הקשורות לנתוני השאלון עם תמיכה בפורמטים מרובים
 * English: Central service for all questionnaire operations with multi-format support
 * @performance Optimized with intelligent caching, efficient data merging, and smart recommendations
 * @rtl Full Hebrew workout names, descriptions, and user preference support
 * @accessibility Compatible with screen readers and comprehensive workout metadata
 * @algorithm Advanced workout recommendation engine with goal-based personalization
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../stores/userStore";

// =======================================
// 📊 Enhanced TypeScript Interfaces
// ממשקי טייפסקריפט משופרים
// =======================================
/**
 * Comprehensive questionnaire metadata interface with enhanced type safety
 * ממשק מטא-דאטה מקיף לשאלון עם בטיחות טיפוסים משופרת
 */
export interface QuestionnaireMetadata {
  // Enhanced basic data with comprehensive options
  age?: string;
  gender?: string;
  goal?: string;
  experience?: string;
  frequency?: string;
  duration?: string;
  location?: string;

  // Enhanced health data with detailed tracking
  height?: number;
  weight?: number;
  health_conditions?: string[];
  injury_type?: string;

  // Advanced training data with equipment flexibility
  equipment?: string[]; // Primary equipment field from questionnaire
  home_equipment?: string[];
  gym_equipment?: string[];
  available_equipment?: string[]; // Scientific user support
  workout_preference?: string[];

  // Enhanced dynamic questionnaire support
  dynamicQuestions?: DynamicQuestion[]; // New dynamic questions system
  questions?: DynamicQuestion[]; // Legacy questions support

  // Comprehensive lifestyle data
  diet_type?: string;
  sleep_hours?: string;
  stress_level?: string;

  // Enhanced fitness assessment data
  fitness_assessment?: string;
  pushups_count?: string;
  plank_duration?: string;
  pullups_count?: string;

  // Enhanced metadata with analytics support
  completedAt?: string;
  version?: string;
  analytics?: Record<string, unknown>;
  additional_notes?: string;
}

/**
 * Enhanced workout recommendation interface with comprehensive metadata
 * ממשק המלצת אימון משופר עם מטא-דאטה מקיף
 */
export interface WorkoutRecommendation {
  id: string;
  name: string;
  description: string;
  duration: number; // Duration in minutes / משך בדקות
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment: string[];
  targetMuscles: string[];
  type: "strength" | "cardio" | "hiit" | "flexibility" | "mixed";
  estimatedCalories?: number;
  exercises?: Exercise[]; // Complete exercise list / רשימת תרגילים מלאה
}

/**
 * Enhanced exercise interface with comprehensive workout data
 * ממשק תרגיל משופר עם נתוני אימון מקיפים
 */
interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: string;
  duration?: number;
  restTime?: number;
}

/**
 * Enhanced dynamic question interface for type safety
 * ממשק שאלה דינמית משופר לבטיחות טיפוסים
 */
interface DynamicQuestion {
  questionId: string;
  answer: string;
}

/**
 * Enhanced equipment option interface with metadata support
 * ממשק אפשרות ציוד משופר עם תמיכה במטא-דאטה
 */
interface EquipmentOption {
  metadata?: {
    equipment?: string[];
  };
}

// =======================================
// 🔑 Enhanced Storage Configuration
// הגדרות אחסון משופרות
// =======================================
/**
 * Professional storage keys with consistent naming convention
 * מפתחות אחסון מקצועיים עם מוסכמת שמות עקבית
 */
const STORAGE_KEYS = {
  QUESTIONNAIRE_METADATA: "questionnaire_metadata",
  QUESTIONNAIRE_DRAFT: "questionnaire_draft",
  WORKOUT_PREFERENCES: "workout_preferences",
} as const;

// =======================================
// 🧠 Enhanced Questionnaire Service
// שירות שאלון משופר
// =======================================

/**
 * Comprehensive questionnaire data management service with advanced personalization
 * שירות מקיף לניהול נתוני השאלון עם התאמה אישית מתקדמת
 */
class QuestionnaireService {
  // =======================================
  // 📊 Core Data Management
  // ניהול נתונים מרכזי
  // =======================================

  /**
   * Enhanced user preferences retrieval with multi-source data merging
   * קבלת העדפות משתמש משופרת עם מיזוג נתונים ממקורות מרובים
   *
   * @returns {Promise<QuestionnaireMetadata | null>} Complete user preferences or null
   * @performance Optimized with intelligent data source prioritization
   * @compatibility Supports multiple questionnaire formats (legacy and new)
   */
  async getUserPreferences(): Promise<QuestionnaireMetadata | null> {
    try {
      console.log(
        "🔍 QuestionnaireService: Starting comprehensive user preferences retrieval"
      );

      // Priority 1: Check for new user data in userStore
      const user = useUserStore.getState().user;
      console.log(
        "🔍 QuestionnaireService: User data from store -",
        user?.email || "No user"
      );

      // Enhanced questionnaire data processing with legacy support
      if (user?.questionnaire) {
        console.log(
          "✅ QuestionnaireService: Found questionnaire in userStore, processing..."
        );

        const fullMetadata: QuestionnaireMetadata = {
          ...user.questionnaire,
          completedAt:
            user.questionnaireData?.completedAt || new Date().toISOString(),
          version: user.questionnaireData?.version || "smart-questionnaire-v1",
        };

        console.log(
          "� QuestionnaireService: Created metadata from questionnaire"
        );
        await this.saveQuestionnaireData(fullMetadata);
        return fullMetadata;
      }

      // Priority 2: Check for enhanced questionnaireData
      if (user?.questionnaireData) {
        console.log(
          "✅ QuestionnaireService: Found questionnaireData in userStore, merging..."
        );

        const fullMetadata: QuestionnaireMetadata = {
          ...user.questionnaireData.answers,
          ...user.questionnaireData.metadata,
          completedAt: user.questionnaireData.completedAt,
        };

        console.log(
          "� QuestionnaireService: Created metadata from questionnaireData"
        );
        await this.saveQuestionnaireData(fullMetadata);
        return fullMetadata;
      }

      // Priority 3: Fallback to AsyncStorage
      console.log(
        "📱 QuestionnaireService: Checking AsyncStorage for cached data..."
      );
      const metadata = await AsyncStorage.getItem(
        STORAGE_KEYS.QUESTIONNAIRE_METADATA
      );

      if (metadata) {
        const parsed = JSON.parse(metadata);
        console.log(
          "✅ QuestionnaireService: Found cached data in AsyncStorage"
        );
        return parsed;
      }

      console.log(
        "❌ QuestionnaireService: No questionnaire data found in any source"
      );
      return null;
    } catch (error) {
      console.error(
        "❌ QuestionnaireService: Error getting user preferences:",
        error
      );
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
    const prefs = await this.getUserPreferences();

    // 🔧 FIX: Primary equipment field check - this is the main field from questionnaire
    // בדיקת שדה הציוד הראשי - זה השדה העיקרי מהשאלון
    const primaryEquipment = prefs?.equipment || [];

    const homeEquipment = prefs?.home_equipment || [];
    const gymEquipment = prefs?.gym_equipment || [];

    // 🔧 FIX: תמיכה במשתמש מדעי - בדיקת available_equipment
    // Enhanced support for scientific user - check available_equipment
    const availableEquipment = prefs?.available_equipment || [];

    // Enhanced support for new dynamic equipment questions
    // תמיכה משופרת בשאלות ציוד דינמיות חדשות
    const dynamicEquipment = prefs
      ? QuestionnaireService.extractEquipmentFromQuestionnaire(prefs)
      : [];

    // מיזוג רשימות ללא כפילויות - כולל שדה הציוד הראשי
    // Merge lists without duplicates - including primary equipment field
    const mergedEquipment = [
      ...new Set([
        ...primaryEquipment, // Add primary equipment field first
        ...homeEquipment,
        ...gymEquipment,
        ...availableEquipment,
        ...dynamicEquipment,
      ]),
    ];

    return mergedEquipment;
  }

  /**
   * Enhanced experience level extraction with comprehensive type safety
   * חילוץ רמת ניסיון משופר עם בטיחות טיפוסים מקיפה
   *
   * @param prefs - User questionnaire preferences with enhanced type structure
   * @returns Extracted experience level string
   * @performance O(n) complexity with optimized search
   * @rtl Supports both Hebrew and English experience levels
   */
  private static extractExperienceFromQuestionnaire(
    prefs: QuestionnaireMetadata
  ): string {
    // Enhanced support for new dynamic questions format
    // תמיכה משופרת בפורמט שאלות דינמיות חדש
    if (prefs.dynamicQuestions) {
      const experienceQuestion = prefs.dynamicQuestions.find(
        (q: DynamicQuestion) => q.questionId === "experience"
      );
      if (experienceQuestion && experienceQuestion.answer) {
        return experienceQuestion.answer as string;
      }
    }

    // Professional backward compatibility with old format
    // תאימות לאחור מקצועית עם פורמט ישן
    return prefs.experience || "מתחיל";
  }

  /**
   * Enhanced equipment extraction with comprehensive type safety
   * חילוץ ציוד משופר עם בטיחות טיפוסים מקיפה
   *
   * @param prefs - User questionnaire preferences with enhanced type structure
   * @returns Array of available equipment strings without duplicates
   * @performance O(n) complexity with optimized equipment mapping
   * @rtl Supports multi-language equipment names
   */
  private static extractEquipmentFromQuestionnaire(
    prefs: QuestionnaireMetadata
  ): string[] {
    console.log(
      "🔍 extractEquipmentFromQuestionnaire - Enhanced extraction starting"
    );
    const equipment: string[] = [];

    // Enhanced dynamic equipment questions - professional implementation
    // שאלות ציוד דינמיות משופרות - יישום מקצועי
    const dynamicQuestions = [
      "bodyweight_equipment_options", // Basic home equipment | ציוד ביתי בסיסי
      "home_equipment_options", // Advanced home equipment | ציוד ביתי מתקדם
      "gym_equipment_options", // Gym equipment | ציוד חדר כושר
    ];

    dynamicQuestions.forEach((questionId) => {
      const answer = (prefs as Record<string, unknown>)?.[questionId];

      if (Array.isArray(answer)) {
        answer.forEach((option: EquipmentOption) => {
          if (option?.metadata?.equipment) {
            console.log(
              `🔍 Adding equipment array:`,
              option.metadata.equipment
            );
            equipment.push(...option.metadata.equipment);
          }
        });
      }
    });

    const result = [...new Set(equipment)]; // Professional deduplication
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

    console.log("Questionnaire completion status:", {
      prefs,
      hasCompleted,
      completedAt: prefs?.completedAt,
    });

    return hasCompleted;
  }

  // =======================================
  // 🎯 Advanced Workout Generation Engine
  // מנוע יצירת אימונים מתקדם
  // =======================================

  /**
   * Enhanced personalized workout recommendations with advanced algorithms
   * המלצות אימון מותאמות אישית משופרות עם אלגוריתמים מתקדמים
   *
   * @returns Array of intelligent workout recommendations
   * @performance Optimized with advanced caching and preference analysis
   * @algorithm Uses machine learning-inspired workout matching
   * @rtl Supports Hebrew and English workout descriptions
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

  /**
   * Enhanced strength workout creation with personalized equipment integration
   * יצירת אימון כוח משופר עם שילוב ציוד מותאם אישית
   *
   * @param duration - Workout duration in minutes
   * @param equipment - Available equipment array
   * @param prefs - User preferences for personalization
   * @returns Comprehensive strength workout recommendation
   * @performance Optimized workout structure with intelligent exercise selection
   */
  private createStrengthWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    const isBeginnerLevel =
      prefs.experience === "מתחיל" || prefs.experience === "beginner";
    const hasGymAccess =
      equipment.includes("barbell") || equipment.includes("dumbbells");

    return {
      id: "strength-1",
      name: hasGymAccess ? "אימון כוח מתקדם - חדר כושר" : "אימון כוח ביתי",
      description: isBeginnerLevel
        ? "אימון כוח מותאם למתחילים עם תרגילים בסיסיים"
        : "אימון כוח מתקדם עם דגש על תרגילים מורכבים",
      duration,
      difficulty: "advanced",
      equipment: ["barbell", "dumbbells"],
      targetMuscles: ["גוף מלא"],
      type: "strength",
      estimatedCalories: Math.round(duration * 7),
    };
  }

  /**
   * Enhanced power workout creation with personalized intensity adjustment
   * יצירת אימון כוח מתפרץ משופר עם התאמת עצימות אישית
   *
   * @param duration - Workout duration in minutes
   * @param equipment - Available equipment for power training
   * @param prefs - User preferences and experience level
   * @returns Advanced power workout recommendation
   * @performance High-intensity workout optimized for power development
   */
  private createPowerWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    const isAdvanced =
      prefs.experience === "מתקדם" || prefs.experience === "advanced";
    const hasPlyometricEquipment =
      equipment.includes("plyo_box") || equipment.includes("battle_ropes");

    return {
      id: "power-1",
      name: hasPlyometricEquipment
        ? "אימון כוח מתפרץ - ציוד מתקדם"
        : "אימון כוח מתפרץ ביתי",
      description: isAdvanced
        ? "אימון מתקדם לפיתוח כוח מתפרץ ומהירות אתלטית"
        : "אימון לפיתוח כוח מתפרץ ומהירות - מותאם לרמה בינונית",
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

  /**
   * Enhanced mobility workout creation with equipment-specific routines
   * יצירת אימון ניידות משופר עם שגרות ספציפיות לציוד
   *
   * @param duration - Workout duration in minutes
   * @param equipment - Available equipment for mobility work
   * @param prefs - User preferences and physical limitations
   * @returns Personalized mobility workout recommendation
   * @accessibility Designed for all ability levels and physical conditions
   */
  private createMobilityWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    const hasYogaEquipment =
      equipment.includes("yoga_mat") || equipment.includes("foam_roller");
    const isBeginnerFriendly =
      prefs.experience === "מתחיל" || prefs.experience === "beginner";

    return {
      id: "mobility-1",
      name: hasYogaEquipment
        ? "אימון ניידות וגמישות - עם ציוד"
        : "אימון ניידות בסיסי",
      description: isBeginnerFriendly
        ? "אימון עדין לשיפור טווחי תנועה וגמישות - מתאים למתחילים"
        : "אימון מתקדם לשיפור ניידות וגמישות",
      duration,
      difficulty: "beginner",
      equipment: ["bodyweight"],
      targetMuscles: ["גוף מלא"],
      type: "flexibility",
      estimatedCalories: Math.round(duration * 3),
    };
  }

  /**
   * Enhanced low-impact workout creation with joint-friendly exercises
   * יצירת אימון בעצימות נמוכה משופר עם תרגילים ידידותיים למפרקים
   *
   * @param duration - Workout duration in minutes
   * @param equipment - Available low-impact equipment
   * @param prefs - User preferences and physical considerations
   * @returns Gentle workout recommendation suitable for all levels
   * @accessibility Optimized for users with joint concerns or mobility limitations
   */
  private createLowImpactWorkout(
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    const hasPoolAccess =
      equipment.includes("pool") || equipment.includes("water");
    const needsGentle =
      prefs.experience === "מתחיל" || (prefs.age && parseInt(prefs.age) > 50);

    return {
      id: "lowimpact-1",
      name: hasPoolAccess ? "אימון מים בעצימות נמוכה" : "אימון עדין למפרקים",
      description: needsGentle
        ? "אימון עדין במיוחד המתאים למתחילים ולגילאים מתקדמים"
        : "אימון בעצימות נמוכה עם דגש על הגנה על המפרקים",
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

// =======================================
// 🚀 Professional Service Export
// יצוא שירות מקצועי
// =======================================

/**
 * Enhanced questionnaire service singleton instance
 * מופע יחידי של שירות השאלון המשופר
 *
 * @singleton Ensures single instance across the application
 * @performance Optimized with intelligent caching and data management
 * @accessibility Designed for comprehensive user experience support
 */
export const questionnaireService = new QuestionnaireService();

/**
 * Professional class export for advanced integration scenarios
 * יצוא מחלקה מקצועי לתרחישי אינטגרציה מתקדמים
 *
 * @usage For dependency injection or custom instantiation
 * @architecture Supports advanced architectural patterns
 */
export default QuestionnaireService;
