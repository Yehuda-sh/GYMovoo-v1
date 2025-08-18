/**
 * @file בדיקת מיפוי ציוד ואייקונים
 * @updated 18.8.2025
 */
const fs = require("fs");
const path = require("path");

// קבועים
const FILE_PATH = "./src/utils/equipmentIconMapping.ts";
const ENCODING = "utf8";
const COLORS = {
  RED: "\x1b[31m",
  GREEN: "\x1b[32m",
  YELLOW: "\x1b[33m",
  BLUE: "\x1b[34m",
  RESET: "\x1b[0m",
};

const log = {
  success: (msg) => console.log(`${COLORS.GREEN}✅ ${msg}${COLORS.RESET}`),
  error: (msg) => console.log(`${COLORS.RED}❌ ${msg}${COLORS.RESET}`),
  info: (msg) => console.log(`${COLORS.BLUE}ℹ️ ${msg}${COLORS.RESET}`),
  warning: (msg) => console.log(`${COLORS.YELLOW}⚠️ ${msg}${COLORS.RESET}`),
};

try {
  if (!fs.existsSync(FILE_PATH)) {
    throw new Error(`קובץ לא נמצא: ${FILE_PATH}`);
  }
  const tsCode = fs.readFileSync(FILE_PATH, ENCODING);
  // חילוץ מיפויים
  const equipmentIconRegex = /equipmentIconMapping\s*=\s*{([^}]+)}/s;
  const hebrewNamesRegex = /equipmentHebrewNames\s*=\s*{([^}]+)}/s;
  const iconMatch = tsCode.match(equipmentIconRegex);
  const hebrewMatch = tsCode.match(hebrewNamesRegex);
  if (!iconMatch || !hebrewMatch) {
    throw new Error("לא הצלחתי לחלץ את המיפויים מהקובץ");
  }
  const parseMapping = (str) => {
    const map = {};
    const lines = str.split("\n");
    lines.forEach((line) => {
      const match = line.match(/["']([^"']+)["']\s*:\s*["']([^"']+)["']/);
      if (match) {
        map[match[1]] = match[2];
      }
    });
    return map;
  };
  const equipmentIconMapping = parseMapping(iconMatch[1]);
  const equipmentHebrewNames = parseMapping(hebrewMatch[1]);

  console.log("\n" + "=".repeat(50));
  console.log("🔧 בדיקת מיפוי ציוד ואייקונים");
  console.log("=".repeat(50));

  // בדיקת כפילויות
  console.log("\n🔍 בדיקת כפילויות באייקונים:");
  const iconUsage = {};
  Object.entries(equipmentIconMapping).forEach(([key, icon]) => {
    if (!iconUsage[icon]) iconUsage[icon] = [];
    iconUsage[icon].push(key);
  });
  let duplicatesFound = false;
  Object.entries(iconUsage).forEach(([icon, keys]) => {
    if (keys.length > 1) {
      duplicatesFound = true;
      log.warning(`האייקון "${icon}" משמש עבור: ${keys.join(", ")}`);
    }
  });
  if (!duplicatesFound) {
    log.success("לא נמצאו כפילויות באייקונים!");
  }

  // בדיקת התאמה בין מיפויים
  console.log("\n� בדיקת התאמה בין מיפויים:");
  const iconKeys = new Set(Object.keys(equipmentIconMapping));
  const hebrewKeys = new Set(Object.keys(equipmentHebrewNames));
  const onlyInIcons = [...iconKeys].filter((k) => !hebrewKeys.has(k));
  const onlyInHebrew = [...hebrewKeys].filter((k) => !iconKeys.has(k));
  if (onlyInIcons.length > 0) {
    log.warning(`ציוד עם אייקון בלבד (ללא עברית): ${onlyInIcons.join(", ")}`);
  }
  if (onlyInHebrew.length > 0) {
    log.warning(`ציוד עם עברית בלבד (ללא אייקון): ${onlyInHebrew.join(", ")}`);
  }
  if (onlyInIcons.length === 0 && onlyInHebrew.length === 0) {
    log.success("כל המיפויים מסונכרנים!");
  }

  // בדיקות דוגמה
  console.log("\n🧪 בדיקות דוגמה:");
  const testCases = [
    "dumbbells",
    "barbell",
    "resistance_bands",
    "kettlebell",
    "pull_up_bar",
    "bench",
  ];
  testCases.forEach((item) => {
    const icon = equipmentIconMapping[item] || "❓";
    const hebrew = equipmentHebrewNames[item] || "לא מוגדר";
    console.log(`  ${item}: ${icon} - ${hebrew}`);
  });

  console.log("\n" + "=".repeat(50));
  log.success("הבדיקה הושלמה בהצלחה!");
} catch (error) {
  console.error("\n" + "=".repeat(50));
  log.error(`שגיאה בהרצת הבדיקה: ${error.message}`);
  console.error("=".repeat(50));
  process.exit(1);
}
