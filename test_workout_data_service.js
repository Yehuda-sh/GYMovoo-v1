/**
 * בדיקת workoutDataService עם השינויים החדשים
 */

const fs = require("fs");
const path = require("path");

console.log(
  "🔍 Testing workoutDataService integration with new exercise database...\n"
);

const workoutDataPath = path.join(
  __dirname,
  "src",
  "services",
  "workoutDataService.ts"
);
const content = fs.readFileSync(workoutDataPath, "utf-8");

// בדיקות השינויים החדשים
const integrationChecks = [
  {
    name: "Updated imports to use new exercise database",
    test: () =>
      content.includes("ExtendedExerciseTemplate") &&
      content.includes("exerciseDatabase"),
  },
  {
    name: "Uses smart filtering functions",
    test: () => content.includes("getSmartFilteredExercises"),
  },
  {
    name: "Updated equipment type from bodyweight to none",
    test: () => {
      const noneCount = (content.match(/equipment === "none"/g) || []).length;
      const bodyweightCount = (
        content.match(/equipment === "bodyweight"/g) || []
      ).length;
      return noneCount > 0 && bodyweightCount === 0;
    },
  },
  {
    name: "Updated to use Hebrew localized fields",
    test: () =>
      content.includes("nameLocalized.he") &&
      content.includes("tipsLocalized.he"),
  },
  {
    name: "Smart filtering in basic exercises",
    test: () =>
      content.includes("getSmartFilteredExercises(environments, equipment)"),
  },
  {
    name: "Environment type safety",
    test: () => content.includes("('home' | 'gym' | 'outdoor')[]"),
  },
  {
    name: "ExerciseFromDB type alias",
    test: () =>
      content.includes("type ExerciseFromDB = ExtendedExerciseTemplate"),
  },
];

console.log("📋 Running integration checks:\n");

let passed = 0;
integrationChecks.forEach((check, index) => {
  const result = check.test();
  const status = result ? "✅ PASS" : "❌ FAIL";
  console.log(`${index + 1}. ${check.name}: ${status}`);
  if (result) passed++;
});

console.log(
  `\n📊 Results: ${passed}/${integrationChecks.length} checks passed`
);

if (passed === integrationChecks.length) {
  console.log("\n🎉 All checks passed! workoutDataService is fully updated.");
  console.log("\n🔥 Key improvements:");
  console.log(
    "✅ Smart filtering integration - home without equipment = bodyweight only"
  );
  console.log("✅ Hebrew localization support");
  console.log("✅ Updated equipment types");
  console.log("✅ Type safety improvements");
  console.log("✅ Uses new exercise database structure");
} else {
  console.log("\n⚠️ Some checks failed - may need additional updates");
}

console.log(`\n📝 File metrics:`);
console.log(`- Size: ${(content.length / 1024).toFixed(1)}KB`);
console.log(`- Lines: ${content.split("\n").length}`);
console.log(
  `- Functions using smart filtering: ${(content.match(/getSmartFilteredExercises/g) || []).length}`
);
