// בדיקת קטגוריות תרגילי משקל גוף
const fs = require("fs");

const dbContent = fs.readFileSync("./src/data/exerciseDatabase.ts", "utf8");

console.log("תרגילי משקל גוף - ניתוח קטגוריות");
console.log("===================================");

// מציאת כל התרגילים עם equipment: "none"
const exerciseBlocks = dbContent.split(/{\s*id:/);
let bodyweightExercises = [];

exerciseBlocks.forEach((block, index) => {
  if (index === 0) return; // הבלוק הראשון ריק

  // בדיקה אם זה תרגיל משקל גוף
  if (block.includes('equipment: "none"')) {
    const nameMatch = block.match(/name: "([^"]+)"/);
    const categoryMatch = block.match(/category: "([^"]+)"/);
    const musclesMatch = block.match(/primaryMuscles: \[(.*?)\]/);

    if (nameMatch && categoryMatch) {
      const name = nameMatch[1];
      const category = categoryMatch[1];
      const muscles = musclesMatch
        ? musclesMatch[1].split(",").map((m) => m.trim().replace(/"/g, ""))
        : [];

      bodyweightExercises.push({ name, category, muscles });
    }
  }
});

console.log("רשימת תרגילי משקל גוף:");
bodyweightExercises.forEach((ex, index) => {
  console.log(`${index + 1}. ${ex.name}`);
  console.log(`   קטגוריה: ${ex.category}`);
  console.log(`   שרירים: ${ex.muscles.join(", ")}`);
  console.log("");
});

// סיכום לפי קטגוריות
const categoryCount = {};
bodyweightExercises.forEach((ex) => {
  categoryCount[ex.category] = (categoryCount[ex.category] || 0) + 1;
});

console.log("סיכום לפי קטגוריות:");
Object.entries(categoryCount).forEach(([category, count]) => {
  console.log(`${category}: ${count} תרגילים`);
});
