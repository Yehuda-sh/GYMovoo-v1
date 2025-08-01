/**
 * @file scripts/performanceCheck.js
 * @brief בדיקת ביצועים מתקדמת של האפליקציה - משולב עם codeQualityCheck
 * @features גודל bundle, imports כבדים, optimization ratio, אנליזת ביצועים
 * @updated 2025-08-01 - שופר לשילוב עם codeQualityCheck.js
 */

const fs = require("fs");
const path = require("path");

// תיקון קידוד UTF-8
if (process.platform === "win32") {
  process.stdout.write("\x1b]0;GYMovoo Performance Check\x07");
}

console.log("⚡ GYMovoo Performance Check (Enhanced)");
console.log("=======================================\n");

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

// בדיקת imports כבדים ושימוש בספריות
function checkHeavyImports() {
  console.log("📚 בדיקת Imports כבדים ואופטימיזציה:");
  console.log("--------------------------------------");

  const heavyLibraries = [
    { name: "react-native-vector-icons", category: "UI", size: "Medium" },
    { name: "react-native-reanimated", category: "Animation", size: "Large" },
    { name: "@react-navigation", category: "Navigation", size: "Medium" },
    { name: "expo-linear-gradient", category: "UI", size: "Small" },
    { name: "react-native-svg", category: "Graphics", size: "Medium" },
    { name: "zustand", category: "State", size: "Small" },
    { name: "@expo/vector-icons", category: "UI", size: "Large" },
  ];

  const srcDir = path.join(__dirname, "..", "src");
  const importUsage = {};
  const unusedImports = [];

  function scanImports(dir) {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanImports(itemPath);
      } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
        const content = fs.readFileSync(itemPath, "utf8");
        const relativePath = path.relative(process.cwd(), itemPath);

        heavyLibraries.forEach((lib) => {
          const libName = lib.name;
          if (
            content.includes(`from "${libName}`) ||
            content.includes(`from '${libName}`)
          ) {
            if (!importUsage[libName]) {
              importUsage[libName] = {
                count: 0,
                category: lib.category,
                size: lib.size,
                files: [],
              };
            }
            importUsage[libName].count++;
            importUsage[libName].files.push(relativePath);
          }
        });

        // בדיקת imports שלא בשימוש (בסיסית)
        const importMatches = content.match(/import\s+{([^}]+)}\s+from/g);
        if (importMatches) {
          importMatches.forEach((match) => {
            const importContent = match.match(/import\s+{([^}]+)}/)[1];
            const imports = importContent.split(",").map((imp) => imp.trim());

            imports.forEach((imp) => {
              if (imp && !content.includes(imp.replace(/\s+as\s+\w+/, ""))) {
                const regex = new RegExp(`\\b${imp.split(" ")[0]}\\b`, "g");
                const matches = content.match(regex);
                if (matches && matches.length <= 1) {
                  unusedImports.push(`${relativePath}: ${imp}`);
                }
              }
            });
          });
        }
      }
    });
  }

  scanImports(srcDir);

  // הצגת תוצאות משופרת
  console.log("📊 שימוש בספריות כבדות:");
  Object.entries(importUsage)
    .sort(([, a], [, b]) => b.count - a.count)
    .forEach(([lib, data]) => {
      const sizeEmoji =
        data.size === "Large" ? "🔴" : data.size === "Medium" ? "🟡" : "🟢";
      console.log(
        `${sizeEmoji} ${lib} (${data.category}): ${data.count} קבצים`
      );
      if (data.count > 20) {
        console.log(`  ⚠️  שימוש רב - שקול lazy loading`);
      }
    });

  // הצגת imports לא בשימוש (רק אם יש)
  if (unusedImports.length > 0) {
    console.log("\n🧹 Imports פוטנציאליים לא בשימוש:");
    unusedImports.slice(0, 5).forEach((imp) => {
      console.log(`  • ${imp}`);
    });
    if (unusedImports.length > 5) {
      console.log(`  ... ועוד ${unusedImports.length - 5} imports`);
    }
  }

  console.log();
}

// בדיקת performance patterns (מותאם לעבוד עם codeQualityCheck)
function checkPerformancePatterns() {
  console.log("� בדיקת Performance Patterns (מתקדם):");
  console.log("--------------------------------------");

  const srcDir = path.join(__dirname, "..", "src");
  const performanceIssues = {
    heavyOperations: [],
    memoryLeaks: [],
    renderOptimizations: [],
    bundleImpact: [],
  };

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

        // בדיקת operazioni כבדות
        if (
          content.includes("JSON.parse") &&
          content.includes("JSON.stringify")
        ) {
          performanceIssues.heavyOperations.push(
            `${relativePath}: JSON operations`
          );
        }

        // בדיקת deep object operations
        if (content.match(/\.\.\..*\.\.\..*\.\.\./g)) {
          performanceIssues.heavyOperations.push(
            `${relativePath}: multiple spread operations`
          );
        }

        // בדיקת unoptimized loops
        if (content.match(/for\s*\([^)]*\.length[^)]*\)/g)) {
          performanceIssues.heavyOperations.push(
            `${relativePath}: unoptimized loop with .length`
          );
        }

        // בדיקת potential memory leaks (משופר)
        if (
          content.includes("setInterval") &&
          !content.includes("clearInterval")
        ) {
          performanceIssues.memoryLeaks.push(
            `${relativePath}: setInterval without cleanup`
          );
        }

        // בדיקת large inline data
        const largeArrays = content.match(/\[[^\]]{200,}\]/g);
        if (largeArrays && largeArrays.length > 0) {
          performanceIssues.bundleImpact.push(
            `${relativePath}: large inline arrays (${largeArrays.length})`
          );
        }

        // בדיקת conditional rendering complexity
        const ternaryChains = content.match(/\?[^:]*:[^?]*\?[^:]*:/g);
        if (ternaryChains && ternaryChains.length > 0) {
          performanceIssues.renderOptimizations.push(
            `${relativePath}: complex ternary chains (${ternaryChains.length})`
          );
        }
      }
    });
  }

  scanPerformance(srcDir);

  // הצגת תוצאות מקובצות
  let totalIssues = 0;

  Object.entries(performanceIssues).forEach(([category, issues]) => {
    if (issues.length > 0) {
      const categoryNames = {
        heavyOperations: "🔥 פעולות כבדות",
        memoryLeaks: "💧 דליפות זיכרון פוטנציאליות",
        renderOptimizations: "🎨 אופטימיזציות רינדור",
        bundleImpact: "📦 השפעה על גודל Bundle",
      };

      console.log(`${categoryNames[category]}:`);
      issues.slice(0, 3).forEach((issue) => {
        console.log(`  • ${issue}`);
      });
      if (issues.length > 3) {
        console.log(`  ... ועוד ${issues.length - 3} בעיות`);
      }
      totalIssues += issues.length;
      console.log();
    }
  });

  if (totalIssues === 0) {
    console.log("✅ לא נמצאו בעיות ביצועים מתקדמות");
  } else {
    console.log(`📊 סה"כ בעיות ביצועים: ${totalIssues}`);
  }

  console.log();
}

