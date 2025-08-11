/**
 * @file validateProductionDemoSeparation.js
 * @brief 🔍 כלי בדיקה מקיף לוידוא הפרדת קוד דמו מפרודקשן
 * @description בודק שהארכיטקטורה נקייה, בטוחה ועובדת כמצופה
 * @created 2025-08-10
 * @usage node validateProductionDemoSeparation.js
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 🎯 הגדרות בדיקה
const config = {
  projectRoot: process.cwd(),
  productionServices: [
    "src/services/workoutSimulationService.ts",
    "src/services/workoutHistoryService.ts",
    "src/services/questionnaireService.ts",
    "src/utils/personalDataUtils.ts",
  ],
  demoServices: [
    "src/services/demo/demoUserService.ts",
    "src/services/demo/demoWorkoutService.ts",
    "src/services/demo/demoHistoryService.ts",
    "src/services/demo/demoWorkoutDurationService.ts",
  ],
  bannedInProduction: [
    "import.*realisticDemoService",
    "realisticDemoService\\.",
    "generateDemoUser\\(",
    "isDemo:\\s*true",
  ],
  requiredInDemo: ["__DEV__", "DEMO ONLY", "should not be used in production"],
};

// 📊 תוצאות בדיקה
let passed = 0;
let failed = 0;
const errors = [];

function check(testName, condition, errorMsg = "") {
  if (condition) {
    passed++;
    console.log(`✅ ${testName}`);
  } else {
    failed++;
    console.error(`❌ ${testName}`);
    if (errorMsg) {
      errors.push(errorMsg);
      console.error(`   ${errorMsg}`);
    }
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.join(config.projectRoot, filePath));
}

function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(config.projectRoot, filePath), "utf8");
  } catch (error) {
    return null;
  }
}

function checkProductionFiles() {
  console.log("\n🏭 בדיקת קבצי Production...");

  config.productionServices.forEach((serviceFile) => {
    const exists = fileExists(serviceFile);
    check(`קובץ קיים: ${path.basename(serviceFile)}`, exists);

    if (!exists) return;

    const content = readFile(serviceFile);
    let hasIssues = false;
    const foundIssues = [];

    config.bannedInProduction.forEach((pattern) => {
      const regex = new RegExp(pattern, "g");
      if (regex.test(content)) {
        hasIssues = true;
        foundIssues.push(pattern);
      }
    });

    check(
      `קובץ production נקי: ${path.basename(serviceFile)}`,
      !hasIssues,
      hasIssues ? `נמצאו: ${foundIssues.join(", ")}` : ""
    );
  });
}

function checkDemoFiles() {
  console.log("\n🔴 בדיקת קבצי Demo...");

  config.demoServices.forEach((demoFile) => {
    const exists = fileExists(demoFile);
    check(`קובץ דמו קיים: ${path.basename(demoFile)}`, exists);

    if (!exists) return;

    const content = readFile(demoFile);
    const hasAllProtections = config.requiredInDemo.every((required) =>
      content.includes(required)
    );

    check(
      `הגנות במקום: ${path.basename(demoFile)}`,
      hasAllProtections,
      !hasAllProtections ? "חסרות הגנות אבטחה" : ""
    );
  });
}

function checkArchitecture() {
  console.log("\n🏗️ בדיקת ארכיטקטורה...");

  // תיקיית demo
  check("תיקיית demo קיימת", fileExists("src/services/demo"));

  // demoWorkoutService משתמש ב-production
  const demoWorkoutContent = readFile(
    "src/services/demo/demoWorkoutService.ts"
  );
  if (demoWorkoutContent) {
    const usesProduction = demoWorkoutContent.includes(
      "workoutSimulationService"
    );
    check("דמו משתמש בשירות production", usesProduction);
  }

  // exports נכונים
  const indexContent = readFile("src/services/index.ts");
  if (indexContent) {
    const hasExports =
      indexContent.includes("demo/index") ||
      indexContent.includes("demo/demoUserService");
    check("exports נכונים", hasExports);
  }
}

function checkImports() {
  console.log("\n📦 בדיקת Imports...");

  const screenFiles = [
    "src/screens/welcome/WelcomeScreen.tsx",
    "src/screens/questionnaire/UnifiedQuestionnaireScreen.tsx",
  ];

  screenFiles.forEach((file) => {
    if (!fileExists(file)) return;

    const content = readFile(file);

    // בדיקה שלא נותרו imports ישנים
    const hasOldImports =
      /import.*realisticDemoService.*from.*services[^/]/.test(content);

    check(
      `imports מעודכנים: ${path.basename(file)}`,
      !hasOldImports,
      hasOldImports ? "נמצאו imports ישנים" : ""
    );
  });
}

function checkCompilation() {
  console.log("\n⚙️ בדיקת קומפילציה...");

  try {
    execSync("npx tsc --noEmit --skipLibCheck", {
      cwd: config.projectRoot,
      stdio: "pipe",
    });
    check("קומפילציה TypeScript", true);
  } catch (error) {
    check("קומפילציה TypeScript", false, "שגיאות קומפילציה");
  }
}

// 🚀 הרצה ראשית
function runValidation() {
  console.log("🔍 מתחיל בדיקה מקיפה של הפרדת דמו-production...");
  console.log("=".repeat(60));

  checkProductionFiles();
  checkDemoFiles();
  checkArchitecture();
  checkImports();
  checkCompilation();

  // סיכום
  console.log("\n📊 סיכום:");
  console.log("=".repeat(30));
  console.log(`✅ עבר: ${passed}`);
  console.log(`❌ נכשל: ${failed}`);

  if (errors.length > 0) {
    console.error("\n🚨 שגיאות:");
    errors.forEach((error, i) => console.error(`${i + 1}. ${error}`));
  }

  const success = failed === 0;
  console.log(`\n🎯 תוצאה: ${success ? "✅ SUCCESS" : "❌ FAILED"}`);

  if (success) {
    console.log("\n🎉 מעולה! הפרדת דמו-production עובדת מושלם!");
  }

  return success;
}

// הרצה אוטומטית
if (require.main === module) {
  const success = runValidation();
  process.exit(success ? 0 : 1);
}

module.exports = { runValidation };
