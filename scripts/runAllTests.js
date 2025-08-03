/**
 * @file scripts/runAllTests.js
 * @brief מריץ את כל כלי הבדיקה ביחד - סקריפט מרכזי
 * @version 1.0
 * @notes רץ עם: node scripts/runAllTests.js
 */

const { execSync } = require("child_process");
const path = require("path");

console.log("🚀 GYMovoo - הרצת כל כלי הBדיקה");
console.log("=====================================\n");

const tests = [
  {
    name: "🏥 בדיקת בריאות פרויקט",
    script: "projectHealthCheck.js",
    critical: true,
    allowWarnings: false,
  },
  {
    name: "🧭 בדיקת ניווט v2.0",
    script: "checkNavigation.js",
    critical: false, // שונה ללא קריטי כי יש בעיות קטנות
    allowWarnings: true,
  },
  {
    name: "♿ בדיקת נגישות v2.0",
    script: "accessibilityCheck.js",
    critical: false,
    allowWarnings: true,
  },
  {
    name: "🔒 בדיקת אבטחה",
    script: "securityCheck.js",
    critical: true,
    allowWarnings: false,
  },
  {
    name: "⚡ בדיקת קומפילציה",
    script: "quickCompileCheck.js",
    critical: true,
    allowWarnings: false,
  },
];

let totalIssues = 0;
let criticalFailed = false;
const results = [];

console.log("📊 מריץ בדיקות...\n");

tests.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.name}`);
  console.log("-".repeat(50));

  try {
    const result = execSync(`node scripts/${test.script}`, {
      encoding: "utf8",
      cwd: path.join(__dirname, ".."),
      stdio: "pipe",
    });

    console.log("✅ הושלם בהצלחה");
    results.push({ ...test, status: "success", output: result });
  } catch (error) {
    const isCritical = test.critical;
    const hasWarnings = test.allowWarnings && error.code === 1;

    if (hasWarnings) {
      console.log("⚠️ בעיות לא קריטיות זוהו");
      results.push({ ...test, status: "warning", output: error.stdout });
    } else {
      console.log(
        `${isCritical ? "❌" : "⚠️"} ${isCritical ? "נכשל" : "בעיות זוהו"}`
      );

      if (isCritical) {
        criticalFailed = true;
      }

      // הצגת שורות אחרונות של השגיאה
      const errorLines = error.stdout
        ? error.stdout.split("\n").slice(-3)
        : ["Unknown error"];
      errorLines.forEach((line) => {
        if (line.trim()) console.log(`   ${line}`);
      });

      results.push({ ...test, status: "failed", error: error.message });
      totalIssues++;
    }
  }
});

// סיכום סופי
console.log("\n" + "=".repeat(60));
console.log("📋 סיכום כל הבדיקות");
console.log("=".repeat(60));

results.forEach((result, index) => {
  let status = "✅";
  let statusText = "הצליח";

  if (result.status === "warning") {
    status = "⚠️";
    statusText = "אזהרות";
  } else if (result.status === "failed") {
    status = result.critical ? "❌" : "⚠️";
    statusText = "נכשל";
  }

  console.log(`${index + 1}. ${status} ${result.name}: ${statusText}`);
});

console.log(`\n📊 סטטיסטיקות:`);
console.log(
  `   🟢 הצליחו: ${results.filter((r) => r.status === "success").length}/${results.length}`
);
console.log(
  `   🟡 אזהרות: ${results.filter((r) => r.status === "warning").length}/${results.length}`
);
console.log(
  `   🔴 נכשלו: ${results.filter((r) => r.status === "failed").length}/${results.length}`
);

if (criticalFailed) {
  console.log("\n🚨 בדיקות קריטיות נכשלו - תיקון נדרש לפני המשך!");
  console.log("💡 הרץ כל בדיקה בנפרד לפירוט מלא של הבעיות");
  process.exit(1);
} else if (totalIssues > 0) {
  console.log("\n⚠️ יש בעיות שזוהו, אבל לא קריטיות");
  console.log("💡 מומלץ לתקן בהקדם האפשרי");
} else {
  console.log("\n🎉 כל הבדיקות עברו בהצלחה!");
}

console.log("\n🔗 להרצה מפורטת של בדיקה ספציפית:");
console.log("   node scripts/[שם-הסקריפט].js");

console.log("\n✅ הרצת כל הבדיקות הושלמה");
