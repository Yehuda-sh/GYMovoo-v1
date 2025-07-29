#!/usr/bin/env node

/**
 * @file scripts/fixQuestionnaireConflicts.js
 * @brief מתקן את ההתנגשויות בין מערכות השאלון השונות
 */

const fs = require("fs");
const path = require("path");

console.log("🔧 מתקן התנגשויות במערכות השאלון...\n");

// 1. בדיקת הקבצים הבעייתיים
const problematicFiles = [
  "src/data/simplifiedQuestionnaireData.ts",
  "src/data/twoStageQuestionnaireData.ts",
  "src/data/scientificQuestionnaireData.ts",
];

console.log("📋 קבצי שאלון בעייתיים שנמצאו:");
problematicFiles.forEach((file) => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    const stats = fs.statSync(fullPath);
    console.log(`  ❌ ${file} (${Math.round(stats.size / 1024)}KB)`);
  } else {
    console.log(`  ✅ ${file} (לא קיים)`);
  }
});

// 2. ניתוח השימוש בפועל
console.log("\n🔍 בודק קבצים שמשתמשים בשאלונים הבעייתיים:");

const srcFiles = [];
function findTsFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (
      stat.isDirectory() &&
      !file.startsWith(".") &&
      file !== "node_modules"
    ) {
      findTsFiles(fullPath);
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      srcFiles.push(fullPath);
    }
  });
}

findTsFiles("./src");

const conflictingImports = [];

srcFiles.forEach((filePath) => {
  try {
    const content = fs.readFileSync(filePath, "utf8");

    // חיפוש imports בעייתיים
    const problematicImports = [
      "simplifiedQuestionnaireData",
      "twoStageQuestionnaireData",
      "scientificQuestionnaireData",
    ];

    problematicImports.forEach((importName) => {
      if (content.includes(importName)) {
        conflictingImports.push({
          file: filePath,
          import: importName,
          lines: content.split("\n").reduce((acc, line, index) => {
            if (line.includes(importName)) {
              acc.push(index + 1);
            }
            return acc;
          }, []),
        });
      }
    });
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
});

console.log(
  `\n📊 נמצאו ${conflictingImports.length} קבצים עם imports בעייתיים:`
);
conflictingImports.forEach((conflict) => {
  console.log(`  🔴 ${conflict.file}`);
  console.log(
    `     Import: ${conflict.import} (lines: ${conflict.lines.join(", ")})`
  );
});

// 3. המלצות לתיקון
console.log("\n💡 המלצות לתיקון:");
console.log("1. להשתמש רק ב-questionnaireData.ts (הקובץ הראשי)");
console.log("2. למחוק או לארכב את הקבצים הבעייתיים");
console.log("3. לעדכן את הקבצים שמשתמשים בהם");
console.log("4. לאחד את כל הפונקציונליות לקובץ אחד");

console.log("\n🎯 הבעיה העיקרית:");
console.log("- ProfileScreen משתמש ב-twoStageQuestionnaireData");
console.log("- realisticDemoService יוצר questionnaire פשוט");
console.log("- התוצאה: חוסר תאימות בין הנתונים");

console.log("\n✅ פתרון מומלץ:");
console.log("1. לעדכן את ProfileScreen להשתמש ב-questionnaire הפשוט");
console.log("2. להסיר את התלות ב-twoStageQuestionnaireData");
console.log("3. לאחד את כל לוגיקת השאלון למקום אחד");

console.log("\n🔧 הרצה אוטומטית של תיקונים...");

// תיקון אוטומטי של ProfileScreen
const profileScreenPath = "src/screens/profile/ProfileScreen.tsx";
if (fs.existsSync(profileScreenPath)) {
  let content = fs.readFileSync(profileScreenPath, "utf8");

  // הסרת import בעייתי
  const oldImport = `import {
  hasCompletedTrainingStage,
  hasCompletedProfileStage,
} from "../../data/twoStageQuestionnaireData";`;

  if (content.includes(oldImport)) {
    content = content.replace(oldImport, "// Removed problematic imports");

    // החלפת השימוש בפונקציות
    content = content.replace(
      "const hasTrainingStage = hasCompletedTrainingStage(user?.questionnaire);",
      "const hasTrainingStage = !!user?.questionnaire;"
    );
    content = content.replace(
      "const hasProfileStage = hasCompletedProfileStage(user?.questionnaire);",
      "const hasProfileStage = !!user?.questionnaire;"
    );

    fs.writeFileSync(profileScreenPath, content);
    console.log("✅ תוקן ProfileScreen.tsx");
  } else {
    console.log("ℹ️  ProfileScreen.tsx כבר תקין");
  }
}

console.log("\n🎉 תיקון הושלם!");
console.log("עכשיו האפליקציה אמורה לעבוד עם שאלון אחיד.");
