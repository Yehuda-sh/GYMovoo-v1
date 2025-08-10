/**
 * @file water_weights.ts
 * @description תרגילים עם משקולות מים/חול/בקבוקים
 * Water/sand weights exercises
 */

import { Exercise } from "./types";

export const waterWeightExercises: Exercise[] = [
  {
    id: "water_bottle_bicep_curl_1",
    name: "כיפוף זרוע עם בקבוק מים",
    nameLocalized: {
      he: "כיפוף זרוע עם בקבוק מים",
      en: "Water Bottle Bicep Curl",
    },
    category: "strength",
    primaryMuscles: ["biceps"],
    secondaryMuscles: ["forearms"],
    equipment: "water_bottles",
    difficulty: "beginner",
    instructions: {
      he: [
        "אחז בבקבוק מים בכל יד",
        "עמוד זקוף עם מרפקים צמודים לגוף",
        "כופף את הזרועות ועלה עם הבקבוקים",
        "הורד בשליטה למצב התחלה",
      ],
      en: [
        "Hold water bottle in each hand",
        "Stand upright with elbows close to body",
        "Bend arms and raise bottles",
        "Lower controlled to start position",
      ],
    },
    tips: {
      he: [
        "התחל עם בקבוקים של 0.5 ליטר",
        "עבוד לאט ובשליטה",
        "שמור על מרפקים יציבים",
        "אפשר להגדיל לבקבוקי 1.5 ליטר",
      ],
      en: [
        "Start with 0.5 liter bottles",
        "Work slow and controlled",
        "Keep elbows stable",
        "Can progress to 1.5 liter bottles",
      ],
    },
    safetyNotes: {
      he: ["ודא שהבקבוקים סגורים היטב", "התחל עם משקל קל", "אל תתן לגב להתעקם"],
      en: [
        "Ensure bottles are tightly closed",
        "Start with light weight",
        "Don't let back arch",
      ],
    },
    media: {
      image: "/images/water_bottle_curl.jpg",
      video: "/videos/water_bottle_curl.mp4",
      thumbnail: "/images/water_bottle_curl_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
  {
    id: "sandbag_carry_1",
    name: "נשיאת שק חול",
    nameLocalized: {
      he: "נשיאת שק חול",
      en: "Sandbag Carry",
    },
    category: "strength",
    primaryMuscles: ["back", "core", "quadriceps"],
    secondaryMuscles: ["shoulders", "forearms"],
    equipment: "sandbag",
    difficulty: "intermediate",
    instructions: {
      he: [
        "הרם שק חול לחזה או לכתף",
        "עמוד זקוף ועבור למרחק קצוב",
        "שמור על גב ישר ולב מוצק",
        "החלף כתפיים במידת הצורך",
      ],
      en: [
        "Lift sandbag to chest or shoulder",
        "Stand upright and walk measured distance",
        "Keep back straight and core tight",
        "Switch shoulders as needed",
      ],
    },
    tips: {
      he: [
        "התחל עם שק קל (10-15 ק''ג)",
        "קח צעדים קטנים ויציבים",
        "נשום בקצב",
        "עצור אם איבדת שליטה",
      ],
      en: [
        "Start with light bag (10-15 kg)",
        "Take small, stable steps",
        "Breathe rhythmically",
        "Stop if losing control",
      ],
    },
    safetyNotes: {
      he: [
        "שק חול יכול להיות לא יציב",
        "ודא שהשק סגור היטב",
        "עבוד על משטח יציב",
        "אל תרים יותר מהיכולת",
      ],
      en: [
        "Sandbag can be unstable",
        "Ensure bag is well closed",
        "Work on stable surface",
        "Don't lift more than capable",
      ],
    },
    media: {
      image: "/images/sandbag_carry.jpg",
      video: "/videos/sandbag_carry.mp4",
      thumbnail: "/images/sandbag_carry_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "large",
    noiseLevel: "quiet",
  },
  {
    id: "gallon_jug_press_1",
    name: "לחיצה עם גלון מים",
    nameLocalized: {
      he: "לחיצה עם גלון מים",
      en: "Gallon Jug Press",
    },
    category: "strength",
    primaryMuscles: ["shoulders", "triceps"],
    secondaryMuscles: ["core"],
    equipment: "water_gallon",
    difficulty: "intermediate",
    instructions: {
      he: [
        "אחז בגלון מים (4-5 ליטר) בשתי ידיים",
        "החזק על החזה ואז לחץ מעלה",
        "הורד בשליטה לחזה",
        "חזור על התנועה",
      ],
      en: [
        "Hold water gallon (4-5 liters) with both hands",
        "Hold at chest then press overhead",
        "Lower controlled to chest",
        "Repeat movement",
      ],
    },
    tips: {
      he: [
        "תרגיל מאתגר - גלון מלא שוקל כ-5 ק''ג",
        "עבוד לאט בהתחלה",
        "שמור על איזון",
        "אפשר להתחיל עם חצי גלון",
      ],
      en: [
        "Challenging exercise - full gallon weighs ~5kg",
        "Work slowly at first",
        "Maintain balance",
        "Can start with half gallon",
      ],
    },
    safetyNotes: {
      he: [
        "אחיזה יכולה להיות לא נוחה",
        "שמור על שליטה",
        "אל תלחץ מעל הראש אם יש בעיות כתף",
        "ודא שהמכסה חזק",
      ],
      en: [
        "Grip can be uncomfortable",
        "Maintain control",
        "Don't press overhead if shoulder problems",
        "Ensure cap is tight",
      ],
    },
    media: {
      image: "/images/gallon_press.jpg",
      video: "/videos/gallon_press.mp4",
      thumbnail: "/images/gallon_press_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
  {
    id: "tire_flip_1",
    name: "הפיכת צמיג",
    nameLocalized: {
      he: "הפיכת צמיג",
      en: "Tire Flip",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes", "back"],
    secondaryMuscles: ["shoulders", "core"],
    equipment: "tire",
    difficulty: "advanced",
    instructions: {
      he: [
        "עמוד מול צמיג גדול",
        "הכנס אצבעות מתחת לצמיג עם כפיפת ברכיים",
        "הרם בכוח הרגליים והגב",
        "דחף את הצמיג להתהפכות",
        "חזור על התהליך",
      ],
      en: [
        "Stand facing large tire",
        "Insert fingers under tire with knee bend",
        "Lift with leg and back power",
        "Push tire to flip over",
        "Repeat process",
      ],
    },
    tips: {
      he: [
        "תרגיל מאוד מתקדם",
        "התחל עם צמיג קטן",
        "עבוד עם שותף לבטיחות",
        "השתמש בכל הגוף",
      ],
      en: [
        "Very advanced exercise",
        "Start with small tire",
        "Work with partner for safety",
        "Use whole body",
      ],
    },
    safetyNotes: {
      he: [
        "סכנת פציעה גבוהה",
        "דרוש מקום פתוח",
        "ודא שהצמיג תקין",
        "לא מתאים למתחילים",
      ],
      en: [
        "High injury risk",
        "Requires open space",
        "Ensure tire is intact",
        "Not suitable for beginners",
      ],
    },
    media: {
      image: "/images/tire_flip.jpg",
      video: "/videos/tire_flip.mp4",
      thumbnail: "/images/tire_flip_thumb.jpg",
    },
    homeCompatible: false,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "large",
    noiseLevel: "loud",
  },
];
