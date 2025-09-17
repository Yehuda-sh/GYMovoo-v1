/**
 * @file src/features/workout/utils/debugWorkoutPlan.ts
 * @description Debug utilities for workout plan generation
 */

export const debugWorkoutPlan = (plan: any, source: string) => {
  console.log(`🔍 DEBUG ${source}:`, {
    planExists: !!plan,
    planId: plan?.id,
    planName: plan?.name,
    planDescription: plan?.description,
    workoutsCount: plan?.workouts?.length,
    firstWorkout: plan?.workouts?.[0]
      ? {
          id: plan.workouts[0].id,
          name: plan.workouts[0].name,
          exercisesCount: plan.workouts[0].exercises?.length,
          exercises: plan.workouts[0].exercises?.map((ex: any) => ({
            id: ex.id,
            name: ex.name,
            equipment: ex.equipment,
          })),
        }
      : null,
    fullPlan: plan,
  });
};

export const testQuestionnaireAnswers = {
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
