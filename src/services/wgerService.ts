/**
 * WGER API Service - שירות לחיבור ל-API של WGER
 * מאפשר שליפת תרגילים אמיתיים לפי ציוד ושרירים
 */

// סוגי נתונים עבור WGER API
export interface WgerExercise {
  id: number;
  name: string;
  description: string;
  category: number;
  muscles: number[];
  muscles_secondary: number[];
  equipment: number[];
  language: number;
  license: number;
  license_author: string;
  status: string;
  creation_date: string;
  uuid: string;
  variations: number[];
  author_history: string[];
}

export interface WgerCategory {
  id: number;
  name: string;
}

export interface WgerMuscle {
  id: number;
  name: string;
  name_en: string;
  is_front: boolean;
}

export interface WgerEquipment {
  id: number;
  name: string;
}

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
}

class WgerService {
  private baseUrl = "https://wger.de/api/v2";
  private language = 2; // English

  // Cache for API responses
  private cache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * בדיקה אם הנתונים במטמון עדיין תקפים
   */
  private isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  /**
   * שמירה במטמון
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  /**
   * קבלת נתונים מהמטמון
   */
  private getCache(key: string): any | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key) || null;
    }
    return null;
  }

  /**
   * בקשה בסיסית ל-API עם טיפול בשגיאות
   */
  private async makeRequest<T>(endpoint: string): Promise<T> {
    const cacheKey = endpoint;
    const cached = this.getCache(cacheKey);

    if (cached) {
      console.log(`🗄️ WGER: Using cached data for ${endpoint}`);
      return cached;
    }

    try {
      console.log(`🌐 WGER: Fetching ${this.baseUrl}${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          Accept: "application/json",
          "User-Agent": "GYMovoo-App/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      this.setCache(cacheKey, data);

      console.log(`✅ WGER: Successfully fetched ${endpoint}`);
      return data;
    } catch (error) {
      console.error(`❌ WGER API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * קבלת כל הקטגוריות
   */
  async getCategories(): Promise<WgerCategory[]> {
    try {
      const response = await this.makeRequest<{ results: WgerCategory[] }>(
        "/exercisecategory/"
      );
      return response.results || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  }

  /**
   * קבלת כל השרירים
   */
  async getMuscles(): Promise<WgerMuscle[]> {
    try {
      const response = await this.makeRequest<{ results: WgerMuscle[] }>(
        "/muscle/"
      );
      return response.results || [];
    } catch (error) {
      console.error("Error fetching muscles:", error);
      return [];
    }
  }

  /**
   * קבלת כל הציוד
   */
  async getEquipment(): Promise<WgerEquipment[]> {
    try {
      const response = await this.makeRequest<{ results: WgerEquipment[] }>(
        "/equipment/"
      );
      return response.results || [];
    } catch (error) {
      console.error("Error fetching equipment:", error);
      return [];
    }
  }

  /**
   * קבלת תרגילים עם פילטרים
   */
  async getExercises(filters?: {
    category?: number;
    muscle?: number;
    equipment?: number;
    limit?: number;
  }): Promise<WgerExercise[]> {
    try {
      let endpoint = `/exercise/?language=${this.language}&status=2`; // status=2 means accepted

      if (filters) {
        if (filters.category) endpoint += `&category=${filters.category}`;
        if (filters.muscle) endpoint += `&muscles=${filters.muscle}`;
        if (filters.equipment) endpoint += `&equipment=${filters.equipment}`;
        if (filters.limit) endpoint += `&limit=${filters.limit}`;
      }

      const response = await this.makeRequest<{ results: WgerExercise[] }>(
        `${endpoint}&limit=50`
      );
      return response.results || [];
    } catch (error) {
      console.error("Error fetching exercises:", error);
      return [];
    }
  }

  /**
   * קבלת תרגילים לפי ציוד זמין - הפונקציה הראשית
   */
  async getExercisesByEquipment(
    equipmentNames: string[]
  ): Promise<WgerExerciseInfo[]> {
    try {
      console.log("🏋️ WGER: Getting exercises for equipment:", equipmentNames);

      // קבלת כל הנתונים הנדרשים במקביל
      const [categories, muscles, equipment] = await Promise.all([
        this.getCategories(),
        this.getMuscles(),
        this.getEquipment(),
      ]);

      console.log(
        `📊 WGER: Loaded ${categories.length} categories, ${muscles.length} muscles, ${equipment.length} equipment`
      );

      // יצירת מפות לחיפוש מהיר
      const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
      const muscleMap = new Map(
        muscles.map((m) => [m.id, m.name_en || m.name])
      );
      const equipmentMap = new Map(equipment.map((e) => [e.id, e.name]));

      // מיפוי שמות הציוד שלנו לשמות ב-WGER
      const equipmentMapping: { [key: string]: string[] } = {
        barbell: ["Barbell", "Long barbell"],
        dumbbells: ["Dumbbell", "Dumbbells"],
        cable_machine: ["Cable", "Cable machine"],
        bench: ["Bench", "Incline bench"],
        bodyweight: ["Body weight", "None (bodyweight exercise)"],
        kettlebell: ["Kettlebell"],
        resistance_bands: ["Resistance band"],
        pull_up_bar: ["Pull-up bar"],
        smith_machine: ["Smith machine"],
        leg_press: ["Leg press"],
        treadmill: ["Treadmill"],
        bike: ["Exercise bike"],
        rowing_machine: ["Rowing machine"],
      };

      // איתור IDs של הציוד הרלוונטי
      const relevantEquipmentIds: number[] = [];

      for (const equipName of equipmentNames) {
        const wgerNames = equipmentMapping[equipName] || [];
        for (const wgerName of wgerNames) {
          const equipmentEntry = equipment.find((e) =>
            e.name.toLowerCase().includes(wgerName.toLowerCase())
          );
          if (equipmentEntry) {
            relevantEquipmentIds.push(equipmentEntry.id);
          }
        }
      }

      // אם לא מצאנו ציוד, נכלול גם תרגילי משקל גוף
      if (relevantEquipmentIds.length === 0) {
        const bodyweightEquip = equipment.find(
          (e) =>
            e.name.toLowerCase().includes("body") ||
            e.name.toLowerCase().includes("none")
        );
        if (bodyweightEquip) {
          relevantEquipmentIds.push(bodyweightEquip.id);
        }
      }

      console.log(`⚙️ WGER: Found equipment IDs:`, relevantEquipmentIds);

      // קבלת תרגילים עבור כל סוג ציוד
      const allExercises: WgerExercise[] = [];

      for (const equipId of relevantEquipmentIds) {
        const exercises = await this.getExercises({
          equipment: equipId,
          limit: 20,
        });
        allExercises.push(...exercises);
      }

      // הוספת תרגילי משקל גוף תמיד
      const bodyweightExercises = await this.getExercises({ limit: 30 });
      const bodyweightFiltered = bodyweightExercises.filter(
        (ex) =>
          ex.equipment.length === 0 ||
          ex.equipment.some((id) => {
            const equipName = equipmentMap.get(id);
            return (
              equipName &&
              (equipName.toLowerCase().includes("body") ||
                equipName.toLowerCase().includes("none"))
            );
          })
      );

      allExercises.push(...bodyweightFiltered);

      console.log(`💪 WGER: Total exercises found: ${allExercises.length}`);

      // הסרת כפילויות והמרה לפורמט שלנו
      const uniqueExercises = Array.from(
        new Map(allExercises.map((ex) => [ex.id, ex])).values()
      );

      const formattedExercises: WgerExerciseInfo[] = uniqueExercises.map(
        (exercise) => {
          const categoryName = categoryMap.get(exercise.category) || "General";
          const primaryMuscles = exercise.muscles
            .map((id) => muscleMap.get(id))
            .filter(Boolean) as string[];
          const secondaryMuscles = exercise.muscles_secondary
            .map((id) => muscleMap.get(id))
            .filter(Boolean) as string[];
          const equipmentNames = exercise.equipment
            .map((id) => equipmentMap.get(id))
            .filter(Boolean) as string[];

          // קביעת רמת קושי לפי מורכבות התרגיל
          let difficulty = "beginner";
          if (primaryMuscles.length > 2 || secondaryMuscles.length > 1) {
            difficulty = "intermediate";
          }
          if (
            equipmentNames.some((eq) => eq.toLowerCase().includes("barbell"))
          ) {
            difficulty = "intermediate";
          }

          return {
            id: exercise.id,
            name: exercise.name,
            category: categoryName,
            primaryMuscles,
            secondaryMuscles,
            equipment: equipmentNames,
            description: exercise.description || "",
            difficulty,
            instructions: exercise.description ? [exercise.description] : [],
          };
        }
      );

      console.log(`✅ WGER: Formatted ${formattedExercises.length} exercises`);

      // הצגת דוגמאות
      formattedExercises.slice(0, 3).forEach((ex, i) => {
        console.log(
          `📋 WGER Exercise ${i + 1}: ${ex.name} - ${ex.category} - [${ex.primaryMuscles.join(", ")}]`
        );
      });

      return formattedExercises;
    } catch (error) {
      console.error("❌ Error in getExercisesByEquipment:", error);
      return [];
    }
  }

  /**
   * חיפוש תרגילים לפי שם
   */
  async searchExercises(query: string): Promise<WgerExerciseInfo[]> {
    try {
      // WGER לא תומך בחיפוש טקסט ישיר, אז נקבל תרגילים ונסנן
      const exercises = await this.getExercises({ limit: 100 });

      const filtered = exercises.filter((ex) =>
        ex.name.toLowerCase().includes(query.toLowerCase())
      );

      // המרה לפורמט שלנו (פשוט יותר)
      const [categories, muscles, equipment] = await Promise.all([
        this.getCategories(),
        this.getMuscles(),
        this.getEquipment(),
      ]);

      const categoryMap = new Map(categories.map((c) => [c.id, c.name]));
      const muscleMap = new Map(
        muscles.map((m) => [m.id, m.name_en || m.name])
      );
      const equipmentMap = new Map(equipment.map((e) => [e.id, e.name]));

      return filtered.map((exercise) => ({
        id: exercise.id,
        name: exercise.name,
        category: categoryMap.get(exercise.category) || "General",
        primaryMuscles: exercise.muscles
          .map((id) => muscleMap.get(id))
          .filter(Boolean) as string[],
        secondaryMuscles: exercise.muscles_secondary
          .map((id) => muscleMap.get(id))
          .filter(Boolean) as string[],
        equipment: exercise.equipment
          .map((id) => equipmentMap.get(id))
          .filter(Boolean) as string[],
        description: exercise.description || "",
        difficulty: "intermediate",
        instructions: exercise.description ? [exercise.description] : [],
      }));
    } catch (error) {
      console.error("Error searching exercises:", error);
      return [];
    }
  }

  /**
   * ניקוי מטמון
   */
  clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
    console.log("🗑️ WGER: Cache cleared");
  }
}

export const wgerService = new WgerService();
export default wgerService;
