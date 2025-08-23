/**
 * אימות התאמת משתמשי דמו לטיפוסי הפרויקט הנוכחיים
 */

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

// טיפוסים מותרים לפי unifiedQuestionnaire.ts
const VALID_TYPES = {
  gender: ["male", "female", "other"],
  age: ["18_25", "26_35", "36_45", "46_55", "56_plus"],
  weight: ["under_50", "51_60", "61_70", "71_80", "81_90", "over_90"],
  height: ["under_150", "151_160", "161_170", "171_180", "181_190", "over_190"],
  fitness_goal: [
    "lose_weight",
    "build_muscle",
    "general_fitness",
    "improve_endurance",
    "increase_strength",
  ],
  experience_level: ["beginner", "intermediate", "advanced"],
  availability: ["2_days", "3_days", "4_days", "5_plus_days"],
  session_duration: ["30_45_min", "45_60_min", "60_plus_min"],
  workout_location: ["home_bodyweight", "home_equipment", "gym"],
  diet_preferences: [
    "none_diet",
    "vegetarian",
    "vegan",
    "keto",
    "paleo",
    "balanced_diet",
  ],
};

// ציוד מותר לפי מיקום (מבוסס על unifiedQuestionnaire.ts)
const VALID_EQUIPMENT = {
  home_bodyweight: [
    "bodyweight_only",
    "mat_available",
    "chair_available",
    "wall_space",
    "stairs_available",
    "towel_available",
    "water_bottles",
    "pillow_available",
    "table_sturdy",
    "backpack_heavy",
    "water_gallon",
    "sandbag",
    "tire",
  ],
  home_equipment: [
    "dumbbells",
    "resistance_bands",
    "kettlebell",
    "yoga_mat",
    "pullup_bar",
    "foam_roller",
    "exercise_ball",
    "trx",
  ],
  gym: [
    "free_weights",
    "cable_machine",
    "squat_rack",
    "bench_press",
    "leg_press",
    "lat_pulldown",
    "smith_machine",
    "rowing_machine",
    "treadmill",
    "bike",
  ],
};

