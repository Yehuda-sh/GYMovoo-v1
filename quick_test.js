/**
 * @file quick_test.js
 * @description בדיקה מהירה של כמות התרגילים
 */

const fs = require("fs");
const path = require("path");

// קריאת קובץ התרגילים
const bodyweightPath = path.join(
  __dirname,
  "src",
  "data",
  "exercises",
  "bodyweight.ts"
);
const dumbbellsPath = path.join(
  __dirname,
  "src",
  "data",
  "exercises",
  "dumbbells.ts"
);
const cardioPath = path.join(
  __dirname,
  "src",
  "data",
  "exercises",
  "cardio.ts"
);

console.log("🔍 בודק מבנה תרגילים חדש...\n");

try {
  // בדיקת תרגילי משקל גוף
  const bodyweightContent = fs.readFileSync(bodyweightPath, "utf8");
  const bodyweightMatches = bodyweightContent.match(/id:\s*"/g);
  const bodyweightCount = bodyweightMatches ? bodyweightMatches.length : 0;

  console.log(`✅ תרגילי משקל גוף: ${bodyweightCount} תרגילים`);

  // בדיקת תרגילי משקולות
  const dumbbellsContent = fs.readFileSync(dumbbellsPath, "utf8");
  const dumbbellsMatches = dumbbellsContent.match(/id:\s*"/g);
  const dumbbellsCount = dumbbellsMatches ? dumbbellsMatches.length : 0;

  console.log(`💪 תרגילי משקולות: ${dumbbellsCount} תרגילים`);

  // בדיקת תרגילי קרדיו
  const cardioContent = fs.readFileSync(cardioPath, "utf8");
  const cardioMatches = cardioContent.match(/id:\s*"/g);
  const cardioCount = cardioMatches ? cardioMatches.length : 0;

  console.log(`🏃 תרגילי קרדיו: ${cardioCount} תרגילים`);

  const totalCount = bodyweightCount + dumbbellsCount + cardioCount;
  console.log(`\n📊 סה"כ תרגילים: ${totalCount}`);

  console.log("\n🎯 הבעיה הקודמת: היו רק 5 תרגילי משקל גוף");
  console.log(`✨ עכשיו יש לנו ${bodyweightCount} תרגילי משקל גוף!`);
} catch (error) {
  console.error("❌ שגיאה:", error.message);
}
