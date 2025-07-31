/**
 * @file scripts/projectStructureValidator.js
 * @brief בודק את מבנה הפרויקט ועקביות הארכיטקטורה
 * @description מוודא שמבנה התיקיות והקבצים עקבי ומקצועי
 */

const fs = require("fs");
const path = require("path");

class ProjectStructureValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: [],
      recommendations: [],
    };

    this.projectRoot = path.resolve(__dirname, "..");
    console.log("🏗️ Project Structure Validator - בדיקת מבנה פרויקט...\n");
  }

  // בדיקת מבנה תיקיות חובה
  checkRequiredDirectories() {
    console.log("📁 בודק תיקיות חובה...");

    const requiredDirs = [
      "src",
      "src/components",
      "src/screens",
      "src/services",
      "src/utils",
      "src/types",
      "assets",
      "android",
      "ios",
    ];

    const optionalDirs = [
      "src/hooks",
      "src/stores",
      "src/navigation",
      "src/styles",
      "docs",
      "scripts",
      "__tests__",
    ];

    requiredDirs.forEach((dir) => {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        this.addSuccess(`✅ תיקייה חובה קיימת: ${dir}`);
      } else {
        this.addIssue(`❌ תיקייה חובה חסרה: ${dir}`, "error");
        this.addRecommendation(`💡 צור תיקייה: mkdir ${dir}`);
      }
    });

    optionalDirs.forEach((dir) => {
      const dirPath = path.join(this.projectRoot, dir);
      if (fs.existsSync(dirPath)) {
        this.addSuccess(`✅ תיקייה אופציונלית קיימת: ${dir}`);
      } else {
        this.addIssue(`⚠️ תיקייה מומלצת חסרה: ${dir}`, "warning");
      }
    });

    console.log("✅ סיום בדיקת תיקיות\n");
  }

  // בדיקת קבצי תצורה חשובים
  checkConfigurationFiles() {
    console.log("⚙️ בודק קבצי תצורה...");

    const requiredFiles = [
      "package.json",
      "tsconfig.json",
      "app.json",
      "App.tsx",
    ];

    const recommendedFiles = [
      ".gitignore",
      "README.md",
      "eslint.config.js",
      ".prettierrc",
    ];

    requiredFiles.forEach((file) => {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        this.addSuccess(`✅ קובץ תצורה חובה: ${file}`);
        this.validateConfigFile(file, filePath);
      } else {
        this.addIssue(`❌ קובץ תצורה חובה חסר: ${file}`, "error");
      }
    });

    recommendedFiles.forEach((file) => {
      const filePath = path.join(this.projectRoot, file);
      if (fs.existsSync(filePath)) {
        this.addSuccess(`✅ קובץ תצורה מומלץ: ${file}`);
      } else {
        this.addIssue(`⚠️ קובץ תצורה מומלץ חסר: ${file}`, "warning");
      }
    });

    console.log("✅ סיום בדיקת קבצי תצורה\n");
  }

  // אימות תוכן של קבצי תצורה
  validateConfigFile(fileName, filePath) {
    try {
      const content = fs.readFileSync(filePath, "utf8");

      switch (fileName) {
        case "package.json":
          this.validatePackageJson(content);
          break;
        case "tsconfig.json":
          this.validateTsConfig(content);
          break;
        case "app.json":
          this.validateAppJson(content);
          break;
      }
    } catch (error) {
      this.addIssue(`❌ שגיאה בקריאת ${fileName}: ${error.message}`, "error");
    }
  }

  // אימות package.json
  validatePackageJson(content) {
    try {
      const pkg = JSON.parse(content);

      const requiredFields = ["name", "version", "main", "scripts"];
      requiredFields.forEach((field) => {
        if (!pkg[field]) {
          this.addIssue(`⚠️ שדה חסר ב-package.json: ${field}`, "warning");
        }
      });

      // בדיקת scripts חשובים
      const recommendedScripts = ["start", "build", "test"];
      recommendedScripts.forEach((script) => {
        if (!pkg.scripts || !pkg.scripts[script]) {
          this.addIssue(`⚠️ Script מומלץ חסר: ${script}`, "warning");
        }
      });

      // בדיקת dependencies חשובים
      if (pkg.dependencies) {
        const hasReact =
          pkg.dependencies["react"] || pkg.dependencies["react-native"];
        if (!hasReact) {
          this.addIssue(
            "⚠️ React/React Native לא נמצא ב-dependencies",
            "warning"
          );
        }
      }
    } catch (error) {
      this.addIssue(`❌ package.json לא תקין: ${error.message}`, "error");
    }
  }

  // אימות tsconfig.json
  validateTsConfig(content) {
    try {
      const tsconfig = JSON.parse(content);

      if (!tsconfig.compilerOptions) {
        this.addIssue("⚠️ compilerOptions חסר ב-tsconfig.json", "warning");
        return;
      }

      const recommendedOptions = {
        target: ["es2017", "es2018", "es2019", "es2020", "esnext"],
        module: ["commonjs", "esnext"],
        strict: [true],
        esModuleInterop: [true],
        skipLibCheck: [true],
        allowSyntheticDefaultImports: [true],
      };

      Object.keys(recommendedOptions).forEach((option) => {
        const value = tsconfig.compilerOptions[option];
        const recommended = recommendedOptions[option];

        if (value === undefined) {
          this.addIssue(
            `⚠️ הגדרה מומלצת חסרה ב-tsconfig: ${option}`,
            "warning"
          );
        } else if (!recommended.includes(value)) {
          this.addIssue(
            `⚠️ ערך לא מומלץ ב-tsconfig: ${option}=${value}`,
            "warning"
          );
        }
      });
    } catch (error) {
      this.addIssue(`❌ tsconfig.json לא תקין: ${error.message}`, "error");
    }
  }

  // אימות app.json
  validateAppJson(content) {
    try {
      const app = JSON.parse(content);

      if (!app.expo) {
        this.addIssue("⚠️ הגדרות Expo חסרות ב-app.json", "warning");
        return;
      }

      const requiredExpoFields = ["name", "slug", "version", "platforms"];
      requiredExpoFields.forEach((field) => {
        if (!app.expo[field]) {
          this.addIssue(`⚠️ שדה Expo חסר: ${field}`, "warning");
        }
      });

      // בדיקת הגדרות אבטחה
      if (app.expo.android && !app.expo.android.permissions) {
        this.addIssue("⚠️ הרמות Android לא מוגדרות", "warning");
      }
    } catch (error) {
      this.addIssue(`❌ app.json לא תקין: ${error.message}`, "error");
    }
  }

  // בדיקת עקביות בשמות קבצים
  checkNamingConventions() {
    console.log("📝 בודק קונבנציות שמות...");

    const srcPath = path.join(this.projectRoot, "src");

    // בדיקת רכיבים
    this.checkComponentNaming(path.join(srcPath, "components"));

    // בדיקת מסכים
    this.checkScreenNaming(path.join(srcPath, "screens"));

    // בדיקת services
    this.checkServiceNaming(path.join(srcPath, "services"));

    console.log("✅ סיום בדיקת קונבנציות\n");
  }

  // בדיקת שמות רכיבים
  checkComponentNaming(componentsPath) {
    if (!fs.existsSync(componentsPath)) return;

    const files = this.getAllFiles(componentsPath, ".tsx");

    files.forEach((filePath) => {
      const fileName = path.basename(filePath, ".tsx");
      const relativePath = path.relative(this.projectRoot, filePath);

      // רכיבים צריכים להתחיל באות גדולה (PascalCase)
      if (!/^[A-Z][a-zA-Z0-9]*$/.test(fileName)) {
        this.addIssue(`⚠️ שם רכיב לא עקבי: ${relativePath}`, "warning");
        this.addRecommendation(`💡 שנה ל-PascalCase: ${fileName}`);
      } else {
        this.addSuccess(`✅ שם רכיב תקין: ${fileName}`);
      }
    });
  }

  // בדיקת שמות מסכים
  checkScreenNaming(screensPath) {
    if (!fs.existsSync(screensPath)) return;

    const files = this.getAllFiles(screensPath, ".tsx");

    files.forEach((filePath) => {
      const fileName = path.basename(filePath, ".tsx");
      const relativePath = path.relative(this.projectRoot, filePath);

      // מסכים צריכים להסתיים ב-Screen
      if (!fileName.endsWith("Screen")) {
        this.addIssue(`⚠️ שם מסך לא עקבי: ${relativePath}`, "warning");
        this.addRecommendation(`💡 הוסף 'Screen' לסוף השם: ${fileName}Screen`);
      } else {
        this.addSuccess(`✅ שם מסך תקין: ${fileName}`);
      }
    });
  }

  // בדיקת שמות services
  checkServiceNaming(servicesPath) {
    if (!fs.existsSync(servicesPath)) return;

    const files = this.getAllFiles(servicesPath, ".ts");

    files.forEach((filePath) => {
      const fileName = path.basename(filePath, ".ts");
      const relativePath = path.relative(this.projectRoot, filePath);

      // Services צריכים להסתיים ב-Service או להיות camelCase
      if (!/^[a-z][a-zA-Z0-9]*Service$|^[a-z][a-zA-Z0-9]*$/.test(fileName)) {
        this.addIssue(`⚠️ שם service לא עקבי: ${relativePath}`, "warning");
        this.addRecommendation(`💡 השתמש ב-camelCase או הוסף 'Service'`);
      } else {
        this.addSuccess(`✅ שם service תקין: ${fileName}`);
      }
    });
  }

  // בדיקת index.ts files
  checkIndexFiles() {
    console.log("📋 בודק קבצי index.ts...");

    const importantDirs = [
      "src/components",
      "src/screens",
      "src/services",
      "src/utils",
      "src/types",
    ];

    importantDirs.forEach((dir) => {
      const dirPath = path.join(this.projectRoot, dir);
      const indexPath = path.join(dirPath, "index.ts");

      if (fs.existsSync(dirPath)) {
        if (fs.existsSync(indexPath)) {
          this.addSuccess(`✅ קובץ index.ts קיים: ${dir}`);
          this.validateIndexFile(indexPath, dirPath);
        } else {
          this.addIssue(`⚠️ קובץ index.ts חסר: ${dir}`, "warning");
          this.addRecommendation(`💡 צור index.ts ב-${dir} לייצוא נוח`);
        }
      }
    });

    console.log("✅ סיום בדיקת index files\n");
  }

  // אימות תוכן index file
  validateIndexFile(indexPath, dirPath) {
    try {
      const indexContent = fs.readFileSync(indexPath, "utf8");
      const files = fs
        .readdirSync(dirPath)
        .filter((file) => file.endsWith(".ts") || file.endsWith(".tsx"))
        .filter((file) => file !== "index.ts");

      let exportCount = 0;
      files.forEach((file) => {
        const baseName = path.basename(file, path.extname(file));
        if (
          indexContent.includes(`export`) &&
          indexContent.includes(baseName)
        ) {
          exportCount++;
        }
      });

      if (exportCount === 0 && files.length > 0) {
        this.addIssue(
          `⚠️ index.ts ריק: ${path.relative(this.projectRoot, indexPath)}`,
          "warning"
        );
      }
    } catch (error) {
      this.addIssue(`❌ שגיאה בקריאת index.ts: ${error.message}`, "error");
    }
  }

  // בדיקת מורכבות תיקיות
  checkDirectoryComplexity() {
    console.log("🌳 בודק מורכבות תיקיות...");

    const srcPath = path.join(this.projectRoot, "src");
    this.analyzeDirectoryDepth(srcPath, 0);

    console.log("✅ סיום בדיקת מורכבות\n");
  }

  // ניתוח עומק תיקיות
  analyzeDirectoryDepth(dirPath, currentDepth) {
    const maxDepth = 4; // עומק מקסימלי מומלץ

    if (currentDepth > maxDepth) {
      const relativePath = path.relative(this.projectRoot, dirPath);
      this.addIssue(
        `⚠️ תיקייה עמוקה מדי: ${relativePath} (עומק ${currentDepth})`,
        "warning"
      );
      this.addRecommendation("💡 שקול לשטח את מבנה התיקיות");
      return;
    }

    try {
      const items = fs.readdirSync(dirPath);
      let fileCount = 0;

      items.forEach((item) => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
          this.analyzeDirectoryDepth(itemPath, currentDepth + 1);
        } else {
          fileCount++;
        }
      });

      // אזהרה על יותר מדי קבצים בתיקייה אחת
      if (fileCount > 15) {
        const relativePath = path.relative(this.projectRoot, dirPath);
        this.addIssue(
          `⚠️ יותר מדי קבצים בתיקייה: ${relativePath} (${fileCount})`,
          "warning"
        );
        this.addRecommendation("💡 שקול לפצל לתת-תיקיות");
      }
    } catch (error) {
      // תיקייה לא נגישה
    }
  }

  // המלצות לשיפור מבנה
  showStructureRecommendations() {
    console.log("💡 המלצות למבנה פרויקט:");
    console.log("─".repeat(30));

    const recommendations = [
      "📁 ארגן קבצים לפי פונקציונליות, לא לפי סוג",
      "📋 השתמש בקבצי index.ts לייצוא נוח",
      "🏷️ עקוב אחר קונבנציות שמות עקביות",
      "📦 קבץ קבצים קשורים יחד בתיקיות",
      "🎯 הגבל עומק תיקיות ל-4 רמות מקסימום",
      "📝 תעד את מבנה הפרויקט ב-README",
      "🔧 השתמש בכלי linting לעקביות",
      "📊 בדוק מבנה באופן קבוע",
      "🗂️ הפרד קוד business מקוד UI",
      "⚡ אופטימיזציה: קבצים קטנים ומודולריים",
    ];

    recommendations.forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });

    console.log("\n✅ המלצות הוצגו\n");
  }

  // פונקציות עזר
  getAllFiles(dirPath, extension) {
    let results = [];

    try {
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          results = results.concat(this.getAllFiles(filePath, extension));
        } else if (file.endsWith(extension)) {
          results.push(filePath);
        }
      });
    } catch (error) {
      // תיקייה לא נגישה
    }

    return results;
  }

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

  addRecommendation(message) {
    this.results.recommendations.push(message);
  }

  // הרצת כל הבדיקות
  run() {
    console.log("🏗️ Project Structure Validator v1.0");
    console.log("═".repeat(50));
    console.log("בודק מבנה ועקביות פרויקט:\n");

    this.checkRequiredDirectories();
    this.checkConfigurationFiles();
    this.checkNamingConventions();
    this.checkIndexFiles();
    this.checkDirectoryComplexity();
    this.showStructureRecommendations();

    this.showResults();
  }

  // הצגת תוצאות
  showResults() {
    console.log("\n🏗️ תוצאות בדיקת מבנה:");
    console.log("═".repeat(30));
    console.log(`✅ עבר: ${this.results.passed}`);
    console.log(`⚠️  אזהרות: ${this.results.warnings}`);
    console.log(`❌ נכשל: ${this.results.failed}`);

    if (this.results.issues.length > 0) {
      console.log("\n🔍 בעיות מבנה:");
      console.log("─".repeat(15));
      this.results.issues.slice(0, 15).forEach((issue, index) => {
        const icon = issue.type === "error" ? "❌" : "⚠️";
        console.log(`${index + 1}. ${icon} ${issue.message}`);
      });

      if (this.results.issues.length > 15) {
        console.log(`... ועוד ${this.results.issues.length - 15} בעיות`);
      }
    }

    if (this.results.recommendations.length > 0) {
      console.log("\n💡 המלצות מיידיות:");
      console.log("─".repeat(20));
      this.results.recommendations.slice(0, 7).forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    // הערכת איכות מבנה
    const structureScore = Math.max(
      0,
      100 - this.results.failed * 15 - this.results.warnings * 3
    );
    console.log(`\n🏆 ציון מבנה פרויקט: ${structureScore}/100`);

    if (structureScore >= 90) {
      console.log("🟢 מבנה פרויקט מצוין!");
    } else if (structureScore >= 70) {
      console.log("🟡 מבנה טוב - יש מקום לשיפור");
    } else {
      console.log("🔴 מבנה דורש שיפור משמעותי");
    }

    console.log(
      "\n🏗️ להרצת הבדיקה שוב: node scripts/projectStructureValidator.js"
    );
    console.log("═".repeat(50));
  }
}

// הרץ את הבדיקה
const validator = new ProjectStructureValidator();
validator.run();
