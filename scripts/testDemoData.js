/**
 * @file scripts/testDemoData.js
 * @brief בודק את כל נתוני הדמו באפליקציה
 * @description וודא שנתוני הדמו עובדים נכון והמשתמש הדמו יוצר כמו שצריך
 * @created 2025-07-31
 */

const fs = require("fs");
const path = require("path");

class DemoDataTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: [],
    };

    this.projectRoot = path.resolve(__dirname, "..");
    console.log("🎭 Demo Data Tester - התחלת בדיקת נתוני דמו...\n");
  }

  // בדיקת משתמש הדמו
  checkDemoUser() {
    console.log("👤 בודק יצירת משתמש דמו...");

    const userStorePath = path.join(
      this.projectRoot,
      "src/stores/userStore.ts"
    );

    if (!fs.existsSync(userStorePath)) {
      this.addIssue("❌ קובץ userStore.ts לא נמצא!", "error");
      return;
    }

    const content = fs.readFileSync(userStorePath, "utf8");

    // בדיקה 1: משתמש דמו קיים
    if (
      content.includes("noa.levi.workout@gmail.com") ||
      content.includes("createDemoUser")
    ) {
      this.addSuccess("✅ יצירת משתמש דמו מוגדרת");
    } else {
      this.addIssue("❌ יצירת משתמש דמו לא נמצאה", "error");
    }

    // בדיקה 2: נתוני שאלון דמו
    if (
      content.includes("smart-questionnaire") ||
      content.includes("questionnaireData")
    ) {
      this.addSuccess("✅ נתוני שאלון דמו מוגדרים");
    } else {
      this.addIssue("⚠️ נתוני שאלון דמו עלולים להיות חסרים", "warning");
    }

    // בדיקה 3: היסטוריית אימונים דמו
    if (content.includes("activityHistory") || content.includes("workouts")) {
      this.addSuccess("✅ היסטוריית אימונים דמו קיימת");
    } else {
      this.addIssue("⚠️ היסטוריית אימונים דמו עלולה להיות חסרה", "warning");
    }

    console.log("✅ סיום בדיקת משתמש דמו\n");
  }

  // בדיקת נתוני תרגילים
  checkExerciseData() {
    console.log("💪 בודק נתוני תרגילים...");

    const exerciseServicePath = path.join(
      this.projectRoot,
      "src/services/exerciseService.ts"
    );

    if (!fs.existsSync(exerciseServicePath)) {
      this.addIssue("❌ קובץ exerciseService.ts לא נמצא!", "error");
      return;
    }

    const content = fs.readFileSync(exerciseServicePath, "utf8");

    // בדיקה 1: תרגילי דמו עבריים
    const hebrewExercises = ["לחיצת חזה", "סקוואט", "משיכות", "כפיפות ביצפס"];

    hebrewExercises.forEach((exercise) => {
      if (content.includes(exercise)) {
        this.addSuccess(`✅ תרגיל דמו "${exercise}" נמצא`);
      } else {
        this.addIssue(`⚠️ תרגיל דמו "${exercise}" לא נמצא`, "warning");
      }
    });

    // בדיקה 2: קטגוריות שרירים
    const muscleGroups = ["חזה", "גב", "רגליים", "כתפיים", "ביצפס", "טריצפס"];

    muscleGroups.forEach((muscle) => {
      if (content.includes(muscle)) {
        this.addSuccess(`✅ קבוצת שרירים "${muscle}" נמצאת`);
      } else {
        this.addIssue(`⚠️ קבוצת שרירים "${muscle}" לא נמצאת`, "warning");
      }
    });

    console.log("✅ סיום בדיקת נתוני תרגילים\n");
  }

  // בדיקת נתוני תוכניות אימון
  checkWorkoutPlans() {
    console.log("📋 בודק תוכניות אימון דמו...");

    const workoutGeneratorPath = path.join(
      this.projectRoot,
      "src/services/quickWorkoutGenerator.ts"
    );

    if (!fs.existsSync(workoutGeneratorPath)) {
      this.addIssue("❌ קובץ quickWorkoutGenerator.ts לא נמצא!", "error");
      return;
    }

    const content = fs.readFileSync(workoutGeneratorPath, "utf8");

    // בדיקה 1: תוכניות לימים שונים של השבוע
    const workoutDays = [
      "חזה + טריצפס",
      "גב + ביצפס",
      "רגליים",
      "כתפיים + ליבה",
    ];

    workoutDays.forEach((day) => {
      if (content.includes(day)) {
        this.addSuccess(`✅ תוכנית יום "${day}" נמצאת`);
      } else {
        this.addIssue(`⚠️ תוכנית יום "${day}" לא נמצאת`, "warning");
      }
    });

    // בדיקה 2: רמות קושי
    const difficultyLevels = ["beginner", "intermediate", "advanced"];

    difficultyLevels.forEach((level) => {
      if (content.includes(level)) {
        this.addSuccess(`✅ רמת קושי "${level}" נמצאת`);
      } else {
        this.addIssue(`⚠️ רמת קושי "${level}" לא נמצאת`, "warning");
      }
    });

    console.log("✅ סיום בדיקת תוכניות אימון\n");
  }

  // בדיקת תמונות ואייקונים
  checkAssets() {
    console.log("🖼️ בודק תמונות ואייקונים...");

    const assetsPath = path.join(this.projectRoot, "assets");

    if (!fs.existsSync(assetsPath)) {
      this.addIssue("❌ תיקיית assets לא נמצאה!", "error");
      return;
    }

    const requiredAssets = [
      "icon.png",
      "adaptive-icon.png",
      "splash-icon.png",
      "barbell.png",
      "dumbbells.png",
      "exercise-default.png",
    ];

    requiredAssets.forEach((asset) => {
      const assetPath = path.join(assetsPath, asset);
      if (fs.existsSync(assetPath)) {
        this.addSuccess(`✅ תמונה "${asset}" נמצאת`);
      } else {
        this.addIssue(`⚠️ תמונה "${asset}" חסרה`, "warning");
      }
    });

    // בדיקת תמונות ציוד
    const equipmentPath = path.join(assetsPath, "equipment");
    if (fs.existsSync(equipmentPath)) {
      this.addSuccess("✅ תיקיית תמונות ציוד קיימת");
    } else {
      this.addIssue("⚠️ תיקיית תמונות ציוד חסרה", "warning");
    }

    console.log("✅ סיום בדיקת תמונות\n");
  }

  // בדיקת נתוני דיאטה
  checkDietData() {
    console.log("🥗 בודק נתוני דיאטה...");

    const dietDataPath = path.join(this.projectRoot, "src/data/dietData.ts");

    if (!fs.existsSync(dietDataPath)) {
      this.addIssue("❌ קובץ dietData.ts לא נמצא!", "error");
      return;
    }

    const content = fs.readFileSync(dietDataPath, "utf8");

    // בדיקת סוגי דיאטות
    const dietTypes = ["none_diet", "keto", "vegan", "vegetarian", "paleo"];

    dietTypes.forEach((diet) => {
      if (content.includes(diet)) {
        this.addSuccess(`✅ סוג דיאטה "${diet}" נמצא`);
      } else {
        this.addIssue(`⚠️ סוג דיאטה "${diet}" לא נמצא`, "warning");
      }
    });

    console.log("✅ סיום בדיקת נתוני דיאטה\n");
  }

  // בדיקת לוגים דמו
  checkDemoLogs() {
    console.log("📊 בודק לוגים של נתוני דמו...");

    console.log(`
🔍 לוגים שצריך לחפש באפליקציה:
─────────────────────────────────

📱 משתמש דמו:
✅ "✅ Demo user created: נועה לוי"
✅ "📊 Updated user stats: X workouts"
✅ "User store rehydrated: noa.levi.workout@gmail.com"

💪 תרגילים:
✅ "🧠 Generating basic workout plan..."
✅ "✅ Workout plan generated"
✅ "📚 Using X exercises (local only)"

🎯 אימונים:
✅ "🚀 MainScreen - התחל אימון נלחץ!"
✅ "✅ QuickWorkout - יוצר אימון ליום X"
✅ יצירת 4-5 תרגילים לכל אימון

📈 סטטיסטיקות:
✅ "📊 Updated user stats: X workouts, Ykg volume"
✅ אימונים מושלמים בהיסטוריה
✅ חישוב נפח אימון

🔧 שגיאות נפוצות לבדוק:
❌ "Error generating personalized exercises"
❌ "לא נמצאו תרגילים מותאמים"
❌ חוסר תרגילים באימון (רשימה ריקה)
`);

    this.addSuccess("✅ מדריך בדיקת לוגים הוצג");
    console.log("✅ סיום בדיקת לוגים\n");
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
    console.log("🎭 Demo Data Tester v1.0");
    console.log("═".repeat(50));
    console.log("בודק את כל נתוני הדמו באפליקציה:\n");

    this.checkDemoUser();
    this.checkExerciseData();
    this.checkWorkoutPlans();
    this.checkAssets();
    this.checkDietData();
    this.checkDemoLogs();

    this.showResults();
  }

  // הצגת תוצאות
  showResults() {
    console.log("\n📊 תוצאות בדיקת נתוני הדמו:");
    console.log("═".repeat(35));
    console.log(`✅ עבר: ${this.results.passed}`);
    console.log(`⚠️  אזהרות: ${this.results.warnings}`);
    console.log(`❌ נכשל: ${this.results.failed}`);

    if (this.results.issues.length > 0) {
      console.log("\n🔍 בעיות שנמצאו:");
      console.log("─".repeat(20));
      this.results.issues.forEach((issue, index) => {
        const icon = issue.type === "error" ? "❌" : "⚠️";
        console.log(`${index + 1}. ${icon} ${issue.message}`);
      });
    }

    console.log("\n💡 המלצות:");
    console.log("─".repeat(15));

    if (this.results.failed === 0) {
      console.log("🎉 נתוני הדמו נראים תקינים!");
      console.log("   בדוק באפליקציה שהמשתמש דמו נוצר ויש אימונים.");
    } else {
      console.log("🔧 יש בעיות בנתוני הדמו שצריך לתקן.");
      console.log("   זה עלול להשפיע על חוויית המשתמש.");
    }

    if (this.results.warnings > 0) {
      console.log("⚠️  יש חלקים שיכולים להשתפר בנתוני הדמו.");
    }

    console.log("\n🚀 להרצת הבדיקה שוב: node scripts/testDemoData.js");
    console.log("═".repeat(50));
  }
}

// הרץ את הבדיקה
const tester = new DemoDataTester();
tester.runAllTests();
