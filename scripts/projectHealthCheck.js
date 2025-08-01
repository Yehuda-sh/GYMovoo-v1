/**
 * @file scripts/projectHealthCheck.js
 * @brief בדיקת מצב הפרויקט הכללית
 * @dependencies Node.js, fs
 * @notes רץ עם: node scripts/projectHealthCheck.js
 */

const fs = require("fs");
const path = require("path");

console.log("🏥 בדיקת מצב הפרויקט...\n");

let score = 100;
let issues = [];
let suggestions = [];

// בדיקת מבנה פרויקט
console.log("📁 בדיקת מבנה הפרויקט:");

const requiredDirs = [
  "src/components",
  "src/screens",
  "src/navigation",
  "src/services",
  "src/hooks",
  "src/stores",
  "src/data",
  "src/types",
  "src/utils",
  "docs",
  "scripts",
  "assets",
  "android",
];

const requiredFiles = [
  "package.json",
  "tsconfig.json",
  "app.json",
  "App.tsx",
  ".gitignore",
  "README.md",
  "src/navigation/AppNavigator.tsx",
  "src/navigation/BottomNavigation.tsx",
  "src/navigation/types.ts",
  "docs/NAVIGATION_GUIDE.md",
];

requiredDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, "..", dir);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - תיקיה חסרה`);
    issues.push(`תיקיה חסרה: ${dir}`);
    score -= 5;
  }
});

requiredFiles.forEach((file) => {
  const fullPath = path.join(__dirname, "..", file);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - קובץ חסר`);
    issues.push(`קובץ חסר: ${file}`);
    score -= 10;
  }
});

// בדיקת package.json
console.log("\n📦 בדיקת package.json:");
try {
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../package.json"), "utf8")
  );

  const requiredDeps = [
    "@react-navigation/native",
    "@react-navigation/stack",
    "@react-navigation/bottom-tabs",
    "expo",
    "react-native",
    "zustand",
  ];

  const requiredDevDeps = ["typescript", "@types/react", "@types/react-native"];

  requiredDeps.forEach((dep) => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}`);
    } else {
      console.log(`❌ ${dep} - dependency חסר`);
      issues.push(`Dependency חסר: ${dep}`);
      score -= 5;
    }
  });

  requiredDevDeps.forEach((dep) => {
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep} (dev)`);
    } else {
      console.log(`⚠️  ${dep} - dev dependency חסר`);
      suggestions.push(`הוסף dev dependency: ${dep}`);
      score -= 2;
    }
  });

  // בדיקת scripts חשובים
  const recommendedScripts = ["start", "build", "test"];
  console.log("\n📝 בדיקת scripts:");
  recommendedScripts.forEach((script) => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ ${script} script קיים`);
    } else {
      console.log(`⚠️  ${script} script חסר`);
      suggestions.push(`הוסף ${script} script ל-package.json`);
      score -= 3;
    }
  });
} catch (error) {
  console.log("❌ שגיאה בקריאת package.json:", error.message);
  issues.push("שגיאה בקריאת package.json");
  score -= 20;
}

// בדיקת TypeScript config
console.log("\n⚙️  בדיקת tsconfig.json:");
try {
  const tsConfig = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../tsconfig.json"), "utf8")
  );

  if (tsConfig.compilerOptions && tsConfig.compilerOptions.strict) {
    console.log("✅ TypeScript strict mode מופעל");
  } else {
    console.log("⚠️  TypeScript strict mode לא מופעל");
    suggestions.push("הפעל TypeScript strict mode");
    score -= 3;
  }

  if (tsConfig.compilerOptions && tsConfig.compilerOptions.esModuleInterop) {
    console.log("✅ esModuleInterop מופעל");
  } else {
    console.log("⚠️  esModuleInterop לא מופעל");
    suggestions.push("הפעל esModuleInterop");
    score -= 2;
  }

  // בדיקת הגדרות נוספות
  const recommendedOptions = {
    target: "target version",
    module: "module system",
    skipLibCheck: "skip lib check",
    allowSyntheticDefaultImports: "synthetic imports",
  };

  Object.keys(recommendedOptions).forEach((option) => {
    if (
      !tsConfig.compilerOptions ||
      tsConfig.compilerOptions[option] === undefined
    ) {
      console.log(`⚠️  ${recommendedOptions[option]} לא מוגדר: ${option}`);
      suggestions.push(`הגדר ${option} ב-tsconfig.json`);
      score -= 1;
    }
  });
} catch (error) {
  console.log("❌ שגיאה בקריאת tsconfig.json:", error.message);
  issues.push("שגיאה בקריאת tsconfig.json");
  score -= 10;
}

// בדיקת מסכים
console.log("\n🖥️  בדיקת מסכים:");
const screenDirs = [
  "auth",
  "main",
  "profile",
  "workout",
  "exercise",
  "exercises",
  "questionnaire",
  "history",
  "progress",
  "notifications",
  "welcome",
];
let screenCount = 0;

screenDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, "../src/screens", dir);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath).filter((f) => f.endsWith(".tsx"));
    screenCount += files.length;
    console.log(`✅ ${dir}: ${files.length} מסכים`);
  } else {
    console.log(`⚠️  ${dir}: תיקיה לא קיימת`);
    suggestions.push(`צור תיקיית מסכים: ${dir}`);
    score -= 1;
  }
});

console.log(`📊 סה"כ מסכים: ${screenCount}`);

// בדיקת components
console.log("\n🧩 בדיקת רכיבים:");
const componentDirs = ["common", "ui", "workout"];
let componentCount = 0;

componentDirs.forEach((dir) => {
  const fullPath = path.join(__dirname, "../src/components", dir);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath).filter((f) => f.endsWith(".tsx"));
    componentCount += files.length;
    console.log(`✅ ${dir}: ${files.length} רכיבים`);
  } else {
    console.log(`⚠️  ${dir}: תיקיה לא קיימת`);
    suggestions.push(`צור תיקיית רכיבים: ${dir}`);
    score -= 1;
  }
});