async function validateDemoUsersCompatibility() {
  try {
    console.log("🔍 מאמת התאמת משתמשי דמו לטיפוסי הפרויקט...\n");

    // קבלת משתמשי דמו
    const { data: demoUsers, error } = await supabase
      .from("users")
      .select("*")
      .like("email", "%.updated@%");

    if (error) throw error;

    console.log(`📊 נמצאו ${demoUsers.length} משתמשי דמו לבדיקה\n`);

    let allValid = true;
    const issues = [];

    for (const user of demoUsers) {
      console.log(`🎭 בודק: ${user.name} (${user.email})`);
      console.log("=".repeat(50));

      const userIssues = [];

      // בדיקת שאלון חכם
      if (
        !user.smartquestionnairedata ||
        !user.smartquestionnairedata.answers
      ) {
        userIssues.push("❌ חסר שאלון חכם או תשובות");
        allValid = false;
      } else {
        const answers = user.smartquestionnairedata.answers;

        // בדיקת כל שדה
        for (const [field, validValues] of Object.entries(VALID_TYPES)) {
          const userValue = answers[field];

          if (!userValue) {
            userIssues.push(`⚠️ שדה חסר: ${field}`);
            continue;
          }

          if (!validValues.includes(userValue)) {
            userIssues.push(
              `❌ ערך לא תקין ב-${field}: "${userValue}" (מותר: ${validValues.join(", ")})`
            );
            allValid = false;
          } else {
            console.log(`   ✅ ${field}: ${userValue}`);
          }
        }

        // בדיקת ציוד לפי מיקום
        const location = answers.workout_location;
        const equipmentField =
          location === "home_bodyweight"
            ? "bodyweight_equipment"
            : location === "home_equipment"
              ? "home_equipment"
              : location === "gym"
                ? "gym_equipment"
                : null;

        if (equipmentField && answers[equipmentField]) {
          const userEquipment = Array.isArray(answers[equipmentField])
            ? answers[equipmentField]
            : [answers[equipmentField]];
          const validEquipment = VALID_EQUIPMENT[location] || [];

          console.log(`   🏋️ ציוד (${equipmentField}):`);
          for (const equipment of userEquipment) {
            if (typeof equipment === "object" && equipment.id) {
              // ציוד כאובייקט עם id
              if (validEquipment.includes(equipment.id)) {
                console.log(
                  `     ✅ ${equipment.id} (${equipment.label || equipment.id})`
                );
              } else {
                userIssues.push(
                  `❌ ציוד לא תקין: ${equipment.id} עבור ${location}`
                );
                allValid = false;
              }
            } else if (typeof equipment === "string") {
              // ציוד כמחרוזת
              if (validEquipment.includes(equipment)) {
                console.log(`     ✅ ${equipment}`);
              } else {
                userIssues.push(
                  `❌ ציוד לא תקין: ${equipment} עבור ${location}`
                );
                allValid = false;
              }
            } else {
              userIssues.push(
                `❌ פורמט ציוד לא תקין: ${JSON.stringify(equipment)}`
              );
              allValid = false;
            }
          }
        }

        // בדיקת מטא-דאטה של השאלון
        const metadata = user.smartquestionnairedata.metadata;
        if (metadata) {
          console.log(`   📋 גרסת שאלון: ${metadata.version || "לא מוגדר"}`);
          console.log(
            `   ⏱️ הושלם ב: ${metadata.completedAt ? new Date(metadata.completedAt).toLocaleString("he-IL") : "לא מוגדר"}`
          );
          console.log(
            `   📊 שאלות שנענו: ${metadata.questionsAnswered || 0}/${metadata.totalQuestions || 10}`
          );

          if (
            metadata.questionsAnswered !== 10 ||
            metadata.totalQuestions !== 10
          ) {
            userIssues.push(
              `⚠️ מספר שאלות לא תקין: ${metadata.questionsAnswered}/${metadata.totalQuestions} (צריך 10/10)`
            );
          }
        }
      }

      // בדיקת תאימות לטיפוסי TypeScript
      console.log("\n   🎯 בדיקת תאימות טיפוסים:");

      // בדיקת שדות בסיסיים
      if (!user.id || typeof user.id !== "string") {
        userIssues.push("❌ ID חסר או לא תקין");
        allValid = false;
      } else {
        console.log(`     ✅ ID: ${user.id}`);
      }

      if (!user.name || typeof user.name !== "string") {
        userIssues.push("❌ שם חסר או לא תקין");
        allValid = false;
      } else {
        console.log(`     ✅ שם: ${user.name}`);
      }

      if (
        !user.email ||
        typeof user.email !== "string" ||
        !user.email.includes("@")
      ) {
        userIssues.push("❌ אימייל חסר או לא תקין");
        allValid = false;
      } else {
        console.log(`     ✅ אימייל: ${user.email}`);
      }

      // סיכום המשתמש
      if (userIssues.length === 0) {
        console.log("\n   🎉 המשתמש תקין לחלוטין!");
      } else {
        console.log(`\n   ⚠️ נמצאו ${userIssues.length} בעיות:`);
        userIssues.forEach((issue) => console.log(`     ${issue}`));
        issues.push({ user: user.name, issues: userIssues });
      }

      console.log("\n");
    }

    // סיכום כללי
    console.log("📋 סיכום אימות:");
    console.log("=".repeat(30));

    if (allValid && issues.length === 0) {
      console.log("🎉 כל משתמשי הדמו תקינים ותואמים לטיפוסי הפרויקט!");
      console.log("✅ השאלונים כוללים את כל 10 השאלות הנדרשות");
      console.log("✅ כל הערכים תואמים לטיפוסים המותרים");
      console.log("✅ הציוד תואם למיקום האימון");
    } else {
      console.log(`❌ נמצאו בעיות ב-${issues.length} משתמשים:`);
      issues.forEach(({ user, issues: userIssues }) => {
        console.log(`\n👤 ${user}:`);
        userIssues.forEach((issue) => console.log(`   ${issue}`));
      });
    }

    return {
      valid: allValid && issues.length === 0,
      demoUsers,
      issues,
      summary: {
        totalUsers: demoUsers.length,
        validUsers: demoUsers.length - issues.length,
        issuesFound: issues.length,
      },
    };
  } catch (error) {
    console.error("❌ שגיאה באימות:", error.message);
    throw error;
  }
}

if (require.main === module) {
  validateDemoUsersCompatibility()
    .then((result) => {
      if (result.valid) {
        console.log("\n🎯 המסקנה: משתמשי הדמו מעודכנים ותואמים לפרויקט");
      } else {
        console.log("\n⚠️ המסקנה: נדרש תיקון משתמשי דמו");
      }
    })
    .catch(console.error);
}

module.exports = {
  validateDemoUsersCompatibility,
  VALID_TYPES,
  VALID_EQUIPMENT,
};
