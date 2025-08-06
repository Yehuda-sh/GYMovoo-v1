/**
 * @file runAllProjectChecks.js
 * @brief מריץ את כל בדיקות הבעיות המרכזיות בפרויקט ומרכז תוצאות
 *
 * להרצה: node runAllProjectChecks.js
 */

const { execSync } = require("child_process");

const checks = [
  {
    name: "בדיקת איכות קוד",
    command: "node scripts/codeQualityCheck.js",
  },
  {
    name: "בדיקת נגישות",
    command: "node scripts/accessibilityCheck.js",
  },
  {
    name: "בדיקת מבנה פרויקט",
    command: "node scripts/projectStructureValidator.js",
  },
  {
    name: "בדיקת בריאות כללית",
    command: "node scripts/projectHealthCheck.js",
  },
  {
    name: "בדיקת ביצועים",
    command: "node scripts/performanceCheck.js",
  },
  {
    name: "בדיקת אבטחה",
    command: "node scripts/securityCheck.js",
  },
  {
    name: "בדיקת קומפילציה מהירה",
    command: "node scripts/quickCompileCheck.js",
  },
];

console.log("🚦 מריץ את כל בדיקות הבעיות המרכזיות בפרויקט...\n");

checks.forEach(({ name, command }) => {
  console.log(`\n🔎 ${name}...`);
  try {
    const output = execSync(command, { encoding: "utf8" });
    console.log(output);
  } catch (error) {
    console.log(`❌ שגיאה בבדיקה: ${name}`);
    console.log(error.stdout ? error.stdout : error.message);
  }
});

console.log("\n✅ כל הבדיקות הסתיימו!");
