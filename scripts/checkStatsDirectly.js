/**
 * @fileoverview בדיקה ישירה של נתוני סטטיסטיקות משתמשי דמו
 * @description בדיקה מפורטת מה למשתמשים יש ומה חסר עבור ProfileScreen
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
 * בדיקת נתוני משתמש יחיד
 */
async function checkUserDirectly(userEmail, userName) {
  console.log(`\n🔍 בדיקת ${userName}:`);
  console.log("=".repeat(50));

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", userEmail)
      .single();

    if (error) {
      console.error(`❌ שגיאה: ${error.message}`);
      return;
    }

    if (!user) {
      console.log(`⚠️  משתמש לא נמצא`);
      return;
    }

    console.log(`✅ משתמש נמצא: ID ${user.id}`);

    // בדיקת trainingstats
    console.log("\n📊 Training Stats:");
    if (user.trainingstats) {
      const stats = user.trainingstats;
      console.log("  ✅ קיים שדה trainingstats:");
      Object.keys(stats).forEach((key) => {
        console.log(`    • ${key}: ${stats[key]}`);
      });
    } else {
      console.log("  ❌ אין שדה trainingstats");
    }

    // בדיקת activityhistory
    console.log("\n📅 Activity History:");
    if (user.activityhistory) {
      const history = user.activityhistory;
      console.log("  ✅ קיים שדה activityhistory:");
      Object.keys(history).forEach((key) => {
        const value = history[key];
        if (Array.isArray(value)) {
          console.log(`    • ${key}: ${value.length} פריטים`);
        } else {
          console.log(`    • ${key}: ${JSON.stringify(value)}`);
        }
      });
    } else {
      console.log("  ❌ אין שדה activityhistory");
    }

    // בדיקת currentstats
    console.log("\n🎮 Current Stats:");
    if (user.currentstats) {
      const current = user.currentstats;
      console.log("  ✅ קיים שדה currentstats:");
      Object.keys(current).forEach((key) => {
        const value = current[key];
        if (typeof value === "object" && value !== null) {
          console.log(`    • ${key}:`);
          Object.keys(value).forEach((subKey) => {
            console.log(`      - ${subKey}: ${value[subKey]}`);
          });
        } else {
          console.log(`    • ${key}: ${value}`);
        }
      });
    } else {
      console.log("  ❌ אין שדה currentstats");
    }

    // חישוב מה ProfileScreen יראה
    console.log("\n🖥️  מה ProfileScreen יחשב:");
    const serverStats = user.trainingstats || {};

    // חישוב מקומי מהיסטוריית אימונים
    let computedWorkouts = 0;
    let computedStreak = 0;
    let computedTotalMinutes = 0;

    if (
      user.activityhistory?.workouts &&
      Array.isArray(user.activityhistory.workouts)
    ) {
      computedWorkouts = user.activityhistory.workouts.length;
      computedStreak = computedWorkouts > 0 ? 1 : 0;
      computedTotalMinutes = user.activityhistory.workouts.reduce(
        (total, workout) => {
          return total + (workout.duration || 0);
        },
        0
      );
      console.log(
        `  📊 מחישוב activityhistory: ${computedWorkouts} אימונים, ${computedTotalMinutes} דקות`
      );
    } else {
      console.log("  📊 אין activityhistory לחישוב");
    }

    // תוצאות סופיות
    const finalWorkouts =
      typeof serverStats.totalWorkouts === "number"
        ? serverStats.totalWorkouts
        : computedWorkouts;
    const finalStreak =
      typeof serverStats.streak === "number"
        ? serverStats.streak
        : computedStreak;
    const finalTotalMinutes =
      serverStats.totalMinutes ||
      serverStats.totalDurationMinutes ||
      (serverStats.totalHours
        ? serverStats.totalHours * 60
        : computedTotalMinutes);
    const finalTotalHours = Math.floor(finalTotalMinutes / 60);

    console.log(`  🎯 תוצאות ב-ProfileScreen:`);
    console.log(`    • אימונים: ${finalWorkouts}`);
    console.log(`    • רצף: ${finalStreak} ימים`);
    console.log(`    • זמן כולל: ${finalTotalHours}h`);

    return {
      user: userName,
      hasTrainingStats: !!user.trainingstats,
      hasActivityHistory: !!user.activityhistory?.workouts,
      hasCurrentStats: !!user.currentstats,
      profileScreenStats: {
        workouts: finalWorkouts,
        streak: finalStreak,
        totalHours: finalTotalHours,
      },
    };
  } catch (error) {
    console.error(`❌ שגיאה בבדיקת ${userName}:`, error);
    return null;
  }
}

/**
 * בדיקה מקיפה של כל משתמשי הדמו
 */
async function checkAllUsersDirectly() {
  console.log("🎯 בדיקה ישירה של נתוני סטטיסטיקות");
  console.log("=".repeat(80));

  const results = [];

  for (const demoUser of DEMO_USERS) {
    const result = await checkUserDirectly(demoUser.email, demoUser.name);
    if (result) {
      results.push(result);
    }
  }

  console.log("\n📋 סיכום כללי:");
  console.log("=".repeat(80));

  const withTrainingStats = results.filter((r) => r.hasTrainingStats);
  const withActivityHistory = results.filter((r) => r.hasActivityHistory);
  const withCurrentStats = results.filter((r) => r.hasCurrentStats);

  console.log(
    `📈 משתמשים עם trainingstats: ${withTrainingStats.length}/${results.length}`
  );
  console.log(
    `📅 משתמשים עם activityhistory: ${withActivityHistory.length}/${results.length}`
  );
  console.log(
    `🎮 משתמשים עם currentstats: ${withCurrentStats.length}/${results.length}`
  );

  console.log("\n🖥️  מה ProfileScreen יציג עבור כל משתמש:");
  results.forEach((result) => {
    const stats = result.profileScreenStats;
    console.log(
      `  👤 ${result.user}: ${stats.workouts} אימונים, ${stats.streak} רצף, ${stats.totalHours}h`
    );
  });

  if (withTrainingStats.length === 0 && withActivityHistory.length === 0) {
    console.log("\n❌ הבעיה נמצאה!");
    console.log(
      "💡 אף משתמש דמו אין לו נתוני trainingstats או activityhistory"
    );
    console.log("🔧 זאת הסיבה שכל הסטטיסטיקות מציגות 0 ב-ProfileScreen");
    console.log("\n🔧 פתרונות אפשריים:");
    console.log("  1. העברת נתונים מ-currentstats ל-trainingstats");
    console.log("  2. יצירת נתוני activityhistory.workouts");
    console.log("  3. עדכון ProfileScreen לקרוא מ-currentstats");
  }

  return results;
}

// הרצת הבדיקה
checkAllUsersDirectly()
  .then((results) => {
    console.log("\n✅ בדיקה הושלמה בהצלחה");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ שגיאה בבדיקה:", error);
    process.exit(1);
  });
