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
