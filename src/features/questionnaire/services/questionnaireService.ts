/**
 * @file src/features/questionnaire/services/questionnaireService.ts
 * @description Service for questionnaire data management and workout plan generation
 * שירות לניהול נתוני השאלון ויצירת תוכניות אימון
 */

import { useUserStore } from "../../../stores/userStore";
import { WorkoutPlanGenerator } from "../../../services/workout/WorkoutPlanGenerator";

// Define workout recommendation type
export interface WorkoutRecommendation {
  id: string;
  name: string;
  description: string;
  type: "strength" | "cardio" | "hiit" | "flexibility" | "mixed";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  equipment: string[];
  targetMuscles: string[];
  estimatedCalories: number;
  exercises?: WorkoutExercise[];
  restTime?: number;
  sets?: number;
  reps?: number;
}

// Define workout exercise type
export interface WorkoutExercise {
  id: string;
  name: string;
  equipment: string;
  sets: Array<{
    id: string;
    reps: number;
    weight: number;
    duration: number;
    restTime: number;
    completed: boolean;
  }>;
  targetMuscles: string[];
  instructions: string[];
  restTime: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

// Define workout plan type
export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  workouts: WorkoutRecommendation[];
  type: string;
  isActive: boolean;
  frequency?: string;
  tags?: string[];
}

/**
 * Simplified questionnaire service focused on workout plan generation
 * שירות שאלון מפושט המתמקד ביצירת תוכניות אימון
 */
class QuestionnaireService {
  /**
   * Generate smart workout plan based on user preferences
   * יצירת תוכנית אימון חכמה בהתבסס על העדפות המשתמש
   */
  async generateSmartWorkoutPlan(): Promise<WorkoutPlan[]> {
    try {
      console.log("🔄 questionnaireService.generateSmartWorkoutPlan called");

      const user = useUserStore.getState().user;
      console.log("👤 User from store:", user?.id);

      if (!user?.questionnaireData?.answers) {
        console.log("❌ No questionnaire data found, using default answers");
        console.log("📝 Creating default questionnaire answers for demo...");

        // Create default questionnaire answers for testing
        const defaultAnswers = {
          gender: "male",
          age: 25,
          weight: 75,
          height: 180,
          fitness_goal: "general_fitness",
          experience_level: "beginner",
          availability: 3,
          workout_duration: "45",
          workout_location: "home_bodyweight",
          equipment_available: ["bodyweight", "yoga_mat"],
        };

        console.log("🔧 Using default answers:", defaultAnswers);

        // Use default answers instead of throwing error
        const generator = new WorkoutPlanGenerator(defaultAnswers);
        const generatedPlan = generator.generateWorkoutPlan();
        console.log("📋 Generated plan with defaults:", generatedPlan);

        // Convert the generated plan to the expected format
        const plan: WorkoutPlan = {
          id: generatedPlan.id,
          name: generatedPlan.name + " (ברירת מחדל)",
          description:
            generatedPlan.description +
            " - תוכנית זו נוצרה עם הגדרות ברירת מחדל",
          duration: generatedPlan.estimatedTimePerSession,
          difficulty: generatedPlan.difficultyLevel as
            | "beginner"
            | "intermediate"
            | "advanced",
          workouts: generatedPlan.weeklySchedule.map((day) => ({
            id: `workout-${day.dayNumber}`,
            name: day.dayName,
            description: day.focus,
            type: "strength" as const,
            difficulty: generatedPlan.difficultyLevel as
              | "beginner"
              | "intermediate"
              | "advanced",
            duration: day.estimatedDuration,
            equipment: generatedPlan.equipmentRequired,
            targetMuscles: [day.focus],
            estimatedCalories: Math.round(day.totalCaloriesBurn || 0),
            exercises: day.exercises.map((exercise) => ({
              id: exercise.id,
              name: exercise.name,
              equipment: exercise.equipment,
              sets: Array.from({ length: exercise.sets }, (_, i) => ({
                id: `set-${i + 1}`,
                reps: 10,
                weight: 0,
                duration: 30,
                restTime: exercise.restTime,
                completed: false,
              })),
              targetMuscles: exercise.targetMuscles,
              instructions: [exercise.name],
              restTime: exercise.restTime,
              difficulty: exercise.difficulty as
                | "beginner"
                | "intermediate"
                | "advanced",
            })),
            restTime: 60,
            sets: 3,
            reps: 12,
          })),
          type: "smart",
          isActive: true,
          frequency: `${generatedPlan.daysPerWeek} פעמים בשבוע`,
          tags: [generatedPlan.targetFitnessGoal],
        };

        console.log("✅ Plan created with defaults:", plan);
        return [plan];
      }

      console.log("📝 Questionnaire answers:", user.questionnaireData.answers);

      // Use the new WorkoutPlanGenerator
      console.log("🏗️ Creating WorkoutPlanGenerator...");
      const generator = new WorkoutPlanGenerator(
        user.questionnaireData.answers
      );

      console.log("⚡ Generating workout plan...");
      const generatedPlan = generator.generateWorkoutPlan();
      console.log("📋 Generated plan:", generatedPlan);

      // Convert the generated plan to the expected format
      const plan: WorkoutPlan = {
        id: generatedPlan.id,
        name: generatedPlan.name,
        description: generatedPlan.description,
        duration: generatedPlan.estimatedTimePerSession,
        difficulty: generatedPlan.difficultyLevel as
          | "beginner"
          | "intermediate"
          | "advanced",
        workouts: generatedPlan.weeklySchedule.map((day) => ({
          id: `workout-${day.dayNumber}`,
          name: day.dayName,
          description: day.focus,
          type: "strength" as const,
          difficulty: generatedPlan.difficultyLevel as
            | "beginner"
            | "intermediate"
            | "advanced",
          duration: day.estimatedDuration,
          equipment: generatedPlan.equipmentRequired,
          targetMuscles: [day.focus],
          estimatedCalories: Math.round(day.totalCaloriesBurn || 0),
          exercises: day.exercises.map((exercise) => ({
            id: exercise.id,
            name: exercise.name,
            equipment: exercise.equipment,
            sets: Array.from({ length: exercise.sets }, (_, i) => ({
              id: `set-${i + 1}`,
              reps: 10, // Default to 10 reps
              weight: 0,
              duration: 30,
              restTime: exercise.restTime,
              completed: false,
            })),
            targetMuscles: exercise.targetMuscles,
            instructions: [exercise.name],
            restTime: exercise.restTime,
            difficulty: exercise.difficulty as
              | "beginner"
              | "intermediate"
              | "advanced",
          })),
          restTime: 60,
          sets: 3,
          reps: 12,
        })),
        type: "smart",
        isActive: true,
        frequency: `${generatedPlan.daysPerWeek} פעמים בשבוע`,
        tags: [generatedPlan.targetFitnessGoal],
      };

      return [plan];
    } catch (error) {
      console.error("Error generating smart workout plan:", error);
      return [];
    }
  }
}

/**
 * Questionnaire service singleton instance
 * מופע יחידי של שירות השאלון
 */
export const questionnaireService = new QuestionnaireService();

/**
 * Class export for advanced integration scenarios
 * יצוא מחלקה לתרחישי אינטגרציה מתקדמים
 */
export { QuestionnaireService };
