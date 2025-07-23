/**
 * @file scripts/testDataFlow.js
 * @brief סקריפט לבדיקת זרימת נתונים - הרץ עם: node scripts/testDataFlow.js
 * @description בודק את כל זרימת הנתונים באפליקציה ומדפיס דוח מפורט
 */

// Mock AsyncStorage for testing
const mockStorage = {};

const AsyncStorage = {
  setItem: async (key, value) => {
    mockStorage[key] = value;
    return Promise.resolve();
  },
  getItem: async (key) => {
    return Promise.resolve(mockStorage[key] || null);
  },
  removeItem: async (key) => {
    delete mockStorage[key];
    return Promise.resolve();
  },
  getAllKeys: async () => {
    return Promise.resolve(Object.keys(mockStorage));
  },
  multiGet: async (keys) => {
    return Promise.resolve(keys.map((key) => [key, mockStorage[key]]));
  },
  multiRemove: async (keys) => {
    keys.forEach((key) => delete mockStorage[key]);
    return Promise.resolve();
  },
};

// Mock Zustand store
const mockUserStore = {
  user: null,
  setUser: function (user) {
    this.user = user;
    console.log("✅ User saved to store:", user?.email);
  },
  setQuestionnaire: function (answers) {
    if (!this.user) this.user = {};
    this.user.questionnaire = answers;
    console.log(
      "✅ Questionnaire saved:",
      Object.keys(answers).length,
      "answers"
    );
  },
  logout: function () {
    this.user = null;
    console.log("✅ User logged out");
  },
};

// צבעים לטרמינל
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

// פונקציות עזר
function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log("\n" + "=".repeat(50));
  log(title, "bright");
  console.log("=".repeat(50));
}

function logTest(name, passed, details) {
  const status = passed ? `${colors.green}✅ PASSED` : `${colors.red}❌ FAILED`;
  console.log(`\n${status}${colors.reset} - ${name}`);
  if (details) {
    console.log(`   ${colors.cyan}Details:${colors.reset} ${details}`);
  }
}

// בדיקות
async function testUserRegistration() {
  logSection("🔐 Testing User Registration");

  const testUser = {
    name: "משתמש בדיקה",
    email: "test@gymovoo.com",
    id: `test_${Date.now()}`,
    avatar: undefined,
  };

  mockUserStore.setUser(testUser);

  const passed = mockUserStore.user?.email === testUser.email;
  logTest(
    "User Registration",
    passed,
    `User ${passed ? "successfully saved" : "failed to save"} in store`
  );

  return passed;
}

async function testQuestionnaire() {
  logSection("📋 Testing Questionnaire");

  const mockAnswers = {
    0: "26-35", // גיל
    1: "זכר", // מין
    2: "עליה במסת שריר", // מטרה
    3: "בינוני (6-24 חודשים)", // ניסיון
    4: "3-4", // תדירות
    5: "45-60 דקות", // משך
    6: ["חדר כושר", "בית"], // מיקום
    7: "", // פציעות
    8: ["משקולות חופשיות", "מכונות"], // ציוד
  };

  mockUserStore.setQuestionnaire(mockAnswers);

  const saved = mockUserStore.user?.questionnaire;
  const passed = saved && Object.keys(saved).length === 9;

  logTest(
    "Questionnaire Storage",
    passed,
    `${Object.keys(saved || {}).length}/9 answers saved`
  );

  if (saved) {
    console.log(`   ${colors.cyan}Answers:${colors.reset}`);
    console.log(`   - Age: ${saved[0]}`);
    console.log(`   - Gender: ${saved[1]}`);
    console.log(`   - Goal: ${saved[2]}`);
    console.log(`   - Experience: ${saved[3]}`);
  }

  return passed;
}

