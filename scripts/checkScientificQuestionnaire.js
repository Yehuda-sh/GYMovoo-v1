/**
 * @file scripts/checkScientificQuestionnaire.js
 * @brief כלי בדיקה לשאלון המדעי החדש - וודא איכות ועקביות
 * @dependencies Node.js, fs
 * @notes בדיקה שהשאלון החדש עומד בסטנדרטים מדעיים וטכניים
 * @recurring_errors לוודא שכל השאלות רגישות ומקצועיות
 */

const fs = require("fs");
const path = require("path");

console.log("🔬 בודק שאלון מדעי...\n");

// נתיבי קבצים
const SCIENTIFIC_QUESTIONNAIRE_PATH = path.join(
  __dirname,
  "../src/data/scientificQuestionnaireData.ts"
);
const AI_SERVICE_PATH = path.join(
  __dirname,
  "../src/services/scientificAIService.ts"
);

let totalIssues = 0;
let criticalIssues = 0;

// פונקציה לקריאת קובץ
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`❌ שגיאה בקריאת קובץ: ${filePath}`);
    return null;
  }
}

// בדיקה 1: קיום הקבצים
function checkFilesExist() {
  console.log("📂 בודק קיום קבצים...");

  if (!fs.existsSync(SCIENTIFIC_QUESTIONNAIRE_PATH)) {
    console.error("❌ קובץ השאלון המדעי לא נמצא!");
    criticalIssues++;
    return false;
  }

  if (!fs.existsSync(AI_SERVICE_PATH)) {
    console.error("❌ קובץ שירות ה-AI המדעי לא נמצא!");
    criticalIssues++;
    return false;
  }

  console.log("✅ כל הקבצים נמצאו");
  return true;
}

