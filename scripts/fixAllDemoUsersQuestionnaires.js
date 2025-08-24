/**
 * @file scripts/fixAllDemoUsersQuestionnaires.js
 * @description תיקון שאלונים לכל משתמשי הדמו
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * יצירת שאלון מושלם עבור רון שובל (Free)
 */
function createRonShovalQuestionnaire() {
  return {
    // Personal Info
    name: "Ron Shoval",
    age: 28,
    gender: "male",
    height: 175,
    weight: 75,
    
    // Goals
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
    
    // Health
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
    
    completed: true,
    completed_at: new Date().toISOString(),
    version: "2.2"
  };
}

/**
 * יצירת Smart Questionnaire Data עבור רון שובל
 */
function createRonShovalSmartData() {
  return {
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
      bodyweight_equipment: ["yoga_mat", "resistance_bands"]
    },
    metadata: {
      version: "2.2",
      analytics: {
        timeSpent: 180,
        strengthAreas: ["general_fitness", "weight_loss"],
        completionRate: 100,
        equipmentCount: 3,
        recommendedProfile: "beginner_general_fitness_home_equipment"
      },
      sessionId: "unified_ron_complete",
      deviceInfo: {
        platform: "mobile",
        screenWidth: 390,
        screenHeight: 844
      },
      validation: {
        errors: [],
        isValid: true,
        warnings: []
      },
      completedAt: new Date().toISOString(),
      completionTime: 180,
      totalQuestions: 13,
      recommendations: {
        primaryFocus: ["ירידה במשקל", "בניית שריר", "שיפור כושר"],
        nutritionTips: ["תזונה מאוזנת", "הפחתת קלוריות", "חלבון איכותי"],
        sessionDuration: "45 דקות מומלץ",
        workoutFrequency: "3 ימים בשבוע",
        equipmentSuggestions: ["משקולות קטנות", "רצועות התנגדות", "מזרן יוגה"]
      },
      questionsAnswered: 13
    },
    equipment: ["yoga_mat", "dumbbells", "resistance_bands"],
    fitness_goal: "general_fitness",
    gym_equipment: [],
    home_equipment: ["dumbbells", "resistance_bands"],
    experience_level: "beginner",
    workout_location: "home",
    bodyweight_equipment: ["yoga_mat", "resistance_bands"]
  };
}

/**
 * יצירת שאלון מושלם עבור נועה שפירא (Trial)
 */
function createNoaQuestionnaire() {
  return {
    name: "נועה שפירא",
    age: 32,
    gender: "female",
    height: 163,
    weight: 62,
    
    primary_goal: "improve_endurance",
    specific_goals: ["improve_endurance", "build_muscle", "stress_relief"],
    target_weight: 60,
    
    experience_level: "intermediate",
    previous_experience: ["gym_workouts", "home_workouts", "running"],
    workout_frequency_current: 3,
    workout_frequency_target: 4,
    
    workout_duration_preference: 50,
    workout_time_preference: "morning",
    workout_location: "both",
    
    available_equipment: ["dumbbells", "resistance_bands", "yoga_mat", "kettlebell"],
    equipment_budget: "medium",
    
    health_conditions: [],
    injuries: [],
    activity_level: "active",
    stress_level: "high",
    sleep_hours: 6,
    
    diet_type: "vegetarian",
    nutrition_goal: "maintenance",
    cooking_frequency: "often",
    
    motivation_factors: ["stress_relief", "health", "performance"],
    preferred_workout_style: "varied",
    social_preference: "group",
    
    completed: true,
    completed_at: new Date().toISOString(),
    version: "2.2"
  };
}

/**
 * יצירת Smart Questionnaire Data עבור נועה שפירא
 */
