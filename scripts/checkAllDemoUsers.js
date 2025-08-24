/**
 * @file scripts/checkAllDemoUsers.js
 * @description בדיקת כל משתמשי הדמו לוודא שהנתונים שלהם תקינים
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

// משתמשי הדמו
const DEMO_USERS = [
  {
    id: "u_init_1",
    name: "Ron Shoval",
    type: "FREE",
    email: "ron.shoval@example.com",
  },
  {
    id: "realistic_1755276001521_ifig7z",
    name: "נועה שפירא",
    type: "TRIAL",
    email: "noa.shapira.updated@walla.com",
  },
  {
    id: "u_init_3",
    name: "Amit Cohen",
    type: "PREMIUM",
    email: "amit.cohen@example.com",
  },
];

/**
 * בדיקת משתמש בודד
 */
async function checkDemoUser(userConfig) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🔍 בדיקת ${userConfig.name} (${userConfig.type})`);
  console.log(`🆔 ID: ${userConfig.id}`);
  console.log(`📧 Email: ${userConfig.email}`);
  console.log(`${"=".repeat(60)}`);

  try {
    // שליפת נתוני המשתמש
    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userConfig.id)
      .single();

    if (error) {
      console.error(`❌ שגיאה בשליפת ${userConfig.name}:`, error.message);
      return {
        user: userConfig.name,
        status: "ERROR",
        issues: ["Database error"],
      };
    }

    if (!userData) {
      console.log(`❌ ${userConfig.name} לא נמצא במסד הנתונים`);
      return {
        user: userConfig.name,
        status: "MISSING",
        issues: ["User not found"],
      };
    }

    const issues = [];
    const details = {};

    // בדיקת questionnaire
    console.log("\n📋 בדיקת שאלון:");
    if (!userData.questionnaire) {
      console.log("❌ אין נתוני questionnaire");
      issues.push("Missing questionnaire data");
    } else {
      const completionRate =
        userData.smartquestionnairedata?.metadata?.completionRate || 0;
      const questionsAnswered =
        userData.smartquestionnairedata?.metadata?.questionsAnswered || 0;
      const hasCompleteFlag = userData.questionnaire?.completed === true;

      // אם יש 13 שאלות ו-completed flag, זה שאלון מושלם
      const isComplete = hasCompleteFlag && questionsAnswered === 13;
      const actualCompletionRate = isComplete ? 100 : completionRate;

      console.log(`✅ יש questionnaire (השלמה: ${actualCompletionRate}%)`);
      console.log(`📊 שאלות שנענו: ${questionsAnswered}/13`);
      console.log(`🔄 completed flag: ${hasCompleteFlag}`);

      if (!isComplete) {
        issues.push(`Incomplete questionnaire: ${actualCompletionRate}%`);
      }

      details.questionnaire = {
        completed: isComplete,
        completionRate: actualCompletionRate,
        questionsAnswered,
      };
    }

    // בדיקת activityhistory
    console.log("\n🏃 בדיקת היסטוריית אימונים:");
    if (!userData.activityhistory || !Array.isArray(userData.activityhistory)) {
      console.log("❌ אין היסטוריית אימונים");
      issues.push("Missing workout history");
      details.workouts = { count: 0, valid: false };
    } else {
      const workoutCount = userData.activityhistory.length;
      console.log(`✅ יש ${workoutCount} אימונים`);

      // בדיקת תקינות האימונים
      const validWorkouts = userData.activityhistory.filter(
        (w) => w.workout && w.workout.exercises && w.stats
      );

      if (validWorkouts.length !== workoutCount) {
        issues.push(
          `Invalid workout data: ${validWorkouts.length}/${workoutCount} valid`
        );
      }

      details.workouts = {
        count: workoutCount,
        valid: validWorkouts.length === workoutCount,
        totalVolume: userData.trainingstats?.totalVolume || 0,
      };
    }

    // בדיקת gamification
    console.log("\n🎮 בדיקת גיימיפיקציה:");
    if (!userData.currentstats?.gamification) {
      console.log("❌ אין נתוני גיימיפיקציה");
      issues.push("Missing gamification data");
      details.gamification = { exists: false };
    } else {
      const gamification = userData.currentstats.gamification;
      console.log(
        `✅ רמה ${gamification.level}, ${gamification.experience_points} XP`
      );
      console.log(`🏃 אימונים: ${gamification.workouts_completed}`);
      console.log(`🔥 רצף: ${gamification.current_streak} ימים`);

      details.gamification = {
        exists: true,
        level: gamification.level,
        xp: gamification.experience_points,
        workouts: gamification.workouts_completed,
        streak: gamification.current_streak,
      };
    }

    // בדיקת achievements
    console.log("\n🏆 בדיקת הישגים:");
    if (
      !userData.currentstats?.achievements ||
      !Array.isArray(userData.currentstats.achievements)
    ) {
      console.log("❌ אין הישגים");
      issues.push("Missing achievements");
      details.achievements = { count: 0, valid: false };
    } else {
      const achievementCount = userData.currentstats.achievements.length;
      console.log(`✅ יש ${achievementCount} הישגים`);

      details.achievements = {
        count: achievementCount,
        valid: true,
      };
    }

    // בדיקת subscription
    console.log("\n💰 בדיקת מנוי:");
    const expectedSubscription = userConfig.type.toLowerCase();
    if (expectedSubscription === "free") {
      if (!userData.subscription) {
        console.log("✅ Free user - אין מנוי (נכון)");
        details.subscription = { correct: true, type: "free" };
      } else {
        console.log("⚠️ Free user אבל יש נתוני מנוי");
        issues.push("Free user has subscription data");
        details.subscription = {
          correct: false,
          unexpected: userData.subscription,
        };
      }
    } else {
      if (!userData.subscription) {
        console.log(`❌ ${userConfig.type} user אבל אין נתוני מנוי`);
        issues.push("Missing subscription data");
        details.subscription = { correct: false, type: "missing" };
      } else {
        const subType = userData.subscription.type;
        console.log(`✅ מנוי: ${subType} (${userData.subscription.status})`);

        if (subType !== expectedSubscription) {
          issues.push(
            `Wrong subscription type: ${subType} (expected: ${expectedSubscription})`
          );
        }

        details.subscription = {
          correct: subType === expectedSubscription,
          type: subType,
          status: userData.subscription.status,
        };
      }
    }

    // בדיקת preferences
    console.log("\n⚙️ בדיקת העדפות:");
    if (!userData.preferences) {
      console.log("❌ אין העדפות");
      issues.push("Missing preferences");
      details.preferences = { exists: false };
    } else {
      console.log("✅ יש העדפות");
      details.preferences = { exists: true };
    }

    // סיכום
    const status = issues.length === 0 ? "OK" : "ISSUES";
    console.log(`\n📊 סיכום עבור ${userConfig.name}:`);
    console.log(`✅ סטטוס: ${status}`);
    if (issues.length > 0) {
      console.log("⚠️ בעיות שנמצאו:");
      issues.forEach((issue) => console.log(`   - ${issue}`));
    }

    return {
      user: userConfig.name,
      type: userConfig.type,
      status,
      issues,
      details,
    };
  } catch (error) {
    console.error(`❌ שגיאה כללית בבדיקת ${userConfig.name}:`, error);
    return {
      user: userConfig.name,
      status: "ERROR",
      issues: ["General error"],
    };
  }
}

/**
 * בדיקת כל משתמשי הדמו
 */
async function checkAllDemoUsers() {
  console.log("🎯 בדיקת כל משתמשי הדמו");
  console.log("⏰ תאריך:", new Date().toLocaleString("he-IL"));

  const results = [];

  for (const userConfig of DEMO_USERS) {
    const result = await checkDemoUser(userConfig);
    results.push(result);
  }

  // סיכום כללי
  console.log(`\n${"=".repeat(60)}`);
  console.log("📋 סיכום כללי:");
  console.log(`${"=".repeat(60)}`);

  const okUsers = results.filter((r) => r.status === "OK");
  const issueUsers = results.filter((r) => r.status === "ISSUES");
  const errorUsers = results.filter(
    (r) => r.status === "ERROR" || r.status === "MISSING"
  );

  console.log(`✅ משתמשים תקינים: ${okUsers.length}/${results.length}`);
  console.log(`⚠️ משתמשים עם בעיות: ${issueUsers.length}/${results.length}`);
  console.log(`❌ משתמשים עם שגיאות: ${errorUsers.length}/${results.length}`);

  if (issueUsers.length > 0) {
    console.log("\n⚠️ פירוט בעיות:");
    issueUsers.forEach((user) => {
      console.log(`\n${user.user} (${user.type}):`);
      user.issues.forEach((issue) => console.log(`   - ${issue}`));
    });
  }

  if (errorUsers.length > 0) {
    console.log("\n❌ פירוט שגיאות:");
    errorUsers.forEach((user) => {
      console.log(`\n${user.user} (${user.type}): ${user.status}`);
    });
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("📊 בדיקת נתוני סטטיסטיקות נוספת:");
  console.log(`${"=".repeat(60)}`);

  for (const result of results) {
    if (result.status === "OK") {
      console.log(`\n👤 ${result.user} (${result.type}):`);

      try {
        // בדיקת trainingstats ישירות מהנתונים הגולמיים
        const rawData = result.rawData || result.userData;

        if (rawData.trainingstats) {
          const stats = rawData.trainingstats;
          console.log("  📈 Training Stats קיימים:");
          console.log(
            `    • totalWorkouts: ${stats.totalWorkouts ?? "לא קיים"}`
          );
          console.log(`    • streak: ${stats.streak ?? "לא קיים"}`);
          console.log(`    • totalMinutes: ${stats.totalMinutes ?? "לא קיים"}`);
          console.log(`    • xp: ${stats.xp ?? "לא קיים"}`);
          console.log(`    • level: ${stats.level ?? "לא קיים"}`);
        } else {
          console.log("  ❌ אין נתוני trainingstats");
        }

        // בדיקת activityhistory
        if (rawData.activityhistory?.workouts) {
          const workouts = Array.isArray(rawData.activityhistory.workouts)
            ? rawData.activityhistory.workouts.length
            : "לא מערך";
          console.log(`  📅 Activity History: ${workouts} אימונים`);
        } else {
          console.log("  ❌ אין היסטוריית אימונים");
        }

        // בדיקת currentstats (מה שבאמת קיים)
        if (rawData.currentstats?.gamification) {
          const gam = rawData.currentstats.gamification;
          console.log("  🎮 Current Stats (Gamification):");
          console.log(`    • workouts_completed: ${gam.workouts_completed}`);
          console.log(`    • current_streak: ${gam.current_streak}`);
          console.log(`    • level: ${gam.level}`);
          console.log(`    • experience_points: ${gam.experience_points}`);
        }
      } catch (error) {
        console.log(`  ❌ שגיאה בבדיקת נתונים: ${error.message}`);
      }
    }
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("🎯 סיכום נתוני סטטיסטיקות:");
  console.log(`${"=".repeat(60)}`);

  const okResults = results.filter((r) => r.status === "OK");
  let withTrainingStats = 0;
  let withActivityHistory = 0;
  let withCurrentStats = 0;

  for (const result of okResults) {
    try {
      const rawData = result.rawData || result.userData;
      if (rawData.trainingstats) withTrainingStats++;
      if (rawData.activityhistory?.workouts) withActivityHistory++;
      if (rawData.currentstats?.gamification) withCurrentStats++;
    } catch (error) {
      // שגיאה בבדיקה
    }
  }

  console.log(
    `📈 משתמשים עם trainingstats: ${withTrainingStats}/${okResults.length}`
  );
  console.log(
    `📅 משתמשים עם activityhistory: ${withActivityHistory}/${okResults.length}`
  );
  console.log(
    `🎮 משתמשים עם currentstats: ${withCurrentStats}/${okResults.length}`
  );

  if (withTrainingStats === 0 && withActivityHistory === 0) {
    console.log(
      "\n❌ אף משתמש דמו אין לו נתוני trainingstats או activityhistory!"
    );
    console.log("🎮 אבל יש להם currentstats.gamification");
    console.log(
      "💡 ProfileScreen לא יודע לקרוא מ-currentstats - הוא מחפש trainingstats"
    );
    console.log("🔧 צריך להעביר נתונים מ-currentstats ל-trainingstats");
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("✅ בדיקה הושלמה!");

  return results;
}

// הרצה
checkAllDemoUsers()
  .then((results) => {
    const hasIssues = results.some((r) => r.status !== "OK");
    process.exit(hasIssues ? 1 : 0);
  })
  .catch((error) => {
    console.error("❌ שגיאה:", error);
    process.exit(1);
  });
