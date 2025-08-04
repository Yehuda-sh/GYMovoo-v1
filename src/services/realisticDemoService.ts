/**
 * @file src/services/realisticDemoService.ts
 * @brief שירות דמו מציאותי לסימולציית משתמש אמיתי עם אלגוריתם למידה חכם
 * @description מדמה משתמש אמיתי שממלא שאלון, מבצע אימונים, ובונה היסטוריה בזמן אמת עם ניתוח ביצועים מתקדם
 * @features ניתוח ביצועים חכם, המלצות אימון מותאמות, מעקב התקדמות, מערכת נקודות ורמות
 * @algorithms אלגוריתם ניתוח מגמות, חישוב עקביות, זיהוי שיאים אישיים, המלצות מבוססות נתונים
 * @dependencies AsyncStorage, userStore, WorkoutSession interfaces
 * @performance אופטימיזציה למינימום logging, עיבוד נתונים יעיל, ניהול זיכרון חכם
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  adaptExerciseNameToGender,
  generateSingleGenderAdaptedNote,
  UserGender,
} from "../utils/genderAdaptation";
import { ExerciseSet as BaseExerciseSet } from "../types";

// ממשק מרכזי לאימון בודד עם יכולות מעקב מקיפות
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

// מעקב תרגיל בודד עם מדדי ביצועים מפורטים
export interface WorkoutExercise {
  name: string;
  targetSets: number;
  targetReps: number;
  targetWeight?: number;
  actualSets: RealisticExerciseSet[];
  skipped: boolean;
  notes?: string;
}

// סט בודד עם נתוני ביצועים מקיפים - מורחב מהממשק הבסיסי
export interface RealisticExerciseSet extends BaseExerciseSet {
  restTime: number; // שניות מנוחה (חובה במקום אופציונלי)
  perceivedExertion: number; // סולם RPE 1-10
  completed: boolean; // חובה (לא אופציונלי)
}

// משוב מקיף על האימון וחוויית המשתמש
export interface WorkoutFeedback {
  overallRating: number; // דירוג כללי 1-5 כוכבים
  difficulty: "too_easy" | "perfect" | "too_hard";
  enjoyment: "low" | "medium" | "high";
  energyLevel: number; // רמת אנרגיה לפני האימון 1-10
  fatigueLevel: number; // רמת עייפות אחרי האימון 1-10
  mood: "😢" | "😐" | "😊" | "🤩";
  notes: string;
  timeConstraints: boolean; // האם היה לחץ זמן
  equipmentIssues: boolean; // בעיות ציוד
}

// ניתוח ביצועים מתקדם עם תובנות מבוססות בינה מלאכותית
export interface PerformanceAnalysis {
  trend: "improving" | "plateauing" | "declining";
  confidence: number; // רמת ביטחון 0-1
  keyMetrics: {
    volumeChange: number; // אחוז שינוי בנפח אימון
    intensityChange: number; // אחוז שינוי בעצמה
    enduranceChange: number; // אחוז שינוי בסיבולת
    consistencyScore: number; // דירוג עקביות 0-1
  };
  recommendations: PerformanceRecommendation[];
}

// ממשק מדדי אימון לבטיחות טיפוסים
interface WorkoutMetrics {
  averageVolume: number;
  averageIntensity: number;
  averageDuration: number;
  completionRate: number;
  averageRating: number;
}

// Personal record interface for structured tracking
// ממשק שיא אישי למעקב מובנה
interface PersonalRecord {
  exercise: string;
  type: "weight" | "reps" | "volume";
  value: number;
  date: string;
}

// ממשק התאמת אימון לתכנון חכם
interface WorkoutAdjustment {
  type: "weight_increase" | "rep_increase" | "intensity_reduction";
  exercise: string;
  adjustment: string;
  reason: string;
}

// המלצות אימון חכמות מבוססות נתוני ביצועים
export interface PerformanceRecommendation {
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
  confidence: number; // רמת ביטחון בהמלצה 0-1
  priority: "low" | "medium" | "high";
}

// שירות דמו מציאותי - יישום מרכזי עם אלגוריתמים חכמים
class RealisticDemoService {
  private readonly DEMO_USER_KEY = "realistic_demo_user";
  private readonly DEMO_WORKOUTS_KEY = "realistic_demo_workouts";

  /**
   * יצירת משתמש דמו חדש עם נתוני שאלון חיוניים בלבד - מדמה תהליך הכרות אמיתי של משתמש
   */
  async createRealisticDemoUser(gender?: UserGender): Promise<void> {
    // יצירת משתמש דמו מציאותי עם לוגים מינימליים

    // מחיקת נתונים קיימים
    await AsyncStorage.removeItem(this.DEMO_USER_KEY);
    await AsyncStorage.removeItem(this.DEMO_WORKOUTS_KEY);

    // יצירת נתוני דמו מבוססי מגדר
    const selectedGender = gender || (Math.random() > 0.5 ? "male" : "female");
    const genderBasedData = this.generateGenderBasedDemoData(selectedGender);

    // רק נתוני שאלון חיוניים - בדיוק כמו שמשתמש אמיתי היה מספק
    const basicUserData = {
      id: "demo_user_realistic",
      email: genderBasedData.email,
      name: genderBasedData.name,
      provider: "demo",
      createdAt: new Date().toISOString(),
      avatar: genderBasedData.avatar,

      // נתוני שאלון מרכזיים - פרופיל משתמש בסיסי
      questionnaireData: {
        // פרטים אישיים
        age_range: "26-35",
        gender: selectedGender,
        height: genderBasedData.height,
        weight: genderBasedData.weight,

        // רמת כושר - הערכה עצמית בלבד
        fitness_experience: "some_experience",

        // מטרות ויעדים
        primary_goal: "build_muscle",
        secondary_goals: ["increase_strength", "improve_health"],

        // פרמטרי אימון
        available_days: 4,
        session_duration: "45-60",
        workout_location: "gym",
        available_equipment: ["dumbbells", "barbell", "cable_machine"],

        // העדפות וסגנון
        preferred_time: "evening",
        motivation_type: "achievement",
        workout_style: "focused",

        // מצב בריאותי
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
        gender: selectedGender,
        height: genderBasedData.height,
        weight: genderBasedData.weight,
      },

      // התחלה מאפס - חוויית משתמש חדש אמיתית
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
        // מערכת גיימיפיקציה משופרת
        totalPoints: 0,
        level: 1,
        xp: 0,
      },
    };

    // שמירה עם לוגים מינימליים
    await AsyncStorage.setItem(
      this.DEMO_USER_KEY,
      JSON.stringify(basicUserData)
    );
    await AsyncStorage.setItem(this.DEMO_WORKOUTS_KEY, JSON.stringify([]));
  }

  /**
   * Add new workout session and run intelligent analysis algorithm
   * הוספת אימון חדש והרצת אלגוריתם ניתוח חכם
   */
  async addWorkoutSession(workout: WorkoutSession): Promise<void> {
    try {
      // קבלת נתוני משתמש להתאמת מגדר
      const user = await this.getDemoUser();
      const userGender: UserGender =
        (user?.questionnaireData?.gender as UserGender) || "other";

      // התאמת שמות תרגילים למגדר
      const adaptedWorkout = this.adaptWorkoutToGender(workout, userGender);

      // קבלת היסטוריה נוכחית
      const workoutsJson = await AsyncStorage.getItem(this.DEMO_WORKOUTS_KEY);
      const workouts: WorkoutSession[] = workoutsJson
        ? JSON.parse(workoutsJson)
        : [];

      // הוספת האימון החדש
      workouts.push(adaptedWorkout);

      // שמירת היסטוריה מעודכנת
      await AsyncStorage.setItem(
        this.DEMO_WORKOUTS_KEY,
        JSON.stringify(workouts)
      );

      // עדכון סטטיסטיקות משתמש
      await this.updateUserStats(workouts);

      // ריצת אלגוריתם ניתוח והמלצות
      const analysis = await this.analyzePerformance(workouts);

      // יצירת המלצות לאימון הבא
      if (analysis.recommendations.length > 0) {
        await this.generateWorkoutRecommendations(analysis);
      }
    } catch (error) {
      console.error("Error adding workout session:", error);
    }
  }

  /**
   * Adapt workout session to user gender preferences
   * התאמת אימון להעדפות מגדר המשתמש
   */
  private adaptWorkoutToGender(
    workout: WorkoutSession,
    gender: UserGender
  ): WorkoutSession {
    const adaptedWorkout = { ...workout };

    // התאמת שמות תרגילים למגדר
    adaptedWorkout.exercises = workout.exercises.map((exercise) => ({
      ...exercise,
      name: adaptExerciseNameToGender(exercise.name, gender),
    }));

    // התאמת הערות פידבק למגדר
    const averageRPE =
      workout.exercises.reduce((sum, ex) => {
        const setsRPE = ex.actualSets.reduce(
          (setSum, set) => setSum + set.perceivedExertion,
          0
        );
        return sum + setsRPE / Math.max(ex.actualSets.length, 1);
      }, 0) / workout.exercises.length;

    adaptedWorkout.feedback = {
      ...workout.feedback,
      notes: generateSingleGenderAdaptedNote(gender, averageRPE > 6 ? 4 : 3),
    };

    return adaptedWorkout;
  }

  /**
   * Generate gender-based demo data for realistic user profiles
   * יצירת נתוני דמו מבוססי מגדר לפרופילי משתמש מציאותיים
   */
  private generateGenderBasedDemoData(gender: UserGender) {
    const maleProfiles = [
      {
        name: "יוני כהן",
        email: "yoni.cohen.fit@gmail.com",
        avatar: "🏋️‍♂️",
        height: 175,
        weight: 75,
      },
      {
        name: "דני לוי",
        email: "dani.levi.workout@gmail.com",
        avatar: "💪",
        height: 180,
        weight: 82,
      },
      {
        name: "רון ישראלי",
        email: "ron.israeli.gym@gmail.com",
        avatar: "🤸‍♂️",
        height: 172,
        weight: 70,
      },
    ];

    const femaleProfiles = [
      {
        name: "מיכל כהן",
        email: "michal.cohen.fit@gmail.com",
        avatar: "🏋️‍♀️",
        height: 165,
        weight: 60,
      },
      {
        name: "נועה לוי",
        email: "noa.levi.workout@gmail.com",
        avatar: "💃",
        height: 170,
        weight: 65,
      },
      {
        name: "שירה ישראלי",
        email: "shira.israeli.gym@gmail.com",
        avatar: "🤸‍♀️",
        height: 162,
        weight: 55,
      },
    ];

    const otherProfiles = [
      {
        name: "אלכס דמו",
        email: "alex.demo.fit@gmail.com",
        avatar: "🌟",
        height: 168,
        weight: 68,
      },
    ];

    if (gender === "male") {
      return maleProfiles[Math.floor(Math.random() * maleProfiles.length)];
    } else if (gender === "female") {
      return femaleProfiles[Math.floor(Math.random() * femaleProfiles.length)];
    } else {
      return otherProfiles[0];
    }
  }

  /**
   * Intelligent performance analysis algorithm with trend detection
   * אלגוריתם חכם לניתוח ביצועים עם זיהוי מגמות
   */
  private async analyzePerformance(
    workouts: WorkoutSession[]
  ): Promise<PerformanceAnalysis> {
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

    // Analyze last 4 weeks vs previous 4 weeks for accurate trend detection
    // ניתוח 4 השבועות האחרונים לעומת 4 השבועות הקודמים לזיהוי מגמה מדויק
    const recentWorkouts = workouts.slice(-8); // 8 אימונים אחרונים
    const previousWorkouts = workouts.slice(-16, -8); // 8 אימונים קודמים

    // חישוב מדדי ביצועים מקיפים
    const recentMetrics = this.calculateWorkoutMetrics(recentWorkouts);
    const previousMetrics = this.calculateWorkoutMetrics(previousWorkouts);

    // ניתוח מגמה מתקדם עם גורמים מרובים
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

    // ציון עקביות עבור דבקות באימונים
    const consistencyScore = this.calculateConsistencyScore(recentWorkouts);

    // קביעת מגמה חכמה
    let trend: "improving" | "plateauing" | "declining" = "plateauing";
    if (volumeChange > 5 && intensityChange > 0) trend = "improving";
    else if (volumeChange < -5 || intensityChange < -10) trend = "declining";

    // רמת ביטחון מבוססת כמות נתונים
    const confidence = Math.min(workouts.length / 20, 1); // יותר אימונים = ביטחון גבוה יותר

    // יצירת המלצות
    const recommendations = this.generateRecommendations(
      recentMetrics,
      previousMetrics,
      trend
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
   * Calculate comprehensive workout metrics for performance analysis
   * חישוב מדדי ביצועים מקיפים לניתוח ביצועים
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

    // חישוב נפח אימון כולל על פני כל האימונים
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

    // חישוב שיעורי השלמת אימונים
    const totalSetsPlanned = workouts.reduce(
      (sum, w) => sum + w.plannedVsActual.totalSetsPlanned,
      0
    );
    const totalSetsCompleted = workouts.reduce(
      (sum, w) => sum + w.plannedVsActual.totalSetsCompleted,
      0
    );

    // חישוב עצמת אימון ממוצעת באמצעות RPE
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
   * Generate data-driven recommendations based on performance analysis
   * יצירת המלצות מבוססות נתונים על בסיס ניתוח ביצועים
   */
  private generateRecommendations(
    recent: WorkoutMetrics,
    previous: WorkoutMetrics,
    trend: string
  ): PerformanceRecommendation[] {
    const recommendations: PerformanceRecommendation[] = [];

    // Performance-based recommendations with intelligent thresholds
    // המלצות מבוססות ביצועים עם ספים חכמים
    if (trend === "improving" && recent.completionRate > 0.9) {
      recommendations.push({
        type: "increase_weight",
        currentValue: 100, // דוגמה לבסיס
        recommendedValue: 105,
        reason:
          "ביצועים מצוינים - זמן להעלות משקל | Excellent performance - time to increase weight",
        confidence: 0.8,
        priority: "high",
      });
    }

    // התערבות בשיעור השלמה נמוך
    if (recent.completionRate < 0.7) {
      recommendations.push({
        type: "reduce_intensity",
        currentValue: recent.averageIntensity,
        recommendedValue: recent.averageIntensity * 0.9,
        reason:
          "שיעור השלמה נמוך - כדאי להקל | Low completion rate - consider reducing intensity",
        confidence: 0.7,
        priority: "medium",
      });
    }

    // אופטימיזציה של שביעות רצון המשתמש
    if (recent.averageRating < 3) {
      recommendations.push({
        type: "change_exercise",
        currentValue: 0,
        recommendedValue: 1,
        reason:
          "דירוגים נמוכים - כדאי לגוון תרגילים | Low ratings - consider exercise variation",
        confidence: 0.6,
        priority: "medium",
      });
    }

    return recommendations;
  }

  /**
   * Calculate percentage change between two values with error handling
   * חישוב שינוי באחוזים בין שני ערכים עם טיפול בשגיאות
   */
  private calculatePercentageChange(
    oldValue: number,
    newValue: number
  ): number {
    if (oldValue === 0) return newValue > 0 ? 100 : 0;
    return ((newValue - oldValue) / oldValue) * 100;
  }

  /**
   * Calculate workout consistency score based on training intervals
   * חישוב ציון עקביות אימונים על בסיס מרווחי אימון
   */
  private calculateConsistencyScore(workouts: WorkoutSession[]): number {
    if (workouts.length === 0) return 1;

    // ניתוח מרווחי אימון לדפוסי עקביות
    const dates = workouts.map((w) => new Date(w.date)).sort();
    const intervals = [];

    for (let i = 1; i < dates.length; i++) {
      const interval =
        (dates[i].getTime() - dates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
      intervals.push(interval);
    }

    if (intervals.length === 0) return 1;

    // ניתוח סטטיסטי של עקביות מרווחים
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
   * Update comprehensive user statistics with gamification elements
   * עדכון סטטיסטיקות משתמש מקיפות עם אלמנטי גיימיפיקציה
   */
  private async updateUserStats(workouts: WorkoutSession[]): Promise<void> {
    try {
      const userJson = await AsyncStorage.getItem(this.DEMO_USER_KEY);
      if (!userJson) return;

      const userData = JSON.parse(userJson);

      // חישוב סטטיסטיקות אימון מקיפות
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

      // חישוב רצף אימונים נוכחי
      const currentStreak = this.calculateCurrentStreak(workouts);

      // מערכת גיימיפיקציה מתקדמת עם נקודות ורמות
      const totalPoints = workouts.reduce((sum, w) => {
        let points = 50; // נקודות בסיס לכל אימון
        points += w.feedback.overallRating * 10; // בונוס לפי דירוג
        points += Math.floor(w.duration / 10) * 5; // בונוס לפי משך
        return sum + points;
      }, 0);

      const level = Math.floor(totalPoints / 1000) + 1; // כל 1000 נקודות = עליית רמה
      const xp = totalPoints % 1000; // התקדמות ברמה הנוכחית

      // עדכון נתוני משתמש מקיפים
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
    } catch (error) {
      console.error("❌ Error updating user stats:", error);
    }
  }

  /**
   * Calculate current workout streak with intelligent gap detection
   * חישוב רצף אימונים נוכחי עם זיהוי פערים חכם
   */
  private calculateCurrentStreak(workouts: WorkoutSession[]): number {
    if (workouts.length === 0) return 0;

    const sortedWorkouts = workouts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const today = new Date();
    const lastWorkout = new Date(sortedWorkouts[0].date);

    // If last workout was more than 3 days ago - streak is broken
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
   * Extract personal records from workout history with comprehensive tracking
   * חילוץ שיאים אישיים מהיסטוריית אימונים עם מעקב מקיף
   */
  private extractPersonalRecords(workouts: WorkoutSession[]) {
    const records: PersonalRecord[] = [];
    // מעקב אחר סוגי שיאים מרובים לכל תרגיל
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

          // מעקב שיא משקל
          if (set.weight && set.weight > exerciseRecords[exerciseName].weight) {
            exerciseRecords[exerciseName].weight = set.weight;
          }

          // מעקב שיא חזרות
          if (set.reps > exerciseRecords[exerciseName].reps) {
            exerciseRecords[exerciseName].reps = set.reps;
          }

          // מעקב שיא נפח
          const volume = set.reps * (set.weight || 1);
          if (volume > exerciseRecords[exerciseName].volume) {
            exerciseRecords[exerciseName].volume = volume;
          }
        });
      });
    });

    // המרה לפורמט שיאים מובנה
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
    // יצירת המלצות לתוכנית אימון עם לוגים מינימליים

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
  }

  /**
   * Create intelligent workout plan adjustments based on performance analysis
   * יצירת התאמות חכמות לתוכנית אימון על בסיס ניתוח ביצועים
   */
  private createNextWorkoutAdjustments(analysis: PerformanceAnalysis) {
    const adjustments: WorkoutAdjustment[] = [];

    // Create specific workout adjustments based on recommendation type
    // יצירת התאמות ספציפיות לאימון על בסיס סוג ההמלצה
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
   * Get demo user data with error handling
   * קבלת נתוני משתמש דמו עם טיפול בשגיאות
   */
  async getDemoUser() {
    try {
      const userJson = await AsyncStorage.getItem(this.DEMO_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error("Error getting demo user:", error);
      return null;
    }
  }

  /**
   * Get comprehensive workout history for analysis
   * קבלת היסטוריית אימונים מקיפה לניתוח
   */
  async getWorkoutHistory(): Promise<WorkoutSession[]> {
    try {
      const workoutsJson = await AsyncStorage.getItem(this.DEMO_WORKOUTS_KEY);
      return workoutsJson ? JSON.parse(workoutsJson) : [];
    } catch (error) {
      console.error("Error getting workout history:", error);
      return [];
    }
  }

  /**
   * Clear all demo data for fresh start
   * מחיקת כל נתוני הדמו להתחלה חדשה
   */
  async clearDemoData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.DEMO_USER_KEY);
      await AsyncStorage.removeItem(this.DEMO_WORKOUTS_KEY);
      await AsyncStorage.removeItem("workout_recommendations");
    } catch (error) {
      console.error("Error clearing demo data:", error);
    }
  }
}

export const realisticDemoService = new RealisticDemoService();
