/**
 * @file scripts/validateExercises.js
 * @description Static validation for exercise data integrity.
 */

const path = require("path");
const fs = require("fs");

const COLORS = {
  GREEN: "\x1b[32m",
  RED: "\x1b[31m",
  YELLOW: "\x1b[33m",
  CYAN: "\x1b[36m",
  RESET: "\x1b[0m",
  BOLD: "\x1b[1m",
};

function loadModule(p) {
  try {
    return require(p);
  } catch (e) {
    console.error(COLORS.RED + `Cannot load ${p}: ${e.message}` + COLORS.RESET);
    process.exit(1);
  }
}

function main() {
  const exercisesIndexPath = path.join(
    __dirname,
    "..",
    "src",
    "data",
    "exercises"
  );
  const equipmentPath = path.join(
    __dirname,
    "..",
    "src",
    "data",
    "equipmentData.ts"
  );

  // dynamic transpile not set; rely on ts -> use simple regex extraction by requiring compiled? (ts not compiled). We'll fallback to using runtime for JS only data (exercise index is TS but pure data). Using ts-node not desired; instead require ts via esbuild-register if available.

  // Lightweight parser: read index.ts and category files to build exercise array.
  const categoryFiles = [
    "bodyweight.ts",
    "dumbbells.ts",
    "cardio.ts",
    "flexibility.ts",
    "resistanceBands.ts",
  ];
  const allExercises = [];
  const idSet = new Set();
  const errors = [];
  const warnings = [];

  function parseArrayLiteral(content, exportName) {
    // naive split by '},' boundaries inside array assigned to export const <name>:
    const match = content.match(
      new RegExp(
        `export const ${exportName}:[^{]*= \\[(\\[\\s\\S]*?\\])?([\\s\\S]*?)\\];`
      )
    );
    // fallback: find first '[' after export
    const arraySection = content.split("export const " + exportName)[1];
    if (!arraySection) return [];
    const bracketStart = arraySection.indexOf("[");
    const bracketEnd = arraySection.indexOf("\n];");
    if (bracketStart === -1 || bracketEnd === -1) return [];
    const arrBody = arraySection.slice(bracketStart + 1, bracketEnd);
    // crude split by '\n  },' pattern
    const rawItems = arrBody
      .split(/\},\s*\n/)
      .map((s) => (s.trim().endsWith("}") ? s.trim() : s.trim() + "}"))
      .filter((s) => s.includes("id:"));
    const objs = rawItems.map((block) => {
      // Very naive field extraction
      const id = (block.match(/id:\s*"([^"]+)"/) || [])[1];
      const equipment = (block.match(/equipment:\s*"([^"]+)"/) || [])[1];
      const category = (block.match(/category:\s*"([^"]+)"/) || [])[1];
      const difficulty = (block.match(/difficulty:\s*"([^"]+)"/) || [])[1];
      return { id, equipment, category, difficulty, _raw: block };
    });
    return objs;
  }

  for (const file of categoryFiles) {
    const full = path.join(exercisesIndexPath, file);
    if (!fs.existsSync(full)) {
      warnings.push(`Missing category file ${file}`);
      continue;
    }
    const content = fs.readFileSync(full, "utf8");
    // export const <name>Exercises: Exercise[] = [
    const exportName = file.replace(".ts", "");
    const arrayName = exportName + "Exercises";
    const items = parseArrayLiteral(content, arrayName);
    items.forEach((obj) => {
      if (!obj.id) errors.push(`Missing id in ${file}`);
      if (idSet.has(obj.id)) errors.push(`Duplicate exercise id: ${obj.id}`);
      idSet.add(obj.id);
      if (!obj.equipment) warnings.push(`Exercise ${obj.id} missing equipment`);
      if (!obj.difficulty)
        warnings.push(`Exercise ${obj.id} missing difficulty`);
      allExercises.push(obj);
    });
  }

  // Basic equipment consistency: ensure equipment id at least appears in equipmentData.ts file text
  let equipmentContent = "";
  if (fs.existsSync(equipmentPath)) {
    equipmentContent = fs.readFileSync(equipmentPath, "utf8");
  } else {
    warnings.push("equipmentData.ts not found for equipment validation");
  }

  const unmatchedEquipment = [];
  for (const ex of allExercises) {
    if (ex.equipment && !equipmentContent.includes(`id: "${ex.equipment}"`)) {
      unmatchedEquipment.push(ex.equipment);
    }
  }
  if (unmatchedEquipment.length) {
    warnings.push(
      `Equipment ids not found in equipmentData.ts: ${[...new Set(unmatchedEquipment)].join(", ")}`
    );
  }

  const stats = {
    total: allExercises.length,
    byCategory: allExercises.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {}),
    byEquipment: allExercises.reduce((acc, e) => {
      acc[e.equipment] = (acc[e.equipment] || 0) + 1;
      return acc;
    }, {}),
  };

  const output = { stats, errors, warnings };

  // Report
  console.log(
    `${COLORS.BOLD}${COLORS.CYAN}📊 Exercise Validation Report${COLORS.RESET}`
  );
  console.log(`Total: ${stats.total}`);
  console.log("By Category:", stats.byCategory);
  console.log(
    "By Equipment (top 5):",
    Object.fromEntries(
      Object.entries(stats.byEquipment)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    )
  );

  if (errors.length) {
    console.log(`\n${COLORS.RED}❌ Errors (${errors.length}):${COLORS.RESET}`);
    errors.forEach((e) => console.log(" - " + e));
  } else {
    console.log(`\n${COLORS.GREEN}✅ No structural errors${COLORS.RESET}`);
  }

  if (warnings.length) {
    console.log(
      `\n${COLORS.YELLOW}⚠️ Warnings (${warnings.length}):${COLORS.RESET}`
    );
    warnings.forEach((w) => console.log(" - " + w));
  }

  if (errors.length) process.exitCode = 1;
}

if (require.main === module) {
  main();
}

module.exports = { main };
