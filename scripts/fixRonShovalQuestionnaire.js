/**
 * @file scripts/fixRonShovalQuestionnaire.js
 * @description תיקון נתוני השאלון של רון שובל
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function fixRonShovalQuestionnaire() {
  console.log("🔧 תיקון נתוני השאלון של רון שובל\n");

  try {
    // שאלון מושלם עבור רון שובל - Free User
    const completeQuestionnaire = {
      // Personal Info
      name: "Ron Shoval",
      age: 28,
      gender: "male",
      height: 175,
      weight: 75,

      // Fitness Goals
      primary_goal: "general_fitness",
      specific_goals: ["lose_weight", "build_muscle", "improve_endurance"],
      target_weight: 70,

      // Experience
      experience_level: "beginner",
      previous_experience: ["home_workouts"],
      workout_frequency_current: 2,
      workout_frequency_target: 3,

      // Preferences
      workout_duration_preference: 45,
      workout_time_preference: "evening",
      workout_location: "home",

      // Equipment
      available_equipment: ["yoga_mat", "dumbbells", "resistance_bands"],
      equipment_budget: "low",

      // Health & Lifestyle
      health_conditions: [],
      injuries: [],
      activity_level: "sedentary",
      stress_level: "medium",
      sleep_hours: 7,

      // Nutrition
      diet_type: "none",
      nutrition_goal: "balanced",
      cooking_frequency: "sometimes",

      // Motivation
      motivation_factors: ["health", "appearance", "energy"],
      preferred_workout_style: "structured",
      social_preference: "solo",

      // Completed questionnaire metadata
      completed: true,
      completed_at: new Date().toISOString(),
      version: "2.2",
    };

    // Smart questionnaire data מעודכן
    const updatedSmartQuestionnaireData = {
      answers: {
        age: 28,
        name: "Ron Shoval",
        goals: ["lose_weight", "build_muscle", "improve_endurance"],
        gender: "male",
        height: 175,
        weight: 75,
        equipment: ["yoga_mat", "dumbbells", "resistance_bands"],
        nutrition: ["balanced"],
        diet_type: "none",
        experience: "beginner",
        frequency: 3,
        duration: 45,
        location: "home",
        time_preference: "evening",
        health_conditions: [],
        availability: ["monday", "wednesday", "friday"],
        motivation: ["health", "appearance", "energy"],
        bodyweight_equipment: ["yoga_mat", "resistance_bands"],
      },
      metadata: {
        version: "2.2",
        analytics: {
          timeSpent: 180,
          strengthAreas: ["general_fitness", "weight_loss"],
          completionRate: 100,
          equipmentCount: 3,
          recommendedProfile: "beginner_general_fitness_home_equipment",
        },
        sessionId: "unified_1755264440615_complete",
        deviceInfo: {
          platform: "mobile",
          screenWidth: 390,
          screenHeight: 844,
        },
        validation: {
          errors: [],
          isValid: true,
          warnings: [],
        },
        completedAt: new Date().toISOString(),
        completionTime: 180,
        totalQuestions: 13,
        recommendations: {
          primaryFocus: [
            "ירידה במשקל",
            "בניית שריר",
            "שיפור כושר",
            "אימונים מובנים",
          ],
          nutritionTips: ["תזונה מאוזנת", "הפחתת קלוריות", "חלבון איכותי"],
          sessionDuration: "45 דקות מומלץ",
          workoutFrequency: "3 ימים בשבוע",
          equipmentSuggestions: [
            "משקולות קטנות",
            "רצועות התנגדות",
            "מזרן יוגה",
          ],
        },
        questionsAnswered: 13,
      },
      equipment: ["yoga_mat", "dumbbells", "resistance_bands"],
      fitness_goal: "general_fitness",
      gym_equipment: [],
      home_equipment: ["dumbbells", "resistance_bands"],
      experience_level: "beginner",
      workout_location: "home",
      bodyweight_equipment: ["yoga_mat", "resistance_bands"],
    };

    // עדכון העדפות
    const updatedPreferences = {
      gender: "male",
      language: "he",
      rtlPreference: true,
      age: 28,
      height: 175,
      weight: 75,
      fitness_goals: ["lose_weight", "build_muscle", "improve_endurance"],
      experience_level: "beginner",
      workout_frequency: 3,
      workout_duration: 45,
      workout_time: "evening",
      preferred_equipment: ["yoga_mat", "dumbbells", "resistance_bands"],
      diet_type: "none",
      activity_level: "sedentary",
      motivation_factors: ["health", "appearance", "energy"],
    };

    // עדכון במסד הנתונים
    const { error } = await supabase
      .from("users")
      .update({
        questionnaire: completeQuestionnaire,
        smartquestionnairedata: updatedSmartQuestionnaireData,
        preferences: updatedPreferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", "u_init_1");

    if (error) {
      console.error("❌ שגיאה בעדכון:", error.message);
      return false;
    }

    console.log("✅ נתוני השאלון של רון שובל עודכנו בהצלחה!");
    console.log("\n📋 מה עודכן:");
    console.log("• questionnaire: שאלון מלא ומושלם (100%)");
    console.log("• smartquestionnairedata: נתונים מעודכנים עם 13/13 שאלות");
    console.log("• preferences: העדפות מפורטות על בסיס תשובות השאלון");
    console.log("\n🎯 פרופיל רון שובל עכשיו כולל:");
    console.log("• מידע אישי מלא (גיל, גובה, משקל)");
    console.log("• יעדי כושר ברורים (ירידה במשקל + בניית שריר)");
    console.log("• ציוד זמין (מזרן יוגה, משקולות, רצועות)");
    console.log("• תדירות ומשך אימונים מועדפים");
    console.log("• מידע תזונתי והרגלי חיים");

    return true;
  } catch (error) {
    console.error("❌ שגיאה כללית:", error);
    return false;
  }
}

// הרצה
fixRonShovalQuestionnaire()
  .then((success) => {
    if (success) {
      console.log("\n🎉 התיקון הושלם בהצלחה!");
      console.log("📱 עכשיו דף הפרופיל של רון שובל אמור להציג מידע מלא");
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ שגיאה:", error);
    process.exit(1);
  });
