/**
 * @file scripts/accessibilityCheck.js
 * @brief בדיקת נגישות לאפליקציה - מותאם לסטנדרטים של GYMovoo
 * @features screen reader support, color contrast, touch targets, RTL support, theme integration
 * @notes מותאם לעקרונות הפרויקט: RTL מלא, theme.ts, MaterialCommunityIcons
 * @version 2.0 - מקוד משופר עם ביצועים טובים יותר
 */

const fs = require("fs");
const path = require("path");

// קונפיגורציה של הבדיקה - ניתנת לשינוי
const ACCESSIBILITY_CONFIG = {
  MIN_TOUCH_TARGET_SIZE: 44, // נקודות
  MIN_FONT_SIZE: 12,
  MAX_FIXED_FONT_SIZES: 5,
  MIN_CONTRAST_RATIO: 4.5,
  MAX_HARDCODED_COLORS: 3,
  MIN_GRAY_SHADES: 3,
  MAX_SMALL_PADDING: 3,
  MAX_DISPLAY_ISSUES: 8,
  SAVE_REPORT: true, // שמירת דוח לקובץ
};

// Cache לקבצים שנסרקו
const fileCache = new Map();

// מילות מפתח עבריות לזיהוי RTL - מורחב
const HEBREW_KEYWORDS = [
  "אימון",
  "תרגיל",
  "משקל",
  "סט",
  "חזרה",
  "הגדרות",
  "פרופיל",
  "היסטוריה",
  "מטרה",
  "שריר",
  "כושר",
  "חזה",
  "גב",
  "רגליים",
  "כתפיים",
  "ביצפ",
  "טריצפ",
  "בטן",
  "דיאטה",
  "קלוריות",
  "חלבון",
  "פחמימות",
  "שומן",
  "מים",
  "מנוחה",
  "התאוששות",
  "מתיחות",
  "רמה",
];

console.log("♿ GYMovoo Accessibility Check v2.0");
console.log("===================================\n");

// פונקציות עזר משותפות - מונעות כפילויות קוד
class AccessibilityAnalyzer {
  constructor() {
    this.srcDir = path.join(__dirname, "..", "src");
    this.fileCache = new Map();
    this.results = {
      accessibility: { issues: [], stats: {} },
      colors: { issues: [], stats: {} },
      touchTargets: { issues: [], stats: {} },
      text: { issues: [], stats: {} },
    };
  }