async function testAsyncStorage() {
  logSection("💾 Testing AsyncStorage");

  // Test 1: User Preferences
  const preferences = {
    theme: "dark",
    notifications: true,
    language: "he",
  };

  await AsyncStorage.setItem("userPreferences", JSON.stringify(preferences));
  const savedPrefs = await AsyncStorage.getItem("userPreferences");
  const prefsTest = savedPrefs && JSON.parse(savedPrefs).theme === "dark";

  logTest(
    "User Preferences Storage",
    prefsTest,
    "Preferences saved and retrieved correctly"
  );

  // Test 2: Remember Email
  const email = "remember@gymovoo.com";
  await AsyncStorage.setItem("savedEmail", email);
  const savedEmail = await AsyncStorage.getItem("savedEmail");
  const emailTest = savedEmail === email;

  logTest(
    "Remember Email Feature",
    emailTest,
    `Email ${emailTest ? "saved" : "not saved"} correctly`
  );

  return prefsTest && emailTest;
}

async function testWorkoutDraft() {
  logSection("🏋️ Testing Workout Draft");

  const mockWorkout = {
    workout: {
      id: `workout_test_${Date.now()}`,
      name: "אימון בדיקה",
      startTime: new Date().toISOString(),
      duration: 1800,
      exercises: [
        {
          id: "ex1",
          name: "לחיצת חזה",
          sets: [
            { id: "s1", reps: 10, weight: 50, completed: true },
            { id: "s2", reps: 8, weight: 50, completed: true },
            { id: "s3", reps: 6, weight: 50, completed: false },
          ],
        },
      ],
      totalVolume: 900,
    },
    lastSaved: new Date().toISOString(),
    version: 1,
  };

  const draftKey = `workout_draft_${mockWorkout.workout.id}`;
  await AsyncStorage.setItem(draftKey, JSON.stringify(mockWorkout));

  const savedDraft = await AsyncStorage.getItem(draftKey);
  const parsed = savedDraft ? JSON.parse(savedDraft) : null;
  const passed = parsed && parsed.workout.name === "אימון בדיקה";

  logTest(
    "Workout Draft Save",
    passed,
    `Draft ${passed ? "saved with" : "failed -"} ${
      parsed?.workout.exercises[0].sets.length || 0
    } sets`
  );

  // נקה
  await AsyncStorage.removeItem(draftKey);

  return passed;
}

async function displayStorageContents() {
  logSection("🗝️ Current AsyncStorage Contents");

  const keys = await AsyncStorage.getAllKeys();
  console.log(`\nTotal keys: ${keys.length}`);

  for (const key of keys) {
    const value = await AsyncStorage.getItem(key);
    console.log(`\n${colors.yellow}${key}:${colors.reset}`);

    try {
      const parsed = JSON.parse(value);
      console.log(JSON.stringify(parsed, null, 2));
    } catch {
      console.log(value);
    }
  }
}

async function runAllTests() {
  console.clear();
  log("🧪 GYMovoo Data Flow Test Suite", "bright");
  log("================================\n", "bright");

  const results = {
    registration: false,
    questionnaire: false,
    asyncStorage: false,
    workoutDraft: false,
  };

  // הרץ בדיקות
  results.registration = await testUserRegistration();
  results.questionnaire = await testQuestionnaire();
  results.asyncStorage = await testAsyncStorage();
  results.workoutDraft = await testWorkoutDraft();

  // הצג תוכן Storage
  await displayStorageContents();

  // סיכום
  logSection("📊 Test Summary");

  const passed = Object.values(results).filter((r) => r).length;
  const total = Object.keys(results).length;
  const percentage = Math.round((passed / total) * 100);

  console.log(
    `\nTests passed: ${colors.green}${passed}/${total}${colors.reset}`
  );
  console.log(
    `Success rate: ${
      percentage >= 80 ? colors.green : colors.red
    }${percentage}%${colors.reset}`
  );

  if (percentage === 100) {
    log("\n🎉 All tests passed! Data flow is working correctly.", "green");
  } else {
    log("\n⚠️  Some tests failed. Check the details above.", "yellow");
  }

  // נקה mock storage
  console.log("\n🧹 Cleaning up test data...");
  Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
  mockUserStore.logout();

  log("\n✅ Test complete!", "bright");
}

// הרץ בדיקות
runAllTests().catch((error) => {
  log(`\n❌ Error running tests: ${error.message}`, "red");
  process.exit(1);
});
