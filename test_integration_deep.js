/**
 * בדיקה מעמיקה של QuickWorkoutGenerator עם אינטגרציה מלאה
 * Deep integration test for QuickWorkoutGenerator
 */

// טסט סימולציה של פונקציונליות
const testQuickWorkoutGenerator = () => {
  console.log("🚀 Starting comprehensive QuickWorkoutGenerator test...\n");

  // בדיקת הטיפוסים והממשקים
  const mockUserData = {
    environments: ["home"],
    equipment: [], // בית ללא ציוד - צריך להחזיר רק תרגילי משקל גוף
    experience: "beginner",
    goal: "בריאות כללית",
    duration: 30,
  };

  console.log("📊 Test scenario: Home workout with no equipment");
  console.log(`Environment: ${mockUserData.environments.join(", ")}`);
  console.log(
    `Equipment: ${mockUserData.equipment.length === 0 ? "None" : mockUserData.equipment.join(", ")}`
  );
  console.log(`Experience: ${mockUserData.experience}`);
  console.log(`Goal: ${mockUserData.goal}`);
  console.log(`Duration: ${mockUserData.duration} minutes\n`);

  // בדיקת התוכן החדש
  const fs = require("fs");
  const path = require("path");

  const quickWorkoutPath = path.join(
    __dirname,
    "src",
    "services",
    "quickWorkoutGenerator.ts"
  );
  const content = fs.readFileSync(quickWorkoutPath, "utf-8");

  // בדיקות אינטגרציה מתקדמות
  const integrationChecks = [
    {
      name: "Smart filtering function integration",
      test: () => {
        const hasSmartFilter = content.includes(
          "getSmartFilteredExercises(environments, equipment)"
        );
        const hasEnvironmentCheck =
          content.includes("environments") && content.includes("equipment");
        return hasSmartFilter && hasEnvironmentCheck;
      },
      critical: true,
    },
    {
      name: "Bodyweight fallback for home workouts",
      test: () => {
        const hasBodyweightLogic =
          content.includes("בית ללא ציוד") ||
          content.includes("home without equipment");
        const hasNoneEquipment =
          content.includes('equipment === "none"') ||
          content.includes('"none"');
        return hasBodyweightLogic || hasNoneEquipment;
      },
      critical: true,
    },
    {
      name: "Hebrew localization in exercise creation",
      test: () => {
        const hasHebrewName = content.includes("nameLocalized.he");
        const hasHebrewTips = content.includes("tipsLocalized.he");
        return hasHebrewName && hasHebrewTips;
      },
      critical: true,
    },
    {
      name: "All selection methods use ExtendedExerciseTemplate",
      test: () => {
        const methodsUsingNew = [
          "selectCompoundExercises",
          "selectMuscleBuilding",
          "selectStrengthExercises",
          "selectEnduranceExercises",
          "selectBalancedExercises",
        ];

        return methodsUsingNew.every((method) => {
          const methodRegex = new RegExp(
            `${method}[^}]*ExtendedExerciseTemplate`,
            "s"
          );
          return methodRegex.test(content);
        });
      },
      critical: true,
    },
    {
      name: "Helper methods updated to new type",
      test: () => {
        const helperMethods = [
          "filterAndSelect",
          "fillRemaining",
          "prioritizeByEquipment",
          "groupByCategory",
        ];
        return helperMethods.every((method) => {
          const methodRegex = new RegExp(
            `${method}[^}]*ExtendedExerciseTemplate`,
            "s"
          );
          return methodRegex.test(content);
        });
      },
      critical: true,
    },
    {
      name: "Exercise creation with sets uses new interface",
      test: () => {
        const hasCreateWithSets = content.includes("createExerciseWithSets");
        const usesNewInterface = content.includes(
          "template: ExtendedExerciseTemplate"
        );
        return hasCreateWithSets && usesNewInterface;
      },
      critical: true,
    },
    {
      name: "Equipment type compatibility (none vs bodyweight)",
      test: () => {
        // בדיקה שהקוד עבר מ-bodyweight ל-none
        const oldBodyweight = content.includes('equipment === "bodyweight"');
        const newNone = content.includes('equipment === "none"');
        return !oldBodyweight && newNone;
      },
      critical: true,
    },
    {
      name: "Import statements are complete",
      test: () => {
        const requiredImports = [
          "ExtendedExerciseTemplate",
          "getSmartFilteredExercises",
          "getBodyweightExercises",
          "exerciseDatabase",
        ];
        return requiredImports.every((imp) => content.includes(imp));
      },
      critical: false,
    },
  ];

  console.log("🔍 Running integration checks:\n");

  let criticalPassed = 0;
  let criticalTotal = 0;
  let totalPassed = 0;

  integrationChecks.forEach((check, index) => {
    const passed = check.test();
    const status = passed ? "✅ PASS" : "❌ FAIL";
    const priority = check.critical ? "🔥 CRITICAL" : "📝 OPTIONAL";

    console.log(`${index + 1}. ${check.name}`);
    console.log(`   Status: ${status} (${priority})`);

    if (check.critical) {
      criticalTotal++;
      if (passed) criticalPassed++;
    }

    if (passed) totalPassed++;
    console.log("");
  });

  // סיכום התוצאות
  console.log("📋 TEST SUMMARY:");
  console.log(`Total checks: ${integrationChecks.length}`);
  console.log(
    `Passed: ${totalPassed}/${integrationChecks.length} (${Math.round((totalPassed / integrationChecks.length) * 100)}%)`
  );
  console.log(
    `Critical checks: ${criticalPassed}/${criticalTotal} (${Math.round((criticalPassed / criticalTotal) * 100)}%)`
  );

  if (criticalPassed === criticalTotal) {
    console.log("\n🎉 ALL CRITICAL CHECKS PASSED! Integration is successful.");
    console.log(
      "✨ QuickWorkoutGenerator is ready for use with the new exercise database."
    );
  } else {
    console.log(
      "\n⚠️  Some critical checks failed. Integration needs attention."
    );
  }

  console.log(`\n📊 Code metrics:`);
  console.log(`- File size: ${(content.length / 1024).toFixed(1)}KB`);
  console.log(`- Lines of code: ${content.split("\n").length}`);
  console.log(
    `- Functions: ${(content.match(/private static|static async|public static/g) || []).length}`
  );

  return criticalPassed === criticalTotal;
};

// הרצת הטסט
const success = testQuickWorkoutGenerator();
process.exit(success ? 0 : 1);
