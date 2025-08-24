/**
 * @fileoverview העברת נתוני סטטיסטיקות מ-currentstats ל-trainingstats
 * @description תיקון בעיית הצגת סטטיסטיקות ב-ProfileScreen למשתמשי דמו
 * @date 2025-08-17
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ חסרים נתוני Supabase ב-.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Demo users list
const DEMO_USERS = [
  { email: "ron.shoval@example.com", name: "רון שובל" },
  { email: "noa.shapira.updated@walla.com", name: "נועה שפירא" },
  { email: "amit.cohen@example.com", name: "עמית כהן" },
];

/**
 * תיקון נתוני סטטיסטיקות עבור משתמש יחיד
 */
async function fixUserStats(userEmail, userName) {
  console.log(`\n🔧 תיקון סטטיסטיקות עבור: ${userName}`);
  console.log("=".repeat(50));

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", userEmail)
      .single();

    if (error) {
      console.error(`❌ שגיאה: ${error.message}`);
      return false;
    }

    if (!user) {
      console.log(`⚠️  משתמש לא נמצא`);
      return false;
    }

    console.log(`✅ משתמש נמצא: ID ${user.id}`);

    // בדיקת נתוני currentstats
    if (!user.currentstats?.gamification) {
      console.log("❌ אין נתוני currentstats.gamification - לא ניתן לתקן");
      return false;
    }

    const gamification = user.currentstats.gamification;
    console.log("\n📊 נתוני currentstats.gamification:");
    console.log(`  • workouts_completed: ${gamification.workouts_completed}`);
    console.log(`  • current_streak: ${gamification.current_streak}`);
    console.log(
      `  • total_duration_minutes: ${gamification.total_duration_minutes}`
    );
    console.log(`  • level: ${gamification.level}`);
    console.log(`  • experience_points: ${gamification.experience_points}`);

    // יצירת נתוני trainingstats מתואמים לפורמט שה-ProfileScreen מצפה לו
    const updatedTrainingStats = {
      ...user.trainingstats, // שמירת נתונים קיימים
      // השדות שה-ProfileScreen מחפש:
      totalWorkouts: gamification.workouts_completed,
      streak: gamification.current_streak,
      totalMinutes: gamification.total_duration_minutes,
      totalHours: Math.floor(gamification.total_duration_minutes / 60),
      xp: gamification.experience_points,
      level: gamification.level,
      lastWorkoutDate: gamification.last_workout_date,
    };

    console.log("\n🔄 עדכון trainingstats:");
    console.log(`  • totalWorkouts: ${updatedTrainingStats.totalWorkouts}`);
    console.log(`  • streak: ${updatedTrainingStats.streak}`);
    console.log(`  • totalMinutes: ${updatedTrainingStats.totalMinutes}`);
    console.log(`  • totalHours: ${updatedTrainingStats.totalHours}`);
    console.log(`  • xp: ${updatedTrainingStats.xp}`);
    console.log(`  • level: ${updatedTrainingStats.level}`);

    // עדכון בבסיס הנתונים
    const { error: updateError } = await supabase
      .from("users")
      .update({ trainingstats: updatedTrainingStats })
      .eq("id", user.id);

    if (updateError) {
      console.error(`❌ שגיאה בעדכון: ${updateError.message}`);
      return false;
    }

    console.log("✅ עדכון בוצע בהצלחה!");

    // בדיקת התוצאה - מה ProfileScreen יראה כעת
    const finalTotalHours = Math.floor(updatedTrainingStats.totalMinutes / 60);
    console.log("\n🖥️  מה ProfileScreen יציג כעת:");
    console.log(`  🏃 אימונים: ${updatedTrainingStats.totalWorkouts}`);
    console.log(`  🔥 רצף: ${updatedTrainingStats.streak} ימים`);
    console.log(`  ⏱️  זמן כולל: ${finalTotalHours}h`);

    return true;
  } catch (error) {
    console.error(`❌ שגיאה בתיקון ${userName}:`, error);
    return false;
  }
}

/**
 * תיקון סטטיסטיקות עבור כל משתמשי הדמו
 */
async function fixAllDemoUsersStats() {
  console.log("🔧 תיקון נתוני סטטיסטיקות למשתמשי דמו");
  console.log("=".repeat(80));
  console.log(
    "🎯 מטרה: העברת נתונים מ-currentstats.gamification ל-trainingstats"
  );
  console.log("🔄 כדי שהסטטיסטיקות יוצגו נכון ב-ProfileScreen");

  const results = [];

  for (const demoUser of DEMO_USERS) {
    const success = await fixUserStats(demoUser.email, demoUser.name);
    results.push({
      user: demoUser.name,
      email: demoUser.email,
      success,
    });
  }

  console.log("\n📋 סיכום תיקונים:");
  console.log("=".repeat(80));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✅ תוקנו בהצלחה: ${successful.length}/${results.length}`);
  console.log(`❌ נכשלו: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    console.log("\n✅ משתמשים שתוקנו:");
    successful.forEach((user) => {
      console.log(`  • ${user.user}`);
    });
  }

  if (failed.length > 0) {
    console.log("\n❌ משתמשים שלא תוקנו:");
    failed.forEach((user) => {
      console.log(`  • ${user.user} (${user.email})`);
    });
  }

  console.log("\n💡 לאחר התיקון:");
  console.log("  🔄 הסטטיסטיקות יוצגו נכון ב-ProfileScreen");
  console.log("  📊 יוצגו מספר אימונים, רצף וזמן כולל מדויקים");
  console.log("  🎮 הנתונים ב-currentstats נשמרו כפי שהיו");

  return results;
}

// הרצת התיקון
fixAllDemoUsersStats()
  .then((results) => {
    const allSuccessful = results.every((r) => r.success);
    console.log(`\n${allSuccessful ? "✅" : "⚠️"} תיקון הושלם`);
    process.exit(allSuccessful ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ שגיאה בתיקון:", error);
    process.exit(1);
  });