// בדיקת React optimization patterns ומדדים
function checkReRenders() {
  console.log("🔄 בדיקת React Optimization Patterns:");
  console.log("------------------------------------");

  const srcDir = path.join(__dirname, "..", "src");
  let useCallbackCount = 0;
  let useMemoCount = 0;
  let useEffectCount = 0;
  let stateCount = 0;
  let reactMemoCount = 0;
  const unoptimizedFiles = [];

  function scanHooks(dir) {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanHooks(itemPath);
      } else if (item.endsWith(".tsx")) {
        const content = fs.readFileSync(itemPath, "utf8");
        const relativePath = path.relative(process.cwd(), itemPath);

        const fileUseCallback = (content.match(/useCallback/g) || []).length;
        const fileUseMemo = (content.match(/useMemo/g) || []).length;
        const fileUseEffect = (content.match(/useEffect/g) || []).length;
        const fileUseState = (content.match(/useState/g) || []).length;
        const fileReactMemo = (content.match(/React\.memo\(|memo\(/g) || [])
          .length;

        useCallbackCount += fileUseCallback;
        useMemoCount += fileUseMemo;
        useEffectCount += fileUseEffect;
        stateCount += fileUseState;
        reactMemoCount += fileReactMemo;

        // זיהוי קבצים שאולי צריכים אופטימיזציה
        const fileComplexity = fileUseState + fileUseEffect;
        const fileOptimizations = fileUseCallback + fileUseMemo + fileReactMemo;

        if (fileComplexity > 3 && fileOptimizations === 0) {
          unoptimizedFiles.push({
            file: relativePath,
            complexity: fileComplexity,
            optimizations: fileOptimizations,
          });
        }
      }
    });
  }

  scanHooks(srcDir);

  console.log("📊 React Hooks & Optimizations סטטיסטיקות:");
  console.log(`  useState: ${stateCount}`);
  console.log(`  useEffect: ${useEffectCount}`);
  console.log(`  useMemo: ${useMemoCount}`);
  console.log(`  useCallback: ${useCallbackCount}`);
  console.log(`  React.memo: ${reactMemoCount}`);

  const totalHooks = stateCount + useEffectCount;
  const totalOptimizations = useMemoCount + useCallbackCount + reactMemoCount;
  const optimizationRatio = totalOptimizations / Math.max(totalHooks, 1);

  console.log(
    `\n� Optimization Ratio: ${(optimizationRatio * 100).toFixed(1)}%`
  );

  if (optimizationRatio < 0.1) {
    console.log("🔴 נמוך מאוד - הוסף optimizations");
  } else if (optimizationRatio < 0.2) {
    console.log("🟡 נמוך - יש מקום לשיפור משמעותי");
  } else if (optimizationRatio < 0.4) {
    console.log("� טוב - יש מקום לשיפור קל");
  } else {
    console.log("✅ מצוין - optimizations טובים!");
  }

  // הצגת קבצים שצריכים אופטימיזציה
  if (unoptimizedFiles.length > 0) {
    console.log("\n⚠️  קבצים שאולי צריכים אופטימיזציה:");
    unoptimizedFiles
      .sort((a, b) => b.complexity - a.complexity)
      .slice(0, 5)
      .forEach((file) => {
        console.log(
          `  • ${file.file} (${file.complexity} hooks, ${file.optimizations} optimizations)`
        );
      });
  }

  console.log();
}

// הרצה משופרת
try {
  checkBundleSize();
  checkHeavyImports();
  checkPerformancePatterns();
  checkReRenders();

  console.log("==========================================");
  console.log("📊 סיכום בדיקת ביצועים מתקדמת");
  console.log("==========================================");
  console.log("✅ בדיקה הושלמה");
  console.log("💡 המלצות מתקדמות:");
  console.log("  1. הקטן קבצים גדולים מ-50KB");
  console.log("  2. השתמש ב-useMemo/useCallback לפונקציות כבדות");
  console.log("  3. שקול lazy loading לספריות כבדות");
  console.log("  4. השתמש ב-React.memo לרכיבים כבדים");
  console.log("  5. הימנע מפעולות JSON כבדות ב-render");
  console.log("\n🔗 הרץ גם: node scripts/codeQualityCheck.js למידע נוסף");
} catch (error) {
  console.error("❌ שגיאה בבדיקת ביצועים:", error.message);
}
