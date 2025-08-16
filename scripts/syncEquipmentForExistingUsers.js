/**
 * @file syncEquipmentForExistingUsers.js
 * @description סקריפט לסנכרון ציוד למשתמשים קיימים
 * @date 2025-08-16
 */

// טעינת dotenv לקריאת קובץ .env
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

// 🔗 חיבור ל-Supabase
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ משתני סביבה חסרים עבור Supabase");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 🎯 מיפוי ציוד לפי מיקום (מתחם unifiedQuestionnaire.ts)
const WORKOUT_LOCATION_EQUIPMENT = {
  gym: [
    "barbells",
    "dumbbells",
    "cable_machines",
    "squat_rack",
    "leg_press",
    "bench",
    "lat_pulldown",
    "chest_press",
    "smith_machine",
    "preacher_curl",
  ],
  home_equipment: [
    "dumbbells",
    "resistance_bands",
    "kettlebell",
    "pull_up_bar",
    "yoga_mat",
    "exercise_ball",
    "foam_roller",
  ],
  home_bodyweight: ["yoga_mat", "water_bottles", "towel"],
  outdoor: ["yoga_mat", "water_bottles", "towel"],
};

/**
 * 🔧 יצירת ציוד מותאם למיקום אימון
 */
function generateLocationBasedEquipment(workoutLocation, experienceLevel) {
  const baseEquipment = WORKOUT_LOCATION_EQUIPMENT[workoutLocation] || [];

  // התאמה לרמת ניסיון
  if (experienceLevel === "beginner") {
    // מתחילים - ציוד בסיסי
    return baseEquipment.slice(0, 3);
  } else if (experienceLevel === "intermediate") {
    // בינוניים - יותר ציוד
    return baseEquipment.slice(0, 5);
  } else {
    // מתקדמים - כל הציוד
    return baseEquipment;
  }
}

/**
 * 🔍 בדיקה אם משתמש זקוק לעדכון ציוד
 */
function needsEquipmentUpdate(user) {
  const smartAnswers = user.smartquestionnairedata?.answers;
  if (!smartAnswers) return true; // אין שאלון חכם - צריך עדכון

  const workoutLocation = smartAnswers.workout_location;
  const currentEquipment = getExistingEquipment(user);

  // אם אין ציוד בכלל
  if (!currentEquipment || currentEquipment.length === 0) {
    return true;
  }

  // אם הציוד לא מותאם למיקום
  const expectedEquipment = WORKOUT_LOCATION_EQUIPMENT[workoutLocation] || [];
  const hasLocationBasedEquipment = expectedEquipment.some((item) =>
    currentEquipment.includes(item)
  );

  return !hasLocationBasedEquipment;
}

/**
 * 🔍 קבלת ציוד קיים מכל השדות האפשריים
 */
function getExistingEquipment(user) {
  const smartAnswers = user.smartquestionnairedata?.answers || {};
  const preferences = user.preferences || {};

  // בדוק בכל השדות האפשריים
  const equipment = [
    ...(smartAnswers.gym_equipment || []),
    ...(smartAnswers.home_equipment || []),
    ...(smartAnswers.bodyweight_equipment || []),
    ...(smartAnswers.equipment || []),
    ...(preferences.preferred_equipment || []),
  ];

  return [...new Set(equipment)]; // הסר כפילויות
}

/**
 * 🔄 עדכון ציוד למשתמש ספציפי
 */
async function updateUserEquipment(user) {
  const smartAnswers = user.smartquestionnairedata?.answers || {};
  const workoutLocation = smartAnswers.workout_location || "home_bodyweight";
  const experienceLevel = smartAnswers.experience_level || "beginner";

  // יצור ציוד חדש מותאם
  const newEquipment = generateLocationBasedEquipment(
    workoutLocation,
    experienceLevel
  );

  // עדכן בהתאם למיקום
  const updatedAnswers = { ...smartAnswers };

  if (workoutLocation === "gym") {
    updatedAnswers.gym_equipment = newEquipment;
  } else if (workoutLocation === "home_equipment") {
    updatedAnswers.home_equipment = newEquipment;
  } else if (workoutLocation === "home_bodyweight") {
    updatedAnswers.bodyweight_equipment = newEquipment;
  }

  // עדכן גם שדה כללי לתאימות לאחור
  updatedAnswers.equipment = newEquipment;

  // עדכן ב-preferences
  const updatedPreferences = {
    ...user.preferences,
    preferred_equipment: newEquipment,
  };

  const updateData = {
    smartquestionnairedata: {
      ...user.smartquestionnairedata,
      answers: updatedAnswers,
    },
    preferences: updatedPreferences,
  };

  const { error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", user.id);

  if (error) {
    console.error(`❌ שגיאה בעדכון ${user.name}:`, error.message);
    return false;
  }

  console.log(`✅ עודכן ${user.name}:`);
  console.log(`   📍 מיקום: ${workoutLocation}`);
  console.log(`   💪 רמה: ${experienceLevel}`);
  console.log(`   🔧 ציוד חדש: ${newEquipment.join(", ")}`);

  return true;
}

/**
 * 🚀 פונקציה ראשית - סנכרון ציוד לכל המשתמשים
 */
async function syncEquipmentForAllUsers() {
  console.log("🔄 מתחיל סנכרון ציוד למשתמשים קיימים...\n");

  try {
    // קבל את כל המשתמשים
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("❌ שגיאה בקבלת משתמשים:", error.message);
      return;
    }

    console.log(`📊 נמצאו ${users.length} משתמשים בסה"כ\n`);

    let needsUpdate = 0;
    let successful = 0;
    let failed = 0;

    // בדוק כל משתמש
    for (const user of users) {
      if (needsEquipmentUpdate(user)) {
        needsUpdate++;
        console.log(`🔧 ${user.name} זקוק לעדכון ציוד...`);

        const success = await updateUserEquipment(user);
        if (success) {
          successful++;
        } else {
          failed++;
        }
        console.log(""); // רווח
      } else {
        console.log(`✅ ${user.name} - ציוד מעודכן`);
      }
    }

    // סיכום
    console.log("\n📋 סיכום הסנכרון:");
    console.log(`   👥 סה"כ משתמשים: ${users.length}`);
    console.log(`   🔧 זקוקים לעדכון: ${needsUpdate}`);
    console.log(`   ✅ עודכנו בהצלחה: ${successful}`);
    console.log(`   ❌ כשלו: ${failed}`);

    if (failed === 0) {
      console.log("\n🎉 הסנכרון הושלם בהצלחה!");
    } else {
      console.log(`\n⚠️ יש ${failed} כשלונות - בדוק את הלוגים`);
    }
  } catch (error) {
    console.error("❌ שגיאה כללית:", error);
  }
}

// 🚀 הפעלה
if (require.main === module) {
  syncEquipmentForAllUsers();
}

module.exports = { syncEquipmentForAllUsers };
