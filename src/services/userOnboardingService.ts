/**
 * שירות אוטומטי להקמת משתמשים חדשים לאחר מילוי שאלון
 * מבטיח שכל משתמש חדש יקבל הגדרה מלאה אוטומטית
 */

import { userApi } from "./api/userApi";
import { questionnaireService } from "./questionnaireService";
import type { SmartQuestionnaireData } from "../types";

export interface UserOnboardingResult {
  success: boolean;
  userId: string;
  equipmentAssigned: string[];
  workoutPlansGenerated: number;
  profileUpdated: boolean;
  errors?: string[];
}

/**
 * פונקציה מרכזית לביצוע אונבורדינג מלא למשתמש חדש
 */
export const completeUserOnboarding = async (
  userId: string
): Promise<UserOnboardingResult> => {
  console.warn("🚀 Starting automatic user onboarding for user:", userId);

  const result: UserOnboardingResult = {
    success: false,
    userId,
    equipmentAssigned: [],
    workoutPlansGenerated: 0,
    profileUpdated: false,
    errors: [],
  };

  try {
    // 1. קבלת נתוני המשתמש הנוכחיים מהשרת
    const userData = await userApi.getById(userId);
    if (!userData?.smartquestionnairedata) {
      throw new Error(
        "User has no questionnaire data - onboarding cannot proceed"
      );
    }

    const smartData = userData.smartquestionnairedata as SmartQuestionnaireData;
    console.warn("📋 User questionnaire data retrieved:", {
      fitness_goal: smartData.answers?.fitnessLevel,
      workout_location: smartData.answers?.workoutLocation,
      experience_level: smartData.answers?.fitnessLevel,
    });

    // 2. וידוא שהציוד מוגדר כראוי לפי מיקום האימון
    const workoutLocation = smartData.answers?.workoutLocation;
    let equipmentAssigned: string[] = [];

    // Use equipment from answers if available
    if (
      smartData.answers?.equipment &&
      Array.isArray(smartData.answers.equipment)
    ) {
      equipmentAssigned = [...smartData.answers.equipment];
    }

    result.equipmentAssigned = Array.from(new Set(equipmentAssigned)); // Remove duplicates
    console.warn("🏋️ Equipment assigned based on location:", {
      location: workoutLocation,
      equipment: result.equipmentAssigned,
    });

    // 3. יצירת תוכניות אימון אוטומטיות
    try {
      await questionnaireService.generateBothWorkoutPlans();
      result.workoutPlansGenerated = 2; // basic + smart plans
      console.warn("📅 Workout plans generated:", result.workoutPlansGenerated);
    } catch (workoutError) {
      console.error("❌ Error generating workout plans:", workoutError);
      const errorMessage =
        workoutError instanceof Error
          ? workoutError.message
          : String(workoutError);
      result.errors?.push(`Workout generation failed: ${errorMessage}`);
    }

    // 4. עדכון פרופיל המשתמש עם מידע נוסף - נעשה רק אם יש שדות תואמים
    try {
      // בדיקה איזה שדות זמינים לעדכון
      const profileUpdates: Record<string, unknown> = {};

      // נוסיף רק שדות שקיימים במודל User
      if ("updated_at" in userData) {
        profileUpdates.updated_at = new Date().toISOString();
      }

      if (Object.keys(profileUpdates).length > 0) {
        await userApi.update(userId, profileUpdates);
        result.profileUpdated = true;
        console.warn("👤 User profile updated with onboarding completion");
      } else {
        result.profileUpdated = true; // נחשיב כהצלחה גם בלי עדכון
        console.warn("👤 No profile fields to update, considering successful");
      }
    } catch (profileError) {
      console.error("❌ Error updating user profile:", profileError);
      const errorMessage =
        profileError instanceof Error
          ? profileError.message
          : String(profileError);
      result.errors?.push(`Profile update failed: ${errorMessage}`);
    }

    // 5. וידוא התקנה תקינה
    const validationChecks = {
      hasQuestionnaire: !!(
        smartData.answers?.fitnessLevel ||
        (Array.isArray(smartData.answers?.goals) && smartData.answers.goals[0])
      ),
      hasEquipment: result.equipmentAssigned.length > 0,
      hasWorkoutPlans: result.workoutPlansGenerated > 0,
      profileComplete: result.profileUpdated,
    };

    const allChecksPass = Object.values(validationChecks).every(
      (check) => check === true
    );

    if (allChecksPass) {
      result.success = true;
      console.warn("✅ User onboarding completed successfully:", {
        userId,
        equipment: result.equipmentAssigned.length,
        workoutPlans: result.workoutPlansGenerated,
        validation: validationChecks,
      });
    } else {
      result.errors?.push("Validation checks failed");
      console.warn(
        "⚠️ User onboarding completed with warnings:",
        validationChecks
      );
    }
  } catch (error) {
    console.error("❌ Critical error in user onboarding:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors?.push(`Critical error: ${errorMessage}`);
    result.success = false;
  }

  return result;
};

/**
 * פונקציה לווידוא שמשתמש קיבל הגדרה מלאה
 */
export const validateUserSetup = async (userId: string): Promise<boolean> => {
  try {
    const userData = await userApi.getById(userId);
    if (!userData) return false;

    const smartData = userData.smartquestionnairedata as SmartQuestionnaireData;
    if (!smartData) return false;

    // בדיקה שיש נתוני שאלון בסיסיים
    const hasBasicData = !!(
      smartData.answers?.fitnessLevel &&
      smartData.answers?.workoutLocation &&
      Array.isArray(smartData.answers?.equipment) &&
      smartData.answers?.equipment.length
    );

    // בדיקה שיש ציוד מתאים למיקום
    const hasEquipment = !!(
      Array.isArray(smartData.answers?.equipment) &&
      smartData.answers?.equipment.length &&
      smartData.answers?.workoutLocation
    );

    return hasBasicData && hasEquipment;
  } catch (error) {
    console.error("Error validating user setup:", error);
    return false;
  }
};
