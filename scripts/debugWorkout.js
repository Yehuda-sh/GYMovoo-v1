/**
 * תסריט דיבוג לבדיקת זרימת נתונים בדור תוכניות אימון
 * Debug script for testing workout generation data flow
 */

import { QuestionnaireService } from "./src/services/questionnaireService.js";
// QuickWorkoutGenerator removed (2025-08-16). Using placeholder demo generation via questionnaire service only.

console.log("🔍 Starting workout generation debug...");

// Test 1: Check what equipment is being detected
const service = new QuestionnaireService();

async function debugWorkoutGeneration() {
  try {
    console.log("\n📋 Testing user preferences extraction...");

    const prefs = await service.getUserPreferences();
    console.log("User preferences:", JSON.stringify(prefs, null, 2));

    const equipment = await service.getAvailableEquipment();
    console.log("🔧 Detected equipment:", equipment);

    const experience = await service.getUserExperience();
    console.log("📊 Experience level:", experience);

    const goal = await service.getUserGoal();
    console.log("🎯 User goal:", goal);

    console.log("\n🏋️ Generating workout...");
    console.log(
      "(Generator removed) – implement workoutDataService demo call here if needed."
    );
  } catch (error) {
    console.error("❌ Debug error:", error);
  }
}

debugWorkoutGeneration();
