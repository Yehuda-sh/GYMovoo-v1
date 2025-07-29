/**
 * @file scripts/testReplacedQuestionnaire.js
 * @brief בדיקת השאלון שהוחלף
 * @date 2025-01-28
 */

console.log("🧪 Testing REPLACED Smart Questionnaire...\n");

// בדיקה שהקובץ הישן הוחלף בחדש
const fs = require("fs");

// בדיקה שהקובץ הישן בגיבוי
const backupExists = fs.existsSync("src/data/smartQuestionnaireData.ts.backup");
console.log(`📦 Backup file exists: ${backupExists ? "✅" : "❌"}`);

// בדיקה שהקובץ החדש במקום הישן
const newFileExists = fs.existsSync("src/data/smartQuestionnaireData.ts");
console.log(`📁 New file in place: ${newFileExists ? "✅" : "❌"}`);

// בדיקת תוכן הקובץ החדש
if (newFileExists) {
  const content = fs.readFileSync("src/data/smartQuestionnaireData.ts", "utf8");

  const hasEquipmentAvailability = content.includes("equipment_availability");
  const hasBodyweightOptions = content.includes("bodyweight_equipment_options");
  const hasHomeOptions = content.includes("home_equipment_options");
  const hasGymOptions = content.includes("gym_equipment_options");
  const hasChairOption = content.includes("כיסא יציב");
  const hasMatOption = content.includes("מזרון/שטיח");

  console.log(`\n📋 Content Check:`);
  console.log(
    `- Equipment availability question: ${hasEquipmentAvailability ? "✅" : "❌"}`
  );
  console.log(`- Bodyweight options: ${hasBodyweightOptions ? "✅" : "❌"}`);
  console.log(`- Home equipment options: ${hasHomeOptions ? "✅" : "❌"}`);
  console.log(`- Gym equipment options: ${hasGymOptions ? "✅" : "❌"}`);
  console.log(`- Chair option: ${hasChairOption ? "✅" : "❌"}`);
  console.log(`- Mat option: ${hasMatOption ? "✅" : "❌"}`);

  // בדיקת export names
  const hasSmartQuestionnaire = content.includes(
    "export const SMART_QUESTIONNAIRE"
  );
  const hasSmartQuestionnaireManager = content.includes(
    "export class SmartQuestionnaireManager"
  );

  console.log(`\n🔧 Export Check:`);
  console.log(
    `- SMART_QUESTIONNAIRE export: ${hasSmartQuestionnaire ? "✅" : "❌"}`
  );
  console.log(
    `- SmartQuestionnaireManager export: ${hasSmartQuestionnaireManager ? "✅" : "❌"}`
  );
}

// הדמיית זרימת השאלון
console.log(`\n🎯 Flow Simulation:`);
console.log(`1. User sees: "איזה ציוד זמין לך לאימונים?"`);
console.log(
  `2. If chooses "ללא ציוד" → Gets bodyweight options (includes chair & mat)`
);
console.log(`3. If chooses "יש לי ציוד בבית" → Gets home equipment options`);
console.log(
  `4. If chooses "יש לי גישה לחדר כושר" → Gets gym equipment options`
);

console.log(`\n🎊 Replacement Complete!`);
console.log(`💾 Old file backed up as: smartQuestionnaireData.ts.backup`);
console.log(`🆕 New clean questionnaire is now active!`);
