/**
 * @file exercises/types.ts
 * @description טיפוסים משותפים לתרגילים
 * Shared types for exercises
 */

export interface Exercise {
  id: string;
  name: string;
  nameLocalized: {
    he: string;
    en: string;
  };
  category: "strength" | "cardio" | "flexibility" | "core";
  primaryMuscles: string[];
  secondaryMuscles?: string[];
  equipment: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  instructions: {
    he: string[];
    en: string[];
  };
  tips: {
    he: string[];
    en: string[];
  };
  safetyNotes: {
    he: string[];
    en: string[];
  };
  media: {
    image: string;
    video: string;
    thumbnail: string;
  };
  homeCompatible: boolean;
  gymPreferred: boolean;
  outdoorSuitable: boolean;
  spaceRequired: "minimal" | "small" | "medium" | "large";
  noiseLevel: "silent" | "quiet" | "moderate" | "loud";
}
