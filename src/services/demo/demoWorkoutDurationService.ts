/**
 * @file src/services/demo/demoWorkoutDurationService.ts
 * @brief 🔴 DEMO ONLY - שירות יצירת זמני אימון מציאותיים ומגוונים
 * @description יוצר זמני אימון שמשקפים מציאות - לא תמיד מסיימים בדיוק לפי התכנון
 * @updated 2025-08-11 ✅ ENHANCED - שירות פעיל בשימוש ישיר במסכי היסטוריה
 * @status ✅ ACTIVE - פונקציונליות ייחודית וקריטית שלא קיימת במקום אחר
 * @used_by HistoryScreen.backup.tsx, testDemoWorkoutDuration.js, demo ecosystem
 * @unique_value חישוב זמני אימון מציאותיים מבוסס ביצוע בפועל, מגדר ורמת ניסיון
 * @warning NOT FOR PRODUCTION - DEMO DATA ONLY
 */

// 🔴 DEMO ONLY - הגנה מפני שימוש בפרודקשן
if (!__DEV__) {
  throw new Error(
    "Demo workout duration service should not be used in production"
  );
}

import { User } from "../../types";
import { getUserGender } from "../../utils/workoutHelpers";

interface WorkoutDurationParams {
  plannedDuration: number; // בשניות
  totalSetsPlanned: number;
  totalSetsCompleted: number;
  userExperience: "beginner" | "intermediate" | "advanced";
  userGender: "male" | "female" | "other";
  workoutType?: string;
}

class DemoWorkoutDurationService {
  /**
   * ✅ יצירת זמן אימון מציאותי מבוסס על ביצוע בפועל
   * @description אלגוריתם מתוחכם המתחשב ביחס השלמה, ניסיון, מגדר ווריאציה מציאותית
   * @param params - פרמטרי אימון כולל זמן מתוכנן, סטים ונתוני משתמש
   * @returns זמן אימון מציאותי בשניות (מוגבל 10 דקות - 2 שעות)
   * @algorithm 6 שלבים: יחס השלמה → בסיס זמן → ניסיון → מגדר → וריאציה → הגבלות
   */
  generateRealisticDuration(params: WorkoutDurationParams): number {
    const {
      plannedDuration,
      totalSetsPlanned,
      totalSetsCompleted,
      userExperience,
      userGender,
    } = params;

    // 1. חישוב יחס השלמה
    const completionRatio =
      totalSetsPlanned > 0 ? totalSetsCompleted / totalSetsPlanned : 0.8; // ברירת מחדל 80%

    // 2. בסיס זמן לפי יחס השלמה
    let baseDuration = plannedDuration * completionRatio;

    // 3. התאמות לפי רמת ניסיון
    const experienceModifier = this.getExperienceModifier(
      userExperience,
      completionRatio
    );
    baseDuration *= experienceModifier;

    // 4. התאמות לפי מגדר (נוטות להבדלים בקצב)
    const genderModifier = this.getGenderModifier(userGender, userExperience);
    baseDuration *= genderModifier;

    // 5. וריאציה מציאותית (חיי יום יום)
    const realityVariance = this.getRealityVariance(completionRatio);
    baseDuration *= realityVariance;

    // 6. וודא שהזמן הגיוני (לא פחות מ-10 דקות, לא יותר מ-2 שעות)
    const minDuration = 10 * 60; // 10 דקות
    const maxDuration = 120 * 60; // 2 שעות

    return Math.max(
      minDuration,
      Math.min(maxDuration, Math.round(baseDuration))
    );
  }

  /**
   * ✅ מודיפייר לפי רמת ניסיון
   */
  private getExperienceModifier(
    experience: "beginner" | "intermediate" | "advanced",
    completionRatio: number
  ): number {
    switch (experience) {
      case "beginner":
        // מתחילים: יותר זמן מנוחה, פחות יעילות
        return completionRatio > 0.9 ? 1.3 : 1.5; // +30-50% זמן

      case "intermediate":
        // בינוניים: יעילות סבירה
        return completionRatio > 0.8 ? 1.1 : 1.2; // +10-20% זמן

      case "advanced":
        // מתקדמים: יעילים יותר, אבל אימונים אינטנסיביים יותר
        return completionRatio > 0.9 ? 0.9 : 1.0; // -10% או זמן תקין

      default:
        return 1.0;
    }
  }

  /**
   * ✅ מודיפייר לפי מגדר (הבדלים סטטיסטיים בקצב אימון)
   */
  private getGenderModifier(
    gender: "male" | "female" | "other",
    experience: "beginner" | "intermediate" | "advanced"
  ): number {
    // הבדלים עדינים בקצב - לא סטריאוטיפים
    switch (gender) {
      case "female":
        // נשים נוטות להיות יותר מדויקות בביצוע
        return experience === "beginner" ? 1.1 : 1.05; // +5-10%

      case "male":
        // גברים נוטים לזרז יותר (לפעמים על חשבון הטכניקה)
        return experience === "advanced" ? 0.95 : 1.0; // -5% אם מתקדמים

      case "other":
      default:
        return 1.0;
    }
  }

