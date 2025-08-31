/**
 * @file src/utils/__tests__/equipmentCatalog.test.ts
 * @description בדיקות מקיפות לקטלוג הציוד - Equipment catalog comprehensive tests
 * @brief Comprehensive test suite for equipment catalog functionality
 */

import {
  normalizeEquipment,
  canPerform,
  getExerciseAvailability,
  EQUIPMENT_SYNONYMS,
  SUBSTITUTIONS,
  EquipmentTag,
} from "../equipmentCatalog";

describe("Equipment Catalog - normalizeEquipment", () => {
  test("should normalize single equipment correctly", () => {
    expect(normalizeEquipment(["dumbbells"])).toEqual([
      "bodyweight",
      "dumbbell",
    ]);
    expect(normalizeEquipment(["barbells"])).toEqual(["bodyweight", "barbell"]);
    expect(normalizeEquipment(["machines"])).toEqual(["bodyweight", "machine"]);
  });

  test("should handle multiple equipment normalization", () => {
    expect(normalizeEquipment(["dumbbells", "barbells", "machines"])).toEqual([
      "bodyweight",
      "dumbbell",
      "barbell",
      "machine",
    ]);
  });

  test("should handle unknown equipment gracefully", () => {
    expect(normalizeEquipment(["unknown_equipment"])).toEqual(["bodyweight"]);
  });

  test("should handle empty array", () => {
    expect(normalizeEquipment([])).toEqual(["bodyweight"]);
  });

  test("should handle mixed known and unknown equipment", () => {
    expect(normalizeEquipment(["dumbbells", "unknown", "barbell"])).toEqual([
      "bodyweight",
      "dumbbell",
      "barbell",
    ]);
  });
});

describe("Equipment Catalog - canPerform", () => {
  test("should return true for exact equipment match", () => {
    expect(canPerform(["dumbbell"], ["dumbbell"])).toBe(true);
    expect(canPerform(["machine"], ["machine"])).toBe(true);
  });

  test("should return false for substitution equipment (canPerform only checks direct availability)", () => {
    expect(canPerform(["machine"], ["dumbbell"])).toBe(false);
    expect(canPerform(["cable"], ["resistance_bands"])).toBe(false);
  });

  test("should return false for incompatible equipment", () => {
    expect(canPerform(["machine"], ["bodyweight"])).toBe(false);
    expect(canPerform(["cable"], ["barbell"])).toBe(false);
  });

  test("should return false for bodyweight requirements when bodyweight not in owned", () => {
    expect(canPerform(["dumbbell"], ["machine"])).toBe(false);
    expect(canPerform(["machine"], ["cable"])).toBe(false);
  });

  test("should handle empty user equipment", () => {
    expect(canPerform([], ["dumbbell"])).toBe(true); // No requirements
    expect(canPerform(["dumbbell"], [])).toBe(false);
  });
});

describe("Equipment Catalog - getExerciseAvailability", () => {
  test("should return perfect match with isFullySupported true", () => {
    const result = getExerciseAvailability(["dumbbell"], ["dumbbell"]);
    expect(result.canPerform).toBe(true);
    expect(result.isFullySupported).toBe(true);
    expect(result.substitutions).toBeUndefined();
  });

  test("should return substitution when available", () => {
    const result = getExerciseAvailability(["machine"], ["dumbbell"]);
    expect(result.canPerform).toBe(true);
    expect(result.isFullySupported).toBe(false);
    expect(result.substitutions).toBeDefined();
    expect(result.substitutions?.["machine"]).toBe("dumbbell");
  });

  test("should return cannot perform when no compatible equipment", () => {
    const result = getExerciseAvailability(["machine"], ["kettlebell"]);
    expect(result.canPerform).toBe(false);
    expect(result.isFullySupported).toBe(false);
    expect(result.substitutions).toBeUndefined();
  });

  test("should handle multiple user equipment options", () => {
    const result = getExerciseAvailability(
      ["machine", "dumbbell"],
      ["dumbbell", "barbell"]
    );
    expect(result.canPerform).toBe(true); // machine can be substituted with dumbbell
    expect(result.isFullySupported).toBe(false);
    expect(result.substitutions?.["machine"]).toBe("dumbbell");
  });
});

