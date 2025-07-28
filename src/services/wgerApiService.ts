/**
 * WGER API Service - Free exercise database
 * https://wger.de/en/software/api
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

class WgerApiService {
  private baseUrl = "https://wger.de/api/v2";

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
      console.log("🔗 WGER API Request:", url);

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `WGER API Error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(
        "📊 WGER API Response:",
        `${data.results.length} exercises found`
      );

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
      console.log("💪 WGER Muscles loaded:", data.results.length);

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
      console.log("⚙️ WGER Equipment loaded:", data.results.length);

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
      console.log("📂 WGER Categories loaded:", data.results.length);

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

      console.log("🗺️ Equipment mapping:", Object.fromEntries(equipmentMap));

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

      console.log("🎯 Found equipment IDs:", equipmentIds);

      if (equipmentIds.length === 0) {
        console.warn("⚠️ No matching equipment found in WGER");
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
   * Convert WGER exercise to our internal format
   */
  async convertWgerExerciseToInternal(
    wgerExercise: WgerExercise
  ): Promise<any> {
    try {
      // Get muscles and equipment data for conversion
      const [musclesData, equipmentData] = await Promise.all([
        this.getMuscles(),
        this.getEquipment(),
      ]);

      // Create muscle name mapping
      const muscleMap = new Map<number, string>();
      musclesData.results.forEach((muscle) => {
        muscleMap.set(muscle.id, muscle.name);
      });

      // Create equipment name mapping
      const equipmentMap = new Map<number, string>();
      equipmentData.results.forEach((eq) => {
        equipmentMap.set(eq.id, eq.name);
      });

      // Convert to our internal format
      const primaryMuscles = wgerExercise.muscles
        .map((id) => muscleMap.get(id) || "Unknown")
        .filter((name) => name !== "Unknown");
      const secondaryMuscles = wgerExercise.muscles_secondary
        .map((id) => muscleMap.get(id) || "Unknown")
        .filter((name) => name !== "Unknown");
      const equipment =
        wgerExercise.equipment.length > 0
          ? equipmentMap.get(wgerExercise.equipment[0]) || "bodyweight"
          : "bodyweight";

      return {
        id: `wger_${wgerExercise.id}`,
        name: wgerExercise.name,
        category: wgerExercise.category.name,
        primaryMuscles,
        secondaryMuscles,
        equipment: equipment.toLowerCase().replace(" ", "_"),
        difficulty: "intermediate", // Default since WGER doesn't provide this
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
}

export const wgerApiService = new WgerApiService();
