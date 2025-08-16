/**
 * @file checkWorkoutPlansData.js
 * @description בדיקת נתוני תוכניות אימון למשתמשים קיימים
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function checkWorkoutPlansData() {
  console.log("🔍 בודק נתוני תוכניות אימון למשתמשים:\n");

  try {
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("❌ שגיאה:", error.message);
      return;
    }

    let usersWithPlans = 0;
    let usersWithoutPlans = 0;

    users.forEach((user) => {
      console.log(`👤 ${user.name}:`);

      const workoutplans = user.workoutplans;
      if (workoutplans && Object.keys(workoutplans).length > 0) {
        console.log(`   📋 יש תוכניות:`, workoutplans);
        usersWithPlans++;
      } else {
        console.log("   ❌ אין תוכניות אימון");
        usersWithoutPlans++;
      }

      console.log("");
    });

    console.log("📊 סיכום:");
    console.log(`   ✅ עם תוכניות: ${usersWithPlans}`);
    console.log(`   ❌ בלי תוכניות: ${usersWithoutPlans}`);
    console.log(`   📊 סה"כ: ${users.length}`);
  } catch (error) {
    console.error("❌ שגיאה כללית:", error);
  }
}

checkWorkoutPlansData();
