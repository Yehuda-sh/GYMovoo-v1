/**
 * @file scripts/dataFlowVisualizer.js
 * @brief כלי ויזואליזציה של זרימת נתונים בין מסכים
 * @description מציג גרף ויזואלי של איך נתונים זורמים, נטענים ומעובדים במסכים
 */

const fs = require("fs");
const path = require("path");

class DataFlowVisualizer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, "..");
    this.screens = {};
    this.dataFlow = {};
    this.services = {};
    this.issues = [];

    console.log("📊 Data Flow Visualizer - ויזואליזציית זרימת נתונים");
    console.log("═".repeat(55));
  }

  // סריקת Services
  async scanServices() {
    console.log("🔧 סורק Services...");

    const servicesPath = path.join(this.projectRoot, "src", "services");
    if (!fs.existsSync(servicesPath)) {
      console.log("⚠️ תיקיית services לא נמצאה");
      return;
    }

    const serviceFiles = this.getAllFiles(servicesPath, ".ts");

    serviceFiles.forEach((serviceFile) => {
      const serviceName = path.basename(serviceFile, ".ts");
      const content = fs.readFileSync(serviceFile, "utf8");

      this.services[serviceName] = {
        file: serviceFile,
        functions: this.extractServiceFunctions(content),
        exports: this.extractExports(content),
        dependencies: this.extractServiceDependencies(content),
      };
    });

    console.log(`✅ נמצאו ${Object.keys(this.services).length} services\n`);
  }

  // חילוץ פונקציות מ-service
  extractServiceFunctions(content) {
    const functions = [];

    // פונקציות רגילות
    const funcRegex =
      /(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\([^)]*\)/g;
    let match;
    while ((match = funcRegex.exec(content)) !== null) {
      functions.push({
        name: match[1],
        type: "function",
        isAsync: match[0].includes("async"),
        isExported: match[0].includes("export"),
      });
    }

    // Arrow functions
    const arrowRegex =
      /(?:export\s+)?const\s+(\w+)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/g;
    while ((match = arrowRegex.exec(content)) !== null) {
      functions.push({
        name: match[1],
        type: "arrow",
        isAsync: match[0].includes("async"),
        isExported: match[0].includes("export"),
      });
    }

    return functions;
  }

  // חילוץ exports
  extractExports(content) {
    const exports = [];

    // Named exports
    const namedExportRegex = /export\s*{\s*([^}]+)\s*}/g;
    let match;
    while ((match = namedExportRegex.exec(content)) !== null) {
      const items = match[1].split(",").map((item) => item.trim());
      exports.push(...items);
    }

    // Default export
    const defaultExportRegex = /export\s+default\s+(\w+)/g;
    while ((match = defaultExportRegex.exec(content)) !== null) {
      exports.push(`default: ${match[1]}`);
    }

    return exports;
  }

  // חילוץ תלויות של service
  extractServiceDependencies(content) {
    const deps = [];

    // API calls
    if (content.includes("fetch(") || content.includes("axios")) {
      deps.push("HTTP_API");
    }

    // AsyncStorage
    if (content.includes("AsyncStorage")) {
      deps.push("ASYNC_STORAGE");
    }

    // Other services
    const serviceImports = content.match(/from\s+['"][^'"]*service[^'"]*['"]/g);
    if (serviceImports) {
      deps.push(
        ...serviceImports.map((imp) => imp.replace(/.*\/(\w+)['"]/g, "$1"))
      );
    }

    return deps;
  }

  // סריקת מסכים עם מיקוד על נתונים
  async scanScreensForData() {
    console.log("📱 סורק מסכים עבור זרימת נתונים...");

    const screensPath = path.join(this.projectRoot, "src", "screens");
    if (!fs.existsSync(screensPath)) {
      console.log("❌ תיקיית screens לא נמצאה");
      return;
    }

    // סריקה רקורסיבית של כל קובצי .tsx במסכים
    const screenFiles = this.getAllFiles(screensPath, ".tsx");

    console.log(`🔍 נמצאו ${screenFiles.length} קבצי מסך`);

    screenFiles.forEach((screenFile) => {
      const relativePath = path.relative(
        path.join(this.projectRoot, "src", "screens"),
        screenFile
      );
      const screenName = relativePath
        .replace(/[\\//]/g, "_")
        .replace(".tsx", "");
      const content = fs.readFileSync(screenFile, "utf8");

      this.screens[screenName] = {
        file: screenFile,
        relativePath: relativePath,
        dataLoaders: this.extractDataLoaders(content),
        stateVariables: this.extractStateVariables(content),
        serviceUsage: this.extractServiceUsage(content),
        dataRendering: this.extractDataRendering(content),
        errorHandling: this.extractErrorHandling(content),
        loadingStates: this.extractLoadingStates(content),
        navigationParams: this.extractNavigationParams(content),
      };
    });

    console.log(`✅ נמצאו ${Object.keys(this.screens).length} מסכים\n`);
  }

  // חילוץ Data Loaders
  extractDataLoaders(content) {
    const loaders = [];

    // useEffect with data loading
    const effectRegex =
      /useEffect\(\s*\(\)\s*=>\s*\{([^}]+(?:\{[^}]+\}[^}]+)*)\}/g;
    let match;
    while ((match = effectRegex.exec(content)) !== null) {
      const effectBody = match[1];
      if (
        effectBody.includes("fetch") ||
        effectBody.includes("get") ||
        effectBody.includes("load")
      ) {
        loaders.push({
          type: "useEffect",
          content: effectBody.trim().substring(0, 100) + "...",
          hasAPI: effectBody.includes("fetch") || effectBody.includes("api"),
          hasAsync:
            effectBody.includes("async") || effectBody.includes("await"),
        });
      }
    }

    // Direct function calls
    const functionCallRegex = /(\w+Service\.\w+|\w+\.get\w+|\w+\.fetch\w+)\(/g;
    while ((match = functionCallRegex.exec(content)) !== null) {
      loaders.push({
        type: "serviceCall",
        content: match[1],
        hasAPI: true,
        hasAsync: true,
      });
    }

    return loaders;
  }

  // חילוץ משתני State
  extractStateVariables(content) {
    const stateVars = [];

    const stateRegex =
      /const\s*\[([^,]+),\s*([^\]]+)\]\s*=\s*useState\(([^)]*)\)/g;
    let match;
    while ((match = stateRegex.exec(content)) !== null) {
      stateVars.push({
        variable: match[1].trim(),
        setter: match[2].trim(),
        initialValue: match[3].trim(),
        isLoading: match[1].includes("loading") || match[1].includes("Loading"),
        isData:
          match[1].includes("data") ||
          match[1].includes("Data") ||
          match[1].includes("list"),
        isError: match[1].includes("error") || match[1].includes("Error"),
      });
    }

    return stateVars;
  }

  // חילוץ שימוש ב-Services
  extractServiceUsage(content) {
    const usage = [];

    // Import statements
    const serviceImports = content.match(
      /import\s+{[^}]+}\s+from\s+['"][^'"]*service[^'"]*['"]/g
    );
    if (serviceImports) {
      serviceImports.forEach((imp) => {
        const serviceName = imp.match(/from\s+['"][^'"]*\/(\w+)['"]/);
        const functions = imp.match(/{\s*([^}]+)\s*}/);

        if (serviceName && functions) {
          usage.push({
            service: serviceName[1],
            functions: functions[1].split(",").map((f) => f.trim()),
            importStatement: imp,
          });
        }
      });
    }

    return usage;
  }

  // חילוץ רינדור נתונים
  extractDataRendering(content) {
    const rendering = [];

    // FlatList/ScrollView
    if (content.includes("FlatList")) {
      const flatListRegex = /FlatList[^>]*data=\{([^}]+)\}/g;
      let match;
      while ((match = flatListRegex.exec(content)) !== null) {
        rendering.push({
          type: "FlatList",
          dataSource: match[1].trim(),
        });
      }
    }

    // Map operations
    const mapRegex = /(\w+)\.map\(/g;
    let match;
    while ((match = mapRegex.exec(content)) !== null) {
      rendering.push({
        type: "map",
        dataSource: match[1],
      });
    }

    // Conditional rendering
    if (content.includes("?") && content.includes(":")) {
      const conditionalRegex = /(\w+)\s*\?\s*[^:]+:/g;
      while ((match = conditionalRegex.exec(content)) !== null) {
        rendering.push({
          type: "conditional",
          condition: match[1],
        });
      }
    }

    return rendering;
  }

  // חילוץ טיפול בשגיאות
  extractErrorHandling(content) {
    const errorHandling = [];

    // Try-catch blocks
    const tryCatchRegex =
      /try\s*\{([^}]+(?:\{[^}]+\}[^}]+)*)\}\s*catch\s*\([^)]*\)\s*\{([^}]+(?:\{[^}]+\}[^}]+)*)\}/g;
    let match;
    while ((match = tryCatchRegex.exec(content)) !== null) {
      errorHandling.push({
        type: "try-catch",
        tryBlock: match[1].trim().substring(0, 50) + "...",
        catchBlock: match[2].trim().substring(0, 50) + "...",
      });
    }

    // Error state variables
    const errorStateRegex = /\[(\w*[Ee]rror\w*),\s*set\w*[Ee]rror\w*\]/g;
    while ((match = errorStateRegex.exec(content)) !== null) {
      errorHandling.push({
        type: "errorState",
        variable: match[1],
      });
    }

    return errorHandling;
  }

  // חילוץ Loading States
  extractLoadingStates(content) {
    const loadingStates = [];

    const loadingRegex = /\[(\w*[Ll]oading\w*),\s*set\w*[Ll]oading\w*\]/g;
    let match;
    while ((match = loadingRegex.exec(content)) !== null) {
      loadingStates.push({
        variable: match[1],
        hasSpinner:
          content.includes("ActivityIndicator") || content.includes("Spinner"),
        hasText: content.includes("טוען") || content.includes("Loading"),
      });
    }

    return loadingStates;
  }

  // חילוץ פרמטרי ניווט
  extractNavigationParams(content) {
    const params = [];

    // Route params
    const routeParamsRegex = /route\.params\.(\w+)/g;
    let match;
    while ((match = routeParamsRegex.exec(content)) !== null) {
      params.push({
        type: "received",
        name: match[1],
      });
    }

    // Navigation calls with params
    const navParamsRegex = /navigation\.navigate\([^,]+,\s*(\{[^}]+\})/g;
    while ((match = navParamsRegex.exec(content)) !== null) {
      params.push({
        type: "sent",
        params: match[1],
      });
    }

    return params;
  }

  // יצירת ויזואליזציה של זרימת נתונים
  visualizeDataFlow() {
    console.log("🌊 ויזואליזציית זרימת נתונים:");
    console.log("═".repeat(35));

    Object.entries(this.screens).forEach(([screenName, screen]) => {
      console.log(`\n📱 ${screenName}:`);

      // Data Loading
      if (screen.dataLoaders.length > 0) {
        console.log("  📥 טעינת נתונים:");
        screen.dataLoaders.forEach((loader, i) => {
          const icon = loader.hasAPI ? "🌐" : "💾";
          console.log(
            `    ${i + 1}. ${icon} ${loader.type}: ${loader.content.substring(0, 40)}...`
          );
        });
      }

      // State Management
      if (screen.stateVariables.length > 0) {
        console.log("  🎛️ State Variables:");
        screen.stateVariables.forEach((state) => {
          const icon = state.isLoading
            ? "⏳"
            : state.isData
              ? "📊"
              : state.isError
                ? "❌"
                : "📋";
          console.log(
            `    ${icon} ${state.variable} (initial: ${state.initialValue})`
          );
        });
      }

      // Service Usage
      if (screen.serviceUsage.length > 0) {
        console.log("  🔧 Services:");
        screen.serviceUsage.forEach((service) => {
          console.log(
            `    📦 ${service.service}: ${service.functions.join(", ")}`
          );
        });
      }

      // Error Handling
      if (screen.errorHandling.length > 0) {
        console.log("  🛡️ טיפול בשגיאות:");
        screen.errorHandling.forEach((error) => {
          const icon = error.type === "try-catch" ? "🔄" : "❌";
          console.log(`    ${icon} ${error.type}`);
        });
      } else {
        console.log("  ⚠️ אין טיפול בשגיאות");
      }

      // Loading States
      if (screen.loadingStates.length > 0) {
        console.log("  ⏳ Loading States:");
        screen.loadingStates.forEach((loading) => {
          const ui = loading.hasSpinner ? "🔄" : loading.hasText ? "📝" : "❓";
          console.log(`    ${ui} ${loading.variable}`);
        });
      }
    });
  }

  // בדיקת בעיות בזרימת נתונים
  findDataFlowIssues() {
    console.log("\n🔍 בדיקת בעיות בזרימת נתונים:");
    console.log("═".repeat(40));

    const issues = [];

    Object.entries(this.screens).forEach(([screenName, screen]) => {
      // מסכים עם טעינת נתונים בלי loading state
      if (screen.dataLoaders.length > 0 && screen.loadingStates.length === 0) {
        issues.push(`⚠️ ${screenName}: טוען נתונים בלי loading state`);
      }

      // מסכים עם טעינת נתונים בלי טיפול בשגיאות
      if (screen.dataLoaders.length > 0 && screen.errorHandling.length === 0) {
        issues.push(`❌ ${screenName}: טוען נתונים בלי טיפול בשגיאות`);
      }

      // מסכים עם הרבה state variables
      if (screen.stateVariables.length > 8) {
        issues.push(
          `⚠️ ${screenName}: יותר מדי state variables (${screen.stateVariables.length})`
        );
      }

      // מסכים בלי data rendering
      if (
        screen.stateVariables.some((s) => s.isData) &&
        screen.dataRendering.length === 0
      ) {
        issues.push(`⚠️ ${screenName}: יש נתונים אבל לא מציג אותם`);
      }
    });

    if (issues.length > 0) {
      issues.forEach((issue) => console.log(issue));
    } else {
      console.log("✅ לא נמצאו בעיות בזרימת נתונים");
    }

    return issues;
  }

  // יצירת מפת קישוריות
  createConnectivityMap() {
    console.log("\n🗺️ מפת קישוריות Services ← → Screens:");
    console.log("═".repeat(45));

    // Services ← Screens
    Object.entries(this.services).forEach(([serviceName, service]) => {
      const usingScreens = Object.entries(this.screens)
        .filter(([_, screen]) =>
          screen.serviceUsage.some((usage) =>
            usage.service.toLowerCase().includes(serviceName.toLowerCase())
          )
        )
        .map(([screenName]) => screenName);

      if (usingScreens.length > 0) {
        console.log(`\n🔧 ${serviceName}:`);
        console.log(`   📊 Functions: ${service.functions.length}`);
        console.log(`   📱 Used by: ${usingScreens.join(", ")}`);
      }
    });

    // Screens without services
    const screensWithoutServices = Object.entries(this.screens)
      .filter(([_, screen]) => screen.serviceUsage.length === 0)
      .map(([screenName]) => screenName);

    if (screensWithoutServices.length > 0) {
      console.log("\n⚠️ מסכים בלי services:");
      screensWithoutServices.forEach((screen) =>
        console.log(`   📱 ${screen}`)
      );
    }
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

  // הפעלה עיקרית
  async run() {
    try {
      console.log("🚀 מתחיל ויזואליזציית זרימת נתונים...");

      await this.scanServices();
      await this.scanScreensForData();

      if (Object.keys(this.screens).length === 0) {
        console.log("⚠️ לא נמצאו מסכים לניתוח");
        return;
      }

      this.visualizeDataFlow();
      this.findDataFlowIssues();
      this.createConnectivityMap();

      console.log("\n📊 סיום ויזואליזציית זרימת נתונים");
      console.log("═".repeat(40));
    } catch (error) {
      console.error("❌ שגיאה:", error.message);
      console.error("Stack:", error.stack);
    }
  }
}

// הפעלה
if (require.main === module) {
  const visualizer = new DataFlowVisualizer();
  visualizer.run();
}

module.exports = DataFlowVisualizer;
