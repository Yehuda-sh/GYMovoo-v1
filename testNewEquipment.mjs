/**
 * בדיקת פונקציונליות לציוד החדש
 * Testing new equipment functionality
 */

import {
  allExercises,
  getSmartFilteredExercises,
  filterExercisesByEquipment,
  EQUIPMENT_TYPES,
} from "./src/data/exercises/index.ts";

console.log("🧪 בדיקת ציוד חדש / Testing new equipment");
console.log("=".repeat(50));

// בדיקת הציוד החדש
const newEquipment = [
  "kettlebell",
  "water_bottles",
  "water_gallon",
  "sandbag",
  "tire",
];

console.log("📊 כמות תרגילים כוללת:", allExercises.length);

newEquipment.forEach((equipment) => {
  const exercises = filterExercisesByEquipment([equipment]);
  console.log(`${equipment}: ${exercises.length} תרגילים`);

  if (exercises.length > 0) {
    console.log("  - תרגילים:", exercises.map((ex) => ex.name_en).join(", "));
  }
});

// בדיקת סינון חכם עם הציוד החדש
console.log("\n🏠 בדיקת סינון חכם - בית עם ציוד חדש");
const homeWithNewEquipment = getSmartFilteredExercises(
  ["home"],
  ["kettlebell", "water_bottles", "bodyweight"]
);
console.log("תרגילים זמינים:", homeWithNewEquipment.length);

// בדיקת הגדרות EQUIPMENT_TYPES
console.log("\n⚙️ בדיקת קבועי ציוד:");
console.log("KETTLEBELL:", EQUIPMENT_TYPES.KETTLEBELL);
console.log("WATER_BOTTLES:", EQUIPMENT_TYPES.WATER_BOTTLES);
console.log("SANDBAG:", EQUIPMENT_TYPES.SANDBAG);
