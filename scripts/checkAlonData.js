require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function checkAlonData() {
  try {
    const { data: users } = await supabase
      .from("users")
      .select("*")
      .eq("name", "אלון מזרחי");

    console.log("🔍 כל הנתונים של אלון מזרחי:");
    users.forEach((user, index) => {
      console.log(`\n👤 אלון מזרחי #${index + 1}:`);
      console.log("📧 Email:", user.email);
      console.log("🆔 ID:", user.id);
      console.log(
        "📍 workout_location:",
        user.smartquestionnairedata?.workout_location
      );
      console.log(
        "🛠️ gym_equipment:",
        JSON.stringify(user.smartquestionnairedata?.gym_equipment)
      );
      console.log(
        "🏠 home_equipment:",
        JSON.stringify(user.smartquestionnairedata?.home_equipment)
      );
      console.log(
        "💪 bodyweight_equipment:",
        JSON.stringify(user.smartquestionnairedata?.bodyweight_equipment)
      );
      console.log(
        "📊 answers.equipment:",
        JSON.stringify(user.smartquestionnairedata?.answers?.equipment)
      );
      console.log(
        "🎯 fitness_goal:",
        user.smartquestionnairedata?.fitness_goal
      );
      console.log(
        "📋 questionnaire legacy:",
        JSON.stringify(user.questionnaire)
      );
    });

    console.log(`\n📊 סה"כ נמצאו ${users.length} משתמשים בשם אלון מזרחי`);

    // בדוק אם יש כפילויות
    if (users.length > 1) {
      console.log("\n⚠️ יש כפילויות! זה יכול להסביר את הבעיה");

      const withEquipment = users.filter((u) => {
        const q = u.smartquestionnairedata;
        return (
          q?.gym_equipment?.length > 0 ||
          q?.home_equipment?.length > 0 ||
          q?.bodyweight_equipment?.length > 0 ||
          q?.answers?.equipment?.length > 0
        );
      });

      console.log(
        `📊 משתמשים עם ציוד: ${withEquipment.length} מתוך ${users.length}`
      );
    }
  } catch (error) {
    console.error("❌ שגיאה:", error.message);
  }
}

checkAlonData();
