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
    "machines.ts",
  ];
  const allExercises = [];
  const idSet = new Set();
  const errors = [];
  const warnings = [];

  const VALID_MUSCLES = [
    "core",
    "back",
    "chest",
    "shoulders",
    "biceps",
    "triceps",
    "forearms",
    "quadriceps",
    "hamstrings",
    "glutes",
    "calves",
    "hips",
    "neck",
  ];

  function extractMuscleArrays(block) {
    const primaryMatch = block.match(/primaryMuscles:\s*\[(.*?)\]/s);
    const secondaryMatch = block.match(/secondaryMuscles:\s*\[(.*?)\]/s);
    const toList = (m) =>
      !m
        ? []
        : m[1]
            .split(/[,\n]/)
            .map((s) => s.replace(/['"`]/g, "").trim())
            .filter(Boolean);
    return { primary: toList(primaryMatch), secondary: toList(secondaryMatch) };
  }

  function parseArrayLiteral(content, exportName) {
    const marker = "export const " + exportName;
    const idx = content.indexOf(marker);
    if (idx === -1) return [];
    const after = content.slice(idx);
    // Skip potential type annotation brackets (e.g., : Exercise[] = [ ) by locating '=' then first '[' after it
    const eqPosRel = after.indexOf("=");
    if (eqPosRel === -1) return [];
    const afterEq = after.slice(eqPosRel + 1);
    const firstBracket = afterEq.indexOf("[");
    if (firstBracket === -1) return [];
    let depth = 0;
    let endPos = -1;
    for (let i = firstBracket; i < afterEq.length; i++) {
      const ch = afterEq[i];
      if (ch === "[") depth++;
      else if (ch === "]") {
        depth--;
        if (depth === 0) {
          endPos = i;
          break;
        }
      }
    }
    if (endPos === -1) return [];
    const arrayContent = afterEq.slice(firstBracket + 1, endPos);
    // Extract objects by brace depth (not regex) to handle nested structures safely enough.
    const objects = [];
    let braceDepth = 0;
    let current = "";
    let inObject = false;
    for (let i = 0; i < arrayContent.length; i++) {
      const ch = arrayContent[i];
      if (ch === "{") {
        if (!inObject) {
          inObject = true;
          current = "";
        }
        braceDepth++;
      }
      if (inObject) current += ch;
      if (ch === "}") {
        braceDepth--;
        if (braceDepth === 0 && inObject) {
          objects.push(current);
          inObject = false;
          current = "";
        }
      }
    }
    return objects
      .filter((block) => block.includes("id:"))
      .map((block) => {
        const id = (block.match(/id:\s*"([^"]+)"/) || [])[1];
        const equipment = (block.match(/equipment:\s*"([^"]+)"/) || [])[1];
        const category = (block.match(/category:\s*"([^"]+)"/) || [])[1];
        const difficulty = (block.match(/difficulty:\s*"([^"]+)"/) || [])[1];
        const { primary, secondary } = extractMuscleArrays(block);
        return {
          id,
          equipment,
          category,
          difficulty,
          primary,
          secondary,
          _raw: block,
        };
      });
  }

  for (const file of categoryFiles) {
    const full = path.join(exercisesIndexPath, file);
    if (!fs.existsSync(full)) {
      warnings.push(`Missing category file ${file}`);
      continue;
    }
    const content = fs.readFileSync(full, "utf8");
    // Determine export base name; some files have irregular export identifiers
    const base = file.replace(".ts", "");
    const exportBaseMap = {
      dumbbells: "dumbbell", // file dumbbells.ts exports dumbbellExercises
      resistanceBands: "resistanceBand", // resistanceBands.ts exports resistanceBandExercises
      machines: "machine", // machines.ts exports machineExercises
    };
    const resolved = exportBaseMap[base] || base;
    const arrayName = resolved + "Exercises"; // e.g., bodyweightExercises, dumbbellExercises
    const items = parseArrayLiteral(content, arrayName);
    if (items.length === 0) {
      console.log(
        `${COLORS.YELLOW}[debug] No items parsed for ${file} using export '${arrayName}'${COLORS.RESET}`
      );
      // emit a snippet for inspection
      const firstExportLine = content
        .split(/\n/)
        .find((l) => l.includes(arrayName));
      if (firstExportLine)
        console.log(
          `${COLORS.YELLOW}[debug] Found line: ${firstExportLine.trim()}${COLORS.RESET}`
        );
    } else {
      console.log(
        `${COLORS.CYAN}[debug] Parsed ${items.length} from ${file}${COLORS.RESET}`
      );
    }
    items.forEach((obj) => {
      if (!obj.id) errors.push(`Missing id in ${file}`);
      if (idSet.has(obj.id)) errors.push(`Duplicate exercise id: ${obj.id}`);
      idSet.add(obj.id);
      if (!obj.equipment) {
        warnings.push(`Exercise ${obj.id} missing equipment (set to 'none')`);
        obj.equipment = "none";
      }
      if (!obj.difficulty) {
        warnings.push(
          `Exercise ${obj.id} missing difficulty (set to 'beginner')`
        );
        obj.difficulty = "beginner";
      }
      // Muscle validation
      const allMuscles = [...obj.primary, ...obj.secondary];
      const invalid = allMuscles.filter((m) => m && !VALID_MUSCLES.includes(m));
      if (invalid.length) {
        errors.push(
          `Invalid muscle(s) in ${obj.id}: ${invalid.join(", ")} (allowed: ${VALID_MUSCLES.join(", ")})`
        );
      }
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
  const referencedEquipment = new Set();
  for (const ex of allExercises) {
    if (ex.equipment && !equipmentContent.includes(`id: "${ex.equipment}"`)) {
      unmatchedEquipment.push(ex.equipment);
    }
    if (ex.equipment) referencedEquipment.add(ex.equipment);
  }
  if (unmatchedEquipment.length) {
    warnings.push(
      `Equipment ids not found in equipmentData.ts: ${[...new Set(unmatchedEquipment)].join(", ")}`
    );
  }

  // Detect equipment defined but unused
  const definedEquipMatches = [
    ...equipmentContent.matchAll(/id:\s*"([^"]+)"/g),
  ].map((m) => m[1]);
  const unusedEquip = definedEquipMatches.filter(
    (id) => id && !referencedEquipment.has(id)
  );
  if (unusedEquip.length) {
    warnings.push(
      `Equipment defined but not referenced by any exercise: ${[...new Set(unusedEquip)].join(", ")}`
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
