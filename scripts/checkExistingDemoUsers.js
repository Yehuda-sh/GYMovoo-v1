/**
 * בדיקת משתמשי דמו קיימים במאגר
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function checkExistingDemoUsers() {
  try {
    console.log("🔍 בודק משתמשי דמו קיימים...\n");

    // בדיקת כל המשתמשים
    const { data: allUsers, error } = await supabase
      .from("users")
      .select(
        "id, name, email, created_at, smartquestionnairedata, questionnaire, preferences"
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    console.log(`📊 סה"כ משתמשים: ${allUsers.length}`);
    console.log("================================\n");

    // זיהוי משתמשי דמו לפי מאפיינים
    const demoUsers = allUsers.filter(
      (user) =>
        user.email.includes(".updated@") ||
        user.email.includes("demo") ||
        user.id.includes("realistic_") ||
        user.name.includes("דמו") ||
        user.email.includes("test") ||
        user.email.includes("yaara") ||
        user.email.includes("alon") ||
        user.email.includes("noa")
    );

    console.log("🎭 משתמשי דמו שזוהו:");
    console.log("===================");

    demoUsers.forEach((user, i) => {
      console.log(`${i + 1}. ${user.name} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(
        `   נוצר: ${new Date(user.created_at).toLocaleString("he-IL")}`
      );
      console.log(
        `   יש שאלון חכם: ${user.smartquestionnairedata ? "✅" : "❌"}`
      );
      console.log(`   יש שאלון ישן: ${user.questionnaire ? "✅" : "❌"}`);
      console.log(`   יש העדפות: ${user.preferences ? "✅" : "❌"}`);

      // בדיקת תוכן השאלון החכם
      if (user.smartquestionnairedata) {
        const questionnaire = user.smartquestionnairedata;
        console.log(
          `   🎯 מטרה: ${questionnaire.answers?.fitness_goal || "לא מוגדר"}`
        );
        console.log(
          `   💪 רמה: ${questionnaire.answers?.experience_level || "לא מוגדר"}`
        );
        console.log(
          `   🏠 מיקום: ${questionnaire.answers?.workout_location || "לא מוגדר"}`
        );
      }
      console.log("");
    });

    // בדיקת משתמשים רגילים (לא דמו)
    const regularUsers = allUsers.filter((user) => !demoUsers.includes(user));

    console.log("\n👥 משתמשים רגילים:");
    console.log("==================");

    regularUsers.forEach((user, i) => {
      console.log(`${i + 1}. ${user.name} (${user.email})`);
      console.log(
        `   נוצר: ${new Date(user.created_at).toLocaleString("he-IL")}`
      );
    });

    return { demoUsers, regularUsers, allUsers };
  } catch (error) {
    console.error("❌ שגיאה בבדיקה:", error.message);
    throw error;
  }
}

if (require.main === module) {
  checkExistingDemoUsers()
    .then(() => {
      console.log("\n✅ בדיקה הושלמה");
    })
    .catch(console.error);
}

module.exports = { checkExistingDemoUsers };