  /**
   * ✅ וריאציה מציאותית (עייפות, זמן פנוי, מוטיבציה)
   */
  private getRealityVariance(completionRatio: number): number {
    // אם השלים הרבה סטים - כנראה היה לו זמן ואנרגיה
    if (completionRatio >= 1.0) {
      // אימון מלא ואפילו יותר - 90%-110%
      return 0.9 + Math.random() * 0.2;
    }

    if (completionRatio >= 0.8) {
      // אימון טוב - 85%-115%
      return 0.85 + Math.random() * 0.3;
    }

    if (completionRatio >= 0.6) {
      // אימון חלקי - 70%-100%
      return 0.7 + Math.random() * 0.3;
    }

    // אימון קצר/לא הושלם - 50%-85%
    return 0.5 + Math.random() * 0.35;
  }

  /**
   * ✅ יצירת זמן מציאותי מנתוני משתמש
   * @description ממשק נוח ליצירת זמני אימון מותאמים למשתמש ספציפי
   * @param user - נתוני משתמש לחילוץ מגדר ורמת ניסיון
   * @param plannedDuration - זמן מתוכנן בשניות
   * @param totalSetsPlanned - סטים מתוכננים (ברירת מחדל: 12)
   * @param totalSetsCompleted - סטים שהושלמו (ברירת מחדל: 10)
   * @returns זמן אימון מציאותי מותאם אישית
   * @critical_usage HistoryScreen משתמש בפונקציה זו ליצירת זמני אימון מציאותיים
   */
  generateRealisticDurationForUser(
    user: User,
    plannedDuration: number,
    totalSetsPlanned: number = 12,
    totalSetsCompleted: number = 10
  ): number {
    // חילוץ נתוני משתמש
    const userGender = getUserGender(user);
    const userExperience = this.extractExperience(user);

    const params: WorkoutDurationParams = {
      plannedDuration,
      totalSetsPlanned,
      totalSetsCompleted,
      userExperience,
      userGender,
    };

    return this.generateRealisticDuration(params);
  }

  /**
   * ✅ חילוץ רמת ניסיון מנתוני משתמש
   */
  private extractExperience(
    user: User
  ): "beginner" | "intermediate" | "advanced" {
    // נחפש במקומות שונים
    const questionnaire = user.questionnaire || user.smartQuestionnaireData;

    // נבדוק אם יש שדה experience (במבנה ישן)
    if (
      questionnaire &&
      typeof questionnaire === "object" &&
      "experience" in questionnaire
    ) {
      const experience = (questionnaire as Record<string, unknown>).experience;
      if (
        experience === "beginner" ||
        experience === "intermediate" ||
        experience === "advanced"
      ) {
        return experience as "beginner" | "intermediate" | "advanced";
      }
    }

    // ברירת מחדל לפי היסטוריה
    const workoutHistory = user.activityHistory?.workouts;
    if (workoutHistory && workoutHistory.length > 20) {
      return "advanced";
    } else if (workoutHistory && workoutHistory.length > 5) {
      return "intermediate";
    }

    return "beginner";
  }

  /**
   * ✅ דוגמאות לזמני אימון שונים
   * @description מייצר תרחישי אימון מגוונים לבדיקות ותצוגה
   * @param user - משתמש ליצירת דוגמאות מותאמות
   * @returns מערך תרחישים עם זמנים מציאותיים ותיאורים
   * @scenarios אימון מושלם, חלקי, קצר ומורחב
   */
  getExampleDurations(user: User): {
    scenario: string;
    duration: number;
    description: string;
  }[] {
    const baseTime = 60 * 60; // 60 דקות בשניות

    return [
      {
        scenario: "אימון מושלם",
        duration: this.generateRealisticDurationForUser(user, baseTime, 12, 12),
        description: "השלמתי את כל הסטים בקצב טוב",
      },
      {
        scenario: "אימון חלקי",
        duration: this.generateRealisticDurationForUser(user, baseTime, 12, 8),
        description: "לא היה לי זמן לסיים הכל",
      },
      {
        scenario: "אימון קצר",
        duration: this.generateRealisticDurationForUser(user, baseTime, 12, 6),
        description: "אימון מהיר בהפסקת צהריים",
      },
      {
        scenario: "אימון מורחב",
        duration: this.generateRealisticDurationForUser(user, baseTime, 12, 15),
        description: "הוספתי תרגילים נוספים",
      },
    ];
  }

  /**
   * ✅ פורמט יפה לזמן
   * @description ממיר שניות לפורמט קריא בעברית
   * @param durationSeconds - זמן בשניות
   * @returns מחרוזת מפורמטת (דקות או שעות:דקות)
   * @examples "45 דקות", "1:30 שעות", "2 שעות"
   */
  formatDuration(durationSeconds: number): string {
    const minutes = Math.round(durationSeconds / 60);

    if (minutes < 60) {
      return `${minutes} דקות`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} שעות`;
    }

    return `${hours}:${remainingMinutes.toString().padStart(2, "0")} שעות`;
  }
}

// 🔴 DEMO ONLY - ייצוא שירות זמני אימון מציאותיים
// ✅ ACTIVE: בשימוש ישיר ב-HistoryScreen.backup.tsx ובקבצי בדיקה
// 🎯 UNIQUE: פונקציונליות ייחודית שלא קיימת במקום אחר במערכת
export const demoWorkoutDurationService = new DemoWorkoutDurationService();
