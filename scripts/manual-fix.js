#!/usr/bin/env node

/**
 * Manual TypeScript Fixes
 * תיקונים ידניים של שגיאות TypeScript נפוצות
 */

const fs = require("fs");
const path = require("path");

console.log("🔧 Starting manual TypeScript fixes...");

// תיקונים לקובץ MainScreen.tsx
const mainScreenPath = path.join(
  process.cwd(),
  "src/screens/main/MainScreen.tsx"
);
if (fs.existsSync(mainScreenPath)) {
  let content = fs.readFileSync(mainScreenPath, "utf8");
  let changed = false;

  // תיקון airecommendations → aiRecommendations
  const newContent1 = content.replace(
    /\.airecommendations/g,
    ".aiRecommendations"
  );
  if (newContent1 !== content) {
    content = newContent1;
    changed = true;
    console.log(
      "✅ Fixed airecommendations → aiRecommendations in MainScreen.tsx"
    );
  }

  // תיקון Date.toISOString עם string | Date
  const newContent2 = content.replace(
    /(\w+)\.date\?\.toISOString\(\)/g,
    '(typeof $1.date === "string" ? new Date($1.date) : $1.date)?.toISOString()'
  );
  if (newContent2 !== content) {
    content = newContent2;
    changed = true;
    console.log("✅ Fixed Date.toISOString() issues in MainScreen.tsx");
  }

  // תיקון exercise properties שחסרות
  const newContent3 = content.replace(
    /exercise\.category/g,
    'exercise.category || "Unknown"'
  );
  if (newContent3 !== content) {
    content = newContent3;
    changed = true;
    console.log("✅ Added fallback for exercise.category in MainScreen.tsx");
  }

  const newContent4 = content.replace(
    /exercise\.primaryMuscles/g,
    'exercise.primaryMuscles || ["Unknown"]'
  );
  if (newContent4 !== content) {
    content = newContent4;
    changed = true;
    console.log(
      "✅ Added fallback for exercise.primaryMuscles in MainScreen.tsx"
    );
  }

  // תיקון set.id שחסר
  const newContent5 = content.replace(
    /set\.id \|\| "unknown"/g,
    "set.id || `set-${index}`"
  );
  if (newContent5 !== content) {
    content = newContent5;
    changed = true;
    console.log("✅ Fixed set.id fallback in MainScreen.tsx");
  }

  if (changed) {
    fs.writeFileSync(mainScreenPath, content, "utf8");
    console.log("✅ MainScreen.tsx updated");
  }
}

// תיקונים לקובץ ActiveWorkoutScreen.tsx
const activeWorkoutPath = path.join(
  process.cwd(),
  "src/screens/workout/ActiveWorkoutScreen.tsx"
);
if (fs.existsSync(activeWorkoutPath)) {
  let content = fs.readFileSync(activeWorkoutPath, "utf8");
  let changed = false;

  // תיקון exercise.sets?.map
  const newContent1 = content.replace(
    /exercise\.sets\.map/g,
    "exercise.sets?.map"
  );
  if (newContent1 !== content) {
    content = newContent1;
    changed = true;
    console.log(
      "✅ Added optional chaining for exercise.sets.map in ActiveWorkoutScreen.tsx"
    );
  }

  // תיקון exercise.sets.length
  const newContent2 = content.replace(
    /exercise\.sets\.length/g,
    "exercise.sets?.length || 0"
  );
  if (newContent2 !== content) {
    content = newContent2;
    changed = true;
    console.log(
      "✅ Added optional chaining for exercise.sets.length in ActiveWorkoutScreen.tsx"
    );
  }

  // תיקון set.weight ו-set.reps
  const newContent3 = content.replace(/set\.weight/g, "(set as any).weight");
  if (newContent3 !== content) {
    content = newContent3;
    changed = true;
    console.log(
      "✅ Added type assertion for set.weight in ActiveWorkoutScreen.tsx"
    );
  }

  const newContent4 = content.replace(/set\.reps/g, "(set as any).reps");
  if (newContent4 !== content) {
    content = newContent4;
    changed = true;
    console.log(
      "✅ Added type assertion for set.reps in ActiveWorkoutScreen.tsx"
    );
  }

  // תיקון exercise.muscleGroup
  const newContent5 = content.replace(
    /exercise\.muscleGroup/g,
    "exercise.category"
  );
  if (newContent5 !== content) {
    content = newContent5;
    changed = true;
    console.log(
      "✅ Fixed exercise.muscleGroup → exercise.category in ActiveWorkoutScreen.tsx"
    );
  }

  if (changed) {
    fs.writeFileSync(activeWorkoutPath, content, "utf8");
    console.log("✅ ActiveWorkoutScreen.tsx updated");
  }
}

// תיקונים לקובץ userStore.ts
const userStorePath = path.join(process.cwd(), "src/stores/userStore.ts");
if (fs.existsSync(userStorePath)) {
  let content = fs.readFileSync(userStorePath, "utf8");
  let changed = false;

  // תיקון המקום השני של trainingstats
  const lines = content.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (
      lines[i].includes("trainingstats") &&
      lines[i].includes("updateActivityPreferences")
    ) {
      const newLine = lines[i].replace(/trainingstats/g, "trainingStats");
      if (newLine !== lines[i]) {
        lines[i] = newLine;
        changed = true;
        console.log(
          `✅ Fixed trainingstats → trainingStats in userStore.ts line ${i + 1}`
        );
      }
    }
  }

  if (changed) {
    fs.writeFileSync(userStorePath, lines.join("\n"), "utf8");
    console.log("✅ userStore.ts updated");
  }
}

console.log("\n🎯 Manual fixes completed!");
console.log('Run "npx tsc --noEmit" to check remaining errors.');
