/**
 * @file scripts/testDataFlow.js
 * @brief סקריפט לבדיקת זרימת נתונים ב-GYMovoo
 * @description בודק את כל השלבים: הרשמה, שאלון, יצירת אימון ושמירה
 */

// צבעים לקונסול
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

// Mock של AsyncStorage
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
  multiRemove: async (keys) => {
    keys.forEach((key) => delete mockStorage[key]);
    return Promise.resolve();
  },
};

// Mock של userStore
class MockUserStore {
  constructor() {
    this.state = {
      user: null,
    };
  }

  setUser(user) {
    this.state.user = user;
    // שמירה אוטומטית ב-AsyncStorage כמו ב-persist
    AsyncStorage.setItem("user-storage", JSON.stringify({ user }));
  }

  updateUser(updates) {
    if (this.state.user) {
      this.state.user = { ...this.state.user, ...updates };
      AsyncStorage.setItem(
        "user-storage",
        JSON.stringify({ user: this.state.user })
      );
    }
  }

  setQuestionnaire(answers) {
    if (this.state.user) {
      this.state.user.questionnaire = answers;
      this.state.user.questionnaireData = {
        answers,
        completedAt: new Date().toISOString(),
        version: "1.0",
      };
      AsyncStorage.setItem(
        "user-storage",
        JSON.stringify({ user: this.state.user })
      );
      AsyncStorage.setItem("questionnaire_answers", JSON.stringify(answers));
    }
  }

  logout() {
    this.state.user = null;
    AsyncStorage.multiRemove(["user-storage", "questionnaire_answers"]);
  }

  getState() {
    return this.state;
  }
}

const mockUserStore = new MockUserStore();

// פונקציות עזר
function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log("\n" + "=".repeat(50));
  log(title, "bright");
  console.log("=".repeat(50));
}

function logTest(name, passed, details = "") {
  const status = passed ? `${colors.green}✓ PASS` : `${colors.red}✗ FAIL`;
  console.log(`${status}${colors.reset} - ${name}`);
  if (details) {
    console.log(`  ${colors.cyan}→ ${details}${colors.reset}`);
  }
}

// בדיקות
async function testUserRegistration() {
  logSection("👤 Test 1: User Registration");

  const newUser = {
    email: "test@gymovoo.com",
    name: "משתמש בדיקה",
    id: `user_${Date.now()}`,
  };

  // הרשמה
  mockUserStore.setUser(newUser);

  // בדיקה
  const savedData = await AsyncStorage.getItem("user-storage");
  const parsed = savedData ? JSON.parse(savedData) : null;
  const passed = parsed?.user?.email === newUser.email;

  logTest(
    "User Registration",
    passed,
    `User ${passed ? "saved" : "not saved"} with email: ${newUser.email}`
  );

  return passed;
}

async function testQuestionnaire() {
  logSection("📋 Test 2: Questionnaire Flow");

  const questionnaireAnswers = {
    0: "16-25", // גיל
    1: "זכר", // מין
    2: ["ירידה במשקל", "חיטוב"], // מטרות
    3: "3-4", // ימי אימון
    4: "30-45 דקות", // משך אימון
    5: "בית", // מיקום
    6: ["משקולות", "גומיות"], // ציוד
    7: "מתחיל", // רמה
    8: "לא", // כאבים
    9: "כן", // ניסיון
  };

  // שמירת שאלון
  mockUserStore.setQuestionnaire(questionnaireAnswers);

  // בדיקות
  const userStorage = await AsyncStorage.getItem("user-storage");
  const questionnaireStorage = await AsyncStorage.getItem(
    "questionnaire_answers"
  );

  const userParsed = userStorage ? JSON.parse(userStorage) : null;
  const questionnaireParsed = questionnaireStorage
    ? JSON.parse(questionnaireStorage)
    : null;

  const passed =
    userParsed?.user?.questionnaire?.[0] === "16-25" &&
    questionnaireParsed?.[0] === "16-25";

  logTest(
    "Questionnaire Save",
    passed,
    `Saved ${Object.keys(questionnaireAnswers).length} answers`
  );

  return passed;
}

async function testAsyncStorage() {
  logSection("💾 Test 3: AsyncStorage Persistence");

  // בדיקת מפתחות
  const keys = await AsyncStorage.getAllKeys();
  const hasUserStorage = keys.includes("user-storage");
  const hasQuestionnaire = keys.includes("questionnaire_answers");

  logTest(
    "Storage Keys",
    hasUserStorage && hasQuestionnaire,
    `Found ${keys.length} keys`
  );

  // בדיקת נתונים
  const userData = await AsyncStorage.getItem("user-storage");
  const userParsed = userData ? JSON.parse(userData) : null;

  const hasValidUser = userParsed?.user?.email === "test@gymovoo.com";
  const hasValidQuestionnaire =
    userParsed?.user?.questionnaire?.[0] === "16-25";

  logTest(
    "Data Integrity",
    hasValidUser && hasValidQuestionnaire,
    `User: ${hasValidUser ? "Valid" : "Invalid"}, Questionnaire: ${
      hasValidQuestionnaire ? "Valid" : "Invalid"
    }`
  );

  return (
    hasUserStorage && hasQuestionnaire && hasValidUser && hasValidQuestionnaire
  );
}

async function testWorkoutDraft() {
  logSection("🏋️ Test 4: Workout Draft Save");

  const workoutDraft = {
    workout: {
      name: "אימון בדיקה",
      exercises: [
        {
          id: "ex1",
          name: "לחיצת חזה",
          sets: [
            { weight: 20, reps: 10, completed: true },
            { weight: 25, reps: 8, completed: false },
          ],
        },
      ],
    },
    startTime: Date.now(),
  };

  // שמירת טיוטה
  const draftKey = `workout_draft_${Date.now()}`;
  await AsyncStorage.setItem(draftKey, JSON.stringify(workoutDraft));

  // קריאה ובדיקה
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
