/**
 * @file scripts/codeQualityCheck.js
 * @brief כלי בדיקת איכות קוד מקיף
 * @features בדיקת דליפות זיכרון, משתנים לא בשימוש, קבצים גדולים מדי
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 GYMovoo Code Quality Check");
console.log("=============================\n");

const srcDir = path.join(__dirname, "..", "src");
let totalIssues = 0;
let totalFiles = 0;
let totalLines = 0;

// בדיקת קבצים גדולים מדי
function checkFileSize(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n").length;
  totalLines += lines;

  if (lines > 500) {
    console.log(
      `⚠️  קובץ גדול מדי: ${path.relative(process.cwd(), filePath)} (${lines} שורות)`
    );
    totalIssues++;
  }

  return lines;
}

// בדיקת משתנים לא בשימוש
function checkUnusedVariables(filePath, content) {
  const issues = [];

  // בדיקת useState לא בשימוש
  const useStateMatches = content.match(
    /const\s+\[\s*(\w+),\s*set\w+\s*\]\s*=\s*useState/g
  );
  if (useStateMatches) {
    useStateMatches.forEach((match) => {
      const varName = match.match(/const\s+\[\s*(\w+),/)[1];
      const regex = new RegExp(`\\b${varName}\\b`, "g");
      const matches = content.match(regex);
      if (matches && matches.length <= 2) {
        // רק הגדרה והשמה
        issues.push(`משתנה state לא בשימוש: ${varName}`);
      }
    });
  }

  // בדיקת imports לא בשימוש
  const importMatches = content.match(/import\s+{([^}]+)}\s+from/g);
  if (importMatches) {
    importMatches.forEach((match) => {
      const imports = match
        .match(/import\s+{([^}]+)}/)[1]
        .split(",")
        .map((imp) => imp.trim().replace(/\s+as\s+\w+/, ""));

      imports.forEach((imp) => {
        if (imp && !content.includes(imp.replace(/^\w+/, ""))) {
          const regex = new RegExp(`\\b${imp}\\b`, "g");
          const matches = content.match(regex);
          if (matches && matches.length <= 1) {
            issues.push(`import לא בשימוש: ${imp}`);
          }
        }
      });
    });
  }

  return issues;
}

// בדיקת complexity
function checkComplexity(content) {
  const issues = [];

  // ספירת if statements
  const ifCount = (content.match(/\bif\s*\(/g) || []).length;
  if (ifCount > 15) {
    issues.push(`יותר מדי if statements: ${ifCount} (מומלץ פחות מ-15)`);
  }

  // ספירת nested functions
  const functionNesting = content.match(
    /function\s+\w+\([^)]*\)\s*{[^}]*function/g
  );
  if (functionNesting && functionNesting.length > 5) {
    issues.push(`יותר מדי nested functions: ${functionNesting.length}`);
  }

  // בדיקת פונקציות ארוכות מדי
  const functions = content.match(
    /(?:function\s+\w+|const\s+\w+\s*=\s*(?:\([^)]*\)\s*)?=>)[^{]*{[^}]*}/gs
  );
  if (functions) {
    functions.forEach((func, index) => {
      const lines = func.split("\n").length;
      if (lines > 50) {
        issues.push(`פונקציה #${index + 1} ארוכה מדי: ${lines} שורות`);
      }
    });
  }

  return issues;
}

// בדיקת potential memory leaks
function checkMemoryLeaks(content) {
  const issues = [];

  // בדיקת useEffect ללא cleanup
  const useEffectMatches = content.match(
    /useEffect\s*\(\s*\(\s*\)\s*=>\s*{[^}]*}/gs
  );
  if (useEffectMatches) {
    useEffectMatches.forEach((effect, index) => {
      if (effect.includes("setInterval") && !effect.includes("clearInterval")) {
        issues.push(`useEffect #${index + 1}: setInterval ללא clearInterval`);
      }
      if (effect.includes("setTimeout") && !effect.includes("clearTimeout")) {
        issues.push(`useEffect #${index + 1}: setTimeout ללא clearTimeout`);
      }
      if (
        effect.includes("addEventListener") &&
        !effect.includes("removeEventListener")
      ) {
        issues.push(
          `useEffect #${index + 1}: addEventListener ללא removeEventListener`
        );
      }
    });
  }

  return issues;
}

// בדיקת potential duplicated code patterns
function checkCodeDuplication(content, filePath) {
  const issues = [];

  // בדיקת פונקציות דומות (מעל 10 שורות זהות)
  const functionsWithSimilarLogic = content.match(
    /(function\s+\w+.*\{[\s\S]{200,}?\})/g
  );

  if (functionsWithSimilarLogic && functionsWithSimilarLogic.length > 3) {
    const relativePath = path.relative(process.cwd(), filePath);
    if (relativePath.includes("Service") || relativePath.includes("service")) {
      issues.push(
        `יותר מדי פונקציות דומות: ${functionsWithSimilarLogic.length} (שקול refactoring)`
      );
    }
  }

  // בדיקת imports כפולים
  const imports = content.match(/import.*from\s+['"][^'"]+['"]/g) || [];
  const uniqueImports = new Set(imports);
  if (imports.length > uniqueImports.size) {
    issues.push(`imports כפולים: ${imports.length - uniqueImports.size}`);
  }

  return issues;
}

// בדיקת React best practices
function checkReactBestPractices(content) {
  const issues = [];

  // בדיקת key props בלולאות
  if (content.includes(".map(") && !content.includes("key=")) {
    issues.push("חסר key prop ב-map iterations");
  }

  // בדיקת any types
  const anyCount = (content.match(/:\s*any\b/g) || []).length;
  if (anyCount > 0) {
    issues.push(`שימוש ב-any type: ${anyCount} פעמים`);
  }

  // בדיקת console statements - נדיר יותר עבור production
  const consoleCount = (content.match(/console\.(log|warn|error)/g) || [])
    .length;
  if (consoleCount > 10) {
    issues.push(
      `יותר מדי console statements: ${consoleCount} (מומלץ פחות מ-10)`
    );
  }

  // בדיקת inline styles מופרזות
  const inlineStyleCount = (content.match(/style=\{\{[^}]+\}\}/g) || []).length;
  if (inlineStyleCount > 5) {
    issues.push(
      `יותר מדי inline styles: ${inlineStyleCount} (השתמש ב-StyleSheet)`
    );
  }

  // בדיקת צמצומים של if-else מורכבים
  const ternaryCount = (content.match(/\?[^:]*:[^;}]*/g) || []).length;
  if (ternaryCount > 8) {
    issues.push(`יותר מדי ternary operators: ${ternaryCount} (מומלץ פחות מ-8)`);
  }

  return issues;
}