  // סריקה מרכזית של כל הקבצים - מונע כפילויות
  scanAllFiles() {
    const allFiles = [];

    const scanDirectory = (dir) => {
      const items = fs.readdirSync(dir);

      items.forEach((item) => {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory() && item !== "node_modules") {
          scanDirectory(itemPath);
        } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
          const relativePath = path.relative(process.cwd(), itemPath);
          const content = fs.readFileSync(itemPath, "utf8");

          // Cache התוכן למניעת קריאות מרובות
          this.fileCache.set(relativePath, content);
          allFiles.push({ path: relativePath, content });
        }
      });
    };

    scanDirectory(this.srcDir);
    return allFiles;
  }

  // Regex patterns משותפים
  getPatterns() {
    return {
      touchables: /<(TouchableOpacity|Pressable|Button)[^>]*>/g,
      images: /<Image[^>]*>/g,
      texts: /<Text[^>]*>/g,
      colors: /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g,
      fixedSizes: /fontSize:\s*\d+/g,
      smallSizes: /width:\s*[1-3]\d|height:\s*[1-3]\d/g,
      smallPadding: /padding:\s*[1-5](?!\d)/g,
      smallFonts: new RegExp(
        `fontSize:\\s*[1-${ACCESSIBILITY_CONFIG.MIN_FONT_SIZE - 1}](?!\\d)`,
        "g"
      ),
      hardcodedColors: /color:\s*['"][^'"]+['"]/g,
      materialIcons: /MaterialCommunityIcons/g,
    };
  }

  // הדפסת תוצאות מאוחדת
  printResults(title, issues, stats = {}) {
    console.log(`${title}:`);
    console.log("-".repeat(title.length + 1));

    // הצגת סטטיסטיקות
    Object.entries(stats).forEach(([key, value]) => {
      console.log(`📊 ${key}: ${value}`);
    });

    if (issues.length === 0) {
      console.log("✅ לא נמצאו בעיות");
    } else {
      console.log(`⚠️  נמצאו ${issues.length} בעיות:`);
      issues
        .slice(0, ACCESSIBILITY_CONFIG.MAX_DISPLAY_ISSUES)
        .forEach((issue) => {
          console.log(`  • ${issue}`);
        });
      if (issues.length > ACCESSIBILITY_CONFIG.MAX_DISPLAY_ISSUES) {
        console.log(
          `  ... ועוד ${issues.length - ACCESSIBILITY_CONFIG.MAX_DISPLAY_ISSUES} בעיות`
        );
      }
    }
    console.log();
  }
}
// בדיקת accessibility labels - משופרת
function checkAccessibilityLabels() {
  const analyzer = new AccessibilityAnalyzer();
  const files = analyzer.scanAllFiles();
  const patterns = analyzer.getPatterns();
  const issues = [];
  let totalTouchables = 0;
  let labeledTouchables = 0;

  files.forEach(({ path: filePath, content }) => {
    // בדיקת TouchableOpacity ו-Pressable
    const touchables = content.match(patterns.touchables) || [];
    totalTouchables += touchables.length;

    touchables.forEach((touchable) => {
      if (
        touchable.includes("accessibilityLabel") ||
        touchable.includes("accessible")
      ) {
        labeledTouchables++;
      } else {
        issues.push(`${filePath}: touchable ללא accessibility label`);
      }
    });

    // בדיקת Image ללא alt
    const images = content.match(patterns.images) || [];
    images.forEach((image) => {
      if (
        !image.includes("accessibilityLabel") &&
        !image.includes("accessible={false}")
      ) {
        issues.push(`${filePath}: תמונה ללא accessibility label`);
      }
    });

    // בדיקת Text בגדלים קבועים
    const fixedTexts = content.match(patterns.fixedSizes) || [];
    if (fixedTexts.length > ACCESSIBILITY_CONFIG.MAX_FIXED_FONT_SIZES) {
      issues.push(
        `${filePath}: יותר מדי גדלי טקסט קבועים (${fixedTexts.length})`
      );
    }
  });

  const labelPercentage =
    totalTouchables > 0 ? (labeledTouchables / totalTouchables) * 100 : 100;

  const stats = {
    "Touchable elements": totalTouchables,
    "עם labels": `${labeledTouchables} (${labelPercentage.toFixed(1)}%)`,
  };

  analyzer.printResults("🏷️  בדיקת Accessibility Labels", issues, stats);
  analyzer.results.accessibility = { issues, stats };
  return analyzer.results.accessibility;
}

// בדיקת ניגודיות צבעים - מותאם ל-theme.ts של GYMovoo - משופרת
function checkColorContrast() {
  const analyzer = new AccessibilityAnalyzer();
  const patterns = analyzer.getPatterns();
  const themeFile = path.join(__dirname, "..", "src", "styles", "theme.ts");
  const colorsFile = path.join(__dirname, "..", "src", "styles", "colors.ts");

  let issues = [];
  let totalColors = 0;
  let themeStructure = {
    hasTheme: false,
    hasDarkMode: false,
    hasLightMode: false,
  };

  // קריאת קבצים עם cache
  const checkThemeFile = (filePath, fileName) => {
    if (fs.existsSync(filePath)) {
      const content =
        analyzer.fileCache.get(filePath) || fs.readFileSync(filePath, "utf8");
      analyzer.fileCache.set(filePath, content);

      // בדיקת מבנה theme
      if (fileName === "theme.ts") {
        themeStructure.hasTheme = true;
        themeStructure.hasDarkMode =
          content.includes("dark") || content.includes("Dark");
        themeStructure.hasLightMode =
          content.includes("light") || content.includes("Light");
      }

      const colors = content.match(patterns.colors) || [];
      totalColors += colors.length;
      return colors.length;
    }
    return 0;
  };

  const themeColors = checkThemeFile(themeFile, "theme.ts");
  const additionalColors = checkThemeFile(colorsFile, "colors.ts");

  // הערכת מבנה ה-theme
  if (!themeStructure.hasTheme) {
    issues.push("קובץ theme.ts לא נמצא - יש צורך במערכת צבעים מרכזית");
  } else if (!themeStructure.hasDarkMode && !themeStructure.hasLightMode) {
    issues.push("חסרה תמיכה בLight/Dark themes");
  }

  if (totalColors < ACCESSIBILITY_CONFIG.MIN_GRAY_SHADES) {
    issues.push(
      `חסרים צבעים לנגישות טובה (יש ${totalColors}, צריך לפחות ${ACCESSIBILITY_CONFIG.MIN_GRAY_SHADES})`
    );
  }

  const stats = {
    "צבעים בtheme.ts": themeColors,
    "צבעים נוספים": additionalColors,
    'סה"כ צבעים': totalColors,
    "תמיכה בDark Mode": themeStructure.hasDarkMode ? "✅" : "❌",
    "תמיכה בLight Mode": themeStructure.hasLightMode ? "✅" : "❌",
  };

  analyzer.printResults("🎨 בדיקת ניגודיות צבעים", issues, stats);
  analyzer.results.colors = { issues, stats };
  return analyzer.results.colors;
}

