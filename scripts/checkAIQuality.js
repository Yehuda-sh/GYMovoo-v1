/**
 * @file scripts/checkAIQuality.js
 * @brief כלי בדיקה לאיכות מערכת ה-AI המדעית
 * @dependencies Node.js, fs
 * @notes בדיקה שמערכת ה-AI עומדת בסטנדרטים מדעיים ומקצועיים של מאמן כושר
 * @recurring_errors לוודא שהמערכת לא נותנת ייעוץ רפואי ושומרת על בטיחות
 */

const fs = require("fs");
const path = require("path");

console.log("🤖 בודק איכות מערכת AI...\n");

// נתיבי קבצים
const AI_SERVICE_PATH = path.join(
  __dirname,
  "../src/services/scientificAIService.ts"
);
const WORKOUT_AI_PATH = path.join(__dirname, "../src/services/workoutAI.ts");
const EXERCISE_DB_PATH = path.join(
  __dirname,
  "../src/data/exerciseDatabase.ts"
);

let totalIssues = 0;
let criticalIssues = 0;
let aiQualityScore = 100;

// פונקציה לקריאת קובץ
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    console.error(`❌ שגיאה בקריאת קובץ: ${filePath}`);
    return null;
  }
}

// בדיקה 1: בטיחות ואתיקה רפואית
function checkMedicalSafety() {
  console.log("🏥 בודק בטיחות רפואית...");

  const content = readFile(AI_SERVICE_PATH);
  if (!content) return;

  // מילות מפתח שלא צריכות להופיע (ייעוץ רפואי)
  const prohibitedMedicalTerms = [
    "diagnose",
    "cure",
    "treat",
    "medication",
    "תרופה",
    "לרפא",
    "לטפל",
    "לאבחן",
  ];

  // מילות מפתח חיוביות שצריכות להופיע (בטיחות)
  const requiredSafetyTerms = [
    "doctor",
    "physician",
    "רופא",
    "safety",
    "בטיחות",
    "injury",
    "פציעה",
  ];

  console.log("   🚫 בודק מניעת ייעוץ רפואי...");
  prohibitedMedicalTerms.forEach((term) => {
    if (content.toLowerCase().includes(term.toLowerCase())) {
      console.error(`❌ מונח רפואי אסור: "${term}"`);
      criticalIssues++;
      aiQualityScore -= 15;
    }
  });

  console.log("   ✅ בודק מונחי בטיחות נדרשים...");
  let safetyTermsFound = 0;
  requiredSafetyTerms.forEach((term) => {
    if (content.toLowerCase().includes(term.toLowerCase())) {
      safetyTermsFound++;
    }
  });

  if (safetyTermsFound < 3) {
    console.warn("⚠️  לא מספיק מונחי בטיחות במערכת");
    totalIssues++;
    aiQualityScore -= 5;
  } else {
    console.log(`✅ ${safetyTermsFound} מונחי בטיחות נמצאו`);
  }

  // בדיקת הערות אזהרה
  if (
    content.includes("אזהרה") ||
    content.includes("warning") ||
    content.includes("הפסק מיד")
  ) {
    console.log("✅ הערות אזהרה קיימות");
  } else {
    console.warn("⚠️  חסרות הערות אזהרה");
    totalIssues++;
    aiQualityScore -= 5;
  }
}

// בדיקה 2: איכות האלגוריתם המדעי
function checkAlgorithmQuality() {
  console.log("\n🧠 בודק איכות אלגוריתם...");

  const content = readFile(AI_SERVICE_PATH);
  if (!content) return;

  // עקרונות מדעיים שצריכים להיות מיושמים
  const scientificPrinciples = [
    {
      name: "Progressive Overload",
      keywords: ["progression", "overload", "increase"],
    },
    { name: "Specificity", keywords: ["specific", "target", "goal"] },
    {
      name: "Individual Differences",
      keywords: ["individual", "personal", "adapt"],
    },
    { name: "Recovery", keywords: ["recovery", "rest", "התאוששות"] },
    { name: "Volume/Intensity", keywords: ["volume", "intensity", "נפח"] },
  ];

  scientificPrinciples.forEach((principle) => {
    const found = principle.keywords.some((keyword) =>
      content.toLowerCase().includes(keyword.toLowerCase())
    );

    if (found) {
      console.log(`✅ עקרון ${principle.name} מיושם`);
    } else {
      console.warn(`⚠️  עקרון ${principle.name} חסר`);
      totalIssues++;
      aiQualityScore -= 10;
    }
  });

  // בדיקת מורכבות אלגוריתם
  const complexityIndicators = [
    "filter",
    "score",
    "calculate",
    "priority",
    "weight",
  ];

  let complexityScore = 0;
  complexityIndicators.forEach((indicator) => {
    if (content.includes(indicator)) complexityScore++;
  });

  if (complexityScore >= 4) {
    console.log("✅ האלגוריתם מספיק מורכב ומתקדם");
  } else {
    console.warn("⚠️  האלגוריתם פשוט מדי - עלול להיות לא מדויק");
    totalIssues++;
    aiQualityScore -= 8;
  }
}

