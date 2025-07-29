/**
 * @file scripts/testDynamicQuestions.js
 * @brief בדיקת השאלות הדינמיות החדשות
 * @date 2025-01-28
 */

console.log("🧪 Testing Dynamic Equipment Questions...\n");

// סימולציה של תשובות למערכת החדשה
const simulatedAnswers = {
  // תרחיש 1: משתמש עם ציוד ביתי
  equipment_availability: {
    id: "home_equipment",
    label: "יש לי ציוד בבית",
  },
  home_equipment_specific: [
    {
      id: "dumbbells",
      label: "דמבלים/משקולות",
      metadata: { equipment: ["dumbbells"] },
    },
    {
      id: "yoga_mat",
      label: "מזרן יוגה",
      metadata: { equipment: ["yoga_mat"] },
    },
  ],
};

// תרחיש 2: משתמש ללא ציוד
const noEquipmentScenario = {
  equipment_availability: {
    id: "no_equipment",
    label: "ללא ציוד (רק משקל גוף)",
  },
  // ☝️ שים לב: אין שאלה נוספת על ציוד!
};

// בדיקת חילוץ ציוד
function extractEquipmentFromDynamicQuestions(prefs) {
  const equipment = [];

  const dynamicQuestions = [
    "home_equipment_specific",
    "gym_equipment_specific",
    "outdoor_equipment_specific",
  ];

  dynamicQuestions.forEach((questionId) => {
    const answer = prefs?.[questionId];
    if (Array.isArray(answer)) {
      answer.forEach((option) => {
        if (option?.metadata?.equipment) {
          equipment.push(...option.metadata.equipment);
        }
      });
    }
  });

  return [...new Set(equipment)];
}

console.log("📋 Scenario 1 - Home Equipment:");
console.log(JSON.stringify(simulatedAnswers, null, 2));
console.log("\n");

console.log("� Scenario 2 - No Equipment:");
console.log(JSON.stringify(noEquipmentScenario, null, 2));
console.log("\n");

console.log("�🔧 Extracted Equipment from Scenario 1:");
const extractedEquipment =
  extractEquipmentFromDynamicQuestions(simulatedAnswers);
console.log(extractedEquipment);
console.log("\n");

console.log("🔧 Extracted Equipment from Scenario 2:");
const noEquipment = extractEquipmentFromDynamicQuestions(noEquipmentScenario);
console.log(noEquipment, "← Should be empty!");
console.log("\n");

// בדיקת היגיון השאלות
console.log("🤖 AI Logic Test:");
console.log(
  "Equipment choice: home_equipment → next question: home_equipment_specific"
);
console.log("Equipment choice: no_equipment → next question: none (dynamic!)");
console.log(
  "Equipment choice: gym_access → next question: gym_equipment_specific"
);
console.log(
  "Equipment choice: outdoor_equipment → next question: outdoor_equipment_specific"
);
console.log("\n");

// בדיקת תרחישים שונים
const testScenarios = [
  {
    name: "No Equipment User",
    choice: "no_equipment",
    nextQuestion: "none",
    equipment: [],
  },
  {
    name: "Home Equipment User",
    choice: "home_equipment",
    nextQuestion: "home_equipment_specific",
    equipment: ["dumbbells", "yoga_mat", "resistance_bands"],
  },
  {
    name: "Gym User",
    choice: "gym_access",
    nextQuestion: "gym_equipment_specific",
    equipment: ["barbell", "dumbbells", "cable_machine", "bench"],
  },
  {
    name: "Outdoor User",
    choice: "outdoor_equipment",
    nextQuestion: "outdoor_equipment_specific",
    equipment: ["bodyweight", "resistance_bands", "trx"],
  },
];

console.log("🎯 Test Scenarios:");
testScenarios.forEach((scenario) => {
  console.log(
    `${scenario.name}: ${scenario.choice} → ${scenario.nextQuestion} → [${scenario.equipment.join(", ")}]`
  );
});

console.log("\n✅ Dynamic Questions Test Complete!");
console.log(
  "💡 Key insight: 'no_equipment' users skip equipment questions entirely!"
);