function createNoaSmartData() {
  return {
    answers: {
      age: 32,
      name: "נועה שפירא",
      goals: ["improve_endurance", "build_muscle", "stress_relief"],
      gender: "female",
      height: 163,
      weight: 62,
      equipment: ["dumbbells", "resistance_bands", "yoga_mat", "kettlebell"],
      nutrition: ["vegetarian", "maintenance"],
      diet_type: "vegetarian",
      experience: "intermediate",
      frequency: 4,
      duration: 50,
      location: "both",
      time_preference: "morning",
      health_conditions: [],
      availability: ["monday", "tuesday", "thursday", "saturday"],
      motivation: ["stress_relief", "health", "performance"],
      bodyweight_equipment: ["yoga_mat", "resistance_bands"]
    },
    metadata: {
      version: "2.2",
      analytics: {
        timeSpent: 220,
        strengthAreas: ["endurance", "strength", "flexibility"],
        completionRate: 100,
        equipmentCount: 4,
        recommendedProfile: "intermediate_endurance_mixed_equipment"
      },
      sessionId: "unified_noa_complete",
      deviceInfo: {
        platform: "mobile",
        screenWidth: 390,
        screenHeight: 844
      },
      validation: {
        errors: [],
        isValid: true,
        warnings: []
      },
      completedAt: new Date().toISOString(),
      completionTime: 220,
      totalQuestions: 13,
      recommendations: {
        primaryFocus: ["שיפור כושר", "בניית שריר", "הפגת מתח"],
        nutritionTips: ["תזונה צמחונית מאוזנת", "חלבון צמחי", "אנטיאוקסידנטים"],
        sessionDuration: "50 דקות מומלץ",
        workoutFrequency: "4 ימים בשבוע",
        equipmentSuggestions: ["קטלבל", "רצועות התנגדות", "משקולות"]
      },
      questionsAnswered: 13
    },
    equipment: ["dumbbells", "resistance_bands", "yoga_mat", "kettlebell"],
    fitness_goal: "improve_endurance",
    gym_equipment: ["dumbbells", "kettlebell"],
    home_equipment: ["resistance_bands", "yoga_mat"],
    experience_level: "intermediate",
    workout_location: "both",
    bodyweight_equipment: ["yoga_mat", "resistance_bands"]
  };
}

/**
 * יצירת שאלון מושלם עבור עמית כהן (Premium)
 */
function createAmitQuestionnaire() {
  return {
    name: "Amit Cohen",
    age: 35,
    gender: "male",
    height: 180,
    weight: 82,
    
    primary_goal: "build_muscle",
    specific_goals: ["build_muscle", "increase_strength", "improve_performance"],
    target_weight: 85,
    
    experience_level: "advanced",
    previous_experience: ["gym_workouts", "powerlifting", "bodybuilding"],
    workout_frequency_current: 5,
    workout_frequency_target: 6,
    
    workout_duration_preference: 75,
    workout_time_preference: "evening",
    workout_location: "gym",
    
    available_equipment: ["barbell", "dumbbells", "cable_machine", "squat_rack", "bench"],
    equipment_budget: "high",
    
    health_conditions: [],
    injuries: ["lower_back_history"],
    activity_level: "very_active",
    stress_level: "medium",
    sleep_hours: 7,
    
    diet_type: "flexible",
    nutrition_goal: "bulk",
    cooking_frequency: "rarely",
    
    motivation_factors: ["performance", "strength", "aesthetics"],
    preferred_workout_style: "structured_progressive",
    social_preference: "solo",
    
    completed: true,
    completed_at: new Date().toISOString(),
    version: "2.2"
  };
}

/**
 * יצירת Smart Questionnaire Data עבור עמית כהן
 */
function createAmitSmartData() {
  return {
    answers: {
      age: 35,
      name: "Amit Cohen",
      goals: ["build_muscle", "increase_strength", "improve_performance"],
      gender: "male",
      height: 180,
      weight: 82,
      equipment: ["barbell", "dumbbells", "cable_machine", "squat_rack", "bench"],
      nutrition: ["flexible", "bulk"],
      diet_type: "flexible",
      experience: "advanced",
      frequency: 6,
      duration: 75,
      location: "gym",
      time_preference: "evening",
      health_conditions: [],
      injuries: ["lower_back_history"],
      availability: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      motivation: ["performance", "strength", "aesthetics"],
      bodyweight_equipment: []
    },
    metadata: {
      version: "2.2",
      analytics: {
        timeSpent: 300,
        strengthAreas: ["strength", "muscle_building", "performance"],
        completionRate: 100,
        equipmentCount: 5,
        recommendedProfile: "advanced_strength_gym_full_equipment"
      },
      sessionId: "unified_amit_complete",
      deviceInfo: {
        platform: "mobile",
        screenWidth: 390,
        screenHeight: 844
      },
      validation: {
        errors: [],
        isValid: true,
        warnings: []
      },
      completedAt: new Date().toISOString(),
      completionTime: 300,
      totalQuestions: 13,
      recommendations: {
        primaryFocus: ["בניית שריר", "הגדלת כוח", "שיפור ביצועים"],
        nutritionTips: ["תזונה עשירה בחלבון", "עודף קלורי מבוקר", "תזמון חלבון"],
        sessionDuration: "75 דקות מומלץ",
        workoutFrequency: "6 ימים בשבוע",
        equipmentSuggestions: ["מוטות משקל", "משקולות כבדות", "מכונות כבלים"]
      },
      questionsAnswered: 13
    },
    equipment: ["barbell", "dumbbells", "cable_machine", "squat_rack", "bench"],
    fitness_goal: "build_muscle",
    gym_equipment: ["barbell", "dumbbells", "cable_machine", "squat_rack", "bench"],
    home_equipment: [],
    experience_level: "advanced",
    workout_location: "gym",
    bodyweight_equipment: []
  };
}

