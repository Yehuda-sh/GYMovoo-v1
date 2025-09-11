#!/usr/bin/env node

/**
 * Advanced TypeScript Error Fixer
 * כלי מתקדם לתיקון שגיאות TypeScript ספציפיות לפרויקט
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// רשימת תיקונים אוטומטיים לפי דפוסי שגיאות נפוצות
const AUTO_FIXES = [
  {
    name: "Fix property name typos",
    errorPattern:
      /Property '(\w+)' does not exist on type '.*'\. Did you mean '(\w+)'\?/,
    fix: (content, match, filePath, lineNum) => {
      const [, wrongProp, correctProp] = match;
      const lines = content.split("\n");
      const lineIndex = lineNum - 1;

      if (lines[lineIndex]) {
        const originalLine = lines[lineIndex];
        lines[lineIndex] = originalLine.replace(
          new RegExp(`\\b${wrongProp}\\b`, "g"),
          correctProp
        );

        if (lines[lineIndex] !== originalLine) {
          console.log(
            `✅ Fixed property: ${wrongProp} → ${correctProp} in ${path.basename(filePath)}:${lineNum}`
          );
          return lines.join("\n");
        }
      }
      return content;
    },
  },

  {
    name: "Fix import errors",
    errorPattern:
      /has no exported member named '(\w+)'\. Did you mean '(\w+)'\?/,
    fix: (content, match, filePath, lineNum) => {
      const [, wrongImport, correctImport] = match;
      const newContent = content.replace(
        new RegExp(`\\b${wrongImport}\\b`, "g"),
        correctImport
      );

      if (newContent !== content) {
        console.log(
          `✅ Fixed import: ${wrongImport} → ${correctImport} in ${path.basename(filePath)}`
        );
        return newContent;
      }
      return content;
    },
  },

  {
    name: "Add undefined safety to Object.keys",
    errorPattern:
      /Argument of type '.* \| undefined' is not assignable to parameter of type/,
    linePattern: /Object\.keys\(/,
    fix: (content, match, filePath, lineNum) => {
      const lines = content.split("\n");
      const lineIndex = lineNum - 1;
      const line = lines[lineIndex];

      if (line && line.includes("Object.keys(")) {
        const newLine = line.replace(
          /Object\.keys\(([^)]+)\)/g,
          "Object.keys($1 || {})"
        );

        if (newLine !== line) {
          lines[lineIndex] = newLine;
          console.log(
            `✅ Added undefined safety to Object.keys in ${path.basename(filePath)}:${lineNum}`
          );
          return lines.join("\n");
        }
      }
      return content;
    },
  },

  {
    name: "Add optional chaining for undefined properties",
    errorPattern: /'.*' is possibly 'undefined'/,
    fix: (content, match, filePath, lineNum) => {
      const lines = content.split("\n");
      const lineIndex = lineNum - 1;
      const line = lines[lineIndex];

      if (!line || line.includes("?.")) return content;

      // תבניות נפוצות שצריכות optional chaining
      let newLine = line;
      let changed = false;

      // obj.sets.map → obj.sets?.map
      if (line.includes(".sets.") && !line.includes(".sets?.")) {
        newLine = newLine.replace(/\.sets\./g, ".sets?.");
        changed = true;
      }

      // exercise.sets[index] → exercise.sets?.[index]
      if (line.includes(".sets[") && !line.includes(".sets?.[")) {
        newLine = newLine.replace(/\.sets\[/g, ".sets?.[");
        changed = true;
      }

      if (changed) {
        lines[lineIndex] = newLine;
        console.log(
          `✅ Added optional chaining in ${path.basename(filePath)}:${lineNum}`
        );
        return lines.join("\n");
      }

      return content;
    },
  },

  {
    name: "Fix Date constructor with string/Date union",
    errorPattern:
      /Property 'toISOString' does not exist on type 'string \| Date'/,
    fix: (content, match, filePath, lineNum) => {
      const lines = content.split("\n");
      const lineIndex = lineNum - 1;
      const line = lines[lineIndex];

      if (line && line.includes(".toISOString()")) {
        // Convert string | Date to always Date
        const newLine = line.replace(
          /(\w+)\.toISOString\(\)/g,
          '(typeof $1 === "string" ? new Date($1) : $1).toISOString()'
        );

        if (newLine !== line) {
          lines[lineIndex] = newLine;
          console.log(
            `✅ Fixed Date.toISOString in ${path.basename(filePath)}:${lineNum}`
          );
          return lines.join("\n");
        }
      }
      return content;
    },
  },

  {
    name: "Add missing properties to types",
    errorPattern: /Property '(\w+)' does not exist on type/,
    knownFixes: {
      airecommendations: "aiRecommendations",
      weight: "weight as number",
      reps: "reps as number",
      id: 'id || "unknown"',
      category: 'category || "Unknown"',
      primaryMuscles: 'primaryMuscles || ["Unknown"]',
      equipment: 'equipment || "Unknown"',
      muscleGroup: "category",
    },
    fix: (content, match, filePath, lineNum) => {
      const propMatch = match[0].match(
        /Property '(\w+)' does not exist on type/
      );
      if (!propMatch) return content;

      const missingProp = propMatch[1];
      const lines = content.split("\n");
      const lineIndex = lineNum - 1;
      const line = lines[lineIndex];

      if (!line) return content;

      const fix = AUTO_FIXES[5].knownFixes[missingProp];
      if (fix) {
        let newLine;
        if (fix.includes(" || ")) {
          // Simple fallback fix
          newLine = line.replace(new RegExp(`\\b${missingProp}\\b`, "g"), fix);
        } else if (fix.includes(" as ")) {
          // Type assertion fix
          newLine = line.replace(new RegExp(`\\b${missingProp}\\b`, "g"), fix);
        } else {
          // Simple replacement
          newLine = line.replace(new RegExp(`\\b${missingProp}\\b`, "g"), fix);
        }

        if (newLine !== line) {
          lines[lineIndex] = newLine;
          console.log(
            `✅ Fixed missing property: ${missingProp} → ${fix} in ${path.basename(filePath)}:${lineNum}`
          );
          return lines.join("\n");
        }
      }

      return content;
    },
  },
];

function getTypeScriptErrors() {
  try {
    execSync("npx tsc --noEmit", { stdio: "pipe" });
    return [];
  } catch (error) {
    const output = error.stdout?.toString() || error.stderr?.toString() || "";
    return parseErrors(output);
  }
}

function parseErrors(output) {
  const errors = [];
  const lines = output.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(.+):(\d+):(\d+) - error TS\d+: (.+)$/);

    if (match) {
      const [, file, lineNum, colNum, message] = match;
      errors.push({
        file: path.resolve(file),
        line: parseInt(lineNum),
        column: parseInt(colNum),
        message,
      });
    }
  }

  return errors;
}

function applyFixes() {
  console.log("🔧 Starting TypeScript Auto-Fixer...");

  const errors = getTypeScriptErrors();
  console.log(`📊 Found ${errors.length} TypeScript errors`);

  if (errors.length === 0) {
    console.log("✅ No errors found!");
    return;
  }

  const fileChanges = new Map();
  let fixCount = 0;

  // Group errors by file
  const errorsByFile = new Map();
  errors.forEach((error) => {
    if (!errorsByFile.has(error.file)) {
      errorsByFile.set(error.file, []);
    }
    errorsByFile.get(error.file).push(error);
  });

  // Process each file
  errorsByFile.forEach((fileErrors, filePath) => {
    try {
      let content = fs.readFileSync(filePath, "utf8");
      const originalContent = content;

      fileErrors.forEach((error) => {
        AUTO_FIXES.forEach((fixRule) => {
          const match = error.message.match(fixRule.errorPattern);
          if (match) {
            // Check line pattern if specified
            if (fixRule.linePattern) {
              const lines = content.split("\n");
              const lineIndex = error.line - 1;
              if (
                !lines[lineIndex] ||
                !fixRule.linePattern.test(lines[lineIndex])
              ) {
                return;
              }
            }

            const newContent = fixRule.fix(
              content,
              match,
              filePath,
              error.line
            );
            if (newContent !== content) {
              content = newContent;
              fixCount++;
            }
          }
        });
      });

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, "utf8");
        fileChanges.set(filePath, true);
      }
    } catch (err) {
      console.error(`❌ Error processing ${filePath}:`, err.message);
    }
  });

  console.log(`\n✅ Applied ${fixCount} fixes to ${fileChanges.size} files`);

  // Check remaining errors
  setTimeout(() => {
    const remainingErrors = getTypeScriptErrors();
    console.log(`📊 Remaining errors: ${remainingErrors.length}`);

    if (remainingErrors.length < errors.length) {
      console.log(`🎉 Fixed ${errors.length - remainingErrors.length} errors!`);
    }

    if (remainingErrors.length > 0) {
      console.log(
        "\n🔄 You can run this script again to continue fixing errors."
      );
    }
  }, 1000);
}

// Run the fixer
applyFixes();
