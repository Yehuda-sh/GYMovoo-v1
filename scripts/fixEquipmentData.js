require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function fixEquipmentData() {
  console.log("🔧 מתקן נתוני ציוד למשתמשים...");

  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("id, name, smartquestionnairedata");

    if (error) {
      console.error("❌ שגיאה:", error);
      return;
    }

    console.log(`📋 נמצאו ${users.length} משתמשים לתיקון\n`);

    let fixed = 0;
    let failed = 0;

    for (const user of users) {
      try {
        const questionnaire = user.smartquestionnairedata || {};
        const answers = questionnaire.answers || {};

        // בדוק אם יש נתוני ציוד ב-answers
        const equipment = answers.equipment || [];
        const bodyweightEquipment = answers.bodyweight_equipment || [];
        const homeEquipment = answers.home_equipment || [];
        const gymEquipment = answers.gym_equipment || [];

        console.log(`🔧 ${user.name}:`);
        console.log(`   מצא equipment: ${JSON.stringify(equipment)}`);
        console.log(
          `   מצא bodyweight_equipment: ${JSON.stringify(bodyweightEquipment)}`
        );

        // קבע workout_location לפי סוג הציוד
        let workout_location = "home_bodyweight"; // ברירת מחדל

        if (
          gymEquipment.length > 0 ||
          equipment.some((e) =>
            ["barbells", "cable_machines", "lat_pulldown"].includes(e)
          )
        ) {
          workout_location = "gym";
        } else if (
          homeEquipment.length > 0 ||
          equipment.some((e) => ["dumbbells", "resistance_bands"].includes(e))
        ) {
          workout_location = "home_equipment";
        } else {
          workout_location = "home_bodyweight";
        }

        // קבע מטרת כושר לפי הנתונים הקיימים
        const goals = answers.goals || [];
        let fitness_goal = "general_fitness"; // ברירת מחדל

        if (goals.includes("lose_weight") || goals.includes("weight_loss")) {
          fitness_goal = "lose_weight";
        } else if (
          goals.includes("build_muscle") ||
          goals.includes("muscle_gain")
        ) {
          fitness_goal = "build_muscle";
        }

        // עדכן את ה-smartquestionnairedata עם הנתונים החסרים
        const updatedQuestionnaire = {
          ...questionnaire,
          // הוסף נתונים ברמה הראשונה
          workout_location: workout_location,
          fitness_goal: fitness_goal,
          experience_level: answers.experience_level || "beginner",
          gym_equipment:
            workout_location === "gym"
              ? gymEquipment.length > 0
                ? gymEquipment
                : equipment.filter((e) =>
                    ["barbells", "cable_machines", "lat_pulldown"].includes(e)
                  )
              : [],
          home_equipment:
            workout_location === "home_equipment"
              ? homeEquipment.length > 0
                ? homeEquipment
                : equipment.filter((e) =>
                    ["dumbbells", "resistance_bands"].includes(e)
                  )
              : [],
          bodyweight_equipment:
            workout_location === "home_bodyweight"
              ? bodyweightEquipment.length > 0
                ? bodyweightEquipment
                : equipment
              : [],
          equipment: equipment, // שמור גם legacy

          // שמור את answers המקורי
          answers: answers,
        };

        console.log(`   ➡️  workout_location: ${workout_location}`);
        console.log(`   ➡️  fitness_goal: ${fitness_goal}`);
        console.log(
          `   ➡️  ציוד מותאם: ${JSON.stringify(updatedQuestionnaire[workout_location.replace("home_", "") + "_equipment"])}`
        );

        // עדכן בבסיס הנתונים
        const { error: updateError } = await supabase
          .from("users")
          .update({ smartquestionnairedata: updatedQuestionnaire })
          .eq("id", user.id);

        if (updateError) {
          console.error(`❌ שגיאה בעדכון ${user.name}:`, updateError.message);
          failed++;
        } else {
          console.log(`✅ עודכן: ${user.name}`);
          fixed++;
        }

        console.log(""); // שורה ריקה
      } catch (userError) {
        console.error(`❌ שגיאה במשתמש ${user.name}:`, userError.message);
        failed++;
      }
    }

    console.log(`📊 סיכום:`);
    console.log(`✅ תוקנו בהצלחה: ${fixed}`);
    console.log(`❌ נכשלו: ${failed}`);
    console.log(`📊 סה"כ: ${users.length}`);
  } catch (error) {
    console.error("❌ שגיאה כללית:", error.message);
  }
}

fixEquipmentData();
