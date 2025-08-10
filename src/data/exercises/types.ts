/**
 * @file exercises/types.ts
 * @description טיפוסים משותפים לתרגילים
 * Shared types for exercises
 */

import {
  ExerciseCategory,
  ExerciseDifficulty,
  MuscleGroup,
} from "../../constants/exercise";

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

  // ✅ מטאדאטה להתאמה אישית לפי הנתונים האישיים החדשים בשאלון
  personalAdaptation?: {
    // התאמה לגיל - תרגילים שמתאימים לטווחי גיל מסוימים
    ageRecommendations?: {
      minAge?: number; // גיל מינימלי מומלץ
      maxAge?: number; // גיל מקסימלי מומלץ
      notes?: {
        he: string;
        en: string;
      };
    };

    // התאמה למין - אם יש שיקולים ספציפיים
    genderConsiderations?: {
      male?: {
        recommended: boolean;
        modifications?: string; // התאמות מומלצות
      };
      female?: {
        recommended: boolean;
        modifications?: string; // התאמות מומלצות
      };
    };

    // התאמה למשקל - עומס מומלץ או שיקולים מיוחדים
    weightConsiderations?: {
      lightWeight?: {
        modifications?: string; // התאמות לאנשים קלים יותר
        intensityAdjustment?: "decrease" | "maintain" | "increase";
      };
      heavyWeight?: {
        modifications?: string; // התאמות לאנשים כבדים יותר
        intensityAdjustment?: "decrease" | "maintain" | "increase";
      };
    };

    // התאמה לגובה - שיקולים אנטומיים
    heightConsiderations?: {
      short?: {
        modifications?: string; // התאמות לאנשים נמוכים
        equipmentAdjustments?: string; // התאמות ציוד
      };
      tall?: {
        modifications?: string; // התאמות לאנשים גבוהים
        equipmentAdjustments?: string; // התאמות ציוד
      };
    };
  };
}
