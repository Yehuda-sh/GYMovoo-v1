/**
 * @file exercises/types.ts
 * @description טיפוסים משותפים לתרגילים
 * Shared types for exercises
 */

import { ExerciseDifficulty, MuscleGroup } from "../../constants/exercise";

// Category type moved here since not used elsewhere
export type ExerciseCategory = "strength" | "cardio" | "flexibility" | "core";

export interface Exercise {
  id: string;
  name: string;
  nameLocalized: {
    he: string;
    en: string;
  };
  category: ExerciseCategory;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
  equipment: string;
  difficulty: ExerciseDifficulty;
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
