/**
 * @file src/services/workoutHistoryService.ts
 * @description שירות מרכזי לניהול היסטוריית אימונים עם משוב מתקדם והתאמת מגדר
 * English: Central workout history service with advanced feedback and gender adaptation
 *
 * @features
 * - שמירת אימונים עם משוב מותאם למגדר | Gender-adapted workout feedback storage
 * - זיהוי שיאים אישיים | Personal records detection
 * - ניתוח ביצועים מותאם אישית | Personalized performance analytics
 * - המלצות אימון חכמות | Smart workout recommendations
 * - יצוא נתונים ל-CSV | CSV data export
 * - חישוב קלוריות מותאם | Personalized calorie calculations
 * - רצף אימונים וקביעות | Workout streaks and consistency tracking
 *
 * @dependencies genderAdaptation, personalDataUtils
 * @used_by HistoryScreen, WorkoutPlansScreen, ActiveWorkoutScreen
 * @performance 1096 lines - consider modular organization for large service
 * @updated 2025-08-11 Enhanced documentation and service organization
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { workoutApi } from "./api/workoutApi";
import { useUserStore } from "../stores/userStore";
import { WorkoutData } from "../screens/workout/types/workout.types";
import { Platform, Dimensions } from "react-native";
import {
  adaptExerciseNameToGender,
  generateSingleGenderAdaptedNote,
  generateGenderAdaptedCongratulation,
  UserGender,
} from "../utils/genderAdaptation";
import {
  WorkoutWithFeedback,
  PreviousPerformance,
  PersonalRecord,
} from "../screens/workout/types/workout.types";
import {
  PersonalData,
  calculatePersonalizedCalories,
  calculatePersonalizedBMI,
  analyzePersonalizedPerformance,
  getAgeStrengthFactor,
} from "../utils/personalDataUtils";

// Export types for external use
export type { PreviousPerformance, PersonalRecord };

const WORKOUT_HISTORY_KEY = "workout_history";
const PREVIOUS_PERFORMANCES_KEY = "previous_performances";

class WorkoutHistoryService {
  /**
   * שמירת אימון עם משוב להיסטוריה (משופר עם תמיכה בהתאמת מגדר)
   * Save workout with feedback to history (enhanced with gender adaptation support)
   */
  async saveWorkoutWithFeedback(
    workoutWithFeedback: Omit<WorkoutWithFeedback, "id">,
    userGender?: UserGender,
    personalData?: PersonalData
  ): Promise<void> {
    try {
      const id = Date.now().toString();

      // חישוב קלוריות מותאם אישית
      const durationMinutes = Math.round(
        (workoutWithFeedback.workout.duration || 0) / 60
      );
      const estimatedCalories = calculatePersonalizedCalories(
        durationMinutes,
        personalData
      );

      // יצירת מטא-דאטה מורחבת
      const metadata = {
        deviceInfo: {
          platform: Platform.OS,
          screenWidth: Dimensions.get("window").width,
          screenHeight: Dimensions.get("window").height,
        },
        userGender,
        personalData,
        estimatedCalories,
        bmi: personalData ? calculatePersonalizedBMI(personalData) : undefined,
        version: "workout-history-v3", // Updated version
        workoutSource: "manual" as const, // רוב האימונים הם ידניים
      };

      // יצירת משוב מותאם למגדר
      const personalRecordsCount = workoutWithFeedback.stats.personalRecords;
      const genderAdaptedNotes = generateSingleGenderAdaptedNote(
        userGender,
        workoutWithFeedback.feedback.difficulty
      );
      const congratulationMessage = generateGenderAdaptedCongratulation(
        userGender,
        personalRecordsCount
      );

      const fullWorkout: WorkoutWithFeedback = {
        id,
        ...workoutWithFeedback,
        feedback: {
          ...workoutWithFeedback.feedback,
          genderAdaptedNotes,
          congratulationMessage,
        },
        metadata,
      };

      // שמירה בשרת המקומי לפי userId; נפילה ל-AsyncStorage אם אין משתמש
      const user = useUserStore.getState().user;
      if (user?.id) {
        await workoutApi.createForUser(user.id, fullWorkout);
      } else {
        const existingHistory = await this.getWorkoutHistory();
        const updatedHistory = [fullWorkout, ...existingHistory];
        await AsyncStorage.setItem(
          WORKOUT_HISTORY_KEY,
          JSON.stringify(updatedHistory)
        );
      }

      // שמירת ביצועים לעיון באימון הבא (עם התאמת שמות תרגילים)
      await this.savePreviousPerformances(
        workoutWithFeedback.workout,
        userGender
      );
    } catch (error) {
      console.error("Error saving workout to history:", error);
      throw error;
    }
  }

  /**
   * יצוא נתוני ביצועים מותאמים אישית ל-CSV
   * Export personalized performance data to CSV format
   */
  async exportPersonalizedPerformanceData(
    personalData?: PersonalData
  ): Promise<string> {
    try {
      const history = await this.getWorkoutHistory();

      let csvContent =
        "Date,Workout Name,Duration (min),Volume (kg),Calories,Personal Records,BMI\n";

      history.forEach((workout) => {
        const date = new Date(
          workout.feedback?.completedAt || 0
        ).toLocaleDateString("he-IL");
        const name = workout.workout?.name || "אימון";
        const duration = Math.round((workout.workout?.duration || 0) / 60);
        const volume = workout.stats?.totalVolume || 0;
        const calories = calculatePersonalizedCalories(duration, personalData);
        const personalRecords = workout.stats?.personalRecords || 0;
        const bmi = personalData ? calculatePersonalizedBMI(personalData) : "";

        csvContent += `${date},${name},${duration},${volume},${calories},${personalRecords},${bmi}\n`;
      });

      return csvContent;
    } catch (error) {
      console.error("Error exporting personalized data:", error);
      return "Error generating export data";
    }
  }

  /**
   * קבלת תובנות מותאמות אישית עבור האימון הבא
   * Get personalized insights for next workout recommendation
   */
  async getPersonalizedNextWorkoutInsights(
    personalData?: PersonalData
  ): Promise<{
    suggestedDuration: number; // minutes
    suggestedIntensity: "low" | "moderate" | "high";
    recoveryRecommendation: string;
    focusAreas: string[];
    expectedCalorieBurn: number;
  }> {
    try {
      const history = await this.getWorkoutHistory();
      const recentWorkouts = history.slice(0, 5); // Last 5 workouts

      if (recentWorkouts.length === 0) {
        return {
          suggestedDuration: 45,
          suggestedIntensity: "moderate",
          recoveryRecommendation: "התחל בעדינות עם אימון ראשון",
          focusAreas: ["גוף מלא"],
          expectedCalorieBurn: personalData
            ? calculatePersonalizedCalories(45, personalData)
            : 360,
        };
      }

      // Calculate average duration and intensity
      const avgDuration =
        recentWorkouts.reduce(
          (sum, w) => sum + Math.round((w.workout?.duration || 0) / 60),
          0
        ) / recentWorkouts.length;

      const avgVolume =
        recentWorkouts.reduce(
          (sum, w) => sum + (w.stats?.totalVolume || 0),
          0
        ) / recentWorkouts.length;

      // Age-adjusted recommendations
      const ageFactor = personalData
        ? getAgeStrengthFactor(personalData.age)
        : 1.0;
      const genderFactor = personalData?.gender === "female" ? 0.9 : 1.0;

      // Suggest duration (with age adjustments)
      const suggestedDuration = Math.round(
        avgDuration * ageFactor * genderFactor
      );

      // Suggest intensity based on recent performance
      let suggestedIntensity: "low" | "moderate" | "high" = "moderate";
      if (avgVolume > 2000) {
        suggestedIntensity = ageFactor < 0.9 ? "moderate" : "high";
      } else if (avgVolume < 800) {
        suggestedIntensity = "low";
      }

      // Recovery recommendations
      const daysSinceLastWorkout = this.getDaysSinceLastWorkout(recentWorkouts);
      let recoveryRecommendation = "מוכן לאימון!";

      if (daysSinceLastWorkout < 1) {
        recoveryRecommendation = "שקול יום מנוחה נוסף";
      } else if (daysSinceLastWorkout > 3) {
        recoveryRecommendation = "התחל בעדינות אחרי ההפסקה";
      }

      // Focus areas based on recent training
      const focusAreas = this.suggestFocusAreas(recentWorkouts, personalData);

      // Expected calorie burn
      const expectedCalorieBurn = calculatePersonalizedCalories(
        suggestedDuration,
        personalData
      );

      return {
        suggestedDuration,
        suggestedIntensity,
        recoveryRecommendation,
        focusAreas,
        expectedCalorieBurn,
      };
    } catch (error) {
      console.error("Error generating next workout insights:", error);
      return {
        suggestedDuration: 45,
        suggestedIntensity: "moderate",
        recoveryRecommendation: "נסה שוב מאוחר יותר",
        focusAreas: ["גוף מלא"],
        expectedCalorieBurn: 360,
      };
    }
  }

  /**
   * חישוב ימים מאז האימון האחרון
   */
  private getDaysSinceLastWorkout(workouts: WorkoutWithFeedback[]): number {
    if (workouts.length === 0) return 7;

    const lastWorkout = new Date(workouts[0].feedback?.completedAt || 0);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastWorkout.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * הצעת אזורי התמקדות לאימון הבא
   */
  private suggestFocusAreas(
    recentWorkouts: WorkoutWithFeedback[],
    personalData?: PersonalData
  ): string[] {
    const focusAreas: string[] = [];

    // Analyze recent muscle groups trained
    const recentMuscleGroups = new Set<string>();
    recentWorkouts.forEach((w) => {
      w.workout?.exercises?.forEach((ex) => {
        if (ex.primaryMuscles) {
          ex.primaryMuscles.forEach((muscle) => recentMuscleGroups.add(muscle));
        }
      });
    });

    // Suggest areas that haven't been trained recently
    const allMuscleGroups = [
      "chest",
      "back",
      "legs",
      "shoulders",
      "arms",
      "core",
    ];
    const undertrainedGroups = allMuscleGroups.filter(
      (group) => !recentMuscleGroups.has(group)
    );

    if (undertrainedGroups.length > 0) {
      focusAreas.push(...undertrainedGroups.slice(0, 2));
    } else {
      // If all groups were trained, suggest based on fitness level
      if (personalData?.fitnessLevel === "beginner") {
        focusAreas.push("גוף מלא");
      } else {
        focusAreas.push("כוח", "סיבולת");
      }
    }

    return focusAreas.length > 0 ? focusAreas : ["גוף מלא"];
  }

  /**
   * תיעוד זמן התחלת אימון
   */
  async recordWorkoutStart(workoutId: string): Promise<void> {
    try {
      const startTime = new Date().toISOString();
      await AsyncStorage.setItem(`workout_start_${workoutId}`, startTime);
    } catch (error) {
      console.error("Error recording workout start time:", error);
    }
  }

  /**
   * קבלת זמן התחלת אימון
   */
  async getWorkoutStartTime(workoutId: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(`workout_start_${workoutId}`);
    } catch (error) {
      console.error("Error getting workout start time:", error);
      return null;
    }
  }

  /**
   * מחיקת זמן התחלת אימון (אחרי שמירת האימון)
   */
  async clearWorkoutStartTime(workoutId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`workout_start_${workoutId}`);
    } catch (error) {
      console.error("Error clearing workout start time:", error);
    }
  }

  /**
   * ניתוח סטטיסטיקות מתקדמות עם נתונים אישיים
   * Advanced personalized workout analytics with BMI and fitness scoring
   */
  async getPersonalizedWorkoutAnalytics(personalData?: PersonalData): Promise<{
    totalWorkouts: number;
    averageCaloriesPerWorkout: number;
    strengthProgression: number; // Percentage improvement over time
    volumeProgression: number;
    bmi?: number;
    fitnessScore: number; // 1-100 based on performance vs expectations
    personalRecordsThisMonth: number;
    consistencyScore: number; // Based on workout frequency
    recommendations: string[];
  }> {
    try {
      const history = await this.getWorkoutHistory();

      if (history.length === 0) {
        return {
          totalWorkouts: 0,
          averageCaloriesPerWorkout: 0,
          strengthProgression: 0,
          volumeProgression: 0,
          bmi: personalData
            ? calculatePersonalizedBMI(personalData)
            : undefined,
          fitnessScore: 50,
          personalRecordsThisMonth: 0,
          consistencyScore: 0,
          recommendations: ["התחל עם אימון ראשון!"],
        };
      }

      // Calculate basic metrics
      const totalWorkouts = history.length;
      const totalCalories = history.reduce((sum, w) => {
        const duration = Math.round((w.workout?.duration || 0) / 60);
        return sum + calculatePersonalizedCalories(duration, personalData);
      }, 0);
      const averageCaloriesPerWorkout = Math.round(
        totalCalories / totalWorkouts
      );

      // Calculate progression (last 30 days vs previous 30 days)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

      const recentWorkouts = history.filter(
        (w) => new Date(w.feedback?.completedAt || 0) >= thirtyDaysAgo
      );
      const previousWorkouts = history.filter((w) => {
        const date = new Date(w.feedback?.completedAt || 0);
        return date >= sixtyDaysAgo && date < thirtyDaysAgo;
      });

      const recentAvgVolume = this.calculateAverageVolume(recentWorkouts);
      const previousAvgVolume = this.calculateAverageVolume(previousWorkouts);
      const volumeProgression =
        previousAvgVolume > 0
          ? Math.round(
              ((recentAvgVolume - previousAvgVolume) / previousAvgVolume) * 100
            )
          : 0;

      // Calculate strength progression (similar logic for max weights)
      const recentMaxWeight = this.calculateMaxWeight(recentWorkouts);
      const previousMaxWeight = this.calculateMaxWeight(previousWorkouts);
      const strengthProgression =
        previousMaxWeight > 0
          ? Math.round(
              ((recentMaxWeight - previousMaxWeight) / previousMaxWeight) * 100
            )
          : 0;

      // Personal records this month
      const personalRecordsThisMonth = history
        .filter((w) => {
          const date = new Date(w.feedback?.completedAt || 0);
          return date >= thirtyDaysAgo && (w.stats?.personalRecords || 0) > 0;
        })
        .reduce((sum, w) => sum + (w.stats?.personalRecords || 0), 0);

      // Consistency score (workouts per week vs target)
      const workoutsThisMonth = recentWorkouts.length;
      const weeksInMonth = 4.33;
      const workoutsPerWeek = workoutsThisMonth / weeksInMonth;
      const targetWorkoutsPerWeek =
        personalData?.fitnessLevel === "advanced"
          ? 5
          : personalData?.fitnessLevel === "intermediate"
            ? 4
            : 3;
      const consistencyScore = Math.min(
        100,
        Math.round((workoutsPerWeek / targetWorkoutsPerWeek) * 100)
      );

      // Fitness score based on performance vs expectations
      const avgPerformance = analyzePersonalizedPerformance(
        recentAvgVolume,
        "volume",
        personalData
      );
      const fitnessScore = avgPerformance.percentile;

      // Generate recommendations
      const recommendations = this.generatePersonalizedRecommendations({
        volumeProgression,
        strengthProgression,
        consistencyScore,
        fitnessScore,
        personalData,
      });

      return {
        totalWorkouts,
        averageCaloriesPerWorkout,
        strengthProgression,
        volumeProgression,
        bmi: personalData ? calculatePersonalizedBMI(personalData) : undefined,
        fitnessScore,
        personalRecordsThisMonth,
        consistencyScore,
        recommendations,
      };
    } catch (error) {
      console.error("Error calculating personalized analytics:", error);
      // Return default values on error
      return {
        totalWorkouts: 0,
        averageCaloriesPerWorkout: 0,
        strengthProgression: 0,
        volumeProgression: 0,
        bmi: personalData ? calculatePersonalizedBMI(personalData) : undefined,
        fitnessScore: 50,
        personalRecordsThisMonth: 0,
        consistencyScore: 0,
        recommendations: ["נסה שוב מאוחר יותר"],
      };
    }
  }

  /**
   * חישוב נפח ממוצע מרשימת אימונים
   */
  private calculateAverageVolume(workouts: WorkoutWithFeedback[]): number {
    if (workouts.length === 0) return 0;

    const totalVolume = workouts.reduce(
      (sum, w) => sum + (w.stats?.totalVolume || 0),
      0
    );
    return totalVolume / workouts.length;
  }

  /**
   * חישוב משקל מקסימלי מרשימת אימונים
   */
  private calculateMaxWeight(workouts: WorkoutWithFeedback[]): number {
    let maxWeight = 0;

    workouts.forEach((w) => {
      w.workout?.exercises?.forEach((ex) => {
        ex.sets?.forEach((set) => {
          if (set.actualWeight && set.actualWeight > maxWeight) {
            maxWeight = set.actualWeight;
          }
        });
      });
    });

    return maxWeight;
  }

  /**
   * יצירת המלצות מותאמות אישית
   */
  private generatePersonalizedRecommendations(data: {
    volumeProgression: number;
    strengthProgression: number;
    consistencyScore: number;
    fitnessScore: number;
    personalData?: PersonalData;
  }): string[] {
    const recommendations: string[] = [];

    // Consistency recommendations
    if (data.consistencyScore < 70) {
      recommendations.push("נסה לשמור על קביעות - 3-4 אימונים בשבוע אידיאליים");
    }

    // Progression recommendations
    if (data.volumeProgression < 5 && data.strengthProgression < 5) {
      recommendations.push("הגדל בהדרגה את המשקל או מספר החזרות");
    }

    // Age-specific recommendations
    if (data.personalData) {
      const ageFactor = getAgeStrengthFactor(data.personalData.age);
      if (ageFactor < 0.9) {
        recommendations.push("התמקד ביציבות ומניעת פציעות - איכות על פני כמות");
      }

      // Fitness level recommendations
      if (
        data.personalData.fitnessLevel === "beginner" &&
        data.fitnessScore > 70
      ) {
        recommendations.push("מצוין! אתה מוכן לעבור לרמת ביניים");
      }

      if (
        data.personalData.fitnessLevel === "advanced" &&
        data.fitnessScore < 60
      ) {
        recommendations.push("שקול להוריד את העצימות ולהתמקד בריכוז");
      }
    }

    // Performance recommendations
    if (data.fitnessScore > 80) {
      recommendations.push("ביצועים מעולים! המשך כך");
    } else if (data.fitnessScore < 40) {
      recommendations.push("קח יום מנוחה נוסף בין האימונים");
    }

    return recommendations.length > 0 ? recommendations : ["המשך לעבוד קשה!"];
  }

  /**
   * זיהוי שיאים חדשים באימון הנוכחי
   */
  async detectPersonalRecords(
    workout: WorkoutData,
    personalData?: PersonalData
  ): Promise<PersonalRecord[]> {
    try {
      const existingPerformances = await this.getPreviousPerformances();
      const newRecords: PersonalRecord[] = [];

      for (const exercise of workout.exercises) {
        const completedSets = exercise.sets.filter((set) => set.completed);
        if (completedSets.length === 0) continue;

        const existingPerf = existingPerformances.find(
          (p) => p.exerciseName === exercise.name
        );
        if (!existingPerf) {
          // אם זה התרגיל הראשון מהסוג הזה, הכל שיא!
          const maxWeight = Math.max(
            ...completedSets.map((s) => s.actualWeight || 0)
          );
          const maxReps = Math.max(
            ...completedSets.map((s) => s.actualReps || 0)
          );
          const maxVolume = Math.max(
            ...completedSets.map(
              (s) => (s.actualWeight || 0) * (s.actualReps || 0)
            )
          );

          if (maxWeight > 0) {
            // Analyze performance for internal use
            analyzePersonalizedPerformance(maxWeight, "weight", personalData);
            newRecords.push({
              exerciseName: exercise.name,
              type: "weight",
              value: maxWeight,
              previousValue: 0,
              date: new Date().toISOString(),
              improvement: maxWeight,
            });
          }

          if (maxReps > 0) {
            analyzePersonalizedPerformance(maxReps, "reps", personalData);
            newRecords.push({
              exerciseName: exercise.name,
              type: "reps",
              value: maxReps,
              previousValue: 0,
              date: new Date().toISOString(),
              improvement: maxReps,
            });
          }

          if (maxVolume > 0) {
            analyzePersonalizedPerformance(maxVolume, "volume", personalData);
            newRecords.push({
              exerciseName: exercise.name,
              type: "volume",
              value: maxVolume,
              previousValue: 0,
              date: new Date().toISOString(),
              improvement: maxVolume,
            });
          }
          continue;
        }

        // בדיקת שיא משקל
        const currentMaxWeight = Math.max(
          ...completedSets.map((s) => s.actualWeight || 0)
        );
        if (currentMaxWeight > existingPerf.personalRecords.maxWeight) {
          newRecords.push({
            exerciseName: exercise.name,
            type: "weight",
            value: currentMaxWeight,
            previousValue: existingPerf.personalRecords.maxWeight,
            date: new Date().toISOString(),
            improvement:
              currentMaxWeight - existingPerf.personalRecords.maxWeight,
          });
        }

        // בדיקת שיא נפח (בסט יחיד)
        const currentMaxVolume = Math.max(
          ...completedSets.map(
            (s) => (s.actualWeight || 0) * (s.actualReps || 0)
          )
        );
        if (currentMaxVolume > existingPerf.personalRecords.maxVolume) {
          newRecords.push({
            exerciseName: exercise.name,
            type: "volume",
            value: currentMaxVolume,
            previousValue: existingPerf.personalRecords.maxVolume,
            date: new Date().toISOString(),
            improvement:
              currentMaxVolume - existingPerf.personalRecords.maxVolume,
          });
        }

        // בדיקת שיא חזרות
        const currentMaxReps = Math.max(
          ...completedSets.map((s) => s.actualReps || 0)
        );
        if (currentMaxReps > existingPerf.personalRecords.maxReps) {
          newRecords.push({
            exerciseName: exercise.name,
            type: "reps",
            value: currentMaxReps,
            previousValue: existingPerf.personalRecords.maxReps,
            date: new Date().toISOString(),
            improvement: currentMaxReps - existingPerf.personalRecords.maxReps,
          });
        }
      }

      return newRecords;
    } catch (error) {
      console.error("Error detecting personal records:", error);
      return [];
    }
  }

  /**
   * קבלת כל היסטוריית האימונים
   */
  async getWorkoutHistory(): Promise<WorkoutWithFeedback[]> {
    try {
      const user = useUserStore.getState().user;
      if (user?.id) {
        return await workoutApi.listByUser(user.id);
      }
      const raw = await AsyncStorage.getItem(WORKOUT_HISTORY_KEY);
      const data: WorkoutWithFeedback[] = raw ? JSON.parse(raw) : [];
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(
        "❌ workoutHistoryService.getWorkoutHistory - Error:",
        error
      );
      return [];
    }
  }

  /**
   * שמירת ביצועים קודמים לשימוש באימון הבא (עם התאמת שמות תרגילים למגדר)
   */
  private async savePreviousPerformances(
    workout: WorkoutData,
    userGender?: UserGender
  ): Promise<void> {
    try {
      const existingPerformances = await this.getPreviousPerformances();

      const performances: PreviousPerformance[] = workout.exercises.map(
        (exercise) => {
          const completedSets = exercise.sets.filter((set) => set.completed);
          const setsData = completedSets.map((set) => ({
            weight: set.actualWeight || set.targetWeight || 0,
            reps: set.actualReps || set.targetReps || 0,
          }));

          // חישוב שיאים אישיים לתרגיל זה
          const maxWeight = Math.max(...setsData.map((s) => s.weight), 0);
          const maxReps = Math.max(...setsData.map((s) => s.reps), 0);
          const maxVolume = Math.max(
            ...setsData.map((s) => s.weight * s.reps),
            0
          );
          const totalVolume = setsData.reduce(
            (sum, s) => sum + s.weight * s.reps,
            0
          );

          // התאמת שם התרגיל למגדר לשמירה בהיסטוריה
          const adaptedExerciseName = adaptExerciseNameToGender(
            exercise.name,
            userGender
          );

          return {
            exerciseName: adaptedExerciseName, // שימוש בשם המותאם
            sets: setsData,
            date: new Date().toISOString(),
            personalRecords: {
              maxWeight,
              maxVolume,
              maxReps,
              totalVolume,
            },
          };
        }
      );

      // מיזוג עם קיימים (שמירה רק על הביצועים האחרונים לכל תרגיל)
      const updatedPerformances = [...existingPerformances];

      performances.forEach((newPerf) => {
        const existingIndex = updatedPerformances.findIndex(
          (perf) => perf.exerciseName === newPerf.exerciseName
        );

        if (existingIndex >= 0) {
          updatedPerformances[existingIndex] = newPerf; // עדכון
        } else {
          updatedPerformances.push(newPerf); // הוספה
        }
      });

      await AsyncStorage.setItem(
        PREVIOUS_PERFORMANCES_KEY,
        JSON.stringify(updatedPerformances)
      );
    } catch (error) {
      console.error("Error saving previous performances:", error);
    }
  }

  /**
   * קבלת ביצועים קודמים לתרגיל מסוים
   */
  async getPreviousPerformanceForExercise(
    exerciseName: string
  ): Promise<PreviousPerformance | null> {
    try {
      const performances = await this.getPreviousPerformances();
      return (
        performances.find((perf) => perf.exerciseName === exerciseName) || null
      );
    } catch (error) {
      console.error("Error getting previous performance:", error);
      return null;
    }
  }

  /**
   * קבלת כל הביצועים הקודמים
   */
  private async getPreviousPerformances(): Promise<PreviousPerformance[]> {
    try {
      const performancesJson = await AsyncStorage.getItem(
        PREVIOUS_PERFORMANCES_KEY
      );
      if (!performancesJson) return [];

      return JSON.parse(performancesJson);
    } catch (error) {
      console.error("Error loading previous performances:", error);
      return [];
    }
  }

  /**
   * מחיקת כל ההיסטוריה (לטסטים או איפוס)
   */
  async clearHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(WORKOUT_HISTORY_KEY);
      await AsyncStorage.removeItem(PREVIOUS_PERFORMANCES_KEY);
    } catch (error) {
      console.error("Error clearing workout history:", error);
      throw error;
    }
  }

  /**
   * קבלת סטטיסטיקות כלליות
   */
  async getWorkoutStatistics(): Promise<{
    totalWorkouts: number;
    totalDuration: number;
    averageDifficulty: number;
    workoutStreak: number;
  }> {
    try {
      const history = await this.getWorkoutHistory();

      const totalDuration = history.reduce(
        (sum, workout) => sum + workout.stats.duration,
        0
      );
      const averageDifficulty =
        history.reduce((sum, workout) => sum + workout.feedback.difficulty, 0) /
        history.length;

      // חישוב רצף אימונים (כמה ימים ברצף)
      const workoutStreak = this.calculateWorkoutStreak(history);

      return {
        totalWorkouts: history.length,
        totalDuration,
        averageDifficulty,
        workoutStreak,
      };
    } catch (error) {
      console.error("Error calculating workout statistics:", error);
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        averageDifficulty: 0,
        workoutStreak: 0,
      };
    }
  }

  /**
   * חישוב רצף אימונים (כמה ימים ברצף יש אימונים)
   */
  private calculateWorkoutStreak(history: WorkoutWithFeedback[]): number {
    if (history.length === 0) return 0;

    // מיון לפי תאריך (החדש ביותר ראשון)
    const sortedHistory = [...history].sort(
      (a, b) =>
        new Date(b.feedback.completedAt).getTime() -
        new Date(a.feedback.completedAt).getTime()
    );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const workout of sortedHistory) {
      const workoutDate = new Date(workout.feedback.completedAt);
      workoutDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor(
        (today.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * קבלת הודעת הצלחה אחרונה מותאמת למגדר
   * Get latest gender-adapted success message
   */
  async getLatestCongratulationMessage(): Promise<string | null> {
    try {
      const history = await this.getWorkoutHistory();
      if (history.length === 0) return null;

      return history[0].feedback.congratulationMessage || null;
    } catch (error) {
      console.error("Error getting latest congratulation message:", error);
      return null;
    }
  }

  /**
   * קבלת הערות אחרונות מותאמות למגדר
   * Get latest gender-adapted notes
   */
  async getLatestGenderAdaptedNotes(): Promise<string | null> {
    try {
      const history = await this.getWorkoutHistory();
      if (history.length === 0) return null;

      return history[0].feedback.genderAdaptedNotes || null;
    } catch (error) {
      console.error("Error getting latest gender adapted notes:", error);
      return null;
    }
  }

  /**
   * קבלת סטטיסטיקות מקובצות לפי מגדר
   * Get grouped statistics by gender
   */
  async getGenderGroupedStatistics(): Promise<{
    byGender: {
      male: { count: number; averageDifficulty: number };
      female: { count: number; averageDifficulty: number };
      other: { count: number; averageDifficulty: number };
    };
    total: {
      totalWorkouts: number;
      totalDuration: number;
      averageDifficulty: number;
      workoutStreak: number;
    };
  }> {
    try {
      const history = await this.getWorkoutHistory();

      // קיבוץ לפי מגדר
      const byGender = {
        male: { count: 0, averageDifficulty: 0 },
        female: { count: 0, averageDifficulty: 0 },
        other: { count: 0, averageDifficulty: 0 },
      };

      const totalDifficultyByGender = {
        male: 0,
        female: 0,
        other: 0,
      };

      history.forEach((workout) => {
        const gender = workout.metadata?.userGender || "other";
        byGender[gender].count++;
        totalDifficultyByGender[gender] += workout.feedback.difficulty;
      });

      // חישוב ממוצעים
      (Object.keys(byGender) as Array<keyof typeof byGender>).forEach(
        (gender) => {
          if (byGender[gender].count > 0) {
            byGender[gender].averageDifficulty =
              totalDifficultyByGender[gender] / byGender[gender].count;
          }
        }
      );

      // סטטיסטיקות כלליות
      const totalStats = await this.getWorkoutStatistics();

      return {
        byGender,
        total: totalStats,
      };
    } catch (error) {
      console.error("❌ getGenderGroupedStatistics - Error:", error);
      return {
        byGender: {
          male: { count: 0, averageDifficulty: 0 },
          female: { count: 0, averageDifficulty: 0 },
          other: { count: 0, averageDifficulty: 0 },
        },
        total: {
          totalWorkouts: 0,
          totalDuration: 0,
          averageDifficulty: 0,
          workoutStreak: 0,
        },
      };
    }
  }

  /**
   * בדיקת תקינות נתוני היסטוריה
   * Validate workout history data integrity
   */
  async validateHistoryData(): Promise<{
    isValid: boolean;
    issues: string[];
    totalRecords: number;
    corruptedRecords: number;
  }> {
    try {
      const history = await this.getWorkoutHistory();
      const issues: string[] = [];
      let corruptedRecords = 0;

      history.forEach((workout, index) => {
        // בדיקות תקינות בסיסיות
        if (!workout.id) {
          issues.push(`Record ${index}: Missing ID`);
          corruptedRecords++;
        }

        if (!workout.feedback.completedAt) {
          issues.push(`Record ${index}: Missing completion date`);
          corruptedRecords++;
        }

        if (
          workout.feedback.difficulty < 1 ||
          workout.feedback.difficulty > 5
        ) {
          issues.push(`Record ${index}: Invalid difficulty rating`);
          corruptedRecords++;
        }

        if (
          !workout.workout.exercises ||
          workout.workout.exercises.length === 0
        ) {
          issues.push(`Record ${index}: No exercises recorded`);
          corruptedRecords++;
        }
      });

      return {
        isValid: issues.length === 0,
        issues,
        totalRecords: history.length,
        corruptedRecords,
      };
    } catch (error) {
      console.error("Error validating history data:", error);
      return {
        isValid: false,
        issues: ["Failed to load history data"],
        totalRecords: 0,
        corruptedRecords: 0,
      };
    }
  }
}

export const workoutHistoryService = new WorkoutHistoryService();
