import axios from "axios";

const BASE_URL = "https://wger.de/api/v2";

export interface Muscle {
  id: number;
  name: string;
  is_front: boolean;
}

export interface Exercise {
  id: number;
  name: string;
  description: string;
  muscles: number[];
  muscles_secondary: number[];
  image?: string;
}

// שליפת שרירים (שם, id וכו')
export async function fetchMuscles(): Promise<Muscle[]> {
  const res = await axios.get(`${BASE_URL}/muscle/`, {
    params: { language: 2 },
  });
  console.log(
    "[EXERCISE SERVICE] Muscles fetched:",
    res.data.results.length,
    res.data.results[0]
  );
  return res.data.results;
}

export async function fetchRandomExercises(count = 50): Promise<Exercise[]> {
  const res = await axios.get(`${BASE_URL}/exercise/`, {
    params: {
      language: 2, // חשוב כי זה מאפשר לשלוף את ה-translations באנגלית!
      status: 2,
      limit: 300,
    },
  });

  console.log(
    "[EXERCISE SERVICE] RAW EXERCISES",
    res.data.results.length,
    res.data.results[0]
  );

  const raw = res.data.results;

  // **שלב 1: הוצא תרגום באנגלית (מתוך translations)**
  let exercises: Exercise[] = raw
    .map((ex: any) => {
      const en = Array.isArray(ex.translations)
        ? ex.translations.find((t: any) => t.language === 2)
        : null;
      if (!en) return null;
      return {
        id: ex.id,
        name: en.name,
        description: en.description,
        muscles: ex.muscles || [],
        muscles_secondary: ex.muscles_secondary || [],
      };
    })
    .filter(
      (ex): ex is Exercise =>
        !!ex &&
        !!ex.name &&
        !!ex.description &&
        Array.isArray(ex.muscles) &&
        ex.muscles.length > 0
    );

  console.log(
    "[EXERCISE SERVICE] AFTER MAP+FILTER",
    exercises.length,
    exercises[0]
  );

  // ערבוב ובחירה
  exercises = shuffleArray(exercises).slice(0, count);

  // **הוסף תמונה לכל תרגיל**
  exercises = await Promise.all(
    exercises.map(async (ex) => {
      try {
        const imgRes = await axios.get(`${BASE_URL}/exerciseimage/`, {
          params: { exercise: ex.id },
        });
        ex.image = imgRes.data.results?.[0]?.image || undefined;
      } catch {
        ex.image = undefined;
      }
      return ex;
    })
  );

  console.log(
    "[EXERCISE SERVICE] FINAL EXERCISES",
    exercises.length,
    exercises[0]
  );
  return exercises;
}

// ערבוב מערך
function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}
