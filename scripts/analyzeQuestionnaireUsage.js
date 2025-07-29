#!/usr/bin/env node

/**
 * @file scripts/analyzeQuestionnaireUsage.js
 * @brief בודק איזה קבצי שאלון נמצאים בשימוש בפועל
 */

const fs = require("fs");
const path = require("path");

// רשימת קבצי השאלון
const questionnaireFiles = [
  "questionnaireData.ts",
  "extendedQuestionnaireData.ts",
  "smartQuestionnaireData.ts",
];

// פונקציה לחיפוש קבצים
function findFiles(dir, pattern, results = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.startsWith(".") &&
      file !== "node_modules"
    ) {
      findFiles(filePath, pattern, results);
    } else if (
      stat.isFile() &&
      (file.endsWith(".ts") || file.endsWith(".tsx"))
    ) {
      results.push(filePath);
    }
  }

  return results;
}

// חיפוש השימוש
function analyzeUsage() {
  const srcFiles = findFiles("./src");
  const usage = {};

  // אתחול
  questionnaireFiles.forEach((file) => {
    usage[file] = {
      imports: [],
      references: [],
    };
  });

  // בדיקת כל קובץ
  srcFiles.forEach((filePath) => {
    try {
      const content = fs.readFileSync(filePath, "utf8");

      questionnaireFiles.forEach((questionnaireFile) => {
        const baseName = questionnaireFile.replace(".ts", "");

        // חיפוש imports
        const importRegex = new RegExp(`from.*${baseName}`, "g");
        const importMatches = content.match(importRegex);
        if (importMatches) {
          usage[questionnaireFile].imports.push({
            file: filePath,
            matches: importMatches,
          });
        }

        // חיפוש רפרנסים
        const refRegex = new RegExp(baseName, "g");
        const refMatches = content.match(refRegex);
        if (refMatches && refMatches.length > 0) {
          usage[questionnaireFile].references.push({
            file: filePath,
            count: refMatches.length,
          });
        }
      });
    } catch (err) {
      console.error(`Error reading ${filePath}:`, err.message);
    }
  });

  return usage;
}

// הרצה
console.log("🔍 מנתח שימוש בקבצי שאלון...\n");

const usage = analyzeUsage();

questionnaireFiles.forEach((file) => {
  console.log(`📋 ${file}:`);
  console.log(`  📥 Imports: ${usage[file].imports.length}`);
  console.log(`  🔗 References: ${usage[file].references.length}`);

  if (usage[file].imports.length > 0) {
    console.log("  Imported in:");
    usage[file].imports.forEach((imp) => {
      console.log(`    - ${imp.file}`);
    });
  }

  if (usage[file].references.length > 0) {
    console.log("  Referenced in:");
    usage[file].references.forEach((ref) => {
      console.log(`    - ${ref.file} (${ref.count} times)`);
    });
  }

  console.log("");
});

// סיכום
const totalUsage = questionnaireFiles
  .map((file) => ({
    file,
    total: usage[file].imports.length + usage[file].references.length,
  }))
  .sort((a, b) => b.total - a.total);

console.log("📊 סיכום לפי שימוש:");
totalUsage.forEach((item, index) => {
  const status = item.total > 0 ? "✅ בשימוש" : "❌ לא בשימוש";
  console.log(`${index + 1}. ${item.file} - ${item.total} uses ${status}`);
});
