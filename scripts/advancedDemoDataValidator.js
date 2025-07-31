/**
 * @file scripts/advancedDemoDataValidator.js
 * @brief בדיקה מתקדמת של נתוני דמו ופונקציונליות AI
 * @description בודק את איכות נתוני הדמו, אלגוריתמי AI, ויכולות חיפוש
 */

const fs = require("fs");
const path = require("path");

class AdvancedDemoDataValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: [],
      recommendations: [],
      stats: {},
    };

    this.projectRoot = path.resolve(__dirname, "..");
    console.log("🧠 Advanced Demo Data Validator - בדיקה מתקדמת...\n");
  }

  // בדיקת איכות נתוני תרגילים
  validateExerciseData() {
    console.log("💪 בודק איכות נתוני תרגילים...");

    try {
      const exerciseDataPath = path.join(
        this.projectRoot,
        "src",
        "data",
        "exerciseData.ts"
      );
      if (!fs.existsSync(exerciseDataPath)) {
        this.addIssue("❌ קובץ exerciseData.ts לא נמצא", "error");
        return;
      }

      const content = fs.readFileSync(exerciseDataPath, "utf8");

      // ספירת תרגילים לפי קבוצות שרירים
      const muscleGroups = [
        "חזה",
        "גב",
        "רגליים",
        "כתפיים",
        "ביצפס",
        "טריצפס",
        "ליבה",
      ];
      const exerciseStats = {};

      muscleGroups.forEach((group) => {
        const regex = new RegExp(group, "g");
        const matches = content.match(regex) || [];
        exerciseStats[group] = matches.length;

        if (matches.length < 3) {
          this.addIssue(
            `⚠️ מעט תרגילים עבור ${group}: ${matches.length}`,
            "warning"
          );
        } else if (matches.length >= 5) {
          this.addSuccess(
            `✅ מספר טוב של תרגילים עבור ${group}: ${matches.length}`
          );
        }
      });

      this.results.stats.exercisesByMuscleGroup = exerciseStats;

      // בדיקת תרגילים עם תמונות
      const imageMatches = content.match(/image:\s*['"`][^'"`]+['"`]/g) || [];
      const totalExercises = content.match(/name:\s*['"`][^'"`]+['"`]/g) || [];

      const imageRatio =
        totalExercises.length > 0
          ? (imageMatches.length / totalExercises.length) * 100
          : 0;

      if (imageRatio < 50) {
        this.addIssue(
          `⚠️ מעט תמונות תרגילים: ${Math.round(imageRatio)}%`,
          "warning"
        );
      } else {
        this.addSuccess(`✅ כיסוי תמונות טוב: ${Math.round(imageRatio)}%`);
      }

      this.results.stats.exerciseImageCoverage = Math.round(imageRatio);
    } catch (error) {
      this.addIssue(`❌ שגיאה בבדיקת נתוני תרגילים: ${error.message}`, "error");
    }

    console.log("✅ סיום בדיקת נתוני תרגילים\n");
  }

  // בדיקת נתוני דיאטה ותזונה
  validateDietData() {
    console.log("🍎 בודק נתוני דיאטה ותזונה...");

    try {
      const dietDataPath = path.join(
        this.projectRoot,
        "src",
        "data",
        "dietData.ts"
      );
      if (!fs.existsSync(dietDataPath)) {
        this.addIssue("❌ קובץ dietData.ts לא נמצא", "error");
        return;
      }

      const content = fs.readFileSync(dietDataPath, "utf8");

      // בדיקת סוגי דיאטות
      const dietTypes = [
        "keto",
        "vegan",
        "vegetarian",
        "paleo",
        "mediterranean",
      ];
      const foundDiets = [];

      dietTypes.forEach((diet) => {
        if (content.toLowerCase().includes(diet)) {
          foundDiets.push(diet);
          this.addSuccess(`✅ דיאטה נמצאה: ${diet}`);
        }
      });

      if (foundDiets.length < 3) {
        this.addIssue(`⚠️ מעט סוגי דיאטות: ${foundDiets.length}`, "warning");
      }

      // בדיקת מידע תזונתי
      const nutritionFields = ["calories", "protein", "carbs", "fat", "fiber"];
      let nutritionScore = 0;

      nutritionFields.forEach((field) => {
        if (content.toLowerCase().includes(field)) {
          nutritionScore++;
        }
      });

      if (nutritionScore >= 4) {
        this.addSuccess(`✅ מידע תזונתי מקיף: ${nutritionScore}/5`);
      } else {
        this.addIssue(`⚠️ מידע תזונתי חסר: ${nutritionScore}/5`, "warning");
      }

      this.results.stats.dietTypes = foundDiets.length;
      this.results.stats.nutritionInfoScore = nutritionScore;
    } catch (error) {
      this.addIssue(`❌ שגיאה בבדיקת נתוני דיאטה: ${error.message}`, "error");
    }

    console.log("✅ סיום בדיקת נתוני דיאטה\n");
  }

  // בדיקת אלגוריתמי AI ו-Machine Learning
  validateAIAlgorithms() {
    console.log("🤖 בודק אלגוריתמי AI...");

    try {
      // בדיקת service files
      const servicesPath = path.join(this.projectRoot, "src", "services");
      const serviceFiles = this.getAllFiles(servicesPath, ".ts");

      let aiFeatures = {
        workoutGeneration: false,
        personalization: false,
        progressTracking: false,
        recommendations: false,
      };

      serviceFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, "utf8");
        const fileName = path.basename(filePath);

        // בדיקת יכולות AI
        if (
          content.includes("generateWorkout") ||
          content.includes("createWorkout")
        ) {
          aiFeatures.workoutGeneration = true;
          this.addSuccess(`✅ יצירת אימונים אוטומטית: ${fileName}`);
        }

        if (content.includes("personalize") || content.includes("customize")) {
          aiFeatures.personalization = true;
          this.addSuccess(`✅ התאמה אישית: ${fileName}`);
        }

        if (content.includes("progress") || content.includes("track")) {
          aiFeatures.progressTracking = true;
          this.addSuccess(`✅ מעקב התקדמות: ${fileName}`);
        }

        if (content.includes("recommend") || content.includes("suggest")) {
          aiFeatures.recommendations = true;
          this.addSuccess(`✅ המלצות: ${fileName}`);
        }

        // בדיקת אלגוריתמים מתקדמים
        const advancedPatterns = [
          /machine[\s_-]?learning/gi,
          /neural[\s_-]?network/gi,
          /deep[\s_-]?learning/gi,
          /algorithm/gi,
          /prediction/gi,
          /classification/gi,
        ];

        advancedPatterns.forEach((pattern) => {
          if (pattern.test(content)) {
            this.addSuccess(`✅ אלגוריתם מתקדם ב-${fileName}`);
          }
        });
      });

      // הערכת כיסוי AI
      const aiScore = Object.values(aiFeatures).filter(Boolean).length;
      if (aiScore >= 3) {
        this.addSuccess(`✅ כיסוי AI טוב: ${aiScore}/4 יכולות`);
      } else {
        this.addIssue(`⚠️ כיסוי AI חלקי: ${aiScore}/4`, "warning");
      }

      this.results.stats.aiFeatures = aiScore;
    } catch (error) {
      this.addIssue(`❌ שגיאה בבדיקת AI: ${error.message}`, "error");
    }

    console.log("✅ סיום בדיקת אלגוריתמי AI\n");
  }

  // בדיקת מערכת המלצות
  validateRecommendationSystem() {
    console.log("🎯 בודק מערכת המלצות...");

    try {
      const srcPath = path.join(this.projectRoot, "src");
      const allFiles = this.getAllFiles(srcPath, ".ts").concat(
        this.getAllFiles(srcPath, ".tsx")
      );

      let recommendationFeatures = {
        exerciseRecommendations: 0,
        dietRecommendations: 0,
        workoutPlanRecommendations: 0,
        equipmentRecommendations: 0,
      };

      allFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, "utf8");

        // תרגילים מומלצים
        if (
          content.match(/recommend.*exercise/gi) ||
          content.match(/suggest.*exercise/gi)
        ) {
          recommendationFeatures.exerciseRecommendations++;
        }

        // דיאטות מומלצות
        if (
          content.match(/recommend.*diet/gi) ||
          content.match(/suggest.*meal/gi)
        ) {
          recommendationFeatures.dietRecommendations++;
        }

        // תוכניות אימון מומלצות
        if (
          content.match(/recommend.*workout/gi) ||
          content.match(/suggest.*plan/gi)
        ) {
          recommendationFeatures.workoutPlanRecommendations++;
        }

        // ציוד מומלץ
        if (
          content.match(/recommend.*equipment/gi) ||
          content.match(/suggest.*gear/gi)
        ) {
          recommendationFeatures.equipmentRecommendations++;
        }
      });

      const totalRecommendations = Object.values(recommendationFeatures).reduce(
        (a, b) => a + b,
        0
      );

      if (totalRecommendations >= 5) {
        this.addSuccess(
          `✅ מערכת המלצות עשירה: ${totalRecommendations} מקורות`
        );
      } else if (totalRecommendations >= 2) {
        this.addSuccess(
          `✅ מערכת המלצות בסיסית: ${totalRecommendations} מקורות`
        );
      } else {
        this.addIssue(
          `⚠️ מערכת המלצות חלשה: ${totalRecommendations} מקורות`,
          "warning"
        );
      }

      this.results.stats.recommendationSources = totalRecommendations;
    } catch (error) {
      this.addIssue(`❌ שגיאה בבדיקת המלצות: ${error.message}`, "error");
    }

    console.log("✅ סיום בדיקת מערכת המלצות\n");
  }

  // בדיקת איכות חיפוש ומיון
  validateSearchAndFiltering() {
    console.log("🔍 בודק יכולות חיפוש ומיון...");

    try {
      const srcPath = path.join(this.projectRoot, "src");
      const allFiles = this.getAllFiles(srcPath, ".ts").concat(
        this.getAllFiles(srcPath, ".tsx")
      );

      let searchFeatures = {
        textSearch: false,
        filterByCategory: false,
        sortOptions: false,
        advancedFilters: false,
      };

      allFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, "utf8");
        const fileName = path.basename(filePath);

        // חיפוש טקסט
        if (
          content.includes("search") ||
          content.includes("filter") ||
          content.includes("find")
        ) {
          searchFeatures.textSearch = true;
          this.addSuccess(`✅ חיפוש טקסט: ${fileName}`);
        }

        // סינון לפי קטגוריה
        if (
          content.includes("category") ||
          content.includes("type") ||
          content.includes("group")
        ) {
          searchFeatures.filterByCategory = true;
          this.addSuccess(`✅ סינון קטגוריות: ${fileName}`);
        }

        // אפשרויות מיון
        if (
          content.includes("sort") ||
          content.includes("order") ||
          content.includes("arrange")
        ) {
          searchFeatures.sortOptions = true;
          this.addSuccess(`✅ מיון תוצאות: ${fileName}`);
        }

        // מסנני מתקדמים
        if (
          content.includes("difficulty") ||
          content.includes("duration") ||
          content.includes("equipment")
        ) {
          searchFeatures.advancedFilters = true;
          this.addSuccess(`✅ מסננים מתקדמים: ${fileName}`);
        }
      });

      const searchScore = Object.values(searchFeatures).filter(Boolean).length;
      if (searchScore >= 3) {
        this.addSuccess(`✅ יכולות חיפוש מתקדמות: ${searchScore}/4`);
      } else {
        this.addIssue(`⚠️ יכולות חיפוש בסיסיות: ${searchScore}/4`, "warning");
      }

      this.results.stats.searchFeatures = searchScore;
    } catch (error) {
      this.addIssue(`❌ שגיאה בבדיקת חיפוש: ${error.message}`, "error");
    }

    console.log("✅ סיום בדיקת חיפוש ומיון\n");
  }

  // בדיקת דמו משתמש מתקדמת
  validateAdvancedDemoUser() {
    console.log("👤 בודק פרופיל דמו משתמש מתקדם...");

    try {
      const srcPath = path.join(this.projectRoot, "src");
      const allFiles = this.getAllFiles(srcPath, ".ts").concat(
        this.getAllFiles(srcPath, ".tsx")
      );

      let userDataFields = {
        basicInfo: false, // שם, גיל, מגדר
        fitnessLevel: false, // רמת כושר
        goals: false, // מטרות
        preferences: false, // העדפות
        restrictions: false, // הגבלות
        history: false, // היסטוריה
      };

      const demoUserPatterns = {
        basicInfo: /name|age|gender|גיל|שם|מגדר/gi,
        fitnessLevel:
          /fitness.*level|beginner|intermediate|advanced|רמת.*כושר/gi,
        goals: /goal|target|מטרה|יעד/gi,
        preferences: /prefer|like|העדפה|אוהב/gi,
        restrictions: /restriction|limitation|הגבלה|מגבלה/gi,
        history: /history|previous|קודם|היסטוריה/gi,
      };

      allFiles.forEach((filePath) => {
        const content = fs.readFileSync(filePath, "utf8");

        Object.keys(demoUserPatterns).forEach((field) => {
          if (demoUserPatterns[field].test(content)) {
            userDataFields[field] = true;
          }
        });
      });

      const userDataScore =
        Object.values(userDataFields).filter(Boolean).length;

      if (userDataScore >= 5) {
        this.addSuccess(`✅ פרופיل דמו מתקדם: ${userDataScore}/6 שדות`);
      } else if (userDataScore >= 3) {
        this.addSuccess(`✅ פרופיל דמו בסיסי: ${userDataScore}/6 שדות`);
      } else {
        this.addIssue(`⚠️ פרופיל דמו חלקי: ${userDataScore}/6 שדות`, "warning");
      }

      this.results.stats.demoUserComplexity = userDataScore;
    } catch (error) {
      this.addIssue(`❌ שגיאה בבדיקת דמו משתמש: ${error.message}`, "error");
    }

    console.log("✅ סיום בדיקת דמו משתמש\n");
  }

  // ניתוח ביצועי נתונים
  analyzeDemoDataPerformance() {
    console.log("⚡ מנתח ביצועי נתוני דמו...");

    try {
      const dataPath = path.join(this.projectRoot, "src", "data");
      if (!fs.existsSync(dataPath)) {
        this.addIssue("❌ תיקיית data לא נמצאה", "error");
        return;
      }

      const dataFiles = this.getAllFiles(dataPath, ".ts");
      let totalDataSize = 0;
      let largeFiles = [];

      dataFiles.forEach((filePath) => {
        const stats = fs.statSync(filePath);
        const sizeKB = stats.size / 1024;
        totalDataSize += sizeKB;

        const fileName = path.basename(filePath);

        if (sizeKB > 100) {
          largeFiles.push({ name: fileName, size: Math.round(sizeKB) });
          this.addIssue(
            `⚠️ קובץ נתונים גדול: ${fileName} (${Math.round(sizeKB)}KB)`,
            "warning"
          );
        } else {
          this.addSuccess(
            `✅ גודל קובץ סביר: ${fileName} (${Math.round(sizeKB)}KB)`
          );
        }
      });

      // הערכת גודל כולל
      if (totalDataSize < 500) {
        this.addSuccess(
          `✅ גודל נתונים אופטימלי: ${Math.round(totalDataSize)}KB`
        );
      } else if (totalDataSize < 1000) {
        this.addIssue(
          `⚠️ גודל נתונים בינוני: ${Math.round(totalDataSize)}KB`,
          "warning"
        );
      } else {
        this.addIssue(
          `⚠️ גודל נתונים גדול: ${Math.round(totalDataSize)}KB`,
          "warning"
        );
        this.addRecommendation("💡 שקול lazy loading או דחיסת נתונים");
      }

      this.results.stats.totalDataSizeKB = Math.round(totalDataSize);
      this.results.stats.largeDataFiles = largeFiles.length;
    } catch (error) {
      this.addIssue(`❌ שגיאה בניתוח ביצועים: ${error.message}`, "error");
    }

    console.log("✅ סיום ניתוח ביצועים\n");
  }

  // בדיקת תרחישי שימוש מתקדמים
  validateAdvancedUseCases() {
    console.log("🎭 בודק תרחישי שימוש מתקדמים...");

    const useCases = [
      {
        name: "יצירת תוכנית אימון אישית",
        patterns: [
          /generate.*workout.*plan/gi,
          /create.*custom.*program/gi,
          /personalized.*routine/gi,
        ],
      },
      {
        name: "מעקב התקדמות",
        patterns: [
          /track.*progress/gi,
          /monitor.*improvement/gi,
          /measure.*performance/gi,
        ],
      },
      {
        name: "התאמת דיאטה לאימון",
        patterns: [/nutrition.*plan/gi, /diet.*workout/gi, /meal.*fitness/gi],
      },
      {
        name: "המלצות ציוד",
        patterns: [
          /equipment.*recommendation/gi,
          /gear.*suggestion/gi,
          /tool.*advice/gi,
        ],
      },
      {
        name: "אימון חברתי",
        patterns: [
          /social.*workout/gi,
          /group.*exercise/gi,
          /share.*progress/gi,
        ],
      },
    ];

    try {
      const srcPath = path.join(this.projectRoot, "src");
      const allFiles = this.getAllFiles(srcPath, ".ts").concat(
        this.getAllFiles(srcPath, ".tsx")
      );
      const allContent = allFiles
        .map((f) => fs.readFileSync(f, "utf8"))
        .join("\n");

      let supportedUseCases = 0;

      useCases.forEach((useCase) => {
        let found = false;
        useCase.patterns.forEach((pattern) => {
          if (pattern.test(allContent)) {
            found = true;
          }
        });

        if (found) {
          supportedUseCases++;
          this.addSuccess(`✅ תרחיש נתמך: ${useCase.name}`);
        } else {
          this.addIssue(`⚠️ תרחיש חסר: ${useCase.name}`, "warning");
        }
      });

      if (supportedUseCases >= 4) {
        this.addSuccess(
          `✅ כיסוי תרחישים מצוין: ${supportedUseCases}/${useCases.length}`
        );
      } else if (supportedUseCases >= 2) {
        this.addSuccess(
          `✅ כיסוי תרחישים בסיסי: ${supportedUseCases}/${useCases.length}`
        );
      } else {
        this.addIssue(
          `⚠️ כיסוי תרחישים חלקי: ${supportedUseCases}/${useCases.length}`,
          "warning"
        );
      }

      this.results.stats.supportedUseCases = supportedUseCases;
    } catch (error) {
      this.addIssue(`❌ שגיאה בבדיקת תרחישים: ${error.message}`, "error");
    }

    console.log("✅ סיום בדיקת תרחישים\n");
  }

  // המלצות לשיפור נתוני דמו
  showDemoDataRecommendations() {
    console.log("💡 המלצות לשיפור נתוני דמו:");
    console.log("─".repeat(35));

    const recommendations = [
      "📊 הוסף יותר נתוני דמו מגוונים לכל קבוצת שרירים",
      "🖼️ הוסף תמונות איכותיות לכל התרגילים",
      "🍎 הרחב את מאגר הדיאטות והמתכונים",
      "🤖 שפר אלגוריתמי AI להתאמה אישית",
      "🎯 חזק את מערכת ההמלצות",
      "🔍 הוסף יכולות חיפוש מתקדמות",
      "👤 עשיר את פרופיל הדמו משתמש",
      "⚡ אופטימיזציה: דחוס נתונים גדולים",
      "📱 הוסף נתוני מעקב התקדמות",
      "🎭 הטמע תרחישי שימוש מורכבים",
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
    console.log("🧠 Advanced Demo Data Validator v1.0");
    console.log("═".repeat(55));
    console.log("בדיקה מתקדמת של נתוני דמו ו-AI:\n");

    this.validateExerciseData();
    this.validateDietData();
    this.validateAIAlgorithms();
    this.validateRecommendationSystem();
    this.validateSearchAndFiltering();
    this.validateAdvancedDemoUser();
    this.analyzeDemoDataPerformance();
    this.validateAdvancedUseCases();
    this.showDemoDataRecommendations();

    this.showResults();
  }

  // הצגת תוצאות מתקדמת
  showResults() {
    console.log("\n🧠 תוצאות בדיקה מתקדמת:");
    console.log("═".repeat(35));
    console.log(`✅ עבר: ${this.results.passed}`);
    console.log(`⚠️  אזהרות: ${this.results.warnings}`);
    console.log(`❌ נכשל: ${this.results.failed}`);

    // סטטיסטיקות מפורטות
    if (Object.keys(this.results.stats).length > 0) {
      console.log("\n📊 סטטיסטיקות מפורטות:");
      console.log("─".repeat(25));

      if (this.results.stats.exerciseImageCoverage) {
        console.log(
          `🖼️ כיסוי תמונות תרגילים: ${this.results.stats.exerciseImageCoverage}%`
        );
      }

      if (this.results.stats.dietTypes) {
        console.log(`🍎 סוגי דיאטות: ${this.results.stats.dietTypes}`);
      }

      if (this.results.stats.aiFeatures) {
        console.log(`🤖 יכולות AI: ${this.results.stats.aiFeatures}/4`);
      }

      if (this.results.stats.recommendationSources) {
        console.log(
          `🎯 מקורות המלצות: ${this.results.stats.recommendationSources}`
        );
      }

      if (this.results.stats.searchFeatures) {
        console.log(`🔍 יכולות חיפוש: ${this.results.stats.searchFeatures}/4`);
      }

      if (this.results.stats.totalDataSizeKB) {
        console.log(`📦 גודל נתונים: ${this.results.stats.totalDataSizeKB}KB`);
      }

      if (this.results.stats.supportedUseCases) {
        console.log(
          `🎭 תרחישי שימוש: ${this.results.stats.supportedUseCases}/5`
        );
      }
    }

    // בעיות קריטיות
    if (this.results.failed > 0) {
      console.log("\n🚨 בעיות קريטيות:");
      console.log("─".repeat(18));
      this.results.issues
        .filter((issue) => issue.type === "error")
        .slice(0, 5)
        .forEach((issue, index) => {
          console.log(`${index + 1}. ${issue.message}`);
        });
    }

    // אזהרות חשובות
    if (this.results.warnings > 0) {
      console.log("\n⚠️ אזהרות לשיפור:");
      console.log("─".repeat(18));
      this.results.issues
        .filter((issue) => issue.type === "warning")
        .slice(0, 8)
        .forEach((issue, index) => {
          console.log(`${index + 1}. ${issue.message}`);
        });
    }

    // המלצות מיידיות
    if (this.results.recommendations.length > 0) {
      console.log("\n💡 המלצות מיידיות:");
      console.log("─".repeat(20));
      this.results.recommendations.slice(0, 6).forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }

    // ציון כולל למערכת הדמו
    const demoScore = Math.max(
      0,
      100 - this.results.failed * 25 - this.results.warnings * 5
    );
    console.log(`\n🏆 ציון מערכת דמו: ${demoScore}/100`);

    if (demoScore >= 90) {
      console.log("🟢 מערכת דמו מצוינת - מוכנה לפרזנטציה!");
    } else if (demoScore >= 75) {
      console.log("🟡 מערכת דמו טובה - יש מקום לשיפורים");
    } else if (demoScore >= 60) {
      console.log("🟡 מערכת דמו בסיסית - דרושים שיפורים");
    } else {
      console.log("🔴 מערכת דמו דורשת עבודה נוספת");
    }

    console.log(
      "\n🧠 להרצת הבדיקה שוב: node scripts/advancedDemoDataValidator.js"
    );
    console.log("═".repeat(55));
  }
}

// הרץ את הבדיקה
const validator = new AdvancedDemoDataValidator();
validator.run();
