/**
 * @file scripts/checkNavigation.js
 * @brief כלי בדיקה לניווט - בודק שכל הקישורים והמסכים מחוברים
 * @dependencies Node.js, fs
 * @notes רץ עם: node scripts/checkNavigation.js
 */

const fs = require("fs");
const path = require("path");

console.log("🔍 בודק ניווט הפרויקט...\n");

// קריאת קובץ AppNavigator
const appNavigatorPath = path.join(
  __dirname,
  "../src/navigation/AppNavigator.tsx"
);
const appNavigatorContent = fs.readFileSync(appNavigatorPath, "utf8");

// חילוץ כל ה-routes מה-RootStackParamList
const routesMatch = appNavigatorContent.match(
  /export type RootStackParamList = \{([\s\S]*?)\};/
);
if (!routesMatch) {
  console.error("❌ לא ניתן למצוא RootStackParamList");
  process.exit(1);
}

const routesContent = routesMatch[1];
const routes = [];
const routeMatches = routesContent.matchAll(/^\s*(\w+):/gm);
for (const match of routeMatches) {
  routes.push(match[1]);
}

console.log("📱 Routes שנמצאו:", routes.join(", "));

// חילוץ כל ה-Screen components
const screenMatches = appNavigatorContent.matchAll(
  /<Stack\.Screen\s+name="(\w+)"/g
);
const screenComponents = [];
for (const match of screenMatches) {
  screenComponents.push(match[1]);
}

console.log("🖥️  Screen components:", screenComponents.join(", "));

// בדיקה שכל route יש לו screen component
console.log("\n🔗 בדיקת התאמה:");
let hasErrors = false;

routes.forEach((route) => {
  if (!screenComponents.includes(route)) {
    console.error(`❌ Route "${route}" חסר Screen component`);
    hasErrors = true;
  } else {
    console.log(`✅ ${route} - מחובר`);
  }
});

// בדיקת קישורי ניווט בקוד
console.log("\n🧭 בדיקת קישורי ניווט:");

const searchDirs = ["src/screens", "src/components"];

const navigationCalls = new Set();

function searchNavigationCalls(dir) {
  const fullPath = path.join(__dirname, "..", dir);
  if (!fs.existsSync(fullPath)) return;

  const files = fs.readdirSync(fullPath, { withFileTypes: true });

  files.forEach((file) => {
    if (file.isDirectory()) {
      searchNavigationCalls(path.join(dir, file.name));
    } else if (file.name.endsWith(".tsx") || file.name.endsWith(".ts")) {
      const filePath = path.join(fullPath, file.name);
      const content = fs.readFileSync(filePath, "utf8");

      // חיפוש navigation.navigate calls
      const navigateMatches = content.matchAll(
        /navigation\.navigate\(["'](\w+)["']/g
      );
      for (const match of navigateMatches) {
        navigationCalls.add(match[1]);
      }
    }
  });
}

searchDirs.forEach(searchNavigationCalls);

console.log("🎯 קריאות ניווט שנמצאו:", Array.from(navigationCalls).join(", "));

// בדיקה שכל קריאת ניווט מצביעה על route קיים
console.log("\n🎯 בדיקת תקינות קריאות ניווט:");
navigationCalls.forEach((call) => {
  if (!routes.includes(call)) {
    console.error(`❌ קריאת ניווט "${call}" מצביעה על route שלא קיים`);
    hasErrors = true;
  } else {
    console.log(`✅ ${call} - תקין`);
  }
});

// בדיקת imports של מסכים
console.log("\n📦 בדיקת imports:");
const importMatches = appNavigatorContent.matchAll(
  /import\s+(\w+)\s+from\s+["']([^"']+)["']/g
);
const screenImports = [];

for (const match of importMatches) {
  if (match[2].includes("screens/")) {
    screenImports.push({
      name: match[1],
      path: match[2],
    });
  }
}

screenImports.forEach((imp) => {
  const fullPath = path.join(__dirname, "..", imp.path + ".tsx");
  if (fs.existsSync(fullPath)) {
    console.log(`✅ ${imp.name} - קובץ קיים`);
  } else {
    console.error(`❌ ${imp.name} - קובץ לא קיים: ${imp.path}.tsx`);
    hasErrors = true;
  }
});

// סיכום
console.log("\n📊 סיכום:");
console.log(`📱 סה"כ routes: ${routes.length}`);
console.log(`🖥️  סה"כ screen components: ${screenComponents.length}`);
console.log(`🎯 סה"כ קריאות ניווט: ${navigationCalls.size}`);
console.log(`📦 סה"כ imports של מסכים: ${screenImports.length}`);

if (hasErrors) {
  console.log("\n❌ נמצאו שגיאות בניווט!");
  process.exit(1);
} else {
  console.log("\n✅ כל הניווט תקין!");
}

// הצעות לשיפור
console.log("\n💡 הצעות לשיפור:");
console.log("1. הוסף type safety לקריאות ניווט");
console.log("2. צור navigation hooks מותאמים");
console.log("3. הוסף tests אוטומטיים לניווט");
console.log("4. צור documentation לכל המסכים");
