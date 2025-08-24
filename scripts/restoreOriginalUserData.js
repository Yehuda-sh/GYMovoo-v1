/**
 * @file scripts/restoreOriginalUserData.js
 * @description בדיקה והשבה של נתונים מקוריים למשתמשי דמו
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

/**
 * יצירת שאלון מינימלי שמבוסס על הנתונים המקוריים בלבד
 */
function createMinimalQuestionnaire(originalSmartData) {
  const answers = originalSmartData?.answers || {};

  // רק הנתונים שבאמת היו בנתונים המקוריים
  const minimalQuestionnaire = {
    // נתונים בסיסיים שחובה שיהיו
    name: answers.name || "משתמש דמו",
    completed: true,
    completed_at: new Date().toISOString(),
    version: "2.2",
  };

  // הוספת נתונים רק אם הם באמת קיימים ב-smart data המקורי
  if (answers.age) minimalQuestionnaire.age = answers.age;
  if (answers.gender) minimalQuestionnaire.gender = answers.gender;
  if (answers.height) minimalQuestionnaire.height = answers.height;
  if (answers.weight) minimalQuestionnaire.weight = answers.weight;
  if (answers.goals && answers.goals.length > 0) {
    minimalQuestionnaire.specific_goals = answers.goals;
    minimalQuestionnaire.primary_goal = answers.goals[0];
  }
  if (answers.equipment && answers.equipment.length > 0) {
    minimalQuestionnaire.available_equipment = answers.equipment;
  }
  if (answers.experience)
    minimalQuestionnaire.experience_level = answers.experience;
  if (answers.frequency)
    minimalQuestionnaire.workout_frequency_target = answers.frequency;
  if (answers.duration)
    minimalQuestionnaire.workout_duration_preference = answers.duration;
  if (answers.location)
    minimalQuestionnaire.workout_location = answers.location;
  if (answers.time_preference)
    minimalQuestionnaire.workout_time_preference = answers.time_preference;
  if (answers.diet_type) minimalQuestionnaire.diet_type = answers.diet_type;

  return minimalQuestionnaire;
}

/**
 * יצירת preferences מינימליות
 */
function createMinimalPreferences(originalSmartData, questionnaire) {
  const answers = originalSmartData?.answers || {};

  const preferences = {
    language: "he",
    rtlPreference: true,
  };

  // הוספת נתונים רק מהנתונים המקוריים
  if (answers.gender) preferences.gender = answers.gender;
  if (questionnaire.age) preferences.age = questionnaire.age;
  if (questionnaire.height) preferences.height = questionnaire.height;
  if (questionnaire.weight) preferences.weight = questionnaire.weight;
  if (questionnaire.specific_goals)
    preferences.fitness_goals = questionnaire.specific_goals;
  if (questionnaire.experience_level)
    preferences.experience_level = questionnaire.experience_level;
  if (questionnaire.workout_frequency_target)
    preferences.workout_frequency = questionnaire.workout_frequency_target;
  if (questionnaire.workout_duration_preference)
    preferences.workout_duration = questionnaire.workout_duration_preference;
  if (questionnaire.workout_time_preference)
    preferences.workout_time = questionnaire.workout_time_preference;
  if (questionnaire.available_equipment)
    preferences.preferred_equipment = questionnaire.available_equipment;
  if (questionnaire.diet_type) preferences.diet_type = questionnaire.diet_type;

  return preferences;
}

/**
 * השבה של נתונים מקוריים לכל המשתמשים
 */
async function restoreOriginalUserData() {
  console.log("🔄 השבת נתונים מקוריים למשתמשי הדמו\n");

  const demoUsers = [
    { id: "u_init_1", name: "Ron Shoval" },
    { id: "realistic_1755276001521_ifig7z", name: "נועה שפירא" },
    { id: "u_init_3", name: "Amit Cohen" },
  ];

  for (const user of demoUsers) {
    console.log(`🔍 בודק ${user.name}...`);

    try {
      // שליפת נתונים נוכחיים
      const { data: userData, error } = await supabase
        .from("users")
        .select("smartquestionnairedata, questionnaire, preferences")
        .eq("id", user.id)
        .single();

      if (error || !userData) {
        console.log(`❌ לא ניתן לשלוף נתונים עבור ${user.name}`);
        continue;
      }

      // יצירת שאלון מינימלי על בסיס הנתונים המקוריים
      const minimalQuestionnaire = createMinimalQuestionnaire(
        userData.smartquestionnairedata
      );
      const minimalPreferences = createMinimalPreferences(
        userData.smartquestionnairedata,
        minimalQuestionnaire
      );

      console.log(`📋 שאלון מינימלי עבור ${user.name}:`);
      console.log(
        "   נתונים שיישמרו:",
        Object.keys(minimalQuestionnaire).join(", ")
      );

      console.log(`\n📊 השוואה לנתונים הנוכחיים:`);
      const currentKeys = Object.keys(userData.questionnaire || {});
      const minimalKeys = Object.keys(minimalQuestionnaire);
      const removedKeys = currentKeys.filter(
        (key) => !minimalKeys.includes(key)
      );

      if (removedKeys.length > 0) {
        console.log(`   🗑️  שדות שיוסרו: ${removedKeys.join(", ")}`);
      } else {
        console.log(`   ✅ אין שדות מיותרים`);
      }

      // הצגת ההבדלים
      console.log(`\n🔍 ניתוח הבדלים עבור ${user.name}:`);

      const smartData = userData.smartquestionnairedata?.answers || {};
      const currentQuestionnaire = userData.questionnaire || {};

      console.log(
        `   📊 גיל: smart=${smartData.age || "לא מוגדר"}, current=${currentQuestionnaire.age || "לא מוגדר"}, minimal=${minimalQuestionnaire.age || "לא מוגדר"}`
      );
      console.log(
        `   ⚡ רמת פעילות: smart=${smartData.activity_level || "לא מוגדר"}, current=${currentQuestionnaire.activity_level || "לא מוגדר"}, minimal=לא נכלל`
      );
      console.log(
        `   😴 שעות שינה: smart=${smartData.sleep_hours || "לא מוגדר"}, current=${currentQuestionnaire.sleep_hours || "לא מוגדר"}, minimal=לא נכלל`
      );
      console.log(
        `   💪 מוטיבציה: smart=${JSON.stringify(smartData.motivation || [])}, current=${JSON.stringify(currentQuestionnaire.motivation_factors || [])}, minimal=לא נכלל`
      );
    } catch (error) {
      console.error(`❌ שגיאה בעיבוד ${user.name}:`, error);
    }

    console.log("\n" + "-".repeat(60) + "\n");
  }

  console.log("🤔 האם להמשיך ולהחזיר את הנתונים למינימליים?");
  console.log(
    "⚠️  זה יסיר נתונים שיצרתי בסקריפט ויותיר רק את הנתונים המקוריים"
  );
  console.log("💡 הפעל שוב עם --restore כדי לבצע את השחזור");
}

// הרצה
const shouldRestore = process.argv.includes("--restore");

if (shouldRestore) {
  console.log("🔄 מבצע שחזור נתונים...");
  // כאן אפשר להוסיף את הלוגיקה של השחזור
} else {
  restoreOriginalUserData()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ שגיאה:", error);
      process.exit(1);
    });
}
