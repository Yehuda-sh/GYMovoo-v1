/**
 * @file src/services/demo/demoWorkoutService.ts
 * @brief 🔴 DEMO ONLY - שירות יצירת אימוני דמו
 * @description יוצר אימוני דמו למטרות פיתוח וצגה בלבד
 * @updated 2025-08-11 ✅ ENHANCED - שירות קריטי כשכבת תיווך למערכת הדמו
 * @status ✅ ACTIVE - תלות קריטית עם demoHistoryService, תפקיד מרכזי במערכת הדמו
 * @used_by demoHistoryService.ts (3 קריאות), services export hub, demo ecosystem
 * @role שכבת תיווך חכמה: מחבר נתוני משתמש אמיתיים ← → workoutSimulationService
 * @warning NOT FOR PRODUCTION - DEMO DATA ONLY
 */

// 🔴 DEMO ONLY - הגנה מפני שימוש בפרודקשן
if (!__DEV__) {
  throw new Error("Demo workout service should not be used in production");
}

import { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";
import { UserGender } from "../../utils/genderAdaptation";
import { User } from "../../types";
import { demoUserService } from "./demoUserService";
import { workoutSimulationService } from "../workoutSimulationService";

class DemoWorkoutService {
  private static instance: DemoWorkoutService;

  private constructor() {}

  static getInstance(): DemoWorkoutService {
    if (!DemoWorkoutService.instance) {
      DemoWorkoutService.instance = new DemoWorkoutService();
    }
    return DemoWorkoutService.instance;
  }

  /**
   * ✅ יצירת היסטוריית אימוני דמו מבוססת על נתוני משתמש אמיתיים
   * @description שכבת תיווך חכמה המחלצת נתוני משתמש ומעבירה לשירות הסימולציה
   * @param user - נתוני משתמש אמיתיים לחילוץ מגדר, ניסיון וציוד
   * @returns היסטוריית אימונים מציאותית מבוססת נתוני המשתמש
   * @critical_dependency demoHistoryService תלוי בפונקציה זו ב-3 מקומות שונים
   * @data_flow user data → extraction → workoutSimulationService → realistic workouts
   */
  async generateDemoWorkoutHistoryForUser(
    user: User
  ): Promise<WorkoutWithFeedback[]> {
    console.warn(
      "🔴 Generating DEMO workout history based on REAL user data - DEV ONLY"
    );

    if (!user) {
      return this.generateDemoWorkoutHistory();
    }

    // שימוש בנתוני המשתמש האמיתיים
    const gender =
      user.preferences?.gender || user.questionnaire?.["1"] || "other";
    const experience = user.questionnaire?.["3"] || "beginner";
    const equipment = (user.questionnaire?.["4"] as string[]) || ["none"];

    console.warn("🔍 Using real user data for demo:", {
      gender,
      experience,
      equipment: equipment.length,
    });

    return await workoutSimulationService.simulateHistoryCompatibleWorkouts(
      gender as UserGender,
      experience as "beginner" | "intermediate" | "advanced",
      equipment
    );
  }

  /**
   * ✅ יצירת היסטוריית אימוני דמו (מחליף את simulateRealisticWorkoutHistory)
   * @description ממשק גנרי ליצירת אימוני דמו עם פרמטרים אופציונליים
   * @param gender - מגדר אופציונלי (ברירת מחדל: רנדומלי)
   * @param experience - רמת ניסיון אופציונלית (ברירת מחדל: רנדומלי)
   * @param equipment - ציוד אופציונלי (ברירת מחדל: לפי רמת ניסיון)
   * @returns היסטוריית אימונים מבוססת הפרמטרים או משתמש דמו רנדומלי
   * @fallback אם לא מועברים פרמטרים - יוצר משתמש דמו רנדומלי
   */
  async generateDemoWorkoutHistory(
    gender?: UserGender,
    experience?: "beginner" | "intermediate" | "advanced",
    equipment?: string[]
  ): Promise<WorkoutWithFeedback[]> {
    console.warn("🔴 Generating DEMO workout history - DEV ONLY");

    // אם לא סופקו פרמטרים, יצור משתמש דמו
    if (!gender || !experience) {
      const demoUser = demoUserService.generateDemoUser();
      return await workoutSimulationService.simulateHistoryCompatibleWorkouts(
        demoUser.gender,
        demoUser.experience,
        equipment || demoUser.equipment
      );
    }

    // השתמש בפרמטרים שסופקו
    return await workoutSimulationService.simulateHistoryCompatibleWorkouts(
      gender,
      experience,
      equipment || this.getDefaultEquipment(experience)
    );
  }

  /**
   * ✅ ציוד דיפולטיבי לדמו
   * @description מחזיר ציוד מתאים לרמת ניסיון כברירת מחדל
   * @param experience - רמת ניסיון המשתמש
   * @returns מערך ציוד מתאים: מתחיל→none, בינוני→dumbbells, מתקדם→barbell
   */
  private getDefaultEquipment(
    experience: "beginner" | "intermediate" | "advanced"
  ): string[] {
    switch (experience) {
      case "beginner":
        return ["none"];
      case "intermediate":
        return ["none", "dumbbells"];
      case "advanced":
        return ["none", "dumbbells", "barbell"];
      default:
        return ["none"];
    }
  }
}

// 🔴 DEMO ONLY - ייצוא שירות אימוני דמו
// ✅ ACTIVE: שכבת תיווך קריטית - demoHistoryService תלוי ב-generateDemoWorkoutHistoryForUser
// 🔗 BRIDGE: מחבר נתוני משתמש אמיתיים עם workoutSimulationService
export const demoWorkoutService = DemoWorkoutService.getInstance();
export default demoWorkoutService;
