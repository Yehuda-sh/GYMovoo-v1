/**
 * @file cardio.ts
 * @description תרגילי קרדיו
 * Cardio exercises
 */

import { Exercise } from "./types";

export const cardioExercises: Exercise[] = [
  {
    id: "jumping_jacks_1",
    name: "קפיצות פתיחה",
    nameLocalized: {
      he: "קפיצות פתיחה וסגירה",
      en: "Jumping Jacks",
    },
    category: "cardio",
    primaryMuscles: ["legs"],
    secondaryMuscles: ["shoulders", "core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "עמוד זקוף עם רגליים צמודות וידיים בצדי הגוף",
        "קפוץ ופתח את הרגליים ברוחב הכתפיים",
        "בו זמנית הרם את הידיים מעל הראש",
        "קפוץ שוב וחזור לעמדת ההתחלה",
      ],
      en: [
        "Stand upright with feet together and arms at sides",
        "Jump and spread feet to shoulder-width apart",
        "Simultaneously raise arms overhead",
        "Jump again and return to starting position",
      ],
    },
    tips: {
      he: [
        "שמור על קצב קבוע ומתמיד",
        "נחיתה רכה על כרית כף הרגל",
        "שמור על הליבה מתוחה",
      ],
      en: [
        "Maintain steady, consistent pace",
        "Land softly on balls of feet",
        "Keep core engaged",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם מרגיש כאב בברכיים",
        "התחל לאט והגדל עצימות",
        "ודא משטח יציב",
      ],
      en: [
        "Stop if you feel knee pain",
        "Start slow and increase intensity",
        "Ensure stable surface",
      ],
    },
    media: {
      image: "exercises/jumping_jacks.jpg",
      video: "exercises/jumping_jacks.mp4",
      thumbnail: "exercises/jumping_jacks_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },

  {
    id: "burpee_1",
    name: "ברפי",
    nameLocalized: {
      he: "ברפי מלא",
      en: "Full Burpee",
    },
    category: "cardio",
    primaryMuscles: ["full_body"],
    secondaryMuscles: ["core", "shoulders"],
    equipment: "none",
    difficulty: "advanced",
    instructions: {
      he: [
        "עמוד זקוף עם רגליים ברוחב כתפיים",
        "רד לכיפוף ברכיים ושים את הידיים על הרצפה",
        "קפוץ עם הרגליים אחורה לעמדת פלאנק",
        "בצע שכיבת סמיכה אחת",
        "קפוץ עם הרגליים קדימה לכיפוף ברכיים",
        "קפוץ למעלה עם הידיים מעל הראש",
      ],
      en: [
        "Stand upright with feet shoulder-width apart",
        "Squat down and place hands on floor",
        "Jump feet back into plank position",
        "Perform one push-up",
        "Jump feet forward back to squat",
        "Jump up with arms overhead",
      ],
    },
    tips: {
      he: [
        "התחל לאט ובצע בטכניקה נכונה",
        "נשים לאורך כל התרגיל",
        "אם קשה - בצע ללא קפיצה בסוף",
      ],
      en: [
        "Start slow with proper technique",
        "Breathe throughout entire exercise",
        "If difficult - skip final jump",
      ],
    },
    safetyNotes: {
      he: [
        "תרגיל מתקדם - התחל עם גרסה מקלה",
        "הפסק אם מרגיש סחרחורת",
        "ודא משטח לא חלק",
      ],
      en: [
        "Advanced exercise - start with easier version",
        "Stop if feeling dizzy",
        "Ensure non-slip surface",
      ],
    },
    media: {
      image: "exercises/burpee_full.jpg",
      video: "exercises/burpee_full.mp4",
      thumbnail: "exercises/burpee_full_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "loud",
  },

  {
    id: "mountain_climbers_1",
    name: "מטפסי הרים",
    nameLocalized: {
      he: "מטפסי הרים",
      en: "Mountain Climbers",
    },
    category: "cardio",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "legs"],
    equipment: "none",
    difficulty: "intermediate",
    instructions: {
      he: [
        "התחל בעמדת פלאנק עם זרועות ישרות",
        "מעלה ברך אחת לעבר החזה",
        "החלף רגליים במהירות",
        "המשך לחליפה במקצב מהיר",
      ],
      en: [
        "Start in plank position with straight arms",
        "Bring one knee toward chest",
        "Switch legs quickly",
        "Continue alternating at fast pace",
      ],
    },
    tips: {
      he: ["שמור על ירכיים יציבות", "אל תתן לישבן להתרומם", "נשם באופן קבוע"],
      en: ["Keep hips stable", "Don't let hips rise up", "Breathe regularly"],
    },
    safetyNotes: {
      he: [
        "התחל לאט והגדל מהירות בהדרגה",
        "הפסק אם כואב בפרקי הידיים",
        "שמור על גב ישר",
      ],
      en: [
        "Start slow and increase speed gradually",
        "Stop if wrists hurt",
        "Keep back straight",
      ],
    },
    media: {
      image: "exercises/mountain_climbers.jpg",
      video: "exercises/mountain_climbers.mp4",
      thumbnail: "exercises/mountain_climbers_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "moderate",
  },
];
