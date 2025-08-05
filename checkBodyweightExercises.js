// בדיקת תרגילי משקל גוף
const fs = require("fs");

const dbContent = fs.readFileSync("./src/data/exerciseDatabase.ts", "utf8");

// חילוץ תרגילים עם equipment: "none"
const lines = dbContent.split("\n");
let currentExercise = null;
let noneEquipmentExercises = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // מחפש שורת name
  if (line.includes('name: "') && !line.includes("nameLocalized")) {
    const nameMatch = line.match(/name: "([^"]+)"/);
    if (nameMatch) {
      currentExercise = nameMatch[1];
    }
  }

  // מחפש equipment: "none"
  if (line.includes('equipment: "none"') && currentExercise) {
    noneEquipmentExercises.push(currentExercise);
    currentExercise = null;
  }
}

console.log('תרגילי משקל גוף (equipment: "none"):');
console.log("======================================");
noneEquipmentExercises.forEach((exercise, index) => {
  console.log(`${index + 1}. ${exercise}`);
});

console.log(`\nסה"כ: ${noneEquipmentExercises.length} תרגילים`);

// בדיקה נוספת - חיפוש כל ה-equipment types
const equipmentMatches = dbContent.match(/equipment: "[\w_]+"/g) || [];
const equipmentCounts = {};

equipmentMatches.forEach((match) => {
  const equipment = match.match(/"([\w_]+)"/)[1];
  equipmentCounts[equipment] = (equipmentCounts[equipment] || 0) + 1;
});

console.log("\nסיכום לפי סוג ציוד:");
console.log("==================");
Object.entries(equipmentCounts).forEach(([equipment, count]) => {
  console.log(`${equipment}: ${count} תרגילים`);
});