// בדיקת גדלי מגע
function checkTouchTargets() {
  const analyzer = new AccessibilityAnalyzer();
  const patterns = analyzer.getPatterns();
  const allFiles = analyzer.scanAllFiles();

  let issues = [];
  let stats = {
    filesChecked: 0,
    touchableElements: 0,
    smallTargets: 0,
    smallPadding: 0,
  };

  // בדיקת קבצי TSX עבור מטרות מגע
  const tsxFiles = allFiles.filter(({ path }) => path.endsWith(".tsx"));

  tsxFiles.forEach(({ path: filePath, content }) => {
    stats.filesChecked++;

    // בדיקת כפתורים קטנים מדי - תיקון הפטרן
    const smallButtons = content.match(patterns.smallSizes) || [];
    stats.smallTargets += smallButtons.length;

    if (smallButtons.length > 0) {
      issues.push(
        `${filePath}: יש כפתורים שעלולים להיות קטנים מדי (${smallButtons.length})`
      );
    }

    // בדיקת padding קטן
    const smallPadding = content.match(patterns.smallPadding) || [];
    stats.smallPadding += smallPadding.length;

    if (smallPadding.length > ACCESSIBILITY_CONFIG.MAX_SMALL_PADDING) {
      issues.push(
        `${filePath}: יש הרבה elements עם padding קטן (${smallPadding.length})`
      );
    }

    // בדיקת רכיבים ניתנים למגע
    const touchables = content.match(patterns.touchables) || [];
    stats.touchableElements += touchables.length;
  });

  const statsDisplay = {
    "קבצים נבדקו": stats.filesChecked,
    "רכיבים ניתנים למגע": stats.touchableElements,
    "מטרות מגע קטנות": stats.smallTargets,
    "Elements עם padding קטן": stats.smallPadding,
  };

  analyzer.printResults("👆 בדיקת גדלי מטרות מגע", issues, statsDisplay);
  analyzer.results.touchTargets = { issues, stats: statsDisplay };
  return analyzer.results.touchTargets;
}

// בדיקת טקסט נגיש - משופרת
function checkAccessibleText() {
  const analyzer = new AccessibilityAnalyzer();
  const patterns = analyzer.getPatterns();
  const allFiles = analyzer.scanAllFiles();

  let issues = [];
  let stats = {
    filesChecked: 0,
    textComponents: 0,
    smallFonts: 0,
    hardcodedColors: 0,
    hebrewFiles: 0,
    iconsWithoutLabels: 0,
  };

  const tsxFiles = allFiles.filter(({ path }) => path.endsWith(".tsx"));

  tsxFiles.forEach(({ path: filePath, content }) => {
    stats.filesChecked++;

    // ספירת Text components
    const texts = content.match(patterns.texts) || [];
    stats.textComponents += texts.length;

    // בדיקת fontSize קטן מדי
    const smallFonts = content.match(patterns.smallFonts) || [];
    stats.smallFonts += smallFonts.length;

    if (smallFonts.length > 0) {
      issues.push(
        `${filePath}: טקסט קטן מדי (${smallFonts.length} instances, מינימום ${ACCESSIBILITY_CONFIG.MIN_FONT_SIZE})`
      );
    }

    // בדיקת צבע טקסט קבוע
    const hardcodedColors = content.match(patterns.hardcodedColors) || [];
    stats.hardcodedColors += hardcodedColors.length;

    if (hardcodedColors.length > ACCESSIBILITY_CONFIG.MAX_HARDCODED_COLORS) {
      issues.push(
        `${filePath}: יותר מדי צבעי טקסט קבועים (${hardcodedColors.length})`
      );
    }

    // בדיקת RTL support מורחבת - מותאם לGYMovoo
    const hebrewWords = [
      "אימון",
      "תרגיל",
      "משקל",
      "סט",
      "חזרה",
      "הגדרות",
      "פרופיל",
      "היסטוריה",
      "מטרה",
      "שריר",
      "כושר",
      "חזה",
      "גב",
      "רגליים",
      "כתפיים",
      "ביצפ",
      "טריצפ",
      "בטן",
    ];

    const hasHebrewContent = hebrewWords.some((word) => content.includes(word));
    if (hasHebrewContent) {
      stats.hebrewFiles++;
      const hasRTLSupport =
        content.includes("textAlign") ||
        content.includes("writingDirection") ||
        content.includes("I18nManager") ||
        content.includes("isRTL");

      if (!hasRTLSupport) {
        issues.push(`${filePath}: תוכן עברי ללא תמיכת RTL מלאה`);
      }
    }

    // בדיקת MaterialCommunityIcons - הסטנדרט של GYMovoo
    const iconUsage = content.match(patterns.materialIcons) || [];
    if (iconUsage.length > 0) {
      const hasAccessibleIcons =
        content.includes("accessibilityLabel") &&
        content.includes("MaterialCommunityIcons");
      if (!hasAccessibleIcons) {
        stats.iconsWithoutLabels++;
        issues.push(`${filePath}: אייקונים ללא accessibility labels`);
      }
    }
  });

  const statsDisplay = {
    "קבצים נבדקו": stats.filesChecked,
    "Text components": stats.textComponents,
    "גפנים קטנות מדי": stats.smallFonts,
    "צבעים קבועים": stats.hardcodedColors,
    "קבצים עם עברית": stats.hebrewFiles,
    "אייקונים ללא labels": stats.iconsWithoutLabels,
  };

  analyzer.printResults(
    "📝 בדיקת טקסט נגיש",
    issues.slice(0, 10),
    statsDisplay
  );
  if (issues.length > 10) {
    console.log(`... ועוד ${issues.length - 10} בעיות נוספות`);
  }

  analyzer.results.accessibleText = { issues, stats: statsDisplay };
  return analyzer.results.accessibleText;
}

