// בדיקה מהירה של equipmentIconMapping
const fs = require("fs");
const vm = require("vm");

// טוען TypeScript ומפענח אותו בצורה בסיסית
const tsCode = fs.readFileSync("./src/utils/equipmentIconMapping.ts", "utf8");
const jsCode = tsCode
  .replace(/export const/g, "const")
  .replace(/export function/g, "function")
  .replace(/: Record<string, string>/g, "")
  .replace(/: string\[\]/g, "")
  .replace(/: string/g, "")
  .replace(/: boolean/g, "");

const context = {};
vm.createContext(context);
vm.runInContext(jsCode, context);

const {
  getEquipmentIcon,
  getEquipmentHebrewName,
  findDuplicateIconMappings,
  hasEquipmentIcon,
} = context;

console.log("🔍 בדיקת כפילויות:");
const dups = findDuplicateIconMappings();
console.log(JSON.stringify(dups, null, 2));

console.log("\n🧪 בדיקות פונקציונליות:");
const testCases = [
  "dumbbells",
  "dumbbell",
  "Resistance Bands",
  "bench press",
  "squat-rack",
  "לא_קיים",
];

testCases.forEach((item) => {
  console.log(
    `"${item}" → אייקון: ${getEquipmentIcon(item)}, עברית: ${getEquipmentHebrewName(item)}, קיים: ${hasEquipmentIcon(item)}`
  );
});
