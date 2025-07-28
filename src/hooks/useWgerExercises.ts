/**
 * @file src/hooks/useWgerExercises.ts
 * @brief Hook לאינטגרציה עם WGER API לתרגילי כושר באנגלית | WGER API integration hook for English exercises
 * @dependencies wgerService, React hooks
 * @notes מספק תרגילים באנגלית מ-WGER לצד התרגילים המקומיים בעברית
 * @recurring_errors שימוש ב-wgerApiService.ts במקום wgerService.ts הנכון
 */

import { useState, useEffect, useCallback } from "react";
import { wgerService, WgerExerciseInfo } from "../services/wgerService";

export interface WgerExerciseFormatted {
  id: string;
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string;
  difficulty: string;
  instructions: string[];
  images: string[];
  source: "wger";
  wgerId: number;
}

function useWgerExercises() {
  const [exercises, setExercises] = useState<WgerExerciseFormatted[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [muscles, setMuscles] = useState<Array<{ id: number; name: string }>>(
    []
  );
  const [equipment, setEquipment] = useState<
    Array<{ id: number; name: string }>
  >([]);

  // טעינת נתונים בסיסיים (שרירים, ציוד) בעת טעינה ראשונה | Load basic data (muscles, equipment) on mount
  useEffect(() => {
    loadBasicData();
  }, []);

  const loadBasicData = async () => {
    try {
      const [musclesData, equipmentData] = await Promise.all([
        wgerService.getMuscles(),
        wgerService.getEquipment(),
      ]);

      setMuscles(musclesData.map((m) => ({ id: m.id, name: m.name })));
      setEquipment(equipmentData.map((e) => ({ id: e.id, name: e.name })));

      console.log("📚 WGER Basic data loaded");
    } catch (err) {
      console.error("❌ Failed to load WGER basic data:", err);
      setError("Failed to load basic data");
    }
  };

  const convertWgerExerciseToInternal = (
    wgerEx: WgerExerciseInfo
  ): WgerExerciseFormatted => {
    return {
      id: `wger_${wgerEx.id}`,
      name: wgerEx.name,
      category: wgerEx.category,
      primaryMuscles: wgerEx.primaryMuscles,
      secondaryMuscles: wgerEx.secondaryMuscles,
      equipment: wgerEx.equipment.join(", ") || "None",
      difficulty: wgerEx.difficulty,
      instructions: wgerEx.instructions,
      images: [],
      source: "wger" as const,
      wgerId: wgerEx.id,
    };
  };

  const searchExercisesByEquipment = useCallback(
    async (equipmentNames: string[]): Promise<WgerExerciseFormatted[]> => {
      setLoading(true);
      setError(null);

      try {
        console.log(
          "🔍 Searching WGER exercises for equipment:",
          equipmentNames
        );

        const wgerExercises =
          await wgerService.getExercisesByEquipment(equipmentNames);
        console.log(`📊 Found ${wgerExercises.length} WGER exercises`);

        // המרה לפורמט הפנימי שלנו | Convert to our internal format
        const formattedExercises: WgerExerciseFormatted[] = wgerExercises.map(
          convertWgerExerciseToInternal
        );

        console.log(
          `✅ Converted ${formattedExercises.length} exercises to internal format`
        );
        setExercises(formattedExercises);

        return formattedExercises;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("❌ Error searching WGER exercises:", errorMessage);
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getExercisesByMuscle = useCallback(
    async (muscleNames: string[]): Promise<WgerExerciseFormatted[]> => {
      setLoading(true);
      setError(null);

      try {
        // לחיפוש לפי שרירים, נשתמש בתרגילים הבסיסיים ונסנן | For muscle-based search, we'll use the basic exercises and filter
        console.log("🎯 Searching for muscles:", muscleNames);

        const allExercises = await wgerService.getExercises({ limit: 100 });

        // סינון לפי שמות שרירים (התאמת טקסט בסיסית) | Filter by muscle names (basic text matching)
        const filtered = allExercises.filter((ex) =>
          muscleNames.some((muscleName) =>
            ex.name.toLowerCase().includes(muscleName.toLowerCase())
          )
        );

        console.log(`📊 Found ${filtered.length} exercises for muscles`);

        // המרת הפורמט הבסיסי לפורמט WgerExerciseInfo לעקביות | Convert the basic format to WgerExerciseInfo format for consistency
        const wgerInfoExercises: WgerExerciseInfo[] = filtered.map((ex) => ({
          id: ex.id,
          name: ex.name,
          category: "General",
          primaryMuscles: [],
          secondaryMuscles: [],
          equipment: [],
          description: ex.description || "",
          difficulty: "intermediate",
          instructions: ex.description ? [ex.description] : [],
        }));

        const formattedExercises = wgerInfoExercises.map(
          convertWgerExerciseToInternal
        );
        setExercises(formattedExercises);

        return formattedExercises;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(errorMessage);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getAllExercises = useCallback(async (): Promise<
    WgerExerciseFormatted[]
  > => {
    setLoading(true);
    setError(null);

    try {
      const allExercises = await wgerService.getExercises({ limit: 100 });

      // המרת הפורמט הבסיסי לפורמט WgerExerciseInfo לעקביות | Convert the basic format to WgerExerciseInfo format for consistency
      const wgerInfoExercises: WgerExerciseInfo[] = allExercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        category: "General",
        primaryMuscles: [],
        secondaryMuscles: [],
        equipment: [],
        description: ex.description || "",
        difficulty: "intermediate",
        instructions: ex.description ? [ex.description] : [],
      }));

      const formattedExercises = wgerInfoExercises.map(
        convertWgerExerciseToInternal
      );
      setExercises(formattedExercises);

      return formattedExercises;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    exercises,
    loading,
    error,
    muscles,
    equipment,
    searchExercisesByEquipment,
    getExercisesByMuscle,
    getAllExercises,
    clearError: () => setError(null),
  };
}

export { useWgerExercises };