// בדיקה 2: איכות השאלות
function checkQuestionQuality() {
  console.log("\n🤔 בודק איכות שאלות...");

  const content = readFile(SCIENTIFIC_QUESTIONNAIRE_PATH);
  if (!content) return;

  const issues = [];

  // בדיקת מילות מפתח רגישות
  const sensitiveWords = ["משקל", "גיל", "מגדר", "גוף"];
  const inappropriateTerms = ["שמן", "רזה", "זקן", "צעיר"];

  sensitiveWords.forEach((word) => {
    if (content.includes(word)) {
      // בדוק אם המילה מופיעה בהקשר רגיש
      const lines = content.split("\n");
      lines.forEach((line, index) => {
        if (line.includes(word) && line.includes("question:")) {
          console.log(`⚠️  מילה רגישה "${word}" בשורה ${index + 1}`);
          console.log(`   📝 ${line.trim()}`);
        }
      });
    }
  });

  // בדיקת מונחים לא מתאימים
  inappropriateTerms.forEach((term) => {
    if (content.includes(term)) {
      console.error(`❌ מונח לא מתאים: "${term}"`);
      criticalIssues++;
    }
  });

  // בדיקת הסברים לשאלות
  const explanationMatches = content.match(/explanation:/g);
  const questionMatches = content.match(/question:/g);

  if (!explanationMatches || !questionMatches) {
    console.error("❌ לא נמצאו שאלות או הסברים");
    criticalIssues++;
    return;
  }

  if (explanationMatches.length !== questionMatches.length) {
    console.error(
      `❌ אי-התאמה: ${questionMatches.length} שאלות אבל ${explanationMatches.length} הסברים`
    );
    totalIssues++;
  } else {
    console.log(`✅ ${questionMatches.length} שאלות עם הסברים מלאים`);
  }

  // בדיקת רמות רגישות
  const sensitivityLevels = content.match(/sensitivity: ['"](\w+)['"]/g);
  if (sensitivityLevels) {
    const highSensitivityCount = sensitivityLevels.filter((s) =>
      s.includes("high")
    ).length;
    console.log(`🔍 ${highSensitivityCount} שאלות ברגישות גבוהה`);

    if (highSensitivityCount === 0) {
      console.warn("⚠️  אין שאלות ברגישות גבוהה - זה חשוד");
      totalIssues++;
    }
  }
}

// בדיקה 3: עקביות בין שאלון ל-AI
function checkAIConsistency() {
  console.log("\n🤖 בודק עקביות עם מערכת AI...");

  const questionnaireContent = readFile(SCIENTIFIC_QUESTIONNAIRE_PATH);
  const aiContent = readFile(AI_SERVICE_PATH);

  if (!questionnaireContent || !aiContent) return;

  // שדות שצריכים להיות קיימים ב-AI
  const requiredFields = [
    "ageRange",
    "fitnessExperience",
    "primaryGoal",
    "availableDays",
    "sessionDuration",
    "availableEquipment",
  ];

  requiredFields.forEach((field) => {
    if (!aiContent.includes(field)) {
      console.error(`❌ שדה ${field} חסר במערכת AI`);
      criticalIssues++;
    } else {
      console.log(`✅ שדה ${field} נמצא במערכת AI`);
    }
  });

  // בדיקת פונקציות בטיחות
  const safetyFunctions = [
    "filterSafeExercises",
    "exerciseConflictsWithInjury",
    "generateSafetyNotes",
    "calculateProgression",
  ];

  safetyFunctions.forEach((func) => {
    if (!aiContent.includes(func)) {
      console.error(`❌ פונקציית בטיחות ${func} חסרה`);
      criticalIssues++;
    } else {
      console.log(`✅ פונקציית בטיחות ${func} קיימת`);
    }
  });
}

// בדיקה 4: כיסוי מדעי
function checkScientificCoverage() {
  console.log("\n🔬 בודק כיסוי מדעי...");

  const content = readFile(SCIENTIFIC_QUESTIONNAIRE_PATH);
  if (!content) return;

  // נושאים מדעיים שצריכים להיות מכוסים
  const scientificTopics = [
    "progressive overload",
    "recovery",
    "heart_rate",
    "bmr",
    "compound",
    "isolation",
    "periodization",
  ];

  const aiContent = readFile(AI_SERVICE_PATH);

  scientificTopics.forEach((topic) => {
    const topicFound =
      aiContent &&
      (aiContent.toLowerCase().includes(topic.replace("_", " ")) ||
        aiContent.toLowerCase().includes(topic));

    if (topicFound) {
      console.log(`✅ נושא מדעי: ${topic}`);
    } else {
      console.warn(`⚠️  נושא מדעי חסר: ${topic}`);
      totalIssues++;
    }
  });
}

// בדיקה 5: נגישות ו-UX
function checkAccessibility() {
  console.log("\n♿ בודק נגישות ו-UX...");

  const content = readFile(SCIENTIFIC_QUESTIONNAIRE_PATH);
  if (!content) return;

  // בדיקת שאלות אופציונליות
  const optionalQuestions = content.match(/optional\??\s*:\s*true/g);
  if (optionalQuestions) {
    console.log(
      `✅ ${optionalQuestions.length} שאלות אופציונליות (גמישות למשתמש)`
    );
  } else {
    console.warn("⚠️  אין שאלות אופציונליות - עלול להיות מאיים");
    totalIssues++;
  }

  // בדיקת הודעות עידוד
  if (content.includes("encouragingMessages")) {
    console.log("✅ הודעות עידוד קיימות");
  } else {
    console.error("❌ הודעות עידוד חסרות");
    totalIssues++;
  }

  // בדיקת איקונים ותיוגים
  if (content.includes("icon:") && content.includes("description:")) {
    console.log("✅ איקונים ותיאורים לקטגוריות");
  } else {
    console.warn("⚠️  חסרים איקונים או תיאורים לקטגוריות");
    totalIssues++;
  }
}

// בדיקה 6: תקינות טכנית
function checkTechnicalValidity() {
  console.log("\n⚙️ בודק תקינות טכנית...");

  const content = readFile(SCIENTIFIC_QUESTIONNAIRE_PATH);
  if (!content) return;

  // בדיקת סוגרים ופסיקים
  const openBraces = (content.match(/{/g) || []).length;
  const closeBraces = (content.match(/}/g) || []).length;
  const openBrackets = (content.match(/\[/g) || []).length;
  const closeBrackets = (content.match(/\]/g) || []).length;

  if (openBraces !== closeBraces) {
    console.error(
      `❌ אי-התאמה בסוגריים: ${openBraces} פתיחה, ${closeBraces} סגירה`
    );
    criticalIssues++;
  } else {
    console.log("✅ סוגריים מאוזנים");
  }

  if (openBrackets !== closeBrackets) {
    console.error(
      `❌ אי-התאמה בסוגריים מרובעים: ${openBrackets} פתיחה, ${closeBrackets} סגירה`
    );
    criticalIssues++;
  } else {
    console.log("✅ סוגריים מרובעים מאוזנים");
  }

  // בדיקת ייבואים ויצואים
  if (content.includes("export") && content.includes("interface")) {
    console.log("✅ יצואים וממשקים תקינים");
  } else {
    console.error("❌ בעיות ביצואים או ממשקים");
    criticalIssues++;
  }
}

// פונקציה ראשית
function runAllChecks() {
  console.log("🚀 מתחיל בדיקות שאלון מדעי...\n");

  if (!checkFilesExist()) {
    console.log("\n❌ בדיקות הופסקו בגלל קבצים חסרים");
    return;
  }

  checkQuestionQuality();
  checkAIConsistency();
  checkScientificCoverage();
  checkAccessibility();
  checkTechnicalValidity();

  console.log("\n" + "=".repeat(60));
  console.log("📊 סיכום בדיקות:");
  console.log(`🚨 בעיות קריטיות: ${criticalIssues}`);
  console.log(`⚠️  בעיות כלליות: ${totalIssues}`);

  if (criticalIssues === 0 && totalIssues === 0) {
    console.log("🎉 השאלון המדעי עובר את כל הבדיקות!");
    console.log("✨ מוכן לשימוש במאמן AI מקצועי");
  } else if (criticalIssues === 0) {
    console.log("✅ השאלון בסיסית תקין, יש כמה שיפורים קטנים");
  } else {
    console.log("❌ יש בעיות קריטיות שדורשות תיקון מיידי");
  }

  console.log("=".repeat(60));
}

// הפעלת הבדיקות
runAllChecks();
