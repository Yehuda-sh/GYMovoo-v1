/**
 * קובץ בדיקה עבור תיקוני יצירת תוכניות אימון
 * Test file for workout generation fixes
 */

// Test scenario: Advanced user with equipment should get equipment-based workouts, not just bodyweight

const testUserWithEquipment = {
  experience: "advanced", // Advanced user
  equipment: ["dumbbells", "barbell", "bench", "none", "bodyweight"], // Has equipment + bodyweight
  goal: "muscle_gain", // Want to build muscle
  profile: "build_muscle",
};

const expectedResult = {
  // Should get mostly equipment-based exercises
  equipmentExercises: ["dumbbell_press", "barbell_squat", "bench_press"],
  // Should NOT get mostly bodyweight exercises
  bodyweightExercises: ["push_ups", "planks"], // Only as supplements

  // Advanced user should get appropriate exercises for their level
  difficulty: "advanced",

  // Muscle building should prioritize compound movements with equipment
  exerciseTypes: ["compound", "strength"],

  // Should NOT see basic exercises like "shadow boxing" for muscle building goals
  inappropriateExercises: ["shadow_boxing", "jumping_jacks"],
};

console.log("✅ Test setup: Advanced user with equipment");
console.log("- Experience:", testUserWithEquipment.experience);
console.log("- Equipment:", testUserWithEquipment.equipment);
console.log("- Goal:", testUserWithEquipment.goal);
console.log("");
console.log("🎯 Expected: Equipment-based workouts for muscle building");
console.log("❌ Bug: Was getting bodyweight exercises instead");
console.log("🔧 Fix: Updated equipment prioritization logic");

export { testUserWithEquipment, expectedResult };
