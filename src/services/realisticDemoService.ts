/**
 * @file src/services/realisticDemoService.ts
 * @brief דמו אמיתי - משתמש שמתחיל מאפס ובונה היסטוריה בזמן אמת
 * @description מדמה משתמש אמיתי שממלא שאלון ומבצע אימונים עם אלגוריתם התקדמות חכם
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "../stores/userStore";

// ממשק לאימון בודד
export interface WorkoutSession {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // דקות
  type: string; // "strength", "cardio", "flexibility"
  exercises: WorkoutExercise[];
  feedback: WorkoutFeedback;
  plannedVsActual: {
    plannedExercises: number;
    completedExercises: number;
    skippedSets: number;
    totalSetsPlanned: number;
    totalSetsCompleted: number;
  };
}

export interface WorkoutExercise {
  name: string;
  targetSets: number;
  targetReps: number;
  targetWeight?: number;
  actualSets: ExerciseSet[];
  skipped: boolean;
  notes?: string;
}

export interface ExerciseSet {
  reps: number;
  weight?: number;
  duration?: number; // לתרגילי זמן
  restTime: number; // שניות מנוחה
  perceivedExertion: number; // 1-10 RPE
  completed: boolean;
}

export interface WorkoutFeedback {
  overallRating: number; // 1-5
  difficulty: "too_easy" | "perfect" | "too_hard";
  enjoyment: "low" | "medium" | "high";
  energyLevel: number; // 1-10 לפני האימון
  fatigueLevel: number; // 1-10 אחרי האימון
  mood: "😢" | "😐" | "😊" | "🤩";
  notes: string;
  timeConstraints: boolean; // האם היה לחץ זמן
  equipmentIssues: boolean; // בעיות ציוד
}

// ממשק לניתוח ביצועים
export interface PerformanceAnalysis {
  trend: "improving" | "plateauing" | "declining";
  confidence: number; // 0-1
  keyMetrics: {
    volumeChange: number; // אחוז שינוי בנפח
    intensityChange: number; // אחוז שינוי בעצמה
    enduranceChange: number; // אחוז שינוי בסיבולת
    consistencyScore: number; // 0-1 עקביות
  };
  recommendations: WorkoutRecommendation[];
}

export interface WorkoutRecommendation {
  type:
    | "increase_weight"
    | "increase_reps"
    | "decrease_rest"
    | "change_exercise"
    | "add_volume"
    | "reduce_intensity";
  exercise?: string;
  currentValue: number;
  recommendedValue: number;
  reason: string;
  confidence: number; // 0-1
  priority: "low" | "medium" | "high";
}

class RealisticDemoService {
  private readonly DEMO_USER_KEY = "realistic_demo_user";
  private readonly DEMO_WORKOUTS_KEY = "realistic_demo_workouts";

  /**
   * יצירת משתמש דמו חדש עם נתוני שאלון בסיסיים בלבד
   */
  async createRealisticDemoUser(): Promise<void> {
    console.log("🎯 REALISTIC DEMO SERVICE: Starting user creation...");

    // מחיקת נתונים קיימים
    await AsyncStorage.removeItem(this.DEMO_USER_KEY);
    await AsyncStorage.removeItem(this.DEMO_WORKOUTS_KEY);
    console.log("🧹 REALISTIC DEMO SERVICE: Cleared existing data");

    console.log(
      "🚀 REALISTIC DEMO SERVICE: Creating realistic demo user from scratch..."
    );

    // נתוני שאלון בסיסיים בלבד (כמו משתמש אמיתי)
    const basicUserData = {
      id: "demo_user_realistic",
      email: "yoni.cohen.fit@gmail.com",
      name: "יוני כהן",
      provider: "demo",
      createdAt: new Date().toISOString(),
      avatar: "🏋️‍♂️",

      // רק נתוני שאלון בסיסיים - בדיוק כמו משתמש אמיתי
      questionnaireData: {
        // פרטים אישיים
        age_range: "26-35",
        gender: "male",
        height: 175,
        weight: 75,

        // רמת כושר - הערכה עצמית בלבד
        fitness_experience: "some_experience",

        // מטרות
        primary_goal: "build_muscle",
        secondary_goals: ["increase_strength", "improve_health"],

        // פרמטרי אימון
        available_days: 4,
        session_duration: "45-60",
        workout_location: "gym",
        available_equipment: ["dumbbells", "barbell", "cable_machine"],

        // העדפות
        preferred_time: "evening",
        motivation_type: "achievement",
        workout_style: "focused",

        // בריאות
        health_status: "good",
        previous_injuries: [],

        completedAt: new Date().toISOString(),
      },

      // גם בפורמט הישן לתאימות עם ProfileScreen
      questionnaire: {
        age: "26-35",
        goal: "build_muscle",
        experience: "some_experience",
        location: "gym",
        frequency: "4 times per week",
        duration: "45-60",
        equipment: ["dumbbells", "barbell", "cable_machine"],
        gender: "male",
        height: 175,
        weight: 75,
      },

      // התחלה מאפס - כמו משתמש אמיתי
      activityHistory: {
        workouts: [],
        achievements: [],
        milestones: [],
      },
      currentStats: {
        totalWorkouts: 0,
        totalVolume: 0,
        averageRating: 0,
        currentStreak: 0,
        longestStreak: 0,
        personalRecords: [],
        // הוספת מערכת נקודות
        totalPoints: 0,
        level: 1,
        xp: 0,
      },
    };

    // שמירה
    await AsyncStorage.setItem(
      this.DEMO_USER_KEY,
      JSON.stringify(basicUserData)
    );
    await AsyncStorage.setItem(this.DEMO_WORKOUTS_KEY, JSON.stringify([]));

    console.log("✅ REALISTIC DEMO SERVICE: User created successfully!");
    console.log("📧 REALISTIC DEMO SERVICE: Email:", basicUserData.email);
    console.log("👤 REALISTIC DEMO SERVICE: Name:", basicUserData.name);
  }

  /**
   * הוספת אימון חדש והרצת אלגוריתם ניתוח
   */
  async addWorkoutSession(workout: WorkoutSession): Promise<void> {
    console.log(
      `📊 Adding workout session: ${workout.type} on ${workout.date}`
    );

    try {
      // קבלת היסטוריה נוכחית
      const workoutsJson = await AsyncStorage.getItem(this.DEMO_WORKOUTS_KEY);
      const workouts: WorkoutSession[] = workoutsJson
        ? JSON.parse(workoutsJson)
        : [];

      // הוספת האימון החדש
      workouts.push(workout);

      // שמירת היסטוריה מעודכנת
      await AsyncStorage.setItem(
        this.DEMO_WORKOUTS_KEY,
        JSON.stringify(workouts)
      );

      // עדכון סטטיסטיקות משתמש
      await this.updateUserStats(workouts);

      // ריצת אלגוריתם ניתוח והמלצות
      const analysis = await this.analyzePerformance(workouts);
      console.log("🤖 Performance analysis:", analysis);

      // יצירת המלצות לאימון הבא
      if (analysis.recommendations.length > 0) {
        await this.generateWorkoutRecommendations(analysis);
      }
    } catch (error) {
      console.error("❌ Error adding workout session:", error);
    }
  }

  /**
   * אלגוריתם חכם לניתוח ביצועים
   */
  private async analyzePerformance(
    workouts: WorkoutSession[]
  ): Promise<PerformanceAnalysis> {
    console.log(`🧠 Analyzing performance from ${workouts.length} workouts...`);

    if (workouts.length < 3) {
      return {
        trend: "improving",
        confidence: 0.3,
        keyMetrics: {
          volumeChange: 0,
          intensityChange: 0,
          enduranceChange: 0,
          consistencyScore: 1,
        },
        recommendations: [],
      };
    }

    // ניתוח 4 השבועות האחרונים vs 4 השבועות לפני כן
    const recentWorkouts = workouts.slice(-8); // 8 אימונים אחרונים
    const previousWorkouts = workouts.slice(-16, -8); // 8 אימונים קודמים

    // חישוב מדדי ביצועים
    const recentMetrics = this.calculateWorkoutMetrics(recentWorkouts);
    const previousMetrics = this.calculateWorkoutMetrics(previousWorkouts);

    // ניתוח מגמה
    const volumeChange = this.calculatePercentageChange(
      previousMetrics.averageVolume,
      recentMetrics.averageVolume
    );
    const intensityChange = this.calculatePercentageChange(
      previousMetrics.averageIntensity,
      recentMetrics.averageIntensity
    );
    const enduranceChange = this.calculatePercentageChange(
      previousMetrics.averageDuration,
      recentMetrics.averageDuration
    );

    // ציון עקביות
    const consistencyScore = this.calculateConsistencyScore(recentWorkouts);

    // קביעת מגמה
    let trend: "improving" | "plateauing" | "declining" = "plateauing";
    if (volumeChange > 5 && intensityChange > 0) trend = "improving";
    else if (volumeChange < -5 || intensityChange < -10) trend = "declining";

    // רמת ביטחון
    const confidence = Math.min(workouts.length / 20, 1); // יותר אימונים = יותר ביטחון

    // יצירת המלצות
    const recommendations = this.generateRecommendations(
      recentMetrics,
      previousMetrics,
      trend
    );

    console.log(
      `📈 Analysis complete: ${trend} trend with ${Math.round(confidence * 100)}% confidence`
    );

    return {
      trend,
      confidence,
      keyMetrics: {
        volumeChange,
        intensityChange,
        enduranceChange,
        consistencyScore,
      },
      recommendations,
    };
  }

  /**
   * חישוב מדדי ביצועים לאימונים
   */
  private calculateWorkoutMetrics(workouts: WorkoutSession[]) {
    if (workouts.length === 0) {
      return {
        averageVolume: 0,
        averageIntensity: 0,
        averageDuration: 0,
        completionRate: 0,
        averageRating: 0,
      };
    }

    const totalVolume = workouts.reduce((sum, workout) => {
      return (
        sum +
        workout.exercises.reduce((exerciseSum, exercise) => {
          return (
            exerciseSum +
            exercise.actualSets.reduce((setSum, set) => {
              return setSum + set.reps * (set.weight || 1);
            }, 0)
          );
        }, 0)
      );
    }, 0);

    const totalSetsPlanned = workouts.reduce(
      (sum, w) => sum + w.plannedVsActual.totalSetsPlanned,
      0
    );
    const totalSetsCompleted = workouts.reduce(
      (sum, w) => sum + w.plannedVsActual.totalSetsCompleted,
      0
    );

    const averageIntensity =
      workouts.reduce((sum, workout) => {
        const workoutIntensity = workout.exercises.reduce(
          (exerciseSum, exercise) => {
            const setsIntensity = exercise.actualSets.reduce(
              (setSum, set) => setSum + set.perceivedExertion,
              0
            );
            return (
              exerciseSum +
              setsIntensity / Math.max(exercise.actualSets.length, 1)
            );
          },
          0
        );
        return sum + workoutIntensity / Math.max(workout.exercises.length, 1);
      }, 0) / workouts.length;

    return {
      averageVolume: totalVolume / workouts.length,
      averageIntensity,
      averageDuration:
        workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length,
      completionRate: totalSetsCompleted / Math.max(totalSetsPlanned, 1),
      averageRating:
        workouts.reduce((sum, w) => sum + w.feedback.overallRating, 0) /
        workouts.length,
    };
  }

  /**
   * יצירת המלצות מבוססות ניתוח
   */
  private generateRecommendations(
    recent: any,
    previous: any,
    trend: string
  ): WorkoutRecommendation[] {
    const recommendations: WorkoutRecommendation[] = [];

    // המלצות על בסיס השוואת ביצועים
    if (trend === "improving" && recent.completionRate > 0.9) {
      recommendations.push({
        type: "increase_weight",
        currentValue: 100, // דוגמה
        recommendedValue: 105,
        reason: "ביצועים מצוינים - זמן להעלות משקל",
        confidence: 0.8,
        priority: "high",
      });
    }

    if (recent.completionRate < 0.7) {
      recommendations.push({
        type: "reduce_intensity",
        currentValue: recent.averageIntensity,
        recommendedValue: recent.averageIntensity * 0.9,
        reason: "שיעור השלמה נמוך - כדאי להקל",
        confidence: 0.7,
        priority: "medium",
      });
    }

    if (recent.averageRating < 3) {
      recommendations.push({
        type: "change_exercise",
        currentValue: 0,
        recommendedValue: 1,
        reason: "דירוגים נמוכים - כדאי לגוון תרגילים",
        confidence: 0.6,
        priority: "medium",
      });
    }

    console.log(`💡 Generated ${recommendations.length} recommendations`);
    return recommendations;
  }

  /**
   * חישוב שינוי באחוזים
   */
  private calculatePercentageChange(
    oldValue: number,
    newValue: number
  ): number {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
  }

  /**
   * חישוב ציון עקביות
   */
  private calculateConsistencyScore(workouts: WorkoutSession[]): number {
    if (workouts.length === 0) return 1;

    // בדיקת מרווחים בין אימונים
    const dates = workouts.map((w) => new Date(w.date)).sort();
    const intervals = [];

    for (let i = 1; i < dates.length; i++) {
      const interval =
        (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
      intervals.push(interval);
    }

    if (intervals.length === 0) return 1;

    // חישוב סטיית תקן של המרווחים
    const avgInterval =
      intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
    const variance =
      intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) /
      intervals.length;
    const stdDev = Math.sqrt(variance);

    // עקביות גבוהה = סטיית תקן נמוכה
    return Math.max(0, 1 - stdDev / avgInterval);
  }

  /**
   * עדכון סטטיסטיקות משתמש
   */
  private async updateUserStats(workouts: WorkoutSession[]): Promise<void> {
    try {
      const userJson = await AsyncStorage.getItem(this.DEMO_USER_KEY);
      if (!userJson) return;

      const userData = JSON.parse(userJson);

      // חישוב סטטיסטיקות מעודכנות
      const totalVolume = workouts.reduce((sum, workout) => {
        return (
          sum +
          workout.exercises.reduce((exerciseSum, exercise) => {
            return (
              exerciseSum +
              exercise.actualSets.reduce((setSum, set) => {
                return setSum + set.reps * (set.weight || 1);
              }, 0)
            );
          }, 0)
        );
      }, 0);

      const averageRating =
        workouts.length > 0
          ? workouts.reduce((sum, w) => sum + w.feedback.overallRating, 0) /
            workouts.length
          : 0;

      // חישוב רצף נוכחי
      const currentStreak = this.calculateCurrentStreak(workouts);

      // חישוב נקודות ורמה
      const totalPoints = workouts.reduce((sum, w) => {
        let points = 50; // נקודות בסיס לכל אימון
        points += w.feedback.overallRating * 10; // בונוס לפי דירוג
        points += Math.floor(w.duration / 10) * 5; // בונוס לפי משך
        return sum + points;
      }, 0);

      const level = Math.floor(totalPoints / 1000) + 1; // כל 1000 נקודות = רמה
      const xp = totalPoints % 1000; // נקודות ברמה הנוכחית

      // עדכון נתונים
      userData.currentStats = {
        totalWorkouts: workouts.length,
        totalVolume: Math.round(totalVolume),
        averageRating: Math.round(averageRating * 10) / 10,
        currentStreak,
        longestStreak: Math.max(
          userData.currentStats.longestStreak || 0,
          currentStreak
        ),
        personalRecords: this.extractPersonalRecords(workouts),
        totalPoints,
        level,
        xp,
      };

      userData.activityHistory = {
        workouts: workouts,
        achievements: userData.activityHistory?.achievements || [],
        milestones: userData.activityHistory?.milestones || [],
      };

      // שמירה
      await AsyncStorage.setItem(this.DEMO_USER_KEY, JSON.stringify(userData));

      console.log(
        `📊 Updated user stats: ${workouts.length} workouts, ${Math.round(totalVolume)}kg volume`
      );
    } catch (error) {
      console.error("❌ Error updating user stats:", error);
    }
  }

  /**
   * חישוב רצף אימונים נוכחי
   */
  private calculateCurrentStreak(workouts: WorkoutSession[]): number {
    if (workouts.length === 0) return 0;

    const sortedWorkouts = workouts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const today = new Date();
    const lastWorkout = new Date(sortedWorkouts[0].date);

    // אם האימון האחרון היה יותר מ-3 ימים - הרצף נפסק
    const daysSinceLastWorkout =
      (today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastWorkout > 3) return 0;

    let streak = 1;
    for (let i = 1; i < sortedWorkouts.length; i++) {
      const current = new Date(sortedWorkouts[i].date);
      const previous = new Date(sortedWorkouts[i - 1].date);
      const daysBetween =
        (previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);

      if (daysBetween <= 3) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * חילוץ שיאים אישיים
   */
  private extractPersonalRecords(workouts: WorkoutSession[]) {
    const records: any[] = [];
    const exerciseRecords: {
      [key: string]: { weight: number; reps: number; volume: number };
    } = {};

    workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        exercise.actualSets.forEach((set) => {
          if (!set.completed) return;

          const exerciseName = exercise.name;
          if (!exerciseRecords[exerciseName]) {
            exerciseRecords[exerciseName] = { weight: 0, reps: 0, volume: 0 };
          }

          // שיא משקל
          if (set.weight && set.weight > exerciseRecords[exerciseName].weight) {
            exerciseRecords[exerciseName].weight = set.weight;
          }

          // שיא חזרות
          if (set.reps > exerciseRecords[exerciseName].reps) {
            exerciseRecords[exerciseName].reps = set.reps;
          }

          // שיא נפח
          const volume = set.reps * (set.weight || 1);
          if (volume > exerciseRecords[exerciseName].volume) {
            exerciseRecords[exerciseName].volume = volume;
          }
        });
      });
    });

    // המרה לפורמט שיאים
    Object.keys(exerciseRecords).forEach((exerciseName) => {
      const record = exerciseRecords[exerciseName];
      if (record.weight > 0) {
        records.push({
          exercise: exerciseName,
          type: "weight",
          value: record.weight,
          date: new Date().toISOString(),
        });
      }
      if (record.reps > 0) {
        records.push({
          exercise: exerciseName,
          type: "reps",
          value: record.reps,
          date: new Date().toISOString(),
        });
      }
    });

    return records;
  }

  /**
   * יצירת המלצות לתוכנית אימון
   */
  private async generateWorkoutRecommendations(
    analysis: PerformanceAnalysis
  ): Promise<void> {
    console.log("🎯 Generating workout plan recommendations...");

    // כאן נשמור המלצות לתוכנית אימון מעודכנת
    const recommendations = {
      analysisDate: new Date().toISOString(),
      trend: analysis.trend,
      confidence: analysis.confidence,
      suggestions: analysis.recommendations,
      nextWorkoutAdjustments: this.createNextWorkoutAdjustments(analysis),
    };

    await AsyncStorage.setItem(
      "workout_recommendations",
      JSON.stringify(recommendations)
    );
    console.log("💾 Workout recommendations saved");
  }

  /**
   * יצירת התאמות לאימון הבא
   */
  private createNextWorkoutAdjustments(analysis: PerformanceAnalysis) {
    const adjustments: any[] = [];

    analysis.recommendations.forEach((rec) => {
      switch (rec.type) {
        case "increase_weight":
          adjustments.push({
            type: "weight_increase",
            exercise: rec.exercise || "all",
            adjustment: "+5%",
            reason: rec.reason,
          });
          break;
        case "increase_reps":
          adjustments.push({
            type: "rep_increase",
            exercise: rec.exercise || "all",
            adjustment: "+1-2 reps",
            reason: rec.reason,
          });
          break;
        case "reduce_intensity":
          adjustments.push({
            type: "intensity_reduction",
            exercise: rec.exercise || "all",
            adjustment: "-10%",
            reason: rec.reason,
          });
          break;
      }
    });

    return adjustments;
  }

  /**
   * קבלת נתוני משתמש דמו
   */
  async getDemoUser() {
    try {
      const userJson = await AsyncStorage.getItem(this.DEMO_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error("❌ Error getting demo user:", error);
      return null;
    }
  }

  /**
   * קבלת היסטוריית אימונים
   */
  async getWorkoutHistory(): Promise<WorkoutSession[]> {
    try {
      const workoutsJson = await AsyncStorage.getItem(this.DEMO_WORKOUTS_KEY);
      return workoutsJson ? JSON.parse(workoutsJson) : [];
    } catch (error) {
      console.error("❌ Error getting workout history:", error);
      return [];
    }
  }

  /**
   * מחיקת כל נתוני הדמו
   */
  async clearDemoData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.DEMO_USER_KEY);
      await AsyncStorage.removeItem(this.DEMO_WORKOUTS_KEY);
      await AsyncStorage.removeItem("workout_recommendations");
      console.log("🧹 Demo data cleared");
    } catch (error) {
      console.error("❌ Error clearing demo data:", error);
    }
  }
}

export const realisticDemoService = new RealisticDemoService();
