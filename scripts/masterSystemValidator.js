/**
 * @file scripts/masterSystemValidator.js
 * @brief כלי בדיקה מקיף שמפעיל את כל הכלים ומסכם תוצאות
 * @description רץ על כל כלי הבדיקה ויוצר דוח מקיף של מצב המערכת
 */

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

class MasterSystemValidator {
  constructor() {
    this.results = {
      tools: {},
      overall: {
        passed: 0,
        failed: 0,
        warnings: 0,
        totalTests: 0,
      },
      recommendations: [],
      criticalIssues: [],
    };

    this.projectRoot = path.resolve(__dirname, "..");
    console.log("🚀 Master System Validator - בדיקה מקיפה של המערכת");
    console.log("═".repeat(60));
    console.log("מפעיל את כל כלי הבדיקה...\n");
  }

  // רשימת כלי הבדיקה
  getValidationTools() {
    return [
      {
        name: "Navigation Flow",
        script: "testNavigationFlow.js",
        description: "בדיקת זרימת ניווט והתנהגות כפתורים",
        weight: 3, // משקל חשיבות
      },
      {
        name: "Demo Data Basic",
        script: "testDemoData.js",
        description: "בדיקת נתוני דמו בסיסיים",
        weight: 2,
      },
      {
        name: "Demo Data Advanced",
        script: "advancedDemoDataValidator.js",
        description: "בדיקה מתקדמת של נתוני דמו ו-AI",
        weight: 2,
      },
      {
        name: "TypeScript Compilation",
        script: "quickCompileCheck.js",
        description: "בדיקת קומפילציה וטיפוסים",
        weight: 3,
      },
      {
        name: "Project Structure",
        script: "projectStructureValidator.js",
        description: "בדיקת מבנה פרויקט ועקביות",
        weight: 2,
      },
      {
        name: "Performance Check",
        script: "performanceCheck.js",
        description: "בדיקת ביצועים ואופטימיזציה",
        weight: 2,
      },
      {
        name: "Security Check",
        script: "securityCheck.js",
        description: "בדיקת אבטחה וחורי אבטחה",
        weight: 2,
      },
    ];
  }

  // הפעלת כלי בדיקה בודד
  async runSingleTool(tool) {
    return new Promise((resolve) => {
      console.log(`🔧 מפעיל: ${tool.name}...`);

      const scriptPath = path.join(this.projectRoot, "scripts", tool.script);

      if (!fs.existsSync(scriptPath)) {
        console.log(`❌ סקריפט לא נמצא: ${tool.script}`);
        resolve({
          name: tool.name,
          success: false,
          error: "Script not found",
          output: "",
          passed: 0,
          failed: 1,
          warnings: 0,
        });
        return;
      }

      exec(
        `node "${scriptPath}"`,
        { cwd: this.projectRoot },
        (error, stdout, stderr) => {
          const output = stdout + (stderr || "");

          // ניתוח תוצאות מהטקסט
          const results = this.parseToolOutput(output, tool.name);

          if (error && !results.passed && !results.warnings) {
            results.success = false;
            results.error = error.message;
            results.failed = results.failed || 1;
          } else {
            results.success = true;
          }

          results.name = tool.name;
          results.output = output;
          results.weight = tool.weight;

          console.log(
            `${results.success ? "✅" : "❌"} ${tool.name}: ${results.passed} עבר, ${results.warnings} אזהרות, ${results.failed} נכשל`
          );
          resolve(results);
        }
      );
    });
  }

  // ניתוח פלט של כלי בדיקה
  parseToolOutput(output, toolName) {
    const results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: [],
      recommendations: [],
    };

    // דפוסים לזיהוי תוצאות
    const passedMatches =
      output.match(/✅[^\\n]*|עבר:\s*(\d+)|passed:\s*(\d+)|success/gi) || [];
    const failedMatches =
      output.match(/❌[^\\n]*|נכשל:\s*(\d+)|failed:\s*(\d+)|error/gi) || [];
    const warningMatches =
      output.match(/⚠️[^\\n]*|אזהרות:\s*(\d+)|warnings:\s*(\d+)|warning/gi) ||
      [];

    // חילוץ מספרים מסיכומים
    const passedNumberMatch = output.match(/עבר:\s*(\d+)|passed:\s*(\d+)/i);
    const failedNumberMatch = output.match(/נכשל:\s*(\d+)|failed:\s*(\d+)/i);
    const warningNumberMatch = output.match(
      /אזהרות:\s*(\d+)|warnings:\s*(\d+)/i
    );

    results.passed = passedNumberMatch
      ? parseInt(passedNumberMatch[1] || passedNumberMatch[2])
      : passedMatches.length;
    results.failed = failedNumberMatch
      ? parseInt(failedNumberMatch[1] || failedNumberMatch[2])
      : failedMatches.length;
    results.warnings = warningNumberMatch
      ? parseInt(warningNumberMatch[1] || warningNumberMatch[2])
      : warningMatches.length;

