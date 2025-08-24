const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function scanSupabaseStructure() {
  console.log("🔍 סורק מבנה בסיס הנתונים...\n");

  try {
    // 1. בדיקת טבלאות משתמשים
    console.log("📊 1. טבלת Users:");
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*")
      .limit(10);

    if (usersError) {
      console.log("❌ שגיאה בטבלת users:", usersError.message);
    } else {
      console.log(`✅ נמצאו ${users?.length || 0} משתמשים`);
      users?.forEach((user) => {
        console.log(`  - ID: ${user.id}`);
        console.log(`    Email: ${user.email || "לא קיים"}`);
        console.log(`    Name: ${user.name || "לא קיים"}`);
        console.log(
          `    Subscription: ${user.subscription?.type || "לא קיים"}`
        );
        console.log(`    Created: ${user.created_at || "לא קיים"}`);
        console.log("    ---");
      });
    }

    // 2. בדיקת טבלת workout_plans
    console.log("\n📊 2. טבלת Workout Plans:");
    const { data: workoutPlans, error: plansError } = await supabase
      .from("workout_plans")
      .select("*")
      .limit(5);

    if (plansError) {
      console.log("❌ שגיאה בטבלת workout_plans:", plansError.message);
    } else {
      console.log(`✅ נמצאו ${workoutPlans?.length || 0} תוכניות אימון`);
      workoutPlans?.forEach((plan) => {
        console.log(`  - ID: ${plan.id}`);
        console.log(`    User ID: ${plan.user_id}`);
        console.log(`    Name: ${plan.name}`);
        console.log(`    Type: ${plan.type}`);
        console.log(`    Created: ${plan.created_at}`);
        console.log("    ---");
      });
    }

    // 3. בדיקת טבלת workout_history
    console.log("\n📊 3. טבלת Workout History:");
    const { data: workoutHistory, error: historyError } = await supabase
      .from("workout_history")
      .select("*")
      .limit(5);

    if (historyError) {
      console.log("❌ שגיאה בטבלת workout_history:", historyError.message);
    } else {
      console.log(`✅ נמצאו ${workoutHistory?.length || 0} רשומות היסטוריה`);
      workoutHistory?.forEach((record) => {
        console.log(`  - ID: ${record.id}`);
        console.log(`    User ID: ${record.user_id}`);
        console.log(`    Workout Date: ${record.workout_date}`);
        console.log(`    Duration: ${record.duration_minutes} דקות`);
        console.log("    ---");
      });
    }

    // 4. בדיקת טבלת achievements
    console.log("\n📊 4. טבלת Achievements:");
    const { data: achievements, error: achievementsError } = await supabase
      .from("achievements")
      .select("*")
      .limit(5);

    if (achievementsError) {
      console.log("❌ שגיאה בטבלת achievements:", achievementsError.message);
    } else {
      console.log(`✅ נמצאו ${achievements?.length || 0} הישגים`);
      achievements?.forEach((achievement) => {
        console.log(`  - ID: ${achievement.id}`);
        console.log(`    User ID: ${achievement.user_id}`);
        console.log(`    Type: ${achievement.achievement_type}`);
        console.log(`    Unlocked: ${achievement.unlocked_at}`);
        console.log("    ---");
      });
    }

    // 5. בדיקת טבלת gamification_state
    console.log("\n📊 5. טבלת Gamification State:");
    const { data: gamificationState, error: gamificationError } = await supabase
      .from("gamification_state")
      .select("*")
      .limit(5);

    if (gamificationError) {
      console.log(
        "❌ שגיאה בטבלת gamification_state:",
        gamificationError.message
      );
    } else {
      console.log(
        `✅ נמצאו ${gamificationState?.length || 0} מצבי גיימיפיקציה`
      );
      gamificationState?.forEach((state) => {
        console.log(`  - User ID: ${state.user_id}`);
        console.log(`    Level: ${state.level}`);
        console.log(`    XP: ${state.experience_points}`);
        console.log(`    Workouts Completed: ${state.workouts_completed}`);
        console.log("    ---");
      });
    }

    // 6. סיכום מבנה טבלאות
    console.log("\n📋 6. מבנה טבלאות (Schema):");
    await describeTableSchema("users");
    await describeTableSchema("workout_plans");
    await describeTableSchema("workout_history");
    await describeTableSchema("achievements");
    await describeTableSchema("gamification_state");
  } catch (error) {
    console.error("❌ שגיאה כללית:", error);
  }
}

async function describeTableSchema(tableName) {
  try {
    console.log(`\n🔧 Schema של טבלה: ${tableName}`);

    // ניסיון לקבל מידע על המבנה דרך query ריק
    const { data, error } = await supabase.from(tableName).select("*").limit(0);

    if (error) {
      console.log(`❌ לא ניתן לגשת לטבלה ${tableName}: ${error.message}`);
    } else {
      console.log(`✅ טבלה ${tableName} נגישה`);
    }
  } catch (error) {
    console.log(`❌ שגיאה בבדיקת schema של ${tableName}:`, error.message);
  }
}

// הרצה
scanSupabaseStructure()
  .then(() => {
    console.log("\n✅ סריקה הושלמה בהצלחה!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ שגיאה בסריקה:", error);
    process.exit(1);
  });
