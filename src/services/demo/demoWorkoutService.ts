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
   * ממפה מזהי ציוד מהשאלון המאוחד לערכים פנימיים שמנוע הסימולציה תומך בהם
   * unified → internal (simulation)
   */
  private mapUnifiedEquipmentToInternal(equipment: string[] = []): string[] {
    if (!Array.isArray(equipment) || equipment.length === 0) return ["none"];

    const result = new Set<string>();
    for (const id of equipment) {
      switch (id) {
        case "bodyweight_only":
        case "mat_available":
        case "yoga_mat":
        case "trx":
        case "resistance_bands":
        case "chair_available":
        case "wall_space":
        case "stairs_available":
        case "towel_available":
        case "water_bottles":
        case "pillow_available":
        case "table_sturdy":
        case "backpack_heavy":
        case "water_gallon":
        case "sandbag":
        case "tire":
          result.add("none");
          break;
        case "free_weights":
          result.add("barbell");
          result.add("dumbbells");
          break;
        case "dumbbells":
          result.add("dumbbells");
          break;
        case "pullup_bar":
          // אין סוג יעודי במנוע – נשען על bodyweight
          result.add("none");
          break;
        // ציודי חדר כושר שאינם ממופים במנוע – נשמור לוגיקה ניטרלית
        case "cable_machine":
        case "squat_rack":
        case "bench_press":
        case "leg_press":
        case "lat_pulldown":
        case "smith_machine":
        case "rowing_machine":
        case "treadmill":
        case "bike":
          // שמירה על אפשרות bodyweight כברירת מחדל
          result.add("none");
          break;
        default:
          result.add("none");
      }
    }

    // הבטחת לפחות ערך אחד מוכר
    if (result.size === 0) result.add("none");
    return Array.from(result);
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

    // שימוש בנתוני המשתמש האמיתיים (עדיפות לשאלון המאוחד)
    const smart = user.smartQuestionnaireData?.answers as
      | {
          gender?: string;
          fitnessLevel?: "beginner" | "intermediate" | "advanced";
          experience?: "beginner" | "intermediate" | "advanced";
          equipment?: string[];
          gym_equipment?: string[];
        }
      | undefined;

    const gender =
      (smart?.gender as UserGender | undefined) ||
      (user.preferences?.gender as UserGender | undefined) ||
      (user.questionnaire?.["1"] as UserGender | undefined) ||
      "other";

    const experience =
      smart?.fitnessLevel ||
      (smart?.experience as
        | "beginner"
        | "intermediate"
        | "advanced"
        | undefined) ||
      (user.questionnaire?.["3"] as
        | "beginner"
        | "intermediate"
        | "advanced"
        | undefined) ||
      "beginner";

    const unifiedEquip = (Array.isArray(smart?.equipment) &&
    smart?.equipment?.length
      ? smart?.equipment
      : Array.isArray(smart?.gym_equipment) && smart?.gym_equipment?.length
        ? smart?.gym_equipment
        : (user.questionnaire?.["4"] as string[] | undefined)) || [
      "bodyweight_only",
    ];

    const internalEquipment = this.mapUnifiedEquipmentToInternal(unifiedEquip);

    console.warn("🔍 Using real user data for demo:", {
      gender,
      experience,
      equipment: unifiedEquip.length,
    });

    return await workoutSimulationService.simulateHistoryCompatibleWorkouts(
      gender as UserGender,
      experience as "beginner" | "intermediate" | "advanced",
      internalEquipment
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
      const internal = this.mapUnifiedEquipmentToInternal(
        equipment || demoUser.equipment
      );
      return await workoutSimulationService.simulateHistoryCompatibleWorkouts(
        demoUser.gender,
        demoUser.experience,
        internal
      );
    }

    // השתמש בפרמטרים שסופקו
    return await workoutSimulationService.simulateHistoryCompatibleWorkouts(
      gender,
      experience,
      this.mapUnifiedEquipmentToInternal(
        equipment || this.getDefaultEquipment(experience)
      )
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
        return ["bodyweight_only"]; // ימופה ל-none
      case "intermediate":
        return ["bodyweight_only", "dumbbells"]; // dumbbells מוכר במנוע
      case "advanced":
        return ["bodyweight_only", "dumbbells", "free_weights"]; // free_weights ימופה ל-barbell+dumbbells
      default:
        return ["bodyweight_only"];
    }
  }
}

// 🔴 DEMO ONLY - ייצוא שירות אימוני דמו
// ✅ ACTIVE: שכבת תיווך קריטית - demoHistoryService תלוי ב-generateDemoWorkoutHistoryForUser
// 🔗 BRIDGE: מחבר נתוני משתמש אמיתיים עם workoutSimulationService
export const demoWorkoutService = DemoWorkoutService.getInstance();
export default demoWorkoutService;
