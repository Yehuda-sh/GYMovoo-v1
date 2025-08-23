/**
 * מחיקת משתמשי דמו מיותרים ולא מעודכנים
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function cleanupOutdatedDemoUsers() {
  try {
    console.log("🧹 מתחיל ניקוי משתמשי דמו מיותרים...\n");

    // 1. מחיקת הגרסאות הישנות (ללא .updated)
    const outdatedEmails = [
      "yaara.cohen@gmail.com",
      "alon.mizrahi@outlook.com",
      "noa.shapira@walla.com",
    ];

    console.log("🗑️ מוחק גרסאות ישנות של משתמשי דמו...");
    for (const email of outdatedEmails) {
      const { data, error } = await supabase
        .from("users")
        .delete()
        .eq("email", email)
        .select();

      if (error) {
        console.error(`❌ שגיאה במחיקת ${email}:`, error.message);
      } else if (data && data.length > 0) {
        console.log(`✅ נמחק: ${data[0].name} (${email})`);
      } else {
        console.log(`⚠️ לא נמצא: ${email}`);
      }
    }

    // 2. בדיקת משתמש Noa Levi שלא תואם
    console.log("\n🔍 בודק משתמש Noa Levi...");
    const { data: noaUser, error: noaError } = await supabase
      .from("users")
      .select("*")
      .eq("email", "noa.levi@example.com")
      .single();

    if (noaError && noaError.code !== "PGRST116") {
      console.error("❌ שגיאה בבדיקת Noa Levi:", noaError.message);
    } else if (noaUser) {
      console.log("📊 פרטי Noa Levi:");
      console.log(`   ID: ${noaUser.id}`);
      console.log(`   שם: ${noaUser.name}`);
      console.log(`   אימייל: ${noaUser.email}`);
      console.log(
        `   יש שאלון חכם: ${noaUser.smartquestionnairedata ? "✅" : "❌"}`
      );
      console.log(`   יש שאלון ישן: ${noaUser.questionnaire ? "✅" : "❌"}`);

      // בדיקה האם השאלון החכם תואם לשאלון החדש
      if (noaUser.smartquestionnairedata) {
        const questionnaire = noaUser.smartquestionnairedata;
        const answers = questionnaire.answers || {};

        console.log("\n🎯 תוכן השאלון החכם:");
        console.log(`   מטרה: ${answers.fitness_goal || "חסר"}`);
        console.log(`   רמה: ${answers.experience_level || "חסר"}`);
        console.log(`   מיקום: ${answers.workout_location || "חסר"}`);
        console.log(`   זמינות: ${answers.availability || "חסר"}`);
        console.log(`   מין: ${answers.gender || "חסר"}`);
        console.log(`   גיל: ${answers.age || "חסר"}`);

        // בדיקה האם השאלון חסר נתונים חשובים
        const missingFields = [];
        if (!answers.fitness_goal) missingFields.push("מטרת כושר");
        if (!answers.experience_level) missingFields.push("רמת ניסיון");
        if (!answers.workout_location) missingFields.push("מיקום אימון");
        if (!answers.gender) missingFields.push("מין");
        if (!answers.age) missingFields.push("גיל");

        if (missingFields.length > 0) {
          console.log(
            `\n⚠️ שדות חסרים ב-Noa Levi: ${missingFields.join(", ")}`
          );
          console.log("💡 מומלץ למחוק משתמש זה ויצירת משתמש חדש");

          // שאלה לאישור מחיקה
          console.log("\n🗑️ מוחק את Noa Levi (נתונים לא שלמים)...");
          const { error: deleteError } = await supabase
            .from("users")
            .delete()
            .eq("id", noaUser.id);

          if (deleteError) {
            console.error("❌ שגיאה במחיקת Noa Levi:", deleteError.message);
          } else {
            console.log("✅ Noa Levi נמחקה בהצלחה");
          }
        } else {
          console.log("\n✅ Noa Levi - נתונים שלמים, נשאר במערכת");
        }
      } else {
        console.log("\n⚠️ Noa Levi ללא שאלון חכם - מוחק...");
        const { error: deleteError } = await supabase
          .from("users")
          .delete()
          .eq("id", noaUser.id);

        if (deleteError) {
          console.error("❌ שגיאה במחיקת Noa Levi:", deleteError.message);
        } else {
          console.log("✅ Noa Levi נמחקה בהצלחה");
        }
      }
    } else {
      console.log("⚠️ Noa Levi לא נמצאה במערכת");
    }

    // 3. סיכום מצב משתמשי דמו אחרי הניקוי
    console.log("\n📊 סיכום אחרי ניקוי:");
    console.log("===================");

    const { data: remainingUsers, error: remainingError } = await supabase
      .from("users")
      .select("id, name, email, created_at, smartquestionnairedata")
      .order("created_at", { ascending: false });

    if (remainingError) {
      console.error("❌ שגיאה בקבלת משתמשים:", remainingError.message);
      return;
    }

    const demoUsers = remainingUsers.filter(
      (user) =>
        user.email.includes(".updated@") ||
        user.email.includes("demo") ||
        user.id.includes("realistic_") ||
        user.name.includes("דמו")
    );

    console.log(`\n🎭 משתמשי דמו שנותרו: ${demoUsers.length}`);
    demoUsers.forEach((user, i) => {
      console.log(`${i + 1}. ${user.name} (${user.email})`);
      console.log(
        `   נוצר: ${new Date(user.created_at).toLocaleString("he-IL")}`
      );
      console.log(`   יש שאלון: ${user.smartquestionnairedata ? "✅" : "❌"}`);
    });

    console.log(`\n👥 סה"כ משתמשים במערכת: ${remainingUsers.length}`);

    return {
      remainingUsers,
      demoUsers,
      cleanedCount: outdatedEmails.length,
    };
  } catch (error) {
    console.error("❌ שגיאה בניקוי:", error.message);
    throw error;
  }
}

if (require.main === module) {
  cleanupOutdatedDemoUsers()
    .then((result) => {
      console.log(`\n✅ ניקוי הושלם - נמחקו ${result.cleanedCount} רשומות`);
    })
    .catch(console.error);
}

module.exports = { cleanupOutdatedDemoUsers };
