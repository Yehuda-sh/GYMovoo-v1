require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function checkWorkoutDetails() {
  console.log("🔍 בודק פירוט תרגילים באימון:");

  try {
    // קבל משתמש אחד
    const { data: users, error } = await supabase
      .from("users")
      .select("name, workoutplans")
      .limit(1);

    if (error) {
      console.error("❌ שגיאה בקריאת משתמשים:", error);
      return;
    }

    const user = users[0];
    console.log(`\n👤 משתמש: ${user.name}`);

    const plans = user.workoutplans;
    if (plans?.basicPlan?.workouts?.length > 0) {
      const firstWorkout = plans.basicPlan.workouts[0];
      console.log(`\n🏋️ אימון: ${firstWorkout.name}`);
      console.log(`📅 מטרה: ${firstWorkout.goal}`);
      console.log(`⏱️ משך: ${firstWorkout.duration} דקות`);
      console.log(`\n📋 תרגילים (${firstWorkout.exercises?.length || 0}):`);

      if (firstWorkout.exercises) {
        firstWorkout.exercises.forEach((exercise, index) => {
          console.log(`\n  ${index + 1}. ${exercise.name}`);
          console.log(
            `     💪 קבוצת שרירים: ${exercise.targetMuscles?.join(", ") || "לא צוין"}`
          );
          console.log(
            `     🔢 סטים: ${exercise.sets} | חזרות: ${exercise.reps} | מנוחה: ${exercise.rest}s`
          );
          if (exercise.tips?.length > 0) {
            console.log(`     💡 טיפ: ${exercise.tips[0]}`);
          }
          if (exercise.equipment?.length > 0) {
            console.log(`     🛠️ ציוד: ${exercise.equipment.join(", ")}`);
          }
        });
      }
    }

    // בדוק גם תוכנית חכמה
    if (plans?.smartPlan?.workouts?.length > 0) {
      const smartWorkout = plans.smartPlan.workouts[0];
      console.log(`\n\n🤖 תוכנית חכמה - אימון: ${smartWorkout.name}`);
      console.log(`📋 תרגילים (${smartWorkout.exercises?.length || 0}):`);

      if (smartWorkout.exercises) {
        smartWorkout.exercises.slice(0, 3).forEach((exercise, index) => {
          console.log(`\n  ${index + 1}. ${exercise.name}`);
          console.log(
            `     🔢 סטים: ${exercise.sets} | חזרות: ${exercise.reps} | מנוחה: ${exercise.rest}s`
          );
        });
      }
    }
  } catch (error) {
    console.error("❌ שגיאה:", error.message);
  }
}

checkWorkoutDetails();
