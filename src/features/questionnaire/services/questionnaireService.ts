/**
 * @file src/features/questionnaire/services/questionnaireService.ts
 * @description Service for questionnaire data management and workout plan generation
 * שירות לניהול נתוני השאלון ויצירת תוכניות אימון
 */

import { useUserStore } from "../../../stores/userStore";

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
      // Create a basic workout plan
      const plan: WorkoutPlan = {
        id: `plan-${Date.now()}`,
        name: "תוכנית אימונים מותאמת",
        description: "תוכנית אימונים מותאמת לצרכים האישיים שלך",
        duration: 7, // 7 days
        difficulty: this.getUserDifficulty(),
        workouts: this.createBasicWorkouts(),
        type: "smart",
        isActive: true,
      };

      return [plan];
    } catch (error) {
      console.error("Error generating smart workout plan:", error);
      return [];
    }
  }

  /**
   * Get user difficulty level based on questionnaire data
   */
  private getUserDifficulty(): "beginner" | "intermediate" | "advanced" {
    const user = useUserStore.getState().user;
    const experience = user?.questionnaireData?.answers?.experience_level;

    if (experience === "מתחיל" || experience === "beginner") {
      return "beginner";
    } else if (experience === "בינוני" || experience === "intermediate") {
      return "intermediate";
    } else {
      return "advanced";
    }
  }

  /**
   * Create basic workout recommendations
   */
  private createBasicWorkouts(): WorkoutRecommendation[] {
    const workouts: WorkoutRecommendation[] = [
      {
        id: "strength-workout",
        name: "אימון כוח",
        description: "אימון כוח לבניית שריר וחיזוק הגוף",
        type: "strength",
        difficulty: this.getUserDifficulty(),
        duration: 45,
        equipment: ["dumbbells", "bodyweight"],
        targetMuscles: ["חזה", "גב", "רגליים"],
        estimatedCalories: 300,
        restTime: 60,
        sets: 3,
        reps: 12,
        exercises: [
          {
            id: "1",
            name: "שכיבות סמיכה",
            equipment: "bodyweight",
            sets: [
              {
                id: "1",
                reps: 10,
                weight: 0,
                duration: 0,
                restTime: 60,
                completed: false,
              },
            ],
            targetMuscles: ["חזה", "כתפיים"],
            instructions: ["בצע שכיבות סמיכה נכונות", "שמור על גב ישר"],
            restTime: 60,
            difficulty: "beginner",
          },
        ],
      },
      {
        id: "cardio-workout",
        name: "אימון אירובי",
        description: "אימון אירובי לשריפת קלוריות ושיפור סיבולת",
        type: "cardio",
        difficulty: this.getUserDifficulty(),
        duration: 30,
        equipment: ["bodyweight"],
        targetMuscles: ["לב", "ריאות"],
        estimatedCalories: 250,
        restTime: 30,
        sets: 1,
        reps: 20,
      },
    ];

    return workouts;
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
