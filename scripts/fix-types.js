#!/usr/bin/env node

/**
 * TypeScript Error Auto-Fixer
 * כלי אוטומציה לתיקון שגיאות TypeScript נפוצות
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class TypeScriptAutoFixer {
  constructor() {
    this.rootDir = process.cwd();
    this.srcDir = path.join(this.rootDir, "src");
    this.fixCount = 0;
    this.skippedCount = 0;
  }

  log(message, type = "info") {
    const colors = {
      info: "\x1b[36m",
      success: "\x1b[32m",
      warning: "\x1b[33m",
      error: "\x1b[31m",
      reset: "\x1b[0m",
    };
    console.log(
      `${colors[type]}[${type.toUpperCase()}]${colors.reset} ${message}`
    );
  }

  // קריאת קובץ
  readFile(filePath) {
    try {
      return fs.readFileSync(filePath, "utf8");
    } catch (error) {
      this.log(`Failed to read file: ${filePath}`, "error");
      return null;
    }
  }

  // כתיבת קובץ
  writeFile(filePath, content) {
    try {
      fs.writeFileSync(filePath, content, "utf8");
      return true;
    } catch (error) {
      this.log(`Failed to write file: ${filePath}`, "error");
      return false;
    }
  }

  // קבלת שגיאות TypeScript
  getTypeScriptErrors() {
    try {
      execSync("npx tsc --noEmit --pretty", {
        stdio: "pipe",
        encoding: "utf8",
      });
      return [];
    } catch (error) {
      const output = error.stdout
        ? error.stdout.toString()
        : error.stderr
          ? error.stderr.toString()
          : "";
      if (!output) {
        this.log("No TypeScript output captured", "warning");
        return [];
      }
      return this.parseTypeScriptErrors(output);
    }
  }

  // פירוק שגיאות TypeScript
  parseTypeScriptErrors(output) {
    const errors = [];
    const lines = output.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const match = line.match(/^(.+):(\d+):(\d+) - error TS(\d+): (.+)$/);

      if (match) {
        const [, file, lineNum, colNum, errorCode, message] = match;

        // קריאת השורה הבעייתית
        let problemLine = "";
        for (let j = i + 1; j < lines.length && lines[j].trim(); j++) {
          if (lines[j].match(/^\d+\s+/)) {
            problemLine = lines[j].replace(/^\d+\s+/, "").trim();
            break;
          }
        }

        errors.push({
          file: path.resolve(file),
          line: parseInt(lineNum),
          column: parseInt(colNum),
          code: errorCode,
          message,
          problemLine,
        });
      }
    }

    return errors;
  }

  // תיקוני טיפוסים אוטומטיים
  getAutomaticFixes() {
    return [
      // תיקון property שם שגוי
      {
        name: "Fix property name suggestions",
        pattern:
          /Property '(\w+)' does not exist on type '.*'\. Did you mean '(\w+)'\?/,
        fix: (content, error) => {
          const match = error.message.match(
            /Property '(\w+)' does not exist on type '.*'\. Did you mean '(\w+)'\?/
          );
          if (!match) return content;

          const [, wrongProp, correctProp] = match;
          const lines = content.split("\n");
          const lineIndex = error.line - 1;

          if (lines[lineIndex]) {
            const originalLine = lines[lineIndex];
            lines[lineIndex] = originalLine.replace(
              new RegExp(`\\b${wrongProp}\\b`, "g"),
              correctProp
            );
            if (lines[lineIndex] !== originalLine) {
              this.log(
                `Fixed property name: ${wrongProp} → ${correctProp} in ${error.file}:${error.line}`,
                "success"
              );
              this.fixCount++;
            }
            return lines.join("\n");
          }
          return content;
        },
      },

      // תיקון import שגוי
      {
        name: "Fix import suggestions",
        pattern:
          /has no exported member named '(\w+)'\. Did you mean '(\w+)'\?/,
        fix: (content, error) => {
          const match = error.message.match(
            /has no exported member named '(\w+)'\. Did you mean '(\w+)'\?/
          );
          if (!match) return content;

          const [, wrongImport, correctImport] = match;
          const newContent = content.replace(
            new RegExp(`\\b${wrongImport}\\b`, "g"),
            correctImport
          );

          if (newContent !== content) {
            this.log(
              `Fixed import: ${wrongImport} → ${correctImport} in ${error.file}:${error.line}`,
              "success"
            );
            this.fixCount++;
            return newContent;
          }

          return content;
        },
      },

      // הוספת optional chaining
      {
        name: "Add optional chaining for undefined properties",
        pattern: /'.*' is possibly 'undefined'/,
        fix: (content, error) => {
          const lines = content.split("\n");
          const lineIndex = error.line - 1;
          const line = lines[lineIndex];

          if (!line || line.includes("?.")) return content;

          // חיפוש דפוסים שצריכים optional chaining
          let newLine = line;
          let changed = false;

          // תבניות נפוצות שצריכות optional chaining
          const patterns = [
            // obj.prop
            /(\w+)\.(\w+)(?!\?)/g,
            // obj[key]
            /(\w+)\[([^\]]+)\](?!\?)/g,
          ];

          patterns.forEach((pattern) => {
            newLine = newLine.replace(pattern, (match, obj, prop) => {
              // בדיקה שזה לא כבר עם optional chaining
              if (
                match.includes("?.") ||
                obj === "console" ||
                obj === "JSON" ||
                obj === "Math"
              ) {
                return match;
              }
              changed = true;
              return prop.startsWith("[")
                ? `${obj}?.[${prop}]`
                : `${obj}?.${prop}`;
            });
          });

          if (changed) {
            lines[lineIndex] = newLine;
            this.log(
              `Added optional chaining in ${error.file}:${error.line}`,
              "success"
            );
            this.fixCount++;
            return lines.join("\n");
          }

          return content;
        },
      },

      // תיקון missing properties
      {
        name: "Add missing properties",
        pattern: /Property '(\w+)' does not exist on type/,
        fix: (content, error) => {
          const match = error.message.match(
            /Property '(\w+)' does not exist on type/
          );
          if (!match) return content;

          const [, missingProp] = match;
          const lines = content.split("\n");
          const lineIndex = error.line - 1;
          const line = lines[lineIndex];

          if (!line) return content;

          // תיקונים ספציפיים לנכסים חסרים
          const knownFixes = {
            airecommendations: "aiRecommendations",
            smartquestionnairedata: "questionnaireData",
            trainingstats: "trainingStats",
            questionnairedata: "questionnaireData",
          };

          if (knownFixes[missingProp]) {
            const newLine = line.replace(
              new RegExp(`\\b${missingProp}\\b`, "g"),
              knownFixes[missingProp]
            );

            if (newLine !== line) {
              lines[lineIndex] = newLine;
              this.log(
                `Fixed property: ${missingProp} → ${knownFixes[missingProp]} in ${error.file}:${error.line}`,
                "success"
              );
              this.fixCount++;
              return lines.join("\n");
            }
          }

          return content;
        },
      },

      // תיקון undefined checks
      {
        name: "Add undefined checks",
        pattern: /Argument of type '.*undefined.*' is not assignable/,
        fix: (content, error) => {
          const lines = content.split("\n");
          const lineIndex = error.line - 1;
          const line = lines[lineIndex];

          if (!line) return content;

          // חיפוש קריאות לפונקציות עם ארגומנטים שעלולים להיות undefined
          let newLine = line;

          // תיקון Object.keys עם undefined
          if (
            line.includes("Object.keys(") &&
            error.message.includes("undefined")
          ) {
            newLine = line.replace(
              /Object\.keys\(([^)]+)\)/g,
              "Object.keys($1 || {})"
            );
          }

          // תיקון Date constructor עם undefined
          if (
            line.includes("new Date(") &&
            error.message.includes("undefined")
          ) {
            newLine = line.replace(/new Date\(([^)]+)\)/g, "new Date($1 || 0)");
          }

          if (newLine !== line) {
            lines[lineIndex] = newLine;
            this.log(
              `Added undefined check in ${error.file}:${error.line}`,
              "success"
            );
            this.fixCount++;
            return lines.join("\n");
          }

          return content;
        },
      },
    ];
  }

  // יישום תיקון אוטומטי
  applyAutomaticFixes() {
    this.log("Starting automatic TypeScript fixes...", "info");

    const errors = this.getTypeScriptErrors();
    this.log(`Found ${errors.length} TypeScript errors`, "info");

    if (errors.length === 0) {
      this.log("No TypeScript errors found!", "success");
      return;
    }

    const fixes = this.getAutomaticFixes();
    const processedFiles = new Set();

    // קיבוץ שגיאות לפי קובץ
    const errorsByFile = {};
    errors.forEach((error) => {
      if (!errorsByFile[error.file]) {
        errorsByFile[error.file] = [];
      }
      errorsByFile[error.file].push(error);
    });

    // יישום תיקונים לכל קובץ
    Object.entries(errorsByFile).forEach(([filePath, fileErrors]) => {
      let content = this.readFile(filePath);
      if (!content) return;

      let originalContent = content;

      fileErrors.forEach((error) => {
        fixes.forEach((fix) => {
          if (fix.pattern.test(error.message)) {
            content = fix.fix.call(
              { pattern: fix.pattern, fixCount: this.fixCount, log: this.log },
              content,
              error
            );
          }
        });
      });

      if (content !== originalContent) {
        this.writeFile(filePath, content);
        this.log(
          `Fixed file: ${path.relative(this.rootDir, filePath)}`,
          "success"
        );
        processedFiles.add(filePath);
      }
    });

    this.log(
      `Applied ${this.fixCount} automatic fixes to ${processedFiles.size} files`,
      "success"
    );

    // בדיקה חוזרת
    setTimeout(() => {
      this.log("Checking remaining errors...", "info");
      const remainingErrors = this.getTypeScriptErrors();
      this.log(
        `Remaining errors: ${remainingErrors.length}`,
        remainingErrors.length === 0 ? "success" : "warning"
      );

      if (remainingErrors.length > 0) {
        this.log(
          "Run the script again or fix remaining errors manually",
          "info"
        );
      }
    }, 1000);
  }

  // הרצת הכלי
  run() {
    this.log("TypeScript Auto-Fixer Starting...", "info");
    this.log(`Working directory: ${this.rootDir}`, "info");

    this.applyAutomaticFixes();
  }
}

// הרצת הכלי
if (require.main === module) {
  const fixer = new TypeScriptAutoFixer();
  fixer.run();
}

module.exports = TypeScriptAutoFixer;
