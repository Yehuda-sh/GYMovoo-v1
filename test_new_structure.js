/**
 * @file test_new_structure.js
 * @description בדיקה מהירה של המבנה החדש
 */

// בדיקת הייבוא החדש
const {
  allExercises,
  getBodyweightExercises,
  getDumbbellExercises,
  getCardioExercises,
  getFlexibilityExercises,
  getExerciseStats,
} = require("./src/data/exercises/index.ts");

console.log("🔍 בודק מבנה תרגילים חדש...\n");

// סטטיסטיקות כלליות
const stats = getExerciseStats();
console.log("📊 סטטיסטיקות:");
console.log(`  - סה"כ תרגילים: ${stats.total}`);
console.log(`  - תרגילי משקל גוף: ${stats.bodyweight}`);
console.log(`  - תרגילי משקולות: ${stats.dumbbells}`);
console.log(`  - תרגילי קרדיו: ${stats.cardio}`);
console.log(`  - תרגילי גמישות: ${stats.flexibility}`);
console.log(`  - תרגילי גומי התנגדות: ${stats.resistanceBands}\n`);

// בדיקת תרגילי משקל גוף
const bodyweightExercises = getBodyweightExercises();
console.log(`✅ תרגילי משקל גוף: ${bodyweightExercises.length}`);
bodyweightExercises.forEach((ex, index) => {
  console.log(
    `  ${index + 1}. ${ex.nameLocalized.he} (${ex.nameLocalized.en})`
  );
});

console.log(
  "\n🎯 הבעיה הקודמת - יש לנו עכשיו " +
    bodyweightExercises.length +
    " תרגילי משקל גוף במקום 5!"
);

// בדיקת תרגילי משקולות
const dumbbellExercises = getDumbbellExercises();
console.log(`\n💪 תרגילי משקולות: ${dumbbellExercises.length}`);
dumbbellExercises.forEach((ex, index) => {
  console.log(`  ${index + 1}. ${ex.nameLocalized.he}`);
});

// בדיקת תרגילי קרדיו
const cardioExercises = getCardioExercises();
console.log(`\n🏃 תרגילי קרדיו: ${cardioExercises.length}`);
cardioExercises.forEach((ex, index) => {
  console.log(`  ${index + 1}. ${ex.nameLocalized.he}`);
});

console.log("\n✨ המבנה החדש מוכן!");
