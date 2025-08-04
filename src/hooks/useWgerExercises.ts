/**
 * @file src/hooks/useWgerExercises.ts
 * @brief Enhanced WGER Exercises Hook - hook מתקדם לתרגילי WGER
 * @description Hook for fetching and managing WGER exercise data with unified interfaces
 * @dependencies wgerApiService, WgerExerciseInfo unified interface
 * @notes Uses unified WgerExerciseInfo interface, eliminates format conversion duplication
 * @version 2.0.0 - Unified interfaces, eliminated WgerExerciseFormatted duplication
 */

import { useState, useEffect, useCallback } from "react";
import { wgerApiService, WgerExerciseInfo } from "../services/wgerApiService";

export function useWgerExercises() {
  const [exercises, setExercises] = useState<WgerExerciseInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [muscles, setMuscles] = useState<Array<{ id: number; name: string }>>(
    []
  );
  const [equipment, setEquipment] = useState<
    Array<{ id: number; name: string }>
  >([]);

  // Load basic data (muscles, equipment) on mount
  useEffect(() => {
    loadBasicData();
  }, []);

  const loadBasicData = async () => {
    try {
      const [musclesData, equipmentData] = await Promise.all([
        wgerApiService.getMuscles(),
        wgerApiService.getEquipment(),
      ]);

      setMuscles(musclesData.results.map((m) => ({ id: m.id, name: m.name })));
      setEquipment(
        equipmentData.results.map((e) => ({ id: e.id, name: e.name }))
      );

      console.log("📚 WGER Basic data loaded");
    } catch (err) {
      console.error("❌ Failed to load WGER basic data:", err);
      setError("Failed to load basic data");
    }
  };

  const searchExercisesByEquipment = useCallback(
    async (equipmentNames: string[]): Promise<WgerExerciseInfo[]> => {
      setLoading(true);
      setError(null);

      try {
        console.log(
          "🔍 Searching WGER exercises for equipment:",
          equipmentNames
        );

        const wgerExercises =
          await wgerApiService.getExercisesByEquipment(equipmentNames);
        console.log(`📊 Found ${wgerExercises.length} WGER exercises`);

        // Use exercises directly - no conversion needed (unified interface)
        console.log(
          `✅ Using ${wgerExercises.length} exercises directly from unified interface`
        );
        setExercises(wgerExercises);

        return wgerExercises;
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
    async (muscleNames: string[]): Promise<WgerExerciseInfo[]> => {
      setLoading(true);
      setError(null);

      try {
        // For muscle-based search, we'll use the basic exercises and filter
        console.log("🎯 Searching for muscles:", muscleNames);

        const exercisesData = await wgerApiService.getExercises({ limit: 100 });
        const allExercises = exercisesData.results;

        // Filter by muscle names (basic text matching)
        const filtered = allExercises.filter((ex) =>
          muscleNames.some((muscleName) =>
            ex.name.toLowerCase().includes(muscleName.toLowerCase())
          )
        );

        console.log(`📊 Found ${filtered.length} exercises for muscles`);

        // Convert to unified WgerExerciseInfo format
        const wgerInfoExercises: WgerExerciseInfo[] = filtered.map((ex) => ({
          id: ex.id,
          name: ex.name,
          category: ex.category.name,
          primaryMuscles: [],
          secondaryMuscles: [],
          equipment: [],
          description: ex.description || "",
          difficulty: "intermediate",
          instructions: ex.description ? [ex.description] : [],
        }));

        // Use exercises directly - no conversion needed
        setExercises(wgerInfoExercises);
        return wgerInfoExercises;
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

  const getAllExercises = useCallback(async (): Promise<WgerExerciseInfo[]> => {
    setLoading(true);
    setError(null);

    try {
      const exercisesData = await wgerApiService.getExercises({ limit: 100 });
      const allExercises = exercisesData.results;

      // Convert to unified WgerExerciseInfo format
      const wgerInfoExercises: WgerExerciseInfo[] = allExercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        category: ex.category.name,
        primaryMuscles: [],
        secondaryMuscles: [],
        equipment: [],
        description: ex.description || "",
        difficulty: "intermediate",
        instructions: ex.description ? [ex.description] : [],
      }));

      // Use exercises directly - no conversion needed
      setExercises(wgerInfoExercises);
      return wgerInfoExercises;
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
