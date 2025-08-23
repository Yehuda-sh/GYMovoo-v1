/**
 * תיקון משתמשי דמו שלא תואמים לטיפוסי הפרויקט
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function fixDemoUsersCompatibility() {
  try {
    console.log("🔧 מתקן משתמשי דמו שלא תואמים...\n");

    // תיקון נועה שפירא - ציוד home_bodyweight
    console.log("1️⃣ מתקן נועה שפירא - ציוד home_bodyweight");
    console.log("=".repeat(50));

    const { data: noaUser, error: noaError } = await supabase
      .from("users")
      .select("*")
      .eq("email", "noa.shapira.updated@walla.com")
      .single();

    if (noaError) {
      console.error("❌ שגיאה בקבלת נועה:", noaError.message);
    } else {
      const questionnaire = noaUser.smartquestionnairedata;

      // תיקון ציוד home_bodyweight - להשאיר רק ציוד מותר
      const validBodyweightEquipment = ["yoga_mat", "resistance_bands", "trx"];
      const fixedEquipment = [{ id: "yoga_mat", label: "מזרון יוגה" }];

      const updatedQuestionnaire = {
        ...questionnaire,
        answers: {
          ...questionnaire.answers,
          bodyweight_equipment: fixedEquipment,
        },
      };

      const { error: updateNoaError } = await supabase
        .from("users")
        .update({ smartquestionnairedata: updatedQuestionnaire })
        .eq("id", noaUser.id);

      if (updateNoaError) {
        console.error("❌ שגיאה בעדכון נועה:", updateNoaError.message);
      } else {
        console.log("✅ נועה שפירא תוקנה - ציוד: yoga_mat בלבד");
      }
    }

    // תיקון אלון מזרחי - availability, diet_preferences, ציוד gym
    console.log("\n2️⃣ מתקן אלון מזרחי - availability, תזונה וציוד gym");
    console.log("=".repeat(50));

    const { data: alonUser, error: alonError } = await supabase
      .from("users")
      .select("*")
      .eq("email", "alon.mizrahi.updated@outlook.com")
      .single();

    if (alonError) {
      console.error("❌ שגיאה בקבלת אלון:", alonError.message);
    } else {
      const questionnaire = alonUser.smartquestionnairedata;

      // תיקונים:
      // 1. availability: "5_days" -> "5_plus_days"
      // 2. diet_preferences: "high_protein" -> "none_diet"
      // 3. gym_equipment: רק ציוד מותר
      const validGymEquipment = [
        { id: "barbell", label: "מוט ברזל" },
        { id: "dumbbells", label: "משקולות יד" },
        { id: "squat_rack", label: "מתקן סקוואט" },
        { id: "bench", label: "ספסל" },
      ];

      const updatedQuestionnaire = {
        ...questionnaire,
        answers: {
          ...questionnaire.answers,
          availability: "5_plus_days", // תיקון
          diet_preferences: "none_diet", // תיקון
          gym_equipment: validGymEquipment, // תיקון
        },
      };

      const { error: updateAlonError } = await supabase
        .from("users")
        .update({ smartquestionnairedata: updatedQuestionnaire })
        .eq("id", alonUser.id);

      if (updateAlonError) {
        console.error("❌ שגיאה בעדכון אלון:", updateAlonError.message);
      } else {
        console.log("✅ אלון מזרחי תוקן:");
        console.log("   🔄 availability: 5_days -> 5_plus_days");
        console.log("   🔄 diet_preferences: high_protein -> none_diet");
        console.log("   🔄 gym_equipment: ציוד חדר כושר תקין");
      }
    }

    // אימות אחרי התיקון
    console.log("\n🔍 אימות אחרי התיקון:");
    console.log("=".repeat(30));

    const { data: allDemoUsers, error: allError } = await supabase
      .from("users")
      .select("id, name, email, smartquestionnairedata")
      .like("email", "%.updated@%");

    if (allError) {
      console.error("❌ שגיאה בקבלת משתמשים:", allError.message);
      return;
    }

    for (const user of allDemoUsers) {
      console.log(`\n👤 ${user.name}:`);
      const answers = user.smartquestionnairedata?.answers || {};

      // בדיקת שדות עיקריים
      console.log(`   🎯 מטרה: ${answers.fitness_goal}`);
      console.log(`   💪 רמה: ${answers.experience_level}`);
      console.log(`   📅 זמינות: ${answers.availability}`);
      console.log(`   🏠 מיקום: ${answers.workout_location}`);
      console.log(`   🥗 תזונה: ${answers.diet_preferences}`);

      // בדיקת ציוד
      const location = answers.workout_location;
      const equipmentField =
        location === "home_bodyweight"
          ? "bodyweight_equipment"
          : location === "home_equipment"
            ? "home_equipment"
            : location === "gym"
              ? "gym_equipment"
              : null;

      if (equipmentField && answers[equipmentField]) {
        const equipment = answers[equipmentField];
        console.log(
          `   🏋️ ציוד (${equipment.length} פריטים): ${equipment
            .map((e) => e.id || e)
            .join(", ")}`
        );
      }
    }

    console.log("\n✅ תיקון הושלם בהצלחה!");
    console.log("🎯 כל משתמשי הדמו אמורים להיות תואמים כעת");

    return {
      success: true,
      fixedUsers: ["נועה שפירא", "אלון מזרחי"],
      remainingUsers: allDemoUsers.length,
    };
  } catch (error) {
    console.error("❌ שגיאה בתיקון:", error.message);
    throw error;
  }
}

if (require.main === module) {
  fixDemoUsersCompatibility()
    .then((result) => {
      console.log(
        `\n🎉 תיקון הושלם - תוקנו ${result.fixedUsers.length} משתמשים`
      );
      console.log(
        "💡 מומלץ להריץ שוב את validateDemoUsersCompatibility.js לאימות"
      );
    })
    .catch(console.error);
}

module.exports = { fixDemoUsersCompatibility };
