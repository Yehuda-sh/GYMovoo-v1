/**
 * @file scripts/securityCheck.js
 * @brief בדיקת אבטחה בסיסית לפרויקט
 * @features sensitive data exposure, dependency vulnerabilities
 */

const fs = require("fs");
const path = require("path");

console.log("🔒 GYMovoo Security Check");
console.log("=========================\n");

// בדיקת חשיפת מידע רגיש
function checkSensitiveData() {
  console.log("🔍 בדיקת חשיפת מידע רגיש:");
  console.log("---------------------------");

  const srcDir = path.join(__dirname, "..", "src");
  const sensitivePatterns = [
    { pattern: /password\s*[:=]\s*["'][\w\d]{3,}/gi, type: "סיסמה חשופה" },
    {
      pattern: /api[_-]?key\s*[:=]\s*["'][\w\d-]{10,}/gi,
      type: "API Key חשוף",
    },
    { pattern: /secret\s*[:=]\s*["'][\w\d]{6,}/gi, type: "Secret חשוף" },
    { pattern: /token\s*[:=]\s*["'][\w\d.-]{20,}/gi, type: "Token חשוף" },
    { pattern: /console\.log\([^)]*password/gi, type: "סיסמה ב-console.log" },
    { pattern: /console\.log\([^)]*token/gi, type: "token ב-console.log" },
  ];

  const issues = [];

  function scanSecurity(dir) {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanSecurity(itemPath);
      } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
        const content = fs.readFileSync(itemPath, "utf8");
        const relativePath = path.relative(process.cwd(), itemPath);

        sensitivePatterns.forEach(({ pattern, type }) => {
          const matches = content.match(pattern);
          if (matches) {
            matches.forEach((match) => {
              issues.push({
                file: relativePath,
                type: type,
                preview:
                  match.substring(0, 50) + (match.length > 50 ? "..." : ""),
              });
            });
          }
        });
      }
    });
  }

  scanSecurity(srcDir);

  if (issues.length === 0) {
    console.log("✅ לא נמצא מידע רגיש חשוף");
  } else {
    console.log(`🚨 נמצאו ${issues.length} בעיות אבטחה:`);
    issues.forEach((issue) => {
      console.log(`  📁 ${issue.file}`);
      console.log(`     🚨 ${issue.type}: ${issue.preview}`);
    });
  }

  console.log();
}

// בדיקת הרשאות מסוכנות
function checkDangerousPermissions() {
  console.log("🛡️  בדיקת הרשאות מסוכנות:");
  console.log("-------------------------");

  const appJsonPath = path.join(__dirname, "..", "app.json");

  if (fs.existsSync(appJsonPath)) {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
    const permissions = appJson.expo?.android?.permissions || [];

    const dangerousPermissions = [
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE",
      "CAMERA",
      "RECORD_AUDIO",
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION",
      "READ_CONTACTS",
      "WRITE_CONTACTS",
    ];

    const foundDangerous = permissions.filter((p) =>
      dangerousPermissions.includes(p)
    );

    if (foundDangerous.length === 0) {
      console.log("✅ לא נמצאו הרשאות מסוכנות");
    } else {
      console.log(`⚠️  נמצאו ${foundDangerous.length} הרשאות רגישות:`);
      foundDangerous.forEach((perm) => {
        console.log(`  🔓 ${perm}`);
      });
      console.log("💡 וודא שההרשאות האלה באמת נדרשות");
    }
  } else {
    console.log("⚠️  app.json לא נמצא");
  }

  console.log();
}

// בדיקת dependencies מוכרים
function checkKnownVulnerabilities() {
  console.log("📦 בדיקת Dependencies מוכרים:");
  console.log("------------------------------");

  const packageJsonPath = path.join(__dirname, "..", "package.json");

  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
    const dependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    // רשימה של packages עם בעיות אבטחה ידועות (דוגמאות)
    const knownVulnerable = [
      "lodash@4.17.19",
      "serialize-javascript@3.1.0",
      "yargs-parser@18.1.2",
    ];

    const outdatedPackages = [];

    Object.entries(dependencies).forEach(([name, version]) => {
      // בדיקה בסיסית של גרסאות ישנות
      if (version.startsWith("^0.") || version.startsWith("~0.")) {
        outdatedPackages.push(`${name}@${version} (גרסה 0.x)`);
      }
    });

    if (outdatedPackages.length === 0) {
      console.log("✅ לא נמצאו dependencies עם בעיות ידועות");
    } else {
      console.log(`⚠️  נמצאו ${outdatedPackages.length} packages שכדאי לבדוק:`);
      outdatedPackages.slice(0, 5).forEach((pkg) => {
        console.log(`  📦 ${pkg}`);
      });
    }

    console.log(`📊 סה"כ dependencies: ${Object.keys(dependencies).length}`);
  } else {
    console.log("⚠️  package.json לא נמצא");
  }

  console.log();
}

// בדיקת Expo security configurations
function checkExpoSecurity() {
  console.log("📱 בדיקת הגדרות אבטחה Expo:");
  console.log("----------------------------");

  const appJsonPath = path.join(__dirname, "..", "app.json");

  if (fs.existsSync(appJsonPath)) {
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, "utf8"));
    const expo = appJson.expo || {};

    const securityChecks = [];

    // בדיקת scheme
    if (!expo.scheme) {
      securityChecks.push("❌ חסר scheme - יכול לאפשר deep links לא מורשים");
    } else {
      securityChecks.push("✅ scheme מוגדר");
    }

    // בדיקת orientation lock
    if (!expo.orientation || expo.orientation === "default") {
      securityChecks.push("⚠️  orientation לא נעול - יכול לגרום לבעיות UI");
    } else {
      securityChecks.push("✅ orientation נעול");
    }

    // בדיקת iOS security
    if (expo.ios && !expo.ios.bundleIdentifier) {
      securityChecks.push("❌ חסר bundleIdentifier עבור iOS");
    }

    // בדיקת Android security
    if (expo.android && !expo.android.package) {
      securityChecks.push("❌ חסר package name עבור Android");
    }

    securityChecks.forEach((check) => console.log(`  ${check}`));
  } else {
    console.log("⚠️  app.json לא נמצא");
  }

  console.log();
}

// הרצה
try {
  checkSensitiveData();
  checkDangerousPermissions();
  checkKnownVulnerabilities();
  checkExpoSecurity();

  console.log("==========================================");
  console.log("📊 סיכום בדיקת אבטחה");
  console.log("==========================================");
  console.log("💡 המלצות אבטחה:");
  console.log("  1. אל תשמור sensitive data בקוד");
  console.log("  2. השתמש במשתני סביבה (.env)");
  console.log("  3. עדכן dependencies באופן קבוע");
  console.log("  4. בדוק הרשאות אפליקציה");
  console.log("  5. הגדר proper error handling");
  console.log("");
  console.log("🔒 לביטחון מלא הרץ: npm audit");
} catch (error) {
  console.error("❌ שגיאה בבדיקת אבטחה:", error.message);
}
