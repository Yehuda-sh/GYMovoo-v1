#!/usr/bin/env node

/**
 * @file scripts/removeDebugLogs.js
 * @brief מוחק לוגי דיבאג מהשאלון החכם
 */

const fs = require("fs");
const path = require("path");

console.log("🧹 מוחק לוגי דיבאג מהשאלון החכם...\n");

const filePath = path.join(process.cwd(), "src/data/smartQuestionnaireData.ts");

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, "utf8");

  // מונה השורות שנמחקו
  const beforeLines = content.split("\n").length;

  // מחיקת כל השורות שמתחילות עם console.log
  content = content
    .split("\n")
    .filter((line) => {
      const trimmedLine = line.trim();
      // מחק שורות console.log ושורות ריקות שנותרו אחריהן
      return (
        !trimmedLine.startsWith("console.log(") &&
        !trimmedLine.startsWith("console.log(`") &&
        !(trimmedLine === "" && line.includes("  "))
      ); // שורות ריקות עם רווחים
    })
    .join("\n");

  // ניקוי כפול של שורות ריקות מיותרות
  content = content.replace(/\n\s*\n\s*\n/g, "\n\n");

  const afterLines = content.split("\n").length;
  const removedLines = beforeLines - afterLines;

  fs.writeFileSync(filePath, content, "utf8");

  console.log(
    `✅ נמחקו ${removedLines} שורות דיבאג מ-smartQuestionnaireData.ts`
  );
  console.log(`📊 מ-${beforeLines} שורות ל-${afterLines} שורות`);
} else {
  console.log("❌ קובץ לא נמצא:", filePath);
}

console.log("\n🎉 ניקוי לוגי הדיבאג הושלם!");
