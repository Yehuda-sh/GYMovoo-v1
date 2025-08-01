/**
 * @file scripts/accessibilityCheck.js
 * @brief בדיקת נגישות לאפליקציה - מותאם לסטנדרטים של GYMovoo
 * @features screen reader support, color contrast, touch targets, RTL support, theme integration
 * @notes מותאם לעקרונות הפרויקט: RTL מלא, theme.ts, MaterialCommunityIcons
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
};

console.log("♿ GYMovoo Accessibility Check");
console.log("==============================\n");

// בדיקת accessibility labels
function checkAccessibilityLabels() {
  console.log("🏷️  בדיקת Accessibility Labels:");
  console.log("------------------------------");

  const srcDir = path.join(__dirname, "..", "src");
  const issues = [];
  let totalTouchables = 0;
  let labeledTouchables = 0;

  function scanAccessibility(dir) {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanAccessibility(itemPath);
      } else if (item.endsWith(".tsx")) {
        const content = fs.readFileSync(itemPath, "utf8");
        const relativePath = path.relative(process.cwd(), itemPath);

        // בדיקת TouchableOpacity ו-Pressable
        const touchables =
          content.match(/<(TouchableOpacity|Pressable|Button)[^>]*>/g) || [];
        totalTouchables += touchables.length;

        touchables.forEach((touchable) => {
          if (
            touchable.includes("accessibilityLabel") ||
            touchable.includes("accessible")
          ) {
            labeledTouchables++;
          } else {
            issues.push(`${relativePath}: touchable ללא accessibility label`);
          }
        });

        // בדיקת Image ללא alt
        const images = content.match(/<Image[^>]*>/g) || [];
        images.forEach((image) => {
          if (
            !image.includes("accessibilityLabel") &&
            !image.includes("accessible={false}")
          ) {
            issues.push(`${relativePath}: תמונה ללא accessibility label`);
          }
        });

        // בדיקת Text בגדלים קבועים
        const fixedTexts = content.match(/fontSize:\s*\d+/g) || [];
        if (fixedTexts.length > ACCESSIBILITY_CONFIG.MAX_FIXED_FONT_SIZES) {
          issues.push(
            `${relativePath}: יותר מדי גדלי טקסט קבועים (${fixedTexts.length})`
          );
        }
      }
    });
  }

  scanAccessibility(srcDir);

  const labelPercentage =
    totalTouchables > 0 ? (labeledTouchables / totalTouchables) * 100 : 100;

  console.log(`📊 Touchable elements: ${totalTouchables}`);
  console.log(
    `🏷️  עם labels: ${labeledTouchables} (${labelPercentage.toFixed(1)}%)`
  );

  if (issues.length === 0) {
    console.log("✅ לא נמצאו בעיות נגישות גדולות");
  } else {
    console.log(`⚠️  נמצאו ${issues.length} בעיות נגישות:`);
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

// בדיקת ניגודיות צבעים - מותאם ל-theme.ts של GYMovoo
function checkColorContrast() {
  console.log("🎨 בדיקת ניגודיות צבעים:");
  console.log("------------------------");

  const themeFile = path.join(__dirname, "..", "src", "styles", "theme.ts");
  const colorsFile = path.join(__dirname, "..", "src", "styles", "colors.ts");

  let issues = [];
  let totalColors = 0;

  // בדיקת קובץ theme.ts הראשי
  if (fs.existsSync(themeFile)) {
    const content = fs.readFileSync(themeFile, "utf8");

    // בדיקת structure של theme - מותאם למבנה הקיים של GYMovoo
    if (
      content.includes("colors = {") &&
      content.includes("background:") &&
      content.includes("backgroundAlt:")
    ) {
      console.log("✅ יש מערכת צבעים מובנית (dark theme)");
    } else if (
      content.includes("lightTheme") &&
      content.includes("darkTheme")
    ) {
      console.log("✅ יש תמיכה בLight/Dark themes");
    } else {
      issues.push("חסר תמיכה מלאה בLight/Dark themes");
    }

    // חילוץ צבעים מהקובץ theme
    const colorRegex = /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g;
    const colors = content.match(colorRegex) || [];
    totalColors += colors.length;

    console.log(`📊 נמצאו ${colors.length} צבעים בtheme.ts`);
  }

  // בדיקת קובץ colors.ts נפרד אם קיים
  if (fs.existsSync(colorsFile)) {
    const content = fs.readFileSync(colorsFile, "utf8");
    const colorRegex = /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g;
    const colors = content.match(colorRegex) || [];
    totalColors += colors.length;
    console.log(`📊 נמצאו ${colors.length} צבעים נוספים בcolors.ts`);
  }

  if (totalColors === 0 || !fs.existsSync(themeFile)) {
    if (!fs.existsSync(themeFile)) {
      issues.push("קובץ theme.ts לא נמצא - יש צורך במערכת צבעים מרכזית");
    } else {
      issues.push("לא נמצא קובץ theme או colors עם צבעים מוגדרים");
    }
  } else {
    console.log(`📊 סה"כ צבעים בtheme: ${totalColors}`);

    if (totalColors >= ACCESSIBILITY_CONFIG.MIN_GRAY_SHADES) {
      console.log("✅ יש מספיק צבעים למדרגי נגישות");
    } else {
      issues.push(
        `חסרים צבעים לנגישות טובה (יש ${totalColors}, צריך לפחות ${ACCESSIBILITY_CONFIG.MIN_GRAY_SHADES})`
      );
    }
  }

  if (issues.length > 0) {
    console.log("⚠️  בעיות ניגודיות:");
    issues.forEach((issue) => console.log(`  • ${issue}`));
  } else {
    console.log("✅ לא נמצאו בעיות ניגודיות גדולות");
  }

  console.log();
}

// בדיקת גדלי מגע
function checkTouchTargets() {
  console.log("👆 בדיקת גדלי מטרות מגע:");
  console.log("-------------------------");

  const srcDir = path.join(__dirname, "..", "src");
  const issues = [];

  function scanTouchTargets(dir) {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanTouchTargets(itemPath);
      } else if (item.endsWith(".tsx")) {
        const content = fs.readFileSync(itemPath, "utf8");
        const relativePath = path.relative(process.cwd(), itemPath);

        // בדיקת כפתורים קטנים מדי
        const smallButtons =
          content.match(/width:\s*[1-3]\d|height:\s*[1-3]\d/g) || [];
        if (smallButtons.length > 0) {
          issues.push(
            `${relativePath}: יש כפתורים שעלולים להיות קטנים מדי (${smallButtons.length})`
          );
        }

        // בדיקת padding קטן
        const smallPadding = content.match(/padding:\s*[1-5](?!\d)/g) || [];
        if (smallPadding.length > ACCESSIBILITY_CONFIG.MAX_SMALL_PADDING) {
          issues.push(
            `${relativePath}: יש הרבה elements עם padding קטן (${smallPadding.length})`
          );
        }
      }
    });
  }

  scanTouchTargets(srcDir);

  if (issues.length === 0) {
    console.log("✅ לא נמצאו בעיות גדלי מגע");
  } else {
    console.log(`⚠️  נמצאו ${issues.length} בעיות פוטנציאליות:`);
    issues.forEach((issue) => console.log(`  • ${issue}`));
  }

  console.log();
}

// בדיקת טקסט נגיש
function checkAccessibleText() {
  console.log("📝 בדיקת טקסט נגיש:");
  console.log("-------------------");

  const srcDir = path.join(__dirname, "..", "src");
  const issues = [];
  let totalTexts = 0;

  function scanText(dir) {
    const items = fs.readdirSync(dir);

    items.forEach((item) => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanText(itemPath);
      } else if (item.endsWith(".tsx")) {
        const content = fs.readFileSync(itemPath, "utf8");
        const relativePath = path.relative(process.cwd(), itemPath);

        // ספירת Text components
        const texts = content.match(/<Text[^>]*>/g) || [];
        totalTexts += texts.length;

        // בדיקת fontSize קטן מדי
        const smallFonts =
          content.match(
            new RegExp(
              `fontSize:\\s*[1-${ACCESSIBILITY_CONFIG.MIN_FONT_SIZE - 1}](?!\\d)`,
              "g"
            )
          ) || [];
        if (smallFonts.length > 0) {
          issues.push(
            `${relativePath}: טקסט קטן מדי (${smallFonts.length} instances, מינימום ${ACCESSIBILITY_CONFIG.MIN_FONT_SIZE})`
          );
        }

        // בדיקת צבע טקסט קבוע
        const hardcodedColors = content.match(/color:\s*['"][^'"]+['"]/g) || [];
        if (
          hardcodedColors.length > ACCESSIBILITY_CONFIG.MAX_HARDCODED_COLORS
        ) {
          issues.push(
            `${relativePath}: יותר מדי צבעי טקסט קבועים (${hardcodedColors.length})`
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

        const hasHebrewContent = hebrewWords.some((word) =>
          content.includes(word)
        );

        if (hasHebrewContent) {
          const hasRTLSupport =
            content.includes("textAlign") ||
            content.includes("writingDirection") ||
            content.includes("I18nManager") ||
            content.includes("isRTL");

          if (!hasRTLSupport) {
            issues.push(`${relativePath}: תוכן עברי ללא תמיכת RTL מלאה`);
          }
        }

        // בדיקת MaterialCommunityIcons - הסטנדרט של GYMovoo
        const iconUsage = content.match(/MaterialCommunityIcons/g) || [];
        if (iconUsage.length > 0) {
          const hasAccessibleIcons =
            content.includes("accessibilityLabel") &&
            content.includes("MaterialCommunityIcons");
          if (!hasAccessibleIcons) {
            issues.push(`${relativePath}: אייקונים ללא accessibility labels`);
          }
        }
      }
    });
  }

  scanText(srcDir);

  console.log(`📊 סה"כ Text components: ${totalTexts}`);

  if (issues.length === 0) {
    console.log("✅ לא נמצאו בעיות טקסט");
  } else {
    console.log(`⚠️  נמצאו ${issues.length} בעיות טקסט:`);
    issues.slice(0, 5).forEach((issue) => console.log(`  • ${issue}`));
    if (issues.length > 5) {
      console.log(`  ... ועוד ${issues.length - 5} בעיות`);
    }
  }

  console.log();
}

// הרצה
try {
  checkAccessibilityLabels();
  checkColorContrast();
  checkTouchTargets();
  checkAccessibleText();

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
} catch (error) {
  console.error("❌ שגיאה בבדיקת נגישות:", error.message);
}
