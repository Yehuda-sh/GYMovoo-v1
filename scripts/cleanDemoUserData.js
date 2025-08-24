/**
 * @file scripts/cleanDemoUserData.js
 * @description ניקוי נתונים מיותרים והשארת רק נתונים מקוריים
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * יצירת שאלון נקי עבור רון שובל - רק נתונים מקוריים
 */
function createCleanRonQuestionnaire() {
  return {
    name: "Ron Shoval",
    age: 28,
    gender: "male", 
    height: 175,
    weight: 75,
    
    // רק מטרות שהיו ב-smart data המקורי
    specific_goals: ["lose_weight", "build_muscle", "improve_endurance"],
    primary_goal: "general_fitness",
    
    // רק ציוד שהיה במקור
    available_equipment: ["yoga_mat", "dumbbells", "resistance_bands"],
    
    // נתוני אימון בסיסיים
    experience_level: "beginner",
    workout_frequency_target: 3,
    workout_duration_preference: 45,
    workout_location: "home",
    workout_time_preference: "evening",
    diet_type: "none",
    
    completed: true,
    completed_at: new Date().toISOString(),
    version: "2.2"
  };
}

/**
 * יצירת שאלון נקי עבור נועה שפירא - רק נתונים מקוריים
 */
function createCleanNoaQuestionnaire() {
  return {
    name: "נועה שפירא",
    age: 32,
    gender: "female",
    height: 163,
    weight: 62,
    
    // רק מטרות שהיו ב-smart data המקורי
    specific_goals: ["improve_endurance", "build_muscle", "stress_relief"],
    primary_goal: "improve_endurance",
    
    // רק ציוד שהיה במקור
    available_equipment: ["dumbbells", "resistance_bands", "yoga_mat", "kettlebell"],
    
    // נתוני אימון בסיסיים
    experience_level: "intermediate",
    workout_frequency_target: 4,
    workout_duration_preference: 50,
    workout_location: "both",
    workout_time_preference: "morning",
    diet_type: "vegetarian",
    
    completed: true,
    completed_at: new Date().toISOString(),
    version: "2.2"
  };
}

/**
 * יצירת שאלון נקי עבור עמית כהן - רק נתונים מקוריים
 */
function createCleanAmitQuestionnaire() {
  return {
    name: "Amit Cohen",
    age: 35,
    gender: "male",
    height: 180,
    weight: 82,
    
    // רק מטרות שהיו ב-smart data המקורי
    specific_goals: ["build_muscle", "increase_strength", "improve_performance"],
    primary_goal: "build_muscle",
    
    // רק ציוד שהיה במקור
    available_equipment: ["barbell", "dumbbells", "cable_machine", "squat_rack", "bench"],
    
    // נתוני אימון בסיסיים
    experience_level: "advanced",
    workout_frequency_target: 6,
    workout_duration_preference: 75,
    workout_location: "gym",
    workout_time_preference: "evening",
    diet_type: "flexible",
    
    completed: true,
    completed_at: new Date().toISOString(),
    version: "2.2"
  };
}

/**
 * יצירת preferences נקיות
 */
function createCleanPreferences(questionnaire) {
  return {
    gender: questionnaire.gender,
    language: "he",
    rtlPreference: true,
    age: questionnaire.age,
    height: questionnaire.height,
    weight: questionnaire.weight,
    fitness_goals: questionnaire.specific_goals,
    experience_level: questionnaire.experience_level,
    workout_frequency: questionnaire.workout_frequency_target,
    workout_duration: questionnaire.workout_duration_preference,
    workout_time: questionnaire.workout_time_preference,
    preferred_equipment: questionnaire.available_equipment,
    diet_type: questionnaire.diet_type
  };
}

/**
 * עדכון smart questionnaire data עם נתונים נקיים
 */