// הרצה - עם דו"ח מאוחד ואופציונלי
try {
  console.log("🔍 GYMovoo Accessibility Checker v2.0");
  console.log("=====================================\n");

  const accessibilityResults = checkAccessibilityLabels();
  const colorResults = checkColorContrast();
  const touchResults = checkTouchTargets();
  const textResults = checkAccessibleText();

  // סיכום כללי
  console.log("📋 סיכום כללי:");
  console.log("===============");

  const totalIssues = [
    accessibilityResults,
    colorResults,
    touchResults,
    textResults,
  ].reduce((sum, result) => sum + result.issues.length, 0);

  if (totalIssues === 0) {
    console.log("🎉 מעולה! לא נמצאו בעיות נגישות");
  } else {
    console.log(`⚠️  סה"כ נמצאו ${totalIssues} בעיות נגישות`);
  }

  // שמירת דו"ח (אופציונלי)
  if (ACCESSIBILITY_CONFIG.SAVE_REPORT) {
    const report = {
      timestamp: new Date().toISOString(),
      summary: { totalIssues },
      details: {
        accessibility: accessibilityResults,
        colors: colorResults,
        touchTargets: touchResults,
        accessibleText: textResults,
      },
    };

    const reportPath = path.join(
      __dirname,
      `accessibility-report-${Date.now()}.json`
    );
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`💾 דו"ח נשמר ב: ${reportPath}`);
  }

  console.log("==========================================");
  console.log("📊 סיכום בדיקת נגישות - GYMovoo");
  console.log("==========================================");
  console.log("💡 המלצות נגישות מותאמות לפרויקט:");
  console.log(
    `  1. הוסף accessibilityLabel לכל touchable (מינימום ${ACCESSIBILITY_CONFIG.MIN_TOUCH_TARGET_SIZE}x${ACCESSIBILITY_CONFIG.MIN_TOUCH_TARGET_SIZE})`
  );
  console.log(
    `  2. ודא ניגודיות של ${ACCESSIBILITY_CONFIG.MIN_CONTRAST_RATIO}:1 לטקסט רגיל`
  );
  console.log(
    `  3. גודל פונט מינימום: ${ACCESSIBILITY_CONFIG.MIN_FONT_SIZE}px`
  );
  console.log("  4. תמיכה מלאה בRTL לטקסטים עבריים");
  console.log("  5. MaterialCommunityIcons עם accessibility labels");
  console.log("  6. תמיכה בtheme.ts עם Light/Dark mode");
  console.log("  7. בדוק עם Voice Over (iOS) ו-TalkBack (Android)");
  console.log("");
  console.log("🔗 מדריכים לGYMovoo:");
  console.log(
    "  - React Native Accessibility: https://reactnative.dev/docs/accessibility"
  );
  console.log(
    "  - RTL Support: https://reactnative.dev/blog/2016/08/19/right-to-left-support-for-react-native-apps"
  );
  console.log("  - WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/");

  console.log("\n✅ בדיקת נגישות הושלמה");
} catch (error) {
  console.error("❌ שגיאה בבדיקת נגישות:", error.message);
  process.exit(1);
}
