/**
 * @file resistanceBands.ts
 * @description תרגילי גומי התנגדות
 * Resistance band exercises
 */

import { Exercise } from "./types";

export const resistanceBandExercises: Exercise[] = [
  {
    id: "resistance_band_row_1",
    name: "משיכה עם גומי התנגדות",
    nameLocalized: {
      he: "משיכה עם גומי התנגדות",
      en: "Resistance Band Row",
    },
    category: "strength",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps", "shoulders"],
    equipment: "resistance_bands",
    difficulty: "beginner",
    instructions: {
      he: [
        "עגן את גומי ההתנגדות לנקודה יציבה בגובה החזה",
        "עמוד עם רגליים מעט כפופות לייצב",
        "אחוז בקצות הגומי ומשוך לעבר הבטן",
        "חזור בשליטה לעמדת ההתחלה",
      ],
      en: [
        "Anchor resistance band to stable point at chest height",
        "Stand with knees slightly bent for stability",
        "Grip band ends and pull toward abdomen",
        "Return with control to starting position",
      ],
    },
    tips: {
      he: [
        "שמור על הכתפיים למטה ואחורה",
        "שליטה מלאה בתנועת החזרה",
        "הפעל את שרירי הגב, לא הזרועות",
      ],
      en: [
        "Keep shoulders down and back",
        "Full control on return movement",
        "Use back muscles, not just arms",
      ],
    },
    safetyNotes: {
      he: ["בדוק שהגומי לא קרוע", "ודא עיגון יציב", "אל תשחרר פתאום"],
      en: [
        "Check band isn't torn",
        "Ensure stable anchoring",
        "Don't release suddenly",
      ],
    },
    media: {
      image: "exercises/resistance_band_row.jpg",
      video: "exercises/resistance_band_row.mp4",
      thumbnail: "exercises/resistance_band_row_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "silent",
  },

  {
    id: "resistance_band_squat_1",
    name: "כיפופי ברכיים עם גומי התנגדות",
    nameLocalized: {
      he: "כיפופי ברכיים עם גומי התנגדות",
      en: "Resistance Band Squat",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "resistance_bands",
    difficulty: "beginner",
    instructions: {
      he: [
        "עמוד על הגומי עם רגליים ברוחב כתפיים",
        "אחוז בקצות הגומי בגובה כתפיים",
        "רד לכיפוף ברכיים בזמן שמחזיק התנגדות",
        "עלה חזרה למעלה נגד התנגדות הגומי",
      ],
      en: [
        "Stand on band with feet shoulder-width apart",
        "Hold band ends at shoulder height",
        "Squat down while maintaining resistance",
        "Rise back up against band resistance",
      ],
    },
    tips: {
      he: [
        "שמור על מתח קבוע בגומי",
        "ברכיים עוקבות אחר אצבעות הרגליים",
        "גב ישר ואל תרכין קדימה",
      ],
      en: [
        "Maintain constant tension in band",
        "Knees track over toes",
        "Keep back straight, don't lean forward",
      ],
    },
    safetyNotes: {
      he: [
        "ודא שהגומי לא יחליק מתחת לרגליים",
        "בדוק איכות הגומי לפני שימוש",
        "התחל עם התנגדות קלה",
      ],
      en: [
        "Ensure band won't slip under feet",
        "Check band quality before use",
        "Start with light resistance",
      ],
    },
    media: {
      image: "exercises/resistance_band_squat.jpg",
      video: "exercises/resistance_band_squat.mp4",
      thumbnail: "exercises/resistance_band_squat_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
];
