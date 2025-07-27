/**
 * דיבוג יצירת אימונים - סימולציה מלאה
 * Debug workout generation - full simulation
 */

// סימולציה של מטא-דאטה עם ציוד
const mockMetadata = {
  age: "26-35",
  gender: "זכר",
  goal: "עליה במסת שריר",
  experience: "בינוני (6-24 חודשים)",
  frequency: "3-4",
  duration: "45-60 דקות",
  location: "גם וגם",
  home_equipment: ["dumbbells", "resistance_bands"],
  gym_equipment: ["cable_machine", "barbell", "dumbbells", "bench"],
  completedAt: "2024-01-01T10:00:00.000Z",
};

console.log("🎯 מטא-דאטה מדומה:", mockMetadata);

// סימולציה של analyzeEquipment
function analyzeEquipmentMock(metadata) {
  console.log("\n📊 מתחיל ניתוח ציוד...");

  // שילוב ציוד בית וחדר כושר
  const homeEquipment = metadata.home_equipment || [];
  const gymEquipment = metadata.gym_equipment || [];
  const allEquipment = [...new Set([...homeEquipment, ...gymEquipment])];

  console.log("🔧 ציוד זמין:", {
    homeEquipment,
    gymEquipment,
    allEquipment,
  });

  return {
    availableEquipment: allEquipment,
    hasEquipment: allEquipment.length > 0 && !allEquipment.includes("none"),
    equipmentCategories: {
      weights: allEquipment.some((eq) =>
        ["dumbbells", "barbell", "kettlebell"].includes(eq)
      ),
      machines: allEquipment.some((eq) =>
        ["cable_machine", "leg_press", "lat_pulldown"].includes(eq)
      ),
      cardio: allEquipment.some((eq) =>
        ["treadmill", "bike", "rowing_machine"].includes(eq)
      ),
      functional: allEquipment.some((eq) =>
        ["resistance_bands", "trx", "pullup_bar"].includes(eq)
      ),
    },
  };
}

// סימולציה של isEquipmentAvailable
function isEquipmentAvailableMock(exerciseEquipment, availableEquipment) {
  console.log(`🔍 בודק זמינות ציוד: ${exerciseEquipment}`);
  console.log(`📋 ציוד זמין:`, availableEquipment);

  // אם התרגיל דורש משקל גוף - תמיד זמין
  if (exerciseEquipment === "bodyweight" || exerciseEquipment === "none") {
    console.log(`✅ ציוד משקל גוף זמין: ${exerciseEquipment}`);
    return true;
  }

  // בדיקה ישירה
  if (availableEquipment.includes(exerciseEquipment)) {
    console.log(`✅ ציוד זמין ישירות: ${exerciseEquipment}`);
    return true;
  }

  console.log(`❌ ציוד לא זמין: ${exerciseEquipment}`);
  return false;
}

// סימולציה של תרגילים
const mockExercises = [
  {
    id: "push_ups",
    name: "שכיבות סמיכה",
    equipment: "bodyweight",
    targetMuscle: "chest",
  },
  {
    id: "dumbbell_press",
    name: "דחיפת משקולות",
    equipment: "dumbbells",
    targetMuscle: "chest",
  },
  {
    id: "cable_crossover",
    name: "צלב כבלים",
    equipment: "cable_machine",
    targetMuscle: "chest",
  },
  {
    id: "barbell_press",
    name: "דחיפת מוט",
    equipment: "barbell",
    targetMuscle: "chest",
  },
];

// הרצת הסימולציה
console.log("\n🚀 מתחיל סימולציה...");

const equipmentAnalysis = analyzeEquipmentMock(mockMetadata);
console.log("\n📊 תוצאות ניתוח ציוד:", equipmentAnalysis);

console.log("\n🏋️ בדיקת תרגילים:");
mockExercises.forEach((exercise) => {
  const isAvailable = isEquipmentAvailableMock(
    exercise.equipment,
    equipmentAnalysis.availableEquipment
  );
  console.log(
    `${isAvailable ? "✅" : "❌"} ${exercise.name} (${exercise.equipment}): ${isAvailable ? "זמין" : "לא זמין"}`
  );
});

console.log("\n🎯 סיכום:");
console.log("- המשתמש יש לו:", equipmentAnalysis.availableEquipment.join(", "));
console.log(
  "- תרגילי משקולות:",
  equipmentAnalysis.equipmentCategories.weights ? "זמין" : "לא זמין"
);
console.log(
  "- תרגילי מכונות:",
  equipmentAnalysis.equipmentCategories.machines ? "זמין" : "לא זמין"
);

// בדיקת מה יקרה אם המערכת תחזיר רק תרגילי משקל גוף
const bodyweightOnly = mockExercises.filter(
  (ex) => ex.equipment === "bodyweight"
);
const equipmentBased = mockExercises.filter((ex) =>
  equipmentAnalysis.availableEquipment.includes(ex.equipment)
);

console.log("\n⚠️ השוואה:");
console.log(
  "תרגילי משקל גוף בלבד:",
  bodyweightOnly.map((ex) => ex.name)
);
console.log(
  "תרגילים עם הציוד הזמין:",
  equipmentBased.map((ex) => ex.name)
);

if (bodyweightOnly.length > 0 && equipmentBased.length > 0) {
  console.log("🔥 הבעיה: המערכת מחזירה תרגילי משקל גוף למרות שיש ציוד!");
}
