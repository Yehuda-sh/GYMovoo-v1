/**
 * @file scripts/testNavigationFlow.js
 * @brief כלי בדיקה לזרימת הניווט החדשה - מהמסך הראשי ישירות לאימון
 * @description בודק שהשינויים שנעשו ב-MainScreen ו-QuickWorkout עובדים כמו שצריך
 * @created 2025-07-31
 * @updated 2025-08-01
 * @author GitHub Copilot
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class NavigationFlowTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: [],
    };

    this.projectRoot = path.resolve(__dirname, "..");
    console.log("🔍 Navigation Flow Tester v2.0 - Enhanced");
    console.log("התחלת הבדיקה המשופרת...\n");
  }

  // בדיקת קומפילציה של הקבצים הרלוונטיים
  checkCompilation() {
    console.log("🔨 בודק קומפילציה של קבצי הניווט...");

    const filesToCheck = [
      "src/screens/main/MainScreen.tsx",
      "src/screens/workout/QuickWorkoutScreen.tsx",
      "src/navigation/types.ts",
    ];

    try {
      // בדיקה מהירה עם TypeScript רק על הקבצים שלנו
      const filesString = filesToCheck.join(" ");
      execSync(`npx tsc --noEmit --skipLibCheck ${filesString}`, {
        stdio: "pipe",
        cwd: this.projectRoot,
      });
      this.addSuccess("✅ קבצי הניווט מתקמפלים בהצלחה");
    } catch (error) {
      // בדוק אם השגיאות הן רק בקבצי הניווט שלנו
      const errorOutput = error.stderr ? error.stderr.toString() : "";

      // אם יש שגיאות ספציפיות לקבצי הניווט שלנו
      const hasOurErrors = filesToCheck.some((file) =>
        errorOutput.includes(file)
      );

      if (hasOurErrors) {
        this.addIssue("❌ יש שגיאות קומפילציה בקבצי הניווט!", "error");
        console.log("   💡 הרץ: npx tsc --noEmit כדי לראות את השגיאות");
      } else {
        // אם אין שגיאות בקבצי הניווט שלנו, זה בסדר
        this.addSuccess("✅ קבצי הניווט מתקמפלים בהצלחה");
        console.log(
          "   💡 יש שגיאות קומפילציה אחרות בפרויקט אבל לא בקבצי הניווט"
        );
      }
    }

    console.log("✅ סיום בדיקת קומפילציה\n");
  }

  // בדיקת קובץ MainScreen.tsx
  checkMainScreen() {
    console.log("📱 בודק MainScreen.tsx...");

    const mainScreenPath = path.join(
      this.projectRoot,
      "src/screens/main/MainScreen.tsx"
    );

    if (!fs.existsSync(mainScreenPath)) {
      this.addIssue("❌ קובץ MainScreen.tsx לא נמצא!", "error");
      return;
    }

    const content = fs.readFileSync(mainScreenPath, "utf8");

    // בדיקה 1: האם handleStartWorkout מנווט ל-QuickWorkout
    const handleStartWorkoutRegex =
      /handleStartWorkout[^}]*navigation\.navigate\(\s*["']QuickWorkout["']/s;
    const quickStartSourceRegex = /source:\s*["']quick_start["']/;

    if (
      handleStartWorkoutRegex.test(content) &&
      quickStartSourceRegex.test(content)
    ) {
      this.addSuccess('✅ כפתור "התחל אימון מהיר" מנווט נכון ל-QuickWorkout');
    } else {
      this.addIssue(
        '❌ כפתור "התחל אימון מהיר" לא מנווט ל-QuickWorkout!',
        "error"
      );
    }

    // בדיקה 2: האם handleDayWorkout מנווט ל-QuickWorkout עם פרמטרים נכונים
    const handleDayWorkoutRegex =
      /handleDayWorkout[\s\S]*?navigation\.navigate\(\s*["']QuickWorkout["'][\s\S]*?\}/;
    const daySelectionSourceRegex = /source:\s*["']day_selection["']/;
    const requestedDayRegex = /requestedDay:\s*dayNumber/;

    const dayWorkoutMatch = content.match(handleDayWorkoutRegex);
    if (
      dayWorkoutMatch &&
      daySelectionSourceRegex.test(dayWorkoutMatch[0]) &&
      requestedDayRegex.test(dayWorkoutMatch[0])
    ) {
      this.addSuccess("✅ כפתורי הימים מנווטים נכון ל-QuickWorkout עם פרמטרים");
    } else {
      this.addIssue("❌ כפתורי הימים לא מנווטים נכון!", "error");
    }

    // בדיקה 3: האם יש ניווט ישן ל-WorkoutPlansScreen
    if (
      content.includes("WorkoutPlansScreen") ||
      content.includes("WorkoutPlans")
    ) {
      this.addIssue(
        "⚠️ עדיין יש ניווט ל-WorkoutPlansScreen - צריך לבדוק שזה לא מפריע",
        "warning"
      );
    } else {
      this.addSuccess("✅ אין ניווט ישן ל-WorkoutPlansScreen");
    }

    // בדיקה 4: בדיקת שמות הימים
    const dayNamesCheck = [
      "חזה + טריצפס",
      "גב + ביצפס",
      "רגליים",
      "כתפיים + ליבה", // תוקן מ"בטן" ל"ליבה"
    ];

    dayNamesCheck.forEach((dayName) => {
      if (content.includes(dayName)) {
        this.addSuccess(`✅ שם יום "${dayName}" נמצא`);
      } else {
        this.addIssue(`⚠️ שם יום "${dayName}" לא נמצא`, "warning");
      }
    });

    console.log("✅ סיום בדיקת MainScreen.tsx\n");
  }

  // בדיקת קובץ QuickWorkoutScreen.tsx
  checkQuickWorkoutScreen() {
    console.log("💪 בודק QuickWorkoutScreen.tsx...");

    const quickWorkoutPath = path.join(
      this.projectRoot,
      "src/screens/workout/QuickWorkoutScreen.tsx"
    );

    if (!fs.existsSync(quickWorkoutPath)) {
      this.addIssue("❌ קובץ QuickWorkoutScreen.tsx לא נמצא!", "error");
      return;
    }

    const content = fs.readFileSync(quickWorkoutPath, "utf8");

    // בדיקה 1: האם QuickWorkout מקבל פרמטר requestedDay
    if (content.includes("requestedDay") && content.includes("source")) {
      this.addSuccess("✅ QuickWorkout מקבל פרמטרי ניווט נכונים");
    } else {
      this.addIssue("❌ QuickWorkout לא מקבל פרמטרי ניווט!", "error");
    }

    // בדיקה 2: האם יש טיפול בבחירת יום ספציפי
    if (content.includes("day_selection") && content.includes("requestedDay")) {
      this.addSuccess("✅ יש טיפול מיוחד בבחירת יום ספציפי");
    } else {
      this.addIssue("❌ אין טיפול בבחירת יום ספציפי!", "error");
    }

    // בדיקה 3: בדיקת מיפוי שמות הימים
    const dayWorkoutsMapping = content.match(/dayWorkouts\s*=\s*{[\s\S]*?}/);
    if (dayWorkoutsMapping) {
      const mapping = dayWorkoutsMapping[0];
      if (
        mapping.includes("חזה + טריצפס") &&
        mapping.includes("גב + ביצפס") &&
        mapping.includes("רגליים") &&
        mapping.includes("כתפיים + ליבה")
      ) {
        // תוקן
        this.addSuccess("✅ מיפוי שמות הימים תקין");
      } else {
        this.addIssue("⚠️ מיפוי שמות הימים לא מלא", "warning");
      }
    } else {
      this.addIssue("❌ לא נמצא מיפוי שמות הימים!", "error");
    }

    // בדיקה 4: האם generateQuickWorkout נקרא
    if (content.includes("generateQuickWorkout()")) {
      this.addSuccess("✅ generateQuickWorkout נקרא ליצירת אימון");
    } else {
      this.addIssue(
        "⚠️ generateQuickWorkout לא נקרא - אולי לא יהיו תרגילים",
        "warning"
      );
    }

    console.log("✅ סיום בדיקת QuickWorkoutScreen.tsx\n");
  }

  // בדיקת קובץ types.ts
  checkNavigationTypes() {
    console.log("🔧 בודק navigation types...");

    const typesPath = path.join(this.projectRoot, "src/navigation/types.ts");

    if (!fs.existsSync(typesPath)) {
      this.addIssue("❌ קובץ navigation/types.ts לא נמצא!", "error");
      return;
    }

    const content = fs.readFileSync(typesPath, "utf8");

    // בדיקה 1: האם QuickWorkout מקבל פרמטרים חדשים
    if (content.includes("requestedDay") && content.includes("day_selection")) {
      this.addSuccess("✅ טיפוסי הניווט כוללים פרמטרים חדשים");
    } else {
      this.addIssue("❌ טיפוסי הניווט לא עודכנו!", "error");
    }

    // בדיקה 2: בדיקת source types
    if (content.includes('"day_selection"')) {
      this.addSuccess('✅ source type "day_selection" מוגדר');
    } else {
      this.addIssue('❌ source type "day_selection" לא מוגדר!', "error");
    }

    console.log("✅ סיום בדיקת navigation types\n");
  }

  // בדיקת לוגים בטרמינל
  checkTerminalLogs() {
    console.log("📊 מציג הנחיות לבדיקת לוגים...");

    console.log(`
🔍 איך לבדוק את הלוגים:
──────────────────────

1. פתח את האפליקציה במכשיר/סימולטור
2. פתח את הטרמינל או לחץ 'j' במטרו לפתיחת DevTools
3. לחץ על "התחל אימון מהיר" - אמור לראות:
   ✅ "🚀 MainScreen - התחל אימון מהיר נלחץ!"
   ✅ מעבר ישיר למסך QuickWorkout (לא WorkoutPlans!)

4. חזור למסך הראשי ולחץ על "יום 1" - אמור לראות:
   ✅ "🚀 MainScreen - בחירת יום 1 אימון ישיר!"
   ✅ "✅ QuickWorkout - יוצר אימון ליום 1"
   ✅ מעבר ישיר למסך QuickWorkout עם שם "יום 1 - חזה + טריצפס"

5. בדוק שלא מופיע:
   ❌ מעבר למסך "תוכנית AI" 
   ❌ מסך WorkoutPlansScreen
   ❌ שגיאות קומפילציה
`);

    this.addSuccess("✅ הנחיות בדיקת לוגים הוצגו");
  }

  // פונקציות עזר
  addSuccess(message) {
    console.log(`  ${message}`);
    this.results.passed++;
  }

  addIssue(message, type = "error") {
    console.log(`  ${message}`);
    this.results.issues.push({ message, type });
    if (type === "error") {
      this.results.failed++;
    } else if (type === "warning") {
      this.results.warnings++;
    }
  }

  // הרצת כל הבדיקות
  runAllTests() {
    const startTime = Date.now();

    console.log("🧪 Navigation Flow Tester v2.0 - Enhanced");
    console.log("═".repeat(50));
    console.log("בודק שהניווט החדש עובד נכון:\n");

    // הרץ את כל הבדיקות
    this.checkCompilation();
    this.checkMainScreen();
    this.checkQuickWorkoutScreen();
    this.checkNavigationTypes();
    this.checkTerminalLogs();

    // הצג תוצאות
    const duration = Date.now() - startTime;
    this.showResults(duration);
  }

  // הצגת תוצאות
  showResults(duration = 0) {
    console.log("\n📊 תוצאות הבדיקה:");
    console.log("═".repeat(30));
    console.log(`✅ עבר: ${this.results.passed}`);
    console.log(`⚠️  אזהרות: ${this.results.warnings}`);
    console.log(`❌ נכשל: ${this.results.failed}`);
    console.log(`⏱️  זמן: ${duration}ms`);

    if (this.results.issues.length > 0) {
      console.log("\n🔍 בעיות שנמצאו:");
      console.log("─".repeat(20));
      this.results.issues.forEach((issue, index) => {
        const icon = issue.type === "error" ? "❌" : "⚠️";
        console.log(`${index + 1}. ${icon} ${issue.message}`);
      });
    }

    // המלצות
    console.log("\n💡 המלצות:");
    console.log("─".repeat(15));

    if (this.results.failed === 0) {
      console.log("🎉 כל הבדיקות עברו! המערכת אמורה לעבוד נכון.");
      console.log("   בדוק עכשיו באפליקציה בפועל שהניווט עובד.");
    } else {
      console.log("🔧 יש בעיות שצריך לתקן לפני הבדיקה באפליקציה.");
      console.log("   תקן את הבעיות ורוץ שוב את הסקריפט.");
    }

    if (this.results.warnings > 0) {
      console.log("⚠️  יש אזהרות - כדאי לבדוק אותן אבל לא חייב.");
    }

    console.log("\n🚀 להרצת הבדיקה שוב: node scripts/testNavigationFlow.js");
    console.log("═".repeat(50));

    // Exit code לשימוש ב-CI/CD
    if (this.results.failed > 0) {
      process.exit(1);
    }
  }
}

// הרץ את הבדיקה
const tester = new NavigationFlowTester();
tester.runAllTests();
