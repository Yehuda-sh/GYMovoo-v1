// Test muscle group mappings
const fs = require("fs");

const dbContent = fs.readFileSync("./src/data/exerciseDatabase.ts", "utf8");

// Extract exercise info
const exercises = [];
const exerciseBlocks = dbContent.split(/{\s*id: "[\w_]+"/);

exerciseBlocks.forEach((block, index) => {
  if (index === 0) return; // Skip first empty block

  const idMatch = block.match(/^[\s\S]*?name: "([^"]+)"/);
  const muscleMatch = block.match(/primaryMuscles: \[(.*?)\]/);
  const equipmentMatch = block.match(/equipment: "([^"]+)"/);

  if (idMatch && muscleMatch && equipmentMatch) {
    const name = idMatch[1];
    const muscles = muscleMatch[1]
      .split(",")
      .map((m) => m.trim().replace(/"/g, ""));
    const equipment = equipmentMatch[1];

    exercises.push({ name, muscles, equipment });
  }
});

console.log("Exercise Database Analysis:");
console.log("=".repeat(50));

exercises.forEach((ex, index) => {
  console.log(`${index + 1}. ${ex.name}`);
  console.log(`   Equipment: ${ex.equipment}`);
  console.log(`   Muscles: ${ex.muscles.join(", ")}`);
  console.log("");
});

console.log("Muscle Group Coverage:");
console.log("=".repeat(50));

const muscleGroups = {
  chest: [],
  back: [],
  shoulders: [],
  triceps: [],
  biceps: [],
  quadriceps: [],
  glutes: [],
  core: [],
  legs: [],
  full_body: [],
};

exercises.forEach((ex) => {
  ex.muscles.forEach((muscle) => {
    if (muscleGroups[muscle]) {
      muscleGroups[muscle].push(ex.name);
    }
  });
});

Object.entries(muscleGroups).forEach(([muscle, exerciseNames]) => {
  console.log(`${muscle.toUpperCase()}: ${exerciseNames.length} exercises`);
  exerciseNames.forEach((name) => console.log(`  - ${name}`));
  console.log("");
});
