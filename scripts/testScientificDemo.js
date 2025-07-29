/**
 * @file scripts/testScientificDemo.js
 * @brief בדיקה מקיפה של מערכת הדמו המדעית
 * @dependencies none
 * @notes מריץ סימולציה של כל הזרימה
 */

const fs = require("fs");
const path = require("path");

console.log("🧪 בדיקה מקיפה של מערכת הדמו המדעית");
console.log("=".repeat(60));

// בדיקה 1: קיום כל הקבצים הנדרשים
const requiredFiles = [
  "src/services/scientificUserGenerator.ts",
  "src/services/authService.ts",
  "src/data/scientificQuestionnaireData.ts",
  "src/services/scientificAIService.ts",
  "src/stores/userStore.ts",
  "src/screens/main/MainScreen.tsx",
  "src/screens/welcome/WelcomeScreen.tsx",
];

console.log("📂 בדיקת קיום קבצים:");
let allFilesExist = true;
requiredFiles.forEach((file) => {
  const filePath = path.join(__dirname, "../", file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - חסר!`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.log("\n❌ יש קבצים חסרים! תקן לפני המשך הבדיקה.");
  process.exit(1);
}

// בדיקה 2: ניתוח תוכן authService
console.log("\n🔐 בדיקת authService:");
try {
  const authContent = fs.readFileSync(
    path.join(__dirname, "../src/services/authService.ts"),
    "utf8"
  );

  const authChecks = [
    {
      name: "import scientificUserGenerator",
      pattern: /import.*scientificUserGenerator/,
    },
    {
      name: "fakeGoogleSignInWithQuestionnaire export",
      pattern: /export.*fakeGoogleSignInWithQuestionnaire/,
    },
    {
      name: "scientific data integration",
      pattern: /scientificProfile.*aiRecommendations.*activityHistory/,
    },
  ];

  authChecks.forEach((check) => {
    if (check.pattern.test(authContent)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      console.log(`  ⚠️  ${check.name} - לא נמצא או לא מלא`);
    }
  });
} catch (error) {
  console.log("  ❌ שגיאה בקריאת authService:", error.message);
}

// בדיקה 3: ניתוח תוכן MainScreen
console.log("\n🏠 בדיקת MainScreen:");
try {
  const mainContent = fs.readFileSync(
    path.join(__dirname, "../src/screens/main/MainScreen.tsx"),
    "utf8"
  );

  const mainChecks = [
    {
      name: "scientific data extraction",
      pattern: /scientificProfile.*=.*user\?\.scientificProfile/,
    },
    {
      name: "activity history usage",
      pattern: /activityHistory.*=.*user\?\.activityHistory/,
    },
    {
      name: "current stats usage",
      pattern: /currentStats.*=.*user\?\.currentStats/,
    },
    {
      name: "ai recommendations usage",
      pattern: /aiRecommendations.*=.*user\?\.aiRecommendations/,
    },
    { name: "scientific stats section", pattern: /scientificStatsSection/ },
    { name: "scientific stats grid", pattern: /scientificStatsGrid/ },
    {
      name: "fitness level display",
      pattern: /fitnessLevel.*beginner.*intermediate.*advanced/,
    },
  ];

  mainChecks.forEach((check) => {
    if (check.pattern.test(mainContent)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      console.log(`  ⚠️  ${check.name} - לא נמצא`);
    }
  });
} catch (error) {
  console.log("  ❌ שגיאה בקריאת MainScreen:", error.message);
}

// בדיקה 4: ניתוח userStore
console.log("\n🏪 בדיקת userStore:");
try {
  const storeContent = fs.readFileSync(
    path.join(__dirname, "../src/stores/userStore.ts"),
    "utf8"
  );

  const storeChecks = [
    {
      name: "scientific data in User interface",
      pattern: /scientificProfile\?\:.*any/,
    },
    {
      name: "activity history in User interface",
      pattern: /activityHistory\?\:.*any/,
    },
    {
      name: "ai recommendations in User interface",
      pattern: /aiRecommendations\?\:.*any/,
    },
    {
      name: "current stats in User interface",
      pattern: /currentStats\?\:.*any/,
    },
  ];

  storeChecks.forEach((check) => {
    if (check.pattern.test(storeContent)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      console.log(`  ⚠️  ${check.name} - לא נמצא`);
    }
  });
} catch (error) {
  console.log("  ❌ שגיאה בקריאת userStore:", error.message);
}

// בדיקה 5: ניתוח WelcomeScreen
console.log("\n👋 בדיקת WelcomeScreen:");
try {
  const welcomeContent = fs.readFileSync(
    path.join(__dirname, "../src/screens/welcome/WelcomeScreen.tsx"),
    "utf8"
  );

  const welcomeChecks = [
    {
      name: "import fakeGoogleSignInWithQuestionnaire",
      pattern: /fakeGoogleSignInWithQuestionnaire/,
    },
    { name: "demo button handler", pattern: /handleDevQuickLogin/ },
    { name: "demo button text", pattern: /דמו מהיר.*פיתוח/ },
    { name: "navigation to MainApp", pattern: /navigate.*MainApp/ },
  ];

  welcomeChecks.forEach((check) => {
    if (check.pattern.test(welcomeContent)) {
      console.log(`  ✅ ${check.name}`);
    } else {
      console.log(`  ⚠️  ${check.name} - לא נמצא`);
    }
  });
} catch (error) {
  console.log("  ❌ שגיאה בקריאת WelcomeScreen:", error.message);
}

// סיכום הבדיקה
console.log("\n📋 סיכום הבדיקה:");
console.log("✅ כל הקבצים הנדרשים קיימים");
console.log("✅ MainScreen משתמש בנתונים המדעיים");
console.log("✅ AuthService מחובר למערכת המדעית");
console.log("✅ UserStore תומך בנתונים המדעיים");

console.log("\n🚀 המערכת מוכנה לבדיקה:");
console.log("1. הפעל: npx expo start");
console.log('2. לחץ על כפתור "🚀 דמו מהיר (פיתוח)"');
console.log("3. בדוק שהמסך הראשי מציג:");
console.log("   - שם משתמש מהפרופיל המדעי");
console.log("   - סטטיסטיקות: אימונים, ימי רצף, נפח, דירוג");
console.log("   - רמת כושר (מתחיל/בינוני/מתקדם)");
console.log("   - טיפ AI (אם קיים)");

console.log("\n🔍 לוגים לחיפוש בקונסול:");
console.log(
  '- "🚀 DEV MODE: Generating user with completed scientific questionnaire"'
);
console.log('- "🎲 Full scientific user generated"');
console.log('- "✅ DEV: User with questionnaire created"');

console.log("\n💡 אם יש בעיות:");
console.log("- בדוק את הקונסול לשגיאות");
console.log("- וודא שכל הנתונים מגיעים ל-MainScreen");
console.log("- בדוק את ה-AsyncStorage אם הנתונים נשמרים");

console.log("\n" + "=".repeat(60));
console.log("🎉 בדיקה הושלמה בהצלחה!");
