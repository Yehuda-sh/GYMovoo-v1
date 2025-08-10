/**
 * @file trx.ts
 * @description תרגילי TRX
 * TRX exercises
 */

import { Exercise } from "./types";

export const trxExercises: Exercise[] = [
  {
    id: "trx_pushup_1",
    name: "שכיבת סמיכה TRX",
    nameLocalized: {
      he: "שכיבת סמיכה TRX",
      en: "TRX Push-Up",
    },
    category: "strength",
    primaryMuscles: ["chest", "shoulders", "triceps"],
    secondaryMuscles: ["core"],
    equipment: "trx",
    difficulty: "intermediate",
    instructions: {
      he: [
        "אחז ברצועות TRX ופנה הרחק מנקודת העיגון",
        "הסתמך קדימה עם ידיים מתוחות",
        "הורד את החזה לעבר הידיים",
        "דחף חזרה למצב התחלה",
      ],
      en: [
        "Hold TRX straps facing away from anchor point",
        "Lean forward with arms extended",
        "Lower chest toward hands",
        "Push back to starting position",
      ],
    },
    tips: {
      he: [
        "ככל שתתרחק יותר, התרגיל יהיה קשה יותר",
        "שמור על גב ישר",
        "שלוט בירידה",
      ],
      en: [
        "The further you step out, the harder the exercise",
        "Keep back straight",
        "Control the descent",
      ],
    },
    safetyNotes: {
      he: [
        "ודא שה-TRX מעוגן היטב",
        "התחל במצב קרוב (קל יותר)",
        "שמור על שליטה בתנועה",
      ],
      en: [
        "Ensure TRX is securely anchored",
        "Start in close position (easier)",
        "Maintain control of movement",
      ],
    },
    media: {
      image: "/images/trx_pushup.jpg",
      video: "/videos/trx_pushup.mp4",
      thumbnail: "/images/trx_pushup_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "silent",
  },
  {
    id: "trx_row_1",
    name: "חתירה TRX",
    nameLocalized: {
      he: "חתירה TRX",
      en: "TRX Row",
    },
    category: "strength",
    primaryMuscles: ["back", "biceps"],
    secondaryMuscles: ["core", "shoulders"],
    equipment: "trx",
    difficulty: "beginner",
    instructions: {
      he: [
        "אחז ברצועות TRX ופנה לכיוון נקודת העיגון",
        "הסתמך אחורה עם ידיים מתוחות",
        "משוך את החזה לכיוון הידיים",
        "חזור למצב התחלה בשליטה",
      ],
      en: [
        "Hold TRX straps facing anchor point",
        "Lean back with arms extended",
        "Pull chest toward hands",
        "Return to start position controlled",
      ],
    },
    tips: {
      he: [
        "שמור על מרפקים צמודים לגוף",
        "עבוד עם הכתפיים למטה",
        "חזק את הליבה",
      ],
      en: [
        "Keep elbows close to body",
        "Work with shoulders down",
        "Engage the core",
      ],
    },
    safetyNotes: {
      he: ["שמור על גב ישר", "אל תתן לכתפיים להתקדם", "שלוט בתנועה"],
      en: [
        "Keep back straight",
        "Don't let shoulders roll forward",
        "Control the movement",
      ],
    },
    media: {
      image: "/images/trx_row.jpg",
      video: "/videos/trx_row.mp4",
      thumbnail: "/images/trx_row_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "silent",
  },
  {
    id: "trx_squat_1",
    name: "כפיפה TRX",
    nameLocalized: {
      he: "כפיפה TRX",
      en: "TRX Squat",
    },
    category: "strength",
    primaryMuscles: ["quadriceps", "glutes"],
    secondaryMuscles: ["core", "calves"],
    equipment: "trx",
    difficulty: "beginner",
    instructions: {
      he: [
        "אחז ברצועות TRX ופנה לכיוון נקודת העיגון",
        "עמוד עם רגליים ברוחב הכתפיים",
        "רד לכפיפה תוך שמירה על גב ישר",
        "עלה חזרה לעמדת התחלה",
      ],
      en: [
        "Hold TRX straps facing anchor point",
        "Stand with feet shoulder-width apart",
        "Lower into squat maintaining straight back",
        "Rise back to starting position",
      ],
    },
    tips: {
      he: [
        "השתמש ב-TRX לאיזון, לא לעזרה",
        "שמור על משקל על העקבים",
        "רד עמוק ככל שאפשר",
      ],
      en: [
        "Use TRX for balance, not assistance",
        "Keep weight on heels",
        "Descend as deep as possible",
      ],
    },
    safetyNotes: {
      he: ["אל תמשוך חזק מדי ב-TRX", "שמור על ברכיים ביישור", "עבוד בטווח נוח"],
      en: [
        "Don't pull too hard on TRX",
        "Keep knees in alignment",
        "Work in comfortable range",
      ],
    },
    media: {
      image: "/images/trx_squat.jpg",
      video: "/videos/trx_squat.mp4",
      thumbnail: "/images/trx_squat_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "small",
    noiseLevel: "silent",
  },
  {
    id: "trx_mountain_climber_1",
    name: "מטפס הרים TRX",
    nameLocalized: {
      he: "מטפס הרים TRX",
      en: "TRX Mountain Climber",
    },
    category: "cardio",
    primaryMuscles: ["core"],
    secondaryMuscles: ["shoulders", "quadriceps"],
    equipment: "trx",
    difficulty: "intermediate",
    instructions: {
      he: [
        "הכנס את כפות הרגליים לתוך רצועות ה-TRX",
        "תגיע למצב פלאנק עם ידיים על הרצפה",
        "החלף ברגליים בתנועה של ריצה במקום",
        "שמור על קצב מהיר וקבוע",
      ],
      en: [
        "Insert feet into TRX straps",
        "Get into plank position with hands on floor",
        "Alternate legs in running motion",
        "Maintain fast, steady pace",
      ],
    },
    tips: {
      he: ["שמור על ליבה חזקה", "אל תתן לירכיים לעלות", "נשימה קבועה"],
      en: ["Keep core strong", "Don't let hips rise", "Steady breathing"],
    },
    safetyNotes: {
      he: [
        "התחל לאט והאץ בהדרגה",
        "שמור על יציבות כתפיים",
        "עצור אם מאבד שליטה",
      ],
      en: [
        "Start slow and gradually increase speed",
        "Maintain shoulder stability",
        "Stop if losing control",
      ],
    },
    media: {
      image: "/images/trx_mountain_climber.jpg",
      video: "/videos/trx_mountain_climber.mp4",
      thumbnail: "/images/trx_mountain_climber_thumb.jpg",
    },
    homeCompatible: true,
    gymPreferred: false,
    outdoorSuitable: true,
    spaceRequired: "medium",
    noiseLevel: "quiet",
  },
];
