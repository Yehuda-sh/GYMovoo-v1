/**
 * @file scripts/quickCompileCheck.js
 * @brief בדיקה מהירה של קומפילציה ולוגים
 * @description בודק שהאפליקציה מקומפלת נכון ומציג לוגים רלוונטיים
 */

const { execSync } = require("child_process");
const path = require("path");

console.log("🔧 Quick Compile Check - בדיקה מהירה");
console.log("═".repeat(40));

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
    console.log(tscError.stdout?.toString() || "שגיאה לא ידועה");
  }

  console.log("\n🧪 בודק ESLint...");

  // בדיקת ESLint (רק על הקבצים שהשתנו)
  try {
    const result = execSync(
      "npx eslint src/screens/main/MainScreen.tsx src/screens/workout/QuickWorkoutScreen.tsx src/navigation/types.ts --format=compact",
      {
        cwd: path.resolve(__dirname, ".."),
        stdio: "pipe",
      }
    );

    if (result.toString().trim()) {
      console.log("⚠️ ESLint warnings/errors:");
      console.log(result.toString());
    } else {
      console.log("✅ ESLint - נקי");
    }
  } catch (eslintError) {
    console.log("⚠️ ESLint issues:");
    console.log(eslintError.stdout?.toString() || "בעיה ב-ESLint");
  }

  console.log("\n📱 הנחיות לבדיקה באפליקציה:");
  console.log("─".repeat(30));
  console.log("1. npm start או expo start");
  console.log("2. פתח את האפליקציה");
  console.log('3. לחץ על "התחל אימון מהיר" - אמור להיכנס ישירות לאימון');
  console.log(
    '4. חזור ולחץ על "יום 1" - אמור להיכנס לאימון עם השם "חזה + טריצפס"'
  );
  console.log('5. בדוק שלא מופיע מסך "תוכנית AI"');

  console.log("\n🔍 איך לראות לוגים:");
  console.log("─".repeat(20));
  console.log("• פתח Chrome DevTools (לחץ j במטרו)");
  console.log("• או בטרמינל תראה לוגים");
  console.log('• חפש "🚀 MainScreen" ו-"✅ QuickWorkout"');
} catch (error) {
  console.error("❌ שגיאה כללית:", error.message);
}

console.log("\n═".repeat(40));
console.log("🚀 סיים! רוץ עכשיו: node scripts/testNavigationFlow.js");