console.log(`📊 סה"כ רכיבים: ${componentCount}`);

// בדיקת services
console.log("\n🔧 בדיקת שירותים:");
const requiredServices = [
  "authService.ts",
  "exerciseService.ts",
  "questionnaireService.ts",
  "quickWorkoutGenerator.ts",
  "workoutDataService.ts",
];

let serviceCount = 0;
requiredServices.forEach((service) => {
  const fullPath = path.join(__dirname, "../src/services", service);
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${service}`);
    serviceCount++;
  } else {
    console.log(`❌ ${service} - שירות חסר`);
    issues.push(`שירות חסר: ${service}`);
    score -= 5;
  }
});

console.log(`📊 סה"כ שירותים: ${serviceCount}/${requiredServices.length}`);

// בדיקת קונבנציות שמות
console.log("\n🏷️  בדיקת קונבנציות שמות:");
let namingIssues = 0;

// בדיקת שמות קבצים במסכים
const checkNamingConventions = (dir, expectedSuffix) => {
  try {
    const files = fs.readdirSync(path.join(__dirname, "..", dir));
    files.forEach((file) => {
      if (
        file.endsWith(".tsx") &&
        !file.includes("index") &&
        !file.includes("types")
      ) {
        const baseName = file.replace(".tsx", "");
        if (
          !baseName.endsWith(expectedSuffix) &&
          ![
            "Modal",
            "Card",
            "Button",
            "Bar",
            "Row",
            "Timer",
            "Calculator",
            "Header",
            "Summary",
            "Dashboard",
            "Slider",
            "Selector",
          ].some((suffix) => baseName.endsWith(suffix))
        ) {
          console.log(
            `⚠️  שם לא עקבי: ${file} (צריך להסתיים ב-${expectedSuffix})`
          );
          suggestions.push(`שנה שם ל-${baseName}${expectedSuffix}.tsx`);
          namingIssues++;
          score -= 1;
        }
      }
    });
  } catch {
    // תיקייה לא קיימת או לא נגישה - מתעלמים
    console.log(`⚠️  לא ניתן לבדוק תיקייה: ${dir}`);
  }
};

// בדיקת מסכים
[
  "src/screens/auth",
  "src/screens/main",
  "src/screens/profile",
  "src/screens/workout",
  "src/screens/exercise",
  "src/screens/exercises",
  "src/screens/questionnaire",
  "src/screens/history",
  "src/screens/progress",
  "src/screens/notifications",
  "src/screens/welcome",
].forEach((dir) => {
  checkNamingConventions(dir, "Screen");
});

if (namingIssues === 0) {
  console.log("✅ קונבנציות שמות תקינות");
} else {
  console.log(`⚠️  ${namingIssues} בעיות בקונבנציות שמות`);
}

// בדיקת תיעוד
console.log("\n📚 בדיקת תיעוד:");
const docFiles = ["NAVIGATION_GUIDE.md", "PROGRESS_LOG.md"];

let docCount = 0;
docFiles.forEach((doc) => {
  const fullPath = path.join(__dirname, "../docs", doc);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, "utf8");
    const lines = content.split("\n").length;
    console.log(`✅ ${doc} (${lines} שורות)`);
    docCount++;
  } else {
    console.log(`❌ ${doc} - תיעוד חסר`);
    issues.push(`תיעוד חסר: ${doc}`);
    score -= 5;
  }
});

