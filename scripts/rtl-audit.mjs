#!/usr/bin/env node
// scripts/rtl-audit.mjs
// RTL Audit Tool for GYMovoo - בדיקה ותיקון של בעיות RTL
import {
  readdirSync,
  statSync,
  readFileSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { join, extname, basename } from "node:path";

const args = process.argv.slice(2);
const root = process.cwd();
const shouldFix = args.includes("--fix");
const verbose = args.includes("--verbose");
const showHelp = args.includes("--help") || args.includes("-h");

// Check if Tailwind is used in the project
const hasTailwind =
  existsSync(join(root, "tailwind.config.js")) ||
  existsSync(join(root, "tailwind.config.ts"));

// Help display
if (showHelp) {
  console.log(`
🔎 GYMovoo RTL Audit Tool
═══════════════════════════════════════════════════

USAGE:
  node scripts/rtl-audit.mjs [options]

OPTIONS:
  --fix       Apply safe automatic fixes
  --verbose   Show good patterns and best practices
  --help, -h  Show this help message

EXAMPLES:
  npm run rtl:audit                    # Dry run - analyze only
  npm run rtl:audit -- --fix          # Apply auto-fixes
  npm run rtl:audit -- --verbose      # Show good patterns too

EXIT CODES:
  0  No issues found
  1  Issues found (warnings/manual review needed)
  2  Critical anti-patterns found
`);
  process.exit(0);
}

const exts = new Set([".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".html"]);
const findings = [];
const report = { scanned: 0, changed: 0, issues: [], summary: {} };

// Strip comments from code content for analysis
function stripComments(content, ext) {
  if ([".js", ".jsx", ".ts", ".tsx"].includes(ext)) {
    // Remove single-line comments
    content = content.replace(/\/\/.*$/gm, "");
    // Remove multi-line comments but preserve line breaks
    content = content.replace(/\/\*[\s\S]*?\*\//g, (match) =>
      match.replace(/[^\n]/g, " ")
    );
  } else if ([".css", ".scss"].includes(ext)) {
    // Remove CSS comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, (match) =>
      match.replace(/[^\n]/g, " ")
    );
  } else if (ext === ".html") {
    // Remove HTML comments
    content = content.replace(/<!--[\s\S]*?-->/g, (match) =>
      match.replace(/[^\n]/g, " ")
    );
  }
  return content;
}

// Extract only string literals for emoji analysis
function extractStringLiterals(content, ext) {
  if (![".js", ".jsx", ".ts", ".tsx"].includes(ext)) return content;

  const strings = [];
  // Match string literals: "text", 'text', `text`, but not in comments
  const stringRegex = /(['"`])(?:(?!\1)[^\\]|\\.)*?\1/g;
  let match;

  while ((match = stringRegex.exec(content)) !== null) {
    strings.push(match[0]);
  }

  return strings.join(" ");
}

// Helper function to count pattern matches accurately (add global flag if missing)
function countMatches(content, regex) {
  const globalRegex = regex.flags.includes("g")
    ? regex
    : new RegExp(regex.source, regex.flags + "g");
  return content.match(globalRegex) || [];
}

function walk(dir) {
  try {
    for (const entry of readdirSync(dir)) {
      if (
        [
          "node_modules",
          ".git",
          ".next",
          "dist",
          "build",
          "coverage",
          ".turbo",
          "android",
          "ios",
          ".expo",
        ].includes(entry)
      )
        continue;
      const p = join(dir, entry);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else if (exts.has(extname(p))) scanFile(p);
    }
  } catch (err) {
    console.warn(`⚠️ Cannot read directory: ${dir}`);
  }
}

const patterns = {
  // React Native specific patterns
  rn: [
    {
      re: /\bmarginLeft\s*:\s*/g,
      fix: "marginStart: ",
      msg: "marginLeft → marginStart",
    },
    {
      re: /\bmarginRight\s*:\s*/g,
      fix: "marginEnd: ",
      msg: "marginRight → marginEnd",
    },
    {
      re: /\bpaddingLeft\s*:\s*/g,
      fix: "paddingStart: ",
      msg: "paddingLeft → paddingStart",
    },
    {
      re: /\bpaddingRight\s*:\s*/g,
      fix: "paddingEnd: ",
      msg: "paddingRight → paddingEnd",
    },
    {
      re: /\bborderLeftWidth\s*:\s*/g,
      fix: "borderStartWidth: ",
      msg: "borderLeftWidth → borderStartWidth",
    },
    {
      re: /\bborderRightWidth\s*:\s*/g,
      fix: "borderEndWidth: ",
      msg: "borderRightWidth → borderEndWidth",
    },
  ],

  // CSS/Web patterns (for any web components)
  web: [
    {
      re: /\bmargin-left\s*:\s*/g,
      fix: "margin-inline-start: ",
      msg: "margin-left → margin-inline-start",
    },
    {
      re: /\bmargin-right\s*:\s*/g,
      fix: "margin-inline-end: ",
      msg: "margin-right → margin-inline-end",
    },
    {
      re: /\bpadding-left\s*:\s*/g,
      fix: "padding-inline-start: ",
      msg: "padding-left → padding-inline-start",
    },
    {
      re: /\bpadding-right\s*:\s*/g,
      fix: "padding-inline-end: ",
      msg: "padding-right → padding-inline-end",
    },
    {
      re: /text-align\s*:\s*left\s*;/g,
      fix: "text-align: start;",
      msg: "text-align: left → start",
    },
  ],

  // Tailwind CSS patterns (only if tailwind.config.js exists)
  tailwind: [
    {
      re: /\bml-([0-9]{1,2})\b/g,
      fix: "ms-$1",
      msg: "Tailwind ml-* → ms-*",
    },
    {
      re: /\bmr-([0-9]{1,2})\b/g,
      fix: "me-$1",
      msg: "Tailwind mr-* → me-*",
    },
    {
      re: /\bpl-([0-9]{1,2})\b/g,
      fix: "ps-$1",
      msg: "Tailwind pl-* → ps-*",
    },
    {
      re: /\bpr-([0-9]{1,2})\b/g,
      fix: "pe-$1",
      msg: "Tailwind pr-* → pe-*",
    },
    {
      re: /\btext-left\b/g,
      fix: "text-start",
      msg: "Tailwind text-left → text-start",
    },
    // Note: text-right left as manual review for Hebrew content
  ],

  // Manual review patterns (no auto-fix)
  manual: [
    {
      re: /flexDirection\s*:\s*['"]row['"]/,
      msg: 'flexDirection: "row" - consider row-reverse for RTL',
    },
    {
      re: /textAlign\s*:\s*['"]left['"]/,
      msg: 'textAlign: "left" - should use getTextAlign() helper',
    },
    {
      re: /textAlign\s*:\s*['"]right['"]/,
      msg: 'textAlign: "right" - should use getTextAlign() helper',
    },
    {
      re: /writingDirection\s*:\s*['"]ltr['"]/,
      msg: 'writingDirection: "ltr" - should use getTextDirection() helper',
    },
    {
      re: /writingDirection\s*:\s*['"]rtl['"]/,
      msg: 'writingDirection: "rtl" - should use getTextDirection() helper',
    },
    {
      re: /\bleft\s*:\s*/g,
      msg: "left → start (position) - manual review needed",
    },
    {
      re: /\bright\s*:\s*/g,
      msg: "right → end (position) - manual review needed",
    },
  ],

  // Anti-patterns to warn about
  antiPatterns: [
    {
      re: /\bI18nManager\.isRTL\b/,
      msg: "Use isRTL() from rtlHelpers instead of I18nManager.isRTL",
    },
    {
      // More precise emoji before Hebrew detection - within string literals only
      re: /(['"`])(?:[^"'`\\]|\\.)*?[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]\s*[\u0590-\u05FF](?:[^"'`\\]|\\.)*?\1/gu,
      msg: "Emoji before Hebrew text within strings - should be after",
    },
  ],

  // Good patterns to encourage
  goodPatterns: [
    { re: /from\s+['"][^'"]*rtlHelpers['"]/, msg: "Uses rtlHelpers ✅" },
    {
      re: /wrapTextWithEmoji|formatTitleWithEmoji|getActionEmoji/,
      msg: "Uses new emoji helpers ✅",
    },
    { re: /flexDirection.*row-reverse/, msg: "Uses row-reverse for RTL ✅" },
  ],
};

function scanFile(file) {
  // Skip test files, spec files, mocks, and stories
  const skipFile = /(\.test\.|\.spec\.|__mocks__|__stories__|storybook)/i.test(
    file
  );
  if (skipFile) {
    report.scanned++;
    return;
  }

  // Skip large files (over 2MB)
  try {
    const stats = statSync(file);
    if (stats.size > 2 * 1024 * 1024) {
      report.scanned++;
      return;
    }
  } catch (err) {
    console.warn(`⚠️ Cannot read file stats: ${file}`);
    return;
  }

  let content = readFileSync(file, "utf8");
  const orig = content;
  const ext = extname(file);
  const isRN = [".tsx", ".ts", ".jsx", ".js"].includes(ext);
  const isWeb = [".css", ".scss", ".html"].includes(ext);
  const isHTML = ext === ".html";

  let fileChanged = false;

  // Strip comments for pattern analysis (but keep original for fixes)
  const contentForAnalysis = stripComments(content, ext);

  // HTML specific checks - only if Hebrew text is present
  if (isHTML && /<html[^>]*>/i.test(content)) {
    const hasHebrew = /[\u0590-\u05FF]/.test(contentForAnalysis);
    const hasRTL = /<html[^>]*\sdir\s*=\s*["']rtl["']/i.test(content);
    if (hasHebrew && !hasRTL) {
      findings.push({
        file,
        msg: 'HTML with Hebrew text missing dir="rtl" attribute',
        severity: "warn",
        category: "html",
      });
    }
  }

  // React Native pattern fixes
  if (isRN) {
    for (const pat of patterns.rn) {
      if (pat.re.test(content)) {
        const matches = countMatches(content, pat.re);
        findings.push({
          file,
          msg: `${pat.msg} (${matches.length} occurrences)`,
          severity: "fix",
          category: "rn-spacing",
        });
        if (shouldFix) {
          content = content.replace(pat.re, pat.fix);
          fileChanged = true;
        }
      }
    }

    // Manual review patterns
    for (const pat of patterns.manual) {
      if (pat.re.test(contentForAnalysis)) {
        const matches = countMatches(contentForAnalysis, pat.re);
        findings.push({
          file,
          msg: `${pat.msg} (${matches.length} occurrences)`,
          severity: "review",
          category: "manual-check",
        });
      }
    }

    // Anti-patterns - only check emoji in string literals
    for (const pat of patterns.antiPatterns) {
      let contentToCheck = contentForAnalysis;
      if (pat.msg.includes("Emoji")) {
        // For emoji patterns, only check string literals
        contentToCheck = extractStringLiterals(contentForAnalysis, ext);
      }

      if (pat.re.test(contentToCheck)) {
        const matches = countMatches(contentToCheck, pat.re);
        findings.push({
          file,
          msg: `${pat.msg} (${matches.length} occurrences)`,
          severity: "warn",
          category: "anti-pattern",
        });
      }
    }

    // Good patterns (encouragement)
    if (verbose) {
      for (const pat of patterns.goodPatterns) {
        if (pat.re.test(contentForAnalysis)) {
          const matches = countMatches(contentForAnalysis, pat.re);
          findings.push({
            file,
            msg: `${pat.msg} (${matches.length} occurrences)`,
            severity: "good",
            category: "best-practice",
          });
        }
      }
    }
  }

  // Web pattern fixes
  if (isWeb) {
    for (const pat of patterns.web) {
      if (pat.re.test(contentForAnalysis)) {
        const matches = countMatches(contentForAnalysis, pat.re);
        findings.push({
          file,
          msg: `${pat.msg} (${matches.length} occurrences)`,
          severity: "fix",
          category: "web-spacing",
        });
        if (shouldFix) {
          content = content.replace(pat.re, pat.fix);
          fileChanged = true;
        }
      }
    }

    // Tailwind CSS patterns (if Tailwind detected)
    if (hasTailwind) {
      for (const pat of patterns.tailwind) {
        if (pat.re.test(contentForAnalysis)) {
          const matches = countMatches(contentForAnalysis, pat.re);
          findings.push({
            file,
            msg: `${pat.msg} (${matches.length} occurrences)`,
            severity: "fix",
            category: "tailwind-spacing",
          });
          if (shouldFix) {
            content = content.replace(pat.re, pat.fix);
            fileChanged = true;
          }
        }
      }
    }
  }

  // Write changes if any
  if (shouldFix && fileChanged && content !== orig) {
    writeFileSync(file, content, "utf8");
    report.changed++;
  }
  report.scanned++;
}

function generateSummary() {
  const grouped = new Map();
  const categories = new Map();

  for (const f of findings) {
    // Group by file
    const arr = grouped.get(f.file) || [];
    arr.push(f);
    grouped.set(f.file, arr);

    // Count by category and severity
    const key = `${f.category}-${f.severity}`;
    categories.set(key, (categories.get(key) || 0) + 1);
  }

  for (const [file, arr] of grouped) {
    report.issues.push({
      file: file.replace(root, ""),
      items: arr.map((x) => ({
        msg: x.msg,
        severity: x.severity,
        category: x.category,
      })),
    });
  }

  report.summary = Object.fromEntries(categories);
  return report;
}

// Main execution
console.log("🔎 GYMovoo RTL Audit Tool");
console.log("═".repeat(50));

walk(root);
const out = generateSummary();

// Save report
const jsonPath = join(root, "rtl-audit-report.json");
writeFileSync(jsonPath, JSON.stringify(out, null, 2), "utf8");

// Console output
console.log(`📊 Scan Results:`);
console.log(`   Files scanned: ${out.scanned}`);
console.log(
  `   Files changed: ${out.changed}${shouldFix ? " (with --fix)" : ""}`
);
console.log(`   Issues found:  ${out.issues.length}`);
console.log("");

// Summary by category
if (Object.keys(out.summary).length > 0) {
  console.log("📋 Summary by Category:");
  for (const [key, count] of Object.entries(out.summary)) {
    const [category, severity] = key.split("-");
    const icon =
      {
        fix: "🔧",
        warn: "⚠️",
        review: "👀",
        good: "✅",
        error: "❌",
      }[severity] || "📝";

    console.log(`   ${icon} ${category}: ${count}`);
  }
  console.log("");
}

// Detailed findings
if (out.issues.length > 0) {
  console.log("📄 Detailed Findings:");
  console.log("─".repeat(50));

  for (const f of out.issues) {
    console.log(`📁 ${f.file}`);
    for (const item of f.items) {
      const icon =
        {
          fix: "🔧",
          warn: "⚠️",
          review: "👀",
          good: "✅",
          error: "❌",
        }[item.severity] || "📝";

      console.log(`   ${icon} ${item.msg}`);
    }
    console.log("");
  }
}

console.log(`💾 Report saved: ${basename(jsonPath)}`);
console.log("");

if (shouldFix) {
  console.log("✅ Auto-fixes applied! Please review changes with git diff");
  console.log("   Manual review needed for items marked with 👀");
} else {
  console.log("ℹ️  Dry run mode (no changes made)");
  console.log("   Add --fix to apply safe automatic fixes");
  console.log("   Add --verbose to see good patterns too");
}

console.log("");
console.log("🎯 Next Steps:");
console.log("   1. Review findings marked with ⚠️ and 👀");
console.log("   2. Use rtlHelpers functions instead of hardcoded values");
console.log("   3. Follow the hebrew-ui-guide.md for best practices");
console.log("   4. Test RTL layout on device/simulator");

// Exit with appropriate code for CI
const sum = out.summary || {};
const antiPatternCount = sum["anti-pattern-warn"] || 0;
const manualReviewCount = sum["manual-check-review"] || 0;
const fixableCount =
  (sum["rn-spacing-fix"] || 0) +
  (sum["web-spacing-fix"] || 0) +
  (sum["tailwind-spacing-fix"] || 0);

if (hasTailwind && verbose) {
  console.log(`🎨 Tailwind CSS detected - includes Tailwind-specific patterns`);
}

if (antiPatternCount > 0) {
  process.exit(2); // Critical anti-patterns found
} else if (manualReviewCount > 0 || fixableCount > 0) {
  process.exit(1); // Issues found that need attention
} else {
  process.exit(0); // Clean
}
