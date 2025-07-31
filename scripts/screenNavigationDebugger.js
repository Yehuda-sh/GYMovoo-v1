/**
 * @file scripts/screenNavigationDebugger.js
 * @brief כלי דיבוג אינטראקטיבי למעבר בין מסכים ונתונים
 * @description מציג בצורה ויזואלית את זרימת הנתונים, שגיאות טעינה, ובעיות ניווט
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

class ScreenNavigationDebugger {
  constructor() {
    this.projectRoot = path.resolve(__dirname, "..");
    this.screens = {};
    this.navigationFlow = {};
    this.dataFlow = {};
    this.issues = [];
    this.currentScreen = null;

    // יצירת ממשק אינטראקטיבי
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("🔍 Screen Navigation Debugger v1.0");
    console.log("═".repeat(50));
    console.log("כלי דיבוג אינטראקטיבי למעבר בין מסכים\n");
  }

  // סריקת כל המסכים
  async scanAllScreens() {
    console.log("📱 סורק מסכים...");

    const screensPath = path.join(this.projectRoot, "src", "screens");
    if (!fs.existsSync(screensPath)) {
      this.addError("❌ תיקיית screens לא נמצאה");
      return;
    }

    const screenFiles = this.getAllFiles(screensPath, ".tsx");

    for (const screenFile of screenFiles) {
      const screenName = path.basename(screenFile, ".tsx");
      const content = fs.readFileSync(screenFile, "utf8");

      this.screens[screenName] = {
        file: screenFile,
        content: content,
        imports: this.extractImports(content),
        navigation: this.extractNavigationCalls(content),
        dataLoading: this.extractDataLoading(content),
        stateManagement: this.extractStateManagement(content),
        errors: this.findScreenErrors(content, screenName),
        props: this.extractPropsInterface(content),
      };
    }

    console.log(`✅ נמצאו ${Object.keys(this.screens).length} מסכים\n`);
  }

  // חילוץ imports
  extractImports(content) {
    const imports = [];
    const importRegex =
      /import\s+(?:{[^}]+}|\w+|(?:{[^}]+}\s*,\s*\w+))\s+from\s+['"]([^'"]+)['"]/g;
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      imports.push({
        statement: match[0],
        from: match[1],
        isLocal: match[1].startsWith("./") || match[1].startsWith("../"),
        isService: match[1].includes("service"),
        isComponent: match[1].includes("component"),
        isNavigation: match[1].includes("navigation"),
      });
    }

    return imports;
  }

  // חילוץ קריאות ניווט
  extractNavigationCalls(content) {
    const navCalls = [];
    const patterns = [
      /navigation\.navigate\(['"]([^'"]+)['"](?:,\s*({[^}]+}))?\)/g,
      /navigation\.push\(['"]([^'"]+)['"](?:,\s*({[^}]+}))?\)/g,
      /navigation\.replace\(['"]([^'"]+)['"](?:,\s*({[^}]+}))?\)/g,
      /navigation\.goBack\(\)/g,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        navCalls.push({
          type: match[0].includes("navigate")
            ? "navigate"
            : match[0].includes("push")
              ? "push"
              : match[0].includes("replace")
                ? "replace"
                : "goBack",
          target: match[1] || "back",
          params: match[2] || null,
          fullCall: match[0],
        });
      }
    });

    return navCalls;
  }

  // חילוץ טעינת נתונים
  extractDataLoading(content) {
    const dataLoading = {
      useEffect: [],
      asyncCalls: [],
      apiCalls: [],
      stateUpdates: [],
    };

    // useEffect calls
    const effectRegex = /useEffect\(\s*\(\)\s*=>\s*{([^}]+)}/g;
    let match;
    while ((match = effectRegex.exec(content)) !== null) {
      dataLoading.useEffect.push(match[1].trim());
    }

    // Async calls
    const asyncRegex = /const\s+(\w+)\s*=\s*async\s*\([^)]*\)/g;
    while ((match = asyncRegex.exec(content)) !== null) {
      dataLoading.asyncCalls.push(match[1]);
    }

    // API calls
    const apiRegex = /(fetch|axios|api\.\w+)\(/g;
    while ((match = apiRegex.exec(content)) !== null) {
      dataLoading.apiCalls.push(match[1]);
    }

    // State updates
    const stateRegex = /set(\w+)\(/g;
    while ((match = stateRegex.exec(content)) !== null) {
      dataLoading.stateUpdates.push(`set${match[1]}`);
    }

    return dataLoading;
  }

  // חילוץ ניהול state
  extractStateManagement(content) {
    const state = {
      useState: [],
      useContext: [],
      customHooks: [],
      props: [],
    };

    // useState
    const stateRegex = /const\s*\[([^,]+),\s*([^\]]+)\]\s*=\s*useState/g;
    let match;
    while ((match = stateRegex.exec(content)) !== null) {
      state.useState.push({
        variable: match[1].trim(),
        setter: match[2].trim(),
      });
    }

    // useContext
    const contextRegex = /useContext\(([^)]+)\)/g;
    while ((match = contextRegex.exec(content)) !== null) {
      state.useContext.push(match[1]);
    }

    // Custom hooks
    const hookRegex = /use[A-Z]\w+\(/g;
    while ((match = hookRegex.exec(content)) !== null) {
      state.customHooks.push(match[0].slice(0, -1));
    }

    return state;
  }

  // חילוץ ממשק Props
  extractPropsInterface(content) {
    const propsMatch = content.match(/interface\s+(\w+Props)\s*{([^}]+)}/);
    if (propsMatch) {
      return {
        name: propsMatch[1],
        definition: propsMatch[2].trim(),
      };
    }
    return null;
  }

  // מציאת שגיאות במסך
  findScreenErrors(content, screenName) {
    const errors = [];

    // בדיקת imports חסרים
    if (content.includes("navigation.") && !content.includes("useNavigation")) {
      errors.push("❌ חסר import של useNavigation");
    }

    // בדיקת React imports
    if (content.includes("useState") && !content.includes("import React")) {
      errors.push("⚠️ ייתכן שחסר import של React hooks");
    }

    // בדיקת טיפול בשגיאות
    if (content.includes("fetch(") && !content.includes("catch")) {
      errors.push("⚠️ חסר טיפול בשגיאות API");
    }

    // בדיקת loading states
    if (content.includes("fetch(") && !content.includes("loading")) {
      errors.push("⚠️ חסר loading state");
    }

    // בדיקת TypeScript
    if (!content.includes("interface") && !content.includes("type")) {
      errors.push("⚠️ חסרים הגדרות TypeScript");
    }

    return errors;
  }

  // הצגת מסך ספציפי
  displayScreen(screenName) {
    const screen = this.screens[screenName];
    if (!screen) {
      console.log(`❌ מסך ${screenName} לא נמצא`);
      return;
    }

    console.clear();
    console.log("📱 מסך: " + screenName);
    console.log("═".repeat(40));

    // בעיות במסך
    if (screen.errors.length > 0) {
      console.log("\n🚨 בעיות זוהו:");
      screen.errors.forEach((error, i) => {
        console.log(`${i + 1}. ${error}`);
      });
    }

    // Navigation
    console.log("\n🧭 ניווט:");
    if (screen.navigation.length > 0) {
      screen.navigation.forEach((nav, i) => {
        console.log(`${i + 1}. ${nav.type} → ${nav.target}`);
        if (nav.params) {
          console.log(`   📦 פרמטרים: ${nav.params}`);
        }
      });
    } else {
      console.log("   אין קריאות ניווט");
    }

    // Data Loading
    console.log("\n💾 טעינת נתונים:");
    const data = screen.dataLoading;
    if (data.useEffect.length > 0) {
      console.log(`   🔄 useEffect: ${data.useEffect.length} calls`);
    }
    if (data.asyncCalls.length > 0) {
      console.log(`   ⚡ Async functions: ${data.asyncCalls.join(", ")}`);
    }
    if (data.apiCalls.length > 0) {
      console.log(`   🌐 API calls: ${data.apiCalls.join(", ")}`);
    }
    if (data.stateUpdates.length > 0) {
      console.log(
        `   📊 State updates: ${data.stateUpdates.slice(0, 5).join(", ")}`
      );
    }

    // State Management
    console.log("\n🎛️ ניהול State:");
    const state = screen.stateManagement;
    if (state.useState.length > 0) {
      console.log(`   📊 useState: ${state.useState.length} variables`);
      state.useState.slice(0, 3).forEach((s) => {
        console.log(`      • ${s.variable} / ${s.setter}`);
      });
    }

    // Props Interface
    if (screen.props) {
      console.log("\n🏷️ Props Interface:");
      console.log(`   interface ${screen.props.name}`);
    }

    console.log("\n" + "─".repeat(40));
  }

  // ניתוח זרימת נתונים בין מסכים
  analyzeDataFlow() {
    console.log("\n🌊 ניתוח זרימת נתונים בין מסכים:");
    console.log("═".repeat(45));

    const flows = {};

    Object.entries(this.screens).forEach(([screenName, screen]) => {
      screen.navigation.forEach((nav) => {
        if (nav.params) {
          if (!flows[screenName]) flows[screenName] = [];
          flows[screenName].push({
            to: nav.target,
            data: nav.params,
          });
        }
      });
    });

    Object.entries(flows).forEach(([from, destinations]) => {
      console.log(`\n📱 ${from}:`);
      destinations.forEach((dest) => {
        console.log(`   → ${dest.to}: ${dest.data}`);
      });
    });
  }

  // בדיקת תלויות וקישוריות
  checkDependencies() {
    console.log("\n🔗 בדיקת תלויות וקישוריות:");
    console.log("═".repeat(35));

    const dependencies = {};
    const missingDeps = [];

    Object.entries(this.screens).forEach(([screenName, screen]) => {
      dependencies[screenName] = {
        services: screen.imports.filter((imp) => imp.isService).length,
        components: screen.imports.filter((imp) => imp.isComponent).length,
        local: screen.imports.filter((imp) => imp.isLocal).length,
        navigation: screen.imports.filter((imp) => imp.isNavigation).length,
      };

      // בדיקת תלויות חסרות
      screen.navigation.forEach((nav) => {
        if (nav.target !== "back" && !this.screens[nav.target + "Screen"]) {
          missingDeps.push(`${screenName} → ${nav.target}: מסך יעד לא נמצא`);
        }
      });
    });

    // הצגת תלויות
    Object.entries(dependencies).forEach(([screen, deps]) => {
      console.log(`📱 ${screen}:`);
      console.log(`   🔧 Services: ${deps.services}`);
      console.log(`   🧩 Components: ${deps.components}`);
      console.log(`   📁 Local imports: ${deps.local}`);
    });

    // הצגת תלויות חסרות
    if (missingDeps.length > 0) {
      console.log("\n🚨 תלויות חסרות:");
      missingDeps.forEach((dep) => console.log(`   ${dep}`));
    }
  }

  // ממשק אינטראקטיבי
  async startInteractiveMode() {
    await this.scanAllScreens();

    while (true) {
      console.log("\n🎮 בחר פעולה:");
      console.log("1. הצג מסך ספציפי");
      console.log("2. רשימת כל המסכים");
      console.log("3. ניתוח זרימת נתונים");
      console.log("4. בדיקת תלויות");
      console.log("5. חיפוש בעיות");
      console.log("6. יציאה");

      const choice = await this.getUserInput("\nבחר אפשרות (1-6): ");

      switch (choice) {
        case "1":
          const screenName = await this.getUserInput("שם המסך: ");
          this.displayScreen(screenName);
          break;

        case "2":
          this.listAllScreens();
          break;

        case "3":
          this.analyzeDataFlow();
          break;

        case "4":
          this.checkDependencies();
          break;

        case "5":
          this.findAllIssues();
          break;

        case "6":
          console.log("👋 יציאה...");
          this.rl.close();
          return;

        default:
          console.log("⚠️ בחירה לא תקינה");
      }

      await this.getUserInput("\n📱 לחץ Enter להמשך...");
    }
  }

  // רשימת כל המסכים
  listAllScreens() {
    console.log("\n📱 רשימת כל המסכים:");
    console.log("═".repeat(25));

    Object.entries(this.screens).forEach(([name, screen], index) => {
      const errorCount = screen.errors.length;
      const navCount = screen.navigation.length;
      const stateCount = screen.stateManagement.useState.length;

      const status = errorCount > 0 ? "🔴" : navCount > 0 ? "🟢" : "🟡";

      console.log(`${index + 1}. ${status} ${name}`);
      console.log(
        `   📊 State: ${stateCount} | 🧭 Nav: ${navCount} | ⚠️ Issues: ${errorCount}`
      );
    });
  }

  // חיפוש כל הבעיות
  findAllIssues() {
    console.log("\n🔍 חיפוש בעיות במערכת:");
    console.log("═".repeat(30));

    let totalIssues = 0;

    Object.entries(this.screens).forEach(([name, screen]) => {
      if (screen.errors.length > 0) {
        console.log(`\n📱 ${name}:`);
        screen.errors.forEach((error, i) => {
          console.log(`${i + 1}. ${error}`);
          totalIssues++;
        });
      }
    });

    // בדיקות נוספות
    console.log("\n🔍 בדיקות נוספות:");

    // מסכים ללא ניווט
    const screensWithoutNav = Object.entries(this.screens).filter(
      ([name, screen]) =>
        screen.navigation.length === 0 && !name.includes("Modal")
    );

    if (screensWithoutNav.length > 0) {
      console.log("\n⚠️ מסכים ללא ניווט:");
      screensWithoutNav.forEach(([name]) => {
        console.log(`   • ${name}`);
        totalIssues++;
      });
    }

    // מסכים ללא state management
    const screensWithoutState = Object.entries(this.screens).filter(
      ([name, screen]) => screen.stateManagement.useState.length === 0
    );

    if (screensWithoutState.length > 0) {
      console.log("\n⚠️ מסכים ללא state management:");
      screensWithoutState.forEach(([name]) => {
        console.log(`   • ${name}`);
      });
    }

    console.log(`\n📊 סה"כ בעיות נמצאו: ${totalIssues}`);
  }

  // קבלת קלט מהמשתמש
  getUserInput(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  // פונקציות עזר
  getAllFiles(dirPath, extension) {
    let results = [];

    try {
      const files = fs.readdirSync(dirPath);

      files.forEach((file) => {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          results = results.concat(this.getAllFiles(filePath, extension));
        } else if (file.endsWith(extension)) {
          results.push(filePath);
        }
      });
    } catch (error) {
      // תיקייה לא נגישה
    }

    return results;
  }

  addError(message) {
    console.log(message);
    this.issues.push(message);
  }

  // הפעלה עיקרית
  async run() {
    try {
      await this.startInteractiveMode();
    } catch (error) {
      console.error("❌ שגיאה:", error.message);
      this.rl.close();
    }
  }
}

// בדיקה אם הסקריפט רץ ישירות
if (require.main === module) {
  const navDebugger = new ScreenNavigationDebugger();
  navDebugger.run();
}

module.exports = ScreenNavigationDebugger;
