require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function checkEquipmentData() {
  console.log("🔍 בודק נתוני ציוד למשתמשים:");

  try {
    const { data: users, error } = await supabase
      .from("users")
      .select("name, smartquestionnairedata");

    if (error) {
      console.error("❌ שגיאה:", error);
      return;
    }

    console.log(`📋 נמצאו ${users.length} משתמשים\n`);

    users.forEach((user) => {
      const q = user.smartquestionnairedata || {};
      console.log(`👤 ${user.name}:`);
      console.log(`   📍 workout_location: ${q.workout_location || "לא צוין"}`);
      console.log(
        `   🛠️  gym_equipment: ${JSON.stringify(q.gym_equipment) || "לא צוין"}`
      );
      console.log(
        `   🏠 home_equipment: ${JSON.stringify(q.home_equipment) || "לא צוין"}`
      );
      console.log(
        `   💪 bodyweight_equipment: ${JSON.stringify(q.bodyweight_equipment) || "לא צוין"}`
      );
      console.log(
        `   🔧 equipment (legacy): ${JSON.stringify(q.equipment) || "לא צוין"}`
      );
      console.log("");
    });

    // סיכום
    const withGym = users.filter(
      (u) => u.smartquestionnairedata?.gym_equipment?.length > 0
    ).length;
    const withHome = users.filter(
      (u) => u.smartquestionnairedata?.home_equipment?.length > 0
    ).length;
    const withBodyweight = users.filter(
      (u) => u.smartquestionnairedata?.bodyweight_equipment?.length > 0
    ).length;
    const withLegacy = users.filter(
      (u) => u.smartquestionnairedata?.equipment?.length > 0
    ).length;

    console.log("📊 סיכום ציוד:");
    console.log(`   🏋️ עם ציוד חדר כושר: ${withGym}`);
    console.log(`   🏠 עם ציוד בית: ${withHome}`);
    console.log(`   💪 עם ציוד משקל גוף: ${withBodyweight}`);
    console.log(`   🔧 עם ציוד legacy: ${withLegacy}`);
  } catch (error) {
    console.error("❌ שגיאה:", error.message);
  }
}

checkEquipmentData();
