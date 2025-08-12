// בדיקת לוגיקת שאלון - בעיית חדר כושר
console.log("🧪 בודק לוגיקת שאלון חכם - בעיית חדר כושר\n");

// סימולציה של השאלה הראשונה
const trainingLocationQuestion = {
  id: "training_location",
  aiLogic: {
    influenceNextQuestions: (answer) => {
      console.log("📍 תשובה שהתקבלה:", answer);
      const option = answer;
      switch (option?.id) {
        case "home":
          console.log("✅ זוהה בחירת בית -> home_equipment_availability");
          return ["home_equipment_availability"];
        case "gym":
          console.log("✅ זוהה בחירת חדר כושר -> gym_equipment_availability");
          return ["gym_equipment_availability"];
        case "outdoor":
          console.log("✅ זוהה בחירת חוץ -> outdoor_equipment_availability");
          return ["outdoor_equipment_availability"];
        default:
          console.log(
            "⚠️ בחירה לא מזוהה, ברירת מחדל -> home_equipment_availability"
          );
          return ["home_equipment_availability"];
      }
    },
  },
};

// בדיקה 1: בחירת בית
console.log("🏠 בדיקה 1: בחירת בית");
const homeAnswer = { id: "home", label: "בבית" };
const homeResult =
  trainingLocationQuestion.aiLogic.influenceNextQuestions(homeAnswer);
console.log("תוצאה:", homeResult);
console.log("");

// בדיקה 2: בחירת חדר כושר
console.log("🏋️ בדיקה 2: בחירת חדר כושר");
const gymAnswer = { id: "gym", label: "חדר כושר" };
const gymResult =
  trainingLocationQuestion.aiLogic.influenceNextQuestions(gymAnswer);
console.log("תוצאה:", gymResult);
console.log("");

// בדיקה 3: בחירת חוץ
console.log("🌳 בדיקה 3: בחירת חוץ");
const outdoorAnswer = { id: "outdoor", label: "בחוץ (פארק/טבע)" };
const outdoorResult =
  trainingLocationQuestion.aiLogic.influenceNextQuestions(outdoorAnswer);
console.log("תוצאה:", outdoorResult);
console.log("");

// בדיקה 4: בחירה לא תקינה
console.log("❓ בדיקה 4: בחירה לא תקינה");
const invalidAnswer = { id: "unknown", label: "לא ידוע" };
const invalidResult =
  trainingLocationQuestion.aiLogic.influenceNextQuestions(invalidAnswer);
console.log("תוצאה:", invalidResult);
console.log("");

console.log("✅ בדיקות הושלמו!");

// ------------------------------
// Quick sanity checks (runtime)
// ------------------------------

const check = (name, predicate) => {
  try {
    const ok = !!predicate();
    console.log(`${ok ? "✅" : "❌"} ${name}`);
    return ok;
  } catch (e) {
    console.log(`❌ ${name} (error: ${e?.message || e})`);
    return false;
  }
};

console.log("\n🧪 Running quick checks:\n");
const results = [];

results.push(
  check(
    "home → home_equipment_availability",
    () =>
      Array.isArray(homeResult) &&
      homeResult.length === 1 &&
      homeResult[0] === "home_equipment_availability"
  )
);

results.push(
  check(
    "gym → gym_equipment_availability",
    () =>
      Array.isArray(gymResult) &&
      gymResult.length === 1 &&
      gymResult[0] === "gym_equipment_availability"
  )
);

results.push(
  check(
    "outdoor → outdoor_equipment_availability",
    () =>
      Array.isArray(outdoorResult) &&
      outdoorResult.length === 1 &&
      outdoorResult[0] === "outdoor_equipment_availability"
  )
);

results.push(
  check(
    "unknown → defaults to home_equipment_availability",
    () =>
      Array.isArray(invalidResult) &&
      invalidResult.length === 1 &&
      invalidResult[0] === "home_equipment_availability"
  )
);

const passed = results.filter(Boolean).length;
console.log(`\n✅ Passed ${passed}/${results.length} checks.`);
process.exitCode = passed === results.length ? 0 : 1;
