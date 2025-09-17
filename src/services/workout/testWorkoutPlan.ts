import { WorkoutPlanGenerator } from "./WorkoutPlanGenerator";

// Example usage
const exampleAnswers = {
  gender: "male",
  age: "26-35",
  weight: "71-80",
  height: "181-190",
  fitness_goal: "muscle_building",
  experience_level: "intermediate",
  availability: "4-5",
  workout_duration: "45-60",
  workout_location: "home_bodyweight",
  equipment_available: ["dumbbells", "resistance_bands"],
};

export function createWorkoutPlan(questionnaireAnswers: Record<string, any>) {
  try {
    const generator = new WorkoutPlanGenerator(questionnaireAnswers);
    const workoutPlan = generator.generateWorkoutPlan();

    console.log("🏋️ תוכנית אימון נוצרה בהצלחה!");
    console.log("📊 פרטי התוכנית:", {
      name: workoutPlan.name,
      daysPerWeek: workoutPlan.daysPerWeek,
      duration: workoutPlan.duration,
      totalCaloriesPerWeek: workoutPlan.totalCaloriesPerWeek,
    });

    return workoutPlan;
  } catch (error) {
    console.error("❌ שגיאה ביצירת תוכנית האימון:", error);
    throw error;
  }
}

// Test the generator
export function testWorkoutPlanGenerator() {
  console.log("🧪 בודק מחולל תוכניות אימון...");

  const plan = createWorkoutPlan(exampleAnswers);

  console.log("\n📋 לוח אימונים שבועי:");
  plan.weeklySchedule.forEach((day) => {
    console.log(`\n${day.dayName} - ${day.focus}`);
    console.log(`⏱️  משך: ${day.estimatedDuration} דקות`);
    console.log(`🎯 תרגילים (${day.exercises.length}):`);
    day.exercises.forEach((ex) => {
      console.log(`  • ${ex.nameLocalized.he} - ${ex.sets} סטים × ${ex.reps}`);
    });
  });

  return plan;
}
