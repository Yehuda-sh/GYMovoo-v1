/**
 * @file src/services/demo/demoWorkoutService.ts
 * @brief 🔴 DEMO ONLY - שירות יצירת אימוני דמו
 * @description יוצר אימוני דמו למטרות פיתוח וצגה בלבד
 * @updated 2025-08-10 נוצר להפרדת לוגיקת דמו מקוד פרודקשן
 * @warning NOT FOR PRODUCTION - DEMO DATA ONLY
 */

// 🔴 DEMO ONLY - הגנה מפני שימוש בפרודקשן
if (!__DEV__) {
  throw new Error("Demo workout service should not be used in production");
}

import { WorkoutWithFeedback } from "../../screens/workout/types/workout.types";
import { UserGender } from "../../utils/genderAdaptation";
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
   * ✅ יצירת היסטוריית אימוני דמו (מחליף את simulateRealisticWorkoutHistory)
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

export const demoWorkoutService = DemoWorkoutService.getInstance();
export default demoWorkoutService;
