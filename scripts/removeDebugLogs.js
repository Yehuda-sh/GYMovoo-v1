#!/usr/bin/env node

/**
 * @file scripts/removeDebugLogs.js
 * @brief מוחק לוגי דיבאג מכל הפרויקט עם אפשרויות מתאימות
 * @description סורק את כל הפרויקט ומציע להסיר console.log debug בלבד
 */

const fs = require("fs");
const path = require("path");

// רשימת תיקיות לסריקה
const SCAN_DIRS = ["src"];

// תבניות לוגים לא רצויים (debug בלבד)
const DEBUG_PATTERNS = [
  /console\.log\s*\(\s*["`']🔍/, // לוגי debug עם 🔍
  /console\.log\s*\(\s*["`']DEBUG/i, // לוגי DEBUG מפורשים
  /console\.log\s*\(\s*["`']Test/, // לוגי בדיקה
  /console\.log\s*\(\s*["`']TEMP/, // לוגים זמניים
  /console\.log\s*\(\s*["`']TODO/, // לוגי TODO
  /console\.log\([^)]*[Pp]assword/, // לוגי סיסמאות - בעיית אבטחה!
  /console\.log\s*\(\s*["`']\[FIELD\]/, // לוגי שדות פרטיים
  /console\.log\s*\(\s*["`']\[VALIDATE\]/, // לוגי ולידציה פרטיים
  /console\.log\s*\(\s*["`']\[ANIMATION\]/, // לוגי אנימציה לא חשובים
  /console\.log\s*\(\s*["`']🔐/, // לוגי אבטחה
  /console\.log\s*\(\s*["`'].*Pass.*["`']/, // כל לוג שיש בו Pass
  /console\.log\s*\(\s*["`']Inputs:/, // לוגי inputs שיכולים לחשוף סיסמאות
];

// תבניות לוגים שצריך לשמור (חשובים למשתמש)
const KEEP_PATTERNS = [
  /console\.(warn|error)\s*\(/, // אזהרות ושגיאות
  /console\.log\s*\(\s*["`'][⚠❌✅🎯]/u, // לוגים עם אייקונים חשובים
];

console.log("🧹 כלי הסרת לוגי דיבאג - משופר");
console.log("═".repeat(50));

let totalFiles = 0;
let modifiedFiles = 0;
let totalRemovedLines = 0;

// פונקציה לבדיקה האם שורה היא לוג דיבאג
function isDebugLog(line) {
  const trimmed = line.trim();

  // אם זה לוג שצריך לשמור - לא נמחק
  if (KEEP_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return false;
  }

  // אם זה לוג דיבאג ספציפי - נמחק
  if (DEBUG_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return true;
  }

  // בדיקה כללית של console.log פשוטים (בזהירות)
  if (
    trimmed.startsWith("console.log(") &&
    (trimmed.includes("Test") ||
      trimmed.includes("debug") ||
      trimmed.includes("DEBUG") ||
      trimmed.includes("🔍"))
  ) {
    return true;
  }

  return false;
}

// פונקציה לעיבוד קובץ יחיד
function processFile(filePath) {
  if (!fs.existsSync(filePath)) return false;

  const content = fs.readFileSync(filePath, "utf8");
  const lines = content.split("\n");
  const originalLineCount = lines.length;

  // סינון שורות
  const filteredLines = lines.filter((line) => !isDebugLog(line));

  // בדיקה אם היו שינויים
  const removedLines = originalLineCount - filteredLines.length;
  if (removedLines === 0) return false;

  // כתיבה חזרה לקובץ
  const newContent = filteredLines.join("\n");
  fs.writeFileSync(filePath, newContent, "utf8");

  console.log(
    `✅ ${path.relative(process.cwd(), filePath)}: הוסרו ${removedLines} שורות דיבאג`
  );
  totalRemovedLines += removedLines;
  return true;
}

// פונקציה לסריקת תיקייה רקורסיבית
function scanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      // רקורסיה לתיקיות
      scanDirectory(fullPath);
    } else if (
      entry.isFile() &&
      (entry.name.endsWith(".ts") || entry.name.endsWith(".tsx"))
    ) {
      // עיבוד קבצי TypeScript
      totalFiles++;
      if (processFile(fullPath)) {
        modifiedFiles++;
      }
    }
  }
}

// הרצת הסריקה
console.log("🔍 סורק קבצי TypeScript...\n");

SCAN_DIRS.forEach((dir) => {
  const fullDir = path.join(process.cwd(), dir);
  console.log(`📁 סורק תיקייה: ${dir}`);
  scanDirectory(fullDir);
});

// דוח סיכום
console.log("\n" + "═".repeat(50));
console.log("📊 דוח סיכום:");
console.log(`📁 קבצים שנסרקו: ${totalFiles}`);
console.log(`✏️  קבצים שעודכנו: ${modifiedFiles}`);
console.log(`🗑️  שורות דיבאג שהוסרו: ${totalRemovedLines}`);

if (totalRemovedLines > 0) {
  console.log("\n✅ ניקוי לוגי הדיבאג הושלם בהצלחה!");
  console.log("💡 שימו לב: לוגי אזהרות ושגיאות נשמרו");
  console.log("🔒 הוסרו לוגי סיסמאות - שיפור אבטחה!");
} else {
  console.log("\n🎯 לא נמצאו לוגי דיבאג להסרה");
}

process.exit(totalRemovedLines > 0 ? 0 : 1);
