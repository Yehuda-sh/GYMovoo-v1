/**
 * בדיקת נתוני שאלון - וידוא שציוד נשמר נכון
 * Questionnaire data verification - ensure equipment is saved correctly
 */

const AsyncStorage = require("@react-native-async-storage/async-storage");

// סימולציה של AsyncStorage עבור node.js
if (typeof AsyncStorage === "undefined") {
  global.AsyncStorage = {
    getItem: async (key) => {
      console.log(`📥 AsyncStorage.getItem(${key}) - הדמיה`);
      // החזרת נתוני שאלון מדומים
      if (key === "questionnaire_metadata") {
        return JSON.stringify({
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
        });
      }
      return null;
    },
    setItem: async (key, value) => {
      console.log(`📤 AsyncStorage.setItem(${key}):`, JSON.parse(value));
    },
  };
}

async function testQuestionnaireService() {
  console.log("🧪 בדיקת QuestionnaireService...\n");

  try {
    // טעינת השירות
    const {
      default: QuestionnaireService,
    } = require("../src/services/questionnaireService.ts");

    console.log("1️⃣ בדיקת getUserPreferences:");
    const prefs = await QuestionnaireService.getUserPreferences();
    console.log("תוצאה:", prefs);

    console.log("\n2️⃣ בדיקת getAvailableEquipment:");
    const equipment = await QuestionnaireService.getAvailableEquipment();
    console.log("ציוד זמין:", equipment);

    console.log("\n3️⃣ בדיקת hasCompletedQuestionnaire:");
    const completed = await QuestionnaireService.hasCompletedQuestionnaire();
    console.log("השאלון הושלם:", completed);

    console.log("\n✅ בדיקת QuestionnaireService הושלמה בהצלחה");
  } catch (error) {
    console.error("❌ שגיאה בבדיקת QuestionnaireService:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

async function testWorkoutDataService() {
  console.log("\n🧪 בדיקת WorkoutDataService...\n");

  try {
    // נתוני מטא מדומים עם ציוד
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

    console.log("🎯 מטא-דאטה לבדיקה:", mockMetadata);

    // טעינת השירות
    const {
      default: WorkoutDataService,
    } = require("../src/services/workoutDataService.ts");

    console.log("\n1️⃣ יצירת אימון חכם עם הנתונים:");
    const workout = await WorkoutDataService.createSmartWorkout(mockMetadata);

    console.log("תוצאת אימון:");
    console.log("- שם:", workout.name);
    console.log("- מספר תרגילים:", workout.exercises?.length || 0);
    console.log(
      "- תרגילים:",
      workout.exercises?.map((ex) => ex.name).join(", ") || "לא מוגדר"
    );

    console.log("\n✅ בדיקת WorkoutDataService הושלמה");
  } catch (error) {
    console.error("❌ שגיאה בבדיקת WorkoutDataService:", error.message);
    console.error("Stack trace:", error.stack);
  }
}

// הרצת הבדיקות
async function runAllTests() {
  console.log("🚀 מתחיל בדיקות מערכת...\n");

  await testQuestionnaireService();
  await testWorkoutDataService();

  console.log("\n🏁 כל הבדיקות הושלמו!");
}

runAllTests().catch(console.error);