console.log(`📊 סה"כ קבצי תיעוד: ${docCount}/${docFiles.length}`);

// בדיקת קבצי index.ts
console.log("\n📋 בדיקת קבצי index.ts:");
const indexDirs = [
  "src/components",
  "src/screens",
  "src/services",
  "src/utils",
];
let indexCount = 0;

indexDirs.forEach((dir) => {
  const indexPath = path.join(__dirname, "..", dir, "index.ts");
  if (fs.existsSync(indexPath)) {
    console.log(`✅ ${dir}/index.ts קיים`);
    indexCount++;
  } else {
    console.log(`⚠️  ${dir}/index.ts חסר`);
    suggestions.push(`צור קובץ index.ts ב-${dir}`);
    score -= 2;
  }
});

console.log(`📊 סה"כ קבצי index: ${indexCount}/${indexDirs.length}`);

// בדיקת גיט
console.log("\n📋 בדיקת Git:");
if (fs.existsSync(path.join(__dirname, "../.git"))) {
  console.log("✅ Git repository קיים");

  if (fs.existsSync(path.join(__dirname, "../.gitignore"))) {
    console.log("✅ .gitignore קיים");
  } else {
    console.log("⚠️  .gitignore חסר");
    suggestions.push("צור קובץ .gitignore");
    score -= 2;
  }
} else {
  console.log("⚠️  לא Git repository");
  suggestions.push("אתחל Git repository");
  score -= 5;
}

// חישוב ציון סופי
console.log("\n" + "=".repeat(50));
console.log("📊 דוח סופי:");
console.log("=".repeat(50));

let healthStatus;
let statusColor;
if (score >= 90) {
  healthStatus = "מצוין";
  statusColor = "🟢";
} else if (score >= 75) {
  healthStatus = "טוב";
  statusColor = "🟡";
} else if (score >= 60) {
  healthStatus = "בינוני";
  statusColor = "🟠";
} else {
  healthStatus = "זקוק לתיקון";
  statusColor = "🔴";
}

console.log(`${statusColor} מצב הפרויקט: ${healthStatus} (${score}/100)`);
console.log(`📊 סטטיסטיקות:`);
console.log(`   📱 מסכים: ${screenCount}`);
console.log(`   🧩 רכיבים: ${componentCount}`);
console.log(`   🔧 שירותים: ${serviceCount}/${requiredServices.length}`);
console.log(`   📚 תיעוד: ${docCount}/${docFiles.length}`);

if (issues.length > 0) {
  console.log(`\n❌ בעיות (${issues.length}):`);
  issues.forEach((issue, index) => {
    console.log(`   ${index + 1}. ${issue}`);
  });
}

if (suggestions.length > 0) {
  console.log(`\n💡 הצעות לשיפור (${suggestions.length}):`);
  suggestions.forEach((suggestion, index) => {
    console.log(`   ${index + 1}. ${suggestion}`);
  });
}

console.log("\n🎯 המלצות בסיס:");
console.log("1. רוץ: npm test (אם יש בדיקות)");
console.log("2. רוץ: npx tsc --noEmit (בדיקת TypeScript)");
console.log("3. רוץ: npx eslint src/ (בדיקת קוד)");
console.log("4. רוץ: node scripts/checkNavigation.js");
console.log("5. רוץ: node scripts/checkMissingComponents.js");

process.exit(score < 60 ? 1 : 0);
