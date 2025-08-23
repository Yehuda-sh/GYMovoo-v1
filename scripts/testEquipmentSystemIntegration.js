/**
 * בדיקה מקיפה של מערכת הציוד ואינטגרציה עם מסכי האימון
 * Comprehensive test of equipment system and integration with workout screens
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

async function testEquipmentSystemIntegration() {
  try {
    console.log("🔍 בדיקת מערכת ציוד ואינטגרציה עם מסכי אימון\n");
    console.log("=".repeat(70));

    // בדיקה 1: נתוני משתמשים וציוד
    console.log("📋 בדיקה 1: נתוני משתמשים וציוד");
    console.log("-".repeat(50));

    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .like("email", "%.updated@%");

    if (error) throw error;

    const equipmentReport = [];

    users.forEach((user) => {
      const answers = user.smartquestionnairedata?.answers || {};
      const location = answers.workout_location;

      let equipment = [];
      let equipmentType = "unknown";

      if (location === "home_bodyweight") {
        equipment = answers.bodyweight_equipment || [];
        equipmentType = "משקל גוף";
      } else if (location === "home_equipment") {
        equipment = answers.home_equipment || [];
        equipmentType = "ציוד ביתי";
      } else if (location === "gym") {
        equipment = answers.gym_equipment || [];
        equipmentType = "חדר כושר";
      }

      equipmentReport.push({
        name: user.name,
        location,
        equipmentType,
        equipmentCount: equipment.length,
        equipment: equipment.map((eq) => (typeof eq === "object" ? eq.id : eq)),
        hasBasicPlan: !!user.workoutplans?.basicPlan,
        hasSmartPlan: !!user.workoutplans?.smartPlan,
      });

      console.log(`👤 ${user.name}:`);
      console.log(`   📍 ${equipmentType} (${equipment.length} פריטים)`);
      console.log(
        `   🔧 ${equipment.map((eq) => (typeof eq === "object" ? eq.id : eq)).join(", ") || "ללא"}`
      );
      console.log(
        `   📋 תוכניות: ${user.workoutplans?.basicPlan ? "בסיסית✅" : "בסיסית❌"} ${user.workoutplans?.smartPlan ? "חכמה✅" : "חכמה❌"}`
      );
    });

    // בדיקה 2: התאמת תרגילים לציוד
    console.log("\n📋 בדיקה 2: התאמת תרגילים לציוד בתוכניות");
    console.log("-".repeat(50));

    const exerciseCompatibilityReport = [];

    users.forEach((user) => {
      if (!user.workoutplans) return;

      const userEquipment = (() => {
        const answers = user.smartquestionnairedata?.answers || {};
        const location = answers.workout_location;

        if (location === "home_bodyweight") {
          return answers.bodyweight_equipment || [];
        } else if (location === "home_equipment") {
          return answers.home_equipment || [];
        } else if (location === "gym") {
          return answers.gym_equipment || [];
        }
        return [];
      })();

      // בדיקת תוכנית בסיסית
      if (user.workoutplans.basicPlan) {
        const basicPlan = user.workoutplans.basicPlan;
        let totalExercises = 0;
        let equipmentExercises = 0;

        basicPlan.workouts?.forEach((workout) => {
          workout.exercises?.forEach((exercise) => {
            totalExercises++;
            if (
              exercise.name &&
              (exercise.name.toLowerCase().includes("dumbbell") ||
                exercise.name.toLowerCase().includes("barbell") ||
                exercise.name.toLowerCase().includes("machine") ||
                exercise.name.toLowerCase().includes("cable") ||
                exercise.name.toLowerCase().includes("resistance"))
            ) {
              equipmentExercises++;
            }
          });
        });

        console.log(`👤 ${user.name} - תוכנית בסיסית:`);
        console.log(
          `   🏋️ ${totalExercises} תרגילים, ${equipmentExercises} דורשים ציוד`
        );
        console.log(`   ${totalExercises > 0 ? "✅" : "❌"} יש תרגילים`);

        exerciseCompatibilityReport.push({
          user: user.name,
          planType: "basic",
          totalExercises,
          equipmentExercises,
          hasEquipment: userEquipment.length > 0,
          compatibilityScore:
            userEquipment.length > 0 && equipmentExercises > 0
              ? "תואם"
              : userEquipment.length === 0 && equipmentExercises === 0
                ? "תואם (משקל גוף)"
                : "לא תואם",
        });
      }

      // בדיקת תוכנית חכמה
      if (user.workoutplans.smartPlan) {
        const smartPlan = user.workoutplans.smartPlan;
        let totalExercises = 0;
        let equipmentExercises = 0;
        let aiExercises = 0;

        smartPlan.workouts?.forEach((workout) => {
          workout.exercises?.forEach((exercise) => {
            totalExercises++;
            if (exercise.name && exercise.name.includes("AI")) {
              aiExercises++;
            }
            if (
              exercise.name &&
              (exercise.name.toLowerCase().includes("dumbbell") ||
                exercise.name.toLowerCase().includes("barbell") ||
                exercise.name.toLowerCase().includes("machine") ||
                exercise.name.toLowerCase().includes("cable") ||
                exercise.name.toLowerCase().includes("resistance"))
            ) {
              equipmentExercises++;
            }
          });
        });

        console.log(`👤 ${user.name} - תוכנית חכמה:`);
        console.log(
          `   🏋️ ${totalExercises} תרגילים, ${equipmentExercises} דורשים ציוד, ${aiExercises} תרגילי AI`
        );
        console.log(`   ${totalExercises > 0 ? "✅" : "❌"} יש תרגילים`);

        exerciseCompatibilityReport.push({
          user: user.name,
          planType: "smart",
          totalExercises,
          equipmentExercises,
          aiExercises,
          hasEquipment: userEquipment.length > 0,
          compatibilityScore:
            userEquipment.length > 0 && equipmentExercises > 0
              ? "תואם"
              : userEquipment.length === 0 && equipmentExercises === 0
                ? "תואם (משקל גוף)"
                : "לא תואם",
        });
      }
    });

    // בדיקה 3: הבדלים בין תוכניות בסיסיות וחכמות
    console.log("\n📋 בדיקה 3: הבדלים בין תוכניות בסיסיות וחכמות");
    console.log("-".repeat(50));

    users.forEach((user) => {
      if (!user.workoutplans?.basicPlan || !user.workoutplans?.smartPlan)
        return;

      const basicPlan = user.workoutplans.basicPlan;
      const smartPlan = user.workoutplans.smartPlan;

      console.log(`👤 ${user.name}:`);
      console.log(
        `   📊 תוכנית בסיסית: ${basicPlan.workouts?.length || 0} אימונים`
      );
      console.log(
        `   📊 תוכנית חכמה: ${smartPlan.workouts?.length || 0} אימונים`
      );

      // ספירת תרגילים
      const basicExercises =
        basicPlan.workouts?.reduce(
          (total, workout) => total + (workout.exercises?.length || 0),
          0
        ) || 0;
      const smartExercises =
        smartPlan.workouts?.reduce(
          (total, workout) => total + (workout.exercises?.length || 0),
          0
        ) || 0;

      console.log(
        `   🏋️ תרגילים: בסיסית ${basicExercises} vs חכמה ${smartExercises}`
      );

      // בדיקת תכונות
      const smartFeatures = smartPlan.features || {};
      console.log(
        `   🤖 תכונות AI:${smartFeatures.aiRecommendations ? " המלצות✅" : " המלצות❌"}${smartFeatures.equipmentOptimization ? " ציוד✅" : " ציוד❌"}${smartFeatures.personalizedWorkouts ? " אישיות✅" : " אישיות❌"}`
      );
    });

    // סיכום ומסקנות
    console.log("\n📊 סיכום ומסקנות");
    console.log("=".repeat(50));

    const totalUsers = users.length;
    const usersWithEquipment = equipmentReport.filter(
      (u) => u.equipmentCount > 0
    ).length;
    const usersWithBothPlans = equipmentReport.filter(
      (u) => u.hasBasicPlan && u.hasSmartPlan
    ).length;
    const compatibleExercises = exerciseCompatibilityReport.filter((r) =>
      r.compatibilityScore.includes("תואם")
    ).length;

    console.log(`👥 סה"כ משתמשים: ${totalUsers}`);
    console.log(`🔧 משתמשים עם ציוד: ${usersWithEquipment}/${totalUsers}`);
    console.log(
      `📋 משתמשים עם שתי תוכניות: ${usersWithBothPlans}/${totalUsers}`
    );
    console.log(
      `✅ תוכניות תואמות ציוד: ${compatibleExercises}/${exerciseCompatibilityReport.length}`
    );

    // דוח פעולות שנדרשות
    console.log("\n🎯 המלצות לשיפור:");

    if (usersWithBothPlans < totalUsers) {
      console.log("   • יש להשלים תוכניות חסרות למשתמשים");
    }

    if (compatibleExercises < exerciseCompatibilityReport.length) {
      console.log("   • יש לשפר התאמת תרגילים לציוד הזמין");
    }

    // בדיקת הבדלים מעמיקים
    const averageBasicExercises =
      exerciseCompatibilityReport
        .filter((r) => r.planType === "basic")
        .reduce((sum, r) => sum + r.totalExercises, 0) /
      exerciseCompatibilityReport.filter((r) => r.planType === "basic").length;

    const averageSmartExercises =
      exerciseCompatibilityReport
        .filter((r) => r.planType === "smart")
        .reduce((sum, r) => sum + r.totalExercises, 0) /
      exerciseCompatibilityReport.filter((r) => r.planType === "smart").length;

    console.log(
      `   • ממוצע תרגילים בתוכנית בסיסית: ${averageBasicExercises.toFixed(1)}`
    );
    console.log(
      `   • ממוצע תרגילים בתוכנית חכמה: ${averageSmartExercises.toFixed(1)}`
    );
    console.log(
      `   • הפרש: ${(averageSmartExercises - averageBasicExercises).toFixed(1)} תרגילים נוספים בחכמה`
    );

    if (averageSmartExercises > averageBasicExercises) {
      console.log("   ✅ תוכניות חכמות מפורטות יותר (כצפוי)");
    } else {
      console.log("   ⚠️ תוכניות חכמות אמורות להיות מפורטות יותר");
    }

    console.log("\n🎯 מסקנה כללית:");
    if (
      usersWithBothPlans === totalUsers &&
      compatibleExercises === exerciseCompatibilityReport.length
    ) {
      console.log("✅ מערכת הציוד ותוכניות האימון עובדת כפי שתוכננה!");
      console.log("✅ כל המשתמשים יש להם תוכניות מותאמות לציוד שלהם");
    } else {
      console.log("⚠️ יש מקום לשיפור במערכת התאמת הציוד והתוכניות");
    }

    return {
      totalUsers,
      usersWithEquipment,
      usersWithBothPlans,
      compatibleExercises,
      equipmentReport,
      exerciseCompatibilityReport,
    };
  } catch (error) {
    console.error("❌ שגיאה בבדיקה:", error.message);
    throw error;
  }
}

if (require.main === module) {
  testEquipmentSystemIntegration()
    .then((report) => {
      console.log("\n✅ בדיקת אינטגרציה הושלמה בהצלחה");
    })
    .catch(console.error);
}

module.exports = { testEquipmentSystemIntegration };
