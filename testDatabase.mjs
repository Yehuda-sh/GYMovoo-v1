import {
  exerciseDatabase,
  getBodyweightExercises,
  getDumbbellExercises,
  filterExercisesByEquipment,
  getSmartFilteredExercises,
  EQUIPMENT_CATEGORIES,
} from "./src/data/exerciseDatabase";

console.log("=== בדיקת מאגר התרגילים ===\n");

// בדיקה 1: כמות התרגילים הכוללת
console.log(`1. סה"כ תרגילים במאגר: ${exerciseDatabase.length}`);

// בדיקה 2: תרגילים עם משקל גוף בלבד
const bodyweightExercises = getBodyweightExercises();
console.log(`\n2. תרגילי משקל גוף: ${bodyweightExercises.length}`);
bodyweightExercises.forEach((ex) => {
  console.log(
    `   - ${ex.nameLocalized?.he || ex.name} (${ex.nameLocalized?.en || "No English name"})`
  );
});

// בדיקה 3: תרגילים עם משקולות
const dumbbellExercises = getDumbbellExercises();
console.log(`\n3. תרגילי משקולות: ${dumbbellExercises.length}`);
dumbbellExercises.forEach((ex) => {
  console.log(
    `   - ${ex.nameLocalized?.he || ex.name} (${ex.nameLocalized?.en || "No English name"})`
  );
});

// בדיקה 4: סינון חכם - אימון בית ללא ציוד
console.log("\n4. אימון בית ללא ציוד:");
const homeNoEquipment = getSmartFilteredExercises(["home"], []);
homeNoEquipment.forEach((ex) => {
  console.log(
    `   - ${ex.nameLocalized?.he || ex.name} - ${ex.equipment_needed?.join(", ") || ex.equipment || "לא מוגדר"}`
  );
});

// בדיקה 5: קטגוריות ציוד
console.log("\n5. קטגוריות ציוד:");
Object.entries(EQUIPMENT_CATEGORIES).forEach(([key, value]) => {
  console.log(`   ${key}: ${value.join(", ")}`);
});

console.log("\n=== סיום בדיקה ===");
