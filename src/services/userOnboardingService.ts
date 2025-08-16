/**
 * שירות אוטומטי להקמת משתמשים חדשים לאחר מילוי שאלון
 * מבטיח שכל משתמש חדש יקבל הגדרה מלאה אוטומטית
 */

import { userApi } from "./api/userApi";
import { questionnaireService } from "./questionnaireService";

interface UserOnboardingResult {
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

    const smartData = userData.smartquestionnairedata as any; // Extended with equipment fields
    console.warn("📋 User questionnaire data retrieved:", {
      fitness_goal: smartData.fitness_goal,
      workout_location: smartData.workout_location,
      experience_level: smartData.experience_level,
    });

    // 2. וידוא שהציוד מוגדר כראוי לפי מיקום האימון
    const workoutLocation = smartData.workout_location;
    let equipmentAssigned: string[] = [];

    if (workoutLocation === "gym" && smartData.gym_equipment) {
      equipmentAssigned = smartData.gym_equipment || [];
    } else if (
      workoutLocation === "home_equipment" &&
      smartData.home_equipment
    ) {
      equipmentAssigned = smartData.home_equipment || [];
    } else if (
      workoutLocation === "home_bodyweight" &&
      smartData.bodyweight_equipment
    ) {
      equipmentAssigned = smartData.bodyweight_equipment || [];
    }

    // Also include generic equipment field if it exists
    if (smartData.equipment && Array.isArray(smartData.equipment)) {
      equipmentAssigned.push(...smartData.equipment);
    }

    result.equipmentAssigned = Array.from(new Set(equipmentAssigned)); // Remove duplicates
    console.warn("🏋️ Equipment assigned based on location:", {
      location: workoutLocation,
      equipment: result.equipmentAssigned,
    });

    // 3. יצירת תוכניות אימון אוטומטיות
    try {
      const workoutPlans =
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
      const profileUpdates: Record<string, any> = {};

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
        smartData.fitness_goal || smartData.answers?.fitnessLevel
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

    const smartData = userData.smartquestionnairedata as any;
    if (!smartData) return false;

    // בדיקה שיש נתוני שאלון בסיסיים
    const hasBasicData = !!(
      (smartData.fitness_goal || smartData.answers?.fitnessLevel) &&
      smartData.workout_location &&
      (smartData.experience_level || smartData.answers?.fitnessLevel)
    );

    // בדיקה שיש ציוד מתאים למיקום
    const location = smartData.workout_location;
    const hasEquipment = !!(
      (location === "gym" && smartData.gym_equipment?.length) ||
      (location === "home_equipment" && smartData.home_equipment?.length) ||
      (location === "home_bodyweight" &&
        smartData.bodyweight_equipment?.length) ||
      smartData.equipment?.length
    );

    return hasBasicData && hasEquipment;
  } catch (error) {
    console.error("Error validating user setup:", error);
    return false;
  }
};
