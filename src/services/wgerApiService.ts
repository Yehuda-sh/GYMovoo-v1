/**
 * @file WGER API Service - Free Exercise Database Integration
 * @description שירות API של WGER - מאגר תרגילים חינמי
 *
 * This service provides integration with the WGER exercise database API.
 * שירות זה מספק אינטגרציה עם API של מאגר התרגילים WGER.
 *
 * Features:
 * - Exercise retrieval by equipment and muscle groups
 * - Cached mapping for muscles and equipment
 * - Unified interface for all exercise operations
 * - TypeScript interfaces for type safety
 *
 * תכונות:
 * - קבלת תרגילים לפי ציוד וקבוצות שרירים
 * - מיפוי עם מטמון לשרירים וציוד
 * - ממשק מאוחד לכל פעולות התרגילים
 * - ממשקי TypeScript לבטיחות טיפוסים
 *
 * API Documentation: https://wger.de/en/software/api
 * @version 2.0.0 - Optimized with caching and unified interfaces
 */

export interface WgerExercise {
  id: number;
  name: string;
  description: string;
  muscles: number[];
  muscles_secondary: number[];
  equipment: number[];
  category: {
    id: number;
    name: string;
  };
  language: number;
  license: {
    id: number;
    full_name: string;
    short_name: string;
    url: string;
  };
  license_author: string;
  images: Array<{
    id: number;
    image: string;
    is_main: boolean;
  }>;
  variations: number[];
}

export interface WgerMuscle {
  id: number;
  name: string;
  is_front: boolean;
  image_url_main: string;
  image_url_secondary: string;
}

export interface WgerEquipment {
  id: number;
  name: string;
}

export interface WgerCategory {
  id: number;
  name: string;
}

// Unified interface for all WGER exercise operations
// ממשק מאוחד לכל פעולות תרגילי WGER
export interface WgerExerciseInfo {
  id: number;
  name: string;
  category: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  description: string;
  difficulty: string;
  instructions: string[];
  images?: string[];
  source?: string;
  wgerId?: number;
}

class WgerApiService {
  private baseUrl = "https://wger.de/api/v2";

  // Cache for mappings to avoid repeated API calls
  // מטמון למיפויים כדי למנוע קריאות API חוזרות
  private mappingsCache: {
    muscleMap: Map<number, string>;
    equipmentMap: Map<number, string>;
  } | null = null;

