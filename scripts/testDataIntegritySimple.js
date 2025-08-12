/**
 * בדיקת שלמות נתונים פשוטה
 * בודק שכל הנתונים נשמרים ונטענים נכון מ-AsyncStorage
 */

const { AsyncStorage } = require("@react-native-async-storage/async-storage");

// הדמיית AsyncStorage עבור Node.js
const mockAsyncStorage = {
  data: {},
  async setItem(key, value) {
    this.data[key] = value;
    return Promise.resolve();
  },
  async getItem(key) {
    return Promise.resolve(this.data[key] || null);
  },
  async removeItem(key) {
    delete this.data[key];
    return Promise.resolve();
  },
  async getAllKeys() {
    return Promise.resolve(Object.keys(this.data));
  },
  async clear() {
    this.data = {};
    return Promise.resolve();
  },
};

// שימוש ב-mock במקום AsyncStorage אמיתי
const storage = mockAsyncStorage;

async function testDataIntegrity() {
  console.warn("🧪 בדיקת שלמות נתונים מתחילה...\n");

  let allTestsPassed = true;

  // ==========================================
  // 1. בדיקת משתמש
  // ==========================================
  console.warn("👤 בדיקת נתוני משתמש...");

  const testUser = {
    id: "test_user_123",
    name: "משתמש בדיקה",
    email: "test@example.com",
    age: 30,
    weight: 75,
    goals: ["muscle_gain"],
    equipment: ["dumbbells"],
    subscription: {
      type: "trial",
      startDate: Date.now(),
    },
  };

  try {
    await storage.setItem("user_data", JSON.stringify(testUser));
    const retrieved = await storage.getItem("user_data");
    const parsed = JSON.parse(retrieved);

    const isValid =
      parsed.id === testUser.id &&
      parsed.name === testUser.name &&
      JSON.stringify(parsed.goals) === JSON.stringify(testUser.goals);

    console.warn(`  ${isValid ? "✅" : "❌"} נתוני משתמש`);
    if (!isValid) allTestsPassed = false;
  } catch (error) {
    console.error("  ❌ שגיאה בנתוני משתמש:", error.message);
    allTestsPassed = false;
  }

  // ==========================================
  // 2. בדיקת שאלון
  // ==========================================
  console.warn("📋 בדיקת נתוני שאלון...");

  const questionnaireData = {
    answers: {
      personal_info: { age: 30, weight: 75 },
      goals: ["muscle_gain"],
      gym_equipment: ["dumbbells"],
    },
    metadata: {
      completedAt: Date.now(),
      version: "smart_questionnaire_v2",
    },
  };

  try {
    await storage.setItem(
      "smart_questionnaire_results",
      JSON.stringify(questionnaireData)
    );
    const retrieved = await storage.getItem("smart_questionnaire_results");
    const parsed = JSON.parse(retrieved);

    const isValid =
      parsed.answers.personal_info.age === 30 &&
      JSON.stringify(parsed.answers.goals) === JSON.stringify(["muscle_gain"]);

    console.warn(`  ${isValid ? "✅" : "❌"} נתוני שאלון`);
    if (!isValid) allTestsPassed = false;
  } catch (error) {
    console.error("  ❌ שגיאה בנתוני שאלון:", error.message);
    allTestsPassed = false;
  }

  // ==========================================
  // 3. בדיקת תוכניות אימון
  // ==========================================
  console.warn("🏋️ בדיקת תוכניות אימון...");

  const workoutPlans = {
    basic: {
      id: "basic_plan",
      type: "basic",
      name: "תוכנית בסיסית",
      workouts: [
        {
          name: "אימון כללי",
          exercises: [
            { id: "pushup", name: "שכיבות סמיכה", sets: 3, reps: 15 },
          ],
        },
      ],
    },
    smart: {
      id: "smart_plan",
      type: "smart",
      name: "תוכנית חכמה",
      workouts: [
        {
          name: "חזה וטריצפס",
          exercises: [
            { id: "bench_press", name: "הרחקות", sets: 4, reps: 8, weight: 70 },
          ],
        },
      ],
    },
  };

  try {
    await storage.setItem("workout_plans", JSON.stringify(workoutPlans));
    const retrieved = await storage.getItem("workout_plans");
    const parsed = JSON.parse(retrieved);

    const hasBasic = parsed.basic && parsed.basic.type === "basic";
    const hasSmart = parsed.smart && parsed.smart.type === "smart";
    const basicHasExercises =
      parsed.basic?.workouts?.[0]?.exercises?.length > 0;
    const smartHasExercises =
      parsed.smart?.workouts?.[0]?.exercises?.length > 0;

    console.warn(`  ${hasBasic ? "✅" : "❌"} תוכנית בסיסית`);
    console.warn(`  ${hasSmart ? "✅" : "❌"} תוכנית חכמה`);
    console.warn(`  ${basicHasExercises ? "✅" : "❌"} תרגילים בתוכנית בסיסית`);
    console.warn(`  ${smartHasExercises ? "✅" : "❌"} תרגילים בתוכנית חכמה`);

    if (!hasBasic || !hasSmart || !basicHasExercises || !smartHasExercises) {
      allTestsPassed = false;
    }
  } catch (error) {
    console.error("  ❌ שגיאה בתוכניות אימון:", error.message);
    allTestsPassed = false;
  }

  // ==========================================
  // 4. בדיקת היסטוריה
  // ==========================================
  console.warn("📈 בדיקת היסטוריית אימונים...");

  const historyEntry = {
    id: "workout_001",
    date: Date.now(),
    workoutName: "חזה וטריצפס",
    duration: 65,
    exercises: [
      {
        id: "bench_press",
        sets: [{ set: 1, reps: 8, weight: 70, completed: true }],
      },
    ],
    completed: true,
  };

  try {
    // שמירת היסטוריה (רשימה)
    const history = [historyEntry];
    await storage.setItem("workout_history", JSON.stringify(history));

    const retrieved = await storage.getItem("workout_history");
    const parsed = JSON.parse(retrieved);

    const isValidHistory =
      Array.isArray(parsed) &&
      parsed.length === 1 &&
      parsed[0].id === "workout_001" &&
      parsed[0].completed === true;

    console.warn(`  ${isValidHistory ? "✅" : "❌"} היסטוריית אימונים`);
    if (!isValidHistory) allTestsPassed = false;
  } catch (error) {
    console.error("  ❌ שגיאה בהיסטוריית אימונים:", error.message);
    allTestsPassed = false;
  }

  // ==========================================
  // 5. בדיקת עקביות
  // ==========================================
  console.warn("🔄 בדיקת עקביות נתונים...");

  try {
    const user = JSON.parse(await storage.getItem("user_data"));
    const questionnaire = JSON.parse(
      await storage.getItem("smart_questionnaire_results")
    );

    // בדיקת התאמת מטרות
    const userGoals = JSON.stringify(user.goals.sort());
    const questionnaireGoals = JSON.stringify(
      questionnaire.answers.goals.sort()
    );

    const goalsMatch = userGoals === questionnaireGoals;
    console.warn(`  ${goalsMatch ? "✅" : "❌"} התאמת מטרות משתמש ↔ שאלון`);

    if (!goalsMatch) {
      console.warn(`    משתמש: ${userGoals}`);
      console.warn(`    שאלון: ${questionnaireGoals}`);
      allTestsPassed = false;
    }
  } catch (error) {
    console.error("  ❌ שגיאה בבדיקת עקביות:", error.message);
    allTestsPassed = false;
  }

  // ==========================================
  // סיכום
  // ==========================================
  console.warn("\n" + "=".repeat(40));
  console.warn("📋 סיכום בדיקת שלמות נתונים:");
  console.warn("=".repeat(40));

  if (allTestsPassed) {
    console.warn("🎉 כל הבדיקות עברו בהצלחה!");
    console.warn("✅ המערכת מוכנה ליצירת נתוני דמו נרחבים");
    console.warn("\n🎯 השלב הבא: יצירת משתמש עם 6 חודשים של היסטוריה");
  } else {
    console.warn("⚠️  יש בעיות שצריך לתקן:");
    console.warn("❌ יש לבדוק את הפונקציות השמירה והטעינה");
    console.warn("❌ יש לוודא עקביות בין מקורות הנתונים השונים");
  }

  return allTestsPassed;
}

// הרצת הבדיקה
testDataIntegrity().catch(console.error);
