// check-types.js
// כלי בדיקה לאחידות טיפוסים בפרויקט TypeScript
// מריץ חיפוש כפילויות, ייבוא לא אחיד, ושימוש ב-any

const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "src");
const TYPE_PATTERNS = [
  /interface\s+(\w+)/g,
  /type\s+(\w+)/g,
  /export\s+(interface|type)\s+(\w+)/g,
];
const IMPORT_PATTERNS = [
  /import\s+\{?\s*([\w,\s]+)\s*\}?\s+from\s+['"](.*types.*)['"]/g,
  /import\s+type\s+\{?\s*([\w,\s]+)\s*\}?\s+from\s+['"](.*types.*)['"]/g,
];
const ANY_PATTERN = /:\s*any[\s;\)]/g;

function walk(dir, cb) {
  fs.readdirSync(dir).forEach((f) => {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, cb);
    else if (f.endsWith(".ts") || f.endsWith(".tsx")) cb(p);
  });
}

const typeDefs = {};
const typeImports = {};
const anyUsages = [];

walk(SRC_DIR, (file) => {
  const content = fs.readFileSync(file, "utf8");

  // חיפוש טיפוסים
  TYPE_PATTERNS.forEach((pat) => {
    let m;
    while ((m = pat.exec(content))) {
      const name = m[1] || m[2];
      if (!typeDefs[name]) typeDefs[name] = [];
      typeDefs[name].push(file);
    }
  });

  // חיפוש ייבוא טיפוסים
  IMPORT_PATTERNS.forEach((pat) => {
    let m;
    while ((m = pat.exec(content))) {
      const names = m[1].split(",").map((n) => n.trim());
      names.forEach((name) => {
        if (!typeImports[name]) typeImports[name] = [];
        typeImports[name].push(file);
      });
    }
  });

  // חיפוש any
  let m;
  while ((m = ANY_PATTERN.exec(content))) {
    anyUsages.push({ file, index: m.index });
  }
});

console.log("--- כפילויות טיפוסים ---");
Object.entries(typeDefs).forEach(([name, files]) => {
  if (files.length > 1) {
    console.log(`טיפוס כפול: ${name} -> ${files.join(", ")}`);
  }
});

console.log("\n--- ייבוא טיפוסים לא אחיד ---");
Object.entries(typeImports).forEach(([name, files]) => {
  if (files.length > 1) {
    console.log(`ייבוא טיפוס: ${name} -> ${files.join(", ")}`);
  }
});

console.log("\n--- שימושים ב-any ---");
anyUsages.forEach(({ file, index }) => {
  console.log(`any ב-${file} (index ${index})`);
});

console.log("\nבדיקה הסתיימה!");
