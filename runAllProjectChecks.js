/**
 * @file runAllProjectChecks.js
 * @brief מריץ את כל בדיקות הבעיות המרכזיות בפרויקט ומרכז תוצאות
 *
 * להרצה: node runAllProjectChecks.js
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const exists = (p) => fs.existsSync(path.resolve(p));

const checks = [
  {
    name: "בדיקת איכות קוד",
    command: "node scripts/codeQualityCheck.js",
    file: "scripts/codeQualityCheck.js",
  },
  {
    name: "בדיקת נגישות",
    command: "node scripts/accessibilityCheck.js",
    file: "scripts/accessibilityCheck.js",
  },
  {
    name: "בדיקת מבנה פרויקט",
    command: "node scripts/projectStructureValidator.js",
    file: "scripts/projectStructureValidator.js",
  },
  {
    name: "בדיקת בריאות כללית",
    command: "node scripts/projectHealthCheck.js",
    file: "scripts/projectHealthCheck.js",
  },
  {
    name: "בדיקת ביצועים",
    command: "node scripts/performanceCheck.js",
    file: "scripts/performanceCheck.js",
  },
  {
    name: "בדיקת אבטחה",
    command: "node scripts/securityCheck.js",
    file: "scripts/securityCheck.js",
  },
  {
    name: "בדיקת ציוד (מהיר)",
    command: "node scripts/equipmentManager.js --quick",
    file: "scripts/equipmentManager.js",
  },
  {
    name: "בדיקת קומפילציה מהירה",
    command: "node scripts/quickCompileCheck.js",
    file: "scripts/quickCompileCheck.js",
  },
  // בדיקות שאלון ודמו
  {
    name: "שאלון: לוגיקת ניתוב",
    command: "node testQuestionnaireLogic.js",
    file: "testQuestionnaireLogic.js",
  },
  {
    name: "שאלון: זרימת שאלות",
    command: "node testQuestionnaireFlow.js",
    file: "testQuestionnaireFlow.js",
  },
  {
    name: "שאלון: זיהוי השלמה",
    command: "node testQuestionnaireDetection.js",
    file: "testQuestionnaireDetection.js",
  },
  {
    name: "דמו: מבנה משתמש ושאלון",
    command: "node testRealisticUserQuestionnaireFix.js",
    file: "testRealisticUserQuestionnaireFix.js",
  },
  {
    name: "דמו: אימייל וזרימה",
    command: "node testRealisticUserFix.js",
    file: "testRealisticUserFix.js",
  },
  // TypeScript type-check דרך npm script הקיים
  { name: "TypeScript Type-Check", command: "npm run -s type-check" },
];

console.log("🚦 מריץ את כל בדיקות הבעיות המרכזיות בפרויקט...\n");

const summary = [];
let failures = 0;
let skipped = 0;

checks.forEach(({ name, command, file }) => {
  console.log(`\n🔎 ${name}...`);

  if (file && !exists(file)) {
    console.log(`⚠️ קובץ חסר, דילוג: ${file}`);
    summary.push({ name, status: "SKIPPED" });
    skipped += 1;
    return;
  }

  const start = Date.now();
  try {
    const output = execSync(command, {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    const ms = Date.now() - start;
    console.log(output.trim());
    console.log(`⏱️  זמן: ${ms}ms`);
    summary.push({ name, status: "PASS", ms });
  } catch (error) {
    const ms = Date.now() - start;
    console.log(`❌ שגיאה בבדיקה: ${name}`);
    const out = error.stdout?.toString?.() || "";
    const err = error.stderr?.toString?.() || error.message;
    if (out) console.log(out.trim());
    if (err) console.log(err.trim());
    console.log(`⏱️  זמן: ${ms}ms`);
    summary.push({ name, status: "FAIL", ms });
    failures += 1;
  }
});

console.log("\n" + "=".repeat(60));
console.log("📊 סיכום בדיקות:");
summary.forEach((s) => {
  const mark =
    s.status === "PASS" ? "✅" : s.status === "SKIPPED" ? "⚠️" : "❌";
  const t = s.ms != null ? ` (${s.ms}ms)` : "";
  console.log(`- ${mark} ${s.name}${t}`);
});
console.log(
  `\nTotals: PASS=${summary.filter((s) => s.status === "PASS").length}, FAIL=${failures}, SKIPPED=${skipped}`
);

process.exitCode = failures > 0 ? 1 : 0;

console.log(
  "\n" + (failures ? "❌ נמצאו כשלים." : "✅ כל הבדיקות הסתיימו בהצלחה!")
);