    // חילוץ בעיות ספציפיות
    const issueLines = output
      .split("\n")
      .filter(
        (line) =>
          line.includes("❌") ||
          line.includes("⚠️") ||
          line.includes("error") ||
          line.includes("fail")
      );

    results.issues = issueLines.slice(0, 5); // מגביל ל-5 בעיות עיקריות

    // חילוץ המלצות
    const recommendationLines = output
      .split("\n")
      .filter(
        (line) =>
          line.includes("💡") ||
          line.includes("המלצה") ||
          line.includes("recommend")
      );

    results.recommendations = recommendationLines.slice(0, 3);

    return results;
  }

  // הפעלת כל הכלים
  async runAllTools() {
    const tools = this.getValidationTools();
    const startTime = Date.now();

    console.log(`📋 מפעיל ${tools.length} כלי בדיקה...\n`);

    for (const tool of tools) {
      try {
        const result = await this.runSingleTool(tool);
        this.results.tools[tool.name] = result;

        // עדכון סיכום כללי
        this.results.overall.passed += result.passed || 0;
        this.results.overall.failed += result.failed || 0;
        this.results.overall.warnings += result.warnings || 0;
        this.results.overall.totalTests +=
          (result.passed || 0) + (result.failed || 0) + (result.warnings || 0);

        // איסוף בעיות קריטיות
        if (result.failed > 0 || (result.issues && result.issues.length > 0)) {
          this.results.criticalIssues.push({
            tool: tool.name,
            issues: result.issues || [
              `${result.failed} בעיות בכלי ${tool.name}`,
            ],
          });
        }

        // איסוף המלצות
        if (result.recommendations && result.recommendations.length > 0) {
          this.results.recommendations.push(...result.recommendations);
        }

        console.log(""); // רווח בין כלים
      } catch (error) {
        console.log(`❌ שגיאה בהפעלת ${tool.name}: ${error.message}\n`);
        this.results.tools[tool.name] = {
          name: tool.name,
          success: false,
          error: error.message,
          passed: 0,
          failed: 1,
          warnings: 0,
        };
        this.results.overall.failed += 1;
      }
    }

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log(`⏱️ זמן ביצוע כולל: ${duration} שניות\n`);

    this.generateComprehensiveReport();
  }

  // יצירת דוח מקיף
  generateComprehensiveReport() {
    console.log("📊 דוח מקיף - מצב המערכת");
    console.log("═".repeat(40));

    // סיכום כללי
    this.printOverallSummary();

    // תוצאות לפי כלי
    this.printToolResults();

    // בעיות קריטיות
    this.printCriticalIssues();

    // המלצות עיקריות
    this.printTopRecommendations();

    // הערכת מוכנות המערכת
    this.assessSystemReadiness();

    // פעולות מיידיות
    this.suggestImmediateActions();
  }

  // סיכום כללי
  printOverallSummary() {
    console.log("\n🎯 סיכום כללי:");
    console.log("─".repeat(15));
    console.log(`✅ עבר: ${this.results.overall.passed}`);
    console.log(`⚠️  אזהרות: ${this.results.overall.warnings}`);
    console.log(`❌ נכשל: ${this.results.overall.failed}`);
    console.log(`📊 סה"כ בדיקות: ${this.results.overall.totalTests}`);

    const successRate =
      this.results.overall.totalTests > 0
        ? Math.round(
            (this.results.overall.passed / this.results.overall.totalTests) *
              100
          )
        : 0;

    console.log(`📈 אחוז הצלחה: ${successRate}%`);
  }

  // תוצאות לפי כלי
  printToolResults() {
    console.log("\n🔧 תוצאות לפי כלי:");
    console.log("─".repeat(20));

    Object.values(this.results.tools).forEach((tool) => {
      const status = tool.success ? "✅" : "❌";
      const score =
        (tool.passed || 0) + (tool.warnings || 0) + (tool.failed || 0);
      const successRate =
        score > 0 ? Math.round(((tool.passed || 0) / score) * 100) : 0;

      console.log(
        `${status} ${tool.name}: ${successRate}% (${tool.passed || 0}/${tool.failed || 0}/${tool.warnings || 0})`
      );
    });
  }

  // בעיות קריטיות
  printCriticalIssues() {
    if (this.results.criticalIssues.length === 0) {
      console.log("\n🎉 אין בעיות קריטיות!");
      return;
    }

    console.log("\n🚨 בעיות קריטיות שדורשות טיפול:");
    console.log("─".repeat(35));

    this.results.criticalIssues.slice(0, 10).forEach((item, index) => {
      console.log(`${index + 1}. ${item.tool}:`);
      item.issues.slice(0, 2).forEach((issue) => {
        console.log(`   • ${issue}`);
      });
    });
  }

  // המלצות עיקריות
  printTopRecommendations() {
    if (this.results.recommendations.length === 0) return;

    console.log("\n💡 המלצות עיקריות:");
    console.log("─".repeat(20));

    // הסרת כפילויות והצגת 8 המלצות עיקריות
    const uniqueRecommendations = [...new Set(this.results.recommendations)];
    uniqueRecommendations.slice(0, 8).forEach((rec, index) => {
      console.log(`${index + 1}. ${rec}`);
    });
  }

  // הערכת מוכנות המערכת
  assessSystemReadiness() {
    console.log("\n🏆 הערכת מוכנות המערכת:");
    console.log("─".repeat(25));

    const totalScore = this.results.overall.totalTests;
    const successScore = this.results.overall.passed;
    const warningScore = this.results.overall.warnings * 0.5;
    const failureScore = this.results.overall.failed;

    const readinessScore =
      totalScore > 0
        ? Math.round(((successScore + warningScore) / totalScore) * 100)
        : 0;

    console.log(`📊 ציון מוכנות: ${readinessScore}/100`);

    if (readinessScore >= 90) {
      console.log("🟢 המערכת מוכנה לפרודקציה!");
      console.log("   • ניתן להתחיל בהטמעה");
      console.log("   • ביצועים מצוינים");
      console.log("   • איכות קוד גבוהה");
    } else if (readinessScore >= 75) {
      console.log("🟡 המערכת כמעט מוכנה");
      console.log("   • מומלץ לטפל באזהרות");
      console.log("   • ביצועים טובים");
      console.log("   • איכות קוד סבירה");
    } else if (readinessScore >= 60) {
      console.log("🟡 המערכת דורשת שיפורים");
      console.log("   • יש לטפל בבעיות הקריטיות");
      console.log("   • ביצועים בינוניים");
      console.log("   • נדרש עבודה נוספת");
    } else {
      console.log("🔴 המערכת דורשת עבודה נוספת");
      console.log("   • טיפול בבעיות קריטיות חובה");
      console.log("   • שיפור ביצועים נדרש");
      console.log("   • עבודה על איכות הקוד");
    }

    // מתי המערכת תהיה מוכנה
    if (readinessScore < 90) {
      const issuesRemaining = this.results.overall.failed;
      const estimatedDays = Math.ceil(issuesRemaining / 3); // 3 בעיות ליום
      console.log(`⏰ זמן משוער לתיקון: ${estimatedDays} ימי עבודה`);
    }
  }

  // הצעת פעולות מיידיות
  suggestImmediateActions() {
    console.log("\n⚡ פעולות מיידיות מומלצות:");
    console.log("─".repeat(30));

    const actions = [];

    // בהתבסס על תוצאות הכלים
    const tools = Object.values(this.results.tools);

    const navigationTool = tools.find((t) => t.name.includes("Navigation"));
    if (navigationTool && navigationTool.failed > 0) {
      actions.push("🔧 תקן בעיות ניווט - קריטי למשתמש");
    }

    const compileTool = tools.find((t) => t.name.includes("TypeScript"));
    if (compileTool && compileTool.failed > 0) {
      actions.push("📝 תקן שגיאות קומפילציה - חובה");
    }

    const securityTool = tools.find((t) => t.name.includes("Security"));
    if (securityTool && securityTool.failed > 0) {
      actions.push("🔒 טפל בבעיות אבטחה - דחוף");
    }

    const performanceTool = tools.find((t) => t.name.includes("Performance"));
    if (performanceTool && performanceTool.failed > 0) {
      actions.push("⚡ שפר ביצועים - חשוב");
    }

    if (actions.length === 0) {
      actions.push("🎉 המשך בפיתוח תכונות חדשות");
      actions.push("📈 התמקד בשיפור חוויית משתמש");
      actions.push("🧪 הוסף בדיקות נוספות");
    }

    actions.forEach((action, index) => {
      console.log(`${index + 1}. ${action}`);
    });

    console.log("\n📋 כלי בדיקה נוספים:");
    console.log("─".repeat(22));
    console.log("• node scripts/testNavigationFlow.js - בדיקת ניווט");
    console.log("• node scripts/quickCompileCheck.js - בדיקת קומפילציה");
    console.log("• node scripts/testDemoData.js - בדיקת נתוני דמו");
    console.log("• node scripts/advancedDemoDataValidator.js - בדיקה מתקדמת");

    console.log("\n🚀 להרצת הבדיקה המקיפה שוב:");
    console.log("   node scripts/masterSystemValidator.js");
    console.log("═".repeat(60));
  }

  // הפעלה עיקרית
  async run() {
    await this.runAllTools();
  }
}

// הפעלת הכלי הראשי
const validator = new MasterSystemValidator();
validator.run().catch((error) => {
  console.error("❌ שגיאה בהפעלת הכלי הראשי:", error.message);
  process.exit(1);
});
