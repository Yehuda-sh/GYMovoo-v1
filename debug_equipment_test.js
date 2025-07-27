/**
 * בדיקת אלגוריתם AI לזיהוי הבעיה בבחירת התרגילים
 * Quick test to debug AI algorithm equipment detection issue
 */

// צמיחת נתוני בדיקה
const testEquipment = ["cable_machine", "dumbbells", "barbell"];
const testWorkoutName = "חזה ושלושי";

console.log("🧪 מבצע בדיקת דיבוג על האלגוריתם");
console.log("📦 ציוד לבדיקה:", testEquipment);
console.log("🎯 סוג אימון:", testWorkoutName);

// בדיקה מדומה של פונקציית isEquipmentAvailable
const testCases = [
  { exerciseEquipment: "dumbbells", expected: true },
  { exerciseEquipment: "cable_machine", expected: true },
  { exerciseEquipment: "barbell", expected: true },
  { exerciseEquipment: "kettlebell", expected: false },
  { exerciseEquipment: "bodyweight", expected: true },
];

console.log("\n📋 תוצאות בדיקה:");
testCases.forEach((testCase) => {
  const { exerciseEquipment, expected } = testCase;

  // סימולציה של הפונקציה
  let result = false;

  if (exerciseEquipment === "bodyweight" || exerciseEquipment === "none") {
    result = true;
  } else if (testEquipment.includes(exerciseEquipment)) {
    result = true;
  } else {
    // בדיקת מיפוי
    const equipmentMap = {
      dumbbells: ["dumbbells", "adjustable_dumbbells"],
      barbell: ["barbell", "olympic_barbell"],
      cable_machine: ["cable_machine", "cable_crossover"],
    };

    const alternatives = equipmentMap[exerciseEquipment] || [exerciseEquipment];
    result = alternatives.some((alt) => testEquipment.includes(alt));
  }

  const status = result === expected ? "✅" : "❌";
  console.log(`${status} ${exerciseEquipment}: ${result} (צפוי: ${expected})`);
});

console.log("\n🎯 ציון מדומה למשתמש עם ציוד:");
console.log("- מכונת כבלים: ✅ זמין");
console.log("- משקולות יד: ✅ זמין");
console.log("- מוט ישר: ✅ זמין");
console.log("- צריך לבחור תרגילים עם הציוד הזה, לא משקל גוף!");
