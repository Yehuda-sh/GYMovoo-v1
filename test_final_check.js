const {
  allExercises,
  getBodyweightExercises,
  getDumbbellExercises,
  getCardioExercises,
  getFlexibilityExercises,
  getResistanceBandExercises,
  getSmartFilteredExercises,
} = require("./src/data/exercises");

console.log("=== בדיקת המבנה החדש ===");
console.log(`סה"כ תרגילים: ${allExercises.length}`);
console.log(`תרגילי משקל גוף: ${getBodyweightExercises().length}`);
console.log(`תרגילי משקולות: ${getDumbbellExercises().length}`);
console.log(`תרגילי קרדיו: ${getCardioExercises().length}`);
console.log(`תרגילי גמישות: ${getFlexibilityExercises().length}`);
console.log(`תרגילי גומי: ${getResistanceBandExercises().length}`);

console.log("\n=== רשימת תרגילי משקל גוף ===");
getBodyweightExercises().forEach((ex, index) => {
  console.log(`${index + 1}. ${ex.nameLocalized.he} (${ex.difficulty})`);
});

console.log("\n=== בדיקת סינון חכם ===");
const filteredHome = getSmartFilteredExercises(["בית"], ["ללא ציוד"]);
console.log(`תרגילים לבית ללא ציוד: ${filteredHome.length}`);

console.log("\n=== הכל עובד! ===");
