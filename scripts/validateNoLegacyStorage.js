/**
 * בודק שאין חזרה לשרת מקומי / משתנה EXPO_PUBLIC_STORAGE_BASE_URL בקבצי קוד.
 * הרצה: node scripts/validateNoLegacyStorage.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const PATTERNS = [
  /EXPO_PUBLIC_STORAGE_BASE_URL/,
  /10\.0\.2\.2:3001/,
  /localhost:3001/,
  /smartQuestionnaireData\.answers/, // גישה ישירה (camelCase) - יש להשתמש בכלי מיפוי
  /smartquestionnairedata\.answers/, // גישה ישירה (lowercase) - יש להשתמש בכלי מיפוי
];

const EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".md"]);
const ignoreDirs = ["node_modules", ".git", "android", "ios"];
const ignoreFiles = new Set([
  path.join(ROOT, "scripts", "validateNoLegacyStorage.js").toLowerCase(),
  path.join(ROOT, "src", "services", "supabase", "storage.ts").toLowerCase(), // הערות היסטוריות הוסרו כבר
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
            if (!/נמחק|הוסר|removed/.test(content)) {
              violations.push({
                file: full,
                pattern: p.toString(),
                level: "warn",
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
    console.error(` - ${v.file} (${v.pattern})`);
  }
  process.exit(1);
} else {
  if (warns.length) {
    console.log("⚠️  רק אזכורים היסטוריים ב-Markdown (תקין):");
    for (const v of warns) {
      console.log(` - ${v.file} (${v.pattern})`);
    }
  }
  console.log("✅ אין אזכורים אסורים בקוד מקור.");
}
