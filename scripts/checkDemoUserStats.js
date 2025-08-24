/**
 * @fileoverview בדיקת נתוני סטטיסטיקות של משתמשי דמו
 * @description בדיקה מפורטת של נתוני trainingstats ו-activityhistory למשתמשי דמו
 * @date 2025-08-17
 */

const { createClient } = require("@supabase/supabase-js");

// Supabase configuration
const supabaseUrl = "https://emcmmkyfwgrmkitduwvb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtY21ta3lmd2dybWtpdGR1d3ZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMyMDg3NjgsImV4cCI6MjAzODc4NDc2OH0.HCLA6vkBkXMQ5tpNmfLqLV1Ly97V79WUc2m7fnVp3FY";

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Demo users list
const DEMO_USERS = [
  { email: "noa.shapira@example.com", name: "נועה שפירא" },
  { email: "ron.shoval@example.com", name: "רון שובל" },
  { email: "dani.cohen@example.com", name: "דני כהן" },
];

/**
 * בדיקת נתוני סטטיסטיקות עבור משתמש בודד
 */
async function checkUserStats(userEmail, userName) {
  console.log(`\n🔍 בדיקת סטטיסטיקות עבור: ${userName} (${userEmail})`);
  console.log("=".repeat(60));

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", userEmail)
      .single();

    if (error) {
      console.error(`❌ שגיאה בשליפת נתוני ${userName}:`, error.message);
      return;
    }

    if (!user) {
      console.log(`⚠️  משתמש ${userName} לא נמצא`);
      return;
    }

    console.log(`✅ משתמש נמצא: ${user.name || "ללא שם"}`);

    // בדיקת trainingstats
    console.log("\n📊 נתוני Training Stats:");
    if (user.trainingstats) {
      const stats = user.trainingstats;
      console.log("  📈 נתונים זמינים:");
      console.log(`    • totalWorkouts: ${stats.totalWorkouts || "לא קיים"}`);
      console.log(`    • streak: ${stats.streak || "לא קיים"}`);
      console.log(`    • totalMinutes: ${stats.totalMinutes || "לא קיים"}`);
      console.log(
        `    • totalDurationMinutes: ${stats.totalDurationMinutes || "לא קיים"}`
      );
      console.log(`    • totalHours: ${stats.totalHours || "לא קיים"}`);
      console.log(`    • xp: ${stats.xp || "לא קיים"}`);
      console.log(`    • level: ${stats.level || "לא קיים"}`);
      console.log(
        `    • selectedEquipment: ${stats.selectedEquipment ? JSON.stringify(stats.selectedEquipment) : "לא קיים"}`
      );

      // בדיקת כל השדות
      const allFields = Object.keys(stats);
      console.log(`  🔧 סה"כ שדות ב-trainingstats: ${allFields.length}`);
      console.log(`    שדות: ${allFields.join(", ")}`);
    } else {
      console.log("  ❌ אין נתוני trainingstats");
    }

    // בדיקת activityhistory
    console.log("\n📅 נתוני Activity History:");
    if (user.activityhistory) {
      const history = user.activityhistory;
      console.log("  📋 נתונים זמינים:");

      if (history.workouts) {
        console.log(
          `    • workouts: ${Array.isArray(history.workouts) ? history.workouts.length + " אימונים" : "קיים אבל לא מערך"}`
        );
        if (Array.isArray(history.workouts) && history.workouts.length > 0) {
          console.log("    📝 דוגמת אימון ראשון:");
          const firstWorkout = history.workouts[0];
          console.log(`      - תאריך: ${firstWorkout.date || "לא קיים"}`);
          console.log(`      - משך: ${firstWorkout.duration || "לא קיים"}`);
          console.log(
            `      - תרגילים: ${firstWorkout.exercises ? firstWorkout.exercises.length : "לא קיים"}`
          );
        }
      } else {
        console.log("    ❌ אין נתוני workouts");
      }

      // בדיקת שדות נוספים
      const historyFields = Object.keys(history);
      console.log(`  🔧 סה"כ שדות ב-activityhistory: ${historyFields.length}`);
      console.log(`    שדות: ${historyFields.join(", ")}`);
    } else {
      console.log("  ❌ אין נתוני activityhistory");
    }

    // סימולציה של חישוב הסטטיסטיקות כמו ב-ProfileScreen
    console.log("\n🧮 חישוב סטטיסטיקות (כמו ב-ProfileScreen):");

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
      // חישוב רצף פשוט
      computedStreak = computedWorkouts > 0 ? 1 : 0;
      // חישוב זמן כולל
      computedTotalMinutes = user.activityhistory.workouts.reduce(
        (total, workout) => {
          return total + (workout.duration || 0);
        },
        0
      );
    }

    // עדיפות לערכי שרת
    const finalWorkouts =
      typeof serverStats.totalWorkouts === "number"
        ? serverStats.totalWorkouts
        : computedWorkouts;
    const finalStreak =
      typeof serverStats.streak === "number"
        ? serverStats.streak
        : computedStreak;

    let finalTotalMinutes;
    if (typeof serverStats.totalMinutes === "number") {
      finalTotalMinutes = serverStats.totalMinutes;
    } else if (typeof serverStats.totalDurationMinutes === "number") {
      finalTotalMinutes = serverStats.totalDurationMinutes;
    } else if (typeof serverStats.totalHours === "number") {
      finalTotalMinutes = serverStats.totalHours * 60;
    } else {
      finalTotalMinutes = computedTotalMinutes;
    }

    const finalTotalHours = Math.floor(finalTotalMinutes / 60);

    console.log("  📊 תוצאות סופיות:");
    console.log(`    • אימונים: ${finalWorkouts}`);
    console.log(`    • רצף: ${finalStreak} ימים`);
    console.log(
      `    • זמן כולל: ${finalTotalHours}h (${finalTotalMinutes} דקות)`
    );

    // בדיקת נתוני subscription
    console.log("\n💎 נתוני Subscription:");
    if (user.subscription) {
      console.log(
        `  ✅ יש נתוני subscription: ${JSON.stringify(user.subscription)}`
      );
    } else {
      console.log("  ❌ אין נתוני subscription");
    }
  } catch (error) {
    console.error(`❌ שגיאה בבדיקת ${userName}:`, error);
  }
}

/**
 * בדיקה מקיפה של כל משתמשי הדמו
 */
async function checkAllDemoUsersStats() {
  console.log("🎯 בדיקת נתוני סטטיסטיקות למשתמשי דמו");
  console.log("=".repeat(80));

  for (const user of DEMO_USERS) {
    await checkUserStats(user.email, user.name);
  }

  console.log("\n📋 סיכום כללי:");
  console.log("=".repeat(60));
  console.log("🔍 מה נבדק:");
  console.log("  • נתוני trainingstats (מקור עיקרי לסטטיסטיקות)");
  console.log("  • נתוני activityhistory (מקור חלופי)");
  console.log("  • חישוב סטטיסטיקות כמו ב-ProfileScreen");
  console.log("  • נתוני subscription");
  console.log("\n💡 הערות:");
  console.log(
    "  • ProfileScreen מעדיף נתוני שרת (trainingstats) על פני חישוב מקומי"
  );
  console.log("  • ללא נתונים אלה, הסטטיסטיקות יהיו 0");
  console.log("  • צריך להוסיף נתוני אימונים דמו או לייצר סטטיסטיקות בסיסיות");
}

// הרצת הבדיקה
checkAllDemoUsersStats()
  .then(() => {
    console.log("\n✅ בדיקה הושלמה");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ שגיאה בהרצת הבדיקה:", error);
    process.exit(1);
  });
