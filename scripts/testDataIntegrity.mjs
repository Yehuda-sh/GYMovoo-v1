/**
 * בדיקת שלמות נתונים - Data Integrity Test
 * מוודא שכל המידע נשמר ונטען נכון ב-AsyncStorage
 * חשוב להריץ לפני יצירת נתוני דמו נרחבים
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

// ==========================================
// 🧪 בדיקות בסיסיות - AsyncStorage
// ==========================================

async function testBasicAsyncStorage() {
  console.log("📦 בדיקת AsyncStorage בסיסי...");

  try {
    // בדיקת כתיבה וקריאה בסיסית
    const testKey = "test_data_integrity";
    const testData = {
      timestamp: Date.now(),
      data: "test_value",
      number: 42,
      boolean: true,
      array: [1, 2, 3],
      nested: { a: 1, b: "text" },
    };

    await AsyncStorage.setItem(testKey, JSON.stringify(testData));
    const retrieved = await AsyncStorage.getItem(testKey);
    const parsed = JSON.parse(retrieved);

    // השוואת נתונים
    const isIdentical = JSON.stringify(testData) === JSON.stringify(parsed);
    console.log(`  ${isIdentical ? "✅" : "❌"} בדיקת כתיבה/קריאה בסיסית`);

    // ניקוי
    await AsyncStorage.removeItem(testKey);

    return isIdentical;
  } catch (error) {
    console.log("  ❌ שגיאה בבדיקת AsyncStorage:", error.message);
    return false;
  }
}

// ==========================================
// 👤 בדיקת נתוני משתמש
// ==========================================

async function testUserDataIntegrity() {
  console.log("👤 בדיקת נתוני משתמש...");

  const testUser = {
    id: `test_user_${Date.now()}`,
    name: "משתמש בדיקה",
    email: "test@example.com",
    age: 30,
    gender: "male",
    weight: 75,
    height: 175,
    goals: ["muscle_gain", "strength"],
    equipment: ["dumbbells", "barbell"],
    availability: ["sunday", "tuesday", "thursday"],
    sessionDuration: 60,
    isDemo: true,
    createdAt: Date.now(),
    // נתוני מנוי
    subscription: {
      type: "trial",
      startDate: Date.now(),
      expirationDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 ימים
      isActive: true,
    },
  };

  try {
    // שמירה
    await AsyncStorage.setItem("user_data", JSON.stringify(testUser));
    console.log("  ✅ שמירת נתוני משתמש הצליחה");

    // קריאה
    const saved = await AsyncStorage.getItem("user_data");
    const parsedUser = JSON.parse(saved);
    console.log("  ✅ קריאת נתוני משתמש הצליחה");

    // בדיקת שלמות נתונים
    const fieldsToCheck = [
      "id",
      "name",
      "email",
      "age",
      "gender",
      "weight",
      "height",
      "goals",
      "equipment",
      "availability",
      "sessionDuration",
      "subscription",
    ];

    let allFieldsValid = true;
    for (const field of fieldsToCheck) {
      const original = testUser[field];
      const retrieved = parsedUser[field];
      const isValid = JSON.stringify(original) === JSON.stringify(retrieved);

      console.log(
        `    ${isValid ? "✅" : "❌"} ${field}: ${isValid ? "תקין" : "לא תואם"}`
      );
      if (!isValid) {
        console.log(`      מקורי: ${JSON.stringify(original)}`);
        console.log(`      נשמר: ${JSON.stringify(retrieved)}`);
        allFieldsValid = false;
      }
    }

    return allFieldsValid;
  } catch (error) {
    console.log("  ❌ שגיאה בבדיקת נתוני משתמש:", error.message);
    return false;
  }
}

// ==========================================
// 📋 בדיקת נתוני שאלון
// ==========================================

async function testQuestionnaireDataIntegrity() {
  console.log("📋 בדיקת נתוני שאלון...");

  const questionnaireData = {
    answers: {
      personal_info: {
        age: 30,
        gender: "male",
        weight: 75,
        height: 175,
      },
      goals: ["muscle_gain", "strength"],
      gym_equipment: ["dumbbells", "barbell", "bench"],
      availability: ["sunday", "tuesday", "thursday"],
      session_duration: 60,
      experience_level: "intermediate",
    },
    metadata: {
      completedAt: Date.now(),
      version: "smart_questionnaire_v2",
      totalQuestions: 6,
      completionTime: 180, // שניות
    },
  };

  try {
    // שמירה כ-smart questionnaire
    await AsyncStorage.setItem(
      "smart_questionnaire_results",
      JSON.stringify(questionnaireData)
    );
    console.log("  ✅ שמירת שאלון חכם הצליחה");

    // שמירה כ-legacy questionnaire
    const legacyData = {
      age: questionnaireData.answers.personal_info.age,
      gender: questionnaireData.answers.personal_info.gender,
      weight: questionnaireData.answers.personal_info.weight,
      height: questionnaireData.answers.personal_info.height,
      goals: questionnaireData.answers.goals,
      equipment: questionnaireData.answers.gym_equipment,
      availability: questionnaireData.answers.availability,
      sessionDuration: questionnaireData.answers.session_duration,
    };

    await AsyncStorage.setItem(
      "questionnaire_answers",
      JSON.stringify(legacyData)
    );
    await AsyncStorage.setItem(
      "questionnaire_metadata",
      JSON.stringify(questionnaireData.metadata)
    );
    console.log("  ✅ שמירת שאלון legacy הצליחה");

    // בדיקת קריאה
    const smartResult = await AsyncStorage.getItem(
      "smart_questionnaire_results"
    );
    const legacyAnswers = await AsyncStorage.getItem("questionnaire_answers");
    const legacyMeta = await AsyncStorage.getItem("questionnaire_metadata");

    const parsedSmart = JSON.parse(smartResult);
    const parsedLegacyAnswers = JSON.parse(legacyAnswers);
    const parsedLegacyMeta = JSON.parse(legacyMeta);

    console.log("  ✅ קריאת כל סוגי השאלונים הצליחה");

    // בדיקת התאמה בין smart ל-legacy
    const smartAnswers = parsedSmart.answers;
    const compatibility = {
      age: smartAnswers.personal_info.age === parsedLegacyAnswers.age,
      gender: smartAnswers.personal_info.gender === parsedLegacyAnswers.gender,
      weight: smartAnswers.personal_info.weight === parsedLegacyAnswers.weight,
      height: smartAnswers.personal_info.height === parsedLegacyAnswers.height,
      goals:
        JSON.stringify(smartAnswers.goals) ===
        JSON.stringify(parsedLegacyAnswers.goals),
      equipment:
        JSON.stringify(smartAnswers.gym_equipment) ===
        JSON.stringify(parsedLegacyAnswers.equipment),
    };

    const allCompatible = Object.values(compatibility).every((v) => v);
    console.log(`  ${allCompatible ? "✅" : "❌"} תאימות smart ↔ legacy`);

    if (!allCompatible) {
      Object.entries(compatibility).forEach(([key, isValid]) => {
        console.log(`    ${isValid ? "✅" : "❌"} ${key}`);
      });
    }

    return allCompatible;
  } catch (error) {
    console.log("  ❌ שגיאה בבדיקת נתוני שאלון:", error.message);
    return false;
  }
}

// ==========================================
// 🏋️ בדיקת תוכניות אימון
// ==========================================

async function testWorkoutPlansIntegrity() {
  console.log("🏋️ בדיקת תוכניות אימון...");

  const workoutPlans = {
    basic: {
      id: "basic_plan_test",
      name: "תוכנית בסיסית",
      type: "basic",
      description: "תוכנית אימון בסיסית על בסיס מטרה ומשקל בלבד",
      daysPerWeek: 3,
      estimatedDuration: 45,
      workouts: [
        {
          name: "אימון גוף עליון",
          type: "strength",
          estimatedCalories: 250,
          exercises: [
            {
              id: "pushup",
              name: "שכיבות סמיכה",
              equipment: "none",
              sets: 3,
              reps: 15,
              restTime: 60,
            },
            {
              id: "squat",
              name: "כפיפות ברכיים",
              equipment: "none",
              sets: 3,
              reps: 20,
              restTime: 60,
            },
          ],
        },
      ],
      createdAt: Date.now(),
    },
    smart: {
      id: "smart_plan_test",
      name: "תוכנית חכמה",
      type: "smart",
      description: "תוכנית אימון מותאמת אישית על בסיס כל הפרמטרים",
      daysPerWeek: 4,
      estimatedDuration: 60,
      workouts: [
        {
          name: "חזה וטריצפס",
          type: "strength",
          estimatedCalories: 350,
          exercises: [
            {
              id: "bench_press",
              name: "הרחקות בספסל",
              equipment: "barbell",
              sets: 4,
              reps: 8,
              weight: 70,
              restTime: 90,
            },
            {
              id: "tricep_dips",
              name: "דיפים לטריצפס",
              equipment: "none",
              sets: 3,
              reps: 12,
              restTime: 60,
            },
          ],
        },
      ],
      createdAt: Date.now(),
    },
  };

  try {
    // שמירת תוכניות
    await AsyncStorage.setItem("workout_plans", JSON.stringify(workoutPlans));
    console.log("  ✅ שמירת תוכניות אימון הצליחה");

    // קריאת תוכניות
    const saved = await AsyncStorage.getItem("workout_plans");
    const parsed = JSON.parse(saved);
    console.log("  ✅ קריאת תוכניות אימון הצליחה");

    // בדיקת מבנה
    const hasBasic = parsed.basic && parsed.basic.type === "basic";
    const hasSmart = parsed.smart && parsed.smart.type === "smart";
    const basicHasWorkouts = parsed.basic?.workouts?.length > 0;
    const smartHasWorkouts = parsed.smart?.workouts?.length > 0;

    console.log(`  ${hasBasic ? "✅" : "❌"} תוכנית בסיסית קיימת`);
    console.log(`  ${hasSmart ? "✅" : "❌"} תוכנית חכמה קיימת`);
    console.log(
      `  ${basicHasWorkouts ? "✅" : "❌"} תוכנית בסיסית מכילה אימונים`
    );
    console.log(
      `  ${smartHasWorkouts ? "✅" : "❌"} תוכנית חכמה מכילה אימונים`
    );

    // בדיקת תרגילים
    if (basicHasWorkouts) {
      const basicExercises = parsed.basic.workouts[0].exercises;
      const hasExerciseStructure = basicExercises.every(
        (ex) =>
          ex.id && ex.name && ex.equipment !== undefined && ex.sets && ex.reps
      );
      console.log(
        `  ${hasExerciseStructure ? "✅" : "❌"} מבנה תרגילים בסיסי תקין`
      );
    }

    if (smartHasWorkouts) {
      const smartExercises = parsed.smart.workouts[0].exercises;
      const hasAdvancedStructure = smartExercises.every(
        (ex) =>
          ex.id && ex.name && ex.equipment !== undefined && ex.sets && ex.reps
      );
      console.log(
        `  ${hasAdvancedStructure ? "✅" : "❌"} מבנה תרגילים מתקדם תקין`
      );
    }

    return hasBasic && hasSmart && basicHasWorkouts && smartHasWorkouts;
  } catch (error) {
    console.log("  ❌ שגיאה בבדיקת תוכניות אימון:", error.message);
    return false;
  }
}

// ==========================================
// 📈 בדיקת היסטוריית אימונים
// ==========================================

async function testWorkoutHistoryIntegrity() {
  console.log("📈 בדיקת היסטוריית אימונים...");

  const historyEntry = {
    id: `workout_${Date.now()}`,
    planId: "smart_plan_test",
    workoutName: "חזה וטריצפס",
    date: Date.now(),
    duration: 65, // דקות
    caloriesBurned: 320,
    exercises: [
      {
        id: "bench_press",
        name: "הרחקות בספסל",
        sets: [
          { set: 1, reps: 8, weight: 70, restTime: 90, completed: true },
          { set: 2, reps: 8, weight: 70, restTime: 90, completed: true },
          { set: 3, reps: 7, weight: 70, restTime: 90, completed: true },
          { set: 4, reps: 6, weight: 70, restTime: 120, completed: true },
        ],
      },
      {
        id: "tricep_dips",
        name: "דיפים לטריצפס",
        sets: [
          { set: 1, reps: 12, weight: 0, restTime: 60, completed: true },
          { set: 2, reps: 11, weight: 0, restTime: 60, completed: true },
          { set: 3, reps: 10, weight: 0, restTime: 90, completed: true },
        ],
      },
    ],
    notes: "אימון מעולה, הגדלתי משקל בהרחקות",
    rating: 4,
    completed: true,
  };

  try {
    // קריאת היסטוריה קיימת
    const existingHistory = await AsyncStorage.getItem("workout_history");
    const history = existingHistory ? JSON.parse(existingHistory) : [];

    // הוספת רשומה חדשה
    history.push(historyEntry);

    // שמירה
    await AsyncStorage.setItem("workout_history", JSON.stringify(history));
    console.log("  ✅ שמירת היסטוריית אימונים הצליחה");

    // קריאה וולידציה
    const saved = await AsyncStorage.getItem("workout_history");
    const parsedHistory = JSON.parse(saved);

    const lastEntry = parsedHistory[parsedHistory.length - 1];
    const isValid =
      lastEntry.id === historyEntry.id &&
      lastEntry.exercises.length === historyEntry.exercises.length &&
      lastEntry.completed === historyEntry.completed;

    console.log(`  ${isValid ? "✅" : "❌"} מבנה היסטוריה תקין`);
    console.log(`  📊 סה"כ רשומות בהיסטוריה: ${parsedHistory.length}`);

    return isValid;
  } catch (error) {
    console.log("  ❌ שגיאה בבדיקת היסטוריית אימונים:", error.message);
    return false;
  }
}

// ==========================================
// 🔄 בדיקת סנכרון כללית
// ==========================================

async function testDataSynchronization() {
  console.log("🔄 בדיקת סנכרון נתונים...");

  try {
    // קריאת כל הנתונים
    const userData = await AsyncStorage.getItem("user_data");
    const smartQuestionnaire = await AsyncStorage.getItem(
      "smart_questionnaire_results"
    );
    const legacyQuestionnaire = await AsyncStorage.getItem(
      "questionnaire_answers"
    );
    const workoutPlans = await AsyncStorage.getItem("workout_plans");
    const workoutHistory = await AsyncStorage.getItem("workout_history");

    const user = userData ? JSON.parse(userData) : null;
    const smartQ = smartQuestionnaire ? JSON.parse(smartQuestionnaire) : null;
    const legacyQ = legacyQuestionnaire
      ? JSON.parse(legacyQuestionnaire)
      : null;
    const plans = workoutPlans ? JSON.parse(workoutPlans) : null;
    const history = workoutHistory ? JSON.parse(workoutHistory) : null;

    console.log(`  ${user ? "✅" : "❌"} נתוני משתמש קיימים`);
    console.log(`  ${smartQ ? "✅" : "❌"} שאלון חכם קיים`);
    console.log(`  ${legacyQ ? "✅" : "❌"} שאלון legacy קיים`);
    console.log(`  ${plans ? "✅" : "❌"} תוכניות אימון קיימות`);
    console.log(`  ${history ? "✅" : "❌"} היסטוריית אימונים קיימת`);

    // בדיקת עקביות נתונים
    if (user && smartQ && legacyQ) {
      const userGoals = JSON.stringify(user.goals?.sort());
      const smartGoals = JSON.stringify(smartQ.answers.goals?.sort());
      const legacyGoals = JSON.stringify(legacyQ.goals?.sort());

      const goalsConsistent =
        userGoals === smartGoals && smartGoals === legacyGoals;
      console.log(
        `  ${goalsConsistent ? "✅" : "❌"} עקביות מטרות בין המקורות`
      );

      if (!goalsConsistent) {
        console.log(`    משתמש: ${userGoals}`);
        console.log(`    שאלון חכם: ${smartGoals}`);
        console.log(`    שאלון legacy: ${legacyGoals}`);
      }
    }

    return user && smartQ && legacyQ && plans && history;
  } catch (error) {
    console.log("  ❌ שגיאה בבדיקת סנכרון:", error.message);
    return false;
  }
}

// ==========================================
// 🏃‍♂️ הרצת כל הבדיקות
// ==========================================

async function runDataIntegrityTests() {
  console.log("🧪 תחילת בדיקת שלמות נתונים\n");
  console.log("=================================");

  const results = {};

  // ריצת כל הבדיקות
  results.basicStorage = await testBasicAsyncStorage();
  console.log("");

  results.userData = await testUserDataIntegrity();
  console.log("");

  results.questionnaireData = await testQuestionnaireDataIntegrity();
  console.log("");

  results.workoutPlans = await testWorkoutPlansIntegrity();
  console.log("");

  results.workoutHistory = await testWorkoutHistoryIntegrity();
  console.log("");

  results.synchronization = await testDataSynchronization();
  console.log("");

  // סיכום
  console.log("=================================");
  console.log("📋 סיכום בדיקת שלמות נתונים:");
  console.log("=================================");

  const testResults = [
    ["AsyncStorage בסיסי", results.basicStorage],
    ["נתוני משתמש", results.userData],
    ["נתוני שאלון", results.questionnaireData],
    ["תוכניות אימון", results.workoutPlans],
    ["היסטוריית אימונים", results.workoutHistory],
    ["סנכרון נתונים", results.synchronization],
  ];

  testResults.forEach(([testName, passed]) => {
    console.log(`${passed ? "✅" : "❌"} ${testName}`);
  });

  const allPassed = Object.values(results).every((result) => result);

  console.log("");
  if (allPassed) {
    console.log("🎉 כל הבדיקות עברו בהצלחה!");
    console.log("✅ המערכת מוכנה ליצירת נתוני דמו נרחבים");
  } else {
    console.log("⚠️  יש בעיות שיש לתקן לפני המשך:");
    const failedTests = testResults
      .filter(([, passed]) => !passed)
      .map(([testName]) => testName);
    failedTests.forEach((test) => console.log(`   - ${test}`));
  }

  return results;
}

// ייצוא הפונקציה הראשית
export { runDataIntegrityTests };

// אם מריצים ישירות
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (import.meta.url === `file://${process.argv[1]}`) {
  runDataIntegrityTests().catch(console.error);
}
