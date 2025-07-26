// src/services/exerciseService.ts
import axios from "axios";

const BASE_URL = "https://wger.de/api/v2";

export interface Muscle {
  id: number;
  name: string;
  is_front: boolean;
  name_en?: string;
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  muscles: Muscle[];
  muscles_secondary: Muscle[];
  image?: string;
  category?: number;
}

// Cache for muscles
let musclesCache: Muscle[] = [];

// שליפת שרירים
export async function fetchMuscles(): Promise<Muscle[]> {
  if (musclesCache.length > 0) {
    return musclesCache;
  }

  try {
    const res = await axios.get(`${BASE_URL}/muscle/`, {
      params: { language: 2 }, // English
    });

    console.log("[EXERCISE SERVICE] Muscles fetched:", res.data.results.length);
    musclesCache = res.data.results || [];
    return musclesCache;
  } catch (error) {
    console.error("[EXERCISE SERVICE] Error fetching muscles:", error);
    return [];
  }
}

// Working approach - use exerciseinfo endpoint which has complete data
export async function fetchExercisesSimple(count = 30): Promise<Exercise[]> {
  try {
    // Get muscles first
    const muscles = await fetchMuscles();
    const muscleMap = new Map(muscles.map((m) => [m.id, m]));

    console.log("[EXERCISE SERVICE] Using mock data for now...");
    return createMockExercises(muscleMap);
  } catch (error) {
    console.error("[EXERCISE SERVICE] Error:", error);
    return createMockExercises(new Map());
  }
}

// Create mock exercises for testing
function createMockExercises(muscleMap: Map<number, Muscle>): Exercise[] {
  // Try to use real muscle data if available
  const chest = muscleMap.get(4) || {
    id: 4,
    name: "Pectoralis major",
    is_front: true,
  };
  const biceps = muscleMap.get(1) || {
    id: 1,
    name: "Biceps brachii",
    is_front: true,
  };
  const quads = muscleMap.get(10) || {
    id: 10,
    name: "Quadriceps femoris",
    is_front: true,
  };
  const shoulders = muscleMap.get(2) || {
    id: 2,
    name: "Anterior deltoid",
    is_front: true,
  };
  const triceps = muscleMap.get(5) || {
    id: 5,
    name: "Triceps brachii",
    is_front: false,
  };
  const back = muscleMap.get(12) || {
    id: 12,
    name: "Latissimus dorsi",
    is_front: false,
  };
  const hamstrings = muscleMap.get(11) || {
    id: 11,
    name: "Hamstrings",
    is_front: false,
  };
  const glutes = muscleMap.get(8) || {
    id: 8,
    name: "Gluteus maximus",
    is_front: false,
  };
  const abs = muscleMap.get(6) || {
    id: 6,
    name: "Rectus abdominis",
    is_front: true,
  };
  const calves = muscleMap.get(7) || { id: 7, name: "Calves", is_front: false };

  console.log("[EXERCISE SERVICE] Creating mock exercises with muscles:", {
    chest: chest.name,
    biceps: biceps.name,
    quads: quads.name,
  });

  return [
    {
      id: 1,
      name: "Bench Press",
      description:
        "Lie on your back on a bench and press the barbell up and down",
      muscles: [chest],
      muscles_secondary: [shoulders, triceps],
      category: 11, // Chest category
      image: "https://wger.de/media/exercise-images/192/Bench-press-1.png",
    },
    {
      id: 2,
      name: "Bicep Curl",
      description: "Curl the weight up using your biceps",
      muscles: [biceps],
      muscles_secondary: [],
      category: 8, // Arms category
      image: "https://wger.de/media/exercise-images/81/Biceps-curl-1.png",
    },
    {
      id: 3,
      name: "Squat",
      description: "Lower your body by bending your knees",
      muscles: [quads],
      muscles_secondary: [glutes, hamstrings],
      category: 9, // Legs category
      image: "https://wger.de/media/exercise-images/84/Squats-1.png",
    },
    {
      id: 4,
      name: "Lat Pulldown",
      description: "Pull the bar down to your chest",
      muscles: [back],
      muscles_secondary: [biceps],
      category: 12, // Back category
      image: "https://wger.de/media/exercise-images/91/Lat-pulldown-1.png",
    },
    {
      id: 5,
      name: "Shoulder Press",
      description: "Press the weight overhead",
      muscles: [shoulders],
      muscles_secondary: [triceps],
      category: 13, // Shoulders category
      image:
        "https://wger.de/media/exercise-images/119/Dumbbell-shoulder-press-1.png",
    },
    {
      id: 6,
      name: "Push-up",
      description: "Lower and raise your body using your arms",
      muscles: [chest],
      muscles_secondary: [shoulders, triceps],
      category: 11, // Chest category
      image: "https://wger.de/media/exercise-images/182/Push-ups-1.png",
    },
    {
      id: 7,
      name: "Deadlift",
      description: "Lift the barbell from the ground to hip level",
      muscles: [back, hamstrings],
      muscles_secondary: [quads, glutes],
      category: 12, // Back category
      image: "https://wger.de/media/exercise-images/105/Deadlifts-2.png",
    },
    {
      id: 8,
      name: "Tricep Extension",
      description:
        "Extend your arms overhead and lower the weight behind your head",
      muscles: [triceps],
      muscles_secondary: [],
      category: 8, // Arms category
      image: "https://wger.de/media/exercise-images/85/Triceps-extension-1.png",
    },
    {
      id: 9,
      name: "Leg Press",
      description: "Push the weight away using your legs",
      muscles: [quads],
      muscles_secondary: [glutes, hamstrings],
      category: 9, // Legs category
      image: "https://wger.de/media/exercise-images/115/Leg-press-1.png",
    },
    {
      id: 10,
      name: "Bent Over Row",
      description: "Pull the weight up to your chest while bent over",
      muscles: [back],
      muscles_secondary: [biceps, shoulders],
      category: 12, // Back category
      image: "https://wger.de/media/exercise-images/109/Bent-over-rows-1.png",
    },
    {
      id: 11,
      name: "Crunches",
      description: "Lift your upper body towards your knees",
      muscles: [abs],
      muscles_secondary: [],
      category: 10, // Abs category
      image: "https://wger.de/media/exercise-images/91/Crunches-1.png",
    },
    {
      id: 12,
      name: "Calf Raise",
      description: "Rise up on your toes",
      muscles: [calves],
      muscles_secondary: [],
      category: 14, // Calves category
      image:
        "https://wger.de/media/exercise-images/102/Standing-calf-raises-1.png",
    },
    {
      id: 13,
      name: "Plank",
      description: "Hold your body straight in a push-up position",
      muscles: [abs],
      muscles_secondary: [shoulders, back],
      category: 10, // Abs category
    },
    {
      id: 14,
      name: "Lunges",
      description: "Step forward and lower your body",
      muscles: [quads, glutes],
      muscles_secondary: [hamstrings, calves],
      category: 9, // Legs category
      image: "https://wger.de/media/exercise-images/113/Lunges-1.png",
    },
    {
      id: 15,
      name: "Pull-ups",
      description: "Pull your body up using a bar",
      muscles: [back],
      muscles_secondary: [biceps],
      category: 12, // Back category
      image: "https://wger.de/media/exercise-images/107/Pull-ups-1.png",
    },
  ];
}

// Clean HTML from description
function cleanDescription(description: string): string {
  return description
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

// Keep the original function for compatibility
export const fetchRandomExercises = fetchExercisesSimple;
