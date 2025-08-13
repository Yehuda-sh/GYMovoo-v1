/**
 * @file src/services/demo/demoHistoryService.ts
 * @brief 🔴 DEMO ONLY - שירות יצירת היסטוריית אימונים מלאה
 * @description יוצר היסטוריית אימונים מקיפה למטרות פיתוח וצגה בלבד
 * @updated 2025-08-11 ✅ ACTIVE - שירות דמו פעיל בשימוש DataManager ו-HistoryScreen
 * @status ✅ ENHANCED - איכות קוד מצוינת, תיעוד מלא, פונקציונליות קריטית
 * @used_by DataManager.ts, HistoryScreen (מספר גרסאות), demo export hub
 * @warning NOT FOR PRODUCTION - DEMO DATA ONLY
 */

// 🔴 DEMO ONLY - הגנה מפני שימוש בפרודקשן
if (!__DEV__) {
  throw new Error("Demo history service should not be used in production");
}

import {
  WorkoutWithFeedback,
  WorkoutStatistics,
} from "../../screens/workout/types/workout.types";
import { User } from "../../types";
import { demoWorkoutService } from "./demoWorkoutService";
import { LOGGING } from "../../constants/logging";
import { getUserGender } from "../../utils/workoutHelpers";

class DemoHistoryService {
  /**
   * 📊 מחזיר סטטיסטיקות מלאות מבוססות על נתוני דמו מותאמי משתמש
   * @param user - נתוני משתמש לבניית סטטיסטיקות מותאמות
   * @returns סטטיסטיקות מפורטות כולל מגדר ורצף אימונים
   */
  async getStatistics(user: User): Promise<WorkoutStatistics> {
    const workouts =
      await demoWorkoutService.generateDemoWorkoutHistoryForUser(user);
    return this.generateStatisticsFromWorkouts(workouts, user);
  }

  /**
   * 🎉 מחזיר הודעת ברכה מותאמת מגדר ואישיות
   * @param user - נתוני משתמש ליצירת הודעה מותאמת
   * @returns הודעת ברכה מותאמת מגדר וכמות אימונים
   */
  async getCongratulationMessage(user: User): Promise<string> {
    const workouts =
      await demoWorkoutService.generateDemoWorkoutHistoryForUser(user);
    return this.generateCongratulationMessage(user, workouts);
  }

  /**
   * ✅ יצירת היסטוריית אימונים מלאה מבוססת על נתוני משתמש אמיתיים
   * @description מייצר היסטוריה מקיפה הכוללת אימונים, סטטיסטיקות והודעות ברכה
   * @param user - נתוני משתמש לבניית היסטוריה מותאמת אישית
   * @returns אובייקט מלא עם אימונים, סטטיסטיקות והודעת ברכה
   * @critical_usage DataManager.ts משתמש בפונקציה זו לטעינת נתוני דמו מלאים
   */
  async generateCompleteWorkoutHistory(user: User): Promise<{
    workouts: WorkoutWithFeedback[];
    statistics: WorkoutStatistics;
    congratulationMessage: string;
  }> {
    if (LOGGING.DEMO) {
      console.warn(
        "🔴 Generating COMPLETE demo history based on REAL user data - DEV ONLY"
      );
    }

    if (!user) {
      throw new Error("User is required for demo history generation");
    }

    // יצירת אימוני דמו מבוססי נתוני משתמש
    const workouts =
      await demoWorkoutService.generateDemoWorkoutHistoryForUser(user);

    // יצירת סטטיסטיקות מבוססות על האימונים שנוצרו
    const statistics = this.generateStatisticsFromWorkouts(workouts, user);

    // יצירת הודעת ברכה מותאמת מגדר
    const congratulationMessage = this.generateCongratulationMessage(
      user,
      workouts
    );

    return {
      workouts,
      statistics,
      congratulationMessage,
    };
  }

  /**
   * ✅ יצירת סטטיסטיקות מבוססות על אימונים שנוצרו
   * @description מחשב סטטיסטיקות מדויקות כולל מגדר, קושי ממוצע ורצף אימונים
   * @param workouts - רשימת אימונים לחישוב סטטיסטיקות
   * @param user - נתוני משתמש לחישובים מותאמי מגדר
   * @returns סטטיסטיקות מפורטות עם פילוח לפי מגדר
   */
  private generateStatisticsFromWorkouts(
    workouts: WorkoutWithFeedback[],
    user: User
  ): WorkoutStatistics {
    const userGender = getUserGender(user);

    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce(
      (sum, w) => sum + (w.stats.duration || 0),
      0
    );

    // חישוב ציון קושי ממוצע
    const workoutsWithDifficulty = workouts.filter(
      (w) => w.feedback?.difficulty && !isNaN(w.feedback.difficulty)
    );
    const averageDifficulty =
      workoutsWithDifficulty.length > 0
        ? workoutsWithDifficulty.reduce(
            (sum, w) => sum + (w.feedback.difficulty || 3),
            0
          ) / workoutsWithDifficulty.length
        : 3; // ברירת מחדל

    // חישוב רצף אימונים (streak)
    const workoutStreak = this.calculateWorkoutStreak(workouts);

    return {
      total: {
        totalWorkouts,
        totalDuration,
        averageDifficulty,
        workoutStreak,
      },
      byGender: {
        male: {
          count: userGender === "male" ? totalWorkouts : 0,
          averageDifficulty: userGender === "male" ? averageDifficulty : 0,
        },
        female: {
          count: userGender === "female" ? totalWorkouts : 0,
          averageDifficulty: userGender === "female" ? averageDifficulty : 0,
        },
        other: {
          count: userGender === "other" ? totalWorkouts : 0,
          averageDifficulty: userGender === "other" ? averageDifficulty : 0,
        },
      },
    };
  }

