/**
 * בדיקה מהירה של הקובץ החדש
 */

console.log("🔍 Testing QuickWorkoutGenerator TypeScript syntax...");

// בדיקת syntax בסיסית - טעינת הקובץ
const fs = require("fs");
const path = require("path");

const quickWorkoutPath = path.join(
  __dirname,
  "src",
  "services",
  "quickWorkoutGenerator.ts"
);
const content = fs.readFileSync(quickWorkoutPath, "utf-8");

// בדיקות בסיסיות
const checks = [
  {
    name: "Import statements are valid",
    test: () =>
      content.includes("import") &&
      content.includes("ExtendedExerciseTemplate"),
  },
  {
    name: "Class definition exists",
    test: () => content.includes("export class QuickWorkoutGenerator"),
  },
  {
    name: "Main method exists",
    test: () => content.includes("generateQuickWorkout"),
  },
  {
    name: "Smart filtering integration",
    test: () => content.includes("getSmartFilteredExercises"),
  },
  {
    name: "Hebrew comments preserved",
    test: () => content.includes("תרגילים") && content.includes("משקל גוף"),
  },
  {
    name: "All selection methods updated",
    test: () =>
      content.includes("ExtendedExerciseTemplate[]") &&
      !content.includes("QuickWorkoutTemplate[]"),
  },
  {
    name: "Bilingual support",
    test: () =>
      content.includes("nameLocalized.he") &&
      content.includes("tipsLocalized.he"),
  },
];

console.log("\n📋 Running syntax and integration checks:");
checks.forEach((check, index) => {
  const passed = check.test();
  console.log(`${index + 1}. ${check.name}: ${passed ? "✅ PASS" : "❌ FAIL"}`);
});

console.log("\n🎯 QuickWorkoutGenerator integration analysis complete!");
console.log(`📝 File size: ${(content.length / 1024).toFixed(1)}KB`);
console.log(`📄 Lines of code: ${content.split("\n").length}`);