function updateSmartQuestionnaireData(originalSmartData, cleanQuestionnaire) {
  const updatedSmartData = { ...originalSmartData };
  
  // עדכון ה-metadata עם נתונים נכונים
  if (updatedSmartData.metadata) {
    updatedSmartData.metadata.completionRate = 100;
    updatedSmartData.metadata.questionsAnswered = 13;
    updatedSmartData.metadata.completedAt = cleanQuestionnaire.completed_at;
    
    // עדכון recommendations להיות רלוונטיות יותר
    updatedSmartData.metadata.recommendations = {
      primaryFocus: cleanQuestionnaire.specific_goals,
      sessionDuration: `${cleanQuestionnaire.workout_duration_preference} דקות מומלץ`,
      workoutFrequency: `${cleanQuestionnaire.workout_frequency_target} ימים בשבוע`,
      equipmentSuggestions: cleanQuestionnaire.available_equipment
    };
  }
  
  return updatedSmartData;
}

/**
 * ניקוי נתונים עבור משתמש בודד
 */
async function cleanUserData(userId, cleanQuestionnaire) {
  try {
    // שליפת נתונים נוכחיים
    const { data: userData, error: fetchError } = await supabase
      .from("users")
      .select("smartquestionnairedata")
      .eq("id", userId)
      .single();

    if (fetchError || !userData) {
      console.error(`❌ לא ניתן לשלוף נתונים עבור ${userId}`);
      return false;
    }

    const cleanPreferences = createCleanPreferences(cleanQuestionnaire);
    const updatedSmartData = updateSmartQuestionnaireData(userData.smartquestionnairedata, cleanQuestionnaire);

    // עדכון במסד הנתונים
    const { error } = await supabase
      .from("users")
      .update({
        questionnaire: cleanQuestionnaire,
        smartquestionnairedata: updatedSmartData,
        preferences: cleanPreferences,
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
 * ניקוי נתונים לכל משתמשי הדמו
 */
async function cleanAllDemoUserData() {
  console.log("🧹 ניקוי נתונים מיותרים במשתמשי הדמו");
  console.log("🎯 מסיר: רמת פעילות, שעות שינה, מוטיבציה, רמת מתח, משקל יעד");
  console.log("✅ משאיר: נתונים שבאמת היו ב-smart data המקורי\n");

  const cleanups = [
    {
      id: "u_init_1",
      name: "Ron Shoval",
      questionnaire: createCleanRonQuestionnaire()
    },
    {
      id: "realistic_1755276001521_ifig7z", 
      name: "נועה שפירא",
      questionnaire: createCleanNoaQuestionnaire()
    },
    {
      id: "u_init_3",
      name: "Amit Cohen",
      questionnaire: createCleanAmitQuestionnaire()
    }
  ];

  const results = [];

  for (const cleanup of cleanups) {
    console.log(`🔄 מנקה נתונים עבור ${cleanup.name}...`);
    
    const success = await cleanUserData(cleanup.id, cleanup.questionnaire);
    
    if (success) {
      console.log(`✅ ${cleanup.name} נוקה בהצלחה`);
      console.log(`   📊 נתונים שנשארו: ${Object.keys(cleanup.questionnaire).length} שדות`);
      console.log(`   🎯 מטרות: ${cleanup.questionnaire.specific_goals.join(", ")}`);
      console.log(`   🏋️ ציוד: ${cleanup.questionnaire.available_equipment.length} פריטים`);
    } else {
      console.log(`❌ ${cleanup.name} נכשל`);
    }

    results.push({ name: cleanup.name, success });
    console.log("");
  }

  // סיכום
  const successCount = results.filter(r => r.success).length;
  
  console.log("📋 סיכום ניקוי:");
  console.log("=" * 20);
  results.forEach(result => {
    const status = result.success ? "✅ נוקה" : "❌ נכשל";
    console.log(`${result.name}: ${status}`);
  });

  console.log(`\n📊 סה"כ: ${successCount}/${results.length} משתמשים נוקו בהצלחה`);

  if (successCount === results.length) {
    console.log("\n🎉 כל הנתונים נוקו בהצלחה!");
    console.log("📱 עכשיו הפרופילים מציגים רק נתונים אמיתיים");
    console.log("💡 הנתונים מבוססים על מה שבאמת היה ב-smart questionnaire המקורי");
  }

  return successCount === results.length;
}

// הרצה
cleanAllDemoUserData()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ שגיאה:", error);
    process.exit(1);
  });
