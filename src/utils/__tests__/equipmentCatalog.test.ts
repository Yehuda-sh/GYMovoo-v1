/**
 * @file src/utils/__tests__/equipmentCatalog.test.ts
 * @description בדיקות בסיסיות לקטלוג ציוד
 * @brief Basic equipment catalog tests
 */

import {
  normalizeEquipment,
  canPerform,
  checkExerciseAvailability,
  findSubstitute,
} from "../equipmentCatalog";

describe("equipmentCatalog", () => {
  describe("normalizeEquipment", () => {
    test("normalizes equipment with aliases", () => {
      expect(normalizeEquipment(["dumbbells"])).toEqual([
        "bodyweight",
        "dumbbell",
      ]);
      expect(normalizeEquipment(["barbells"])).toEqual([
        "bodyweight",
        "barbell",
      ]);
      expect(normalizeEquipment(["bands"])).toEqual(["bodyweight", "band"]);
    });

    test("handles empty and invalid inputs", () => {
      expect(normalizeEquipment([])).toEqual(["bodyweight"]);
      expect(normalizeEquipment(null)).toEqual(["bodyweight"]);
      expect(normalizeEquipment(["unknown"])).toEqual(["bodyweight"]);
    });

    test("removes duplicates", () => {
      expect(normalizeEquipment(["dumbbell", "dumbbells"])).toEqual([
        "bodyweight",
        "dumbbell",
      ]);
    });
  });

  describe("canPerform", () => {
    test("checks exact equipment availability", () => {
      expect(canPerform(["dumbbell"], ["dumbbell"])).toBe(true);
      expect(canPerform(["dumbbell"], ["barbell"])).toBe(false);
      expect(canPerform([], ["dumbbell"])).toBe(true);
      expect(canPerform(["dumbbell"], [])).toBe(false);
    });

    test("handles bodyweight requirements", () => {
      expect(canPerform(["bodyweight"], ["bodyweight"])).toBe(true);
      expect(canPerform(["bodyweight"], ["dumbbell"])).toBe(true);
    });
  });

  describe("findSubstitute", () => {
    test("finds available substitutes", () => {
      expect(findSubstitute("machine", ["dumbbell"])).toBe("dumbbell");
      expect(findSubstitute("barbell", ["dumbbell"])).toBe("dumbbell");
      expect(findSubstitute("dumbbell", ["bodyweight"])).toBe("bodyweight");
    });

    test("returns bodyweight as fallback", () => {
      expect(findSubstitute("machine", ["kettlebell", "bodyweight"])).toBe(
        "bodyweight"
      );
      expect(findSubstitute("dumbbell", [])).toBeNull();
    });
  });

  describe("checkExerciseAvailability", () => {
    test("checks direct availability", () => {
      const result = checkExerciseAvailability(["dumbbell"], ["dumbbell"]);
      expect(result.available).toBe(true);
      expect(result.needsSubstitutes).toBe(false);
    });

    test("checks availability with substitutes", () => {
      const result = checkExerciseAvailability(["machine"], ["dumbbell"]);
      expect(result.available).toBe(true);
      expect(result.needsSubstitutes).toBe(true);
    });

    test("handles unavailable equipment", () => {
      const result = checkExerciseAvailability(["machine"], []);
      expect(result.available).toBe(false);
      expect(result.needsSubstitutes).toBe(false);
    });
  });
});
