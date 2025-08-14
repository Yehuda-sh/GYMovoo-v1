/**
 * Quick fix: עדכון משתמש u_init_1 עם שאלון מושלם ב-Supabase
 */

const { createClient } = require("@supabase/supabase-js");

async function main() {
  // משתני סביבה
  const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim();
  const SUPABASE_ANON = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!SUPABASE_URL || !SUPABASE_ANON) {
    console.error("❌ חסרים משתני סביבה לSupabase");
    process.exit(1);
  }

  // יצירת קליינט
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

  try {
    console.log("🔧 מעדכן משתמש u_init_1 עם שאלון מושלם...");

    // נתוני שאלון מושלם
    const smartQuestionnaireData = {
      answers: {
        gender: "male",
        age: "under_18",
        weight: "50_60",
        height: "150_160",
        fitnessLevel: "advanced",
        goals: ["general_fitness"],
        equipment: ["free_weights", "cable_machine", "squat_rack"],
        availability: ["5_days"],
        sessionDuration: "60_plus_min",
        workoutLocation: "gym",
        nutrition: ["keto"],
      },
      metadata: {
        completedAt: new Date().toISOString(),
        version: "2.1",
        sessionId: `unified_${Date.now()}`,
        completionTime: 110,
        questionsAnswered: 10,
        totalQuestions: 10,
        deviceInfo: {
          platform: "mobile",
          screenWidth: 0,
          screenHeight: 0,
        },
      },
    };

    // עדכון המשתמש
    const { data, error } = await supabase
      .from("users")
      .update({
        smartquestionnairedata: smartQuestionnaireData,
      })
      .eq("id", "u_init_1")
      .select();

    if (error) {
      console.error("❌ שגיאה בעדכון:", error);
      process.exit(1);
    }

    console.log("✅ המשתמש u_init_1 עודכן בהצלחה!");
    console.log("📊 נתונים שנשמרו:", data);
    console.log("\n🚀 עכשיו רענן את האפליקציה ותראה את משתמש עם שאלון מושלם!");
  } catch (err) {
    console.error("❌ שגיאה כללית:", err);
    process.exit(1);
  }
}

main();
