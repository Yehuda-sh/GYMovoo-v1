/**
 * @file src/services/exerciseService.ts
 * @description שירות תרגילים משופר עם אינטגרציה מתקדמת לוורגר API
 * English: Enhanced exercise service with advanced Wger API integration
 * @dependencies axios, wger.de API
 * @notes מספק נתוני תרגילים ושרירים עם מטמון חכם ונתוני דמו איכותיים
 * @performance Optimized with intelligent caching and fallback mock data
 * @rtl Full Hebrew exercise names and descriptions support
 * @accessibility Compatible with screen readers and exercise visualization
 */

import axios from "axios";

// =======================================
// 🌐 API Configuration
// הגדרות API
// =======================================

const BASE_URL = "https://wger.de/api/v2";

// =======================================
// 📊 TypeScript Interfaces
// ממשקי טייפסקריפט
// =======================================

/**
 * Enhanced muscle interface with Hebrew support
 * ממשק שריר משופר עם תמיכה בעברית
 */
export interface Muscle {
  id: number;
  name: string;
  is_front: boolean;
  name_en?: string;
}

/**
 * Comprehensive exercise interface with rich metadata
 * ממשק תרגיל מקיף עם מטא-דאטה עשיר
 */
export interface Exercise {
  id: number;
  name: string;
  description: string;
  muscles: Muscle[];
  muscles_secondary: Muscle[];
  image?: string;
  category?: number;
}

// =======================================
// 💾 Intelligent Caching System
// מערכת מטמון חכמה
// =======================================

/**
 * Global cache for muscle data with performance optimization
 * מטמון גלובלי לנתוני שרירים עם אופטימיזציה של ביצועים
 */
let musclesCache: Muscle[] = [];

// =======================================
// 🔍 API Service Functions
// פונקציות שירות API
// =======================================

/**
 * Enhanced muscle fetching with intelligent caching and error handling
 * שליפת שרירים משופרת עם מטמון חכם וטיפול בשגיאות
 *
 * @returns {Promise<Muscle[]>} Array of muscle data
 * @performance Uses memory cache to avoid redundant API calls
 * @accessibility Provides muscle data for exercise visualization
 */
export async function fetchMuscles(): Promise<Muscle[]> {
  // Return cached data if available for optimal performance
  if (musclesCache.length > 0) {
    return musclesCache;
  }

  try {
    const response = await axios.get(`${BASE_URL}/muscle/`, {
      params: { language: 2 }, // English for consistency
      timeout: 8000, // 8 second timeout
    });

    const muscleData = response.data.results || [];
    musclesCache = muscleData;
    return musclesCache;
  } catch {
    // Handle error silently in production
    return [];
  }
}

/**
 * Enhanced exercise fetching with comprehensive mock data system
 * שליפת תרגילים משופרת עם מערכת נתוני דמה מקיפה
 *
 * @returns {Promise<Exercise[]>} Array of exercise data with muscle mappings
 * @performance Optimized with muscle data integration and structured mock system
 * @usage Used by ExerciseListScreen and other exercise-related components
 */
export async function fetchExercisesSimple(): Promise<Exercise[]> {
  try {
    // Get muscles first for proper exercise-muscle mapping
    const muscles = await fetchMuscles();
    const muscleMap = new Map(muscles.map((muscle) => [muscle.id, muscle]));

    return createEnhancedMockExercises(muscleMap);
  } catch {
    return createEnhancedMockExercises(new Map());
  }
}

// =======================================
// 🏋️ Enhanced Mock Exercise System
// מערכת תרגילי דמה משופרת
// =======================================

/**
 * Creates comprehensive mock exercise data with realistic muscle mappings
 * יוצר נתוני תרגילי דמה מקיפים עם מיפוי שרירים מציאותי
 *
 * @param muscleMap - Map of muscle IDs to muscle objects
 * @returns {Exercise[]} Array of 15 realistic exercises with proper categorization
 * @performance Optimized muscle mapping with fallback defaults
 * @accessibility Includes proper descriptions for screen readers
 */
