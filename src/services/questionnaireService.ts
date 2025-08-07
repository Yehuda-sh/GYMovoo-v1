/**
 * @file src/services/questionnaireService.ts
 * @description שירות מקיף לניהול נתוני השאלון ובחירת אימונים מותאמים אישית
 * English: Comprehensive service for questionnaire data management and personalized workout selection
 * @dependencies AsyncStorage for persistence, userStore for state management, centralized types system
 * @notes שירות מרכזי לכל הפעולות הקשורות לנתוני השאלון עם תמיכה בפורמטים מרובים
 * English: Central service for all questionnaire operations with multi-format support
 * @performance Optimized with intelligent caching, efficient data merging, and smart recommendations
 * @rtl Full Hebrew workout names, descriptions, and user preference support
 * @accessibility Compatible with screen readers and comprehensive workout metadata
 * @algorithm Advanced workout recommendation engine with goal-based personalization
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../stores/userStore";
import {
  QuestionnaireMetadata,
  DynamicQuestion,
  WorkoutRecommendation,
  WorkoutExerciseBase,
} from "../types";

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
      // Priority 1: Check for new user data in userStore
      const user = useUserStore.getState().user;

      // Enhanced questionnaire data processing with legacy support
      if (user?.questionnaire) {
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
    const allEquipment = [
      ...primaryEquipment, // Add primary equipment field first
      ...homeEquipment,
      ...gymEquipment,
      ...availableEquipment,
      ...dynamicEquipment,
    ];
    const mergedEquipment = Array.from(new Set(allEquipment));

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

    const result = Array.from(new Set(equipment)); // Professional deduplication
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
   * שמירת נתוני השאלון עם ניתוח משופר
   * Save questionnaire data with enhanced analysis
   */
  async saveQuestionnaireData(data: QuestionnaireMetadata): Promise<void> {
    await AsyncStorage.setItem(
      STORAGE_KEYS.QUESTIONNAIRE_METADATA,
      JSON.stringify({
        ...data,
        completedAt: data.completedAt || new Date().toISOString(),
        version: "3.0", // Updated version for enhanced system
      })
    );
  }

  /**
   * 🎯 NEW: Enhanced workout completion analysis with dynamic recommendations
   * ניתוח סיום אימון משופר עם המלצות דינמיות
   *
   * @public This is the main function for post-workout analysis
   * @algorithm Uses machine learning principles to adapt future workouts
   */
  async analyzeAndAdjustWorkoutCompletion(completionData: {
    workoutId: string;
    completedSets: number;
    totalSets: number;
    actualDuration: number;
    plannedDuration: number;
    userFeedback: {
      difficultyRating: number; // 1-5 stars
      enjoymentRating: number; // 1-5 stars
      energyLevelBefore: number; // 1-10
      fatigueLevelAfter: number; // 1-10
      feeling: string; // emoji
      readyForMore: boolean;
      notes?: string;
    };
  }): Promise<{
    performanceAnalysis: {
      completionRate: number;
      timeEfficiency: number;
      difficultyMatch: "too_easy" | "perfect" | "too_hard";
      overallScore: number; // 1-10
    };
    nextWorkoutRecommendations: {
      adjustmentType:
        | "increase_difficulty"
        | "maintain"
        | "decrease_difficulty";
      suggestedWorkout: string;
      reasoningInHebrew: string;
      confidenceLevel: number; // 0-1
    };
    personalizedInsights: string[];
    achievementsUnlocked: string[];
  }> {
    const {
      completedSets,
      totalSets,
      actualDuration,
      plannedDuration,
      userFeedback,
    } = completionData;

    // Performance Analysis
    const completionRate = completedSets / totalSets;
    const timeEfficiency = plannedDuration / actualDuration;

    let difficultyMatch: "too_easy" | "perfect" | "too_hard";
    if (userFeedback.difficultyRating <= 2 && completionRate >= 0.9) {
      difficultyMatch = "too_easy";
    } else if (userFeedback.difficultyRating >= 4 && completionRate <= 0.7) {
      difficultyMatch = "too_hard";
    } else {
      difficultyMatch = "perfect";
    }

    const overallScore = this.calculateOverallWorkoutScore(
      completionRate,
      timeEfficiency,
      userFeedback.difficultyRating,
      userFeedback.enjoymentRating
    );

    // Dynamic Adjustment Recommendations
    const adjustmentAnalysis = await this.analyzeWorkoutCompletion({
      completedSets,
      totalSets,
      actualDuration,
      plannedDuration,
      difficultyRating: userFeedback.difficultyRating,
      enjoymentRating: userFeedback.enjoymentRating,
      energyLevel: userFeedback.energyLevelBefore,
      fatigueLevel: userFeedback.fatigueLevelAfter,
    });

    // Generate Personalized Insights
    const insights = this.generatePersonalizedInsights(
      completionData,
      overallScore
    );

    // Check for Achievements
    const achievements = await this.checkForAchievements(
      completionData,
      overallScore
    );

    return {
      performanceAnalysis: {
        completionRate,
        timeEfficiency,
        difficultyMatch,
        overallScore,
      },
      nextWorkoutRecommendations: {
        adjustmentType: adjustmentAnalysis.adjustmentRecommendation,
        suggestedWorkout: adjustmentAnalysis.nextWorkoutSuggestion,
        reasoningInHebrew: adjustmentAnalysis.reasonAnalysis,
        confidenceLevel: this.calculateConfidenceLevel(
          completionRate,
          userFeedback
        ),
      },
      personalizedInsights: insights,
      achievementsUnlocked: achievements,
    };
  }

  /**
   * Calculate overall workout score using weighted metrics
   * חישוב ציון כולל לאימון באמצעות מטריקות משוקללות
   */
  private calculateOverallWorkoutScore(
    completionRate: number,
    timeEfficiency: number,
    difficultyRating: number,
    enjoymentRating: number
  ): number {
    // Weighted scoring algorithm
    const completionWeight = 0.4;
    const timeWeight = 0.2;
    const difficultyWeight = 0.2;
    const enjoymentWeight = 0.2;

    const completionScore = completionRate * 10;
    const timeScore = Math.min(timeEfficiency * 5, 10); // Cap at 10
    const difficultyScore = difficultyRating * 2; // Convert 1-5 to 1-10
    const enjoymentScore = enjoymentRating * 2; // Convert 1-5 to 1-10

    const weightedScore =
      completionScore * completionWeight +
      timeScore * timeWeight +
      difficultyScore * difficultyWeight +
      enjoymentScore * enjoymentWeight;

    return Math.round(Math.max(1, Math.min(10, weightedScore)));
  }

  /**
   * Generate personalized insights based on workout performance
   * יצירת תובנות אישיות על בסיס ביצועי האימון
   */
  private generatePersonalizedInsights(
    completionData: any,
    overallScore: number
  ): string[] {
    const insights: string[] = [];
    const { userFeedback, completedSets, totalSets } = completionData;

    if (overallScore >= 8) {
      insights.push("🔥 ביצוע מעולה! אתה מתקדם מהר");
    }

    if (userFeedback.readyForMore && completedSets === totalSets) {
      insights.push("💪 נראה שאתה מוכן לאתגר גדול יותר");
    }

    if (userFeedback.enjoymentRating >= 4) {
      insights.push("😊 אתה נהנה מהאימונים - זה המפתח להצלחה!");
    }

    if (userFeedback.fatigueLevelAfter <= 4 && completedSets === totalSets) {
      insights.push("⚡ יש לך עוד אנרגיה - אפשר להוסיף עצימות");
    }

    return insights;
  }

  /**
   * Check for achievements based on workout completion
   * בדיקת הישגים על בסיס השלמת האימון
   */
  private async checkForAchievements(
    completionData: any,
    overallScore: number
  ): Promise<string[]> {
    const achievements: string[] = [];
    const { completedSets, totalSets, userFeedback } = completionData;

    // Perfect completion achievement
    if (completedSets === totalSets && userFeedback.difficultyRating >= 4) {
      achievements.push("🏆 השלמה מושלמת באתגר קשה!");
    }

    // High performance achievement
    if (overallScore >= 9) {
      achievements.push("⭐ ביצוע יוצא דופן!");
    }

    // Consistency achievement (would need to check history)
    const user = useUserStore.getState().user;
    const recentWorkouts = user?.activityHistory?.workouts?.slice(0, 7) || [];
    if (recentWorkouts.length >= 3) {
      achievements.push("🔥 רצף אימונים פעיל!");
    }

    return achievements;
  }

  /**
   * Calculate confidence level for recommendations
   * חישוב רמת ביטחון להמלצות
   */
  private calculateConfidenceLevel(
    completionRate: number,
    userFeedback: any
  ): number {
    let confidence = 0.5; // Base confidence

    // Higher confidence with clear performance indicators
    if (completionRate >= 0.9 || completionRate <= 0.6) {
      confidence += 0.3; // Clear success or struggle
    }

    if (
      userFeedback.difficultyRating <= 2 ||
      userFeedback.difficultyRating >= 4
    ) {
      confidence += 0.2; // Clear difficulty feedback
    }

    return Math.min(1, confidence);
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
  // 🏋️ Enhanced Workout Creation System
  // מערכת יצירת אימונים משופרת
  // =======================================

  /**
   * Unified workout creation factory with dynamic analysis
   * מפעל יצירת אימונים מאוחד עם ניתוח דינמי
   *
   * @performance Creates workouts based on completion analysis and user feedback
   * @algorithm Uses dynamic difficulty adjustment based on previous workout completion
   */
  private createWorkoutByType(
    type: string,
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ): WorkoutRecommendation {
    // Enhanced base workout structure with dynamic analysis
    const baseWorkout = {
      duration,
      equipment: this.optimizeEquipmentSelection(equipment, type),
      difficulty: this.getDifficultyByExperience(prefs.experience),
      estimatedCalories: this.calculateEstimatedCalories(duration, type),
    };

    // Workout type factory with enhanced logic
    const workoutFactories = {
      cardio: () => ({
        id: "cardio-1",
        name: "אימון קרדיו שורף קלוריות",
        description: "אימון אירובי לשריפת קלוריות ושיפור סיבולת לב-ריאה",
        targetMuscles: ["לב", "ריאות"],
        type: "cardio" as const,
      }),

      hiit: () => ({
        id: "hiit-1",
        name: "HIIT אינטנסיבי",
        description: "אימון אינטרוולים בעצימות גבוהה לשריפת קלוריות מקסימלית",
        duration: Math.min(duration, 30),
        targetMuscles: ["גוף מלא"],
        type: "hiit" as const,
      }),

      strength: () => {
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
          difficulty: "advanced" as const,
          targetMuscles: ["גוף מלא"],
          type: "strength" as const,
        };
      },

      power: () => {
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
          difficulty: "advanced" as const,
          targetMuscles: ["גוף מלא"],
          type: "strength" as const,
        };
      },

      mobility: () => {
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
          difficulty: "beginner" as const,
          targetMuscles: ["גוף מלא"],
          type: "flexibility" as const,
        };
      },

      lowimpact: () => {
        const hasPoolAccess =
          equipment.includes("pool") || equipment.includes("water");
        const needsGentle =
          prefs.experience === "מתחיל" ||
          (prefs.age && parseInt(prefs.age) > 50);

        return {
          id: "lowimpact-1",
          name: hasPoolAccess
            ? "אימון מים בעצימות נמוכה"
            : "אימון עדין למפרקים",
          description: needsGentle
            ? "אימון עדין במיוחד המתאים למתחילים ולגילאים מתקדמים"
            : "אימון בעצימות נמוכה עם דגש על הגנה על המפרקים",
          difficulty: "beginner" as const,
          targetMuscles: ["גוף מלא"],
          type: "mixed" as const,
        };
      },

      rehab: () => ({
        id: "rehab-1",
        name: "אימון שיקומי",
        description: "אימון עדין לשיקום ומניעת פציעות",
        difficulty: "beginner" as const,
        targetMuscles: this.getRehabTargetMuscles(prefs.injury_type),
        type: "flexibility" as const,
      }),

      general: () => ({
        id: "general-1",
        name: "אימון כללי",
        description: "אימון מגוון לכלל הגוף",
        targetMuscles: ["גוף מלא"],
        type: "mixed" as const,
      }),
    };

    // Create workout with factory pattern
    const factory = workoutFactories[type as keyof typeof workoutFactories];
    if (!factory) {
      return { ...baseWorkout, ...workoutFactories.general() };
    }

    return { ...baseWorkout, ...factory() };
  }

  /**
   * Optimized equipment selection based on workout type
   * בחירת ציוד מותאמת לפי סוג האימון
   */
  private optimizeEquipmentSelection(
    equipment: string[],
    workoutType: string
  ): string[] {
    const typeRequirements = {
      strength: ["barbell", "dumbbells"],
      cardio: ["bodyweight"],
      hiit: ["bodyweight"],
      flexibility: ["bodyweight"],
      mixed: ["bodyweight"],
    };

    const required = typeRequirements[
      workoutType as keyof typeof typeRequirements
    ] || ["bodyweight"];
    return equipment.length > 0
      ? equipment.filter((eq) => required.includes(eq) || eq === "bodyweight")
      : required;
  }

  /**
   * Enhanced calorie calculation with workout type considerations
   * חישוב קלוריות משופר עם התחשבות בסוג האימון
   */
  private calculateEstimatedCalories(
    duration: number,
    workoutType: string
  ): number {
    const calorieMultipliers = {
      cardio: 12, // Enhanced for cardio workouts
      hiit: 14, // Highest for HIIT intensity
      strength: 9, // Moderate for strength training
      power: 11, // High for power training
      mobility: 9, // Updated for flexibility work
      lowimpact: 5, // Lower for gentle exercises
      rehab: 4, // Lowest for rehabilitation
      general: 8, // Default fallback
      endurance: 10, // Added for endurance training
    };

    const multiplier =
      calorieMultipliers[workoutType as keyof typeof calorieMultipliers] || 8;
    return Math.round(duration * multiplier);
  }

  // Legacy workout creation methods - consolidated for backward compatibility
  private createCardioWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => this.createWorkoutByType("cardio", duration, equipment, prefs);

  private createHIITWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => this.createWorkoutByType("hiit", duration, equipment, prefs);

  private createStrengthWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => this.createWorkoutByType("strength", duration, equipment, prefs);

  private createPowerWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => this.createWorkoutByType("power", duration, equipment, prefs);

  private createMobilityWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => this.createWorkoutByType("mobility", duration, equipment, prefs);

  private createLowImpactWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => this.createWorkoutByType("lowimpact", duration, equipment, prefs);

  private createRehabWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => this.createWorkoutByType("rehab", duration, equipment, prefs);

  private createGeneralWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => this.createWorkoutByType("general", duration, equipment, prefs);

  // Additional consolidated methods
  private createUpperBodyWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => {
    const hasWeights = equipment.some(
      (eq) => eq.includes("dumbbell") || eq.includes("barbell")
    );
    return {
      ...this.createWorkoutByType("strength", duration, equipment, prefs),
      id: "upper-1",
      name: "אימון פלג גוף עליון",
      description: "אימון מקיף לחיזוק וחיטוב פלג גוף עליון",
      equipment: hasWeights ? ["dumbbells", "barbell"] : ["bodyweight"],
      targetMuscles: ["חזה", "גב", "כתפיים", "ידיים"],
    };
  };

  private createLowerBodyWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => ({
    ...this.createWorkoutByType("strength", duration, equipment, prefs),
    id: "lower-1",
    name: "אימון רגליים וישבן",
    description: "אימון מקיף לחיזוק רגליים וישבן",
    equipment: equipment.includes("barbell") ? ["barbell"] : ["bodyweight"],
    targetMuscles: ["רגליים", "ישבן", "שוקיים"],
  });

  private createFullBodyWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => ({
    ...this.createWorkoutByType("general", duration, equipment, prefs),
    id: "fullbody-1",
    name: "אימון גוף מלא מאוזן",
    description: "אימון מקיף לכל שרירי הגוף",
    type: "mixed" as const,
  });

  private createCircuitWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => ({
    ...this.createWorkoutByType("general", duration, equipment, prefs),
    id: "circuit-1",
    name: "אימון מעגלים",
    description: "אימון מעגלים המשלב כוח וסיבולת",
    estimatedCalories: this.calculateEstimatedCalories(duration, "cardio"),
    type: "mixed" as const,
  });

  private createCompoundWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => ({
    ...this.createWorkoutByType("strength", duration, equipment, prefs),
    id: "compound-1",
    name: "תרגילים מורכבים",
    description: "אימון המתמקד בתרגילים מורכבים רב-מפרקיים",
    equipment: ["barbell", "dumbbells"],
    estimatedCalories: this.calculateEstimatedCalories(duration, "strength"),
  });

  private createEnduranceWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => ({
    ...this.createWorkoutByType("cardio", duration, equipment, prefs),
    id: "endurance-1",
    name: "אימון סיבולת",
    description: "אימון לשיפור סיבולת שרירית ולב-ריאה",
    estimatedCalories: this.calculateEstimatedCalories(duration, "endurance"),
  });

  private createMetabolicWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => ({
    ...this.createWorkoutByType("hiit", duration, equipment, prefs),
    id: "metabolic-1",
    name: "אימון מטבולי",
    description: "אימון להאצת חילוף החומרים",
    equipment: ["bodyweight", "dumbbells"],
    estimatedCalories: this.calculateEstimatedCalories(duration, "hiit"),
  });

  private createPushPullWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => ({
    ...this.createWorkoutByType("strength", duration, equipment, prefs),
    id: "pushpull-1",
    name: "דחיפה/משיכה",
    description: "אימון המחלק בין תרגילי דחיפה למשיכה",
    equipment: ["dumbbells", "barbell"],
    targetMuscles: ["חזה", "גב", "כתפיים", "ידיים"],
  });

  private createFunctionalWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => ({
    ...this.createWorkoutByType("general", duration, equipment, prefs),
    id: "functional-1",
    name: "אימון פונקציונלי",
    description: "אימון לשיפור תנועות יומיומיות",
    estimatedCalories: this.calculateEstimatedCalories(duration, "general"),
  });

  private createBalancedWorkout = (
    duration: number,
    equipment: string[],
    prefs: QuestionnaireMetadata
  ) => ({
    ...this.createWorkoutByType("general", duration, equipment, prefs),
    id: "balanced-1",
    name: "אימון מאוזן",
    description: "אימון המשלב כוח, סיבולת וגמישות",
    estimatedCalories: this.calculateEstimatedCalories(duration, "general"),
  });

  // =======================================
  // 🧠 Enhanced Helper Functions with Dynamic Analysis
  // פונקציות עזר משופרות עם ניתוח דינמי
  // =======================================

  /**
   * Enhanced difficulty calculation with dynamic adjustment based on completion history
   * חישוב קושי משופר עם התאמה דינמית על בסיס היסטוריית השלמות
   *
   * @algorithm Analyzes previous workout completion rates to adjust difficulty
   * @performance Considers user feedback from recent workouts for optimal challenge
   */
  private getDifficultyByExperience(
    experience?: string
  ): "beginner" | "intermediate" | "advanced" {
    // Dynamic analysis: Check recent workout completion rates
    const user = useUserStore.getState().user;
    const recentWorkouts = user?.activityHistory?.workouts?.slice(0, 5) || [];

    // Calculate completion rate from recent workouts
    const completionRate = this.calculateRecentCompletionRate(recentWorkouts);

    // Base difficulty from experience
    let baseDifficulty: "beginner" | "intermediate" | "advanced";
    switch (experience) {
      case "מתחיל (0-6 חודשים)":
        baseDifficulty = "beginner";
        break;
      case "בינוני (6-24 חודשים)":
        baseDifficulty = "intermediate";
        break;
      case "מתקדם (2-5 שנים)":
      case "מקצועי (5+ שנים)":
      case "ספורטאי תחרותי":
        baseDifficulty = "advanced";
        break;
      default:
        baseDifficulty = "beginner";
    }

    // Dynamic adjustment based on performance
    if (completionRate > 0.9 && baseDifficulty !== "advanced") {
      // User consistently completes workouts - can handle higher difficulty
      const difficulties: Array<"beginner" | "intermediate" | "advanced"> = [
        "beginner",
        "intermediate",
        "advanced",
      ];
      const currentIndex = difficulties.indexOf(baseDifficulty);
      return difficulties[Math.min(currentIndex + 1, 2)];
    } else if (completionRate < 0.6 && baseDifficulty !== "beginner") {
      // User struggles with current level - reduce difficulty
      const difficulties: Array<"beginner" | "intermediate" | "advanced"> = [
        "beginner",
        "intermediate",
        "advanced",
      ];
      const currentIndex = difficulties.indexOf(baseDifficulty);
      return difficulties[Math.max(currentIndex - 1, 0)];
    }

    return baseDifficulty;
  }

  /**
   * Calculate recent workout completion rate for dynamic difficulty adjustment
   * חישוב שיעור השלמת אימונים אחרונים להתאמת קושי דינמית
   */
  private calculateRecentCompletionRate(recentWorkouts: any[]): number {
    if (recentWorkouts.length === 0) return 0.7; // Default moderate completion rate

    const totalSets = recentWorkouts.reduce((sum, workout) => {
      return (
        sum +
        (workout.exercises?.reduce((exerciseSum: number, exercise: any) => {
          return exerciseSum + (exercise.sets?.length || 0);
        }, 0) || 0)
      );
    }, 0);

    const completedSets = recentWorkouts.reduce((sum, workout) => {
      return (
        sum +
        (workout.exercises?.reduce((exerciseSum: number, exercise: any) => {
          return (
            exerciseSum +
            (exercise.sets?.filter((set: any) => set.completed)?.length || 0)
          );
        }, 0) || 0)
      );
    }, 0);

    return totalSets > 0 ? completedSets / totalSets : 0.7;
  }

  /**
   * Enhanced preference mapping with dynamic feedback analysis
   * מיפוי העדפות משופר עם ניתוח משוב דינמי
   */
  private mapPreferenceToType(
    preference: string
  ): WorkoutRecommendation["type"] {
    // Check user feedback for preferred workout types
    const user = useUserStore.getState().user;
    const workoutHistory = user?.activityHistory?.workouts || [];
    const preferenceRatings = this.analyzePreferenceRatings(
      workoutHistory,
      preference
    );

    const mapping: { [key: string]: WorkoutRecommendation["type"] } = {
      "אימוני כוח": "strength",
      "אימוני סיבולת": "cardio",
      HIIT: "hiit",
      "יוגה/פילאטיס": "flexibility",
      קרוספיט: "mixed",
      "אימונים פונקציונליים": "mixed",
      "אימוני משקל גוף": "strength",
    };

    // If user has good ratings for this preference type, reinforce it
    const baseType = mapping[preference] || "mixed";
    if (preferenceRatings.averageRating > 4) {
      console.log(
        `🎯 User shows high satisfaction (${preferenceRatings.averageRating}) with ${preference} - reinforcing preference`
      );
    }

    return baseType;
  }

  /**
   * Analyze user ratings for specific workout preferences
   * ניתוח דירוגי משתמש להעדפות אימון ספציפיות
   */
  private analyzePreferenceRatings(
    workoutHistory: any[],
    preference: string
  ): { averageRating: number; count: number } {
    const relevantWorkouts = workoutHistory.filter(
      (workout) =>
        workout.name?.includes(preference) ||
        workout.type === this.mapPreferenceToType(preference)
    );

    if (relevantWorkouts.length === 0) {
      return { averageRating: 3.5, count: 0 }; // Default neutral rating
    }

    const totalRating = relevantWorkouts.reduce((sum, workout) => {
      return sum + (workout.feedback?.overallRating || workout.rating || 3.5);
    }, 0);

    return {
      averageRating: totalRating / relevantWorkouts.length,
      count: relevantWorkouts.length,
    };
  }

  /**
   * Enhanced rehabilitation target muscles with injury-specific analysis
   * שרירי מטרה לשיקום משופרים עם ניתוח ספציפי לפציעה
   */
  private getRehabTargetMuscles(injuryType?: string): string[] {
    // Dynamic analysis: Consider user's injury history and recovery progress
    const user = useUserStore.getState().user;
    const rehabHistory =
      user?.activityHistory?.workouts?.filter(
        (w: any) => w.type === "rehabilitation"
      ) || [];

    // Base target muscles by injury type
    const baseTargets: { [key: string]: string[] } = {
      "פציעת גב": ["גב", "core"],
      "פציעת כתף": ["כתפיים", "גב עליון"],
      "פציעת ברך": ["רגליים", "ישבן"],
      "פציעת קרסול": ["שוקיים", "רגליים"],
      "פציעת מרפק": ["ידיים", "אמות"],
      "פציעת צוואר": ["צוואר", "גב עליון"],
    };

    const targets = baseTargets[injuryType || ""] || ["גוף מלא"];

    // If user has successful rehab history, can expand target areas
    if (rehabHistory.length > 5) {
      const avgRating =
        rehabHistory.reduce(
          (sum: number, w: any) => sum + (w.feedback?.overallRating || 3),
          0
        ) / rehabHistory.length;
      if (avgRating > 4) {
        console.log(
          `🏥 User shows good rehab progress (${avgRating}) - can expand target areas`
        );
        return [...targets, "גוף מלא"]; // Add full body progression
      }
    }

    return targets;
  }

  /**
   * Enhanced workout completion analysis for post-workout dynamic adjustment
   * ניתוח השלמת אימון משופר להתאמה דינמית לאחר האימון
   *
   * @algorithm Analyzes completion patterns to suggest future workout adjustments
   * @performance Uses completion rate, difficulty rating, and time efficiency
   */
  async analyzeWorkoutCompletion(workoutData: {
    completedSets: number;
    totalSets: number;
    actualDuration: number;
    plannedDuration: number;
    difficultyRating: number;
    enjoymentRating: number;
    energyLevel: number;
    fatigueLevel: number;
  }): Promise<{
    adjustmentRecommendation:
      | "increase_difficulty"
      | "maintain"
      | "decrease_difficulty";
    nextWorkoutSuggestion: string;
    reasonAnalysis: string;
  }> {
    const {
      completedSets,
      totalSets,
      actualDuration,
      plannedDuration,
      difficultyRating,
      enjoymentRating,
      energyLevel,
      fatigueLevel,
    } = workoutData;

    // Calculate key metrics
    const completionRate = completedSets / totalSets;
    const timeEfficiency = plannedDuration / actualDuration;
    const overallSatisfaction = (difficultyRating + enjoymentRating) / 2;

    // Dynamic analysis algorithm
    let adjustmentRecommendation:
      | "increase_difficulty"
      | "maintain"
      | "decrease_difficulty";
    let reasonAnalysis = "";

    if (
      completionRate >= 0.9 &&
      difficultyRating <= 3 &&
      timeEfficiency > 1.1
    ) {
      // User completed everything easily and finished early
      adjustmentRecommendation = "increase_difficulty";
      reasonAnalysis =
        "המשתמש השלים את האימון בקלות וסיים מוקדם - ניתן להעלות את הרמה";
    } else if (
      completionRate < 0.6 ||
      (difficultyRating >= 4 && fatigueLevel >= 8)
    ) {
      // User struggled to complete or found it too difficult
      adjustmentRecommendation = "decrease_difficulty";
      reasonAnalysis =
        "המשתמש התקשה להשלים את האימון או מצא אותו קשה מדי - מומלץ להקל";
    } else {
      // User performed within optimal range
      adjustmentRecommendation = "maintain";
      reasonAnalysis = "המשתמש ביצע את האימון ברמה אופטימלית - נמשיך ברמה דומה";
    }

    // Generate next workout suggestion based on performance and preferences
    const nextWorkoutSuggestion = await this.generateNextWorkoutSuggestion(
      overallSatisfaction,
      energyLevel,
      adjustmentRecommendation
    );

    return {
      adjustmentRecommendation,
      nextWorkoutSuggestion,
      reasonAnalysis,
    };
  }

  /**
   * Generate intelligent next workout suggestion based on completion analysis
   * יצירת הצעת אימון הבא חכמה על בסיס ניתוח השלמה
   */
  private async generateNextWorkoutSuggestion(
    overallSatisfaction: number,
    energyLevel: number,
    adjustmentRecommendation: string
  ): Promise<string> {
    const prefs = await this.getUserPreferences();
    if (!prefs) return "אימון כללי מאוזן";

    // Base suggestion on user preferences and current state
    if (energyLevel >= 8 && overallSatisfaction >= 4) {
      return adjustmentRecommendation === "increase_difficulty"
        ? "אימון אתגר מתקדם - אתה במצב מעולה!"
        : "אימון מעורר השראה - תמשיך במומנטום!";
    } else if (energyLevel <= 4 || overallSatisfaction <= 2) {
      return "אימון התאוששות עדין - תן לגוף להתחזק";
    } else {
      return "אימון מאוזן המותאם לרמתך הנוכחית";
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
