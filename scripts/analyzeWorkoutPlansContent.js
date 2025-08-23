/**
 * בדיקה מעמיקה של תוכן תוכניות האימון והתאמה לציוד
 * Deep analysis of workout plan content and equipment compatibility
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function analyzeWorkoutPlansContent() {
  try {
    console.log("🔍 ניתוח מעמיק של תוכן תוכניות האימון\n");
    console.log("=".repeat(60));

    // קבלת משתמשי דמו
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .like("email", "%.updated@%");

    if (error) throw error;

    console.log(`📊 מנתח ${users.length} משתמשי דמו...\n`);

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      console.log(`${i + 1}. 👤 ${user.name}`);
      console.log("=".repeat(50));

      const answers = user.smartquestionnairedata?.answers || {};
      const location = answers.workout_location;

      // בדיקת ציוד זמין
      let userEquipment = [];
      if (location === "home_bodyweight") {
        userEquipment = answers.bodyweight_equipment || [];
      } else if (location === "home_equipment") {
        userEquipment = answers.home_equipment || [];
      } else if (location === "gym") {
        userEquipment = answers.gym_equipment || [];
      }

      console.log(`📍 מיקום: ${location}`);
      console.log(
        `🔧 ציוד זמין: ${userEquipment.map((eq) => (typeof eq === "object" ? eq.id : eq)).join(", ") || "ללא"}`
      );

      if (!user.workoutplans) {
        console.log("❌ אין תוכניות אימון");
        continue;
      }

      // ניתוח תוכנית בסיסית
      if (user.workoutplans.basicPlan) {
        console.log("\n📋 ניתוח תוכנית בסיסית:");
        const basicPlan = user.workoutplans.basicPlan;

        if (basicPlan.workouts && basicPlan.workouts.length > 0) {
          basicPlan.workouts.forEach((workout, workoutIndex) => {
            console.log(`   🏋️ אימון ${workoutIndex + 1}: ${workout.name}`);

            if (workout.exercises && workout.exercises.length > 0) {
              console.log(`   📝 תרגילים (${workout.exercises.length}):`);
              workout.exercises.forEach((exercise, exerciseIndex) => {
                console.log(
                  `      ${exerciseIndex + 1}. ${exercise.name || exercise.exerciseId}`
                );
                if (exercise.sets)
                  console.log(`         סטים: ${exercise.sets}`);
                if (exercise.reps)
                  console.log(`         חזרות: ${exercise.reps}`);
                if (exercise.duration)
                  console.log(`         זמן: ${exercise.duration} שניות`);
                if (exercise.restTime)
                  console.log(`         מנוחה: ${exercise.restTime} שניות`);
                if (exercise.weight)
                  console.log(`         משקל: ${exercise.weight} ק"ג`);
              });
            } else {
              console.log("   ⚠️ אין תרגילים באימון");
            }
          });
        } else {
          console.log("   ⚠️ אין אימונים בתוכנית הבסיסית");
        }
      }

      // ניתוח תוכנית חכמה
      if (user.workoutplans.smartPlan) {
        console.log("\n🧠 ניתוח תוכנית חכמה:");
        const smartPlan = user.workoutplans.smartPlan;

        if (smartPlan.workouts && smartPlan.workouts.length > 0) {
          smartPlan.workouts.forEach((workout, workoutIndex) => {
            console.log(`   🏋️ אימון ${workoutIndex + 1}: ${workout.name}`);

            if (workout.exercises && workout.exercises.length > 0) {
              console.log(`   📝 תרגילים (${workout.exercises.length}):`);

              let equipmentMatchIssues = 0;

              workout.exercises.forEach((exercise, exerciseIndex) => {
                console.log(
                  `      ${exerciseIndex + 1}. ${exercise.name || exercise.exerciseId}`
                );

                // בדיקת התאמה לציוד - זה דורש הרחבה בעתיד
                // כרגע אנחנו בודקים אם יש ציוד זמין כלל
                if (
                  userEquipment.length === 0 &&
                  exercise.name &&
                  (exercise.name.toLowerCase().includes("dumbbell") ||
                    exercise.name.toLowerCase().includes("barbell") ||
                    exercise.name.toLowerCase().includes("machine"))
                ) {
                  equipmentMatchIssues++;
                  console.log(`         ⚠️ תרגיל דורש ציוד אבל אין ציוד זמין`);
                }

                if (exercise.sets)
                  console.log(`         סטים: ${exercise.sets}`);
                if (exercise.reps)
                  console.log(`         חזרות: ${exercise.reps}`);
                if (exercise.duration)
                  console.log(`         זמן: ${exercise.duration} שניות`);
                if (exercise.restTime)
                  console.log(`         מנוחה: ${exercise.restTime} שניות`);
                if (exercise.weight)
                  console.log(`         משקל: ${exercise.weight} ק"ג`);
              });

              if (equipmentMatchIssues > 0) {
                console.log(
                  `   ⚠️ נמצאו ${equipmentMatchIssues} תרגילים שעלולים לא להתאים לציוד הזמין`
                );
              } else {
                console.log(`   ✅ כל התרגילים תואמים לציוד הזמין`);
              }
            } else {
              console.log("   ⚠️ אין תרגילים באימון");
            }
          });
        } else {
          console.log("   ⚠️ אין אימונים בתוכנית החכמה");
        }
      }

      // השוואה בין התוכניות
      if (user.workoutplans.basicPlan && user.workoutplans.smartPlan) {
        console.log("\n🔄 השוואה בין תוכניות:");

        const basicWorkouts = user.workoutplans.basicPlan.workouts?.length || 0;
        const smartWorkouts = user.workoutplans.smartPlan.workouts?.length || 0;

        console.log(
          `   📊 מספר אימונים: בסיסית ${basicWorkouts} vs חכמה ${smartWorkouts}`
        );

        // בדיקת הבדלים בתרגילים
        const basicExercises =
          user.workoutplans.basicPlan.workouts?.flatMap(
            (w) => w.exercises?.map((e) => e.name) || []
          ) || [];
        const smartExercises =
          user.workoutplans.smartPlan.workouts?.flatMap(
            (w) => w.exercises?.map((e) => e.name) || []
          ) || [];

        console.log(
          `   🏋️ תרגילים: בסיסית ${basicExercises.length} vs חכמה ${smartExercises.length}`
        );

        // בדיקת תרגילים ייחודיים
        const uniqueInBasic = basicExercises.filter(
          (ex) => !smartExercises.includes(ex)
        );
        const uniqueInSmart = smartExercises.filter(
          (ex) => !basicExercises.includes(ex)
        );

        if (uniqueInBasic.length > 0) {
          console.log(
            `   📝 תרגילים ייחודיים בבסיסית: ${uniqueInBasic.slice(0, 3).join(", ")}`
          );
        }
        if (uniqueInSmart.length > 0) {
          console.log(
            `   📝 תרגילים ייחודיים בחכמה: ${uniqueInSmart.slice(0, 3).join(", ")}`
          );
        }
      }

      console.log("\n" + "=".repeat(60) + "\n");
    }

    // סיכום כללי
    console.log("📋 סיכום ניתוח תוכן התוכניות:");
    console.log("=".repeat(40));

    let totalUsers = users.length;
    let usersWithBothPlans = users.filter(
      (u) => u.workoutplans?.basicPlan && u.workoutplans?.smartPlan
    ).length;
    let usersWithDetailedExercises = users.filter((u) => {
      const basicHasExercises = u.workoutplans?.basicPlan?.workouts?.some(
        (w) => w.exercises?.length > 0
      );
      const smartHasExercises = u.workoutplans?.smartPlan?.workouts?.some(
        (w) => w.exercises?.length > 0
      );
      return basicHasExercises && smartHasExercises;
    }).length;

    console.log(`👥 סה"כ משתמשים: ${totalUsers}`);
    console.log(
      `📋 משתמשים עם שתי תוכניות: ${usersWithBothPlans}/${totalUsers}`
    );
    console.log(
      `🏋️ משתמשים עם תרגילים מפורטים: ${usersWithDetailedExercises}/${totalUsers}`
    );

    // המלצות לשיפור
    console.log("\n💡 המלצות לשיפור:");
    if (usersWithDetailedExercises < totalUsers) {
      console.log("   • יש להוסיף תרגילים מפורטים לתוכניות שחסרות");
    }
    console.log("   • יש לפתח מערכת בדיקת התאמת ציוד מתקדמת יותר");
    console.log("   • יש להוסיף מטא-דאטה לתרגילים (ציוד נדרש, קושי וכו')");
    console.log("   • יש לוודא שהתוכניות החכמות באמת מותאמות לציוד הזמין");

    return { totalUsers, usersWithBothPlans, usersWithDetailedExercises };
  } catch (error) {
    console.error("❌ שגיאה בניתוח:", error.message);
    throw error;
  }
}

if (require.main === module) {
  analyzeWorkoutPlansContent()
    .then((stats) => {
      console.log("\n✅ ניתוח הושלם בהצלחה");
    })
    .catch(console.error);
}

module.exports = { analyzeWorkoutPlansContent };