// בדיקה 3: התאמה לרמות שונות של משתמשים
function checkUserLevelAdaptation() {
  console.log("\n👥 בודק התאמה לרמות משתמשים...");

  const content = readFile(AI_SERVICE_PATH);
  if (!content) return;

  const userLevels = [
    "beginner",
    "intermediate",
    "advanced",
    "מתחיל",
    "בינוני",
    "מתקדם",
  ];

  let levelsSupported = 0;
  userLevels.forEach((level) => {
    if (content.toLowerCase().includes(level.toLowerCase())) {
      levelsSupported++;
    }
  });

  if (levelsSupported >= 4) {
    console.log("✅ תמיכה מלאה בכל רמות המשתמשים");
  } else {
    console.warn("⚠️  תמיכה חלקית ברמות משתמשים");
    totalIssues++;
    aiQualityScore -= 7;
  }

  // בדיקת התאמת עומס לפי גיל
  const ageAdaptations = content.match(/age.*modifier/gi) || [];
  if (ageAdaptations.length > 0) {
    console.log("✅ התאמת עומס לפי גיל קיימת");
  } else {
    console.warn("⚠️  אין התאמת עומס לפי גיל");
    totalIssues++;
    aiQualityScore -= 5;
  }
}

// בדיקה 4: מניעת פציעות
function checkInjuryPrevention() {
  console.log("\n🛡️ בודק מניעת פציעות...");

  const content = readFile(AI_SERVICE_PATH);
  if (!content) return;

  // פונקציות מניעת פציעות נדרשות
  const safetyFunctions = [
    "filterSafeExercises",
    "exerciseConflictsWithInjury",
    "generateSafetyNotes",
    "checkPreviousInjuries",
  ];

  let safetyFunctionsFound = 0;
  safetyFunctions.forEach((func) => {
    if (content.includes(func)) {
      safetyFunctionsFound++;
      console.log(`✅ פונקציית בטיחות: ${func}`);
    }
  });

  if (safetyFunctionsFound < 3) {
    console.error("❌ לא מספיק פונקציות בטיחות");
    criticalIssues++;
    aiQualityScore -= 20;
  }

  // בדיקת מפת פציעות
  if (content.includes("conflictMap") || content.includes("injuryMap")) {
    console.log("✅ מפת פציעות קיימת");
  } else {
    console.warn("⚠️  מפת פציעות חסרה");
    totalIssues++;
    aiQualityScore -= 10;
  }

  // בדיקת הוראות חימום
  if (
    content.includes("חימום") ||
    content.includes("warm") ||
    content.includes("warmup")
  ) {
    console.log("✅ הוראות חימום קיימות");
  } else {
    console.warn("⚠️  הוראות חימום חסרות");
    totalIssues++;
    aiQualityScore -= 8;
  }
}

// בדיקה 5: איכות המלצות תזונה וקלוריות
function checkNutritionQuality() {
  console.log("\n🥗 בודק איכות המלצות תזונה...");

  const content = readFile(AI_SERVICE_PATH);
  if (!content) return;

  // נוסחאות מדעיות
  if (
    content.includes("Mifflin") ||
    content.includes("BMR") ||
    content.includes("TDEE")
  ) {
    console.log("✅ נוסחאות מדעיות לחישוב קלוריות");
  } else {
    console.warn("⚠️  נוסחאות מדעיות חסרות");
    totalIssues++;
    aiQualityScore -= 8;
  }

  // המלצות חלבון
  if (
    content.includes("חלבון") ||
    content.includes("protein") ||
    content.includes("1.6")
  ) {
    console.log("✅ המלצות חלבון מבוססות מחקר");
  } else {
    console.warn("⚠️  המלצות חלבון חסרות");
    totalIssues++;
    aiQualityScore -= 5;
  }

  // אזהרות תזונתיות
  if (
    content.includes("אל תיתן עצות רפואיות") ||
    content.includes("התייעץ עם רופא")
  ) {
    console.log("✅ אזהרות תזונתיות מתאימות");
  } else {
    console.warn("⚠️  אזהרות תזונתיות חסרות");
    totalIssues++;
    aiQualityScore -= 7;
  }
}

