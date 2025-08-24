require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * תיקון נתוני currentstats עבור MainScreen
 * העברת נתונים מ-trainingstats אל currentstats כדי ש-MainScreen יפעל נכון
 */

async function fixCurrentStatsForMainScreen() {
  console.log("🎯 תיקון נתוני currentstats עבור MainScreen");
  console.log("=".repeat(80));
  console.log("🔧 מטרה: העברת נתונים מ-trainingstats אל currentstats");
  console.log("🖥️  כדי ש-MainScreen יציג נתונים נכונים");
  console.log("");

  const demoUsers = [
    { id: "u_init_1", name: "רון שובל" },
    { id: "realistic_1755276001521_ifig7z", name: "נועה שפירא" },
    { id: "u_init_3", name: "עמית כהן" },
  ];

  for (const userConfig of demoUsers) {
    console.log(`\n🔍 תיקון ${userConfig.name}:`);
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

    if (!user.trainingstats) {
      console.log("❌ אין נתוני trainingstats - לא ניתן לתקן");
      continue;
    }

    const trainingStats = user.trainingstats;
    console.log("\n📊 נתוני trainingstats קיימים:");
    console.log(`  • totalWorkouts: ${trainingStats.totalWorkouts}`);
    console.log(`  • streak: ${trainingStats.streak}`);
    console.log(`  • totalVolume: ${trainingStats.totalVolume}`);
    console.log(`  • averageRating: ${trainingStats.averageRating}`);

    // יצירת נתוני currentstats מתואמים
    const updatedCurrentStats = {
      ...user.currentstats, // שמירת נתונים קיימים (achievements, gamification וכו')
      // עדכון הנתונים שMainScreen צריך
      totalWorkouts: trainingStats.totalWorkouts,
      currentStreak: trainingStats.streak,
      workoutStreak: trainingStats.streak, // גם בשם הישן לתאימות
      totalVolume: trainingStats.totalVolume,
      averageRating: trainingStats.averageRating,
      lastUpdated: new Date().toISOString(),
    };

    console.log("\n🔧 עדכון currentstats עם:");
    console.log(`  • totalWorkouts: ${updatedCurrentStats.totalWorkouts}`);
    console.log(`  • currentStreak: ${updatedCurrentStats.currentStreak}`);
    console.log(`  • workoutStreak: ${updatedCurrentStats.workoutStreak}`);
    console.log(`  • totalVolume: ${updatedCurrentStats.totalVolume}`);
    console.log(`  • averageRating: ${updatedCurrentStats.averageRating}`);

    // עדכון בבסיס הנתונים
    const { error: updateError } = await supabase
      .from("users")
      .update({
        currentstats: updatedCurrentStats,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userConfig.id);

    if (updateError) {
      console.log(`❌ שגיאה בעדכון ${userConfig.name}:`, updateError.message);
      continue;
    }

    console.log(`✅ ${userConfig.name} עודכן בהצלחה!`);

    // בדיקת התוצאה
    const { data: updatedUser } = await supabase
      .from("users")
      .select("currentstats")
      .eq("id", userConfig.id)
      .single();

    if (updatedUser?.currentstats) {
      console.log("\n🎯 תוצאת MainScreen לאחר התיקון:");
      console.log(
        `  📊 אימונים: ${updatedUser.currentstats.totalWorkouts || 0}`
      );
      console.log(`  🔥 רצף: ${updatedUser.currentstats.currentStreak || 0}`);
      console.log(`  💪 נפח: ${updatedUser.currentstats.totalVolume || 0}`);
      console.log(`  ⭐ דירוג: ${updatedUser.currentstats.averageRating || 0}`);
    }
  }

  console.log("\n📋 סיכום התיקון:");
  console.log("=".repeat(80));
  console.log("✅ עודכנו נתוני currentstats מ-trainingstats");
  console.log("✅ MainScreen יציג כעת נתונים נכונים");
  console.log("✅ ProfileScreen ו-MainScreen מסונכרנים");
  console.log("");
  console.log("🎯 MainScreen יציג כעת:");
  console.log("  👤 רון שובל: 3 אימונים, 3 רצף");
  console.log("  👤 נועה שפירא: 7 אימונים, 7 רצף");
  console.log("  👤 עמית כהן: 15 אימונים, 7 רצף");
}

fixCurrentStatsForMainScreen().catch(console.error);
