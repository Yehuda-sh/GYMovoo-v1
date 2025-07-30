/**
 * @file src/services/workoutHistoryService.ts
 * @description שירות לניהול היסטוריית אימונים עם משוב ותמיכה בהתאמת מגדר
 * English: Workout history service with feedback management and gender adaptation support
 * @updated 2025-07-30 הוספת תמיכה בהתאמת מגדר ואינטגרציה עם userStore
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { WorkoutData } from "../screens/workout/types/workout.types";
import { Platform, Dimensions } from "react-native";

// טיפוס לאימון עם משוב ומטא-דאטה מורחבת
export interface WorkoutWithFeedback {
  id: string;
  workout: WorkoutData;
  feedback: {
    difficulty: number; // 1-5 stars
    feeling: string; // emoji value
    readyForMore: boolean | null;
    completedAt: string; // ISO string
    // הוספת משוב מותאם למגדר
    genderAdaptedNotes?: string; // הערות מותאמות למגדר המשתמש
    congratulationMessage?: string; // הודעת ברכה מותאמת למגדר
  };
  stats: {
    duration: number;
    totalSets: number;
    totalPlannedSets: number;
    totalVolume: number;
    personalRecords: number;
  };
  // זמנים מתקדמים
  startTime?: string; // זמן התחלת האימון
  endTime?: string; // זמן סיום האימון
  actualStartTime?: string; // זמן התחלה אמיתי (יכול להיות שונה מהמתוכנן)
  // מטא-דאטה מורחבת
  metadata?: {
    deviceInfo: {
      platform: string;
      screenWidth: number;
      screenHeight: number;
    };
    userGender?: "male" | "female" | "other";
    version: string;
    workoutSource: "generated" | "manual" | "demo"; // מקור האימון
  };
}

// טיפוס לביצועים קודמים (לתצוגה באימון הבא)
export interface PreviousPerformance {
  exerciseName: string;
  sets: Array<{
    weight: number;
    reps: number;
  }>;
  date: string;
  // שיאים אישיים
  personalRecords: {
    maxWeight: number; // המשקל הגבוה ביותר שנרשם
    maxVolume: number; // הנפח הגבוה ביותר (משקל × חזרות) בסט יחיד
    maxReps: number; // מספר החזרות הגבוה ביותר
    totalVolume: number; // הנפח הכולל של התרגיל באימון זה
  };
}

// טיפוס לשיא אישי
export interface PersonalRecord {
  exerciseName: string;
  type: "weight" | "volume" | "reps"; // סוג השיא
  value: number;
  previousValue: number;
  date: string;
  improvement: number; // שיפור באחוזים או בערך מוחלט
}

const WORKOUT_HISTORY_KEY = "workout_history";
const PREVIOUS_PERFORMANCES_KEY = "previous_performances";

class WorkoutHistoryService {
  /**
   * יצירת הודעת ברכה מותאמת למגדר
   * Generate gender-adapted congratulation message
   */
  private generateGenderAdaptedCongratulation(
    gender?: "male" | "female" | "other",
    personalRecords: number = 0
  ): string {
    if (!gender) {
      return personalRecords > 0
        ? `אימון מעולה! השגת ${personalRecords} שיאים אישיים חדשים!`
        : "אימון מעולה! כל הכבוד על ההתמדה!";
    }

    if (gender === "male") {
      const maleMessages = [
        personalRecords > 0
          ? `כל הכבוד גבר! ${personalRecords} שיאים חדשים - חזק ממך!`
          : "אימון חזק! המשך כך והמשיך לפרוח!",
        personalRecords > 0
          ? `אלוף! השגת ${personalRecords} שיאים - אתה בדרך הנכונה!`
          : "כוח וסיבולת! אתה משתפר בכל אימון!",
        "אימון גברי מעולה! הרגשת את הכוח שלך היום!",
      ];
      return maleMessages[Math.floor(Math.random() * maleMessages.length)];
    } else if (gender === "female") {
      const femaleMessages = [
        personalRecords > 0
          ? `כל הכבוד גיבורה! ${personalRecords} שיאים חדשים - את בוערת!`
          : "אימון נפלא! את חזקה ומדהימה!",
        personalRecords > 0
          ? `מלכה! השגת ${personalRecords} שיאים - המשיכי לכבוש!`
          : "כוח נשי מדהים! את מתקדמת בכל אימון!",
        "אימון מעצים! הרגשתי את הכוח שלך היום!",
      ];
      return femaleMessages[Math.floor(Math.random() * femaleMessages.length)];
    }

    // מגדר אחר או לא מוגדר - מסרים ניטרליים
    return personalRecords > 0
      ? `מדהים! השגת ${personalRecords} שיאים אישיים חדשים!`
      : "אימון מעולה! המשך בדרך הנכונה!";
  }

  /**
   * יצירת הערות מותאמות למגדר
   * Generate gender-adapted workout notes
   */
  private generateGenderAdaptedNotes(
    gender?: "male" | "female" | "other",
    difficulty: number = 3
  ): string {
    if (!gender) {
      return difficulty >= 4
        ? "אימון מאתגר שהעלה אותי לרמה הבאה"
        : "אימון טוב, הרגשתי חזק/ה היום";
    }

    if (gender === "male") {
      if (difficulty >= 4) {
        const hardMessages = [
          "אימון קשה אבל הרגשתי כמו אריה!",
          "המשקלים היו כבדים אבל התמדתי כמו גבר אמיתי",
          "אימון אתגרי שהעלה אותי לרמה הבאה",
          "דחפתי את הגבולות היום - הרגשתי את הכוח שלי",
        ];
        return hardMessages[Math.floor(Math.random() * hardMessages.length)];
      } else {
        const easyMessages = [
          "אימון נעים, הרגשתי חזק ובשליטה",
          "זרימה טובה היום, הכל הלך חלק",
          "אימון מוצלח, בניתי על הבסיס החזק שלי",
        ];
        return easyMessages[Math.floor(Math.random() * easyMessages.length)];
      }
    } else if (gender === "female") {
      if (difficulty >= 4) {
        const hardMessages = [
          "אימון מאתגר אבל הרגשתי כמו לוחמת!",
          "התמדתי למרות הקושי - הרגשתי את הכוח הפנימי שלי",
          "אימון קשה שהעלה אותי לרמה הבאה",
          "דחפתי את הגבולות היום - גאה בעצמי!",
        ];
        return hardMessages[Math.floor(Math.random() * hardMessages.length)];
      } else {
        const easyMessages = [
          "אימון נעים, הרגשתי חזקה ובטוחה",
          "זרימה מדהימה היום, הכל הלך בקלות",
          "אימון מוצלח, מרגישה שאני משתפרת",
        ];
        return easyMessages[Math.floor(Math.random() * easyMessages.length)];
      }
    }

    // מגדר אחר - מסרים ניטרליים
    return difficulty >= 4
      ? "אימון מאתגר שהעלה אותי לרמה הבאה"
      : "אימון מוצלח, מרגיש/ה שאני מתקדמ/ת";
  }

  /**
   * התאמת שמות תרגילים למגדר (מותאם מ-workoutSimulationService)
   * Adapt exercise names to user gender (adapted from workoutSimulationService)
   */
  private adaptExerciseNameToGender(
    exerciseName: string,
    gender?: "male" | "female" | "other"
  ): string {
    if (!gender) return exerciseName;

    // התאמות בסיסיות לפי מגדר - קטן יותר מ-workoutSimulationService
    if (gender === "female") {
      const femaleAdaptations: { [key: string]: string } = {
        "Push-ups": "שכיבות סמיכה מותאמות",
        Squats: "כפיפות ברכיים נשיות",
        Planks: "פלאנק מחזק",
        Lunges: "צעדי נשים",
      };
      return femaleAdaptations[exerciseName] || exerciseName;
    } else if (gender === "male") {
      const maleAdaptations: { [key: string]: string } = {
        "Push-ups": "שכיבות סמיכה חזקות",
        "Pull-ups": "מתח לגברים",
        Deadlift: "הרמת משקל כבד",
        "Bench Press": "פרס חזה מתקדם",
      };
      return maleAdaptations[exerciseName] || exerciseName;
    }

    return exerciseName; // ללא התאמה למגדר אחר
  }

  /**
   * שמירת אימון עם משוב להיסטוריה (משופר עם תמיכה בהתאמת מגדר)
   */
  async saveWorkoutWithFeedback(
    workoutWithFeedback: Omit<WorkoutWithFeedback, "id">,
    userGender?: "male" | "female" | "other"
  ): Promise<void> {
    try {
      const id = Date.now().toString();

      // יצירת מטא-דאטה מורחבת
      const metadata = {
        deviceInfo: {
          platform: Platform.OS,
          screenWidth: Dimensions.get("window").width,
          screenHeight: Dimensions.get("window").height,
        },
        userGender,
        version: "workout-history-v2",
        workoutSource: "manual" as const, // רוב האימונים הם ידניים
      };

      // יצירת משוב מותאם למגדר
      const personalRecordsCount = workoutWithFeedback.stats.personalRecords;
      const genderAdaptedNotes = this.generateGenderAdaptedNotes(
        userGender,
        workoutWithFeedback.feedback.difficulty
      );
      const congratulationMessage = this.generateGenderAdaptedCongratulation(
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

      // קבלת היסטוריה קיימת
      const existingHistory = await this.getWorkoutHistory();

      // הוספת האימון החדש
      const updatedHistory = [fullWorkout, ...existingHistory];

      // שמירה
      await AsyncStorage.setItem(
        WORKOUT_HISTORY_KEY,
        JSON.stringify(updatedHistory)
      );

      // שמירת ביצועים לעיון באימון הבא (עם התאמת שמות תרגילים)
      await this.savePreviousPerformances(
        workoutWithFeedback.workout,
        userGender
      );

      console.log(
        "💾 Workout saved to history successfully with gender adaptations"
      );
    } catch (error) {
      console.error("Error saving workout to history:", error);
      throw error;
    }
  }

  /**
   * תיעוד זמן התחלת אימון
   */
  async recordWorkoutStart(workoutId: string): Promise<void> {
    try {
      const startTime = new Date().toISOString();
      await AsyncStorage.setItem(`workout_start_${workoutId}`, startTime);
      console.log(`🚀 Workout ${workoutId} started at ${startTime}`);
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
   * זיהוי שיאים חדשים באימון הנוכחי
   */
  async detectPersonalRecords(workout: WorkoutData): Promise<PersonalRecord[]> {
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
            newRecords.push({
              exerciseName: exercise.name,
              type: "weight",
              value: maxWeight,
              previousValue: 0,
              date: new Date().toISOString(),
              improvement: maxWeight,
            });
          }

          if (maxVolume > 0) {
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
      const historyJson = await AsyncStorage.getItem(WORKOUT_HISTORY_KEY);
      if (!historyJson) return [];

      return JSON.parse(historyJson);
    } catch (error) {
      console.error("Error loading workout history:", error);
      return [];
    }
  }

  /**
   * שמירת ביצועים קודמים לשימוש באימון הבא (עם התאמת שמות תרגילים למגדר)
   */
  private async savePreviousPerformances(
    workout: WorkoutData,
    userGender?: "male" | "female" | "other"
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
          const adaptedExerciseName = this.adaptExerciseNameToGender(
            exercise.name,
            userGender
          );

          // חישוב שיפור לעומת ביצועים קודמים
          const existingPerf = existingPerformances.find(
            (p) =>
              p.exerciseName === exercise.name ||
              p.exerciseName === adaptedExerciseName
          );
          const previousMaxWeight =
            existingPerf?.personalRecords.maxWeight || 0;
          const previousMaxVolume =
            existingPerf?.personalRecords.maxVolume || 0;
          const previousMaxReps = existingPerf?.personalRecords.maxReps || 0;

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
      console.log("Workout history cleared");
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

      if (history.length === 0) {
        return {
          totalWorkouts: 0,
          totalDuration: 0,
          averageDifficulty: 0,
          workoutStreak: 0,
        };
      }

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
    const sortedHistory = history.sort(
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

      let totalDifficultyByGender = {
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
      Object.keys(byGender).forEach((gender) => {
        const key = gender as keyof typeof byGender;
        if (byGender[key].count > 0) {
          byGender[key].averageDifficulty =
            totalDifficultyByGender[key] / byGender[key].count;
        }
      });

      // סטטיסטיקות כלליות
      const totalStats = await this.getWorkoutStatistics();

      return {
        byGender,
        total: totalStats,
      };
    } catch (error) {
      console.error("Error getting gender grouped statistics:", error);
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
