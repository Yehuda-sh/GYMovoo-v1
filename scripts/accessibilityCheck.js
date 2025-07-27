/**
 * @file scripts/accessibilityCheck.js
 * @brief בדיקת נגישות לאפליקציה
 * @features screen reader support, color contrast, touch targets
 */

const fs = require("fs");
const path = require("path");

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
        if (fixedTexts.length > 5) {
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
    issues.slice(0, 8).forEach((issue) => {
      console.log(`  • ${issue}`);
    });
    if (issues.length > 8) {
      console.log(`  ... ועוד ${issues.length - 8} בעיות`);
    }
  }

  console.log();
}

// בדיקת ניגודיות צבעים
function checkColorContrast() {
  console.log("🎨 בדיקת ניגודיות צבעים:");
  console.log("------------------------");

  const themeFile = path.join(__dirname, "..", "src", "styles", "theme.ts");

  if (fs.existsSync(themeFile)) {
    const content = fs.readFileSync(themeFile, "utf8");
    const issues = [];

    // חילוץ צבעים מהקובץ theme
    const colorRegex = /#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}/g;
    const colors = content.match(colorRegex) || [];

    console.log(`📊 נמצאו ${colors.length} צבעים בtheme`);

    // בדיקות בסיסיות
    if (content.includes("#FFFFFF") && content.includes("#000000")) {
      console.log("✅ יש ניגודיות גבוהה (שחור-לבן)");
    } else {
      issues.push("חסרה ניגודיות גבוהה בסיסית");
    }

    // בדיקת גווני אפור
    const grayShades = colors.filter((color) => {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return (
        Math.abs(r - g) < 10 && Math.abs(g - b) < 10 && Math.abs(r - b) < 10
      );
    });

    console.log(`📊 גווני אפור: ${grayShades.length}`);

    if (grayShades.length >= 3) {
      console.log("✅ יש מספיק גווני אפור למדרגי נגישות");
    } else {
      issues.push("חסרים גווני אפור לנגישות טובה");
    }

    if (issues.length > 0) {
      console.log("⚠️  בעיות ניגודיות:");
      issues.forEach((issue) => console.log(`  • ${issue}`));
    }
  } else {
    console.log("⚠️  קובץ theme.ts לא נמצא");
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
        if (smallPadding.length > 3) {
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
        const smallFonts = content.match(/fontSize:\s*[1-9](?!\d)/g) || [];
        if (smallFonts.length > 0) {
          issues.push(
            `${relativePath}: טקסט קטן מדי (${smallFonts.length} instances)`
          );
        }

        // בדיקת צבע טקסט קבוע
        const hardcodedColors = content.match(/color:\s*['"][^'"]+['"]/g) || [];
        if (hardcodedColors.length > 3) {
          issues.push(
            `${relativePath}: יותר מדי צבעי טקסט קבועים (${hardcodedColors.length})`
          );
        }

        // בדיקת RTL support
        if (
          content.includes("שלום") ||
          content.includes("תפריט") ||
          content.includes("הגדרות")
        ) {
          if (
            !content.includes("textAlign") &&
            !content.includes("writingDirection")
          ) {
            issues.push(`${relativePath}: טקסט עברי ללא הגדרות RTL`);
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
  console.log("📊 סיכום בדיקת נגישות");
  console.log("==========================================");
  console.log("💡 המלצות נגישות:");
  console.log("  1. הוסף accessibilityLabel לכל touchable");
  console.log("  2. ודא ניגודיות של 4.5:1 לטקסט רגיל");
  console.log("  3. גדלי מגע מינימום 44x44 נקודות");
  console.log("  4. תמוך ב-screen readers");
  console.log("  5. בדוק עם Voice Over (iOS) ו-TalkBack (Android)");
  console.log("");
  console.log("🔗 מדריכים:");
  console.log(
    "  - React Native Accessibility: https://reactnative.dev/docs/accessibility"
  );
  console.log("  - WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/");
} catch (error) {
  console.error("❌ שגיאה בבדיקת נגישות:", error.message);
}