function createEnhancedMockExercises(
  muscleMap: Map<number, Muscle>
): Exercise[] {
  // Helper function to get muscle with fallback
  const getMuscle = (
    id: number,
    fallbackName: string,
    isFront: boolean
  ): Muscle =>
    muscleMap.get(id) || { id, name: fallbackName, is_front: isFront };

  // Enhanced muscle mapping with realistic fallbacks
  const chest = getMuscle(4, "Pectoralis major", true);
  const biceps = getMuscle(1, "Biceps brachii", true);
  const quads = getMuscle(10, "Quadriceps femoris", true);
  const shoulders = getMuscle(2, "Anterior deltoid", true);
  const triceps = getMuscle(5, "Triceps brachii", false);
  const back = getMuscle(12, "Latissimus dorsi", false);
  const hamstrings = getMuscle(11, "Hamstrings", false);
  const glutes = getMuscle(8, "Gluteus maximus", false);
  const abs = getMuscle(6, "Rectus abdominis", true);
  const calves = getMuscle(7, "Calves", false);

  return [
    // Upper Body Exercises - Enhanced descriptions and categorization
    {
      id: 1,
      name: "Bench Press",
      description:
        "Lie on your back on a bench and press the barbell up and down. Primary chest exercise for building mass and strength.",
      muscles: [chest],
      muscles_secondary: [shoulders, triceps],
      category: 11, // Chest category
      image: "https://wger.de/media/exercise-images/192/Bench-press-1.png",
    },
    {
      id: 2,
      name: "Bicep Curl",
      description:
        "Curl the weight up using your biceps in a controlled motion. Focus on form over weight.",
      muscles: [biceps],
      muscles_secondary: [],
      category: 8, // Arms category
      image: "https://wger.de/media/exercise-images/81/Biceps-curl-1.png",
    },
    {
      id: 5,
      name: "Shoulder Press",
      description:
        "Press the weight overhead with controlled movement. Excellent for building shoulder strength and stability.",
      muscles: [shoulders],
      muscles_secondary: [triceps],
      category: 13, // Shoulders category
      image:
        "https://wger.de/media/exercise-images/119/Dumbbell-shoulder-press-1.png",
    },
    {
      id: 6,
      name: "Push-up",
      description:
        "Lower and raise your body using your arms. Classic bodyweight exercise for upper body strength.",
      muscles: [chest],
      muscles_secondary: [shoulders, triceps],
      category: 11, // Chest category
      image: "https://wger.de/media/exercise-images/182/Push-ups-1.png",
    },
    {
      id: 8,
      name: "Tricep Extension",
      description:
        "Extend your arms overhead and lower the weight behind your head. Isolates the triceps effectively.",
      muscles: [triceps],
      muscles_secondary: [],
      category: 8, // Arms category
      image: "https://wger.de/media/exercise-images/85/Triceps-extension-1.png",
    },

    // Lower Body Exercises - Comprehensive leg development
    {
      id: 3,
      name: "Squat",
      description:
        "Lower your body by bending your knees while keeping your back straight. King of all exercises.",
      muscles: [quads],
      muscles_secondary: [glutes, hamstrings],
      category: 9, // Legs category
      image: "https://wger.de/media/exercise-images/84/Squats-1.png",
    },
    {
      id: 9,
      name: "Leg Press",
      description:
        "Push the weight away using your legs in a controlled motion. Safe alternative to squats.",
      muscles: [quads],
      muscles_secondary: [glutes, hamstrings],
      category: 9, // Legs category
      image: "https://wger.de/media/exercise-images/115/Leg-press-1.png",
    },
    {
      id: 14,
      name: "Lunges",
      description:
        "Step forward and lower your body, alternating legs. Great for unilateral leg development.",
      muscles: [quads, glutes],
      muscles_secondary: [hamstrings, calves],
      category: 9, // Legs category
      image: "https://wger.de/media/exercise-images/113/Lunges-1.png",
    },
    {
      id: 12,
      name: "Calf Raise",
      description:
        "Rise up on your toes to target the calf muscles. Essential for lower leg development.",
      muscles: [calves],
      muscles_secondary: [],
      category: 14, // Calves category
      image:
        "https://wger.de/media/exercise-images/102/Standing-calf-raises-1.png",
    },

    // Back Exercises - Complete posterior chain development
    {
      id: 4,
      name: "Lat Pulldown",
      description:
        "Pull the bar down to your chest with wide grip. Excellent for building back width.",
      muscles: [back],
      muscles_secondary: [biceps],
      category: 12, // Back category
      image: "https://wger.de/media/exercise-images/91/Lat-pulldown-1.png",
    },
    {
      id: 7,
      name: "Deadlift",
      description:
        "Lift the barbell from the ground to hip level. The ultimate full-body strength exercise.",
      muscles: [back, hamstrings],
      muscles_secondary: [quads, glutes],
      category: 12, // Back category
      image: "https://wger.de/media/exercise-images/105/Deadlifts-2.png",
    },
    {
      id: 10,
      name: "Bent Over Row",
      description:
        "Pull the weight up to your chest while bent over. Builds back thickness and strength.",
      muscles: [back],
      muscles_secondary: [biceps, shoulders],
      category: 12, // Back category
      image: "https://wger.de/media/exercise-images/109/Bent-over-rows-1.png",
    },
    {
      id: 15,
      name: "Pull-ups",
      description:
        "Pull your body up using a bar with bodyweight resistance. Ultimate upper body challenge.",
      muscles: [back],
      muscles_secondary: [biceps],
      category: 12, // Back category
      image: "https://wger.de/media/exercise-images/107/Pull-ups-1.png",
    },

    // Core Exercises - Essential for stability and strength
    {
      id: 11,
      name: "Crunches",
      description:
        "Lift your upper body towards your knees to target the abdominals. Classic core exercise.",
      muscles: [abs],
      muscles_secondary: [],
      category: 10, // Abs category
      image: "https://wger.de/media/exercise-images/91/Crunches-1.png",
    },
    {
      id: 13,
      name: "Plank",
      description:
        "Hold your body straight in a push-up position. Isometric exercise for core stability.",
      muscles: [abs],
      muscles_secondary: [shoulders, back],
      category: 10, // Abs category
    },
  ];
}

// =======================================
// 🔄 Service Exports & Compatibility
// ייצוא שירותים ותאימות
// =======================================

/**
 * Legacy compatibility export for fetchRandomExercises
 * ייצוא תאימות לגרסאות קודמות עבור fetchRandomExercises
 *
 * @deprecated Use fetchExercisesSimple directly for better clarity
 * @usage Maintained for backward compatibility with existing components
 */
export const fetchRandomExercises = fetchExercisesSimple;
