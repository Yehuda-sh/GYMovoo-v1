#!/usr/bin/env node

/**
 * TypeScript Error Summary Tool
 * כלי לסיכום מצב השגיאות ויצירת דוח מסכם
 */

const { execSync } = require("child_process");
const fs = require("fs");

function getErrorSummary() {
  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" });
    return { totalErrors: 0, errorsByFile: {} };
  } catch (error) {
    const output = error.stdout?.toString() || error.stderr?.toString() || "";
    return parseErrorSummary(output);
  }
}

function parseErrorSummary(output) {
  const lines = output.split("\n");
  const errorsByFile = {};
  let totalErrors = 0;

  // Parse individual errors
  for (const line of lines) {
    const match = line.match(/^(.+):(\d+):(\d+) - error TS(\d+): (.+)$/);
    if (match) {
      const [, filePath, lineNum, colNum, errorCode, message] = match;
      const fileName = filePath.split(/[\/\\]/).pop();

      if (!errorsByFile[fileName]) {
        errorsByFile[fileName] = [];
      }

      errorsByFile[fileName].push({
        line: parseInt(lineNum),
        column: parseInt(colNum),
        code: errorCode,
        message:
          message.substring(0, 100) + (message.length > 100 ? "..." : ""),
      });

      totalErrors++;
    }
  }

  // Parse summary line
  const summaryMatch = output.match(/Found (\d+) errors in (\d+) files?\./);
  if (summaryMatch) {
    totalErrors = parseInt(summaryMatch[1]);
  }

  return { totalErrors, errorsByFile };
}

function generateReport() {
  console.log("🔍 Analyzing TypeScript errors...\n");

  const { totalErrors, errorsByFile } = getErrorSummary();

  console.log("📊 === TypeScript Error Summary ===");
  console.log(`🎯 Total Errors: ${totalErrors}`);
  console.log(`📁 Files with errors: ${Object.keys(errorsByFile).length}`);
  console.log("");

  if (totalErrors === 0) {
    console.log("🎉 Congratulations! No TypeScript errors found!");
    return;
  }

  // Sort files by error count
  const sortedFiles = Object.entries(errorsByFile).sort(
    ([, a], [, b]) => b.length - a.length
  );

  console.log("📋 === Errors by File ===");
  sortedFiles.forEach(([fileName, errors]) => {
    console.log(`\n📁 ${fileName} (${errors.length} errors)`);

    // Group errors by type
    const errorTypes = {};
    errors.forEach((error) => {
      const type = categorizeError(error.message);
      if (!errorTypes[type]) errorTypes[type] = 0;
      errorTypes[type]++;
    });

    Object.entries(errorTypes).forEach(([type, count]) => {
      console.log(`   • ${type}: ${count} error${count > 1 ? "s" : ""}`);
    });
  });

  console.log("\n🎯 === Next Steps ===");
  console.log("Files that need the most attention:");
  sortedFiles.slice(0, 3).forEach(([fileName, errors], index) => {
    console.log(`${index + 1}. ${fileName} - ${errors.length} errors`);
  });

  console.log("\n🛠️  === Available Tools ===");
  console.log("• Run: node scripts/manual-fix.js - for common fixes");
  console.log("• Run: npx tsc --noEmit --pretty - for detailed error list");
  console.log("• Focus on files with most errors first");

  // Progress tracking
  const progressLog = {
    timestamp: new Date().toISOString(),
    totalErrors,
    fileCount: Object.keys(errorsByFile).length,
    topErrors: sortedFiles.slice(0, 5).map(([file, errors]) => ({
      file,
      count: errors.length,
    })),
  };

  try {
    fs.writeFileSync(
      "ts-error-progress.json",
      JSON.stringify(progressLog, null, 2)
    );
    console.log("\n📝 Progress saved to ts-error-progress.json");
  } catch (error) {
    // Silent fail
  }
}

function categorizeError(message) {
  if (message.includes("Property") && message.includes("does not exist")) {
    return "Missing Properties";
  }
  if (
    message.includes("possibly undefined") ||
    message.includes("possibly null")
  ) {
    return "Undefined/Null Safety";
  }
  if (message.includes("not assignable to parameter")) {
    return "Type Compatibility";
  }
  if (message.includes("has no exported member")) {
    return "Import/Export Issues";
  }
  if (message.includes("Argument of type")) {
    return "Function Arguments";
  }
  return "Other";
}

// Run the report
generateReport();
