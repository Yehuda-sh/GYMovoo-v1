/**
 * @file src/services/workout/WorkoutPlanGeneratorTest.ts
 * @description Test file to verify WorkoutPlanGenerator integration
 */

import { WorkoutPlanGenerator } from "./WorkoutPlanGenerator";

// Test function to verify the integration works
export const testWorkoutPlanGeneration = () => {
  console.log("🚀 Testing WorkoutPlanGenerator integration...");

  // Sample questionnaire answers for testing
  const sampleAnswers = {
    gender: "male",
    age: 25,
    weight: 75,
    height: 180,
    fitness_goal: "muscle_building",
    experience_level: "intermediate",
    availability: 4,
    workout_duration: "45",
    workout_location: "gym",
    equipment_available: [
      "dumbbells",
      "barbells",
      "machines",
      "cables",
      "pull_up_bar",
      "medicine_ball",
      "stability_ball",
      "foam_roller",
    ],
  };

  try {
    // Create generator with sample answers
    const generator = new WorkoutPlanGenerator(sampleAnswers);

    // Generate workout plan
    const plan = generator.generateWorkoutPlan();

    console.log("✅ WorkoutPlan generated successfully!");
    console.log("📊 Plan details:");
    console.log(`- Name: ${plan.name}`);
    console.log(`- Duration: ${plan.duration} weeks`);
    console.log(`- Days per week: ${plan.daysPerWeek}`);
    console.log(`- Sessions: ${plan.weeklySchedule.length}`);
    console.log(`- Equipment: ${plan.equipmentRequired.join(", ")}`);
    console.log(`- Target: ${plan.targetFitnessGoal}`);
    console.log(`- Difficulty: ${plan.difficultyLevel}`);

    // Check if we have exercises from new databases
    const allExercises = plan.weeklySchedule.flatMap((day) => day.exercises);
    const equipmentTypes = [...new Set(allExercises.map((ex) => ex.equipment))];

    console.log(`🎯 Found ${allExercises.length} total exercises`);
    console.log(`🛠️  Equipment types used: ${equipmentTypes.join(", ")}`);

    // Check for new equipment coverage
    const hasNewEquipment = equipmentTypes.some((eq) =>
      [
        "barbells",
        "machines",
        "cables",
        "pull_up_bar",
        "medicine_ball",
        "stability_ball",
        "foam_roller",
      ].includes(eq)
    );

    if (hasNewEquipment) {
      console.log("🎉 SUCCESS: New exercise databases are being used!");
    } else {
      console.log("⚠️  WARNING: Only using original exercise databases");
    }

    return {
      success: true,
      plan,
      stats: {
        totalExercises: allExercises.length,
        equipmentTypes,
        hasNewEquipment,
      },
    };
  } catch (error) {
    console.error("❌ Error generating workout plan:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
};

// Export for potential use in other files
export default testWorkoutPlanGeneration;
