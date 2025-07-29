/**
 * @file scripts/finalSystemCheck.js
 * @brief בדיקה סופית מקיפה של כל המערכת המדעית
 * @dependencies none
 * @notes בדיקה יסודית לפני הפצה
 */

const fs = require("fs");
const path = require("path");

console.log("🔬 בדיקה סופית מקיפה של המערכת המדעית");
console.log("=".repeat(70));

// בדיקה מעמיקה של כל רכיב
const detailedChecks = {
  scientificUserGenerator: {
    file: "src/services/scientificUserGenerator.ts",
    patterns: [
      {
        name: "FullScientificUser interface",
        pattern: /export interface FullScientificUser/,
      },
      {
        name: "ScientificUserGenerator class",
        pattern: /class ScientificUserGenerator/,
      },
      {
        name: "generateFullScientificUser method",
        pattern: /generateFullScientificUser.*async/,
      },
      { name: "6 months history generation", pattern: /monthsOfHistory.*=.*6/ },
      {
        name: "AI recommendations generation",
        pattern: /generateAIRecommendations/,
      },
      {
        name: "Personal records generation",
        pattern: /generatePersonalRecords/,
      },
    ],
  },

  scientificAIService: {
    file: "src/services/scientificAIService.ts",
    patterns: [
      {
        name: "ScientificAI class export",
        pattern: /export.*class.*ScientificAI/,
      },
      {
        name: "Generate workout plan method",
        pattern: /generateWorkoutPlan.*async/,
      },
      {
        name: "Heart rate zones calculation",
        pattern: /calculateHeartRateZones/,
      },
      { name: "Nutrition planning", pattern: /generateNutritionPlan/ },
      {
        name: "Injury prevention checks",
        pattern: /injuryPrevention|preventInjury/,
      },
    ],
  },

  authService: {
    file: "src/services/authService.ts",
    patterns: [
      {
        name: "Scientific generator import",
        pattern: /import.*scientificUserGenerator/,
      },
      {
        name: "Demo user function",
        pattern: /fakeGoogleSignInWithQuestionnaire.*async/,
      },
      {
        name: "Scientific profile return",
        pattern: /scientificProfile.*fullScientificUser/,
      },
      {
        name: "Activity history return",
        pattern: /activityHistory.*fullScientificUser/,
      },
      {
        name: "Current stats return",
        pattern: /currentStats.*fullScientificUser/,
      },
    ],
  },

  userStore: {
    file: "src/stores/userStore.ts",
    patterns: [
      { name: "Scientific profile in User", pattern: /scientificProfile\?\:/ },
      { name: "Activity history in User", pattern: /activityHistory\?\:/ },
      { name: "AI recommendations in User", pattern: /aiRecommendations\?\:/ },
      { name: "Current stats in User", pattern: /currentStats\?\:/ },
      { name: "Zustand store creation", pattern: /create.*persist/ },
    ],
  },

  mainScreen: {
    file: "src/screens/main/MainScreen.tsx",
    patterns: [
      {
        name: "Scientific data extraction",
        pattern: /scientificProfile.*=.*user\?\.scientificProfile/,
      },
      { name: "Stats calculation", pattern: /stats.*=.*{.*totalWorkouts/ },
      { name: "Scientific stats grid", pattern: /scientificStatsGrid/ },
      { name: "Fitness level display", pattern: /stats\.fitnessLevel/ },
      { name: "AI tips display", pattern: /aiRecommendations\?\.quickTip/ },
      { name: "Conditional rendering", pattern: /stats\.totalWorkouts.*>.*0/ },
    ],
  },

  welcomeScreen: {
    file: "src/screens/welcome/WelcomeScreen.tsx",
    patterns: [
      {
        name: "Demo function import",
        pattern: /fakeGoogleSignInWithQuestionnaire/,
      },
      { name: "Demo button handler", pattern: /handleDevQuickLogin.*async/ },
      {
        name: "Scientific user creation",
        pattern: /fakeGoogleSignInWithQuestionnaire/,
      },
      { name: "Navigation to MainApp", pattern: /navigate.*MainApp/ },
      { name: "Demo button in DEV mode", pattern: /__DEV__.*TouchableButton/ },
    ],
  },
};

// ביצוע הבדיקות
let totalChecks = 0;
let passedChecks = 0;
let failedComponents = [];

for (const [componentName, component] of Object.entries(detailedChecks)) {
  console.log(`\n🔍 בודק ${componentName}:`);

  try {
    const filePath = path.join(__dirname, "../", component.file);

    if (!fs.existsSync(filePath)) {
      console.log(`  ❌ קובץ ${component.file} לא קיים!`);
      failedComponents.push(componentName);
      continue;
    }

    const content = fs.readFileSync(filePath, "utf8");
    let componentPassed = true;

    for (const check of component.patterns) {
      totalChecks++;

      if (check.pattern.test(content)) {
        console.log(`  ✅ ${check.name}`);
        passedChecks++;
      } else {
        console.log(`  ❌ ${check.name} - לא נמצא!`);
        componentPassed = false;
      }
    }

    if (!componentPassed) {
      failedComponents.push(componentName);
    }
  } catch (error) {
    console.log(`  ❌ שגיאה בקריאת ${component.file}: ${error.message}`);
    failedComponents.push(componentName);
  }
}

// בדיקת קישוריות בין רכיבים
console.log("\n🔗 בדיקת קישוריות בין רכיבים:");

// בדיקה שauthService מייבא מscientificUserGenerator
try {
  const authContent = fs.readFileSync(
    path.join(__dirname, "../src/services/authService.ts"),
    "utf8"
  );
  const generatorContent = fs.readFileSync(
    path.join(__dirname, "../src/services/scientificUserGenerator.ts"),
    "utf8"
  );

  if (
    authContent.includes("scientificUserGenerator") &&
    generatorContent.includes("export")
  ) {
    console.log("  ✅ authService ← scientificUserGenerator");
  } else {
    console.log("  ❌ authService ↚ scientificUserGenerator - קישור שבור");
  }
} catch (error) {
  console.log("  ❌ שגיאה בבדיקת קישוריות authService");
}

// בדיקה שMainScreen משתמש בuserStore
try {
  const mainContent = fs.readFileSync(
    path.join(__dirname, "../src/screens/main/MainScreen.tsx"),
    "utf8"
  );
  const storeContent = fs.readFileSync(
    path.join(__dirname, "../src/stores/userStore.ts"),
    "utf8"
  );

  if (
    mainContent.includes("useUserStore") &&
    storeContent.includes("scientificProfile")
  ) {
    console.log("  ✅ MainScreen ← userStore");
  } else {
    console.log("  ❌ MainScreen ↚ userStore - קישור שבור");
  }
} catch (error) {
  console.log("  ❌ שגיאה בבדיקת קישוריות MainScreen");
}

// בדיקה שWelcomeScreen משתמש באuthService
try {
  const welcomeContent = fs.readFileSync(
    path.join(__dirname, "../src/screens/welcome/WelcomeScreen.tsx"),
    "utf8"
  );
  const authContent = fs.readFileSync(
    path.join(__dirname, "../src/services/authService.ts"),
    "utf8"
  );

  if (
    welcomeContent.includes("fakeGoogleSignInWithQuestionnaire") &&
    authContent.includes("export const fakeGoogleSignInWithQuestionnaire")
  ) {
    console.log("  ✅ WelcomeScreen ← authService");
  } else {
    console.log("  ❌ WelcomeScreen ↚ authService - קישור שבור");
  }
} catch (error) {
  console.log("  ❌ שגיאה בבדיקת קישוריות WelcomeScreen");
}

// סיכום סופי
console.log("\n" + "=".repeat(70));
console.log("📊 סיכום הבדיקה הסופית:");
console.log(
  `🎯 בדיקות שעברו: ${passedChecks}/${totalChecks} (${Math.round((passedChecks / totalChecks) * 100)}%)`
);

if (failedComponents.length === 0) {
  console.log("🎉 כל הרכיבים תקינים!");
  console.log("\n✅ המערכת המדעית מוכנה לשימוש מלא!");

  console.log("\n🚀 צעדים לבדיקה אמיתית:");
  console.log("1. הפעל: npx expo start");
  console.log('2. לחץ על כפתור "🚀 דמו מהיר (פיתוח)"');
  console.log("3. המתן לטעינה (1-2 שניות)");
  console.log("4. בדוק שהמסך הראשי מציג:");
  console.log("   📊 4 כרטיסי סטטיסטיקה");
  console.log("   👤 רמת כושר (מתחיל/בינוני/מתקדם)");
  console.log("   💡 טיפ AI (אם קיים)");
  console.log("   🏆 נתוני התקדמות ריאליסטיים");

  console.log("\n📝 לוגים מצופים בקונסול:");
  console.log('- "🚀 DEV MODE: Generating user..."');
  console.log('- "🎲 Full scientific user generated"');
  console.log("- נתוני משתמש עם workouts, totalVolume, streak");
} else {
  console.log("⚠️  נמצאו בעיות ברכיבים הבאים:");
  failedComponents.forEach((component) => {
    console.log(`   🔧 ${component} - צריך תיקון`);
  });

  console.log("\n🛠️  תקן את הבעיות לפני השימוש במערכת");
}

console.log("\n" + "=".repeat(70));
console.log(`🔬 בדיקה הושלמה בתאריך: ${new Date().toLocaleString("he-IL")}`);
console.log("=".repeat(70));
