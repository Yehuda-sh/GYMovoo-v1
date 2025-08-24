/**
 * @file scripts/checkRonShovalData.js
 * @description בדיקה מפורטת של נתוני רון שובל במסד הנתונים
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function checkRonShovalData() {
  console.log("🔍 בדיקת נתוני רון שובל במסד הנתונים\n");

  try {
    // שליפת נתוני רון שובל
    const { data: ronData, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", "u_init_1")
      .single();

    if (error) {
      console.error("❌ שגיאה בשליפת נתונים:", error.message);
      return;
    }

    if (!ronData) {
      console.log("❌ רון שובל לא נמצא במסד הנתונים");
      return;
    }

    console.log("✅ רון שובל נמצא במסד הנתונים");
    console.log("🆔 ID:", ronData.id);
    console.log("👤 שם:", ronData.name);
    console.log("📧 אימייל:", ronData.email);
    console.log("\n" + "=".repeat(60));

    // בדיקת questionnaire data
    console.log("\n📋 נתוני שאלון:");
    if (ronData.questionnaire) {
      console.log("✅ יש נתוני questionnaire");
      console.log("📊 תוכן:", JSON.stringify(ronData.questionnaire, null, 2));
    } else {
      console.log("❌ אין נתוני questionnaire");
    }

    if (ronData.smartquestionnairedata) {
      console.log("✅ יש smartquestionnairedata");
      console.log(
        "📊 תוכן:",
        JSON.stringify(ronData.smartquestionnairedata, null, 2)
      );
    } else {
      console.log("❌ אין smartquestionnairedata");
    }

    // בדיקת activity history
    console.log("\n🏃 היסטוריית אימונים:");
    if (ronData.activityhistory && Array.isArray(ronData.activityhistory)) {
      console.log(`✅ יש ${ronData.activityhistory.length} אימונים`);
      ronData.activityhistory.forEach((workout, index) => {
        console.log(
          `   ${index + 1}. ${workout.workout?.name || "ללא שם"} - ${workout.workout?.startTime || "ללא תאריך"}`
        );
        console.log(
          `      תרגילים: ${workout.workout?.exercises?.length || 0}`
        );
        console.log(`      נפח: ${workout.stats?.totalVolume || 0}ק"ג`);
      });
    } else {
      console.log("❌ אין היסטוריית אימונים או שהיא לא במבנה נכון");
      if (ronData.activityhistory) {
        console.log(
          "📊 תוכן activityhistory:",
          JSON.stringify(ronData.activityhistory, null, 2)
        );
      }
    }

    // בדיקת training stats
    console.log("\n📈 נתוני אימון:");
    if (ronData.trainingstats) {
      console.log("✅ יש נתוני אימון");
      console.log("📊 תוכן:", JSON.stringify(ronData.trainingstats, null, 2));
    } else {
      console.log("❌ אין נתוני אימון");
    }

    // בדיקת gamification
    console.log("\n🎮 נתוני גיימיפיקציה:");
    if (ronData.currentstats?.gamification) {
      console.log("✅ יש נתוני גיימיפיקציה");
      console.log(
        "📊 תוכן:",
        JSON.stringify(ronData.currentstats.gamification, null, 2)
      );
    } else {
      console.log("❌ אין נתוני גיימיפיקציה");
      if (ronData.currentstats) {
        console.log(
          "📊 תוכן currentstats:",
          JSON.stringify(ronData.currentstats, null, 2)
        );
      }
    }

    // בדיקת achievements
    console.log("\n🏆 הישגים:");
    if (ronData.currentstats?.achievements) {
      console.log(`✅ יש ${ronData.currentstats.achievements.length} הישגים`);
      ronData.currentstats.achievements.forEach((achievement, index) => {
        console.log(
          `   ${index + 1}. ${achievement.title} - ${achievement.description}`
        );
      });
    } else {
      console.log("❌ אין הישגים");
    }

    // בדיקת preferences
    console.log("\n⚙️ העדפות:");
    if (ronData.preferences) {
      console.log("✅ יש העדפות");
      console.log("📊 תוכן:", JSON.stringify(ronData.preferences, null, 2));
    } else {
      console.log("❌ אין העדפות");
    }

    // בדיקת subscription
    console.log("\n💰 מנוי:");
    if (ronData.subscription) {
      console.log("✅ יש נתוני מנוי");
      console.log("📊 תוכן:", JSON.stringify(ronData.subscription, null, 2));
    } else {
      console.log("❌ אין נתוני מנוי (free user)");
    }

    console.log("\n" + "=".repeat(60));
    console.log("✅ בדיקה הושלמה!");
  } catch (error) {
    console.error("❌ שגיאה כללית:", error);
  }
}

// הרצה
checkRonShovalData()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ שגיאה:", error);
    process.exit(1);
  });
