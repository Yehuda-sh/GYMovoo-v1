#!/usr/bin/env node

/**
 * @file scripts/cleanupOldQuestionnaires.js
 * @brief מנקה את השאלונים הישנים שכבר לא בשימוש
 */

const fs = require("fs");
const path = require("path");

console.log("🧹 מתחיל ניקוי השאלונים הישנים...\n");

// רשימת הקבצים למחיקה (שאלונים שכבר לא בשימוש פעיל)
const filesToDelete = [
  "src/data/simplifiedQuestionnaireData.ts",
  "src/data/scientificQuestionnaireData.ts",
  "src/services/scientificAIService.ts",
  "src/services/scientificUserGenerator.ts",
];

// מחיקת קבצים
console.log("📂 קבצים למחיקה:");
let deletedCount = 0;
let notFoundCount = 0;

filesToDelete.forEach((filePath) => {
  const fullPath = path.join(process.cwd(), filePath);
  console.log(`  📄 ${filePath}`);

  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      console.log(`    ✅ נמחק בהצלחה`);
      deletedCount++;
    } catch (error) {
      console.log(`    ❌ שגיאה במחיקה: ${error.message}`);
    }
  } else {
    console.log(`    ⚠️  קובץ לא נמצא`);
    notFoundCount++;
  }
});

console.log(`\n📊 סיכום:`);
console.log(`  ✅ נמחקו: ${deletedCount} קבצים`);
console.log(`  ⚠️  לא נמצאו: ${notFoundCount} קבצים`);

console.log("\n🎯 מה נשמר:");
console.log("  ✅ smartQuestionnaireData.ts - השאלון הפעיל החדש");
console.log("  ✅ questionnaireData.ts - עדיין בשימוש ב-MainScreen");
console.log("  ✅ twoStageQuestionnaireData.ts - גיבוי חשוב");

console.log("\n🚀 השאלון החכם עם AI מוכן לשימוש!");
console.log("💡 התכונות החדשות:");
console.log("  - משוב AI בזמן אמת");
console.log("  - שאלות דינמיות");
console.log("  - ממשק משתמש משופר");
console.log("  - לוגיקה חכמה לבחירת שאלות");

if (deletedCount > 0) {
  console.log(`\n📋 הצעד הבא:`);
  console.log("  בדוק שהאפליקציה עדיין עובדת טוב");
  console.log("  אם יש שגיאות, אפשר לשחזר מ-git");
}
