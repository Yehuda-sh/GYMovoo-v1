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

// Simple approach - get exercises with their translations in one go
export async function fetchExercisesSimple(count = 30): Promise<Exercise[]> {
  try {
    // Get muscles first
    const muscles = await fetchMuscles();
    const muscleMap = new Map(muscles.map((m) => [m.id, m]));

    // Try to get exercises that already have English names
    console.log("[EXERCISE SERVICE] Fetching exercises...");

    // Get exercise translations directly
    const translationsRes = await axios.get(`${BASE_URL}/exercise/`, {
      params: {
        language: 2, // English only
        status: 2, // Accepted
        limit: count * 2, // Get more since we'll filter
      },
    });

    console.log(
      "[EXERCISE SERVICE] Got translations response:",
      translationsRes.data.count
    );

    const exercises: Exercise[] = [];

    if (translationsRes.data.results) {
      // These results should have names since we specified language=2
      for (const item of translationsRes.data.results) {
        // Skip if no ID
        if (!item.id) continue;

        // Try to get the full exercise data
        try {
          const exerciseRes = await axios.get(
            `${BASE_URL}/exercise/${item.id}/`
          );
          const exercise = exerciseRes.data;

          // Skip if no name
          if (!exercise.name) continue;

          // Get the base exercise info for muscles
          const baseRes = await axios.get(
            `${BASE_URL}/exercise/${exercise.exercise_base}/`
          );
          const baseExercise = baseRes.data;

          // Map muscles
          const primaryMuscles = (baseExercise.muscles || [])
            .map((mid: number) => muscleMap.get(mid))
            .filter(Boolean) as Muscle[];

          if (primaryMuscles.length === 0) continue;

          const secondaryMuscles = (baseExercise.muscles_secondary || [])
            .map((mid: number) => muscleMap.get(mid))
            .filter(Boolean) as Muscle[];

          exercises.push({
            id: exercise.id,
            name: exercise.name,
            description: cleanDescription(exercise.description || ""),
            muscles: primaryMuscles,
            muscles_secondary: secondaryMuscles,
            category: exercise.category,
          });

          console.log(`[EXERCISE SERVICE] Added exercise: ${exercise.name}`);

          if (exercises.length >= count) break;
        } catch (e) {
          // Skip this exercise
          continue;
        }
      }
    }

    // If that didn't work, try a different approach
    if (exercises.length === 0) {
      console.log("[EXERCISE SERVICE] Trying alternative approach...");
      return fetchExercisesAlternative(count);
    }

    console.log("[EXERCISE SERVICE] Final exercises count:", exercises.length);
    return exercises;
  } catch (error) {
    console.error("[EXERCISE SERVICE] Error:", error);
    return fetchExercisesAlternative(count);
  }
}

// Alternative approach with hardcoded popular exercises
async function fetchExercisesAlternative(count = 30): Promise<Exercise[]> {
  try {
    const muscles = await fetchMuscles();
    const muscleMap = new Map(muscles.map((m) => [m.id, m]));

    // Known exercise IDs that usually work
    const knownExerciseIds = [
      345, // Bench Press
      192, // Front raises
      81, // Crunches
      84, // Dips
      74, // Deadlifts
      91, // Hammer Curls
      83, // Lat pulldown
      97, // Pull-ups
      111, // Squats
      109, // Shoulder press
      // Add more known IDs as needed
    ];

    const exercises: Exercise[] = [];

    for (const id of knownExerciseIds) {
      try {
        // Get exercise translation
        const res = await axios.get(`${BASE_URL}/exercise/`, {
          params: {
            language: 2,
            exercise_base: id,
            limit: 1,
          },
        });

        if (res.data.results && res.data.results.length > 0) {
          const ex = res.data.results[0];

          // Get base exercise for muscles
          const baseRes = await axios.get(`${BASE_URL}/exercisebase/${id}/`);
          const base = baseRes.data;

          const primaryMuscles = (base.muscles || [])
            .map((mid: number) => muscleMap.get(mid))
            .filter(Boolean) as Muscle[];

          const secondaryMuscles = (base.muscles_secondary || [])
            .map((mid: number) => muscleMap.get(mid))
            .filter(Boolean) as Muscle[];

          if (primaryMuscles.length > 0 && ex.name) {
            exercises.push({
              id: ex.id,
              name: ex.name,
              description: cleanDescription(ex.description || ""),
              muscles: primaryMuscles,
              muscles_secondary: secondaryMuscles,
              category: base.category,
            });

            console.log(`[EXERCISE SERVICE] Added known exercise: ${ex.name}`);
          }
        }
      } catch (e) {
        continue;
      }

      if (exercises.length >= count) break;
    }

    // If still no exercises, create mock data
    if (exercises.length === 0) {
      console.log("[EXERCISE SERVICE] Using mock data...");
      return createMockExercises(muscleMap);
    }

    return exercises;
  } catch (error) {
    console.error("[EXERCISE SERVICE] Alternative approach failed:", error);
    return createMockExercises(new Map());
  }
}

// Create mock exercises for testing
function createMockExercises(muscleMap: Map<number, Muscle>): Exercise[] {
  const chest = muscleMap.get(4) || { id: 4, name: "Chest", is_front: true };
  const biceps = muscleMap.get(1) || { id: 1, name: "Biceps", is_front: true };
  const quads = muscleMap.get(10) || {
    id: 10,
    name: "Quadriceps",
    is_front: true,
  };
  const shoulders = muscleMap.get(2) || {
    id: 2,
    name: "Shoulders",
    is_front: true,
  };
  const triceps = muscleMap.get(5) || {
    id: 5,
    name: "Triceps",
    is_front: false,
  };

  return [
    {
      id: 1,
      name: "Bench Press",
      description:
        "Lie on your back on a bench and press the barbell up and down",
      muscles: [chest],
      muscles_secondary: [shoulders, triceps],
    },
    {
      id: 2,
      name: "Bicep Curl",
      description: "Curl the weight up using your biceps",
      muscles: [biceps],
      muscles_secondary: [],
    },
    {
      id: 3,
      name: "Squat",
      description: "Lower your body by bending your knees",
      muscles: [quads],
      muscles_secondary: [],
    },
    {
      id: 4,
      name: "Shoulder Press",
      description: "Press the weight overhead",
      muscles: [shoulders],
      muscles_secondary: [triceps],
    },
    {
      id: 5,
      name: "Push-up",
      description: "Lower and raise your body using your arms",
      muscles: [chest],
      muscles_secondary: [shoulders, triceps],
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
