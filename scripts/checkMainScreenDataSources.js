require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * בדיקה של מקורות הנתונים השונים שMainScreen משתמש בהם
 * - currentstats (משתמש ב-totalWorkouts, currentStreak, totalVolume)
 * - trainingstats (ProfileScreen משתמש בזה)
 * - activityhistory (נתוני אימונים מפורטים)
 */

async function checkMainScreenDataSources() {
  console.log("🎯 בדיקת מקורות נתונים עבור MainScreen");
  console.log("=".repeat(80));

  const demoUsers = [
    { id: "u_init_1", name: "רון שובל" },
    { id: "realistic_1755276001521_ifig7z", name: "נועה שפירא" },
    { id: "u_init_3", name: "עמית כהן" },
  ];

  for (const userConfig of demoUsers) {
    console.log(`\n🔍 בדיקת ${userConfig.name}:`);
    console.log("=".repeat(50));

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userConfig.id)
      .single();

    if (error || !user) {
      console.log(`❌ שגיאה בטעינת ${userConfig.name}:`, error?.message);
      continue;
    }

    console.log(`✅ משתמש נמצא: ID ${user.id}`);

    // מה שMainScreen צריך מ-currentstats
    console.log("\n📊 Current Stats (MainScreen expects):");
    if (user.currentstats) {
      console.log("  ✅ קיים שדה currentstats:");
      console.log(
        `    • totalWorkouts: ${user.currentstats.totalWorkouts || "❌ חסר"}`
      );
      console.log(
        `    • currentStreak: ${user.currentstats.currentStreak || "❌ חסר"}`
      );
      console.log(
        `    • workoutStreak: ${user.currentstats.workoutStreak || "❌ חסר"}`
      );
      console.log(
        `    • totalVolume: ${user.currentstats.totalVolume || "❌ חסר"}`
      );
      console.log(
        `    • averageRating: ${user.currentstats.averageRating || "❌ חסר"}`
      );
    } else {
      console.log("  ❌ אין שדה currentstats");
    }

    // מה שProfileScreen משתמש ב-trainingstats
    console.log("\n📈 Training Stats (ProfileScreen uses):");
    if (user.trainingstats) {
      console.log("  ✅ קיים שדה trainingstats:");
      console.log(
        `    • totalWorkouts: ${user.trainingstats.totalWorkouts || "❌ חסר"}`
      );
      console.log(`    • streak: ${user.trainingstats.streak || "❌ חסר"}`);
      console.log(
        `    • totalVolume: ${user.trainingstats.totalVolume || "❌ חסר"}`
      );
      console.log(
        `    • averageRating: ${user.trainingstats.averageRating || "❌ חסר"}`
      );
    } else {
      console.log("  ❌ אין שדה trainingstats");
    }

    // נתוני activityhistory
    console.log("\n📅 Activity History:");
    if (user.activityhistory?.workouts) {
      const workouts = user.activityhistory.workouts;
      console.log(`  ✅ יש ${workouts.length} אימונים ב-activityhistory`);
    } else {
      console.log("  ❌ אין נתוני activityhistory");
    }

    // חישוב מה MainScreen יציג
    console.log("\n🖥️  מה MainScreen יציג:");

    // חישוב totalWorkouts של MainScreen
    const activityWorkouts = user.activityhistory?.workouts?.length || 0;
    const currentStatsWorkouts = user.currentstats?.totalWorkouts || 0;
    const mainScreenWorkouts = activityWorkouts || currentStatsWorkouts;

    // חישוב currentStreak של MainScreen
    const currentStreak =
      user.currentstats?.currentStreak || user.currentstats?.workoutStreak || 0;

    console.log(
      `  📊 אימונים: ${mainScreenWorkouts} (activity: ${activityWorkouts}, currentstats: ${currentStatsWorkouts})`
    );
    console.log(`  🔥 רצף: ${currentStreak}`);
    console.log(`  💪 נפח: ${user.currentstats?.totalVolume || 0}`);
    console.log(`  ⭐ דירוג: ${user.currentstats?.averageRating || 0}`);

    // השוואה עם ProfileScreen
    console.log("\n🔍 השוואה עם ProfileScreen:");
    const profileWorkouts = user.trainingstats?.totalWorkouts || 0;
    const profileStreak = user.trainingstats?.streak || 0;

    if (mainScreenWorkouts !== profileWorkouts) {
      console.log(
        `  ⚠️  חוסר התאמה באימונים: MainScreen=${mainScreenWorkouts}, ProfileScreen=${profileWorkouts}`
      );
    } else {
      console.log(`  ✅ אימונים תואמים: ${mainScreenWorkouts}`);
    }

    if (currentStreak !== profileStreak) {
      console.log(
        `  ⚠️  חוסר התאמה ברצף: MainScreen=${currentStreak}, ProfileScreen=${profileStreak}`
      );
    } else {
      console.log(`  ✅ רצף תואם: ${currentStreak}`);
    }
  }

  console.log("\n📋 סיכום בעיות זוהו:");
  console.log("=".repeat(80));
  console.log("🎯 MainScreen משתמש ב-currentstats.totalWorkouts");
  console.log("🎯 ProfileScreen משתמש ב-trainingstats.totalWorkouts");
  console.log("🎯 יכול להיות חוסר התאמה בין המסכים!");
  console.log("🔧 פתרון: לסנכרן את שני המקורות או לאחד אותם");
}

checkMainScreenDataSources().catch(console.error);
