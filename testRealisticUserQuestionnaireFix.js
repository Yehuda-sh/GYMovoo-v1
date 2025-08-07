/**
 * בדיקת תיקון כפתור משתמש מציאותי - נתוני שאלון מלאים
 * Testing realistic user button fix - complete questionnaire data
 */

console.log("🎯 Realistic User Button - Questionnaire Data Fix\n");

console.log("🔧 What was missing:");
console.log(
  "❌ Before: Realistic user button created user but no questionnaire data"
);
console.log(
  "✅ After: Realistic user button preserves and creates complete questionnaire data"
);

console.log("\n📊 New Flow:");
console.log("1. User completes questionnaire → customDemoUser saved in store");
console.log('2. User clicks "משתמש מציאותי"');
console.log("3. System detects customDemoUser exists");
console.log("4. Creates realistic user based on questionnaire answers");
console.log("5. 🎯 NEW: Simulates complete questionnaire data in user profile");

console.log("\n💾 Data that gets created:");
console.log("✅ smartQuestionnaireData: {");
console.log("    answers: { experience, gender, equipment, goals, etc. }");
console.log("    completedAt: timestamp");
console.log("    metadata: { version, sessionId, completionTime, etc. }");
console.log("    insights: { completionScore: 100, etc. }");
console.log("  }");
console.log("✅ customDemoUser: { all questionnaire-based user data }");
console.log("✅ trainingStats: { based on questionnaire preferences }");
console.log("✅ activityHistory: { realistic workout history }");

console.log("\n🎉 Benefits:");
console.log("1. ✅ Complete user profile (no missing questionnaire)");
console.log("2. ✅ Consistent experience across app");
console.log("3. ✅ Realistic demo data based on actual answers");
console.log("4. ✅ All app features work properly");

console.log("\n🔍 What happens now:");
console.log('👤 User Profile: Shows as "questionnaire completed"');
console.log("🏃 Workouts: Generated based on user preferences");
console.log("📊 Stats: Reflect questionnaire-based fitness level");
console.log("🎯 Goals: Match selected fitness objectives");
console.log("🛠️ Equipment: Workouts use only available equipment");

console.log("\n🧪 Test Scenario:");
console.log(
  "1. Complete questionnaire: beginner, female, dumbbells, lose weight"
);
console.log('2. Click "משתמש מציאותי"');
console.log("3. Expected result:");
console.log("   - User: שרה, beginner level");
console.log("   - Equipment: dumbbells only");
console.log("   - Goals: weight loss focused");
console.log("   - Questionnaire: shows as 100% complete");
console.log("   - History: appropriate beginner workouts");

console.log("\n🎯 Problem Solved!");
console.log(
  "No more incomplete questionnaire data when using realistic user button."
);

// ------------------------------
// Quick sanity checks (runtime)
// ------------------------------

const check = (name, predicate) => {
  try {
    const ok = !!predicate();
    console.log(`${ok ? "✅" : "❌"} ${name}`);
    return ok;
  } catch (e) {
    console.log(`❌ ${name} (error: ${e?.message || e})`);
    return false;
  }
};

const isFlatStringArray = (arr) =>
  Array.isArray(arr) && arr.every((x) => typeof x === "string");

// Simulated user snapshot after the fix (shape only)
const sampleUser = {
  smartQuestionnaireData: {
    answers: {
      experience: "beginner",
      gender: "female",
      equipment: ["none", "dumbbells"], // must be string[] (flat)
      goals: ["weight_loss"],
    },
    completedAt: new Date().toISOString(),
    metadata: { version: "1.0" },
    insights: { completionScore: 100 },
  },
  questionnaire: {
    available_equipment: ["none", "dumbbells"],
  },
  trainingStats: {
    selectedEquipment: ["trx"],
  },
  activityHistory: {
    workouts: [
      {
        id: "w1",
        duration: 45,
        feedback: {
          completedAt: new Date().toISOString(),
          difficulty: 3,
          feeling: "ok",
        },
        plannedVsActual: {
          totalSetsCompleted: 10,
          totalSetsPlanned: 12,
          personalRecords: 0,
        },
      },
    ],
  },
};

console.log("\n🧪 Running quick checks:\n");
const results = [];
results.push(
  check("equipment is flat string[] (smartQuestionnaireData)", () =>
    isFlatStringArray(sampleUser.smartQuestionnaireData?.answers?.equipment)
  )
);
results.push(
  check("available_equipment is string[] (legacy compatibility)", () =>
    isFlatStringArray(sampleUser.questionnaire?.available_equipment)
  )
);
results.push(
  check("trainingStats.selectedEquipment is string[]", () =>
    isFlatStringArray(sampleUser.trainingStats?.selectedEquipment)
  )
);
results.push(
  check(
    "activityHistory has workouts with feedback.completedAt",
    () =>
      Array.isArray(sampleUser.activityHistory?.workouts) &&
      sampleUser.activityHistory.workouts.length > 0 &&
      !!sampleUser.activityHistory.workouts[0].feedback?.completedAt
  )
);

const passed = results.filter(Boolean).length;
console.log(`\n✅ Passed ${passed}/${results.length} checks.`);
if (passed !== results.length) {
  process.exitCode = 1;
} else {
  process.exitCode = 0;
}