// סריקת כל הקבצים
function scanDirectory(dir) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      scanDirectory(itemPath);
    } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
      totalFiles++;
      const relativePath = path.relative(process.cwd(), itemPath);
      const content = fs.readFileSync(itemPath, "utf8");

      console.log(`📁 בודק: ${relativePath}`);

      // בדיקות שונות
      const lines = checkFileSize(itemPath);
      const unusedVars = checkUnusedVariables(itemPath, content);
      const complexity = checkComplexity(content);
      const memoryLeaks = checkMemoryLeaks(content);
      const reactIssues = checkReactBestPractices(content);
      const duplicationIssues = checkCodeDuplication(content, itemPath);

      const allIssues = [
        ...unusedVars,
        ...complexity,
        ...memoryLeaks,
        ...reactIssues,
        ...duplicationIssues,
      ];

      if (allIssues.length > 0) {
        console.log(`  ⚠️  נמצאו ${allIssues.length} בעיות:`);
        allIssues.forEach((issue) => {
          console.log(`    • ${issue}`);
        });
        totalIssues += allIssues.length;
      } else {
        console.log(`  ✅ אין בעיות (${lines} שורות)`);
      }
      console.log();
    }
  });
}

// הרצה
try {
  scanDirectory(srcDir);

  console.log("==========================================");
  console.log("📊 סיכום בדיקת איכות הקוד");
  console.log("==========================================");
  console.log(`📁 קבצים נבדקו: ${totalFiles}`);
  console.log(`📄 סה"כ שורות: ${totalLines.toLocaleString()}`);
  console.log(`⚠️  סה"כ בעיות: ${totalIssues}`);
  console.log(`📊 ממוצע שורות לקובץ: ${Math.round(totalLines / totalFiles)}`);
  console.log(`📊 ממוצע בעיות לקובץ: ${(totalIssues / totalFiles).toFixed(1)}`);

  if (totalIssues === 0) {
    console.log("\n🎉 כל הכבוד! איכות הקוד מעולה!");
  } else if (totalIssues < 50) {
    console.log("\n👍 איכות קוד טובה, אבל יש מקום לשיפור");
  } else {
    console.log("\n⚠️  יש הרבה מקום לשיפור באיכות הקוד");
  }
} catch (error) {
  console.error("❌ שגיאה בבדיקת איכות הקוד:", error.message);
  process.exit(1);
}