/**
 * תיקון שאלון של משתמש בודד
 */
async function fixUserQuestionnaire(userId, questionnaire, smartData, preferences) {
  try {
    const { error } = await supabase
      .from("users")
      .update({
        questionnaire: questionnaire,
        smartquestionnairedata: smartData,
        preferences: preferences,
        updated_at: new Date().toISOString()
      })
      .eq("id", userId);

    if (error) {
      console.error(`❌ שגיאה בעדכון ${userId}:`, error.message);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`❌ שגיאה כללית בעדכון ${userId}:`, error);
    return false;
  }
}

/**
 * תיקון כל משתמשי הדמו
 */
async function fixAllDemoUsersQuestionnaires() {
  console.log("🔧 תיקון שאלונים לכל משתמשי הדמו\n");

  const fixes = [
    {
      name: "Ron Shoval",
      id: "u_init_1",
      type: "FREE",
      questionnaire: createRonShovalQuestionnaire(),
      smartData: createRonShovalSmartData(),
      preferences: {
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
        motivation_factors: ["health", "appearance", "energy"]
      }
    },
    {
      name: "נועה שפירא",
      id: "realistic_1755276001521_ifig7z",
      type: "TRIAL",
      questionnaire: createNoaQuestionnaire(),
      smartData: createNoaSmartData(),
      preferences: {
        gender: "female",
        language: "he",
        rtlPreference: true,
        age: 32,
        height: 163,
        weight: 62,
        fitness_goals: ["improve_endurance", "build_muscle", "stress_relief"],
        experience_level: "intermediate",
        workout_frequency: 4,
        workout_duration: 50,
        workout_time: "morning",
        preferred_equipment: ["dumbbells", "resistance_bands", "yoga_mat", "kettlebell"],
        diet_type: "vegetarian",
        activity_level: "active",
        motivation_factors: ["stress_relief", "health", "performance"]
      }
    },
    {
      name: "Amit Cohen",
      id: "u_init_3",
      type: "PREMIUM",
      questionnaire: createAmitQuestionnaire(),
      smartData: createAmitSmartData(),
      preferences: {
        gender: "male",
        language: "he",
        rtlPreference: true,
        age: 35,
        height: 180,
        weight: 82,
        fitness_goals: ["build_muscle", "increase_strength", "improve_performance"],
        experience_level: "advanced",
        workout_frequency: 6,
        workout_duration: 75,
        workout_time: "evening",
        preferred_equipment: ["barbell", "dumbbells", "cable_machine", "squat_rack", "bench"],
        diet_type: "flexible",
        activity_level: "very_active",
        motivation_factors: ["performance", "strength", "aesthetics"]
      }
    }
  ];

  const results = [];

  for (const fix of fixes) {
    console.log(`🔄 מתקן ${fix.name} (${fix.type})...`);
    
    const success = await fixUserQuestionnaire(
      fix.id,
      fix.questionnaire,
      fix.smartData,
      fix.preferences
    );

    if (success) {
      console.log(`✅ ${fix.name} תוקן בהצלחה`);
    } else {
      console.log(`❌ ${fix.name} נכשל`);
    }

    results.push({ name: fix.name, success });
  }

  // סיכום
  console.log("\n📋 סיכום תיקונים:");
  console.log("=" * 30);

  const successCount = results.filter(r => r.success).length;
  
  results.forEach(result => {
    const status = result.success ? "✅ תוקן" : "❌ נכשל";
    console.log(`${result.name}: ${status}`);
  });

  console.log(`\n📊 סה"כ: ${successCount}/${results.length} משתמשים תוקנו בהצלחה`);

  if (successCount === results.length) {
    console.log("\n🎉 כל השאלונים תוקנו בהצלחה!");
    console.log("📱 עכשיו כל הפרופילים אמורים להציג מידע מלא");
  }

  return successCount === results.length;
}

// הרצה
fixAllDemoUsersQuestionnaires()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ שגיאה:", error);
    process.exit(1);
  });
