/**
 * @file scripts/checkNavigation.js v2.0
 * @brief כלי בדיקה מתקדם לניווט - בודק שכל הקישורים והמסכים מחוברים
 * @dependencies Node.js, fs
 * @notes רץ עם: node scripts/checkNavigation.js
 * @version 2.0 - עם אלימנציה של כפילויות קוד ודיווח מאוחד
 */

const fs = require("fs");
const path = require("path");

// Configuration מרכזי
const NAVIGATION_CONFIG = {
  SAVE_REPORT: true,
  SEARCH_DIRS: ["src/screens", "src/components", "src/navigation"],
  NAVIGATION_PATTERNS: {
    routes: /export type RootStackParamList = \{([\s\S]*?)\};/,
    screenComponents: /<Stack\.Screen\s+name="(\w+)"/g,
    navigateCalls: /navigation\.navigate\(["'](\w+)["']/g,
    imports: /import\s+(\w+)\s+from\s+["']([^"']+)["']/g,
  },
};

console.log("🔍 GYMovoo Navigation Checker v2.0");
console.log("===================================\n");

// מחלקה מרכזית לניתוח ניווט - מונעת כפילויות
class NavigationAnalyzer {
  constructor() {
    this.srcDir = path.join(__dirname, "..", "src");
    this.fileCache = new Map();
    this.results = {
      routes: [],
      screenComponents: [],
      navigationCalls: new Set(),
      imports: [],
      issues: [],
      stats: {},
    };
  }

  // קריאת קובץ עם cache
  readFileWithCache(filePath) {
    if (this.fileCache.has(filePath)) {
      return this.fileCache.get(filePath);
    }

    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf8");
      this.fileCache.set(filePath, content);
      return content;
    }
    return "";
  }

  // חילוץ routes מתקדם עם תמיכה בקבצים מרובים
  extractRoutes() {
    const appNavigatorPath = path.join(
      this.srcDir,
      "navigation",
      "AppNavigator.tsx"
    );
    const typesPath = path.join(this.srcDir, "navigation", "types.ts");

    const appNavigatorContent = this.readFileWithCache(appNavigatorPath);
    const typesContent = this.readFileWithCache(typesPath);

    let routesMatch = appNavigatorContent.match(
      NAVIGATION_CONFIG.NAVIGATION_PATTERNS.routes
    );

    // אם לא נמצא ב-AppNavigator, חפש ב-types.ts
    if (!routesMatch && typesContent) {
      const startMatch = typesContent.match(
        /export type RootStackParamList = \{/
      );
      if (startMatch) {
        const startIndex = startMatch.index + startMatch[0].length;
        let braceCount = 1;
        let endIndex = startIndex;

        for (
          let i = startIndex;
          i < typesContent.length && braceCount > 0;
          i++
        ) {
          if (typesContent[i] === "{") braceCount++;
          if (typesContent[i] === "}") braceCount--;
          endIndex = i;
        }

        const content = typesContent.substring(startIndex, endIndex);
        routesMatch = [null, content];
      }
    }

    if (routesMatch) {
      const routesContent = routesMatch[1];
      const lines = routesContent.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        const match = trimmed.match(/^([A-Z]\w*):/);
        if (match) {
          this.results.routes.push(match[1]);
        }
      }
    }

    return this.results.routes;
  }

  // חילוץ Screen components
  extractScreenComponents() {
    const appNavigatorPath = path.join(
      this.srcDir,
      "navigation",
      "AppNavigator.tsx"
    );
    const content = this.readFileWithCache(appNavigatorPath);

    const screenMatches = content.matchAll(
      NAVIGATION_CONFIG.NAVIGATION_PATTERNS.screenComponents
    );
    for (const match of screenMatches) {
      this.results.screenComponents.push(match[1]);
    }

    return this.results.screenComponents;
  }

  // סריקת קריאות ניווט
  scanNavigationCalls() {
    const searchInDirectory = (dir) => {
      const fullPath = path.join(__dirname, "..", dir);
      if (!fs.existsSync(fullPath)) return;

      const files = fs.readdirSync(fullPath, { withFileTypes: true });

      files.forEach((file) => {
        if (file.isDirectory()) {
          searchInDirectory(path.join(dir, file.name));
        } else if (file.name.endsWith(".tsx") || file.name.endsWith(".ts")) {
          const filePath = path.join(fullPath, file.name);
          const content = this.readFileWithCache(filePath);

          const navigateMatches = content.matchAll(
            NAVIGATION_CONFIG.NAVIGATION_PATTERNS.navigateCalls
          );
          for (const match of navigateMatches) {
            this.results.navigationCalls.add(match[1]);
          }
        }
      });
    };

    NAVIGATION_CONFIG.SEARCH_DIRS.forEach(searchInDirectory);
    return Array.from(this.results.navigationCalls);
  }

  // בדיקת imports
  checkImports() {
    const appNavigatorPath = path.join(
      this.srcDir,
      "navigation",
      "AppNavigator.tsx"
    );
    const content = this.readFileWithCache(appNavigatorPath);

    const importMatches = content.matchAll(
      NAVIGATION_CONFIG.NAVIGATION_PATTERNS.imports
    );

    for (const match of importMatches) {
      if (match[2].includes("screens/")) {
        const importInfo = {
          name: match[1],
          path: match[2],
          exists: false,
        };

        let cleanPath = match[2].replace(/^\.\.\//, "");
        if (!cleanPath.startsWith("src/")) {
          cleanPath = "src/" + cleanPath;
        }
        const fullPath = path.join(__dirname, "..", cleanPath + ".tsx");
        importInfo.exists = fs.existsSync(fullPath);

        this.results.imports.push(importInfo);
      }
    }

    return this.results.imports;
  }

  // בדיקות תקינות מאוחדות
  validateNavigation() {
    // בדיקת התאמה בין routes ל-screen components
    this.results.routes.forEach((route) => {
      if (!this.results.screenComponents.includes(route)) {
        this.results.issues.push({
          type: "missing_screen",
          route,
          message: `Route "${route}" חסר Screen component`,
        });
      }
    });

    // בדיקת תקינות קריאות ניווט
    this.results.navigationCalls.forEach((call) => {
      if (!this.results.routes.includes(call)) {
        this.results.issues.push({
          type: "invalid_navigation",
          call,
          message: `קריאת ניווט "${call}" מצביעה על route שלא קיים`,
        });
      }
    });

    // בדיקת imports
    this.results.imports.forEach((imp) => {
      if (!imp.exists) {
        this.results.issues.push({
          type: "missing_import",
          import: imp.name,
          message: `${imp.name} - קובץ לא קיים: ${imp.path}.tsx`,
        });
      }
    });

    return this.results.issues;
  }

  // דיווח מאוחד עם פירוט משופר
  printResults() {
    console.log("📱 Routes שנמצאו:", this.results.routes.join(", "));
    console.log(
      "🖥️  Screen components:",
      this.results.screenComponents.join(", ")
    );
    console.log(
      "🎯 קריאות ניווט שנמצאו:",
      Array.from(this.results.navigationCalls).join(", ")
    );

    // הצגת בדיקות עם פירוט טוב יותר
    console.log("\n🔗 בדיקת התאמה:");
    const routeIssues = this.results.issues.filter(
      (i) => i.type === "missing_screen"
    );
    const connectedRoutes = this.results.routes.filter((route) =>
      this.results.screenComponents.includes(route)
    );

    if (routeIssues.length === 0) {
      console.log("✅ כל ה-routes מחוברים למסכים");
    } else {
      connectedRoutes.forEach((route) => console.log(`✅ ${route} - מחובר`));
      routeIssues.forEach((issue) => console.error(`❌ ${issue.message}`));
    }

    console.log("\n🎯 בדיקת תקינות קריאות ניווט:");
    const navIssues = this.results.issues.filter(
      (i) => i.type === "invalid_navigation"
    );
    const validCalls = Array.from(this.results.navigationCalls).filter((call) =>
      this.results.routes.includes(call)
    );

    if (navIssues.length === 0) {
      console.log("✅ כל קריאות הניווט תקינות");
    } else {
      validCalls.forEach((call) => console.log(`✅ ${call} - תקין`));
      navIssues.forEach((issue) => console.error(`❌ ${issue.message}`));
    }

    console.log("\n📦 בדיקת imports:");
    this.results.imports.forEach((imp) => {
      if (imp.exists) {
        console.log(`✅ ${imp.name} - קובץ קיים`);
      } else {
        console.error(`❌ ${imp.name} - קובץ לא קיים: ${imp.path}.tsx`);
      }
    });

    // סטטיסטיקות מפורטות
    this.results.stats = {
      totalRoutes: this.results.routes.length,
      totalScreens: this.results.screenComponents.length,
      totalNavigationCalls: this.results.navigationCalls.size,
      totalImports: this.results.imports.length,
      totalIssues: this.results.issues.length,
      connectedRoutes: connectedRoutes.length,
      validNavigationCalls: validCalls.length,
      existingImports: this.results.imports.filter((imp) => imp.exists).length,
    };

    console.log("\n📊 סיכום מפורט:");
    console.log(
      `📱 סה"כ routes: ${this.results.stats.totalRoutes} (מחוברים: ${this.results.stats.connectedRoutes})`
    );
    console.log(
      `🖥️  סה"כ screen components: ${this.results.stats.totalScreens}`
    );
    console.log(
      `🎯 סה"כ קריאות ניווט: ${this.results.stats.totalNavigationCalls} (תקינות: ${this.results.stats.validNavigationCalls})`
    );
    console.log(
      `📦 סה"כ imports של מסכים: ${this.results.stats.totalImports} (קיימים: ${this.results.stats.existingImports})`
    );

    if (this.results.stats.totalIssues > 0) {
      console.log(
        `\n⚠️  סה"כ נמצאו ${this.results.stats.totalIssues} בעיות ניווט`
      );

      // פירוט בעיות לפי סוג
      const issuesByType = this.results.issues.reduce((acc, issue) => {
        acc[issue.type] = (acc[issue.type] || 0) + 1;
        return acc;
      }, {});

      if (issuesByType.missing_screen) {
        console.log(
          `   • ${issuesByType.missing_screen} routes חסרי screen components`
        );
      }
      if (issuesByType.invalid_navigation) {
        console.log(
          `   • ${issuesByType.invalid_navigation} קריאות ניווט שגויות`
        );
      }
      if (issuesByType.missing_import) {
        console.log(`   • ${issuesByType.missing_import} imports חסרים`);
      }

      return false;
    } else {
      console.log("\n🎉 מעולה! כל הניווט תקין!");
      return true;
    }
  }

  // שמירת דו"ח JSON
  saveReport() {
    if (NAVIGATION_CONFIG.SAVE_REPORT) {
      const report = {
        timestamp: new Date().toISOString(),
        summary: this.results.stats,
        details: {
          routes: this.results.routes,
          screenComponents: this.results.screenComponents,
          navigationCalls: Array.from(this.results.navigationCalls),
          imports: this.results.imports,
          issues: this.results.issues,
        },
      };

      const reportPath = path.join(
        __dirname,
        `navigation-report-${Date.now()}.json`
      );
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      console.log(`💾 דו"ח נשמר ב: ${reportPath}`);
    }
  }
}
// הרצת הבדיקה - עם דיווח מאוחד
try {
  const analyzer = new NavigationAnalyzer();

  // ביצוע כל הבדיקות
  analyzer.extractRoutes();
  analyzer.extractScreenComponents();
  analyzer.scanNavigationCalls();
  analyzer.checkImports();
  analyzer.validateNavigation();

  // הצגת תוצאות
  const allValid = analyzer.printResults();

  // שמירת דו"ח
  analyzer.saveReport();

  // הצעות לשיפור
  console.log("\n💡 הצעות לשיפור:");
  console.log("1. הוסף type safety לקריאות ניווט");
  console.log("2. צור navigation hooks מותאמים");
  console.log("3. הוסף tests אוטומטיים לניווט");
  console.log("4. צור documentation לכל המסכים");
  console.log("5. השתמש ב-Deep Linking לניווט חיצוני");
  console.log("6. הוסף navigation middleware לטיפול בשגיאות");

  console.log("\n🔗 משאבים נוספים:");
  console.log("  - React Navigation: https://reactnavigation.org/");
  console.log(
    "  - TypeScript Navigation: https://reactnavigation.org/docs/typescript/"
  );
  console.log(
    "  - Testing Navigation: https://reactnavigation.org/docs/testing/"
  );

  console.log("\n✅ בדיקת ניווט הושלמה");

  if (!allValid) {
    process.exit(1);
  }
} catch (error) {
  console.error("❌ שגיאה בבדיקת ניווט:", error.message);
  process.exit(1);
}