describe("Equipment Catalog - EQUIPMENT_SYNONYMS", () => {
  test("should contain expected synonym mappings", () => {
    expect(EQUIPMENT_SYNONYMS["dumbbells"]).toBe("dumbbell");
    expect(EQUIPMENT_SYNONYMS["barbells"]).toBe("barbell");
    expect(EQUIPMENT_SYNONYMS["machines"]).toBe("machine");
    expect(EQUIPMENT_SYNONYMS["db"]).toBe("dumbbell");
    expect(EQUIPMENT_SYNONYMS["bb"]).toBe("barbell");
  });

  test("should handle case variations", () => {
    expect(EQUIPMENT_SYNONYMS["DUMBBELLS"]).toBeUndefined();
    expect(EQUIPMENT_SYNONYMS["dumbbells"]).toBe("dumbbell");
  });
});

describe("Equipment Catalog - SUBSTITUTIONS", () => {
  test("should contain substitution mappings for all equipment types", () => {
    expect(SUBSTITUTIONS.machine).toContain("dumbbell");
    expect(SUBSTITUTIONS.machine).toContain("cable");
    expect(SUBSTITUTIONS.machine).toContain("bodyweight");

    expect(SUBSTITUTIONS.cable).toContain("band");
    expect(SUBSTITUTIONS.cable).toContain("dumbbell");
    expect(SUBSTITUTIONS.cable).toContain("bodyweight");
  });

  test("should have bodyweight as final fallback for most equipment", () => {
    const equipmentTypes: EquipmentTag[] = [
      "dumbbell",
      "barbell",
      "machine",
      "kettlebell",
      "cable",
      "band",
      "bench",
    ];

    equipmentTypes.forEach((equipment) => {
      expect(SUBSTITUTIONS[equipment]).toContain("bodyweight");
    });
  });
});

describe("Equipment Catalog - Edge Cases", () => {
  test("should handle undefined and null inputs gracefully", () => {
    expect(() => normalizeEquipment(undefined as any)).not.toThrow();
    expect(() => canPerform(undefined as any, ["dumbbell"])).not.toThrow();
    expect(() =>
      getExerciseAvailability(undefined as any, ["dumbbell"])
    ).not.toThrow();
  });

  test("should handle duplicate equipment in arrays", () => {
    expect(normalizeEquipment(["dumbbell", "dumbbell"])).toEqual([
      "bodyweight",
      "dumbbell",
    ]);
    expect(canPerform(["dumbbell", "dumbbell"], ["dumbbell"])).toBe(true);
  });

  test("should handle equipment with special characters", () => {
    expect(normalizeEquipment(["cable_machine"])).toEqual([
      "bodyweight",
      "cable_machine",
    ]);
    expect(normalizeEquipment(["resistance_bands"])).toEqual([
      "bodyweight",
      "resistance_bands",
    ]);
  });
});

describe("Equipment Catalog - Integration Tests", () => {
  test("should work end-to-end with realistic scenarios", () => {
    // User has dumbbells and resistance bands at home
    const userEquipment: EquipmentTag[] = ["dumbbell", "resistance_bands"];

    // Exercise requires cable machine
    const exerciseEquipment: EquipmentTag[] = ["cable"];

    const availability = getExerciseAvailability(
      exerciseEquipment,
      userEquipment
    );

    expect(availability.canPerform).toBe(true);
    expect(availability.isFullySupported).toBe(false);
    expect(availability.substitutions).toBeDefined();
    expect(availability.substitutions?.["cable"]).toBe("dumbbell"); // cable -> dumbbell (band not available)
  });

  test("should handle gym user with full equipment", () => {
    const userEquipment: EquipmentTag[] = [
      "barbell",
      "dumbbell",
      "machine",
      "cable",
      "kettlebell",
    ];

    const exerciseEquipment: EquipmentTag[] = ["machine"];

    const availability = getExerciseAvailability(
      exerciseEquipment,
      userEquipment
    );

    expect(availability.canPerform).toBe(true);
    expect(availability.isFullySupported).toBe(true);
    expect(availability.substitutions).toBeUndefined();
  });

  test("should handle bodyweight-only user", () => {
    const userEquipment: EquipmentTag[] = ["bodyweight"];

    const exerciseEquipment: EquipmentTag[] = ["dumbbell"];

    const availability = getExerciseAvailability(
      exerciseEquipment,
      userEquipment
    );

    expect(availability.canPerform).toBe(true);
    expect(availability.isFullySupported).toBe(false);
    expect(availability.substitutions).toBeDefined();
    expect(availability.substitutions?.["dumbbell"]).toBe("bodyweight");
  });
});
