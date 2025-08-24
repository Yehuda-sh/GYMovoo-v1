const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function analyzeDatabaseStructure() {
  console.log("🔍 ניתוח מבנה בסיס הנתונים - Supabase\n");

  try {
    // 1. בדיקת משתמשים קיימים עם פרטי Schema
    console.log("👥 רשימת משתמשים מפורטת:");
    console.log("=".repeat(60));

    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("*");

    if (usersError) {
      console.log("❌ שגיאה בטבלת users:", usersError.message);
      return;
    }

    console.log(`✅ נמצאו ${users?.length || 0} משתמשים\n`);

    // ניתוח מבנה השדות
    if (users && users.length > 0) {
      console.log("📊 מבנה שדות בטבלת users:");
      const firstUser = users[0];
      Object.keys(firstUser).forEach((key) => {
        const value = firstUser[key];
        const type = typeof value;
        const hasData = value !== null && value !== undefined;
        console.log(
          `  - ${key}: ${type} ${hasData ? "✅ יש נתונים" : "❌ ריק"}`
        );
      });
    }

    console.log("\n📋 פרטי משתמשים:");
    users?.forEach((user, index) => {
      console.log(
        `\n${index + 1}. משתמש: ${user.name || user.email || user.id}`
      );
      console.log(`   🆔 ID: ${user.id}`);
      console.log(`   📧 Email: ${user.email || "לא קיים"}`);
      console.log(`   👤 Name: ${user.name || "לא קיים"}`);
      console.log(`   📅 נוצר: ${user.created_at}`);
      console.log(`   📅 עודכן: ${user.updated_at}`);

      // בדיקת subscription
      if (user.subscription) {
        console.log(`   💰 Subscription: ${JSON.stringify(user.subscription)}`);
      } else {
        console.log(`   💰 Subscription: Free (default)`);
      }

      // בדיקת questionnaire
      if (user.questionnaire) {
        console.log(`   📋 יש שאלון: כן`);
      } else if (user.questionnairedata) {
        console.log(`   📋 יש נתוני שאלון: כן`);
      } else if (user.smartquestionnairedata) {
        console.log(`   📋 יש שאלון חכם: כן`);
      } else {
        console.log(`   📋 שאלון: לא הושלם`);
      }

      // בדיקת training stats
      if (user.trainingstats) {
        console.log(`   📊 נתוני אימון: כן`);
        if (typeof user.trainingstats === "object") {
          const stats = user.trainingstats;
          if (stats.currentFitnessLevel) {
            console.log(`   💪 רמת כושר: ${stats.currentFitnessLevel}`);
          }
          if (stats.workoutsCompleted) {
            console.log(`   🏃 אימונים: ${stats.workoutsCompleted}`);
          }
        }
      } else {
        console.log(`   📊 נתוני אימון: לא קיימים`);
      }

      // בדיקת workout plans
      if (user.workoutplans) {
        console.log(`   🏋️ תוכניות אימון: כן`);
      } else {
        console.log(`   🏋️ תוכניות אימון: לא קיימות`);
      }

      // בדיקת preferences
      if (user.preferences) {
        console.log(`   ⚙️ העדפות: כן`);
      } else {
        console.log(`   ⚙️ העדפות: לא קיימות`);
      }
    });

    // 2. בדיקת טבלאות נוספות אפשריות
    console.log("\n\n🔍 בדיקת טבלאות נוספות:");
    console.log("=".repeat(60));

    const tablesToCheck = [
      "workout_logs",
      "user_workouts",
      "exercise_records",
      "user_progress",
      "notifications",
      "achievements_unlocked",
      "user_achievements",
      "gamification",
      "user_stats",
      "personal_bests",
    ];

    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .limit(1);

        if (error) {
          console.log(`❌ ${tableName}: לא קיים`);
        } else {
          console.log(
            `✅ ${tableName}: קיים (${data?.length || 0} רשומות דוגמה)`
          );
          if (data && data.length > 0) {
            console.log(`   שדות: ${Object.keys(data[0]).join(", ")}`);
          }
        }
      } catch (e) {
        console.log(`❌ ${tableName}: שגיאה בבדיקה`);
      }
    }

    // 3. סיכום למשתמשי דמו
    console.log("\n\n🎯 המלצות למשתמשי דמו:");
    console.log("=".repeat(60));

    const candidatesForDemo = users
      .filter((user) => user.email && user.name && user.id)
      .slice(0, 3);

    candidatesForDemo.forEach((user, index) => {
      const demoLetter = ["A", "B", "C"][index];
      console.log(`\n${demoLetter}. Demo User ${demoLetter}: ${user.name}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   🆔 ID: ${user.id}`);
      console.log(
        `   📊 מצב נוכחי: ${user.trainingstats ? "יש נתוני אימון" : "חדש"}`
      );
      console.log(
        `   📋 שאלון: ${user.questionnaire || user.questionnairedata ? "הושלם" : "לא הושלם"}`
      );
      console.log(`   💡 מתאים ל: ${getDemoProfile(user, demoLetter)}`);
    });
  } catch (error) {
    console.error("❌ שגיאה כללית:", error);
  }
}

function getDemoProfile(user, letter) {
  if (letter === "A") {
    return "Free User - משתמש חדש עם אימונים בסיסיים";
  } else if (letter === "B") {
    return "Trial User - משתמש פעיל עם מעט היסטוריה";
  } else {
    return "Premium User - משתמש מתמיד עם היסטוריה עשירה";
  }
}

// הרצה
analyzeDatabaseStructure()
  .then(() => {
    console.log("\n✅ ניתוח הושלם בהצלחה!");
    console.log("\n📌 הבא: בחר 3 משתמשים למשתמשי דמו A, B, C");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ שגיאה בניתוח:", error);
    process.exit(1);
  });
