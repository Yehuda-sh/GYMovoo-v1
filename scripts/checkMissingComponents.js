/**
 * @file scripts/checkMissingComponents.js
 * @brief בודק רכיבים חסרים ב-imports
 * @dependencies Node.js, fs
 * @notes רץ עם: node scripts/checkMissingComponents.js
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 בודק רכיבים חסרים...\n");

function findTsxFiles(dir, files = []) {
  const fullPath = path.join(__dirname, "..", dir);
  if (!fs.existsSync(fullPath)) return files;

  const items = fs.readdirSync(fullPath, { withFileTypes: true });

  items.forEach((item) => {
    if (item.isDirectory()) {
      findTsxFiles(path.join(dir, item.name), files);
    } else if (item.name.endsWith(".tsx") || item.name.endsWith(".ts")) {
      files.push(path.join(dir, item.name));
    }
  });

  return files;
}

const allFiles = findTsxFiles("src");
let totalErrors = 0;
let totalWarnings = 0;

console.log(`📁 נמצאו ${allFiles.length} קבצים\n`);

allFiles.forEach((filePath) => {
  const fullPath = path.join(__dirname, "..", filePath);
  const content = fs.readFileSync(fullPath, "utf8");

  // חיפוש imports
  const importMatches = content.matchAll(
    /import\s+.*?\s+from\s+["']([^"']+)["']/g
  );

  for (const match of importMatches) {
    const importPath = match[1];

    // דילוג על imports של ספריות חיצוניות
    if (!importPath.startsWith(".") && !importPath.startsWith("src/")) continue;

    let resolvedPath;
    if (importPath.startsWith("./") || importPath.startsWith("../")) {
      // relative import
      const baseDir = path.dirname(fullPath);
      resolvedPath = path.resolve(baseDir, importPath);
    } else if (importPath.startsWith("src/")) {
      // absolute import from src
      resolvedPath = path.join(__dirname, "..", importPath);
    } else {
      continue;
    }

    // בדיקה אם הקובץ קיים (עם או בלי .tsx/.ts)
    const possibleExtensions = ["", ".tsx", ".ts", ".js", ".jsx"];
    let found = false;

    for (const ext of possibleExtensions) {
      if (fs.existsSync(resolvedPath + ext)) {
        found = true;
        break;
      }
    }

    // בדיקה אם זה directory עם index file
    if (
      !found &&
      fs.existsSync(resolvedPath) &&
      fs.statSync(resolvedPath).isDirectory()
    ) {
      for (const ext of [".tsx", ".ts", ".js", ".jsx"]) {
        if (fs.existsSync(path.join(resolvedPath, "index" + ext))) {
          found = true;
          break;
        }
      }
    }

    if (!found) {
      console.error(`❌ ${filePath}:`);
      console.error(`   Import לא נמצא: ${importPath}`);
      console.error(`   נוצר: ${resolvedPath}\n`);
      totalErrors++;
    }
  }

  // בדיקת navigation calls שלא קיימים
  const navMatches = content.matchAll(/navigation\.navigate\(["'](\w+)["']/g);
  for (const match of navMatches) {
    const routeName = match[1];

    // בדיקה פשוטה - אם זה לא route ידוע
    const knownRoutes = [
      "Welcome",
      "Login",
      "Register",
      "Terms",
      "Questionnaire",
      "WorkoutPlan",
      "MainApp", // תוקן מ-Main ל-MainApp
      "QuickWorkout",
      "ExerciseList",
      "Notifications",
      "Progress",
      "Exercises",
      // Bottom Tab routes
      "Main", // Tab route
      "WorkoutPlans", // Tab route
      "History", // Tab route
      "Profile", // Tab route
    ];

    if (!knownRoutes.includes(routeName)) {
      console.warn(`⚠️  ${filePath}:`);
      console.warn(`   ניווט לroute לא מוכר: ${routeName}\n`);
      totalWarnings++;
    }
  }
});

// בדיקת מסכים בtabs שלא מחוברים
console.log("🔗 בדיקת Bottom Navigation:");

const bottomNavPath = path.join(
  __dirname,
  "../src/navigation/BottomNavigation.tsx"
);
if (fs.existsSync(bottomNavPath)) {
  const bottomNavContent = fs.readFileSync(bottomNavPath, "utf8");

  const tabScreens = [];
  const tabMatches = bottomNavContent.matchAll(/<Tab\.Screen\s+name="(\w+)"/g);
  for (const match of tabMatches) {
    tabScreens.push(match[1]);
  }

  console.log(`📱 Tab screens: ${tabScreens.join(", ")}`);

  // בדיקה שכל tab screen מיובא
  tabScreens.forEach((screen) => {
    if (
      !bottomNavContent.includes(`import ${screen}Screen`) &&
      !bottomNavContent.includes(`component={${screen}Screen}`)
    ) {
      console.warn(`⚠️  Tab screen ${screen} יכול להיות לא מיובא נכון`);
      totalWarnings++;
    }
  });
} else {
  console.error("❌ BottomNavigation.tsx לא נמצא");
  totalErrors++;
}

// סיכום
console.log("\n📊 סיכום:");
console.log(`❌ שגיאות: ${totalErrors}`);
console.log(`⚠️  אזהרות: ${totalWarnings}`);

if (totalErrors > 0) {
  console.log("\n🔧 פעולות מומלצות:");
  console.log("1. תקן את ה-imports החסרים");
  console.log("2. צור את הקבצים החסרים");
  console.log("3. עדכן את נתיבי ה-imports");
  process.exit(1);
} else if (totalWarnings > 0) {
  console.log("\n⚠️  יש אזהרות - בדוק את הפלט למעלה");
} else {
  console.log("\n✅ כל ה-imports תקינים!");
}
