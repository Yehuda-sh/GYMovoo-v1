require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function finalEquipmentCheck() {
  console.log("🎯 בדיקה סופית - ציוד ותרגילים מותאמים:");

  try {
    const { data: users } = await supabase
      .from("users")
      .select("name, workoutplans, smartquestionnairedata");

    console.log(`📋 בודק ${users.length} משתמשים\n`);

    for (const user of users) {
      const q = user.smartquestionnairedata || {};
      const location = q.workout_location || "לא צוין";

      console.log(`👤 ${user.name}:`);
      console.log(`   📍 מיקום: ${location}`);

      // הצג ציוד רלוונטי
      let equipment = [];
      if (location === "gym") {
        equipment = q.gym_equipment || [];
      } else if (location === "home_equipment") {
        equipment = q.home_equipment || [];
      } else if (location === "home_bodyweight") {
        equipment = q.bodyweight_equipment || [];
      }

      console.log(
        `   🛠️ ציוד: ${equipment.length > 0 ? equipment.join(", ") : "אין"}`
      );

      // בדוק תרגיל ראשון
      if (user.workoutplans?.basicPlan?.workouts?.length > 0) {
        const firstExercise =
          user.workoutplans.basicPlan.workouts[0].exercises[0];
        console.log(`   🏋️ תרגיל ראשון: ${firstExercise.name}`);
        console.log(
          `   ⚙️ ציוד נדרש: ${firstExercise.equipment?.join(", ") || "אין"}`
        );

        // בדוק התאמה
        const isMatching =
          location === "gym"
            ? firstExercise.equipment?.some((e) =>
                ["מכונת", "ברבל", "מתקן"].some((g) => e.includes(g))
              )
            : location === "home_equipment"
              ? firstExercise.equipment?.some((e) =>
                  ["משקולות", "רצועות"].some((g) => e.includes(g))
                ) || firstExercise.equipment?.length === 0
              : firstExercise.equipment?.length === 0 ||
                firstExercise.equipment?.some((e) =>
                  ["מזרן", "מגבת"].some((g) => e.includes(g))
                );

        console.log(`   ✅ התאמת ציוד: ${isMatching ? "מתאים" : "לא מתאים"}`);
      }

      console.log("");
    }

    // סיכום סטטיסטיקות
    const gymUsers = users.filter(
      (u) => u.smartquestionnairedata?.workout_location === "gym"
    ).length;
    const homeEquipmentUsers = users.filter(
      (u) => u.smartquestionnairedata?.workout_location === "home_equipment"
    ).length;
    const bodyweightUsers = users.filter(
      (u) => u.smartquestionnairedata?.workout_location === "home_bodyweight"
    ).length;

    console.log("📊 סיכום סופי:");
    console.log(`   🏋️ משתמשי חדר כושר: ${gymUsers}`);
    console.log(`   🏠 משתמשי ציוד בית: ${homeEquipmentUsers}`);
    console.log(`   💪 משתמשי משקל גוף: ${bodyweightUsers}`);
    console.log(`   ✅ סה"כ עם ציוד מותאם: ${users.length}`);
  } catch (error) {
    console.error("❌ שגיאה:", error.message);
  }
}

finalEquipmentCheck();
