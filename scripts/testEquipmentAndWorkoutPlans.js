/**
 * בדיקת מערכת ציוד ותוכניות אימון למשתמשי דמו
 * Testing equipment system and workout plans for demo users
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function testEquipmentAndWorkoutPlans() {
  try {
    console.log("🔍 בדיקת מערכת ציוד ותוכניות אימון\n");
    console.log("=".repeat(60));

    // קבלת משתמשי דמו
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .like("email", "%.updated@%");

    if (error) throw error;

    console.log(`📊 נמצאו ${users.length} משתמשי דמו מעודכנים\n`);

    // סטטיסטיקות
    let stats = {
      totalUsers: users.length,
      usersWithWorkoutPlans: 0,
      usersWithBasicPlan: 0,
      usersWithSmartPlan: 0,
      equipmentIssues: [],
      plansMissing: [],
    };

    // בדיקת כל משתמש
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`${i + 1}. 👤 ${user.name}`);
      console.log("-".repeat(40));

      // בדיקת נתוני שאלון
      const answers = user.smartquestionnairedata?.answers || {};
      console.log(`📧 אימייל: ${user.email}`);
      console.log(`🎯 מטרה: ${answers.fitness_goal || "לא מוגדר"}`);
      console.log(`💪 רמה: ${answers.experience_level || "לא מוגדר"}`);
      console.log(`📍 מיקום: ${answers.workout_location || "לא מוגדר"}`);

      // בדיקת ציוד לפי מיקום
      let equipment = [];
      const location = answers.workout_location;

      if (location === "home_bodyweight") {
        equipment = answers.bodyweight_equipment || [];
      } else if (location === "home_equipment") {
        equipment = answers.home_equipment || [];
      } else if (location === "gym") {
        equipment = answers.gym_equipment || [];
      }

      console.log(`🔧 ציוד זמין (${equipment.length} פריטים):`);
      if (equipment.length > 0) {
        equipment.forEach((item) => {
          if (typeof item === "object" && item.id) {
            console.log(`   • ${item.id} (${item.label || item.id})`);
          } else {
            console.log(`   • ${item}`);
          }
        });
      } else {
        console.log("   • ללא ציוד");
      }

      // בדיקת תוכניות אימון
      console.log("\n📋 תוכניות אימון:");
      if (user.workoutplans && Object.keys(user.workoutplans).length > 0) {
        stats.usersWithWorkoutPlans++;

        const plans = user.workoutplans;

        // בדיקת תוכנית בסיסית
        if (plans.basicPlan) {
          stats.usersWithBasicPlan++;
          const basicPlan = plans.basicPlan;
          console.log("   ✅ תוכנית בסיסית:");
          console.log(`      📝 שם: ${basicPlan.name || "ללא שם"}`);
          console.log(`      📊 אימונים: ${basicPlan.workouts?.length || 0}`);
          console.log(
            `      📅 תאריך יצירה: ${basicPlan.createdAt ? new Date(basicPlan.createdAt).toLocaleDateString("he-IL") : "לא ידוע"}`
          );

          // בדיקת תרגילים בתוכנית הבסיסית
          if (basicPlan.workouts && basicPlan.workouts.length > 0) {
            const firstWorkout = basicPlan.workouts[0];
            console.log(
              `      🏋️ אימון ראשון: ${firstWorkout.name || "ללא שם"}`
            );
            console.log(
              `      🎯 תרגילים: ${firstWorkout.exercises?.length || 0}`
            );

            if (firstWorkout.exercises && firstWorkout.exercises.length > 0) {
              console.log("      📝 דוגמאות תרגילים:");
              firstWorkout.exercises.slice(0, 3).forEach((exercise) => {
                console.log(
                  `         • ${exercise.name || exercise.exerciseId || "תרגיל לא ידוע"}`
                );
              });
            }
          }
        } else {
          console.log("   ❌ אין תוכנית בסיסית");
          stats.plansMissing.push(`${user.name} - תוכנית בסיסית`);
        }

        // בדיקת תוכנית חכמה
        if (plans.smartPlan) {
          stats.usersWithSmartPlan++;
          const smartPlan = plans.smartPlan;
          console.log("   ✅ תוכנית חכמה:");
          console.log(`      📝 שם: ${smartPlan.name || "ללא שם"}`);
          console.log(`      📊 אימונים: ${smartPlan.workouts?.length || 0}`);
          console.log(
            `      🔧 מותאמת לציוד: ${equipment.length > 0 ? "כן" : "לא"}`
          );

          // בדיקת התאמת תרגילים לציוד
          if (smartPlan.workouts && smartPlan.workouts.length > 0) {
            const firstWorkout = smartPlan.workouts[0];
            console.log(
              `      🏋️ אימון ראשון: ${firstWorkout.name || "ללא שם"}`
            );
            console.log(
              `      🎯 תרגילים: ${firstWorkout.exercises?.length || 0}`
            );

            if (firstWorkout.exercises && firstWorkout.exercises.length > 0) {
              console.log("      📝 דוגמאות תרגילים:");
              firstWorkout.exercises.slice(0, 3).forEach((exercise) => {
                console.log(
                  `         • ${exercise.name || exercise.exerciseId || "תרגיל לא ידוע"}`
                );
              });
            }
          }
        } else {
          console.log("   ❌ אין תוכנית חכמה");
          stats.plansMissing.push(`${user.name} - תוכנית חכמה`);
        }
      } else {
        console.log("   ❌ אין תוכניות אימון");
        stats.plansMissing.push(`${user.name} - כל התוכניות`);
      }

      console.log("\n" + "=".repeat(60) + "\n");
    }

    // סיכום
    console.log("📊 סיכום הבדיקה:");
    console.log("=".repeat(30));
    console.log(`👥 סה"כ משתמשים: ${stats.totalUsers}`);
    console.log(
      `📋 משתמשים עם תוכניות: ${stats.usersWithWorkoutPlans}/${stats.totalUsers}`
    );
    console.log(
      `🏃 תוכניות בסיסיות: ${stats.usersWithBasicPlan}/${stats.totalUsers}`
    );
    console.log(
      `🧠 תוכניות חכמות: ${stats.usersWithSmartPlan}/${stats.totalUsers}`
    );

    if (stats.plansMissing.length > 0) {
      console.log("\n⚠️ תוכניות חסרות:");
      stats.plansMissing.forEach((missing) => {
        console.log(`   • ${missing}`);
      });
    }

    // המלצות
    console.log("\n💡 המלצות:");
    if (stats.usersWithWorkoutPlans < stats.totalUsers) {
      console.log("   • יש ליצור תוכניות אימון למשתמשים שחסרות להם");
    }
    if (stats.usersWithBasicPlan < stats.totalUsers) {
      console.log("   • יש להוסיף תוכניות בסיסיות למשתמשים");
    }
    if (stats.usersWithSmartPlan < stats.totalUsers) {
      console.log("   • יש להוסיף תוכניות חכמות מותאמות לציוד");
    }
    if (stats.usersWithWorkoutPlans === stats.totalUsers) {
      console.log("   ✅ כל המשתמשים בעלי תוכניות אימון!");
    }

    return stats;
  } catch (error) {
    console.error("❌ שגיאה בבדיקה:", error.message);
    throw error;
  }
}

if (require.main === module) {
  testEquipmentAndWorkoutPlans()
    .then((stats) => {
      console.log("\n✅ בדיקה הושלמה בהצלחה");
    })
    .catch(console.error);
}

module.exports = { testEquipmentAndWorkoutPlans };
