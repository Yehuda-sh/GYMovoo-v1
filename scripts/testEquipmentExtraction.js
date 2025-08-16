require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function testEquipmentExtraction() {
  console.log("🧪 בודק חילוץ ציוד בסגנון ProfileScreen...");

  try {
    const { data: users } = await supabase
      .from("users")
      .select("*")
      .eq("name", "אלון מזרחי")
      .limit(1);

    const user = users[0];
    console.log(`👤 משתמש: ${user.name}`);

    // סימולציה של הלוגיקה ב-ProfileScreen
    const equipment = [];

    // 1. Smart questionnaire data answers
    const smartAnswers = user.smartquestionnairedata?.answers;
    if (smartAnswers?.equipment) {
      equipment.push(...smartAnswers.equipment);
      console.log("📋 מ-smartAnswers.equipment:", smartAnswers.equipment);
    }

    // 1.5. New structured equipment data
    const smartData = user.smartquestionnairedata;
    if (smartData) {
      const workoutLocation = smartData.workout_location;
      console.log("📍 workout_location:", workoutLocation);

      if (workoutLocation === "gym" && smartData.gym_equipment) {
        equipment.push(...smartData.gym_equipment);
        console.log("🏋️ מ-gym_equipment:", smartData.gym_equipment);
      } else if (
        workoutLocation === "home_equipment" &&
        smartData.home_equipment
      ) {
        equipment.push(...smartData.home_equipment);
        console.log("🏠 מ-home_equipment:", smartData.home_equipment);
      } else if (
        workoutLocation === "home_bodyweight" &&
        smartData.bodyweight_equipment
      ) {
        equipment.push(...smartData.bodyweight_equipment);
        console.log(
          "💪 מ-bodyweight_equipment:",
          smartData.bodyweight_equipment
        );
      }

      if (smartData.equipment && Array.isArray(smartData.equipment)) {
        equipment.push(...smartData.equipment);
        console.log("🔧 מ-equipment:", smartData.equipment);
      }
    }

    // 4. Legacy questionnaire
    const questionnaire = user.questionnaire;
    if (questionnaire?.equipment) {
      if (Array.isArray(questionnaire.equipment)) {
        equipment.push(...questionnaire.equipment);
        console.log("📜 מ-legacy equipment:", questionnaire.equipment);
      }
    }

    // הסר כפילויות
    const uniqueEquipment = [...new Set(equipment)];

    console.log(`\n✅ סיכום ציוד (${uniqueEquipment.length} פריטים):`);
    console.log(uniqueEquipment.join(", "));
  } catch (error) {
    console.error("❌ שגיאה:", error.message);
  }
}

testEquipmentExtraction();
