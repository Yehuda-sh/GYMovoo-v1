require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function checkGymUser() {
  try {
    const { data: users } = await supabase
      .from("users")
      .select("name, workoutplans, smartquestionnairedata")
      .eq("name", "אלון מזרחי")
      .limit(1);

    const user = users[0];
    console.log(
      "👤 אלון מזרחי - ציוד:",
      JSON.stringify(user.smartquestionnairedata.gym_equipment)
    );
    console.log(
      "📍 מיקום אימון:",
      user.smartquestionnairedata.workout_location
    );

    if (user.workoutplans?.basicPlan?.workouts?.length > 0) {
      const workout = user.workoutplans.basicPlan.workouts[0];
      console.log("\n🏋️ אימון ראשון:", workout.name);
      console.log("📋 תרגילים:");
      workout.exercises.forEach((ex, i) => {
        console.log(`  ${i + 1}. ${ex.name}`);
        console.log(`     🛠️ ציוד: ${ex.equipment?.join(", ") || "אין"}`);
        console.log(
          `     💪 שרירים: ${ex.targetMuscles?.join(", ") || "לא צוין"}`
        );
      });
    }
  } catch (error) {
    console.error("❌ שגיאה:", error.message);
  }
}

checkGymUser();
