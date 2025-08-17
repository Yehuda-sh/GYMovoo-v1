/**
 * @file validateNoLegacyStorage.js
 * @brief 🔍 כלי בדיקה לוידוא שאין חזרה לפתרונות ישנים
 * @description בודק שאין שימוש בשרת מקומי, משתני סביבה ישנים, או גישה ישירה למבני נתונים
 * @created 2025-08-17 (מהשיחה הנוכחית - תיעוד מעודכן)
 * @usage node scripts/validateNoLegacyStorage.js
 * @patterns EXPO_PUBLIC_STORAGE_BASE_URL, localhost URLs, direct data access
 * @scope Prevents regression to deprecated local server and direct data patterns
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
// 🚨 דפוסים אסורים - מצביעים על שימוש במערכות ישנות
const PATTERNS = [
  /EXPO_PUBLIC_STORAGE_BASE_URL/, // משתנה סביבה ישן לשרת מקומי
  /10\.0\.2\.2:3001/, // כתובת אמולטור לשרת מקומי
  /localhost:3001/, // שרת מקומי
  /http:\/\/localhost/, // כל שרת מקומי HTTP
  /smartQuestionnaireData\.answers/, // גישה ישירה (camelCase) - יש להשתמש בכלי מיפוי
  /smartquestionnairedata\.answers/, // גישה ישירה (lowercase) - יש להשתמש בכלי מיפוי
  /getUsersFromLocalFile/, // פונקציות API מקומיות
  /localServerUrl/, // הפניות לשרת מקומי
  /express.*cors.*body-parser/, // imports של שרת Express (רק אם בשורה אחת)
];

const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".md"]);
const ignoreDirs = ["node_modules", ".git", "android", "ios"];
const ignoreFiles = new Set([
  path.join(ROOT, "scripts", "validateNoLegacyStorage.js").toLowerCase(),
  path.join(ROOT, "src", "services", "supabase", "storage.ts").toLowerCase(), // הערות היסטוריות הוסרו כבר
  path.join(ROOT, "storage", "server.js").toLowerCase(), // שרת מקומי deprecated - מסומן למחיקה
]);

let violations = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (ignoreDirs.includes(entry)) continue;
      walk(full);
    } else {
      const ext = path.extname(entry);
      if (ignoreFiles.has(full.toLowerCase())) continue;
      if (!EXTS.has(ext)) continue;
      const content = fs.readFileSync(full, "utf8");
      const isMarkdown = ext === ".md";
      for (const p of PATTERNS) {
        if (p.test(content)) {
          if (isMarkdown) {
            // בדוק אם זה דוח היסטורי או קובץ מיועד למחיקה
            const fileName = path.basename(full);
            const isReportFile =
              fileName.includes("REPORT") ||
              fileName.includes("FIX") ||
              fileName.includes("FIXES") ||
              full.includes("docs/reports/") ||
              fileName.includes("SYSTEM_FLOW") ||
              fileName.includes("AUTOMATION");
            const isHistoricalReport =
              fileName.includes("2025-01") ||
              fileName.includes("2024-") ||
              /REPORT.*2025-01|2024-/i.test(content) ||
              content.includes("דוח אופטימיזציה") ||
              content.includes("OPTIMIZATION_REPORT") ||
              isReportFile;
            const isMarkedAsRemoved =
              /נמחק|הוסר|removed|deprecated|ללא.*EXPO_PUBLIC_STORAGE_BASE_URL|אין צורך עוד.*EXPO_PUBLIC_STORAGE_BASE_URL/i.test(
                content
              );

            if (isHistoricalReport || isMarkedAsRemoved) {
              violations.push({
                file: full,
                pattern: p.toString(),
                level: "warn",
                note: isHistoricalReport ? "דוח היסטורי" : "מסומן כמוסר",
              });
            } else {
              violations.push({
                file: full,
                pattern: p.toString(),
                level: "error",
                note: "מסמך עדכני עם דפוס אסור",
              });
            }
          } else {
            violations.push({
              file: full,
              pattern: p.toString(),
              level:
                /smartquestionnairedata\.answers|smartQuestionnaireData\.answers/.test(
                  p.toString()
                )
                  ? "error"
                  : "error",
            });
          }
        }
      }
    }
  }
}

walk(ROOT);

const errors = violations.filter((v) => v.level === "error");
const warns = violations.filter((v) => v.level === "warn");

if (errors.length) {
  console.error("❌ נמצאו אזכורים אסורים בקוד:");
  for (const v of errors) {
    const note = v.note ? ` (${v.note})` : "";
    console.error(` - ${path.relative(ROOT, v.file)} (${v.pattern})${note}`);
  }
  console.error("\n💡 יש לעדכן/להסיר את הדפוסים האסורים או לסמן כהיסטוריים");
  process.exit(1);
} else {
  if (warns.length) {
    console.log("⚠️  דוחות היסטוריים עם דפוסים ישנים (מותר):");
    for (const v of warns) {
      const note = v.note ? ` (${v.note})` : "";
      console.log(` - ${path.relative(ROOT, v.file)} (${v.pattern})${note}`);
    }
    console.log("\n📋 דוחות אלו מכילים הפניות לקוד ישן לצורך תיעוד בלבד.");
  }
  console.log("✅ אין אזכורים אסורים בקוד מקור פעיל.");
}
