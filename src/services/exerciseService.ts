// src/services/exerciseService.ts
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
  muscles: Muscle[];
  muscles_secondary: Muscle[];
  image?: string;
}

export async function fetchMuscles(): Promise<Muscle[]> {
  const res = await axios.get(`${BASE_URL}/muscle/`, {
    params: { language: 2 },
  });
  return res.data.results;
}

export async function fetchRandomExercises(count = 20): Promise<Exercise[]> {
  // שלב 1: הבא הרבה תרגילים באנגלית כולל תרגום ושמות שרירים
  const res = await axios.get(`${BASE_URL}/exercise/`, {
    params: {
      language: 2,
      status: 2,
      limit: 100,
    },
  });

  let raw = res.data.results;
  // רק כאלה עם שם ותיאור
  let exercises = raw
    .filter(
      (ex: any) => typeof ex.name === "string" && ex.name && ex.description
    )
    .map((ex: any) => ({
      id: ex.id,
      name: ex.name,
      description: ex.description,
      muscles: ex.muscles || [],
      muscles_secondary: ex.muscles_secondary || [],
    }));

  exercises = shuffleArray(exercises).slice(0, count);

  // שלב 2: טען תמונה ושרירים עיקריים/משניים כ-objects (לא ids)
  const [allMuscles] = await Promise.all([fetchMuscles()]);
  const musclesDict = Object.fromEntries(allMuscles.map((m) => [m.id, m]));

  // enrich muscle objects
  exercises = await Promise.all(
    exercises.map(async (ex: any) => {
      try {
        // תמונה
        const imgRes = await axios.get(`${BASE_URL}/exerciseimage/`, {
          params: { exercise: ex.id },
        });
        ex.image = imgRes.data.results?.[0]?.image || undefined;
      } catch {}
      // שרירים עיקריים
      ex.muscles = (ex.muscles || [])
        .map((id: number) => musclesDict[id])
        .filter(Boolean);
      ex.muscles_secondary = (ex.muscles_secondary || [])
        .map((id: number) => musclesDict[id])
        .filter(Boolean);
      return ex;
    })
  );
  return exercises;
}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}
