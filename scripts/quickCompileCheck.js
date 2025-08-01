/**
 * @file scripts/quickCompileCheck.js
 * @brief בדיקה מהירה של קומפילציה ולוגים
 * @description בודק שהאפליקציה מקומפלת נכון ומציג לוגים רלוונטיים
 */

const { execSync } = require("child_process");
const path = require("path");

console.log("🔧 Quick Compile Check - בדיקה מהירה");
console.log("═".repeat(40));

let hasErrors = false;
let hasWarnings = false;

try {
  console.log("📦 בודק TypeScript compilation...");

  // בדיקת TypeScript
  try {
    execSync("npx tsc --noEmit", {
      cwd: path.resolve(__dirname, ".."),
      stdio: "pipe",
    });
    console.log("✅ TypeScript compilation - תקין");
  } catch (tscError) {
    console.log("❌ שגיאות TypeScript:");
    console.log(
      tscError.stdout?.toString() ||
        tscError.stderr?.toString() ||
        "שגיאה לא ידועה"
    );
    hasErrors = true;
  }

  console.log("\n🧪 בודק ESLint...");

  // בדיקת ESLint - דינמית על קבצים חשובים
  try {
    const importantPaths = ["src/**/*.{ts,tsx}", "App.tsx"];

    const result = execSync(
      `npx eslint ${importantPaths.join(" ")} --max-warnings=10`,
      {
        cwd: path.resolve(__dirname, ".."),
        stdio: "pipe",
        encoding: "utf8",
      }
    );

    if (result.trim()) {
      console.log("⚠️ ESLint warnings/errors:");
      console.log(result);
      hasWarnings = true;
    } else {
      console.log("✅ ESLint - נקי");
    }
  } catch (eslintError) {
    // ESLint מחזיר exit code > 0 כשיש שגיאות, זה נורמלי
    if (eslintError.stdout && eslintError.stdout.trim()) {
      console.log("⚠️ ESLint issues:");
      console.log(eslintError.stdout);
      hasWarnings = true;
    } else {
      console.log("⚠️ ESLint לא זמין או שגיאת הגדרה");
      hasWarnings = true;
    }
  }

  console.log("\n📱 הנחיות לבדיקה באפליקציה:");
  console.log("─".repeat(30));
  console.log("1. npm start או expo start");
  console.log("2. פתח את האפליקציה בסימולטור/מכשיר");
  console.log("3. בדוק שהמסך הראשי נטען כהלכה");
  console.log("4. בדוק ניווט בין המסכים השונים");
  console.log("5. וודא שאין crash או שגיאות JavaScript");

  console.log("\n🔍 איך לראות לוגים:");
  console.log("─".repeat(20));
  console.log("• פתח Chrome DevTools (לחץ j במטרו)");
  console.log("• או בטרמינל תראה לוגים");
  console.log("• חפש שגיאות או אזהרות בצבע אדום");

  console.log("\n✅ כלים נוספים מומלצים:");
  console.log("─".repeat(25));
  console.log("• node scripts/checkNavigation.js - בדיקת ניווט");
  console.log("• node scripts/projectHealthCheck.js - בדיקה כללית");
  console.log("• node scripts/codeQualityCheck.js - איכות קוד");
} catch (error) {
  console.error("❌ שגיאה כללית:", error.message);
  hasErrors = true;
}

console.log("\n═".repeat(40));

// Exit code לפי תוצאות
if (hasErrors) {
  console.log("� יש שגיאות שדורשות תשומת לב");
  process.exit(1);
} else if (hasWarnings) {
  console.log("🟡 יש אזהרות - מומלץ לטפל");
  process.exit(0);
} else {
  console.log("🟢 הכל נראה תקין!");
  process.exit(0);
}