  /**
   * Get all exercises from WGER API
   */
  async getExercises(params?: {
    language?: number; // 2 = English
    equipment?: number[];
    muscles?: number[];
    category?: number;
    limit?: number;
    offset?: number;
  }): Promise<{
    results: WgerExercise[];
    count: number;
    next: string | null;
    previous: string | null;
  }> {
    try {
      const searchParams = new URLSearchParams();

      if (params?.language)
        searchParams.append("language", params.language.toString());
      if (params?.equipment && params.equipment.length > 0) {
        params.equipment.forEach((eq) =>
          searchParams.append("equipment", eq.toString())
        );
      }
      if (params?.muscles && params.muscles.length > 0) {
        params.muscles.forEach((m) =>
          searchParams.append("muscles", m.toString())
        );
      }
      if (params?.category)
        searchParams.append("category", params.category.toString());
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.offset)
        searchParams.append("offset", params.offset.toString());

      const url = `${this.baseUrl}/exercise/?${searchParams.toString()}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `WGER API Error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("❌ WGER API Error:", error);
      throw error;
    }
  }

  /**
   * Get exercise by ID
   */
  async getExerciseById(id: number): Promise<WgerExercise> {
    try {
      const response = await fetch(`${this.baseUrl}/exercise/${id}/`);

      if (!response.ok) {
        throw new Error(
          `WGER API Error: ${response.status} ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("❌ WGER API Error:", error);
      throw error;
    }
  }

  /**
   * Get all muscles
   */
  async getMuscles(): Promise<{ results: WgerMuscle[]; count: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/muscle/?limit=100`);

      if (!response.ok) {
        throw new Error(
          `WGER API Error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("❌ WGER API Error:", error);
      throw error;
    }
  }

  /**
   * Get all equipment
   */
  async getEquipment(): Promise<{ results: WgerEquipment[]; count: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/equipment/?limit=100`);

      if (!response.ok) {
        throw new Error(
          `WGER API Error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("❌ WGER API Error:", error);
      throw error;
    }
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<{ results: WgerCategory[]; count: number }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/exercisecategory/?limit=50`
      );

      if (!response.ok) {
        throw new Error(
          `WGER API Error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("❌ WGER API Error:", error);
      throw error;
    }
  }

  /**
   * Search exercises by equipment names (from our local equipment list)
   */
  async searchExercisesByEquipment(
    equipmentNames: string[]
  ): Promise<WgerExercise[]> {
    try {
      // First, get all equipment to map names to IDs
      const equipmentData = await this.getEquipment();
      const equipmentMap = new Map<string, number>();

      // Create a mapping of equipment names to IDs
      equipmentData.results.forEach((eq) => {
        const normalizedName = eq.name.toLowerCase();
        equipmentMap.set(normalizedName, eq.id);

        // Add some common aliases
        if (normalizedName.includes("dumbbell"))
          equipmentMap.set("dumbbells", eq.id);
        if (normalizedName.includes("barbell"))
          equipmentMap.set("barbell", eq.id);
        if (normalizedName.includes("bench")) equipmentMap.set("bench", eq.id);
        if (normalizedName.includes("cable"))
          equipmentMap.set("cable_machine", eq.id);
        if (normalizedName === "body weight" || normalizedName === "bodyweight")
          equipmentMap.set("bodyweight", eq.id);
      });

      // Find equipment IDs for our equipment names
      const equipmentIds: number[] = [];
      equipmentNames.forEach((name) => {
        const normalizedName = name.toLowerCase().replace("_", " ");
        if (equipmentMap.has(normalizedName)) {
          equipmentIds.push(equipmentMap.get(normalizedName)!);
        } else if (equipmentMap.has(name)) {
          equipmentIds.push(equipmentMap.get(name)!);
        }
      });

      if (equipmentIds.length === 0) {
        return [];
      }

      // Get exercises for these equipment IDs
      const exercisesData = await this.getExercises({
        language: 2, // English
        equipment: equipmentIds,
        limit: 50, // Limit to avoid too many results
      });

      return exercisesData.results;
    } catch (error) {
      console.error("❌ Error searching exercises by equipment:", error);
      return [];
    }
  }

  /**
   * Get muscle and equipment mappings with caching
   * קבלת מיפויי שרירים וציוד עם מטמון
   */
  private async getMappings(): Promise<{
    muscleMap: Map<number, string>;
    equipmentMap: Map<number, string>;
  }> {
    // Return cached mappings if available
    if (this.mappingsCache) {
      return this.mappingsCache;
    }

    const [musclesData, equipmentData] = await Promise.all([
      this.getMuscles(),
      this.getEquipment(),
    ]);

    const muscleMap = new Map<number, string>();
    musclesData.results.forEach((muscle) => {
      muscleMap.set(muscle.id, muscle.name);
    });

    const equipmentMap = new Map<number, string>();
    equipmentData.results.forEach((eq) => {
      equipmentMap.set(eq.id, eq.name);
    });

    // Cache the mappings
    this.mappingsCache = { muscleMap, equipmentMap };

    return this.mappingsCache;
  }

  /**
   * Clear mappings cache (useful for testing or forced refresh)
   * ניקוי מטמון המיפויים (שימושי לבדיקות או רענון מאולץ)
   */
  public clearMappingsCache(): void {
    this.mappingsCache = null;
  }

  /**
   * Convert WGER exercise to our internal format
   * המרת תרגיל WGER לפורמט פנימי
   */
  async convertWgerExerciseToInternal(
    wgerExercise: WgerExercise
  ): Promise<WgerExerciseInfo | null> {
    try {
      // Get muscles and equipment data for conversion
      const { muscleMap, equipmentMap } = await this.getMappings();

      // Convert to our internal format
      const primaryMuscles = wgerExercise.muscles
        .map((id) => muscleMap.get(id) || "Unknown")
        .filter((name) => name !== "Unknown");
      const secondaryMuscles = wgerExercise.muscles_secondary
        .map((id) => muscleMap.get(id) || "Unknown")
        .filter((name) => name !== "Unknown");
      const equipment = wgerExercise.equipment
        .map((id) => equipmentMap.get(id) || "bodyweight")
        .filter(Boolean);

      return {
        id: wgerExercise.id,
        name: wgerExercise.name,
        category: wgerExercise.category.name,
        primaryMuscles,
        secondaryMuscles,
        equipment,
        difficulty: "intermediate", // Default since WGER doesn't provide this
        description: wgerExercise.description || "",
        instructions: wgerExercise.description
          ? [wgerExercise.description]
          : [],
        images: wgerExercise.images.map((img) => img.image),
        source: "wger",
        wgerId: wgerExercise.id,
      };
    } catch (error) {
      console.error("❌ Error converting WGER exercise:", error);
      return null;
    }
  }

  /**
   * Get exercises by equipment names - optimized with caching
   * קבלת תרגילים לפי שמות ציוד - מאופטם עם מטמון
   */
  async getExercisesByEquipment(
    equipmentNames: string[]
  ): Promise<WgerExerciseInfo[]> {
    try {
      const wgerExercises =
        await this.searchExercisesByEquipment(equipmentNames);

      // Convert all exercises to unified format
      const convertedExercises = await Promise.all(
        wgerExercises.map((exercise) =>
          this.convertWgerExerciseToInternal(exercise)
        )
      );

      // Filter out null results and return
      return convertedExercises.filter(
        (exercise): exercise is WgerExerciseInfo => exercise !== null
      );
    } catch (error) {
      console.error("❌ Error in getExercisesByEquipment:", error);
      return [];
    }
  }
}

export const wgerApiService = new WgerApiService();