  /**
   * ✅ חישוב רצף אימונים (streak) מדויק
   * @description מחשב רצף אימונים רציף עם סובלנות של עד יומיים
   * @param workouts - רשימת אימונים ממוינת לפי תאריך
   * @returns מספר אימונים ברצף הנוכחי
   */
  private calculateWorkoutStreak(workouts: WorkoutWithFeedback[]): number {
    if (workouts.length === 0) return 0;

    // מיון לפי תאריך
    const sortedWorkouts = [...workouts].sort(
      (a, b) =>
        new Date(b.feedback.completedAt).getTime() -
        new Date(a.feedback.completedAt).getTime()
    );

    let streak = 1;
    let currentDate = new Date(sortedWorkouts[0].feedback.completedAt);

    for (let i = 1; i < sortedWorkouts.length; i++) {
      const workoutDate = new Date(sortedWorkouts[i].feedback.completedAt);
      const daysDiff = Math.floor(
        (currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff <= 2) {
        // רווח של עד יומיים נחשב כהמשכיות
        streak++;
        currentDate = workoutDate;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * ✅ יצירת הודעת ברכה מותאמת מגדר ואישיות
   * @description יוצר הודעות ברכה מותאמות מגדר עם מגוון הודעות רנדומליות
   * @param user - נתוני משתמש לזיהוי מגדר ויצירת הודעה מותאמת
   * @param workouts - רשימת אימונים לחישוב כמות הישגים
   * @returns הודעת ברכה מותאמת בעברית
   */
  private generateCongratulationMessage(
    user: User,
    workouts: WorkoutWithFeedback[]
  ): string {
    const userGender = getUserGender(user);
    const totalWorkouts = workouts.length;

    // הודעות מותאמות מגדר
    const messages = {
      male: [
        `כל הכבוד! השלמת ${totalWorkouts} אימונים מצוינים!`,
        `אתה על הדרך הנכונה! ${totalWorkouts} אימונים זה הישג מרשים!`,
        `ממשיך חזק! האימונים שלך משתפרים מפעם לפעם!`,
      ],
      female: [
        `כל הכבוד! השלמת ${totalWorkouts} אימונים מעולים!`,
        `את על הדרך הנכונה! ${totalWorkouts} אימונים זה הישג מרשים!`,
        `ממשיכה חזק! האימונים שלך משתפרים מפעם לפעם!`,
      ],
      other: [
        `כל הכבוד! השלמת ${totalWorkouts} אימונים מצוינים!`,
        `אתם על הדרך הנכונה! ${totalWorkouts} אימונים זה הישג מרשים!`,
        `ממשיכים חזק! האימונים שלכם משתפרים מפעם לפעם!`,
      ],
    };

    const genderMessages = messages[userGender] || messages.other;
    const randomMessage =
      genderMessages[Math.floor(Math.random() * genderMessages.length)];

    return randomMessage;
  }

  /**
   * ✅ יצירת סטטיסטיקות מקובצות לפי מגדר
   * @description מחזיר סטטיסטיקות מלאות עם פילוח מגדר מדויק
   * @param user - נתוני משתמש לחישוב סטטיסטיקות
   * @returns סטטיסטיקות מקובצות לפי מגדר
   */
  async generateGenderGroupedStatistics(
    user: User
  ): Promise<WorkoutStatistics> {
    const { statistics } = await this.generateCompleteWorkoutHistory(user);
    return statistics;
  }

  /**
   * ✅ קבלת הודעת ברכה אחרונה מעודכנת
   * @description מחזיר הודעת ברכה עדכנית מבוססת נתוני משתמש נוכחיים
   * @param user - נתוני משתמש ליצירת הודעה
   * @returns הודעת ברכה אחרונה
   */
  async getLatestCongratulationMessage(user: User): Promise<string> {
    const { congratulationMessage } =
      await this.generateCompleteWorkoutHistory(user);
    return congratulationMessage;
  }

  /**
   * ✅ קבלת רשימת אימונים מלאה ומעודכנת
   * @description מחזיר היסטוריית אימונים מלאה מבוססת נתוני משתמש
   * @param user - נתוני משתמש ליצירת היסטוריה
   * @returns רשימת אימונים מלאה עם פידבק
   */
  async getWorkoutHistory(user: User): Promise<WorkoutWithFeedback[]> {
    const { workouts } = await this.generateCompleteWorkoutHistory(user);
    return workouts;
  }

  /**
   * ✅ נקה נתוני דמו (למטרות פיתוח ובדיקות)
   * @description מנקה נתוני דמו זמניים - פונקציה עתידית
   * @dev_only פונקציה למטרות פיתוח בלבד
   */
  clearDemoData(): void {
    if (LOGGING.DEMO) {
      console.warn("🔴 Clearing demo history data - DEV ONLY");
    }
    // בעתיד אפשר להוסיף לוגיקת ניקוי אם נחסן בזיכרון זמני
  }
}

// 🔴 DEMO ONLY - ייצוא שירות דמו להיסטוריית אימונים
// ✅ ACTIVE: בשימוש פעיל ב-DataManager, HistoryScreen ומערכת הדמו
export const demoHistoryService = new DemoHistoryService();
