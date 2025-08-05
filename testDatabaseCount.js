// Quick test to count exercises in the database
const fs = require("fs");

// Read the database file and count exercises
const dbContent = fs.readFileSync("./src/data/exerciseDatabase.ts", "utf8");

// Count exercise objects by looking for id patterns
const exerciseIdMatches = dbContent.match(/id: "[\w_]+"/g);
const exerciseCount = exerciseIdMatches ? exerciseIdMatches.length : 0;

console.log(`Total exercises found: ${exerciseCount}`);

// Extract equipment types
const equipmentMatches = dbContent.match(/equipment: "[\w_]+"/g);
const equipmentTypes = equipmentMatches
  ? [...new Set(equipmentMatches.map((match) => match.match(/"([\w_]+)"/)[1]))]
  : [];

console.log(`Equipment types: ${equipmentTypes.join(", ")}`);

// Count by equipment
const equipmentCount = {};
equipmentMatches?.forEach((match) => {
  const equipment = match.match(/"([\w_]+)"/)[1];
  equipmentCount[equipment] = (equipmentCount[equipment] || 0) + 1;
});

console.log("Exercises by equipment:");
Object.entries(equipmentCount).forEach(([equipment, count]) => {
  console.log(`  ${equipment}: ${count} exercises`);
});
