require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * סיכום כל מקורות הנתונים והבעיות בפרויקט
 */

async function analyzeAllDataSources() {
  console.log("🎯 ניתוח מקיף של מקורות הנתונים במערכת");
  console.log("=".repeat(80));

  const demoUsers = [
    { id: "u_init_1", name: "רון שובל" },
    { id: "realistic_1755276001521_ifig7z", name: "נועה שפירא" },
    { id: "u_init_3", name: "עמית כהן" },
  ];

  console.log("📋 מקורות נתונים שנמצאו בקוד:");
  console.log("  1️⃣  trainingstats - נתוני אימון (ProfileScreen עיקרי)");
  console.log("  2️⃣  currentstats - נתונים נוכחיים (MainScreen)");
  console.log("  3️⃣  activityhistory - היסטוריית אימונים מפורטת");
  console.log("  4️⃣  currentstats.gamification - נתוני גיימיפיקציה");
  console.log("");

  const findings = {
    trainingstats: { exists: 0, missing: 0 },
    currentstats: { exists: 0, missing: 0 },
    activityhistory: { exists: 0, missing: 0 },
    gamification: { exists: 0, missing: 0 },
    inconsistencies: [],
  };

  for (const userConfig of demoUsers) {
    console.log(`\n🔍 ניתוח ${userConfig.name}:`);
    console.log("-".repeat(50));

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userConfig.id)
      .single();

    if (error || !user) {
      console.log(`❌ שגיאה בטעינת ${userConfig.name}:`, error?.message);
      continue;
    }

    // בדיקת trainingstats
    if (user.trainingstats?.totalWorkouts) {
      console.log(
        `  ✅ trainingstats: ${user.trainingstats.totalWorkouts} אימונים`
      );
      findings.trainingstats.exists++;
    } else {
      console.log("  ❌ trainingstats: חסר או ריק");
      findings.trainingstats.missing++;
    }

    // בדיקת currentstats
    if (user.currentstats?.totalWorkouts) {
      console.log(
        `  ✅ currentstats: ${user.currentstats.totalWorkouts} אימונים`
      );
      findings.currentstats.exists++;
    } else {
      console.log("  ❌ currentstats: חסר שדה totalWorkouts");
      findings.currentstats.missing++;
    }

    // בדיקת activityhistory
    const activityWorkouts = user.activityhistory?.workouts?.length || 0;
    if (activityWorkouts > 0) {
      console.log(`  ✅ activityhistory: ${activityWorkouts} אימונים מפורטים`);
      findings.activityhistory.exists++;
    } else {
      console.log("  ❌ activityhistory: ריק או חסר");
      findings.activityhistory.missing++;
    }

    // בדיקת gamification
    if (user.currentstats?.gamification?.workouts_completed) {
      console.log(
        `  ✅ gamification: ${user.currentstats.gamification.workouts_completed} אימונים`
      );
      findings.gamification.exists++;
    } else {
      console.log("  ❌ gamification: חסר או ריק");
      findings.gamification.missing++;
    }

    // בדיקת inconsistencies
    const sources = {
      trainingstats: user.trainingstats?.totalWorkouts || 0,
      currentstats: user.currentstats?.totalWorkouts || 0,
      activityhistory: activityWorkouts,
      gamification: user.currentstats?.gamification?.workouts_completed || 0,
    };

    const values = Object.values(sources).filter((v) => v > 0);
    const uniqueValues = [...new Set(values)];

    if (uniqueValues.length > 1) {
      findings.inconsistencies.push({
        user: userConfig.name,
        sources: sources,
      });
      console.log("  ⚠️  חוסר התאמה במקורות:", sources);
    } else {
      console.log("  ✅ כל המקורות מסונכרנים");
    }
  }

  console.log("\n📊 סיכום כללי:");
  console.log("=".repeat(80));
  console.log(
    `📈 trainingstats: ${findings.trainingstats.exists}/${findings.trainingstats.exists + findings.trainingstats.missing} משתמשים`
  );
  console.log(
    `📊 currentstats: ${findings.currentstats.exists}/${findings.currentstats.exists + findings.currentstats.missing} משתמשים`
  );
  console.log(
    `📅 activityhistory: ${findings.activityhistory.exists}/${findings.activityhistory.exists + findings.activityhistory.missing} משתמשים`
  );
  console.log(
    `🎮 gamification: ${findings.gamification.exists}/${findings.gamification.exists + findings.gamification.missing} משתמשים`
  );

  console.log("\n⚠️  בעיות שזוהו:");
  console.log("-".repeat(50));

  if (findings.inconsistencies.length > 0) {
    console.log("🔴 חוסר התאמה במקורות נתונים:");
    findings.inconsistencies.forEach((inc) => {
      console.log(`   ${inc.user}: ${JSON.stringify(inc.sources)}`);
    });
  }

  if (findings.activityhistory.missing > 0) {
    console.log("🟡 חסרים נתוני activityhistory (אימונים מפורטים)");
    console.log("   → MainScreen עשוי לא להציג אימונים אחרונים");
    console.log("   → מערכת הישגים עשויה לא לעבוד");
  }

  console.log("\n🎯 מה שכל מסך משתמש:");
  console.log("-".repeat(50));
  console.log("📱 ProfileScreen: trainingstats.totalWorkouts");
  console.log(
    "📱 MainScreen StatCard: activityhistory.workouts.length || currentstats.totalWorkouts"
  );
  console.log(
    "📱 MainScreen Recent: activityhistory.workouts (ריק = אין תצוגה)"
  );
  console.log("📱 Achievements: activityhistory.workouts");
  console.log("📱 QuestionnaireService: activityhistory.workouts");

  console.log("\n🔧 המלצות לתיקון:");
  console.log("-".repeat(50));
  console.log("1. ✅ תוקן: ProfileScreen (trainingstats)");
  console.log("2. ✅ תוקן: MainScreen StatCard (currentstats)");
  console.log(
    "3. 🔴 צריך תיקון: activityhistory ריק - MainScreen Recent לא עובד"
  );
  console.log("4. 🔴 צריך תיקון: Achievements לא יעבוד ללא activityhistory");
  console.log("5. 💡 האם להעביר הכל ל-trainingstats כמקור אמת יחיד?");
}

analyzeAllDataSources().catch(console.error);