// בדיקה 6: מגוון ואיכות תרגילים
function checkExerciseQuality() {
  console.log("\n💪 בודק מגוון ואיכות תרגילים...");

  const exerciseContent = readFile(EXERCISE_DB_PATH);
  if (!exerciseContent) {
    console.error("❌ לא ניתן לקרוא מאגר תרגילים");
    criticalIssues++;
    return;
  }

  // ספירת תרגילים
  const exerciseCount = (exerciseContent.match(/id:/g) || []).length;
  console.log(`📊 מספר תרגילים במאגר: ${exerciseCount}`);

  if (exerciseCount < 50) {
    console.warn("⚠️  מאגר תרגילים קטן מדי");
    totalIssues++;
    aiQualityScore -= 10;
  } else if (exerciseCount > 100) {
    console.log("✅ מאגר תרגילים עשיר ומגוון");
  }

  // בדיקת כיסוי קבוצות שרירים
  const muscleGroups = ["חזה", "גב", "רגליים", "כתפיים", "זרועות", "בטן"];
  let coveredGroups = 0;

  muscleGroups.forEach((group) => {
    if (exerciseContent.includes(group)) {
      coveredGroups++;
    }
  });

  if (coveredGroups === muscleGroups.length) {
    console.log("✅ כיסוי מלא של כל קבוצות השרירים");
  } else {
    console.warn(
      `⚠️  כיסוי חלקי: ${coveredGroups}/${muscleGroups.length} קבוצות שרירים`
    );
    totalIssues++;
    aiQualityScore -= 8;
  }
}

// בדיקה 7: חוויית משתמש ומוטיבציה
function checkUserExperience() {
  console.log("\n😊 בודק חוויית משתמש ומוטיבציה...");

  const content = readFile(AI_SERVICE_PATH);
  if (!content) return;

  // הודעות מוטיבציה
  if (
    content.includes("מוטיבציה") ||
    content.includes("motivational") ||
    content.includes("עידוד")
  ) {
    console.log("✅ מערכת מוטיבציה קיימת");
  } else {
    console.warn("⚠️  מערכת מוטיבציה חסרה");
    totalIssues++;
    aiQualityScore -= 5;
  }

  // התאמה אישית
  if (
    content.includes("personal") ||
    content.includes("אישי") ||
    content.includes("customize")
  ) {
    console.log("✅ התאמה אישית מתקדמת");
  } else {
    console.warn("⚠️  התאמה אישית בסיסית בלבד");
    totalIssues++;
    aiQualityScore -= 6;
  }

  // משוב למשתמש
  if (
    content.includes("feedback") ||
    content.includes("משוב") ||
    content.includes("progress")
  ) {
    console.log("✅ מערכת משוב למשתמש");
  } else {
    console.warn("⚠️  מערכת משוב חסרה");
    totalIssues++;
    aiQualityScore -= 7;
  }
}

// פונקציה לחישוב דירוג AI
function calculateAIRating() {
  let rating = "";
  let description = "";

  if (aiQualityScore >= 95) {
    rating = "🏆 מעולה";
    description = "מאמן AI ברמה מקצועית גבוהה";
  } else if (aiQualityScore >= 85) {
    rating = "🥇 טוב מאוד";
    description = "מאמן AI איכותי עם שיפורים קטנים";
  } else if (aiQualityScore >= 75) {
    rating = "🥈 טוב";
    description = "מאמן AI בסיסי עם צורך בשיפורים";
  } else if (aiQualityScore >= 60) {
    rating = "🥉 בינוני";
    description = "מאמן AI דורש שיפורים משמעותיים";
  } else {
    rating = "⚠️ חלש";
    description = "מאמן AI דורש פיתוח מחדש";
  }

  return { rating, description };
}

// פונקציה ראשית
function runAIQualityCheck() {
  console.log("🚀 מתחיל בדיקת איכות AI...\n");

  if (!fs.existsSync(AI_SERVICE_PATH)) {
    console.error("❌ קובץ שירות AI לא נמצא!");
    return;
  }

  checkMedicalSafety();
  checkAlgorithmQuality();
  checkUserLevelAdaptation();
  checkInjuryPrevention();
  checkNutritionQuality();
  checkExerciseQuality();
  checkUserExperience();

  const { rating, description } = calculateAIRating();

  console.log("\n" + "=".repeat(70));
  console.log("🤖 דוח איכות מערכת AI:");
  console.log(`📊 ציון איכות: ${aiQualityScore}/100`);
  console.log(`⭐ דירוג: ${rating}`);
  console.log(`📝 תיאור: ${description}`);
  console.log(`🚨 בעיות קריטיות: ${criticalIssues}`);
  console.log(`⚠️  בעיות כלליות: ${totalIssues}`);

  if (criticalIssues === 0 && aiQualityScore >= 85) {
    console.log("\n🎉 מערכת ה-AI מוכנה לשימוש מקצועי!");
    console.log("💪 המשתמשים יקבלו ייעוץ כושר איכותי ובטוח");
  } else if (criticalIssues === 0) {
    console.log("\n✅ מערכת ה-AI בסיסית תקינה");
    console.log("🔧 מומלץ לבצע שיפורים לפני שחרור");
  } else {
    console.log("\n❌ מערכת ה-AI דורשת תיקונים קריטיים");
    console.log("🛑 אל תשחרר לפני תיקון הבעיות הקריטיות");
  }

  console.log("=".repeat(70));
}

// הפעלת הבדיקה
runAIQualityCheck();
