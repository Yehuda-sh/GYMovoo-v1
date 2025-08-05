/**
 * @file dumbbells.ts
 * @description תרגילי משקולות
 * Dumbbell exercises
 */

import { Exercise } from "./types";

export const dumbbellExercises: Exercise[] = [
  {
    id: "dumbbell_chest_press_1",
    name: "דחיפת חזה עם משקולות",
    nameLocalized: {
      he: "דחיפת חזה עם משקולות",
      en: "Dumbbell Chest Press",
    },
    category: "strength",
    primaryMuscles: ["chest"],
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: {
      he: [
        "שכב על הגב עם משקולות בשתי הידיים",
        "התחל עם המשקולות בגובה החזה, מרפקים כפופים",
        "דחף את המשקולות כלפי מעלה עד זרועות ישרות",
        "הורד בשליטה חזרה לעמדת ההתחלה",
      ],
      en: [
        "Lie on back with dumbbells in both hands",
        "Start with dumbbells at chest level, elbows bent",
        "Press dumbbells up until arms are straight",
        "Lower with control back to starting position",
      ],
    },
    tips: {
      he: [
        "אל תנעל את המרפקים בחלק העליון",
        "שמור על שליטה מלאה בירידה",
        "המשקולות צריכות לנוע במסלול ישר",
      ],
      en: [
        "Don't lock elbows at the top",
        "Maintain full control on the descent",
        "Dumbbells should move in straight path",
      ],
    },
    safetyNotes: {
      he: [
        "השתמש במשקולות מתאימות לרמתך",
        "ודא יציבות לפני תחילת התרגיל",
        "בקש עזרה אם המשקל כבד",
      ],
      en: [
        "Use appropriate weight for your level",
        "Ensure stability before starting",
        "Ask for help if weight is heavy",
      ],
    },
    media: {
      image: "exercises/dumbbell_chest_press.jpg",
      video: "exercises/dumbbell_chest_press.mp4",
      thumbnail: "exercises/dumbbell_chest_press_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "medium",
    noiseLevel: "quiet",
  },

  {
    id: "dumbbell_squat_1",
    name: "כיפופי ברכיים עם משקולות",
    nameLocalized: {
      he: "כיפופי ברכיים עם משקולות",
      en: "Dumbbell Squat",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["hamstrings", "core"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: {
      he: [
        "החזק משקולת בכל יד בצדי הגוף",
        "עמוד עם רגליים ברוחב כתפיים",
        "רד לכיפוף ברכיים כמו יושב על כיסא",
        "עלה בכוח דרך העקבים חזרה למעלה",
      ],
      en: [
        "Hold one dumbbell in each hand at sides",
        "Stand with feet shoulder-width apart",
        "Squat down like sitting in a chair",
        "Drive up through heels back to standing",
      ],
    },
    tips: {
      he: [
        "שמור על הגב ישר והחזה פתוח",
        "רוב המשקל על העקבים",
        "המשקולות נשארות בצדי הגוף",
      ],
      en: [
        "Keep back straight and chest up",
        "Most weight should be on heels",
        "Dumbbells stay at sides of body",
      ],
    },
    safetyNotes: {
      he: [
        "התחל עם משקולות קלות",
        "הפסק אם כואב בגב או ברכיים",
        "ודא אחיזה יציבה של המשקולות",
      ],
      en: [
        "Start with light dumbbells",
        "Stop if back or knees hurt",
        "Ensure secure grip on dumbbells",
      ],
    },
    media: {
      image: "exercises/dumbbell_squat.jpg",
      video: "exercises/dumbbell_squat.mp4",
      thumbnail: "exercises/dumbbell_squat_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "small",
    noiseLevel: "quiet",
  },

  {
    id: "dumbbell_row_1",
    name: "חתירה עם משקולת",
    nameLocalized: {
      he: "חתירה עם משקולת אחת",
      en: "Single Dumbbell Row",
    },
    category: "strength",
    primaryMuscles: ["back"],
    secondaryMuscles: ["biceps", "shoulders"],
    equipment: "dumbbells",
    difficulty: "intermediate",
    instructions: {
      he: [
        "העמד רגל אחת על ספסל או משטח גבוה",
        "החזק משקולת ביד הנגדית",
        "השען עם היד החופשית על הספסל",
        "משוך את המשקולת לעבר הבטן",
      ],
      en: [
        "Place one foot on bench or elevated surface",
        "Hold dumbbell in opposite hand",
        "Support with free hand on bench",
        "Pull dumbbell toward abdomen",
      ],
    },
    tips: {
      he: [
        "שמור על הגב ישר לאורך התנועה",
        "משוך עם שרירי הגב, לא הזרוע",
        "הרגש את הכתף נסחבת אחורה",
      ],
      en: [
        "Keep back straight throughout movement",
        "Pull with back muscles, not arm",
        "Feel shoulder blade pulling back",
      ],
    },
    safetyNotes: {
      he: [
        "וודא יציבות לפני תחילה",
        "התחל עם משקל קל",
        "הפסק אם כואב בגב תחתון",
      ],
      en: [
        "Ensure stability before starting",
        "Start with light weight",
        "Stop if lower back hurts",
      ],
    },
    media: {
      image: "exercises/dumbbell_row.jpg",
      video: "exercises/dumbbell_row.mp4",
      thumbnail: "exercises/dumbbell_row_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: true,
    outdoorSuitable: false,
    spaceRequired: "medium",
    noiseLevel: "quiet",
  },
];
