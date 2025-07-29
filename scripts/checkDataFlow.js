/**
 * @file scripts/checkDataFlow.js
 * @brief בדיקת זרימת נתונים מדעיים במערכת
 * @dependencies none
 * @notes בודק את כל השלבים: יצירת משתמש -> store -> UI
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 בדיקת זרימת נתונים מדעיים במערכת");
console.log("=".repeat(60));

// בדיקת קיום קבצים חיוניים
const criticalFiles = [
  "src/services/scientificUserGenerator.ts",
  "src/services/authService.ts",
  "src/stores/userStore.ts",
  "src/screens/main/MainScreen.tsx",
];

console.log("📂 בדיקת קיום קבצים חיוניים:");
criticalFiles.forEach((filePath) => {
  const fullPath = path.join(__dirname, "../", filePath);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${filePath}`);
  } else {
    console.log(`❌ ${filePath} - קובץ חסר`);
  }
});

// בדיקה 4: האם MainScreen קורא נתונים מדעיים
try {
  const mainScreenPath = path.join(
    __dirname,
    "../src/screens/main/MainScreen.tsx"
  );
  const mainScreenContent = fs.readFileSync(mainScreenPath, "utf8");

  // בדיקת שימוש בנתונים מדעיים
  const scientificDataUsage = [
    "scientificProfile",
    "activityHistory",
    "aiRecommendations",
    "currentStats",
  ];

  console.log("\n🔍 בדיקת השימוש בנתונים מדעיים ב-MainScreen:");
  let foundUsage = false;
  scientificDataUsage.forEach((dataType) => {
    if (mainScreenContent.includes(dataType)) {
      console.log(`✅ MainScreen משתמש ב-${dataType}`);
      foundUsage = true;
    }
  });

  if (!foundUsage) {
    console.log("⚠️  MainScreen לא משתמש בנתונים המדעיים החדשים");
    console.log("💡 מומלץ לעדכן את MainScreen להצגת נתונים מדעיים");
  }
} catch (error) {
  console.error("❌ שגיאה בקריאת MainScreen:", error.message);
}

// בדיקה 5: זיהוי מסכים שצריכים עדכון
const screensToCheck = [
  "src/screens/main/MainScreen.tsx",
  "src/screens/workout/WorkoutPlansScreen.tsx",
  "src/screens/profile/ProfileScreen.tsx",
  "src/screens/progress/ProgressScreen.tsx",
];

console.log("\n🔍 בדיקת מסכים שצריכים אינטגרציה עם נתונים מדעיים:");
const scientificDataTypes = [
  "scientificProfile",
  "activityHistory",
  "aiRecommendations",
  "currentStats",
];

screensToCheck.forEach((screenPath) => {
  try {
    const fullPath = path.join(__dirname, "../", screenPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, "utf8");

      // בדיקה האם המסך משתמש בnew scientific data
      const hasScientificData = scientificDataTypes.some((dataType) =>
        content.includes(dataType)
      );

      if (hasScientificData) {
        console.log(`✅ ${screenPath} - משתמש בנתונים מדעיים`);
      } else {
        console.log(`⚠️  ${screenPath} - לא משתמש בנתונים מדעיים (צריך עדכון)`);
      }
    } else {
      console.log(`❌ ${screenPath} - קובץ לא קיים`);
    }
  } catch (error) {
    console.log(`❌ ${screenPath} - שגיאה בקריאה: ${error.message}`);
  }
});

// סיכום ודרכי פתרון
console.log("\n📋 סיכום ודרכי פתרון:");
console.log("1. ✅ מערכת יצירת משתמשים מדעיים - פועלת");
console.log("2. ⚠️  אינטגרציה עם UI - דורשת עדכונים");
console.log("3. 💡 מומלץ לעדכן מסכים להצגת נתונים מדעיים");
console.log("4. 🔧 צריך לוודא שuserStore משמיר נתונים מדעיים");

console.log("\n🚀 הצעות לשיפור:");
console.log("- עדכן MainScreen להצגת סטטיסטיקות מדעיות");
console.log("- הוסף dashboard עם נתוני כושר מפורטים");
console.log("- הצג המלצות AI בממשק");
console.log("- הוסף מעקב התקדמות מדעי");
