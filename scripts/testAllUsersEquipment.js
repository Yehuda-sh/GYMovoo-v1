require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function testAllUsersEquipment() {
  console.log("🧪 בודק ציוד לכל המשתמשים עם הלוגיקה החדשה...\n");

  try {
    const { data: users } = await supabase
      .from("users")
      .select("name, smartquestionnairedata, questionnaire");

    for (const user of users) {
      console.log(`👤 ${user.name}:`);

      const equipment = [];

      // 1. Smart questionnaire data answers
      const smartAnswers = user.smartquestionnairedata?.answers;
      if (smartAnswers?.equipment) {
        equipment.push(...smartAnswers.equipment);
      }

      // 1.5. New structured equipment data
      const smartData = user.smartquestionnairedata;
      if (smartData) {
        const workoutLocation = smartData.workout_location;

        if (workoutLocation === "gym" && smartData.gym_equipment) {
          equipment.push(...smartData.gym_equipment);
        } else if (
          workoutLocation === "home_equipment" &&
          smartData.home_equipment
        ) {
          equipment.push(...smartData.home_equipment);
        } else if (
          workoutLocation === "home_bodyweight" &&
          smartData.bodyweight_equipment
        ) {
          equipment.push(...smartData.bodyweight_equipment);
        }

        if (smartData.equipment && Array.isArray(smartData.equipment)) {
          equipment.push(...smartData.equipment);
        }
      }

      // 4. Legacy questionnaire
      const questionnaire = user.questionnaire;
      if (questionnaire?.equipment) {
        if (Array.isArray(questionnaire.equipment)) {
          equipment.push(...questionnaire.equipment);
        }
      }

      // הסר כפילויות
      const uniqueEquipment = [...new Set(equipment)];

      console.log(`   📍 מיקום: ${smartData?.workout_location || "לא צוין"}`);
      console.log(
        `   🛠️ ציוד (${uniqueEquipment.length}): ${uniqueEquipment.length > 0 ? uniqueEquipment.join(", ") : "אין"}`
      );
      console.log("");
    }

    // סיכום
    const usersWithEquipment = users.filter((user) => {
      const equipment = [];
      const smartAnswers = user.smartquestionnairedata?.answers;
      if (smartAnswers?.equipment) equipment.push(...smartAnswers.equipment);

      const smartData = user.smartquestionnairedata;
      if (smartData) {
        const workoutLocation = smartData.workout_location;
        if (workoutLocation === "gym" && smartData.gym_equipment)
          equipment.push(...smartData.gym_equipment);
        else if (
          workoutLocation === "home_equipment" &&
          smartData.home_equipment
        )
          equipment.push(...smartData.home_equipment);
        else if (
          workoutLocation === "home_bodyweight" &&
          smartData.bodyweight_equipment
        )
          equipment.push(...smartData.bodyweight_equipment);
        if (smartData.equipment && Array.isArray(smartData.equipment))
          equipment.push(...smartData.equipment);
      }

      const questionnaire = user.questionnaire;
      if (questionnaire?.equipment && Array.isArray(questionnaire.equipment))
        equipment.push(...questionnaire.equipment);

      return [...new Set(equipment)].length > 0;
    }).length;

    console.log("📊 סיכום:");
    console.log(`✅ משתמשים עם ציוד: ${usersWithEquipment}/${users.length}`);
    console.log(
      `🎯 אחוז מוצלח: ${Math.round((usersWithEquipment / users.length) * 100)}%`
    );
  } catch (error) {
    console.error("❌ שגיאה:", error.message);
  }
}

testAllUsersEquipment();
