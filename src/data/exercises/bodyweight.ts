/**
 * @file bodyweight.ts
 * @description תרגילי משקל גוף
 * Bodyweight exercises
 */

import { Exercise } from "./types";

export const bodyweightExercises: Exercise[] = [
  {
    id: "push_up_1",
    name: "שכיבת סמיכה בסיסית",
    nameLocalized: {
      he: "שכיבת סמיכה בסיסית",
      en: "Basic Push-Up",
    },
    category: "strength",
    primaryMuscles: ["chest", "shoulders", "triceps"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "השתטח על הבטן עם כפות הידיים על הרצפה ברוחב הכתפיים",
        "שמור על קו ישר מהראש עד הכעבים",
        "הורד את החזה לעבר הרצפה עד שהמרפקים ב-90 מעלות",
        "דחף חזרה למעלה לעמדת ההתחלה בכוח",
      ],
      en: [
        "Lie face down with palms on floor shoulder-width apart",
        "Maintain straight line from head to heels",
        "Lower chest toward floor until elbows at 90 degrees",
        "Push back up to starting position with force",
      ],
    },
    tips: {
      he: [
        "שמור על שרירי הליבה מתוחים כל הזמן",
        "נשם פנימה בירידה, החוצה בעלייה",
        "אל תתן לירכיים לרדת או להתרומם",
        "התחל על הברכיים אם קשה מדי",
      ],
      en: [
        "Keep core muscles tight throughout",
        "Breathe in going down, out going up",
        "Don't let hips sag or pike up",
        "Start on knees if too difficult",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם מרגיש כאב בכתפיים",
        "אל תכופף את פרקי הידיים יותר מדי",
        "התחל עם מעט חזרות והגדל בהדרגה",
      ],
      en: [
        "Stop if you feel shoulder pain",
        "Don't overextend wrists",
        "Start with few reps and progress gradually",
      ],
    },
    media: {
      image: "exercises/push_up_basic.jpg",
      video: "exercises/push_up_basic.mp4",
      thumbnail: "exercises/push_up_basic_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },

  {
    id: "squat_bodyweight_1",
    name: "כיפופי ברכיים",
    nameLocalized: {
      he: "כיפופי ברכיים עם משקל גוף",
      en: "Bodyweight Squat",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "עמוד עם הרגליים ברוחב הכתפיים",
        "הושט ידיים קדימה לאיזון",
        "הורד את הירכיים אחורה ומטה כמו יושב על כיסא",
        "רד עד שהירכיים במקביל לרצפה",
        "דחף דרך העקבים לחזור למעלה",
      ],
      en: [
        "Stand with feet shoulder-width apart",
        "Extend arms forward for balance",
        "Lower hips back and down like sitting in chair",
        "Descend until thighs parallel to floor",
        "Drive through heels to return up",
      ],
    },
    tips: {
      he: [
        "שמור על החזה פתוח והגב ישר",
        "הברכיים צריכות לעקוב אחר כיוון האצבעות",
        "התמקד בהפעלת הישבן",
        "התחל עם עומק קטן והגדל בהדרגה",
      ],
      en: [
        "Keep chest up and back straight",
        "Knees should track over toes",
        "Focus on engaging glutes",
        "Start shallow and increase depth gradually",
      ],
    },
    safetyNotes: {
      he: [
        "אל תתן לברכיים ליפול פנימה",
        "הפסק אם כואב בברכיים או גב",
        "אל תרד מהר מדי",
      ],
      en: [
        "Don't let knees collapse inward",
        "Stop if knees or back hurt",
        "Don't descend too quickly",
      ],
    },
    media: {
      image: "exercises/squat_bodyweight.jpg",
      video: "exercises/squat_bodyweight.mp4",
      thumbnail: "exercises/squat_bodyweight_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },

  {
    id: "plank_1",
    name: "פלאנק",
    nameLocalized: {
      he: "פלאנק סטנדרטי",
      en: "Standard Plank",
    },
    category: "core",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "back"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "התחל בעמדת שכיבת סמיכה ורד על המרפקים",
        "שמור על קו ישר מהראש עד הכעבים",
        "הפעל את שרירי הליבה וחזק אותם",
        "החזק את העמדה למשך הזמן הנדרש",
        "נשם באופן קבוע",
      ],
      en: [
        "Start in push-up position and lower to forearms",
        "Maintain straight line from head to heels",
        "Engage and tighten core muscles",
        "Hold position for required duration",
        "Breathe regularly throughout",
      ],
    },
    tips: {
      he: [
        "נשם באופן קבוע, אל תעצור את הנשימה",
        "התמקד בהפעלת שרירי הבטן העמוקים",
        "שמור על הצוואר במצב נייטרלי",
        "אל תתן לירכיים לרדת",
      ],
      en: [
        "Breathe regularly, don't hold breath",
        "Focus on deep abdominal muscles",
        "Keep neck in neutral position",
        "Don't let hips drop",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם מרגיש כאב בגב תחתון",
        "התחל עם זמנים קצרים",
        "אל תתרומם יותר מדי גבוה",
      ],
      en: [
        "Stop if you feel lower back pain",
        "Start with shorter durations",
        "Don't raise hips too high",
      ],
    },
    media: {
      image: "exercises/plank_standard.jpg",
      video: "exercises/plank_standard.mp4",
      thumbnail: "exercises/plank_standard_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "minimal",
    noiseLevel: "silent",
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

  {
    id: "lunges_1",
    name: "צעידות",
    nameLocalized: {
      he: "צעידות (לנג'ס)",
      en: "Lunges",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "calves", "core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "עמוד זקוף עם רגליים ברוחב ירכיים",
        "צעד קדימה עם רגל אחת",
        "הורד את הגוף עד שהברך האחורית כמעט נוגעת ברצפה",
        "דחף חזרה למעלה לעמדת ההתחלה",
        "חזור עם הרגל השנייה",
      ],
      en: [
        "Stand upright with feet hip-width apart",
        "Step forward with one leg",
        "Lower body until back knee nearly touches floor",
        "Push back up to starting position",
        "Repeat with other leg",
      ],
    },
    tips: {
      he: [
        "שמור על הגוף זקוף",
        "הברך הקדמית צריכה להיות מעל הקרסול",
        "התמקד על האיזון",
        "התחל עם צעדים קטנים",
      ],
      en: [
        "Keep torso upright",
        "Front knee should be over ankle",
        "Focus on balance",
        "Start with smaller steps",
      ],
    },
    safetyNotes: {
      he: [
        "אל תתן לברך הקדמית לחרוג מעל האצבעות",
        "הפסק אם כואב בברכיים",
        "התחל עם גרסה נייחת",
      ],
      en: [
        "Don't let front knee go past toes",
        "Stop if knees hurt",
        "Start with stationary version",
      ],
    },
    media: {
      image: "exercises/lunges.jpg",
      video: "exercises/lunges.mp4",
      thumbnail: "exercises/lunges_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "quiet",
  },

  {
    id: "wall_sit_1",
    name: "ישיבה על קיר",
    nameLocalized: {
      he: "ישיבה על קיר",
      en: "Wall Sit",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["core"],
    equipment: "none",
    difficulty: "beginner",
    instructions: {
      he: [
        "עמוד עם הגב לקיר",
        "החלק את הגב למטה לאורך הקיר",
        "רד עד שהירכיים במקביל לרצפה",
        "שמור על הברכיים בזווית 90 מעלות",
        "החזק את העמדה",
      ],
      en: [
        "Stand with back against wall",
        "Slide back down along wall",
        "Lower until thighs parallel to floor",
        "Keep knees at 90 degree angle",
        "Hold position",
      ],
    },
    tips: {
      he: [
        "התחל עם זמנים קצרים",
        "שמור על הגב צמוד לקיר",
        "נשם באופן קבוע",
        "התמקד על שרירי הרגליים",
      ],
      en: [
        "Start with short durations",
        "Keep back flat against wall",
        "Breathe regularly",
        "Focus on leg muscles",
      ],
    },
    safetyNotes: {
      he: [
        "הפסק אם כואב בברכיים",
        "אל תרד מתחת ל-90 מעלות",
        "התחל עם 15-30 שניות",
      ],
      en: [
        "Stop if knees hurt",
        "Don't go below 90 degrees",
        "Start with 15-30 seconds",
      ],
    },
    media: {
      image: "exercises/wall_sit.jpg",
      video: "exercises/wall_sit.mp4",
      thumbnail: "exercises/wall_sit_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: false,
    spaceRequired: "minimal",
    noiseLevel: "silent",
  },
];
