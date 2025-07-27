/**
 * @file scripts/performanceCheck.js
 * @brief בדיקת ביצועים של האפליקציה
 * @features זמני טעינה, גודל bundle, memory usage
 */

const fs = require("fs");
const path = require("path");

console.log("⚡ GYMovoo Performance Check");
console.log("============================\n");

// בדיקת גודל קבצים
function checkBundleSize() {
  console.log("📦 בדיקת גודל Bundle:");
  console.log("---------------------");

  const srcDir = path.join(__dirname, "..", "src");
  let totalSize = 0;
  let fileCount = 0;
  const largeFiles = [];

  function scanDir(dir) {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanDir(itemPath);
      } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
        const sizeKB = Math.round(stat.size / 1024);
        totalSize += stat.size;
        fileCount++;

        if (sizeKB > 20) {
          largeFiles.push({
            path: path.relative(process.cwd(), itemPath),
            size: sizeKB,
          });
        }
      }
    });
  }

  scanDir(srcDir);

  console.log(`📊 סה"כ גודל Source: ${Math.round(totalSize / 1024)} KB`);
  console.log(`📄 מספר קבצים: ${fileCount}`);
  console.log(
    `📊 ממוצע גודל קובץ: ${Math.round(totalSize / fileCount / 1024)} KB`
  );

  if (largeFiles.length > 0) {
    console.log("\n🚨 קבצים גדולים (>20KB):");
    largeFiles
      .sort((a, b) => b.size - a.size)
      .slice(0, 5)
      .forEach((file) => {
        console.log(`  📁 ${file.path}: ${file.size} KB`);
      });
  }

  console.log();
}

// בדיקת imports כבדים
function checkHeavyImports() {
  console.log("📚 בדיקת Imports כבדים:");
  console.log("------------------------");

  const heavyLibraries = [
    "react-native-vector-icons",
    "react-native-reanimated",
    "@react-navigation",
    "expo-linear-gradient",
    "react-native-svg",
  ];

  const srcDir = path.join(__dirname, "..", "src");
  const importUsage = {};

  function scanImports(dir) {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanImports(itemPath);
      } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
        const content = fs.readFileSync(itemPath, "utf8");

        heavyLibraries.forEach((lib) => {
          if (
            content.includes(`from "${lib}`) ||
            content.includes(`from '${lib}`)
          ) {
            if (!importUsage[lib]) importUsage[lib] = 0;
            importUsage[lib]++;
          }
        });
      }
    });
  }

  scanImports(srcDir);

  Object.entries(importUsage)
    .sort(([, a], [, b]) => b - a)
    .forEach(([lib, count]) => {
      console.log(`📦 ${lib}: ${count} קבצים`);
    });

  console.log();
}

// בדיקת performance anti-patterns
function checkPerformanceIssues() {
  console.log("🔍 בדיקת Performance Issues:");
  console.log("-----------------------------");

  const srcDir = path.join(__dirname, "..", "src");
  const issues = [];

  function scanPerformance(dir) {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanPerformance(itemPath);
      } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
        const content = fs.readFileSync(itemPath, "utf8");
        const relativePath = path.relative(process.cwd(), itemPath);

        // בדיקת inline objects בתור props
        if (content.match(/style=\{\{[^}]+\}\}/g)) {
          issues.push(`${relativePath}: inline style objects`);
        }

        // בדיקת inline functions
        if (content.match(/onPress=\{[^}]*=>[^}]*\}/g)) {
          issues.push(`${relativePath}: inline arrow functions`);
        }

        // בדיקת map ללא key
        if (content.includes(".map(") && !content.includes("key=")) {
          issues.push(`${relativePath}: map without key prop`);
        }

        // בדיקת nested renders
        const renderCount = (content.match(/return\s*\(/g) || []).length;
        if (renderCount > 3) {
          issues.push(
            `${relativePath}: too many nested renders (${renderCount})`
          );
        }
      }
    });
  }

  scanPerformance(srcDir);

  if (issues.length === 0) {
    console.log("✅ לא נמצאו בעיות ביצועים גדולות");
  } else {
    console.log(`⚠️  נמצאו ${issues.length} בעיות פוטנציאליות:`);
    issues.slice(0, 10).forEach((issue) => {
      console.log(`  • ${issue}`);
    });
    if (issues.length > 10) {
      console.log(`  ... ועוד ${issues.length - 10} בעיות`);
    }
  }

  console.log();
}

// בדיקת React re-renders
function checkReRenders() {
  console.log("🔄 בדיקת Re-renders:");
  console.log("-------------------");

  const srcDir = path.join(__dirname, "..", "src");
  let useCallbackCount = 0;
  let useMemoCount = 0;
  let useEffectCount = 0;
  let stateCount = 0;

  function scanHooks(dir) {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanHooks(itemPath);
      } else if (item.endsWith(".tsx")) {
        const content = fs.readFileSync(itemPath, "utf8");

        useCallbackCount += (content.match(/useCallback/g) || []).length;
        useMemoCount += (content.match(/useMemo/g) || []).length;
        useEffectCount += (content.match(/useEffect/g) || []).length;
        stateCount += (content.match(/useState/g) || []).length;
      }
    });
  }

  scanHooks(srcDir);

  console.log(`📊 useState: ${stateCount}`);
  console.log(`📊 useEffect: ${useEffectCount}`);
  console.log(`📊 useMemo: ${useMemoCount}`);
  console.log(`📊 useCallback: ${useCallbackCount}`);

  const optimizationRatio =
    (useMemoCount + useCallbackCount) / (stateCount + useEffectCount);
  console.log(
    `📊 Optimization ratio: ${(optimizationRatio * 100).toFixed(1)}%`
  );

  if (optimizationRatio < 0.1) {
    console.log("⚠️  נמוך - כדאי להוסיף עוד optimizations");
  } else if (optimizationRatio < 0.3) {
    console.log("👍 בסדר - יש מקום לשיפור");
  } else {
    console.log("✅ מצוין - optimizations טובים");
  }

  console.log();
}

// הרצה
try {
  checkBundleSize();
  checkHeavyImports();
  checkPerformanceIssues();
  checkReRenders();

  console.log("==========================================");
  console.log("📊 סיכום בדיקת ביצועים");
  console.log("==========================================");
  console.log("✅ בדיקה הושלמה");
  console.log("💡 המלצות:");
  console.log("  1. הקטן קבצים גדולים מ-30KB");
  console.log("  2. השתמש ב-useMemo/useCallback לפונקציות כבדות");
  console.log("  3. הימנע מ-inline objects ב-props");
  console.log("  4. שים key props בכל map iteration");
} catch (error) {
  console.error("❌ שגיאה בבדיקת ביצועים:", error.message);
}
